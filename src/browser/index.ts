/**
 * 浏览器：CDP 连接与会话（统一出口）。
 */
export * from './timing.js';
export * from './human_delay.js';
export {
  connectBrowser,
  createPageCDPSession,
  defaultViewportFromEnv,
  LAUNCH_ARGS_ALLOW_ALL_CORS,
  LAUNCH_ARGS_LESS_AUTOMATION,
  type ConnectBrowserOptions,
  wasLastChromeLaunchHeadless,
} from './cdp_browser.js';
export {
  detachBrowserSession,
  disconnectBrowserSession,
  ensureAndGetBrowser,
  ensureBrowserSession,
  getBrowserRef,
  getPageRef,
  setSessionPage,
} from './browser_session.js';

export * from './auth.js';
export { withChatPage } from './chat.js';
