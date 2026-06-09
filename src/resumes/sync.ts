import { access } from 'node:fs/promises';
import type { Page } from 'puppeteer-core';
import { ONLINE_RESUME_IFRAME_WAIT_MAX_MS, OPEN_CHAT_SCROLL_GAP_MS, sleepRandom } from '../browser/index.js';
import { isBossChatIndexUrl, probeLoggedInFromPage } from '../common/auth.js';
import { clickBossSidebarMenuToPath } from '../common/boss_sidebar_nav.js';
import {
  closeBossPaywallPopupIfPresent,
  describeBossPaywallPopupIfPresent,
  waitForCResumeIframeOrPaywall,
} from '../common/boss_paywall_popup.js';
import {
  closeCResumePanel,
  findVisibleCResumeIframeHandle,
  waitForVisibleCResumeIframeReady,
} from '../common/c_resume_capture.js';
import {
  ensureInDeepSearchPage,
  isBossChatAiFormUrl,
  openDeepSearchResumePreviewByCandidate,
  readAiFormSelectedJobLabel,
  readDeepSearchGeekList,
  selectAiFormJob,
} from '../toolset/deep-search.js';
import { ensureChatIndexAllFilter, readCandidateListItems } from '../toolset/list.js';
import {
  ensureInRecommendPage,
  openRecommendResumePreviewByCandidate,
  readRecommendList,
  selectRecommendJob,
} from '../toolset/recommend.js';
import { collectIdentifierHitsFromUrl, resolveIdentifiers } from './identifiers.js';
import { normalizeResumeApiPayload, normalizeResumeFrameSnapshot } from './normalize.js';
import type { ResumeSyncCliOptions } from './options.js';
import { BossResumeObserver } from './observer.js';
import {
  getResumeSyncRoot,
  persistResumeArtifacts,
  readExistingCandidateEntry,
  upsertCandidateFailureEntry,
} from './storage.js';
import type {
  CandidateIndexEntry,
  NormalizedResumeData,
  ResolvedResumeCandidate,
  ResumeSource,
  ResumeSyncResult,
  SourceCandidate,
} from './types.js';

type ResumeDownloadPayload = {
  fetchedAt: string;
  rawResponse: unknown;
  resume: NormalizedResumeData;
};

type ResumeViewSnapshot = {
  iframeSrc: string;
  resumeUrl: string;
  apiUrl?: string;
  pageTitle: string;
  rawText: string;
  urls: string[];
};

type FetchResult = {
  ok: boolean;
  status: number;
  url: string;
  contentType: string;
  body: string;
  error?: string;
};

const AUTH_OR_RISK_PATTERN =
  /(?:\blogin\b|forbidden|captcha|risk|\u767b\u5f55|\u626b\u7801|\u9a8c\u8bc1\u7801|\u98ce\u63a7|\u8d26\u53f7)/i;

class ResumeSyncAbortError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ResumeSyncAbortError';
  }
}

