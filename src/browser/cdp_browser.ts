import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import readline from 'node:readline';
import path from 'node:path';
import puppeteer, { type Browser, type CDPSession, type Page } from 'puppeteer-core';
import { BROWSER_USER_DATA_DIR, ensureAppDataLayout } from '../config.js';

/** 与 @puppeteer/browsers 一致，解析 Chrome 启动日志中的 CDP WebSocket URL（可能在 stdout 或 stderr）。 */
const CDP_WEBSOCKET_ENDPOINT_REGEX = /^DevTools listening on (ws:\/\/.*)$/;

const LAUNCH_READY_MS = 30_000;

let spawnedChromeChild: ChildProcess | null = null;
/** 最近一次 `connectBrowser` 是否以无头方式启动（`browser.process()` 在 connect 模式下不可用，供 login 等逻辑判断）。 */
let lastChromeLaunchHeadless = false;

export function clearSpawnedChromeProcessRef(): void {
  spawnedChromeChild = null;
}

/** 最近一次启动是否为无头（仅本进程内、与当前会话一致时有效）。 */
export function wasLastChromeLaunchHeadless(): boolean {
  return lastChromeLaunchHeadless;
}

/**
 * Chromium 在启用远程调试时会在用户数据目录写入 `DevToolsActivePort`（首行端口、次行 path）。
 * 当同一 user-data-dir 已有实例在跑时，新起的进程会通过单例立刻退出（常为代码 0），
 * 且本进程的 stdout 可能拿不到 `DevTools listening on`（尤其 Windows），此时应读本文件接到已有实例。
 */
async function readDevToolsEndpointFromUserDataDir(
  userDataDir: string,
  maxWaitMs: number,
): Promise<string | undefined> {
  const portPath = path.join(userDataDir, 'DevToolsActivePort');
  const deadline = Date.now() + maxWaitMs;
  let delay = 40;
  while (Date.now() < deadline) {
    if (existsSync(portPath)) {
      try {
        const fileContent = await readFile(portPath, 'ascii');
        const lines = fileContent
          .split('\n')
          .map((l) => l.trim())
          .filter((l) => l.length > 0);
        const rawPort = lines[0];
        const rawPath = lines[1];
        if (rawPort && rawPath) {
          const port = Number.parseInt(rawPort, 10);
          if (Number.isFinite(port) && port > 0 && port <= 65535) {
            return `ws://127.0.0.1:${port}${rawPath}`;
          }
        }
      } catch {
        /* 文件可能尚未写完，重试 */
      }
    }
    await new Promise((r) => setTimeout(r, delay));
    delay = Math.min(delay + 40, 200);
  }
  return undefined;
}

