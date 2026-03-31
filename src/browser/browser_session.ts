import type { Browser, Page } from 'puppeteer-core';
import { connectBrowser } from './cdp_browser.js';
let browserRef: Browser | null = null;
let pageRef: Page | null = null;
let connectPromise: Promise<void> | null = null;

function attachDisconnectedHandler(b: Browser): void {
  b.once('disconnected', () => {
    if (browserRef === b) {
      browserRef = null;
      pageRef = null;
      console.error(
        '[boss-cli] 与浏览器断开连接（窗口关闭或进程退出）；下次使用工具时会自动重连。',
      );
    }
  });
}

/**
 * 选一个「主」标签：避免始终把 `pages()[0]` 当主页——用户常在第二个及以后的 Boss 标签上操作，
 * 而第一个是 `about:blank` 或残留空页时，错误地读到 blank 会让登录/页面检查类操作误判。
 */
async function pickOrCreatePage(b: Browser): Promise<Page> {
  const pages = (await b.pages()).filter((p) => !p.isClosed());
  if (pages.length === 0) {
    return b.newPage();
  }

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
  if (zhipin) {
    return zhipin;
  }

  const nonBlank = pages.find((p, i) => {
    const u = urls[i] ?? '';
    return u.length > 0 && u !== 'about:blank';
  });
  if (nonBlank) {
    return nonBlank;
  }

  return pages[0]!;
}

function isSessionHealthy(): boolean {
  return !!(browserRef?.connected && pageRef && !pageRef.isClosed());
}

async function establishSession(): Promise<void> {
  const prev = browserRef;
  if (prev) {
    try {
      prev.removeAllListeners('disconnected');
      await prev.close();
    } catch {
      /* 已断开时忽略 */
    }
    browserRef = null;
    pageRef = null;
  }

  const b = await connectBrowser();
  browserRef = b;
  attachDisconnectedHandler(b);
  pageRef = await pickOrCreatePage(b);
  console.error('[boss-cli] 已连接浏览器，当前页:', pageRef.url());
}

/**
 * 在 {@link ensureBrowserSession} 之后返回当前已连接的 Browser；
 * 用于工具内单次获取句柄，避免与异步 ensure 不同步的 `getBrowser()` 竞态。
 */
export async function ensureAndGetBrowser(): Promise<Browser | null> {
  await ensureBrowserSession();
  return getBrowserRef();
}

export async function ensureBrowserSession(): Promise<void> {
  if (browserRef?.connected) {
    if (pageRef && !pageRef.isClosed()) {
      try {
        const u = pageRef.url();
        if (u === 'about:blank' || u === '') {
          const preferred = await pickOrCreatePage(browserRef);
          if (preferred !== pageRef && !(preferred.url() === 'about:blank')) {
            pageRef = preferred;
          }
        }
      } catch {
        /* ignore */
      }
      return;
    }
    pageRef = await pickOrCreatePage(browserRef);
    return;
  }

  if (connectPromise) {
    await connectPromise;
    return;
  }

  connectPromise = (async () => {
    if (isSessionHealthy()) return;
    await establishSession();
  })();

  try {
    await connectPromise;
  } finally {
    connectPromise = null;
  }
}

export function getBrowserRef(): Browser | null {
  return browserRef?.connected ? browserRef : null;
}

export function getPageRef(): Page | null {
  if (!pageRef || pageRef.isClosed()) return null;
  if (!browserRef?.connected) return null;
  return pageRef;
}

/**
 * 将当前会话的主操作页设为 `page`（须属于已连接的 `browserRef`）。
 * 供“导航/打开页面”类流程在新建或选中标签后同步，便于其它工具通过 `getPageRef` 复用。
 */
export function setSessionPage(page: Page): void {
  if (!browserRef?.connected) return;
  try {
    if (page.browser() !== browserRef) return;
  } catch {
    return;
  }
  if (page.isClosed()) return;
  pageRef = page;
}

/** 进程退出时断开 CDP，避免残留子进程 */
export async function disconnectBrowserSession(): Promise<void> {
  const b = browserRef;
  if (!b) return;
  try {
    b.removeAllListeners('disconnected');
    await b.close();
  } catch {
    /* ignore */
  }
  browserRef = null;
  pageRef = null;
}

/**
 * 仅断开与浏览器的 CDP 连接，但不主动关闭浏览器进程。
 * 用于 `boss login` 这类“需要用户继续在浏览器里操作”的场景：
 * CLI 可以立刻退出，而浏览器窗口仍保留给用户完成登录。
 */
export async function detachBrowserSession(): Promise<void> {
  const b = browserRef;
  if (!b) return;
  try {
    b.removeAllListeners('disconnected');
    // Puppeteer 支持 disconnect：断开连接但保留浏览器进程
    //（若底层不支持或抛错，则退化为 close）。
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyB = b as any;
    if (typeof anyB.disconnect === 'function') {
      anyB.disconnect();
    } else {
      await b.close();
    }
  } catch {
    try {
      await b.close();
    } catch {
      /* ignore */
    }
  }
  browserRef = null;
  pageRef = null;
}
