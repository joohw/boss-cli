import { getPageRef } from '../browser/index.js';
import { probeLoggedInFromPage, sleep } from './login_shared.js';
import { runOpenChatList } from './open_chat_list.js';

type WaitForLoginOptions = {
  timeoutMs?: number;
  pollMs?: number;
};

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
 * 登录（手动）：打开 Boss 沟通列表页，并等待用户在浏览器中完成登录。
 * 成功返回纯文本；失败抛错（由 CLI 统一写入 stderr 并设置退出码）。
 */
export async function runLogin(options: WaitForLoginOptions = {}): Promise<string> {
  const timeoutMs = options.timeoutMs ?? 120_000;
  const pollMs = options.pollMs ?? 1_200;

  const openText = await runOpenChatList();
  const page = getPageRef();
  if (!page) {
    throw new Error('无法获取页面引用，登录失败。');
  }
  const { loggedIn, url } = await probeLoggedInFromPage(page);
  if (loggedIn) {
    return ['✅ 已登录', `当前页：${url}`].join('\n');
  }

  console.error(`⏰ 请在浏览器中完成登录（超时 ${Math.round(timeoutMs / 1000)} 秒）`);
  await waitForBossLogin({ timeoutMs, pollMs });

  const after = await probeLoggedInFromPage(page);
  return [
    '✅ 登录成功',
    `当前页：${after.url}`,
    '',
    openText.trimEnd(),
  ]
    .filter(Boolean)
    .join('\n');
}

