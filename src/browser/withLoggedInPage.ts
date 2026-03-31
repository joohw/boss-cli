import type { Page } from 'puppeteer-core';
import { ensureBrowserSession, getPageRef } from './browser_session.js';
import { probeLoggedInFromPage } from './auth.js';

/**
 * 获取一个“已登录”页面来执行回调；未登录则抛错提示先运行 `boss login`。
 * 说明：boss-cli 采用长期会话（CDP 连接）而非每次启动/关闭浏览器。
 */
export async function withLoggedInPage<T>(callback: (page: Page) => Promise<T>): Promise<T> {
  await ensureBrowserSession();
  const page = getPageRef();
  if (!page) {
    throw new Error('浏览器会话尚未初始化，请先运行 boss login。');
  }
  const { loggedIn } = await probeLoggedInFromPage(page);
  if (!loggedIn) {
    throw new Error('未检测到登录状态，请先运行 boss login 并在浏览器中完成登录。');
  }
  return callback(page);
}

