import type { Browser, Page } from 'puppeteer-core';
import { ensureBrowserSession, getBrowserRef, getPageRef, setSessionPage } from './browser_session.js';
import { BOSS_CHAT_INDEX_URL, isBossChatIndexUrl, sleep } from './auth.js';

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

/**
 * 获取 chat page 来执行回调：确保已启动浏览器并导航到 Boss 沟通列表页（/web/chat/index）。
 * 仅负责“浏览器状态/导航”，不在这里做登录成功与否的业务判断。
 */
export async function withChatPage<T>(callback: (page: Page) => Promise<T>): Promise<T> {
  await ensureBrowserSession();
  const browser = getBrowserRef();
  if (!browser) {
    throw new Error('无法获取浏览器实例。');
  }

  let page: Page | null = getPageRef();
  if (!page || page.isClosed()) {
    page = (await pickExistingPage(browser)) ?? (await browser.newPage());
  }
  setSessionPage(page);
  await page.bringToFront();
  if (SHOULD_DISABLE_JS) {
    await page.setJavaScriptEnabled(false);
  }

  // 如果当前已在沟通列表页，则不刷新页面，避免打断用户状态（滚动位置/选中会话等）。
  const currentUrl = (() => {
    try {
      return page.url();
    } catch {
      return '';
    }
  })();
  if (!isBossChatIndexUrl(currentUrl)) {
    await page.goto(BOSS_CHAT_INDEX_URL, { waitUntil: 'load', timeout: 60_000 });
    // 等待页面渲染稳定（SPA/异步接口），避免紧接着查询元素时拿不到
    await sleep(2_000);
  }
  return callback(page);
}

