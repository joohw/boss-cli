import type { Page } from 'puppeteer-core';
import {
  createWaitManualLoginRequiredText,
  sleepRandom,
  withChatPage,
} from '../browser/index.js';

const BOSS_CHAT_AI_FORM_URL = 'https://www.zhipin.com/web/chat/aiform';
const AI_FORM_SETTLE_MS = { min: 1600, max: 2600 } as const;

type SearchFormSnapshot = {
  selectedJob: string;
  coreRequirements: string[];
  bonusRequirements: string[];
  remainingCountText: string;
};

function isBossChatAiFormUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (!u.hostname.includes('zhipin.com')) {
      return false;
    }
    const p = u.pathname.replace(/\/+$/, '') || '/';
    return p === '/web/chat/aiform';
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
        if (href.includes(path)) {
          return true;
        }
        const text = norm(a.querySelector(".menu-item-content span")?.textContent ?? a.textContent);
        return text.includes(label);
      });
      if (!(target instanceof HTMLElement)) {
        return false;
      }
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

async function waitForAiFormReady(page: Page): Promise<void> {
  await page.waitForFunction(
    `(() => {
      const root = document.querySelector(".ai-form-left");
      const submit = document.querySelector(".ai-form-match-footer .btn-ai-match-v2");
      const selected = document.querySelector(".job-dropmenu-select .job-main-text");
      if (!root || !submit || !selected) {
        return false;
      }
      const text = (selected.textContent ?? "").replace(/\\s+/g, " ").trim();
      return text.length > 0;
    })()`,
    { timeout: 15_000 },
  );
}

async function ensureInDeepSearchPage(page: Page): Promise<void> {
  if (!isBossChatAiFormUrl(page.url())) {
    throw new Error('当前不在深度搜索页（/web/chat/aiform），请先进入后再执行 search。');
  }
  await waitForAiFormReady(page);
}

async function readSearchFormSnapshot(page: Page): Promise<SearchFormSnapshot> {
  return (await page.evaluate(`(() => {
    const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
    const selectedJob = norm(document.querySelector(".job-dropmenu-select .job-main-text")?.textContent);
    const sections = Array.from(document.querySelectorAll(".form-content"));
    const coreRequirements = [];
    const bonusRequirements = [];
    for (const section of sections) {
      const title = norm(section.querySelector(".form-content-header .form-content-title-h3")?.textContent);
      const words = Array.from(section.querySelectorAll(".form-content-list-item .form-content-word"))
        .map((el) => norm(el.textContent))
        .filter(Boolean);
      if (title.includes("核心要求")) {
        coreRequirements.push(...words);
        continue;
      }
      if (title.includes("加分项")) {
        bonusRequirements.push(...words);
      }
    }
    const remainingCountText = norm(document.querySelector(".ai-form-match-footer-text-count")?.textContent);
    return {
      selectedJob,
      coreRequirements,
      bonusRequirements,
      remainingCountText,
    };
  })()`)) as SearchFormSnapshot;
}

async function clickMatchNow(page: Page): Promise<void> {
  const clicked = (await page.evaluate(`(() => {
    function norm(v) {
      return (v ?? "").replace(/\\s+/g, "").trim();
    }
    function isVisible(el) {
      if (!(el instanceof HTMLElement)) return false;
      const st = window.getComputedStyle(el);
      if (st.display === "none" || st.visibility === "hidden") return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    }
    const buttons = Array.from(
      document.querySelectorAll(".ai-form-match-footer .btn-ai-match-v2, .ai-form-match-footer-btn .btn-ai-common, .ai-form-match-footer-btn .light-flow-btn-content"),
    ).filter((el) => isVisible(el));
    if (buttons.length === 0) {
      return false;
    }
    const preferred = buttons.find((el) => norm(el.textContent).includes("立即匹配")) ?? buttons[0];
    if (!(preferred instanceof HTMLElement)) {
      return false;
    }
    preferred.scrollIntoView({ block: "center", inline: "nearest" });
    preferred.click();
    return true;
  })()`)) as boolean;

  if (!clicked) {
    throw new Error('未找到“立即匹配”按钮，无法执行深度搜索。');
  }
}

function renderSearchResultText(
  before: SearchFormSnapshot,
  after: SearchFormSnapshot,
): string {
  const core = before.coreRequirements.length > 0 ? before.coreRequirements.join('｜') : '（空）';
  const bonus = before.bonusRequirements.length > 0 ? before.bonusRequirements.join('｜') : '（空）';
  const remain = before.remainingCountText || '未知';
  const remainAfter = after.remainingCountText || '未知';
  const remainLine =
    remain === remainAfter ? `今日匹配剩余：${remain}` : `今日匹配剩余：${remain} -> ${remainAfter}`;
  return [
    '已进入深度搜索并触发“立即匹配”。',
    `职位：${before.selectedJob || '未知职位'}`,
    `核心要求(${before.coreRequirements.length})：${core}`,
    `加分项(${before.bonusRequirements.length})：${bonus}`,
    remainLine,
    `来源页面：${BOSS_CHAT_AI_FORM_URL}`,
  ].join('\n');
}

export async function runBossSearch(): Promise<string> {
  try {
    return await withChatPage(async (page) => {
      const currentUrl = page.url();
      if (!isBossChatAiFormUrl(currentUrl)) {
        await clickSidebarMenuToPath(page, '深度搜索', '/web/chat/aiform');
        await sleepRandom(AI_FORM_SETTLE_MS.min, AI_FORM_SETTLE_MS.max);
      }
      if (!isBossChatAiFormUrl(page.url())) {
        throw new Error('通过侧边栏“深度搜索”进入页面失败，请确认已登录并可访问 /web/chat/aiform。');
      }
      await ensureInDeepSearchPage(page);
      const before = await readSearchFormSnapshot(page);
      await clickMatchNow(page);
      await sleepRandom(1200, 1800);
      await ensureInDeepSearchPage(page);
      const after = await readSearchFormSnapshot(page);
      return renderSearchResultText(before, after);
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    if (e instanceof Error && e.message.includes('浏览器会话尚未初始化')) {
      throw new Error(createWaitManualLoginRequiredText('执行深度搜索'));
    }
    console.error(`[boss-cli] boss_search error: ${message}`);
    throw new Error(`执行深度搜索失败：${message}`);
  }
}
