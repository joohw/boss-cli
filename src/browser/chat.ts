import type { Browser, Page } from 'puppeteer-core';
import { ensureBrowserSession, getBrowserRef, getPageRef, setSessionPage } from './browser_session.js';
import { CONTEXT_DESTROY_RETRY_MS } from './human_delay.js';
import { sleepRandom } from './timing.js';

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

type MenuListSnapshot = {
  exists: boolean;
  signature: string;
};

function normalizeMenuText(raw: string | null | undefined): string {
  return (raw ?? '').replace(/\s+/g, ' ').trim();
}

async function readMenuListSnapshot(page: Page): Promise<MenuListSnapshot> {
  return (await page.evaluate(`(() => {
    const root = document.querySelector(".menu-list");
    if (!root) {
      return { exists: false, signature: "" };
    }
    const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
    const links = Array.from(root.querySelectorAll("dl > dt > a"));
    const entries = links.map((a) => {
      const href = a.getAttribute("href") ?? "";
      const labelNode = a.querySelector(".menu-item-content span");
      const label = norm(labelNode?.textContent || a.textContent || "");
      return label + "::" + href;
    });
    return { exists: true, signature: entries.join("|") };
  })()`)) as MenuListSnapshot;
}

async function ensureMenuListStableAfterLoad(page: Page): Promise<void> {
  await page.waitForFunction(
    `(() => document.readyState === "complete" || document.readyState === "interactive")()`,
    { timeout: 12_000 },
  );

  const first = await readMenuListSnapshot(page);
  if (!first.exists) {
    throw new Error('未检测到 .menu-list，当前页面可能未登录或未进入 Boss 主界面。');
  }
  if (!normalizeMenuText(first.signature)) {
    throw new Error('检测到 .menu-list 但菜单内容为空，当前页面状态异常。');
  }

  const stableWindowMs = 3_000;
  const pollMs = 300;
  const deadline = Date.now() + stableWindowMs;
  const expected = first.signature;

  while (Date.now() < deadline) {
    await sleepRandom(pollMs, pollMs);
    const snap = await readMenuListSnapshot(page);
    if (!snap.exists) {
      throw new Error('页面中的 .menu-list 在 3 秒稳定检测内消失，疑似未登录或页面仍在跳转。');
    }
    if (snap.signature !== expected) {
      throw new Error('页面中的 .menu-list 在 3 秒稳定检测内发生变化，疑似页面仍在重定向或刷新。');
    }
  }
}

/**
 * 获取 chat page 来执行回调：确保会话可用，并做菜单稳定性检测。
 * 不再主动导航到任何固定路由（如 `/web/chat/index`）；具体业务页由调用方自行要求。
 */
export async function withChatPage<T>(callback: (page: Page) => Promise<T>): Promise<T> {
  const isContextDestroyed = (e: unknown): boolean => {
    const msg = e instanceof Error ? e.message : String(e);
    return (
      msg.includes('Execution context was destroyed') ||
      msg.includes('Cannot find context with specified id') ||
      msg.includes('Most likely because of a navigation')
    );
  };

  const maxAttempts = 2;
  let lastErr: unknown;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
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
      await ensureMenuListStableAfterLoad(page);

      return await callback(page);
    } catch (e) {
      lastErr = e;
      if (attempt < maxAttempts - 1 && isContextDestroyed(e)) {
        // Boss 页面偶发跳转/重渲染会销毁执行上下文；短暂等待并重试一次即可。
        await sleepRandom(CONTEXT_DESTROY_RETRY_MS.min, CONTEXT_DESTROY_RETRY_MS.max);
        continue;
      }
      throw e;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

