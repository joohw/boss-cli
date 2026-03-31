import type { Page } from 'puppeteer-core';
import { createWaitManualLoginRequiredText, isBossChatIndexUrl, withChatPage } from '../browser/index.js';

type CandidateItem = {
  name: string;
  job: string;
  time: string;
  message: string;
  unreadCount: number;
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForCandidateListSettled(
  page: Page,
  opts: { timeoutMs: number; pollMs: number; minMsBeforeEmptyOk: number },
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
    await new Promise((r) => setTimeout(r, opts.pollMs));
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

export async function runGetCandidateList(
  opts: { unreadOnly?: boolean } = {},
): Promise<string> {
  const unreadOnly = opts.unreadOnly === true;

  try {
    return await withChatPage(async (page) => {
      const currentUrl = page.url();
      if (!isBossChatIndexUrl(currentUrl)) {
        console.error(`[boss-cli] candidate_list not_chat_list url=${currentUrl}`);
        throw new Error('请先进入聊天列表页（/web/chat/index）再获取候选人列表。');
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
        { timeout: 8_000 },
      );

      await clickChatFilterTabAll(page);
      await delay(520);
      await delay(450);
      await clickChatFilterTabAll(page);
      await delay(520);
      await waitForCandidateListSettled(page, {
        timeoutMs: 10_000,
        pollMs: 220,
        minMsBeforeEmptyOk: 2_800,
      });

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
      console.error(
        `[boss-cli] candidate_list extracted=${candidates.length} withUnreadBadge=${withUnread}`,
      );
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
      const logText = lines.length > 0 ? lines.join('\n') : '(empty)';
      console.error(`[boss-cli] candidate_list count=${visible.length}\n${logText}`);
      const previewText =
        lines.length > 0 ? `候选人明细：\n${lines.join('\n')}` : '候选人明细：暂无。';

      return [
        unreadOnly
          ? `已获取未读候选人（全部），共 ${visible.length} 条；原始列表共 ${candidates.length} 条；其中 ${withUnread} 人有未读角标。`
          : `已获取候选人列表（全部），共 ${candidates.length} 条；其中 ${withUnread} 人有未读角标。`,
        previewText,
      ]
        .filter(Boolean)
        .join('\n');
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error(`[boss-cli] candidate_list error: ${message}`);
    if (e instanceof Error) {
      if (e.message.includes('浏览器会话尚未初始化')) {
        throw new Error(createWaitManualLoginRequiredText('获取候选人列表'));
      }
      throw e;
    }
    throw new Error(`获取候选人列表失败：${message}`);
  }
}
