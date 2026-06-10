import type { Frame, Page } from 'puppeteer-core';
import { withBossSessionPage } from '../common/boss_session_page.js';
import { clickBossSidebarMenuToPath } from '../common/boss_sidebar_nav.js';

const BOSS_CHAT_RECOMMEND_URL = 'https://www.zhipin.com/web/chat/recommend';

export type RecommendCandidate = {
  listIndex: number;
  geekId: string;
  name: string;
  salary: string;
  baseInfo: string;
  expect: string;
  experience: string;
  advantage: string;
  highlights: string[];
  canGreet: boolean;
  hasHistoryChat: boolean;
  /** 卡片为灰色「已看过」样式（如 `.candidate-card-wrap.has-viewed` / `.card-inner.has-viewed`） */
  hasViewed: boolean;
};
/** 会话内记录：通过 greet 新出现的推荐卡片（以 geekId 识别） */
const sessionGreetProducedGeekIds = new Set<string>();

/**
 * 推荐列表里「一张候选人卡片」的根节点（新版 `.candidate-card-wrap` 与旧版 `.card-item` / `.geek-card` 并存）。
 * 在线简历预览：点击卡片主体 `.card-inner`，而非「在线简历」链接或「打招呼」。
 */
const RECOMMEND_CARD_ROOT_SELECTOR =
  '.candidate-card-wrap, .card-list .card-item, .geek-list .geek-card';

export function isBossChatRecommendUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (!u.hostname.includes('zhipin.com')) {
      return false;
    }
    const p = u.pathname.replace(/\/+$/, '') || '/';
    return p === '/web/chat/recommend';
  } catch {
    return false;
  }
}

async function getRecommendFrame(page: Page): Promise<Frame> {
  await page.waitForSelector('iframe[name="recommendFrame"]', { timeout: 15_000 });
  const frameByName = page.frames().find((f) => f.name() === 'recommendFrame') ?? null;
  if (frameByName) {
    return frameByName;
  }
  const frameByUrl =
    page.frames().find((f) => {
      try {
        return f.url().includes('/web/frame/recommend');
      } catch {
        return false;
      }
    }) ?? null;
  if (frameByUrl) {
    return frameByUrl;
  }
  throw new Error('已检测到推荐 iframe，但无法获取其页面上下文（recommendFrame）。');
}

async function ensureRecommendFrameReady(frame: Frame): Promise<void> {
  await frame.waitForFunction(
    `(() => {
      const sel = ${JSON.stringify(RECOMMEND_CARD_ROOT_SELECTOR)};
      if (document.querySelector(sel)) return true;
      const root = document.querySelector(".card-list, .geek-list-wrap .geek-list");
      return !!root;
    })()`,
    { timeout: 15_000 },
  );
}

async function readCurrentRecommendJobLabel(frame: Frame): Promise<string> {
  return (await frame.evaluate(`(() => {
    const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
    return norm(document.querySelector(".job-selecter-wrap .ui-dropmenu-label")?.textContent);
  })()`)) as string;
}

async function waitForRecommendJobDropdownReady(frame: Frame): Promise<void> {
  await frame.waitForFunction(
    `(() => {
      const options = document.querySelector(".job-selecter-options");
      if (!(options instanceof HTMLElement)) return false;
      const rect = options.getBoundingClientRect();
      const style = window.getComputedStyle(options);
      if (rect.width <= 0 || rect.height <= 0 || style.display === "none" || style.visibility === "hidden") {
        return false;
      }
      return !!options.querySelector(".top-chat-search .chat-job-search");
    })()`,
    { timeout: 6_000 },
  );
}

async function waitForRecommendJobSearchResults(frame: Frame, keyword: string): Promise<void> {
  await frame.waitForFunction(
    `((kw) => {
      const norm = (v) => (v ?? "").replace(/\\s+/g, "").trim().toLowerCase();
      const rows = Array.from(document.querySelectorAll(".job-selecter-options .job-list .job-item"));
      if (rows.length === 0) return false;
      if (!kw) return true;
      return rows.some((el) => {
        const label = norm(el.querySelector(".label")?.textContent || el.textContent || "");
        return label.includes(norm(kw));
      });
    })`,
    { timeout: 8_000 },
    keyword,
  );
}

async function waitForRecommendJobSelected(frame: Frame, expectedLabel: string): Promise<void> {
  await frame.waitForFunction(
    `((label) => {
      const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
      const current = norm(document.querySelector(".job-selecter-wrap .ui-dropmenu-label")?.textContent);
      return !!current && current === label;
    })`,
    { timeout: 8_000 },
    expectedLabel,
  );
  await ensureRecommendFrameReady(frame);
}

