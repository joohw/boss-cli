import { access } from 'node:fs/promises';
import type { Frame, Page } from 'puppeteer-core';
import { ONLINE_RESUME_IFRAME_WAIT_MAX_MS, OPEN_CHAT_SCROLL_GAP_MS, sleepRandom } from '../browser/index.js';
import { isBossChatIndexUrl, probeLoggedInFromPage } from '../common/auth.js';
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
import { ensureChatIndexAllFilter, readCandidateListItems } from '../toolset/list.js';
import { runDeepSearchMatchOnPage, type DeepSearchRunContext } from '../toolset/deep-search.js';
import {
  ensureInRecommendPage,
  openRecommendResumePreviewByCandidate,
  readRecommendList,
  selectRecommendJob,
} from '../toolset/recommend.js';
import { collectIdentifierHits, collectIdentifierHitsFromUrl, resolveIdentifiers } from './identifiers.js';
import { normalizeRecruiterResumePayload } from './normalize.js';
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
  ResumeIdentifiers,
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

type ResumeSyncCounts = Record<'downloaded' | 'skipped_existing' | 'missing_identifiers' | 'download_failed', number>;

type ResumeSyncResultItem = {
  source: ResumeSource;
  candidateName: string;
  jobName: string;
  status: ResumeSyncResult['status'];
  message: string;
  candidateId?: string;
  jobId?: string;
  securityId?: string;
  visibleGeekId?: string;
  artifacts?: ResumeSyncResult['artifacts'];
};

type ResumeSyncStructuredOutput = {
  ok: boolean;
  source: ResumeSource;
  limit: number;
  root: string;
  searchContext?: ResumeSyncSearchContext;
  candidateCount: number;
  counts: ResumeSyncCounts;
  results: ResumeSyncResultItem[];
};

type ResumeSyncSearchContext = {
  requestedJobKeyword: string;
  selectedJob: string;
  coreRequirements: string[];
  bonusRequirements: string[];
  remainingCountText: string;
  resultUrl: string;
  candidateCount: number;
};

const AUTH_OR_RISK_PATTERN =
  /(?:\blogin\b|forbidden|captcha|risk|\u767b\u5f55|\u626b\u7801|\u9a8c\u8bc1\u7801|\u98ce\u63a7|\u8d26\u53f7)/i;

const BOSS_CHAT_SEARCH_URL = 'https://www.zhipin.com/web/chat/search';

const CANVAS_TEXT_CAPTURE_SCRIPT = `(() => {
  if (window.__bossCliResumeCanvasCaptureInstalled) return;
  Object.defineProperty(window, "__bossCliResumeCanvasCaptureInstalled", {
    value: true,
    configurable: false,
  });
  const captured = [];
  Object.defineProperty(window, "__bossCliResumeCanvasText", {
    value: captured,
    configurable: false,
  });
  const normalize = (value) => String(value ?? "").replace(/\\u00a0/g, " ").replace(/\\s+/g, " ").trim();
  const canvasTranslateY = (context) => {
    const canvas = context && context.canvas;
    if (!canvas) return 0;
    const transform = canvas.style && canvas.style.transform || window.getComputedStyle(canvas).transform || "";
    const translate = /translateY\\((-?\\d+(?:\\.\\d+)?)px\\)/.exec(transform);
    if (translate) return Number(translate[1]) || 0;
    const matrix = /matrix\\([^,]+,[^,]+,[^,]+,[^,]+,[^,]+,\\s*(-?\\d+(?:\\.\\d+)?)\\)/.exec(transform);
    if (matrix) return Number(matrix[1]) || 0;
    return 0;
  };
  const pushText = (context, text, x, y) => {
    const value = normalize(text);
    if (!value) return;
    const doc = document.scrollingElement || document.documentElement || document.body;
    const scrollTop = Number(window.scrollY || doc && doc.scrollTop || 0);
    const offsetY = scrollTop + canvasTranslateY(context);
    captured.push({
      text: value,
      x: Number.isFinite(Number(x)) ? Number(x) : null,
      y: Number.isFinite(Number(y)) ? Number(y) + offsetY : null,
      at: Date.now(),
    });
  };
  const patch = (prototype, method) => {
    if (!prototype || typeof prototype[method] !== "function") return;
    const original = prototype[method];
    if (original.__bossCliResumeCanvasPatched) return;
    const wrapped = function (...args) {
      pushText(this, args[0], args[1], args[2]);
      return original.apply(this, args);
    };
    Object.defineProperty(wrapped, "__bossCliResumeCanvasPatched", {
      value: true,
      configurable: false,
    });
    prototype[method] = wrapped;
  };
  patch(window.CanvasRenderingContext2D && window.CanvasRenderingContext2D.prototype, "fillText");
  patch(window.CanvasRenderingContext2D && window.CanvasRenderingContext2D.prototype, "strokeText");
})()`;

