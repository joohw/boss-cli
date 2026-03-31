import type { Browser, Page } from 'puppeteer-core';
import {
  disconnectBrowserSession,
  ensureAndGetBrowser,
  ensureBrowserSession,
  getBrowserRef,
  getPageRef,
  probeLoggedInFromPage,
  setSessionPage,
  sleep,
} from '../browser/index.js';

type WaitForLoginOptions = {
  timeoutMs?: number;
  pollMs?: number;
};

const BOSS_LOGIN_URL = 'https://www.zhipin.com/web/user/?ka=header-login';

async function pickExistingPage(browser: Browser): Promise<Page | null> {
  const pages = (await browser.pages()).filter((p) => !p.isClosed());
  if (pages.length === 0) return null;

  const urls = await Promise.all(
    pages.map((p) => {
      try {
        return p.url();
      } catch {
        return '';
      }
    }),
  );

  const zhipin = pages.find((p, i) => {
    const u = urls[i] ?? '';
    return u.length > 0 && u !== 'about:blank' && u.includes('zhipin.com');
  });
  if (zhipin) return zhipin;

  const nonBlank = pages.find((p, i) => {
    const u = urls[i] ?? '';
    return u.length > 0 && u !== 'about:blank';
  });
  return nonBlank ?? null;
}

async function waitForBossLogin(opts: Required<WaitForLoginOptions>): Promise<void> {
  const start = Date.now();
  for (;;) {
    const page = getPageRef();
    if (!page) {
      throw new Error('浏览器页面已不存在，登录中断。');
    }
    if (page.isClosed?.()) {
      throw new Error('浏览器页面已关闭，登录中断。');
    }
    const browser = page.browser?.();
    if (browser && !browser.isConnected()) {
      throw new Error('浏览器已断开连接，登录中断。');
    }

    const { loggedIn, url } = await probeLoggedInFromPage(page);
    if (loggedIn) {
      console.error(`[boss-cli] login ok url=${url}`);
      return;
    }

    if (Date.now() - start >= opts.timeoutMs) {
      throw new Error(`登录超时（${Math.round(opts.timeoutMs / 1000)}s）。请在浏览器中完成登录后重试。`);
    }
    await sleep(opts.pollMs);
  }
}

/**
 * 登录（手动）：打开 Boss 登录页，并等待用户在浏览器中完成登录。
 * 成功返回纯文本；失败抛错（由 CLI 统一写入 stderr 并设置退出码）。
 */
export async function runLogin(options: WaitForLoginOptions = {}): Promise<string> {
  const timeoutMs = options.timeoutMs ?? 120_000;
  const pollMs = options.pollMs ?? 2_000;

  // 登录必须可见：即使之前已启动 headless 会话，也需要重启为 headful。
  process.env.BOSS_BROWSER_HEADLESS = 'false';
  const existing = getBrowserRef();
  try {
    const args = existing?.process?.()?.spawnargs ?? [];
    const isHeadless = args.some((a) => typeof a === 'string' && a.startsWith('--headless'));
    if (existing?.connected && isHeadless) {
      await disconnectBrowserSession().catch(() => {});
    }
  } catch {
    // ignore
  }

  let browser: Browser | null = null;
  try {
    browser = (await ensureAndGetBrowser()) ?? (getBrowserRef() ?? null);
    if (!browser) {
      await ensureBrowserSession();
      browser = getBrowserRef() ?? null;
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`连接浏览器失败：${msg}`);
  }
  if (!browser) {
    throw new Error('无法获取浏览器实例，登录失败。');
  }

  let page: Page | null = getPageRef() ?? null;
  if (!page || page.isClosed()) {
    page = (await pickExistingPage(browser)) ?? (await browser.newPage());
  }
  setSessionPage(page);
  await page.bringToFront();
  await page.goto(BOSS_LOGIN_URL, { waitUntil: 'load', timeout: 60_000 });

  console.error(`⏰ 请在浏览器中完成登录（超时 ${Math.round(timeoutMs / 1000)} 秒）`);
  await waitForBossLogin({ timeoutMs, pollMs });

  const after = await probeLoggedInFromPage(page);
  const result = [
    '✅ 登录成功',
    `当前页：${after.url}`,
  ]
    .filter(Boolean)
    .join('\n');

  // 登录成功后关闭浏览器（保持终端干净、避免遗留进程）；失败/超时会抛错，不走到这里，也就不会关闭。
  await disconnectBrowserSession().catch(() => {});
  return result;
}