export async function selectRecommendJob(frame: Frame, keyword: string): Promise<string> {
  const kw = keyword.trim();
  if (!kw) {
    return readCurrentRecommendJobLabel(frame);
  }
  const kwLiteral = JSON.stringify(kw);

  const opened = (await frame.evaluate(`(() => {
    const host = document.querySelector(".job-selecter-wrap .ui-dropmenu-label");
    if (!(host instanceof HTMLElement)) return false;
    host.scrollIntoView({ block: "center", inline: "nearest" });
    host.click();
    return true;
  })()`)) as boolean;
  if (!opened) {
    throw new Error('未找到岗位下拉入口（.job-selecter-wrap .ui-dropmenu-label）。');
  }
  await waitForRecommendJobDropdownReady(frame);

  const searched = (await frame.evaluate(`(() => {
    const kw = ${kwLiteral};
    const input = document.querySelector(".job-selecter-options .top-chat-search .chat-job-search");
    if (!(input instanceof HTMLInputElement)) return false;
    input.focus();
    input.value = kw;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  })()`)) as boolean;
  if (!searched) {
    throw new Error('已打开岗位下拉，但未找到职位搜索框（.chat-job-search）。');
  }
  await waitForRecommendJobSearchResults(frame, kw);

  const picked = (await frame.evaluate(`(() => {
    const kw = ${kwLiteral};
    const norm = (v) => (v ?? "").replace(/\\s+/g, "").trim().toLowerCase();
    const rows = Array.from(document.querySelectorAll(".job-selecter-options .job-list .job-item"));
    if (rows.length === 0) return { ok: false, reason: "empty" };
    const target = rows.find((el) => {
      const label = norm(el.querySelector(".label")?.textContent || el.textContent || "");
      return label.includes(norm(kw));
    });
    if (!(target instanceof HTMLElement)) return { ok: false, reason: "not_found" };
    const label = (target.querySelector(".label")?.textContent ?? target.textContent ?? "")
      .replace(/\\s+/g, " ")
      .trim();
    target.scrollIntoView({ block: "center", inline: "nearest" });
    target.click();
    return { ok: true, label };
  })()`)) as { ok: boolean; label?: string; reason?: string };
  if (!picked.ok) {
    throw new Error(`未找到匹配岗位“${kw}”。`);
  }
  const label = picked.label ?? kw;
  await waitForRecommendJobSelected(frame, label);
  return label;
}

export async function ensureInRecommendPage(page: Page): Promise<Frame> {
  if (!isBossChatRecommendUrl(page.url())) {
    await page.goto(BOSS_CHAT_RECOMMEND_URL, { waitUntil: 'load', timeout: 60_000 });
  }
  if (!isBossChatRecommendUrl(page.url())) {
    throw new Error('进入推荐页失败，请确认已登录并可访问 /web/chat/recommend。');
  }
  const frame = await getRecommendFrame(page);
  await ensureRecommendFrameReady(frame);
  return frame;
}

/**
 * 供 `preview` 使用：不导航；若当前主页面不在推荐页或未就绪推荐 iframe，直接抛错。
 */
export async function assertRecommendPageReadyForPreview(page: Page): Promise<Frame> {
  if (!isBossChatRecommendUrl(page.url())) {
    throw new Error('当前不在推荐列表页或搜索结果页，无法预览候选人。');
  }
  const frame = await getRecommendFrame(page);
  await ensureRecommendFrameReady(frame);
  return frame;
}

export async function readRecommendList(frame: Frame): Promise<RecommendCandidate[]> {
  return (await frame.evaluate(`(() => {
    const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
    const cardSel = ${JSON.stringify(RECOMMEND_CARD_ROOT_SELECTOR)};
    const cards = Array.from(document.querySelectorAll(cardSel)).filter(
      (item) => !item.parentElement?.closest(cardSel),
    );
    return cards.map((item, index) => {
      const inner = item.querySelector(".card-inner") || item;
      const wrap = item.matches(".candidate-card-wrap")
        ? item
        : item.querySelector(".candidate-card-wrap");
      const hasViewed = Boolean(
        (wrap && wrap.classList.contains("has-viewed")) ||
          (inner && inner.classList.contains("has-viewed")),
      );
      const geekId =
        inner?.getAttribute("data-geekid") ??
        inner?.getAttribute("data-geek") ??
        "";
      const name =
        norm(item.querySelector(".name-wrap .name")?.textContent) ||
        norm(item.querySelector(".name")?.textContent);
      const salary = norm(item.querySelector(".salary-wrap span")?.textContent);
      const baseInfo = Array.from(item.querySelectorAll(".base-info span"))
        .map((el) => norm(el.textContent))
        .filter(Boolean)
        .join(" / ");
      const expect =
        norm(item.querySelector(".expect-wrap .content")?.textContent) ||
        norm(item.querySelector(".expect-wrap .join-text-wrap")?.textContent);
      const experience = norm(item.querySelector(".experience-wrap .join-text-wrap")?.textContent);
      const advantage = norm(item.querySelector(".geek-desc .content")?.textContent);
      const highlightLabels = [
        ...Array.from(item.querySelectorAll(".operate .labels .label")),
        ...Array.from(item.querySelectorAll(".tags-wrap .tag-item")),
      ]
        .map((el) => norm(el.textContent))
        .filter(Boolean);
      const highlights = [...new Set(highlightLabels)];
      const greetBtn = item.querySelector(".button-chat-wrap .btn.btn-greet");
      const btnCls = greetBtn?.className ?? "";
      const disabled =
        !greetBtn ||
        /disabled|forbid|ban/i.test(btnCls) ||
        greetBtn.getAttribute("disabled") !== null;
      const hasHistoryChat = (() => {
        if (item.querySelector(".tooltip-wrap.chat-history .icon-chat-history")) return true;
        const uses = Array.from(item.querySelectorAll("use"));
        return uses.some((u) => {
          const href = u.getAttribute("href") ?? u.getAttributeNS("http://www.w3.org/1999/xlink", "href") ?? "";
          return href.includes("icon-chat-history");
        });
      })();
      return {
        listIndex: index,
        geekId,
        name,
        salary,
        baseInfo,
        expect,
        experience,
        advantage,
        highlights,
        canGreet: !disabled,
        hasHistoryChat,
        hasViewed,
      };
    }).filter((x) => x.name);
  })()`)) as RecommendCandidate[];
}

