import type { Frame, Page } from 'puppeteer-core';
import {
  createWaitManualLoginRequiredText,
  sleepRandom,
  withChatPage,
} from '../browser/index.js';

const BOSS_CHAT_RECOMMEND_URL = 'https://www.zhipin.com/web/chat/recommend';
const RECOMMEND_SETTLE_MS = { min: 1400, max: 2400 } as const;

export type RecommendCandidate = {
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
};
/** 会话内记录：通过 greet 新出现的推荐卡片（以 geekId 识别） */
const sessionGreetProducedGeekIds = new Set<string>();

function isBossChatRecommendUrl(url: string): boolean {
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

async function clickSidebarMenuToPath(
  page: Page,
  menuLabel: string,
  targetPath: string,
): Promise<void> {
  const labelLiteral = JSON.stringify(menuLabel);
  const pathLiteral = JSON.stringify(targetPath);
  const clicked = (await page.evaluate(
    `(() => {
      const label = ${labelLiteral};
      const path = ${pathLiteral};
      const norm = (v) => (v ?? "").replace(/\\s+/g, "");
      const links = Array.from(document.querySelectorAll(".menu-list a"));
      const target = links.find((a) => {
        const href = a.getAttribute("href") ?? "";
        if (href.includes(path)) return true;
        const text = norm(a.querySelector(".menu-item-content span")?.textContent ?? a.textContent);
        return text.includes(label);
      });
      if (!(target instanceof HTMLElement)) return false;
      target.scrollIntoView({ block: "center", inline: "nearest" });
      target.click();
      return true;
    })()`,
  )) as boolean;
  if (!clicked) {
    throw new Error(`未找到侧边栏菜单“${menuLabel}”，无法跳转到 ${targetPath}。`);
  }

  await page.waitForFunction(
    `(() => {
      const path = ${pathLiteral};
      try {
        const p = window.location.pathname.replace(/\\/+$/g, "") || "/";
        return p === path;
      } catch {
        return false;
      }
    })()`,
    { timeout: 15_000 },
  );
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

async function selectRecommendJob(frame: Frame, keyword: string): Promise<string> {
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
  await sleepRandom(380, 820);

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
  await sleepRandom(520, 1080);

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
  await sleepRandom(900, 1500);
  return picked.label ?? kw;
}

export async function ensureInRecommendPage(page: Page): Promise<Frame> {
  if (!isBossChatRecommendUrl(page.url())) {
    await clickSidebarMenuToPath(page, '推荐', '/web/chat/recommend');
    await sleepRandom(RECOMMEND_SETTLE_MS.min, RECOMMEND_SETTLE_MS.max);
  }
  if (!isBossChatRecommendUrl(page.url())) {
    throw new Error('通过侧边栏“推荐”进入页面失败，请确认已登录并可访问 /web/chat/recommend。');
  }
  const frame = await getRecommendFrame(page);
  await ensureRecommendFrameReady(frame);
  return frame;
}

export async function readRecommendList(frame: Frame): Promise<RecommendCandidate[]> {
  return (await frame.evaluate(`(() => {
    const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
    const cards = Array.from(
      document.querySelectorAll(".card-list .card-item, .geek-list .geek-card"),
    );
    return cards.map((item) => {
      const inner = item.querySelector(".card-inner") || item;
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
      const highlights = Array.from(item.querySelectorAll(".operate .labels .label"))
        .map((el) => norm(el.textContent))
        .filter(Boolean);
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
        m.hasHistoryChat ? '有历史沟通' : '',
        m.canGreet ? '可打招呼' : '已打招呼',
      ]
        .filter(Boolean)
        .join('｜');
      lines.push(`  - ${idx + 1}. ${m.name}｜${fields}`);
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
      const cards = Array.from(
        document.querySelectorAll(".card-list .card-item, .geek-list .geek-card"),
      );
      if (cards.length === 0) {
        return { kind: "empty" };
      }

      const idxNum = Number.parseInt(raw, 10);
      let targetCard = null;
      if (Number.isFinite(idxNum) && idxNum >= 1 && idxNum <= cards.length) {
        targetCard = cards[idxNum - 1];
      } else {
        targetCard = cards.find((item) => {
          const name =
            norm(item.querySelector(".name-wrap .name")?.textContent) ||
            norm(item.querySelector(".name")?.textContent);
          return name === raw || name.includes(raw);
        }) ?? null;
      }
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

export async function runRecommend(jobKeyword?: string): Promise<string> {
  try {
    return await withChatPage(async (page) => {
      const frame = await ensureInRecommendPage(page);
      const selectedJob = await selectRecommendJob(frame, (jobKeyword ?? '').trim());
      const candidates = await readRecommendList(frame);
      const title = selectedJob ? `当前岗位：${selectedJob}` : '当前岗位：默认';
      return [title, '', renderRecommendList(candidates)].join('\n');
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    if (e instanceof Error && e.message.includes('浏览器会话尚未初始化')) {
      throw new Error(createWaitManualLoginRequiredText('查看推荐列表'));
    }
    throw new Error(`读取推荐列表失败：${message}`);
  }
}