const canvasCaptureInstalledPages = new WeakSet<Page>();

async function installResumeCanvasTextCapture(page: Page): Promise<void> {
  if (canvasCaptureInstalledPages.has(page)) {
    return;
  }
  await page.evaluateOnNewDocument(CANVAS_TEXT_CAPTURE_SCRIPT);
  canvasCaptureInstalledPages.add(page);
}

function isResumeDataApiUrl(url: string): boolean {
  return (
    url.includes('/wapi/zpjob/view/geek/info') ||
    url.includes('/wapi/zpjob/view/geek/info/v2') ||
    url.includes('/wapi/zpitem/web/boss/search/geek/info')
  );
}

export function buildRecruiterResumeInfoUrl(candidate: Pick<
  ResolvedResumeCandidate,
  'encryptGeekId' | 'encryptJobId' | 'securityId'
>): string {
  const url = new URL('/wapi/zpjob/view/geek/info', 'https://www.zhipin.com');
  url.searchParams.set('encryptGeekId', candidate.encryptGeekId);
  url.searchParams.set('encryptJobId', candidate.encryptJobId);
  url.searchParams.set('securityId', candidate.securityId);
  return url.toString();
}

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
  if (!isBossChatSearchUrl(page.url())) {
    await page.goto(BOSS_CHAT_SEARCH_URL, {
      waitUntil: 'load',
      timeout: 60_000,
    });
  }
  await ensureSearchFrameReady(page);
}

function isBossChatSearchUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (!u.hostname.includes('zhipin.com')) {
      return false;
    }
    const p = u.pathname.replace(/\/+$/, '') || '/';
    return p === '/web/chat/search';
  } catch {
    return false;
  }
}

function findSearchFrame(page: Page): Frame | null {
  return (
    page.frames().find((frame) => frame.name() === 'searchFrame') ??
    page.frames().find((frame) => frame.url().includes('/web/frame/search/')) ??
    null
  );
}

async function getSearchFrame(page: Page): Promise<Frame> {
  await page.waitForFunction(
    `(() => {
      const iframe = document.querySelector('iframe[name="searchFrame"], iframe[src*="/web/frame/search/"]');
      return !!iframe;
    })()`,
    { timeout: 20_000 },
  );
  const deadline = Date.now() + 20_000;
  let frame = findSearchFrame(page);
  while (!frame && Date.now() < deadline) {
    await sleepRandom(160, 240);
    frame = findSearchFrame(page);
  }
  if (!frame) {
    throw new Error('搜索页 iframe（searchFrame）已出现，但无法连接其页面上下文。');
  }
  return frame;
}

async function ensureSearchFrameReady(page: Page): Promise<Frame> {
  const frame = await getSearchFrame(page);
  await frame.waitForFunction(
    `(() => document.querySelectorAll('a .card-container, a .search-geek-info').length > 0)()`,
    { timeout: 20_000 },
  );
  return frame;
}