function waitForDevToolsWebSocketUrl(
  proc: ChildProcess,
  userDataDir: string,
  timeoutMs: number,
): Promise<string> {
  const streams = [proc.stdout, proc.stderr].filter((s): s is NonNullable<typeof s> => s != null);
  if (streams.length === 0) {
    return Promise.reject(new Error('浏览器子进程无 stdout/stderr，无法获取 CDP 地址'));
  }

  return new Promise((resolve, reject) => {
    const rls: readline.Interface[] = [];
    let settled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const cleanup = () => {
      for (const rl of rls) {
        try {
          rl.close();
        } catch {
          /* ignore */
        }
      }
      rls.length = 0;
    };

    const finish = (fn: () => void) => {
      if (settled) return;
      settled = true;
      if (timer !== undefined) {
        clearTimeout(timer);
        timer = undefined;
      }
      proc.off('exit', onExit);
      proc.off('error', onProcError);
      cleanup();
      fn();
    };

    timer = setTimeout(() => {
      finish(() => {
        reject(new Error(`等待 Chrome 输出 DevTools 地址超时（${timeoutMs}ms）`));
      });
    }, timeoutMs);

    const onExit = (code: number | null) => {
      if (timer !== undefined) {
        clearTimeout(timer);
        timer = undefined;
      }
      void (async () => {
        if (code === 0) {
          const fromFile = await readDevToolsEndpointFromUserDataDir(userDataDir, 4000);
          if (fromFile) {
            finish(() => {
              resolve(fromFile);
            });
            return;
          }
        }
        finish(() => {
          reject(
            new Error(
              code === 0
                ? '无法连接浏览器：新进程已退出（代码 0）且未在本地用户数据目录发现 DevTools 调试端口。若该配置正被「手动打开」的 Chrome 占用（无远程调试），请先关闭该窗口；或结束仍由上次 boss-cli 留下的浏览器后再试。'
                : `浏览器进程在就绪前退出（代码 ${code ?? 'unknown'}）`,
            ),
          );
        });
      })();
    };

    const onProcError = (err: Error) => {
      finish(() => {
        reject(err);
      });
    };

    const onLine = (line: string) => {
      const m = line.trim().match(CDP_WEBSOCKET_ENDPOINT_REGEX);
      if (m?.[1]) {
        finish(() => {
          resolve(m[1]);
        });
      }
    };

    proc.once('exit', onExit);
    proc.once('error', onProcError);

    for (const s of streams) {
      const rl = readline.createInterface(s);
      rls.push(rl);
      rl.on('line', onLine);
    }
  });
}

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
] as const;

