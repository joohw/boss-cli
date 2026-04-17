import type { Page } from 'puppeteer-core';
import {
  CHAT_GOTO_SETTLE_MS,
  createWaitManualLoginRequiredText,
  isBossChatIndexUrl,
  LIST_FILTER_GAP_MS,
  LIST_MIN_BEFORE_EMPTY_OK_MS,
  LIST_POLL_MS,
  sleepRandom,
  withBossSessionPage,
} from '../browser/index.js';
import { clickBossSidebarMenuToPath } from '../common/boss_sidebar_nav.js';

type CandidateItem = {
  name: string;
  job: string;
  time: string;
  message: string;
  unreadCount: number;
};

async function waitForCandidateListSettled(
  page: Page,
  opts: { timeoutMs: number; pollMsMin: number; pollMsMax: number; minMsBeforeEmptyOk: number },
): Promise<void> {
  const start = Date.now();
  let prev = -1;
  let stable = 0;
  while (Date.now() - start < opts.timeoutMs) {
    const n = (await page.evaluate(
      `(() => document.querySelectorAll(".geek-item").length)()`,
    )) as number;
    const elapsed = Date.now() - start;
    if (n === prev) {
      stable++;
    } else {
      prev = n;
      stable = 1;
    }
    if (stable >= 2) {
      if (n > 0) {
        return;
      }
      if (n === 0 && elapsed >= opts.minMsBeforeEmptyOk) {
        return;
      }
    }
    await sleepRandom(opts.pollMsMin, opts.pollMsMax);
  }
}

async function clickChatFilterTabAll(page: Page): Promise<void> {
  await page.evaluate(`(() => {
    const targetText = "全部";
    const container = document.querySelector(".chat-message-filter-left");
    if (!container) return;
    const spans = Array.from(container.querySelectorAll("span"));
    const norm = (v) => (v ?? "").replace(/\\s+/g, "");
    const target = spans.find((el) => norm(el.textContent).includes(targetText));
    if (!target) return;
    target.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    target.click();
  })()`);
}

/**
 * 与 `list` 一致：若当前不在沟通列表则点侧栏「沟通」进入 `/web/chat/index`，
 * 再点左侧筛选「全部」并等待列表稳定。`chat` 在按姓名找人前需处于该状态。
 */
export async function ensureChatIndexAllFilter(page: Page): Promise<void> {
  const currentUrl = page.url();
  if (!isBossChatIndexUrl(currentUrl)) {
    await clickBossSidebarMenuToPath(page, '沟通', '/web/chat/index');
    await sleepRandom(CHAT_GOTO_SETTLE_MS.min, CHAT_GOTO_SETTLE_MS.max);
  }

  if (!isBossChatIndexUrl(page.url())) {
    throw new Error('通过侧边栏“沟通”进入聊天列表页失败，请确认已登录并可访问 /web/chat/index。');
  }

  await page.waitForFunction(
    `(() => {
      const filter = document.querySelector(".chat-message-filter-left");
      if (!filter) return false;
      const tabs = Array.from(filter.querySelectorAll("span"));
      if (tabs.length < 2) return false;
      const list = document.querySelector(".chat-list, .chat-item-list, .geek-list");
      const hasItems = document.querySelectorAll(".geek-item").length > 0;
      return !!list || hasItems;
    })()`,
    { timeout: 12_000 },
  );

  await clickChatFilterTabAll(page);
  await sleepRandom(LIST_FILTER_GAP_MS.min, LIST_FILTER_GAP_MS.max);
  await sleepRandom(LIST_FILTER_GAP_MS.min, LIST_FILTER_GAP_MS.max);
  await clickChatFilterTabAll(page);
  await sleepRandom(LIST_FILTER_GAP_MS.min, LIST_FILTER_GAP_MS.max);
  await waitForCandidateListSettled(page, {
    timeoutMs: 14_000,
    pollMsMin: LIST_POLL_MS.min,
    pollMsMax: LIST_POLL_MS.max,
    minMsBeforeEmptyOk: LIST_MIN_BEFORE_EMPTY_OK_MS,
  });
}

export async function runGetCandidateList(
  opts: { unreadOnly?: boolean } = {},
): Promise<string> {
  const unreadOnly = opts.unreadOnly === true;

  try {
    return await withBossSessionPage(async (page) => {
      await ensureChatIndexAllFilter(page);

      const items = (await page.evaluate(
        `(() => {
          const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
          return Array.from(document.querySelectorAll(".geek-item")).map((el) => {
            const name = norm(el.querySelector(".geek-name")?.textContent);
            const job = norm(el.querySelector(".source-job")?.textContent);
            const time = norm(el.querySelector(".time")?.textContent);
            const message = norm(el.querySelector(".push-text")?.textContent);
            const badge = el.querySelector(".badge-count");
            let unreadCount = 0;
            if (badge) {
              const digits = norm(badge.textContent).replace(/\\D/g, "");
              if (digits) unreadCount = parseInt(digits, 10) || 0;
            }
            return { name, job, time, message, unreadCount };
          });
        })()`,
      )) as CandidateItem[];

      const candidates = items.filter((it) => it.name) as CandidateItem[];
      const withUnread = candidates.filter((it) => it.unreadCount > 0).length;
      const visible = unreadOnly ? candidates.filter((it) => it.unreadCount > 0) : candidates;
      const lines = visible.map((it, idx) => {
        const base = `${idx + 1}. ${it.name}${it.job ? `｜${it.job}` : ''}`;
        const meta = [
          it.unreadCount > 0 ? `未读:${it.unreadCount}` : '',
          it.time ? `时间:${it.time}` : '',
          it.message ? `消息:${it.message}` : '',
        ]
          .filter(Boolean)
          .join('｜');
        return meta ? `${base}｜${meta}` : base;
      });
      const previewText =
        lines.length > 0 ? `候选人明细：\n${lines.join('\n')}` : '候选人明细：暂无。';

      return [
        unreadOnly
          ? `未读筛选：共 ${visible.length} 人（全部列表 ${candidates.length} 人中有未读角标者 ${withUnread} 人）。`
          : `沟通列表共 ${candidates.length} 人，其中 ${withUnread} 人有未读消息。`,
        previewText,
      ]
        .filter(Boolean)
        .join('\n');
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    if (e instanceof Error) {
      if (e.message.includes('浏览器会话尚未初始化')) {
        throw new Error(createWaitManualLoginRequiredText('获取候选人列表'));
      }
      throw e;
    }
    throw new Error(`获取候选人列表失败：${message}`);
  }
}