async function readSearchSelectedJobLabel(page: Page): Promise<string> {
  return (await page.evaluate(`(() => {
    const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
    const menu = norm(document.querySelector(".menu-geeksearch .menu-item-content")?.textContent);
    const label = menu.replace(/^搜索\\s*/, "").trim();
    return label || "搜索";
  })()`)) as string;
}

async function readSearchCandidateList(frame: Frame): Promise<SourceCandidate[]> {
  return (await frame.evaluate(`(() => {
    const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
    const anchors = Array.from(document.querySelectorAll("a"))
      .filter((anchor) => anchor.querySelector(".card-container, .search-geek-info"));
    return anchors.map((anchor, index) => {
      const rawName = norm(
        anchor.querySelector(".geek-name, .name, .base-info-name, .name-text")?.textContent ||
        anchor.querySelector(".search-geek-info")?.textContent ||
        ""
      );
      const name = rawName.replace(/\\s*(刚刚活跃|今日活跃|本周活跃|月内活跃).*$/, "").trim() || rawName || ("搜索候选人" + (index + 1));
      const meta = norm(anchor.querySelector(".geek-info-detail, .card-container")?.textContent || "");
      const buttonText = norm(anchor.querySelector("button, .btn")?.textContent || "");
      return {
        source: "deep-search",
        name,
        jobLabel: "搜索",
        sourceMeta: {
          listIndex: index,
          meta,
          buttonText,
          ka: anchor.getAttribute("ka") || "",
        },
      };
    });
  })()`)) as SourceCandidate[];
}

async function openSearchResumePreviewByCandidate(
  frame: Frame,
  candidate: { name: string; listIndex?: number },
): Promise<boolean> {
  const nameLiteral = JSON.stringify(candidate.name.trim());
  const indexLiteral =
    typeof candidate.listIndex === 'number' && candidate.listIndex >= 0
      ? String(candidate.listIndex)
      : 'null';
  return (await frame.evaluate(`(() => {
    const targetName = ${nameLiteral};
    const targetIndex = ${indexLiteral};
    const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
    const cards = Array.from(document.querySelectorAll("a"))
      .filter((anchor) => anchor.querySelector(".card-container, .search-geek-info"));
    const target =
      (targetIndex !== null ? cards[targetIndex] : null) ||
      cards.find((anchor) => {
        const text = norm(
          anchor.querySelector(".geek-name, .name, .base-info-name, .name-text")?.textContent ||
          anchor.querySelector(".search-geek-info")?.textContent ||
          ""
        );
        return text === targetName || text.includes(targetName);
      });
    if (!(target instanceof HTMLElement)) return false;
    target.scrollIntoView({ block: "center", inline: "nearest" });
    target.dispatchEvent(new MouseEvent("mouseover", { bubbles: true, cancelable: true, view: window }));
    target.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true, view: window }));
    target.dispatchEvent(new MouseEvent("mouseup", { bubbles: true, cancelable: true, view: window }));
    target.click();
    return true;
  })()`)) as boolean;
}

