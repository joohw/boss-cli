/**
 * CLI：子命令直接调用 toolset 中的 impl*。
 * 无参数时进入交互模式，逐行解析与 `boss <argv...>` 相同的命令。
 */
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { detachBrowserSession } from '../browser/index.js';
import {
  implLogin,
  implListCandidates,
  implListUnreadCandidates,
  implListPositions,
  implOpenChat,
  implSendMessage,
  implSkill,
  type ChatOpenAction,
  type SendAction,
} from '../toolset/index.js';
import { printBossInteractiveBanner } from './banner.js';

class CliError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CliError';
  }
}

function envTruthy(name: string): boolean {
  const v = (process.env[name] ?? '').trim().toLowerCase();
  return v === '1' || v === 'true' || v === 'yes' || v === 'y';
}

/** 默认有头；仅当环境变量为真时启用无头（与 `connectBrowser` 读取的 `BOSS_BROWSER_HEADLESS` 一致）。 */
function shouldRunHeadless(): boolean {
  return envTruthy('BOSS_BROWSER_HEADLESS');
}

function configureHeadlessForCommand(cmd: string): void {
  if (cmd === 'login') {
    process.env.BOSS_BROWSER_HEADLESS = 'false';
    return;
  }
  process.env.BOSS_BROWSER_HEADLESS = shouldRunHeadless() ? 'true' : 'false';
}

/**
 * 一次性命令结束后：detach CDP，不关浏览器窗口。
 * 交互模式在循环内不调用；退出 REPL 时在 `runInteractiveLoop` 的 finally 里单独 detach（避免 Node 退出时拖死 Chrome）。
 */
async function cleanupAfterCommand(_cmd: string, nonInteractive: boolean): Promise<void> {
  if (!nonInteractive) {
    return;
  }
  await detachBrowserSession().catch(() => {});
}

function die(msg: string): never {
  throw new CliError(msg);
}

/** `readline.question` 在 Ctrl+C 时会抛出 AbortError，视为正常结束而非业务错误 */
export function isReadlineAbortError(e: unknown): boolean {
  if (e === null || typeof e !== 'object') {
    return false;
  }
  const err = e as { name?: string; code?: string };
  return err.name === 'AbortError' || err.code === 'ABORT_ERR';
}

/** 类 shell 分词：支持双引号、单引号包裹含空格的参数 */
function splitShellLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let quote: '"' | "'" | null = null;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (quote) {
      if (c === quote) {
        quote = null;
      } else {
        cur += c;
      }
      continue;
    }
    if (c === '"' || c === "'") {
      quote = c;
      continue;
    }
    if (/\s/.test(c)) {
      if (cur.length > 0) {
        out.push(cur);
        cur = '';
      }
      continue;
    }
    cur += c;
  }
  if (cur.length > 0) {
    out.push(cur);
  }
  return out;
}

/** 短命令为主；保留旧长名作为别名，避免已有脚本失效 */
function normalizeSubcommand(cmd: string): string {
  switch (cmd) {
    case 'list-candidates':
      return 'list';
    case 'open-chat':
      return 'chat';
    case 'send-message':
      return 'send';
    case 'list-positions':
      return 'jd';
    default:
      return cmd;
  }
}

function printHelp(): void {
  console.error(`boss-cli — Boss 直聘浏览器自动化（纯 CLI，无 Agent 运行时）

用法与说明:
  boss
      进入交互模式；提示符 boss> ，exit / quit 退出；Ctrl+C 正常结束
  boss help
      显示本帮助
  boss login
      打开登录页（需要在浏览器中自行完成登录）
  boss list [--unread]
      读取「全部」聊天列表候选人；--unread 仅显示未读（角标>0）
  boss chat <姓名> [--strict] [--action online-resume]
      打开指定联系人会话；默认包含匹配，--strict 为精确匹配
      --action online-resume：额外点击「在线简历」并截图（可选 OCR，见环境变量说明）
  boss send [--text <内容>] [-t <内容>] [--action <操作>]
      --text 与 --action 可同时使用；先发消息再执行 action，中间有默认随机间隔
      --action: request-resume | agree-resume | confuse-resume（confuse-resume=拒绝附件）；须至少 text 或 action 其一
  boss jd
      读取本地 ~/.boss-cli/jd 目录下的岗位 Markdown（Windows 为 %USERPROFILE%\\.boss-cli\\jd）
  boss skill
      仅输出本包 Agent Skill 的说明（不安装）
  boss skill install  |  boss skill uninstall
      安装或移除唯一 Skill（boss-cli）到 ~/.agents/skills/（可用 BOSS_AGENT_SKILLS_DIR 覆盖根目录）
`);
}

