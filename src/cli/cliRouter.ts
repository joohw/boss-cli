/**
 * CLI：子命令直接调用 toolset 中的 impl*。
 * 无参数时进入交互模式，逐行解析与 `boss <argv...>` 相同的命令。
 */
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { disconnectBrowserSession } from '../browser/index.js';
import { CACHE_DIR } from '../config.js';
import {
  implLogin,
  implListCandidates,
  implListUnreadCandidates,
  implListPositions,
  implOpenChat,
  implSendMessage,
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

function shouldRunHeadful(): boolean {
  return (
    envTruthy('bosscliheadful') ||
    envTruthy('BOSSCLIHEADFUL') ||
    envTruthy('BOSSCLI_HEADFUL') ||
    envTruthy('BOSS_CLI_HEADFUL')
  );
}

function configureHeadlessForCommand(cmd: string): void {
  if (cmd === 'login') {
    // 登录必须可见：方便扫码/人机验证/手动操作
    process.env.BOSS_BROWSER_HEADLESS = 'false';
    return;
  }
  process.env.BOSS_BROWSER_HEADLESS = shouldRunHeadful() ? 'false' : 'true';
}

function shouldAutoCloseBrowser(): boolean {
  return envTruthy('BOSS_BROWSER_AUTO_CLOSE');
}

async function maybeDisconnectBrowserSession(): Promise<void> {
  if (!shouldAutoCloseBrowser()) {
    return;
  }
  await disconnectBrowserSession().catch(() => {});
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

function printHelp(): void {
  console.error(`boss-cli — Boss 直聘浏览器自动化（纯 CLI，无 Agent 运行时）

用法与说明:
  boss
      进入交互模式；提示符 boss> ，exit / quit 退出；Ctrl+C 正常结束
  boss help
      显示本帮助
  boss login
      打开登录页并等待你在浏览器中完成登录
  boss list-candidates
      读取「全部」聊天列表候选人
      --unread 仅显示未读（角标>0）
  boss open-chat <姓名> [--strict]
      打开指定联系人会话；默认包含匹配，--strict 为精确匹配
  boss send-message --text <内容> [--also-request-resume]
      在聊天输入框发送消息；-t 同 --text
  boss list-positions
      读取本地 ~/.boss-cli/jd 目录下的岗位 Markdown（Windows 为 %USERPROFILE%\.boss-cli\jd）

成功时 stdout 为纯文本；业务失败时进程退出码为 1。

数据目录默认：${CACHE_DIR}（浏览器用户数据见环境变量 BOSS_BROWSER_USER_DATA_DIR，未设置时使用其下 browser-data）。
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

  const cmd = argv[0];
  const tail = argv.slice(1);
  configureHeadlessForCommand(cmd);

  if (cmd === 'login') {
    return implLogin();
  }

  if (cmd === 'list-candidates') {
    const { flags } = parseOpts(tail);
    if (flags.has('unread')) {
      return implListUnreadCandidates();
    }
    return implListCandidates();
  }

  if (cmd === 'open-chat') {
    const { rest, flags } = parseOpts(tail);
    const nameArg = rest[0]?.trim();
    if (!nameArg) {
      die('❌ 用法: open-chat <姓名> [--strict]');
    }
    // 默认模糊匹配（包含）；仅在指定 --strict 时做精确匹配
    const exact = flags.has('strict');
    return implOpenChat(nameArg, exact);
  }

  if (cmd === 'send-message') {
    const { opts, flags } = parseOpts(tail);
    const text = opts.text?.trim() || opts.t?.trim() || '';
    const alsoRequestResume =
      flags.has('also-request-resume') ||
      opts['also-request-resume'] === 'true' ||
      opts.alsoRequestResume === 'true';
    if (!text) {
      die('❌ 用法: send-message --text <消息内容> [--also-request-resume]');
    }
    return implSendMessage(text, alsoRequestResume);
  }

  if (cmd === 'list-positions') {
    return implListPositions();
  }

  die(`❌ 未知命令 “${cmd}”。输入 help 查看用法。`);
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
    await maybeDisconnectBrowserSession();
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
    await maybeDisconnectBrowserSession();
  }
}
