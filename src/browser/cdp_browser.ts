import { existsSync } from 'node:fs';
import path from 'node:path';
import puppeteer, { type Browser, type CDPSession, type Page } from 'puppeteer-core';
import { BROWSER_USER_DATA_DIR, ensureAppDataLayout } from '../config.js';

/** 在未配置路径时，尝试常见安装位置（Chrome / Edge / Chromium）。 */
function findLocalChromiumExecutable(): string | undefined {
  const candidates: string[] = [];

  if (process.platform === 'win32') {
    const local = process.env.LOCALAPPDATA;
    const pf = process.env.PROGRAMFILES;
    const pf86 = process.env['PROGRAMFILES(X86)'];
    if (local) {
      candidates.push(path.join(local, 'Google', 'Chrome', 'Application', 'chrome.exe'));
    }
    if (pf) {
      candidates.push(path.join(pf, 'Google', 'Chrome', 'Application', 'chrome.exe'));
      candidates.push(path.join(pf, 'Microsoft', 'Edge', 'Application', 'msedge.exe'));
    }
    if (pf86) {
      candidates.push(path.join(pf86, 'Google', 'Chrome', 'Application', 'chrome.exe'));
      candidates.push(path.join(pf86, 'Microsoft', 'Edge', 'Application', 'msedge.exe'));
    }
  } else if (process.platform === 'darwin') {
    candidates.push(
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
    );
  } else {
    candidates.push(
      '/usr/bin/google-chrome-stable',
      '/usr/bin/google-chrome',
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser',
      '/usr/bin/microsoft-edge-stable',
      '/usr/bin/microsoft-edge',
    );
  }

  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  return undefined;
}

/** 减轻「正受到自动测试软件的控制」提示与常见自动化特征（非万能，站点仍可能用其它方式检测）。手动开 Chrome 并接 CDP 时可复用。 */
export const LAUNCH_ARGS_LESS_AUTOMATION = [
  '--disable-blink-features=AutomationControlled',
  '--disable-infobars',
] as const;

/** 仅用于本地调试：尽量放宽同源/CORS 限制，便于跨域 iframe/canvas 处理。 */
export const LAUNCH_ARGS_ALLOW_ALL_CORS = [
  '--disable-web-security',
  '--allow-running-insecure-content',
  '--disable-features=IsolateOrigins,site-per-process',
] as const;

export type ConnectBrowserOptions = {
  /** 已启动 Chrome 的 DevTools WebSocket，例如 `ws://127.0.0.1:9222/devtools/browser/...` */
  browserWSEndpoint?: string;
  /** 已启动 Chrome/Edge 的 DevTools HTTP 地址，例如 `http://127.0.0.1:9222` */
  browserURL?: string;
  /** 未指定 `browserWSEndpoint` 时用于启动本机 Chrome/Edge */
  executablePath?: string;
  /** 启动浏览器时复用的用户数据目录（登录态/缓存等） */
  userDataDir?: string;
  /** 启动浏览器时指定 profile（如 `Default` / `Profile 1`） */
  profileDirectory?: string;
  /** 默认 `false`（有界面）。也可用环境变量 `BOSS_BROWSER_HEADLESS=true` 开无头。 */
  headless?: boolean;
  /** 仅本地调试用：放宽同源/CORS 策略（高风险，默认关闭）。 */
  allowAllCors?: boolean;
}

/**
 * 通过 CDP 连接或启动浏览器（puppeteer-core 底层为 Chrome DevTools Protocol）。
 *
 * 环境变量（可选）：
 * - `BOSS_BROWSER_WS_ENDPOINT` — 优先：连接到已有浏览器
 * - `BOSS_BROWSER_URL` — 次优先：通过 `http://127.0.0.1:9222` 这类调试地址连接已有浏览器
 * - `CHROME_PATH` / `PUPPETEER_EXECUTABLE_PATH` — 启动本机浏览器可执行文件路径（高于自动探测）
 * - `BOSS_BROWSER_USER_DATA_DIR` — 启动浏览器时复用的用户数据目录；未设置时默认 `~/.boss-cli/.cache/browser-data`
 * - `BOSS_BROWSER_PROFILE_DIRECTORY` — 启动浏览器时指定 profile（如 `Default`）
 * - `BOSS_BROWSER_ALLOW_ALL_CORS` — 设为 `true` 时附加放宽同源/CORS 的启动参数（仅调试）
 *
 * 若以上均未设置，会按系统尝试常见 Chrome / Edge / Chromium 安装路径。
 * - `BOSS_BROWSER_HEADLESS` — 设为 `true` 时启用无头；默认**有界面**。
 *
 * 连接已有浏览器（`BOSS_BROWSER_WS_ENDPOINT`）时，Puppeteer 无法改启动参数；若仍出现自动化提示，请用本机命令行自行启动 Chrome，并带上与 {@link LAUNCH_ARGS_LESS_AUTOMATION} 同类参数，且**不要**带 `--enable-automation`。
 */
export async function connectBrowser(options: ConnectBrowserOptions = {}): Promise<Browser> {
  const ws =
    options.browserWSEndpoint?.trim() ||
    process.env.BOSS_BROWSER_WS_ENDPOINT?.trim();
  if (ws) {
    return puppeteer.connect({ browserWSEndpoint: ws });
  }
  const browserURL = options.browserURL?.trim() || process.env.BOSS_BROWSER_URL?.trim();
  if (browserURL) {
    return puppeteer.connect({ browserURL });
  }

  const executablePath =
    options.executablePath?.trim() ||
    process.env.CHROME_PATH?.trim() ||
    process.env.PUPPETEER_EXECUTABLE_PATH?.trim() ||
    findLocalChromiumExecutable();

  const envUserData = process.env.BOSS_BROWSER_USER_DATA_DIR?.trim();
  if (!envUserData) {
    ensureAppDataLayout();
  }
  const userDataDir =
    options.userDataDir?.trim() || envUserData || BROWSER_USER_DATA_DIR;

  const profileDirectory =
    options.profileDirectory?.trim() || process.env.BOSS_BROWSER_PROFILE_DIRECTORY?.trim();

  if (!executablePath) {
    throw new Error(
      '未找到本机 Chrome/Edge：请设置 BOSS_BROWSER_WS_ENDPOINT（连接已有浏览器）或 CHROME_PATH / PUPPETEER_EXECUTABLE_PATH（可执行文件路径）。',
    );
  }

  const headless = options.headless ?? process.env.BOSS_BROWSER_HEADLESS === 'true';
  const allowAllCors = options.allowAllCors ?? process.env.BOSS_BROWSER_ALLOW_ALL_CORS === 'true';

  return puppeteer.launch({
    executablePath,
    userDataDir,
    headless,
    /** 去掉 Chrome 默认的 `--enable-automation`，可消除顶部「正受到自动测试软件的控制」提示 */
    ignoreDefaultArgs: ['--enable-automation'],
    defaultViewport: headless ? { width: 1280, height: 800 } : null,
    args: [
      ...LAUNCH_ARGS_LESS_AUTOMATION,
      ...(allowAllCors ? LAUNCH_ARGS_ALLOW_ALL_CORS : []),
      ...(profileDirectory ? [`--profile-directory=${profileDirectory}`] : []),
    ],
  });
}

/** 对某一页创建原生 CDP Session（需要低层域如 `Network.*`、`Fetch.*` 时使用）。 */
export async function createPageCDPSession(page: Page): Promise<CDPSession> {
  return page.createCDPSession();
}
