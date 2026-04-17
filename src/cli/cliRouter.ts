/**
 * CLI：子命令直接调用 toolset 中的 impl*。
 * 无参数时进入交互模式，逐行解析与 `boss <argv...>` 相同的命令。
 */
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { detachBrowserSession } from '../browser/index.js';
import {
  implChatAction,
  implLogin,
  implListCandidates,
  implListUnreadCandidates,
  implListPositions,
  implListPositionsWithOptions,
  implOpenChat,
  implRecommend,
  implRecommendPreview,
  implRecommendGreet,
  implSendMessage,
  type ChatPageAction,
} from '../toolset/index.js';
import { printBossInteractiveBanner } from './banner.js';
import { printVersionInfo } from './version.js';

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
      return 'positions';
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
  boss version | ver（或 -v / --version）
      显示当前版本并检查 npm 是否有更新
  boss login
      打开登录页（需要在浏览器中自行完成登录）
  boss list [--unread]
      读取「全部」聊天列表候选人；--unread 仅显示未读（角标>0）
  boss chat <姓名> [--strict]
      打开指定联系人会话；默认包含匹配，--strict 为精确匹配
      仅用于已建立联系的候选人（即在 list 里可见的会话对象）
  boss action <操作> [--remark <备注>]
      仅在当前聊天页已打开候选人详情时执行操作，并只返回 action 执行结果
      操作: resume | not-fit | remark | agree-resume | request-attachment-resume | history | wechat
      request-attachment-resume：工具栏「求简历」，确认后向对方发送默认话术索要附件简历（需双方各至少发过一条消息）
      操作为 remark 时必须提供 --remark
  boss send [--text <内容>] [-t <内容>]
      仅发送文本消息（等价于在当前会话输入框发送后回车）
  boss positions
      读取当前职位列表（含开放/待开放/已关闭状态）
  boss jd <name|序号>
      抓取指定职位详情并缓存到项目目录同名 .md
  boss recommend [岗位关键字]
      进入推荐页并读取推荐列表；带岗位关键字时先在岗位下拉中模糊匹配并切换
  boss recommend preview <姓名|序号> [--job <岗位关键字>]
      在推荐列表中打开指定候选人的在线简历预览（c-resume iframe）并保存整框截图到缓存目录
      注意：平台对推荐在线简历每日可查看次数有限，请按需使用、谨慎查看
  boss greet <姓名|序号>
      在「推荐」页（或当前已在 Boss 聊天侧栏打开的、含候选人列表的页面）对列表中的候选人点击“打招呼”
      须先在对应页加载出候选人列表
      会消耗打招呼次数且单次成本较高，请谨慎使用
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