/** 解析 `--key value` / `--key=value` / 布尔 `--flag` */
function parseOpts(argv: string[]): {
  rest: string[];
  flags: Set<string>;
  opts: Record<string, string>;
} {
  const rest: string[] = [];
  const flags = new Set<string>();
  const opts: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--') {
      rest.push(...argv.slice(i + 1));
      break;
    }
    if (a.startsWith('--')) {
      const eq = a.indexOf('=');
      if (eq !== -1) {
        const k = a.slice(2, eq);
        opts[k] = a.slice(eq + 1);
        continue;
      }
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith('-')) {
        opts[key] = next;
        i += 1;
      } else {
        flags.add(key);
      }
      continue;
    }
    if (a.startsWith('-') && a.length > 1 && !a.startsWith('--')) {
      const short = a.slice(1);
      const next = argv[i + 1];
      if (short === 't' && next !== undefined && !next.startsWith('-')) {
        opts.t = next;
        i += 1;
        continue;
      }
      if (!/^\d/.test(short)) {
        flags.add(short);
        continue;
      }
    }
    rest.push(a);
  }
  return { rest, flags, opts };
}

function printStdout(text: string): void {
  const t = text.trimEnd();
  if (t.length > 0) {
    console.log(t);
  }
}

/**
 * 执行一条子命令并返回结果（与传入 `process.argv` 切片语义一致，不含 `boss` 本身）。
 */
export async function executeCommand(argv: string[]): Promise<string> {
  if (argv.length === 0) {
    die('❌ 空命令');
  }

  const cmd = normalizeSubcommand(argv[0]);
  const tail = argv.slice(1);
  configureHeadlessForCommand(cmd);

  if (cmd === 'login') {
    return implLogin();
  }

  if (cmd === 'list') {
    const { flags } = parseOpts(tail);
    if (flags.has('unread')) {
      return implListUnreadCandidates();
    }
    return implListCandidates();
  }

  if (cmd === 'chat') {
    const { rest, flags, opts } = parseOpts(tail);
    const nameArg = rest[0]?.trim();
    if (!nameArg) {
      die('❌ 用法: chat <姓名> [--strict] [--action online-resume]');
    }
    // 默认模糊匹配（包含）；仅在指定 --strict 时做精确匹配
    const exact = flags.has('strict');
    const rawChatAction = (opts.action ?? '').trim().toLowerCase();
    const chatActionMap: Record<string, ChatOpenAction> = {
      'online-resume': 'online-resume',
    };
    let chatAction: ChatOpenAction | undefined;
    if (rawChatAction) {
      chatAction = chatActionMap[rawChatAction];
      if (!chatAction) {
        die(`❌ 未知 --action “${rawChatAction}”，可选：online-resume`);
      }
    }
    return implOpenChat(nameArg, exact, chatAction ? { action: chatAction } : undefined);
  }

  if (cmd === 'send') {
    const { opts } = parseOpts(tail);
    const text = opts.text?.trim() || opts.t?.trim() || '';
    const raw = (opts.action ?? '').trim().toLowerCase();
    const actionMap: Record<string, SendAction> = {
      'request-resume': 'request-resume',
      'agree-resume': 'agree-resume',
      'confuse-resume': 'confuse-resume',
    };
    let action: SendAction | undefined;
    if (raw) {
      action = actionMap[raw];
      if (!action) {
        die(`❌ 未知 --action “${raw}”，可选：request-resume | agree-resume | confuse-resume`);
      }
    }
    if (!text && !action) {
      die(
        '❌ 用法: send [--text <消息>] [-t <消息>] [--action request-resume|agree-resume|confuse-resume]（至少其一）',
      );
    }
    return implSendMessage({ text, action });
  }

  if (cmd === 'jd') {
    return implListPositions();
  }

  if (cmd === 'skill') {
    return implSkill(tail);
  }

  die(`❌ 未知命令 “${argv[0]}”。输入 help 查看用法。`);
}

export async function runOneCommand(argv: string[]): Promise<void> {
  if (argv.length === 0) {
    return;
  }
  try {
    const text = await executeCommand(argv);
    printStdout(text);
  } catch (e) {
    console.error(e instanceof Error ? e.message : String(e));
    process.exitCode = 1;
  }
}

async function runInteractiveLoop(): Promise<void> {
  const rl = createInterface({ input, output, terminal: true });
  printBossInteractiveBanner();
  console.error('欢迎使用 boss-cli。输入 help 查看可用命令，exit / quit 退出。\n');
  try {
    for (;;) {
      let line: string;
      try {
        line = await rl.question('boss> ');
      } catch (e) {
        if (isReadlineAbortError(e)) {
          break;
        }
        throw e;
      }
      const trimmed = line.trim();
      if (!trimmed) {
        continue;
      }
      if (/^(exit|quit)$/i.test(trimmed)) {
        break;
      }
      if (/^help$/i.test(trimmed)) {
        printHelp();
        continue;
      }
      const argv = splitShellLine(trimmed);
      try {
        const text = await executeCommand(argv);
        printStdout(text);
      } catch (e) {
        console.error(e instanceof Error ? e.message : e);
      }
    }
  } finally {
    rl.close();
    // 退出交互时进程即将结束，必须 detach + unref 子进程，否则 Chrome 常随 Node 一起退出
    await detachBrowserSession().catch(() => {});
  }
}

export async function runCli(argv: string[]): Promise<void> {
  if (argv.length === 0) {
    await runInteractiveLoop();
    return;
  }

  if (argv[0] === 'help' || argv[0] === '--help' || argv[0] === '-h') {
    printHelp();
    return;
  }

  try {
    await runOneCommand(argv);
  } finally {
    await cleanupAfterCommand(argv[0] ?? '', true);
  }
}
