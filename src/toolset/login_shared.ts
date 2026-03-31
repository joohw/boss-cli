import type { Page } from 'puppeteer-core';

/** Boss 直聘首页 */
export const BOSS_ZHIPIN_HOME = 'https://www.zhipin.com/';

/** 默认落地页（杭州 SEO 首页）；CLI 等未配置环境变量时使用 */
export const BOSS_DEFAULT_LANDING_URL =
  'https://www.zhipin.com/hangzhou/?seoRefer=index';

/** 沟通页（登录成功后的典型落地页之一） */
export const BOSS_CHAT_INDEX_URL = 'https://www.zhipin.com/web/chat/index';

/** 尚未有可用的浏览器会话时，提示先调用 `login`（或 `open-chat-list`）。 */
export function createWaitManualLoginRequiredText(action: string): string {
  return `浏览器尚未初始化，无法${action}。请先运行 boss login（推荐）或 boss open-chat-list 连接浏览器并进入沟通列表。`;
}

/** 当前 URL 是否为沟通页 `/web/chat/index`（允许带 query） */
export function isBossChatIndexUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (!u.hostname.includes('zhipin.com')) {
      return false;
    }
    const p = u.pathname.replace(/\/+$/, '') || '/';
    return p === '/web/chat/index';
  } catch {
    return false;
  }
}

/**
 * 沟通页且存在顶栏登录信息（与 {@link probeLoggedInFromPage} 一致）。
 * 用于「等待手动登录」成功条件。
 */
export async function probeBossChatIndexLoggedIn(page: Page): Promise<boolean> {
  const url = page.url();
  if (!isBossChatIndexUrl(url)) {
    return false;
  }
  const { loggedIn } = await probeLoggedInFromPage(page);
  return loggedIn;
}

/** 未登录时常见跳转：如 `https://www.zhipin.com/web/user/?ka=bticket` */
export function isWebUserLoginUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (!u.hostname.includes('zhipin.com')) {
      return false;
    }
    return u.pathname.includes('/web/user/');
  } catch {
    return false;
  }
}

export function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new Error('Aborted'));
      return;
    }
    const id = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(id);
      reject(new Error('Aborted'));
    };
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

/** 与 {@link probeLoggedInSignals} 返回结构一致 */
export type ProbeLoggedInSignals = {
  hasNickname: boolean;
  navLoginCta: boolean;
  hasLogoutHint: boolean;
};

/**
 * 必须在页面里执行的探测脚本（纯字符串）。
 * `tsx`/esbuild 转译 `page.evaluate(() => { ... })` 时可能注入 `__name(...)`，序列化到浏览器后会报 `__name is not defined`。
 */
const PROBE_LOGGED_IN_SIGNALS_SCRIPT = `(() => {
  function isNick(t) {
    const s = t.replace(/\\s+/g, " ").trim();
    if (s.length < 2 || s.length > 64) return false;
    return !/^(我要登录|登录|注册|登录\\/注册)$/u.test(s);
  }
  var hasNickname = false;
  var nickSelectors = [
    ".user-name",
    "span.user-name",
    "[class*='user-name']",
    ".label-name",
    ".nav-user .name",
    ".nav-user-name",
    "a.nav-user",
    ".header-nav [class*='name']",
  ];
  var si, i, els, el, t;
  for (si = 0; si < nickSelectors.length; si++) {
    els = document.querySelectorAll(nickSelectors[si]);
    for (i = 0; i < els.length; i++) {
      el = els[i];
      t = (el.textContent || "").trim();
      if (isNick(t)) {
        hasNickname = true;
        break;
      }
    }
    if (hasNickname) break;
  }
  var navRoots = [];
  var navSels = ["header", ".nav-header", ".nav-wrap", ".top-header", "#header", ".header", ".navbar"];
  var j, ne;
  for (j = 0; j < navSels.length; j++) {
    ne = document.querySelector(navSels[j]);
    if (ne instanceof HTMLElement) navRoots.push(ne);
  }
  var navLoginCta = false;
  for (i = 0; i < navRoots.length; i++) {
    if (/\\b我要登录\\b/u.test(navRoots[i].innerText || "")) {
      navLoginCta = true;
      break;
    }
  }
  var bodyText = document.body instanceof HTMLElement ? document.body.innerText || "" : "";
  var hasLogoutHint =
    /\\b退出登录\\b/u.test(bodyText) ||
    !!document.querySelector("a[href*='logout'], a[href*='signout'], [data-url*='logout']");
  return { hasNickname: hasNickname, navLoginCta: navLoginCta, hasLogoutHint: hasLogoutHint };
})()`;

/**
 * 在浏览器内检测登录相关信号（避免对 `page.content()` 做整页字符串匹配：SPA 晚渲染会误判；脚本里的「我要登录」会误判）。
 */
async function probeLoggedInSignals(page: Page): Promise<ProbeLoggedInSignals> {
  return (await page.evaluate(PROBE_LOGGED_IN_SIGNALS_SCRIPT)) as ProbeLoggedInSignals;
}

/**
 * 根据当前页判断是否已登录（不导航）。
 *
 * **已登录（true）**：在浏览器内检测到顶栏昵称（多类名匹配）、或「退出登录」/logout 链接等已登录常见信号。
 * 会短轮询等待 SPA 渲染，避免 `goto` 后立即读静态 HTML 误判。
 *
 * **未登录（false）**：`/web/user/` 登录流 URL、顶栏区域出现「我要登录」入口、且轮询结束仍无昵称/退出类信号。
 */
export async function probeLoggedInFromPage(page: Page): Promise<{ loggedIn: boolean; url: string }> {
  const url = page.url();
  if (!url || url === 'about:blank') {
    return { loggedIn: false, url: url || '' };
  }
  if (isWebUserLoginUrl(url)) {
    return { loggedIn: false, url };
  }

  const maxAttempts = 25;
  const delayMs = 400;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const s = await probeLoggedInSignals(page);
    if (s.hasNickname || s.hasLogoutHint) {
      return { loggedIn: true, url };
    }
    if (s.navLoginCta) {
      return { loggedIn: false, url };
    }
    if (attempt < maxAttempts - 1) {
      await sleep(delayMs);
    }
  }

  return { loggedIn: false, url };
}