function pickNumber(meta: Record<string, string | number | boolean | null>, key: string): number | undefined {
  const value = meta[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

async function fileExists(target: string | undefined): Promise<boolean> {
  if (!target) {
    return false;
  }
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

async function hasCompletedResumeArtifacts(entry: CandidateIndexEntry | null): Promise<boolean> {
  if (!entry || entry.status !== 'downloaded') {
    return false;
  }
  return (
    (await fileExists(entry.artifacts?.resumeJsonPath)) &&
    (await fileExists(entry.artifacts?.resumeMarkdownPath))
  );
}

async function assertLoggedIn(page: Page): Promise<void> {
  const { loggedIn, url } = await probeLoggedInFromPage(page);
  if (!loggedIn) {
    throw new ResumeSyncAbortError(`Boss 登录态无效，请先重新登录后再执行 resumes（当前页：${url || 'unknown'}）。`);
  }
}

async function ensureDeepSearchRoute(page: Page): Promise<void> {
  if (!isBossChatAiFormUrl(page.url())) {
    await clickBossSidebarMenuToPath(page, '深度搜索', '/web/chat/aiform');
  }
  await ensureInDeepSearchPage(page);
}

async function openChatOnlineResume(page: Page): Promise<boolean> {
  return (await page.evaluate(`(() => {
    const anchor = document.querySelector("a.resume-btn-online");
    if (!(anchor instanceof HTMLElement)) return false;
    if (anchor.classList.contains("disabled")) return false;
    const style = window.getComputedStyle(anchor);
    if (style.pointerEvents === "none" || style.display === "none" || style.visibility === "hidden") {
      return false;
    }
    anchor.scrollIntoView({ block: "center", inline: "nearest" });
    anchor.click();
    return true;
  })()`)) as boolean;
}

async function openChatConversationByCandidate(
  page: Page,
  target: { name: string; job?: string; listIndex?: number },
): Promise<string> {
  const targetName = target.name.trim();
  const targetJob = target.job?.trim() || '';
  const targetNameLiteral = JSON.stringify(targetName);
  const targetJobLiteral = JSON.stringify(targetJob);
  const targetIndexLiteral =
    typeof target.listIndex === 'number' && target.listIndex >= 0
      ? String(target.listIndex)
      : 'null';

  await ensureChatIndexAllFilter(page);
  if (!isBossChatIndexUrl(page.url())) {
    throw new Error('当前不在聊天列表页（/web/chat/index），无法打开候选人聊天。');
  }

  let foundName = '';
  const maxScrollRounds = 40;
  for (let round = 0; round < maxScrollRounds; round++) {
    const result = (await page.evaluate(`(() => {
      const raw = ${targetNameLiteral};
      const targetJob = ${targetJobLiteral};
      const targetIndex = ${targetIndexLiteral};
      const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
      const wraps = Array.from(document.querySelectorAll(".geek-item-wrap"));
      if (wraps.length === 0) {
        return { kind: "scroll", moved: false, atEnd: true };
      }

      function matchWrap(wrap) {
        const name = norm(wrap.querySelector(".geek-name")?.textContent);
        if (!name || name !== raw) return false;
        const job = norm(wrap.querySelector(".source-job")?.textContent);
        if (targetJob && job !== targetJob) return false;
        return true;
      }

      let targetWrap = null;
      if (targetIndex !== null && targetIndex >= 0 && targetIndex < wraps.length) {
        const indexed = wraps[targetIndex];
        targetWrap = matchWrap(indexed) ? indexed : null;
      }
      if (!targetWrap) {
        targetWrap = wraps.find((wrap) => matchWrap(wrap)) ?? null;
      }
      if (targetWrap) {
        const name = norm(targetWrap.querySelector(".geek-name")?.textContent);
        const row = targetWrap.querySelector(".geek-item") ?? targetWrap;
        row.scrollIntoView({ behavior: "instant", block: "center", inline: "nearest" });
        row.click();
        return { kind: "clicked", foundName: name };
      }

      const first = wraps[0];
      let node = first.parentElement;
      let scroller = null;
      while (node) {
        const style = window.getComputedStyle(node);
        const overflowY = style.overflowY;
        const canScroll =
          (overflowY === "auto" || overflowY === "scroll") &&
          node.scrollHeight > node.clientHeight;
        if (canScroll) {
          scroller = node;
          break;
        }
        node = node.parentElement;
      }
      if (!scroller) return { kind: "scroll", moved: false, atEnd: true };
      const prev = scroller.scrollTop;
      const step = Math.max(160, Math.floor(scroller.clientHeight * 0.8));
      scroller.scrollTop = Math.min(scroller.scrollTop + step, scroller.scrollHeight);
      const moved = scroller.scrollTop !== prev;
      const atEnd = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2;
      return { kind: "scroll", moved, atEnd };
    })()`)) as
      | { kind: 'clicked'; foundName: string }
      | { kind: 'scroll'; moved: boolean; atEnd: boolean };
    if (result.kind === 'clicked') {
      foundName = result.foundName;
      break;
    }
    if (!result.moved || result.atEnd) {
      break;
    }
    await sleepRandom(OPEN_CHAT_SCROLL_GAP_MS.min, OPEN_CHAT_SCROLL_GAP_MS.max);
  }

  if (!foundName) {
    throw new Error(`未在聊天列表中找到候选人：${targetName}`);
  }

  await page.waitForFunction(
    `((name) => {
      const text = document.querySelector(".base-info-single-container .name-box")?.textContent ?? "";
      return text.replace(/\\s+/g, " ").trim().includes(name);
    })`,
    { timeout: 12_000 },
    foundName,
  );
  await page.waitForFunction(
    `(() => {
      const list = document.querySelector(".chat-message-list");
      if (!list) return false;
      const items = list.querySelectorAll(".message-item");
      if (!items || items.length === 0) return false;
      return Array.from(items).some((item) => {
        const txt =
          item.querySelector(".item-friend .text span")?.textContent ??
          item.querySelector(".item-myself .text span")?.textContent ??
          item.querySelector(".item-system .message-card-top-title")?.textContent ??
          "";
        return txt.replace(/\\s+/g, " ").trim().length > 0;
      });
    })()`,
    { timeout: 16_000 },
  );

  return foundName;
}

async function readOpenResumeView(page: Page): Promise<ResumeViewSnapshot> {
  const iframeHandle = await findVisibleCResumeIframeHandle(page);
  if (!iframeHandle) {
    throw new Error('未检测到已打开的在线简历 iframe。');
  }

  try {
    const srcProperty = await iframeHandle.getProperty('src');
    const iframeSrcValue = await srcProperty.jsonValue();
    const iframeSrc = typeof iframeSrcValue === 'string' ? iframeSrcValue : '';
    const contentFrame = await iframeHandle.contentFrame();
    const resumeUrl = contentFrame?.url() || iframeSrc;
    if (!resumeUrl) {
      throw new Error('在线简历 iframe 已出现，但无法读取其地址。');
    }
    const pageTitle = contentFrame
      ? ((await contentFrame.evaluate(`(() => document.title || "")()`)) as string)
      : '';
    const rawText = contentFrame
      ? ((await contentFrame.evaluate(`(() => {
        const body = document.body;
        if (!body) return "";
        return (body.innerText || "").replace(/\\u00a0/g, " ").trim();
      })()`)) as string)
      : '';
    const resourceUrls: string[] = [];
    for (const frame of page.frames()) {
      const urls = (await frame
        .evaluate(`(() => performance.getEntriesByType("resource").map((entry) => entry.name))()`)
        .catch(() => [])) as string[];
      resourceUrls.push(...urls);
    }
    const apiUrl = resourceUrls.find((url) => url.includes('/wapi/zpjob/view/geek/info/v2'));
    return {
      iframeSrc,
      resumeUrl,
      apiUrl,
      pageTitle,
      rawText,
      urls: [iframeSrc, resumeUrl, apiUrl, ...resourceUrls]
        .filter((item): item is string => !!item && item.length > 0),
    };
  } finally {
    await iframeHandle.dispose().catch(() => {});
  }
}

async function waitForResumeApiUrl(page: Page, timeoutMs = 10_000): Promise<string | null> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    for (const frame of page.frames()) {
      const urls = (await frame
        .evaluate(`(() => performance.getEntriesByType("resource").map((entry) => entry.name))()`)
        .catch(() => [])) as string[];
      const found = urls.find((url) => url.includes('/wapi/zpjob/view/geek/info/v2'));
      if (found) {
        return found;
      }
    }
    await sleepRandom(180, 260);
  }
  return null;
}

function ensureResumeViewMatchesCandidate(
  candidate: ResolvedResumeCandidate,
  view: ResumeViewSnapshot,
): void {
  const urlHits = view.urls.flatMap((url) => collectIdentifierHitsFromUrl(url));
  const resolved = resolveIdentifiers(urlHits, candidate.visibleGeekId);
  if (!resolved) {
    return;
  }
  if (
    resolved.encryptGeekId !== candidate.encryptGeekId ||
    resolved.encryptJobId !== candidate.encryptJobId ||
    resolved.securityId !== candidate.securityId
  ) {
    throw new Error(
      `当前打开的在线简历与候选人 ${candidate.candidateName} 不匹配，已停止本候选人的同步。`,
    );
  }
}

async function fetchResumeHtml(page: Page, resumeUrl: string): Promise<FetchResult> {
  return (await page.evaluate(`(async () => {
    const url = ${JSON.stringify(resumeUrl)};
    try {
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          accept: "text/html,application/xhtml+xml,application/json",
        },
      });
      const body = await response.text();
      return {
        ok: response.ok,
        status: response.status,
        url: response.url,
        contentType: response.headers.get("content-type") || "",
        body,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        ok: false,
        status: 0,
        url,
        contentType: "",
        body: "",
        error: message,
      };
    }
  })()`)) as FetchResult;
}

function assertHealthyFetch(result: FetchResult): void {
  if (result.error) {
    throw new Error(`在线简历 fetch 失败：${result.error}`);
  }
  if (result.status === 401 || result.status === 403) {
    throw new ResumeSyncAbortError(`在线简历接口返回 ${result.status}，已中止本次批量同步。`);
  }
  if (!result.ok) {
    throw new Error(`在线简历接口返回 ${result.status}。`);
  }
  const bodyProbe = `${result.url}\n${result.body.slice(0, 1200)}`;
  if (AUTH_OR_RISK_PATTERN.test(bodyProbe)) {
    throw new ResumeSyncAbortError('在线简历响应疑似已进入登录校验或风控页，已中止本次批量同步。');
  }
}

function buildSourceMeta(base: Record<string, string | number | boolean | null>): Record<string, string | number | boolean | null> {
  return base;
}

export async function collectSourceCandidates(
  page: Page,
  source: ResumeSource,
  options: ResumeSyncCliOptions,
): Promise<SourceCandidate[]> {
  if (source === 'recommend') {
    const frame = await ensureInRecommendPage(page);
    const selectedJob = await selectRecommendJob(frame, options.jobKeyword ?? '');
    const candidates = await readRecommendList(frame);
    return candidates.slice(0, options.limit).map((candidate) => ({
      source,
      name: candidate.name,
      jobLabel: selectedJob || 'unknown-job',
      visibleGeekId: candidate.geekId || undefined,
      sourceMeta: buildSourceMeta({
        listIndex: candidate.listIndex,
        canGreet: candidate.canGreet,
        hasHistoryChat: candidate.hasHistoryChat,
        hasViewed: candidate.hasViewed,
      }),
    }));
  }

  if (source === 'deep-search') {
    await ensureDeepSearchRoute(page);
    const selectedJob = options.jobKeyword
      ? await selectAiFormJob(page, options.jobKeyword)
      : await readAiFormSelectedJobLabel(page);
    const candidates = await readDeepSearchGeekList(page);
    return candidates.slice(0, options.limit).map((candidate) => ({
      source,
      name: candidate.name,
      jobLabel: selectedJob || 'unknown-job',
      sourceMeta: buildSourceMeta({
        listIndex: candidate.listIndex,
        meta: candidate.meta,
        work: candidate.work,
        edu: candidate.edu,
        reason: candidate.reason,
      }),
    }));
  }

  await ensureChatIndexAllFilter(page);
  const items = await readCandidateListItems(page);
  const visible = options.unreadOnly ? items.filter((item) => item.unreadCount > 0) : items;
  return visible.slice(0, options.limit).map((item) => ({
    source,
    name: item.name,
    jobLabel: item.job || 'unknown-job',
    sourceMeta: buildSourceMeta({
      listIndex: item.listIndex,
      unreadCount: item.unreadCount,
      time: item.time,
      message: item.message,
    }),
  }));
}

async function openSourceCandidateResume(page: Page, candidate: SourceCandidate): Promise<boolean> {
  if (candidate.source === 'recommend') {
    const frame = await ensureInRecommendPage(page);
    return openRecommendResumePreviewByCandidate(frame, {
      name: candidate.name,
      geekId: candidate.visibleGeekId,
      listIndex: pickNumber(candidate.sourceMeta, 'listIndex'),
    });
  }

  if (candidate.source === 'deep-search') {
    await ensureDeepSearchRoute(page);
    return openDeepSearchResumePreviewByCandidate(page, {
      name: candidate.name,
      listIndex: pickNumber(candidate.sourceMeta, 'listIndex'),
    });
  }

  await openChatConversationByCandidate(
    page,
    {
      name: candidate.name,
      job: candidate.jobLabel === 'unknown-job' ? undefined : candidate.jobLabel,
      listIndex: pickNumber(candidate.sourceMeta, 'listIndex'),
    },
  );
  return openChatOnlineResume(page);
}

export async function resolveCandidateIdentifiers(
  page: Page,
  sourceCandidate: SourceCandidate,
): Promise<ResolvedResumeCandidate | null> {
  await assertLoggedIn(page);
  await closeCResumePanel(page);

  const observer = new BossResumeObserver(page);
  await observer.start();
  try {
    const opened = await openSourceCandidateResume(page, sourceCandidate);
    if (!opened) {
      throw new Error(`未能从 ${sourceCandidate.source} 列表打开候选人 ${sourceCandidate.name} 的在线简历。`);
    }

    const outcome = await waitForCResumeIframeOrPaywall(page, ONLINE_RESUME_IFRAME_WAIT_MAX_MS);
    if (outcome === 'paywall') {
      const paywall = await describeBossPaywallPopupIfPresent(page);
      await closeBossPaywallPopupIfPresent(page);
      throw new ResumeSyncAbortError(paywall || '页面出现付费或权限弹层，已中止本次批量同步。');
    }
    if (outcome !== 'iframe') {
      throw new Error(`候选人 ${sourceCandidate.name} 点击后未出现在线简历 iframe。`);
    }

    await waitForResumeApiUrl(page);
    await waitForVisibleCResumeIframeReady(page).catch(() => false);

    await observer.flush();
    const view = await readOpenResumeView(page);
    const identifiers = observer.resolve(sourceCandidate.visibleGeekId, view.urls);
    if (!identifiers?.encryptGeekId || !identifiers.encryptJobId || !identifiers.securityId) {
      return null;
    }

    return {
      candidateName: sourceCandidate.name,
      jobName: sourceCandidate.jobLabel || 'unknown-job',
      encryptGeekId: identifiers.encryptGeekId,
      encryptJobId: identifiers.encryptJobId,
      securityId: identifiers.securityId,
      visibleGeekId: identifiers.visibleGeekId || sourceCandidate.visibleGeekId,
      source: sourceCandidate.source,
      sourceMeta: sourceCandidate.sourceMeta,
    };
  } finally {
    await observer.stop();
  }
}

export async function downloadResumeData(
  page: Page,
  candidate: ResolvedResumeCandidate,
): Promise<ResumeDownloadPayload> {
  await assertLoggedIn(page);
  const view = await readOpenResumeView(page);
  ensureResumeViewMatchesCandidate(candidate, view);

  const fetchedAt = new Date().toISOString();
  const downloadUrl = view.apiUrl || view.resumeUrl;
  const fetchResult = await fetchResumeHtml(page, downloadUrl);
  assertHealthyFetch(fetchResult);
  let parsedPayload: unknown | null = null;
  if (fetchResult.contentType.includes('json') || fetchResult.body.trimStart().startsWith('{')) {
    parsedPayload = JSON.parse(fetchResult.body) as unknown;
  }

  const resume =
    parsedPayload !== null
      ? normalizeResumeApiPayload({
          candidate,
          fetchedAt,
          resumeUrl: downloadUrl,
          pageTitle: view.pageTitle,
          payload: parsedPayload,
        })
      : normalizeResumeFrameSnapshot({
          candidate,
          fetchedAt,
          resumeUrl: view.resumeUrl,
          pageTitle: view.pageTitle,
          rawText: view.rawText,
        });
  if (!resume.rawText.trim()) {
    throw new Error(`候选人 ${candidate.candidateName} 的在线简历正文为空。`);
  }

  return {
    fetchedAt,
    rawResponse: {
      source: candidate.source,
      fetchedAt,
      identifiers: {
        encryptGeekId: candidate.encryptGeekId,
        encryptJobId: candidate.encryptJobId,
        securityId: candidate.securityId,
      },
      fetch: fetchResult,
      parsedPayload,
      frame: {
        iframeSrc: view.iframeSrc,
        resumeUrl: view.resumeUrl,
        apiUrl: view.apiUrl,
        pageTitle: view.pageTitle,
        rawText: view.rawText,
      },
    },
    resume,
  };
}

function formatResultLine(candidateName: string, result: ResumeSyncResult): string {
  return `- ${candidateName}: ${result.status} - ${result.message}`;
}

export async function syncResumesOnPage(
  page: Page,
  options: ResumeSyncCliOptions,
): Promise<string> {
  await assertLoggedIn(page);
  const candidates = await collectSourceCandidates(page, options.source, options);
  const rootDir = getResumeSyncRoot(options.rootDir);
  const results: string[] = [];
  const counts: Record<'downloaded' | 'skipped_existing' | 'missing_identifiers' | 'download_failed', number> = {
    downloaded: 0,
    skipped_existing: 0,
    missing_identifiers: 0,
    download_failed: 0,
  };

  for (const sourceCandidate of candidates) {
    let resolvedCandidate: ResolvedResumeCandidate | null = null;
    try {
      resolvedCandidate = await resolveCandidateIdentifiers(page, sourceCandidate);
      if (!resolvedCandidate) {
        const result: ResumeSyncResult = {
          status: 'missing_identifiers',
          message: '未拿到 encryptGeekId / encryptJobId / securityId。',
        };
        counts[result.status] += 1;
        results.push(formatResultLine(sourceCandidate.name, result));
        await upsertCandidateFailureEntry({
          rootDir: options.rootDir,
          candidateName: sourceCandidate.name,
          jobName: sourceCandidate.jobLabel || 'unknown-job',
          source: sourceCandidate.source,
          sourceMeta: sourceCandidate.sourceMeta,
          identifiers: {
            visibleGeekId: sourceCandidate.visibleGeekId,
          },
          status: 'missing_identifiers',
          message: result.message,
        });
        continue;
      }

      const existing = await readExistingCandidateEntry(options.rootDir, resolvedCandidate);
      if (await hasCompletedResumeArtifacts(existing)) {
        const result: ResumeSyncResult = {
          status: 'skipped_existing',
          message: 'resume.json 与 resume.md 已存在，已跳过。',
          artifacts: existing?.artifacts,
        };
        counts[result.status] += 1;
        results.push(formatResultLine(sourceCandidate.name, result));
        continue;
      }

      const payload = await downloadResumeData(page, resolvedCandidate);
      const artifacts = await persistResumeArtifacts({
        rootDir: options.rootDir,
        source: sourceCandidate.source,
        candidate: resolvedCandidate,
        rawResponse: payload.rawResponse,
        resume: payload.resume,
      });
      const result: ResumeSyncResult = {
        status: 'downloaded',
        message: '在线简历已同步。',
        artifacts,
      };
      counts[result.status] += 1;
      results.push(formatResultLine(sourceCandidate.name, result));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const failureCandidate = resolvedCandidate;
      const status: ResumeSyncResult['status'] = 'download_failed';
      await upsertCandidateFailureEntry({
        rootDir: options.rootDir,
        candidateName: sourceCandidate.name,
        jobName: sourceCandidate.jobLabel || 'unknown-job',
        source: sourceCandidate.source,
        sourceMeta: sourceCandidate.sourceMeta,
        identifiers: failureCandidate
          ? {
              encryptGeekId: failureCandidate.encryptGeekId,
              encryptJobId: failureCandidate.encryptJobId,
              securityId: failureCandidate.securityId,
              visibleGeekId: failureCandidate.visibleGeekId,
            }
          : { visibleGeekId: sourceCandidate.visibleGeekId },
        status,
        message,
      });
      if (error instanceof ResumeSyncAbortError) {
        throw error;
      }
      counts.download_failed += 1;
      results.push(formatResultLine(sourceCandidate.name, { status, message }));
    } finally {
      await closeCResumePanel(page).catch(() => {});
      await closeBossPaywallPopupIfPresent(page).catch(() => {});
      await sleepRandom(220, 420);
    }
  }

  const summary = [
    `boss resumes 完成：source=${options.source}`,
    `候选人数量：${candidates.length}`,
    `输出目录：${rootDir}`,
    `结果汇总：downloaded=${counts.downloaded}, skipped_existing=${counts.skipped_existing}, missing_identifiers=${counts.missing_identifiers}, download_failed=${counts.download_failed}`,
  ];
  if (results.length === 0) {
    summary.push('明细：暂无候选人。');
    return summary.join('\n');
  }
  return [...summary, '', ...results].join('\n');
}
