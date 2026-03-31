import type { Browser, Page } from 'puppeteer-core';
import {
  ensureAndGetBrowser,
  ensureBrowserSession,
  getBrowserRef,
  getPageRef,
  setSessionPage,
} from '../browser/index.js';
import { BOSS_CHAT_INDEX_URL, probeLoggedInFromPage } from './login_shared.js';

const DEFAULT_CHAT_LIST_URL = BOSS_CHAT_INDEX_URL;
const SHOULD_DISABLE_JS =
  process.env.BOSS_BROWSER_DISABLE_JS === 'true' || process.env.BOSS_BROWSER_DISABLE_JS === '1';

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

export async function runOpenChatList(): Promise<string> {
  console.error('[boss-cli] open_chat_list called');
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
    throw new Error('无法获取浏览器实例（ensureAndGetBrowser/ensureBrowserSession 失败）。');
  }

  let page: Page | null = getPageRef() ?? null;
  if (!page || page.isClosed()) {
    try {
      page = (await pickExistingPage(browser)) ?? (await browser.newPage());
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      throw new Error(`无法获取或新建标签页：${msg}`);
    }
  }

  try {
    setSessionPage(page);
    await page.bringToFront();
    if (SHOULD_DISABLE_JS) {
      await page.setJavaScriptEnabled(false);
      console.error('[open_chat_list] javascript_disabled=true');
    }

    await page.goto(DEFAULT_CHAT_LIST_URL, {
      waitUntil: 'load',
      timeout: 60_000,
    });
    const url = page.url();
    const { loggedIn } = await probeLoggedInFromPage(page);
    console.error(`[boss-cli] open_chat_list ok url=${url} loggedIn=${String(loggedIn)}`);
    return [
      `已打开沟通列表页：${url}`,
      loggedIn ? '当前页已检测到登录状态。' : '当前页未检测到登录状态，请在浏览器中登录 Boss 直聘后再操作。',
    ].join('\n');
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`[boss-cli] open_chat_list error: ${msg}`);
    throw new Error(`打开沟通列表页失败：${msg}`);
  }
}