function startProcessingSpinner(): () => void {
  if (!output.isTTY) {
    return () => {};
  }

  const frames = ['|', '/', '-', '\\'];
  let idx = 0;
  output.write(`${frames[idx]}\r`);
  const timer = setInterval(() => {
    idx = (idx + 1) % frames.length;
    output.write(`${frames[idx]}\r`);
  }, 90);
  timer.unref();

  return () => {
    clearInterval(timer);
    output.write(' \r');
  };
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
      die('❌ 用法: chat <姓名> [--strict]');
    }
    if ((opts.action ?? '').trim().length > 0 || (opts.remark ?? '').trim().length > 0) {
      die('❌ chat 不再支持 --action/--remark。请改用: action <操作> [--remark <备注>]');
    }
    // 默认模糊匹配（包含）；仅在指定 --strict 时做精确匹配
    const exact = flags.has('strict');
    return implOpenChat(nameArg, exact);
  }

  if (cmd === 'action') {
    const { rest, opts } = parseOpts(tail);
    const raw = (rest[0] ?? opts.type ?? opts.action ?? '').trim().toLowerCase();
    const actionMap: Record<string, ChatPageAction> = {
      resume: 'resume',
      'not-fit': 'not-fit',
      remark: 'remark',
      'agree-resume': 'agree-resume',
      'request-attachment-resume': 'request-attachment-resume',
      'ask-attachment-resume': 'request-attachment-resume',
      'ask-resume': 'request-attachment-resume',
      history: 'history',
      'chat-history': 'history',
      wechat: 'exchange-wechat',
      'exchange-wechat': 'exchange-wechat',
    };
    const action = actionMap[raw];
    if (!action) {
      die(
        '❌ 用法: action <resume|not-fit|remark|agree-resume|request-attachment-resume|history|wechat> [--remark <备注>]',
      );
    }
    const remark = (opts.remark ?? '').trim();
    if (action === 'remark' && !remark) {
      die('❌ 当操作为 remark 时，必须提供 --remark <备注内容>。');
    }
    return implChatAction({ action, remark });
  }

  if (cmd === 'send') {
    const { opts } = parseOpts(tail);
    const text = opts.text?.trim() || opts.t?.trim() || '';
    if (!text) {
      die('❌ 用法: send [--text <消息>] [-t <消息>]');
    }
    return implSendMessage({ text });
  }

  if (cmd === 'positions') {
    const { rest, opts, flags } = parseOpts(tail);
    if (rest.length > 0 || Object.keys(opts).length > 0 || flags.size > 0) {
      die('❌ 用法: positions');
    }
    return implListPositions();
  }

  if (cmd === 'jd') {
    const { flags, opts, rest } = parseOpts(tail);
    if (flags.has('detail')) {
      die('❌ jd 不再支持 --detail。请使用: jd <name|序号>');
    }
    if (flags.size > 0) {
      const unsupportedFlags = Array.from(flags).join(', --');
      die(`❌ jd 不支持参数: --${unsupportedFlags}`);
    }
    const detailName = rest.join(' ').trim();
    if (!detailName) {
      die('❌ 用法: jd <name|序号>');
    }
    const unknownOpts = Object.keys(opts);
    if (unknownOpts.length > 0) {
      die(`❌ jd 不支持参数: --${unknownOpts.join(', --')}`);
    }
    return implListPositionsWithOptions({ detail: true, name: detailName });
  }

  if (cmd === 'deep-search' || cmd === 'deepsearch') {
    die('❌ deep-search 已暂时从 CLI 中移除（体验不佳）；请使用 recommend 等命令。');
  }

  if (cmd === 'recommend') {
    if (tail[0] === 'preview') {
      const { rest, opts, flags } = parseOpts(tail.slice(1));
      if (flags.size > 0) {
        die('❌ recommend preview 不支持该 flag');
      }
      const disallowed = Object.keys(opts).filter((k) => k !== 'job');
      if (disallowed.length > 0) {
        die(`❌ recommend preview 不支持: --${disallowed[0]}`);
      }
      const candidateTarget = rest.join(' ').trim();
      if (!candidateTarget) {
        die('❌ 用法: recommend preview <姓名|序号> [--job <岗位关键字>]');
      }
      const jobKeyword = opts.job?.trim();
      return implRecommendPreview({ candidateTarget, jobKeyword: jobKeyword || undefined });
    }
    const { rest, opts, flags } = parseOpts(tail);
    if (Object.keys(opts).length > 0 || flags.size > 0) {
      die('❌ 用法: recommend [岗位关键字] 或 recommend preview <姓名|序号> [--job <岗位>]');
    }
    const jobKeyword = rest.join(' ').trim();
    return implRecommend(jobKeyword || undefined);
  }

  if (cmd === 'greet') {
    const { rest, opts, flags } = parseOpts(tail);
    if (Object.keys(opts).length > 0 || flags.size > 0) {
      die('❌ 用法: greet <姓名|序号>');
    }
    const target = rest.join(' ').trim();
    if (!target) {
      die('❌ 用法: greet <姓名|序号>');
    }
    return implRecommendGreet(target);
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
  await printBossInteractiveBanner();
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
      if (/^(version|ver)$/i.test(trimmed) || /^(-v|--version)$/.test(trimmed)) {
        await printVersionInfo();
        continue;
      }
      const argv = splitShellLine(trimmed);
      try {
        const stopSpinner = startProcessingSpinner();
        const text = await executeCommand(argv).finally(() => {
          stopSpinner();
        });
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

  if (
    argv[0] === 'version' ||
    argv[0] === 'ver' ||
    argv[0] === '-v' ||
    argv[0] === '--version'
  ) {
    await printVersionInfo();
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