export type ConnectBrowserOptions = {
  /** 用于启动本机 Chrome/Edge */
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
 * 启动本机浏览器（puppeteer-core 底层为 Chrome DevTools Protocol）。
 *
 * 环境变量（可选）：
 * - `CHROME_PATH` / `PUPPETEER_EXECUTABLE_PATH` — 启动本机浏览器可执行文件路径（高于自动探测）
 * - `BOSS_BROWSER_USER_DATA_DIR` — 启动浏览器时复用的用户数据目录；未设置时默认 `~/.boss-cli/.cache/browser-data`
 * - `BOSS_BROWSER_PROFILE_DIRECTORY` — 启动浏览器时指定 profile（如 `Default`）
 * - `BOSS_BROWSER_ALLOW_ALL_CORS` — 设为 `true` 时附加放宽同源/CORS 的启动参数（仅调试）
 * - `BOSS_BROWSER_DISABLE_GPU` — 设为 `true` 时附加 `--disable-gpu`
 *
 * 若以上均未设置，会按系统尝试常见 Chrome / Edge / Chromium 安装路径。
 * - `BOSS_BROWSER_HEADLESS` — 设为 `true` 时启用无头；默认**有界面**。
 * - `BOSS_BROWSER_VIEWPORT_WIDTH` / `BOSS_BROWSER_VIEWPORT_HEIGHT` — 启动时显式指定视口；未设置时不覆盖浏览器窗口尺寸
 */
/** 启动浏览器时的默认视口（与环境变量一致）；截图恢复时 `viewport()` 为 null 也可用其兜底。 */
export function defaultViewportFromEnv(): { width: number; height: number } {
  const w = Number.parseInt(process.env.BOSS_BROWSER_VIEWPORT_WIDTH?.trim() ?? '', 10);
  const h = Number.parseInt(process.env.BOSS_BROWSER_VIEWPORT_HEIGHT?.trim() ?? '', 10);
  return {
    width: Number.isFinite(w) && w > 0 ? w : 1280,
    height: Number.isFinite(h) && h > 0 ? h : 1200,
  };
}

/** 仅在显式配置了视口环境变量时返回启动视口；否则返回 null，不覆盖浏览器实际窗口尺寸。 */
function launchViewportFromEnv(): { width: number; height: number } | null {
  const rawW = process.env.BOSS_BROWSER_VIEWPORT_WIDTH?.trim() ?? '';
  const rawH = process.env.BOSS_BROWSER_VIEWPORT_HEIGHT?.trim() ?? '';
  if (!rawW && !rawH) {
    return null;
  }
  return defaultViewportFromEnv();
}

export async function connectBrowser(options: ConnectBrowserOptions = {}): Promise<Browser> {
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
      '未找到本机 Chrome/Edge：请设置 CHROME_PATH / PUPPETEER_EXECUTABLE_PATH（可执行文件路径）。',
    );
  }

  const headless = options.headless ?? process.env.BOSS_BROWSER_HEADLESS === 'true';
  const allowAllCors = options.allowAllCors ?? process.env.BOSS_BROWSER_ALLOW_ALL_CORS === 'true';
  const disableGpu = process.env.BOSS_BROWSER_DISABLE_GPU === 'true';

  clearSpawnedChromeProcessRef();
  lastChromeLaunchHeadless = !!headless;

  /**
   * 优先直连已存在实例：若当前 user-data-dir 下已有开启远程调试的浏览器，
   * 直接 connect，避免每次都 spawn 新进程导致额外空白窗口/闪窗。
   */
  const existingWsUrl = await readDevToolsEndpointFromUserDataDir(userDataDir, 700);
  if (existingWsUrl) {
    try {
      return await puppeteer.connect({
        browserWSEndpoint: existingWsUrl,
        defaultViewport: launchViewportFromEnv(),
      });
    } catch {
      // 端口文件可能陈旧或实例刚退出，回退到 spawn + connect。
    }
  }

  const userArgs = [
    ...LAUNCH_ARGS_LESS_AUTOMATION,
    ...(disableGpu ? ['--disable-gpu'] : []),
    ...(allowAllCors ? LAUNCH_ARGS_ALLOW_ALL_CORS : []),
    ...(profileDirectory ? [`--profile-directory=${profileDirectory}`] : []),
  ];

  let chromeArgs = puppeteer
    .defaultArgs({
      browser: 'chrome',
      userDataDir,
      headless,
      args: userArgs,
    })
    .filter((a) => a !== '--enable-automation' && a !== 'about:blank' && a !== 'data:,');

  if (!chromeArgs.some((a) => a.startsWith('--remote-debugging-'))) {
    chromeArgs.push('--remote-debugging-port=0');
  }

  /**
   * 不使用 `puppeteer.launch()`：其依赖的 `@puppeteer/browsers` 会在 **Node 进程 `exit` 时 kill 浏览器子进程**，
   * 导致交互模式 / `npm run dev` 退出时窗口被一并关掉。改为自行 `spawn` + `connect`，退出时只断 CDP，浏览器可保留。
   */
  const proc = spawn(executablePath, chromeArgs, {
    detached: true,
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  spawnedChromeChild = proc;

  let wsUrl: string;
  try {
    wsUrl = await waitForDevToolsWebSocketUrl(proc, userDataDir, LAUNCH_READY_MS);
  } catch (e) {
    try {
      proc.kill();
    } catch {
      /* ignore */
    }
    clearSpawnedChromeProcessRef();
    throw e;
  }

  try {
    proc.stdout?.resume();
    proc.stderr?.resume();
  } catch {
    /* ignore */
  }
  /** 单例移交时子进程已退出，无句柄可 unref；仅在本进程真正拉起 Chrome 时 unref，避免拖住 Node 退出。 */
  if (proc.exitCode === null && proc.signalCode === null) {
    try {
      proc.unref();
    } catch {
      /* ignore */
    }
  } else {
    clearSpawnedChromeProcessRef();
  }

  try {
    return await puppeteer.connect({
      browserWSEndpoint: wsUrl,
      defaultViewport: launchViewportFromEnv(),
    });
  } catch (e) {
    try {
      proc.kill();
    } catch {
      /* ignore */
    }
    clearSpawnedChromeProcessRef();
    throw e;
  }
}

/** 对某一页创建原生 CDP Session（需要低层域如 `Network.*`、`Fetch.*` 时使用）。 */
export async function createPageCDPSession(page: Page): Promise<CDPSession> {
  return page.createCDPSession();
}