export function renderRecommendList(candidates: RecommendCandidate[]): string {
  if (candidates.length === 0) {
    return '推荐列表为空。';
  }
  const greetProduced: RecommendCandidate[] = [];
  const normal: RecommendCandidate[] = [];
  candidates.forEach((c) => {
    if (c.geekId && sessionGreetProducedGeekIds.has(c.geekId)) {
      greetProduced.push(c);
    } else {
      normal.push(c);
    }
  });

  const renderItems = (title: string, items: RecommendCandidate[]): string[] => {
    const lines: string[] = [];
    lines.push(`${title}（${items.length}）`);
    if (items.length === 0) {
      lines.push('  - 暂无');
      return lines;
    }
    items.forEach((m, idx) => {
      const advantageText =
        m.advantage ||
        (m.highlights.length > 0 ? m.highlights.slice(0, 3).join(' / ') : '（无）');
      const fields = [
        m.salary ? `薪资:${m.salary}` : '',
        m.baseInfo ? `信息:${m.baseInfo}` : '',
        m.expect ? `期望:${m.expect}` : '',
        m.experience ? `经历:${m.experience}` : '',
        m.hasHistoryChat ? '同事沟通过' : '',
        m.canGreet ? '可打招呼' : '已打招呼',
      ]
        .filter(Boolean)
        .join('｜');
      const nameWithViewed = m.hasViewed ? `${m.name} | 看过` : m.name;
      lines.push(`  - ${idx + 1}. ${nameWithViewed}｜${fields}`);
      lines.push(`    优势: ${advantageText}`);
    });
    return lines;
  };

  const out: string[] = [];
  out.push(`推荐列表（按来源分组）：共 ${candidates.length} 人。`);
  out.push('');
  out.push(...renderItems('常规推荐', normal));
  out.push('');
  out.push(...renderItems('打招呼产生的推荐', greetProduced));

  return out.join('\n');
}

export async function clickGreet(
  frame: Frame,
  target: string,
): Promise<{ message: string }> {
  const targetLiteral = JSON.stringify(target.trim());
  const result = (await frame.evaluate(
    `(() => {
      const raw = ${targetLiteral};
      const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
      const cardSel = ${JSON.stringify(RECOMMEND_CARD_ROOT_SELECTOR)};
      const cards = Array.from(document.querySelectorAll(cardSel)).filter(
        (item) => !item.parentElement?.closest(cardSel),
      );
      if (cards.length === 0) {
        return { kind: "empty" };
      }
      const targetCard = cards.find((item) => {
        const name =
          norm(item.querySelector(".name-wrap .name")?.textContent) ||
          norm(item.querySelector(".name")?.textContent);
        return name === raw || name.includes(raw);
      }) ?? null;
      if (!targetCard) {
        return { kind: "not_found", target: raw };
      }

      const name =
        norm(targetCard.querySelector(".name-wrap .name")?.textContent) ||
        norm(targetCard.querySelector(".name")?.textContent);
      const inner = targetCard.querySelector(".card-inner") || targetCard;
      const geekId =
        inner?.getAttribute("data-geekid") ??
        inner?.getAttribute("data-geek") ??
        "";
      const btn = targetCard.querySelector(".button-chat-wrap .btn.btn-greet");
      if (!(btn instanceof HTMLElement)) {
        return { kind: "no_btn", name };
      }
      const cls = btn.className ?? "";
      const disabled = /disabled|forbid|ban/i.test(cls) || btn.getAttribute("disabled") !== null;
      if (disabled) {
        return { kind: "disabled", name };
      }
      btn.scrollIntoView({ block: "center", inline: "nearest" });
      btn.click();
      return { kind: "clicked", name, geekId };
    })()`,
  )) as
    | { kind: 'empty' }
    | { kind: 'not_found'; target: string }
    | { kind: 'no_btn'; name: string }
    | { kind: 'disabled'; name: string }
    | { kind: 'clicked'; name: string; geekId: string };

  switch (result.kind) {
    case 'empty':
      throw new Error('推荐列表为空，无法执行打招呼。');
    case 'not_found':
      throw new Error(`未在推荐列表中找到目标：${result.target}`);
    case 'no_btn':
      throw new Error(`候选人 ${result.name} 缺少“打招呼”按钮，无法执行。`);
    case 'disabled':
      throw new Error(`候选人 ${result.name} 已打招呼。`);
    case 'clicked':
      return {
        message: `已对 ${result.name} 点击“打招呼”。`,
      };
    default: {
      const _x: never = result;
      throw new Error(`未知结果：${String(_x)}`);
    }
  }
}

