/**
 * 浏览器：CDP 连接与会话（统一出口）。
 */
export {
  connectBrowser,
  createPageCDPSession,
  LAUNCH_ARGS_ALLOW_ALL_CORS,
  LAUNCH_ARGS_LESS_AUTOMATION,
  type ConnectBrowserOptions,
} from './cdp_browser.js';
export {
  disconnectBrowserSession,
  ensureAndGetBrowser,
  ensureBrowserSession,
  getBrowserRef,
  getPageRef,
  setSessionPage,
} from './browser_session.js';

export { withLoggedInPage } from './withLoggedInPage.js';
export * from './auth.js';