async function openChatOnlineResume(page: Page): Promise<boolean> {
  const position = await page.waitForFunction(
    `(() => {
      const root = document.querySelector(".base-info-single-container");
      if (!(root instanceof HTMLElement)) return null;
      const anchor = root.querySelector("a.resume-btn-online");
      if (!(anchor instanceof HTMLElement)) return null;
      if (anchor.classList.contains("disabled")) return null;
      const style = window.getComputedStyle(anchor);
      if (style.pointerEvents === "none" || style.display === "none" || style.visibility === "hidden") {
        return null;
      }
      const rect = anchor.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return null;
      anchor.scrollIntoView({ block: "center", inline: "nearest" });
      const next = anchor.getBoundingClientRect();
      return { x: next.left + next.width / 2, y: next.top + next.height / 2 };
    })()`,
    { timeout: 10_000 },
  );
  const point = (await position.jsonValue()) as { x?: number; y?: number } | null;
  await position.dispose();
  if (!point || typeof point.x !== 'number' || typeof point.y !== 'number') {
    return false;
  }
  await sleepRandom(180, 320);
  await page.mouse.move(point.x, point.y, { steps: 8 });
  await sleepRandom(120, 220);
  await page.mouse.down();
  await sleepRandom(100, 180);
  await page.mouse.up();
  return true;
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
      const root = document.querySelector(".base-info-single-container");
      if (!(root instanceof HTMLElement)) return false;
      const anchor = root.querySelector("a.resume-btn-online");
      if (!(anchor instanceof HTMLElement)) return false;
      const style = window.getComputedStyle(anchor);
      const rect = anchor.getBoundingClientRect();
      return (
        rect.width > 0 &&
        rect.height > 0 &&
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        style.pointerEvents !== "none"
      );
    })()`,
    { timeout: 12_000 },
  );

  return foundName;
}

async function readFrameVisibleTextOnce(frame: Frame): Promise<string> {
  return (await frame
    .evaluate(`(() => {
      const normalize = (value) => value.replace(/\\u00a0/g, " ").replace(/[ \\t]+/g, " ").trim();
      const readCanvasText = () => {
        const repairDuplicateGlyphs = (line) => {
          const duplicateMatches = line.match(/([\\u4e00-\\u9fffA-Za-z0-9，。；：、,.：;:()（）-])\\1/g) || [];
          if (line.length < 12 || duplicateMatches.length / line.length < 0.15) {
            return line;
          }
          return line.replace(/([\\u4e00-\\u9fffA-Za-z0-9，。；：、,.：;:()（）-])\\1+/g, "$1");
        };
        const rows = Array.isArray(window.__bossCliResumeCanvasText)
          ? window.__bossCliResumeCanvasText
          : [];
        const items = rows
          .map((row) => ({
            text: normalize(row && row.text),
            x: Number(row && row.x),
            y: Number(row && row.y),
          }))
          .filter((row) => row.text);
        const coordItems = Array.from(
          new Map(
            items
              .filter((row) => Number.isFinite(row.x) && Number.isFinite(row.y))
              .map((row) => [Math.round(row.y) + ":" + Math.round(row.x) + ":" + row.text, row]),
          ).values(),
        ).sort((a, b) => (a.y === b.y ? a.x - b.x : a.y - b.y));
        if (coordItems.length > 0) {
          const groups = [];
          for (const item of coordItems) {
            const group = groups.find((entry) => Math.abs(entry.y - item.y) <= 3);
            if (group) {
              group.items.push(item);
              group.y = (group.y + item.y) / 2;
            } else {
              groups.push({ y: item.y, items: [item] });
            }
          }
          return groups
            .sort((a, b) => a.y - b.y)
            .map((group) => {
              const deduped = [];
              for (const item of group.items.sort((a, b) => a.x - b.x)) {
                const previous = deduped[deduped.length - 1];
                if (previous && previous.text === item.text && Math.abs(previous.x - item.x) <= 2) {
                  continue;
                }
                deduped.push(item);
              }
              return repairDuplicateGlyphs(deduped.map((item) => item.text).join(""));
            })
            .join("\\n")
            .replace(/\\n{3,}/g, "\\n\\n")
            .trim();
        }
        const texts = items.map((row) => row.text);
        return texts.join("\\n").replace(/\\n{3,}/g, "\\n\\n").trim();
      };
      const ignoredTags = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE"]);
      const isHidden = (node) => {
        let current = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
        while (current && current !== document.body) {
          const style = window.getComputedStyle(current);
          if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") {
            return true;
          }
          current = current.parentElement;
        }
        return false;
      };
      const collectRootText = (root, out) => {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
          acceptNode(node) {
            const parent = node.parentElement;
            if (!parent || ignoredTags.has(parent.tagName) || isHidden(parent)) {
              return NodeFilter.FILTER_REJECT;
            }
            return normalize(node.nodeValue || "").length > 0
              ? NodeFilter.FILTER_ACCEPT
              : NodeFilter.FILTER_REJECT;
          },
        });
        while (walker.nextNode()) {
          out.push(normalize(walker.currentNode.nodeValue || ""));
        }
        const elements = root.querySelectorAll ? Array.from(root.querySelectorAll("*")) : [];
        for (const element of elements) {
          if (element.shadowRoot) {
            collectRootText(element.shadowRoot, out);
          }
        }
      };
      const body = document.body;
      if (!body) return "";
      const innerText = normalize(body.innerText || "");
      if (innerText.length >= 20) {
        return innerText;
      }
      const pieces = [];
      collectRootText(body, pieces);
      const domText = pieces.join("\\n").replace(/\\n{3,}/g, "\\n\\n").trim();
      if (domText.length >= 20) {
        return domText;
      }
      return readCanvasText();
    })()`)
    .catch(() => '')) as string;
}

async function scrollResumeContainerToTop(page: Page): Promise<void> {
  for (const targetFrame of page.frames()) {
    const found = (await targetFrame
      .evaluate(`(() => {
      const isVisible = (el) => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return rect.width > 8 && rect.height > 8 && style.display !== "none" && style.visibility !== "hidden";
      };
      const iframe = Array.from(document.querySelectorAll("iframe")).find((el) => {
        const src = el.getAttribute("src") || "";
        return src.includes("c-resume") && isVisible(el);
      });
      if (!iframe) return false;
      let node = iframe.parentElement;
      while (node) {
        const style = window.getComputedStyle(node);
        const scrollable = node.scrollHeight > node.clientHeight + 8;
        const overflowOk = style.overflowY === "auto" || style.overflowY === "scroll" || style.overflowY === "overlay";
        if (scrollable && overflowOk) {
          node.scrollTop = 0;
          return true;
        }
        node = node.parentElement;
      }
      window.scrollTo(0, 0);
      return true;
    })()`)
      .catch(() => false)) as boolean;
    if (found) {
      return;
    }
  }
}

async function scrollResumeContainerDown(page: Page): Promise<{ moved: boolean; atEnd: boolean }> {
  for (const targetFrame of page.frames()) {
    const state = (await targetFrame
      .evaluate(`(() => {
      const isVisible = (el) => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return rect.width > 8 && rect.height > 8 && style.display !== "none" && style.visibility !== "hidden";
      };
      const iframe = Array.from(document.querySelectorAll("iframe")).find((el) => {
        const src = el.getAttribute("src") || "";
        return src.includes("c-resume") && isVisible(el);
      });
      if (!iframe) return { found: false, moved: false, atEnd: true };
      let node = iframe.parentElement;
      while (node) {
        const style = window.getComputedStyle(node);
        const scrollable = node.scrollHeight > node.clientHeight + 8;
        const overflowOk = style.overflowY === "auto" || style.overflowY === "scroll" || style.overflowY === "overlay";
        if (scrollable && overflowOk) {
          const prev = node.scrollTop;
          const maxTop = Math.max(0, node.scrollHeight - node.clientHeight);
          const step = Math.max(320, Math.floor(node.clientHeight * 0.75));
          node.scrollTop = Math.min(maxTop, prev + step);
          return {
            found: true,
            moved: node.scrollTop > prev,
            atEnd: node.scrollTop >= maxTop - 2,
          };
        }
        node = node.parentElement;
      }
      const doc = document.scrollingElement || document.documentElement || document.body;
      if (!doc) return { found: true, moved: false, atEnd: true };
      const prev = Math.max(window.scrollY || 0, doc.scrollTop || 0);
      const maxTop = Math.max(0, doc.scrollHeight - window.innerHeight);
      const step = Math.max(320, Math.floor(window.innerHeight * 0.75));
      const next = Math.min(maxTop, prev + step);
      window.scrollTo(0, next);
      doc.scrollTop = next;
      return {
        found: true,
        moved: next > prev,
        atEnd: next >= maxTop - 2,
      };
    })()`)
      .catch(() => ({ found: false, moved: false, atEnd: true }))) as {
      found: boolean;
      moved: boolean;
      atEnd: boolean;
    };
    if (state.found) {
      return {
        moved: state.moved,
        atEnd: state.atEnd,
      };
    }
  }
  return { moved: false, atEnd: true };
}

async function collectRenderedFrameText(page: Page, frame: Frame, timeoutMs: number): Promise<string> {
  const deadline = Date.now() + timeoutMs;
  let bestText = '';
  let stableAtEndCount = 0;
  await scrollResumeContainerToTop(page);
  while (Date.now() < deadline) {
    const text = (await readFrameVisibleTextOnce(frame)).replace(/\n{3,}/g, '\n\n').trim();
    if (text.length > bestText.length) {
      bestText = text;
      stableAtEndCount = 0;
    }
    const scrollState = await scrollResumeContainerDown(page);
    if (!scrollState.moved && scrollState.atEnd) {
      stableAtEndCount += 1;
      if (stableAtEndCount >= 2) {
        break;
      }
    }
    await sleepRandom(360, 520);
  }
  return bestText;
}

async function readVisibleResumeFrameText(page: Page, frame: Frame, timeoutMs = 12_000): Promise<string> {
  const deadline = Date.now() + timeoutMs;
  let lastText = '';
  while (Date.now() < deadline) {
    const remaining = Math.max(1_000, deadline - Date.now());
    const frameTexts = await Promise.all(
      [frame, ...frame.childFrames()].map((item) => collectRenderedFrameText(page, item, remaining)),
    );
    const rawText = Array.from(new Set(frameTexts.map((item) => item.trim()).filter(Boolean))).join('\n\n');
    const text = rawText.replace(/\n{3,}/g, '\n\n').trim();
    if (text.length >= 20 && text.length === lastText.length) {
      return text;
    }
    if (text.length > lastText.length) {
      lastText = text;
    }
    await sleepRandom(180, 260);
  }
  return lastText;
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
    const rawText = contentFrame ? await readVisibleResumeFrameText(page, contentFrame) : '';
    const resourceUrls: string[] = [];
    for (const frame of page.frames()) {
      const urls = (await frame
        .evaluate(`(() => performance.getEntriesByType("resource").map((entry) => entry.name))()`)
        .catch(() => [])) as string[];
      resourceUrls.push(...urls);
    }
    const apiUrl = [...resourceUrls].reverse().find((url) => isResumeDataApiUrl(url));
    return {
      iframeSrc,
      resumeUrl,
      apiUrl,
      pageTitle,
      rawText,
      urls: [iframeSrc, resumeUrl, apiUrl]
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
      const found = [...urls].reverse().find((url) => isResumeDataApiUrl(url));
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

async function resolveIdentifiersFromResumeApi(
  page: Page,
  apiUrl: string | undefined,
  preferredVisibleGeekId?: string,
): Promise<ResumeIdentifiers | null> {
  if (!apiUrl || !isResumeDataApiUrl(apiUrl)) {
    return null;
  }
  const result = await fetchResumeHtml(page, apiUrl);
  assertHealthyFetch(result);
  if (!result.contentType.includes('json') && !result.body.trimStart().startsWith('{')) {
    return null;
  }
  const payload = JSON.parse(result.body) as unknown;
  return resolveIdentifiers(
    [
      ...collectIdentifierHitsFromUrl(result.url || apiUrl),
      ...collectIdentifierHits(payload, result.url || apiUrl),
    ],
    preferredVisibleGeekId,
  );
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
    if (options.jobKeyword) {
      throw new Error('当前 BOSS 搜索页（/web/chat/search）暂不支持通过 --job 切换岗位，请先在页面选择岗位后再运行。');
    }
    const frame = await ensureSearchFrameReady(page);
    const selectedJob = await readSearchSelectedJobLabel(page);
    const candidates = await readSearchCandidateList(frame);
    return candidates.slice(0, options.limit).map((candidate) => ({
      source,
      name: candidate.name,
      jobLabel: selectedJob || 'unknown-job',
      sourceMeta: buildSourceMeta({
        listIndex: pickNumber(candidate.sourceMeta, 'listIndex') ?? null,
        meta: candidate.sourceMeta.meta ?? null,
        buttonText: candidate.sourceMeta.buttonText ?? null,
        ka: candidate.sourceMeta.ka ?? null,
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

type SourceCandidateCollection = {
  candidates: SourceCandidate[];
  searchContext?: ResumeSyncSearchContext;
};

function toResumeSearchContext(context: DeepSearchRunContext, candidateCount: number): ResumeSyncSearchContext {
  return {
    requestedJobKeyword: context.requestedJobKeyword,
    selectedJob: context.selectedJob,
    coreRequirements: context.coreRequirements,
    bonusRequirements: context.bonusRequirements,
    remainingCountText: context.remainingCountText,
    resultUrl: context.resultUrl,
    candidateCount,
  };
}

async function collectSourceCandidatesWithContext(
  page: Page,
  source: ResumeSource,
  options: ResumeSyncCliOptions,
): Promise<SourceCandidateCollection> {
  if (source !== 'deep-search' || !options.search) {
    return {
      candidates: await collectSourceCandidates(page, source, options),
    };
  }
  if (!options.jobKeyword) {
    throw new Error('resumes --from deep-search --search 必须指定 --job。');
  }

  const runContext = await runDeepSearchMatchOnPage(page, {
    jobKeyword: options.jobKeyword,
    coreRequirements: options.coreRequirements,
    bonusRequirements: options.bonusRequirements,
  });
  const frame = await ensureSearchFrameReady(page).catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    throw new ResumeSyncAbortError(`深度搜索已触发，但结果页未加载候选人卡片（岗位：${runContext.selectedJob || options.jobKeyword}）：${message}`);
  });
  const selectedJob = await readSearchSelectedJobLabel(page);
  const candidates = await readSearchCandidateList(frame);
  if (candidates.length === 0) {
    throw new ResumeSyncAbortError(`深度搜索已触发，但结果页没有候选人卡片（岗位：${runContext.selectedJob || options.jobKeyword}）。`);
  }

  return {
    searchContext: toResumeSearchContext(runContext, candidates.length),
    candidates: candidates.slice(0, options.limit).map((candidate) => ({
      source,
      name: candidate.name,
      jobLabel: selectedJob || runContext.selectedJob || 'unknown-job',
      sourceMeta: buildSourceMeta({
        listIndex: pickNumber(candidate.sourceMeta, 'listIndex') ?? null,
        meta: candidate.sourceMeta.meta ?? null,
        buttonText: candidate.sourceMeta.buttonText ?? null,
        ka: candidate.sourceMeta.ka ?? null,
        searchRequestedJob: runContext.requestedJobKeyword,
        searchSelectedJob: runContext.selectedJob,
        searchResultUrl: runContext.resultUrl,
      }),
    })),
  };
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
    const frame = await ensureSearchFrameReady(page);
    return openSearchResumePreviewByCandidate(frame, {
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
    await installResumeCanvasTextCapture(page);
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
    const identifiers =
      observer.resolve(sourceCandidate.visibleGeekId, view.urls) ??
      (await resolveIdentifiersFromResumeApi(page, view.apiUrl, sourceCandidate.visibleGeekId));
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
  const downloadUrl = buildRecruiterResumeInfoUrl(candidate);
  const fetchResult = await fetchResumeHtml(page, downloadUrl);
  assertHealthyFetch(fetchResult);
  if (!fetchResult.contentType.includes('json') && !fetchResult.body.trimStart().startsWith('{')) {
    throw new Error(`候选人 ${candidate.candidateName} 的 recruiter 简历接口未返回 JSON。`);
  }
  const parsedPayload = JSON.parse(fetchResult.body) as unknown;

  const resume = normalizeRecruiterResumePayload({
    candidate,
    fetchedAt,
    resumeUrl: view.resumeUrl,
    pageTitle: view.pageTitle,
    payload: parsedPayload,
  });

  return {
    fetchedAt,
    rawResponse: {
      source: candidate.source,
      fetchedAt,
      request: {
        endpoint: '/wapi/zpjob/view/geek/info',
        url: downloadUrl,
      },
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

function formatResultLine(candidateName: string, result: Pick<ResumeSyncResult, 'status' | 'message'>): string {
  return `- ${candidateName}: ${result.status} - ${result.message}`;
}

function renderSyncText(output: ResumeSyncStructuredOutput): string {
  const summary = [
    `boss resumes 完成：source=${output.source}`,
    `候选人数量：${output.candidateCount}`,
    `输出目录：${output.root}`,
    `结果汇总：downloaded=${output.counts.downloaded}, skipped_existing=${output.counts.skipped_existing}, missing_identifiers=${output.counts.missing_identifiers}, download_failed=${output.counts.download_failed}`,
  ];
  if (output.results.length === 0) {
    summary.push('明细：暂无候选人。');
    return summary.join('\n');
  }
  return [
    ...summary,
    '',
    ...output.results.map((item) => formatResultLine(item.candidateName, item)),
  ].join('\n');
}

export async function syncResumesOnPage(
  page: Page,
  options: ResumeSyncCliOptions,
): Promise<string> {
  await assertLoggedIn(page);
  const collection = await collectSourceCandidatesWithContext(page, options.source, options);
  const candidates = collection.candidates;
  const rootDir = getResumeSyncRoot(options.rootDir);
  const results: ResumeSyncResultItem[] = [];
  const counts: ResumeSyncCounts = {
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
        results.push({
          source: sourceCandidate.source,
          candidateName: sourceCandidate.name,
          jobName: sourceCandidate.jobLabel || 'unknown-job',
          status: result.status,
          message: result.message,
          visibleGeekId: sourceCandidate.visibleGeekId,
        });
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
        results.push({
          source: sourceCandidate.source,
          candidateName: sourceCandidate.name,
          jobName: resolvedCandidate.jobName,
          status: result.status,
          message: result.message,
          candidateId: resolvedCandidate.encryptGeekId,
          jobId: resolvedCandidate.encryptJobId,
          securityId: resolvedCandidate.securityId,
          visibleGeekId: resolvedCandidate.visibleGeekId,
          artifacts: result.artifacts,
        });
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
      results.push({
        source: sourceCandidate.source,
        candidateName: sourceCandidate.name,
        jobName: resolvedCandidate.jobName,
        status: result.status,
        message: result.message,
        candidateId: resolvedCandidate.encryptGeekId,
        jobId: resolvedCandidate.encryptJobId,
        securityId: resolvedCandidate.securityId,
        visibleGeekId: resolvedCandidate.visibleGeekId,
        artifacts,
      });
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
      results.push({
        source: sourceCandidate.source,
        candidateName: sourceCandidate.name,
        jobName: failureCandidate?.jobName || sourceCandidate.jobLabel || 'unknown-job',
        status,
        message,
        candidateId: failureCandidate?.encryptGeekId,
        jobId: failureCandidate?.encryptJobId,
        securityId: failureCandidate?.securityId,
        visibleGeekId: failureCandidate?.visibleGeekId || sourceCandidate.visibleGeekId,
      });
    } finally {
      await closeCResumePanel(page).catch(() => {});
      await closeBossPaywallPopupIfPresent(page).catch(() => {});
      await sleepRandom(220, 420);
    }
  }

  const output: ResumeSyncStructuredOutput = {
    ok: counts.download_failed === 0 && counts.missing_identifiers === 0,
    source: options.source,
    limit: options.limit,
    root: rootDir,
    searchContext: collection.searchContext,
    candidateCount: candidates.length,
    counts,
    results,
  };
  return options.jsonOutput ? JSON.stringify(output, null, 2) : renderSyncText(output);
}
