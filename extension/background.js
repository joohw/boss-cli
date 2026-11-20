import { matchRequest, reportResponseHeaders, requestPatterns } from './request-rules.js';

const BOSS_ORIGIN = 'https://www.zhipin.com';
const EXCLUDED_PATH = /^\/web\/(?:user|passport)|^\/web\/common\/(?:403|nonsupport)\.html/i;
const eligibleTabs = new Set();
const sessions = new Map();
const transitions = new Map();
const notices = new Map();

function isGuardedPage(url) {
  return typeof url === 'string' && url.startsWith(BOSS_ORIGIN + '/') &&
    !EXCLUDED_PATH.test(new URL(url).pathname);
}

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

function reportError(tabId, message) {
  notices.set(tabId, message);
  console.error('[BOSS 页面守卫] 标签页 ' + tabId + ' ' + message);
}

function send(tabId, method, params) {
  return chrome.debugger.sendCommand({ tabId }, method, params);
}

async function detach(tabId, session) {
  if (sessions.get(tabId) !== session) return;
  session.phase = 'stopping';
  try {
    if (session.attached) await chrome.debugger.detach({ tabId });
  } catch (error) {
    session.phase = 'error';
    throw error;
  }
  if (sessions.get(tabId) === session) sessions.delete(tabId);
}

async function attach(tabId) {
  const session = {
    phase: 'starting',
    attached: false,
    counts: { assets: 0, reports: 0 },
  };
  sessions.set(tabId, session);
  notices.delete(tabId);
  try {
    await chrome.debugger.attach({ tabId }, '1.3');
    session.attached = true;
    await send(tabId, 'Network.setCacheDisabled', { cacheDisabled: true });
    await send(tabId, 'Fetch.enable', { patterns: requestPatterns });
  } catch (error) {
    try {
      await detach(tabId, session);
    } catch (detachError) {
      throw new Error(errorMessage(error) + '。断开调试失败：' + errorMessage(detachError));
    }
    throw error;
  }
  if (sessions.get(tabId) === session) session.phase = 'on';
}

function reconcile(tabId, enabled) {
  if (enabled) eligibleTabs.add(tabId);
  else eligibleTabs.delete(tabId);

  if (transitions.has(tabId) || eligibleTabs.has(tabId) === sessions.has(tabId)) return;
  const transition = (async () => {
    try {
      while (eligibleTabs.has(tabId) !== sessions.has(tabId)) {
        if (eligibleTabs.has(tabId)) await attach(tabId);
        else await detach(tabId, sessions.get(tabId));
      }
    } catch (error) {
      reportError(tabId, '自动连接状态更新失败：' + errorMessage(error));
    } finally {
      transitions.delete(tabId);
    }
  })();
  transitions.set(tabId, transition);
}

async function attachOpenTabs() {
  const tabs = await chrome.tabs.query({ url: BOSS_ORIGIN + '/*' });
  for (const tab of tabs) {
    if (Number.isInteger(tab.id) && isGuardedPage(tab.pendingUrl ?? tab.url)) {
      reconcile(tab.id, true);
    }
  }
}

function startOpenTabs() {
  void attachOpenTabs().catch(error => {
    console.error('[BOSS 页面守卫] 读取已打开标签页失败：' + errorMessage(error));
  });
}

chrome.runtime.onInstalled.addListener(startOpenTabs);
chrome.runtime.onStartup.addListener(startOpenTabs);

chrome.webNavigation.onBeforeNavigate.addListener(({ tabId, frameId, url }) => {
  if (frameId === 0 && !isGuardedPage(url)) reconcile(tabId, false);
});

chrome.webNavigation.onCommitted.addListener(({ tabId, frameId, url }) => {
  if (frameId === 0) reconcile(tabId, isGuardedPage(url));
});

async function handleRequest(tabId, session, { request, requestId }) {
  const kind = eligibleTabs.has(tabId) && matchRequest(request.url);
  if (kind === 'reports') {
    await send(tabId, 'Fetch.fulfillRequest', {
      requestId,
      responseCode: 204,
      responsePhrase: 'No Content',
      responseHeaders: reportResponseHeaders(request.headers),
    });
  } else if (kind === 'assets') {
    await send(tabId, 'Fetch.failRequest', { requestId, errorReason: 'BlockedByClient' });
  } else {
    // Release unmatched requests and requests issued as the tab leaves the guarded scope.
    await send(tabId, 'Fetch.continueRequest', { requestId });
  }
  if (kind) session.counts[kind] += 1;
}

chrome.debugger.onEvent.addListener(({ tabId }, method, params) => {
  const session = sessions.get(tabId);
  if (!session || method !== 'Fetch.requestPaused') return;
  void handleRequest(tabId, session, params).catch(error => {
    if (!eligibleTabs.has(tabId) || sessions.get(tabId) !== session) return;
    const url = new URL(params.request.url);
    reportError(tabId, '处理请求失败（' + url.hostname + url.pathname + '）：' + errorMessage(error));
    reconcile(tabId, false);
  });
});

chrome.debugger.onDetach.addListener(({ tabId }, reason) => {
  const session = sessions.get(tabId);
  if (!session) return;
  sessions.delete(tabId);
  if (session.phase !== 'stopping') {
    eligibleTabs.delete(tabId);
    notices.set(tabId, 'Chrome 已断开调试（' + reason + '）。下次加载 BOSS 页面时会自动连接。');
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  eligibleTabs.delete(tabId);
  notices.delete(tabId);
});

async function status(tabId) {
  const tab = await chrome.tabs.get(tabId);
  const session = sessions.get(tabId);
  return {
    eligible: isGuardedPage(tab.pendingUrl ?? tab.url),
    phase: session?.phase ?? 'off',
    counts: session?.counts,
    notice: notices.get(tabId),
  };
}

chrome.runtime.onMessage.addListener((message, sender, reply) => {
  if (sender.url !== chrome.runtime.getURL('popup.html') ||
      message?.action !== 'status' || !Number.isInteger(message.tabId)) {
    return false;
  }
  status(message.tabId).then(
    value => reply({ value }),
    error => reply({ error: errorMessage(error) }),
  );
  return true;
});