export function markGreetProduced(
  before: RecommendCandidate[],
  after: RecommendCandidate[],
): void {
  const beforeIds = new Set(before.map((x) => x.geekId).filter(Boolean));
  after.forEach((x) => {
    if (x.geekId && !beforeIds.has(x.geekId)) {
      sessionGreetProducedGeekIds.add(x.geekId);
    }
  });
}

/**
 * 在推荐 iframe 内根据姓名打开在线简历预览：点击候选人卡片主体 `.card-inner`（与侧栏「打招呼」分离）。
 * 父页随后出现 `c-resume` iframe（如 `source=recommend`）。旧版仅有「在线简历」链接时仍尝试点击链接。
 */
export async function openRecommendResumePreview(frame: Frame, target: string): Promise<boolean> {
  return openRecommendResumePreviewByCandidate(frame, { name: target.trim() });
}

export async function openRecommendResumePreviewByCandidate(
  frame: Frame,
  candidate: { name: string; geekId?: string; listIndex?: number },
): Promise<boolean> {
  const raw = candidate.name.trim();
  const targetLiteral = JSON.stringify(raw);
  const geekIdLiteral = JSON.stringify(candidate.geekId?.trim() || '');
  const listIndexLiteral =
    typeof candidate.listIndex === 'number' && candidate.listIndex >= 0
      ? String(candidate.listIndex)
      : 'null';
  const targetIndex = (await frame.evaluate(`(() => {
    const raw = ${targetLiteral};
    const targetGeekId = ${geekIdLiteral};
    const targetIndex = ${listIndexLiteral};
    const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
    const cardSel = ${JSON.stringify(RECOMMEND_CARD_ROOT_SELECTOR)};
    const allCards = Array.from(document.querySelectorAll(cardSel));
    const cards = allCards.filter(
      (item) => !item.parentElement?.closest(cardSel),
    );
    if (cards.length === 0) return -1;
    const targetCard = cards.find((item, index) => {
      const inner = item.querySelector(".card-inner") || item;
      const geekId =
        inner?.getAttribute("data-geekid") ??
        inner?.getAttribute("data-geek") ??
        "";
      if (targetGeekId && geekId === targetGeekId) return true;
      if (targetIndex !== null && index === targetIndex) return true;
      const name =
        norm(item.querySelector(".name-wrap .name")?.textContent) ||
        norm(item.querySelector(".name")?.textContent);
      return name === raw || name.includes(raw);
    }) ?? null;
    if (!targetCard) return -1;
    return allCards.indexOf(targetCard);
  })()`)) as number;
  if (targetIndex < 0) {
    return false;
  }
  const cards = await frame.$$(RECOMMEND_CARD_ROOT_SELECTOR);
  const targetCard = cards[targetIndex];
  if (!targetCard) {
    return false;
  }
  try {
    const inner = await targetCard.$('.card-inner');
    await (inner ?? targetCard).click();
    await inner?.dispose().catch(() => {});
    return true;
  } finally {
    await Promise.all(cards.map((card) => card.dispose().catch(() => {})));
  }
}

export async function runRecommend(jobKeyword?: string): Promise<string> {
  try {
    return await withBossSessionPage(async (page) => {
      const frame = await ensureInRecommendPage(page);
      const selectedJob = await selectRecommendJob(frame, (jobKeyword ?? '').trim());
      const candidates = await readRecommendList(frame);
      const title = selectedJob ? `当前岗位：${selectedJob}` : '当前岗位：默认';
      return [title, '', renderRecommendList(candidates)].join('\n');
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    throw new Error(`读取推荐列表失败：${message}`);
  }
}

