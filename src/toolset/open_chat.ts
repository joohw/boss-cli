import type { Page } from 'puppeteer-core';
import { isBossChatIndexUrl } from '../browser/index.js';

export async function runOpenCandidateChat(
  page: Page,
  candidateName: string,
  exact = true,
): Promise<string> {
  const targetName = candidateName.trim();

  try {
    const currentUrl = page.url();
    if (!isBossChatIndexUrl(currentUrl)) {
      throw new Error('请先进入聊天列表页（/web/chat/index）再打开候选人聊天。');
    }

    const norm = (v: string | null | undefined) => (v ?? '').replace(/\s+/g, ' ').trim();
    const matcher = (value: string) =>
      exact ? value === targetName : value.includes(targetName);
    let targetWrap: Awaited<ReturnType<typeof page.$>> | null = null;
    let foundName = '';

    const maxScrollRounds = 40;
    for (let round = 0; round < maxScrollRounds && !targetWrap; round++) {
      const wraps = await page.$$('.geek-item-wrap');
      for (const wrap of wraps) {
        const nameText = await wrap
          .$eval('.geek-name', (el) => (el.textContent ?? '').trim())
          .catch(() => '');
        const candidate = norm(nameText);
        if (!candidate) continue;
        if (matcher(candidate)) {
          targetWrap = wrap;
          foundName = candidate;
          break;
        }
      }
      if (targetWrap) break;

      const scrollState = (await page.evaluate(`(() => {
        const first = document.querySelector(".geek-item-wrap");
        if (!first) return { moved: false, atEnd: true };
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
        if (!scroller) return { moved: false, atEnd: true };
        const prev = scroller.scrollTop;
        const step = Math.max(160, Math.floor(scroller.clientHeight * 0.8));
        scroller.scrollTop = Math.min(scroller.scrollTop + step, scroller.scrollHeight);
        const moved = scroller.scrollTop !== prev;
        const atEnd = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2;
        return { moved, atEnd };
      })()`)) as { moved: boolean; atEnd: boolean };
      if (!scrollState.moved || scrollState.atEnd) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 120));
    }

    if (!targetWrap) {
      throw new Error(`未在聊天列表中找到候选人：${targetName}`);
    }

    try {
      await targetWrap.evaluate((el) => {
        const row = el.querySelector<HTMLElement>('.geek-item') ?? (el as HTMLElement);
        row.scrollIntoView({ behavior: 'instant', block: 'center', inline: 'nearest' });
        row.click();
      });
    } catch {
      const box = await targetWrap.boundingBox();
      if (!box) {
        throw new Error(`已定位候选人 ${foundName}，但元素不可点击。`);
      }
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2, { delay: 30 });
    }

    const selected = await targetWrap
      .$eval('.geek-item', (el) => el.classList.contains('selected'))
      .catch(() => false);

    try {
      await page.waitForSelector('.base-info-single-container', { timeout: 8_000 });
      await page.waitForFunction(
        `((name) => {
          const text = document.querySelector(".base-info-single-container .name-box")?.textContent ?? "";
          return text.replace(/\\s+/g, " ").trim().includes(name);
        })`,
        { timeout: 8_000 },
        foundName || targetName,
      );
      await page.waitForFunction(
        `(() => {
          const list = document.querySelector(".chat-message-list");
          if (!list) return false;
          const items = list.querySelectorAll(".message-item");
          if (!items || items.length === 0) return false;
          const hasText = Array.from(items).some((item) => {
            const txt =
              item.querySelector(".item-friend .text span")?.textContent ??
              item.querySelector(".item-myself .text span")?.textContent ??
              item.querySelector(".item-system .message-card-top-title")?.textContent ??
              "";
            return txt.replace(/\\s+/g, " ").trim().length > 0;
          });
          return hasText;
        })()`,
        { timeout: 10_000 },
      );
    } catch {
      throw new Error(
        `已尝试点击 ${foundName}（selected=${String(selected)}），但未检测到对应聊天详情面板。`,
      );
    }

    const url = page.url();
    let fullMessages: Array<{
      time: string;
      from: 'friend' | 'myself' | 'system' | 'unknown';
      text: string;
    }> = [];
    let hasFriendResumeAttachment = false;
    try {
      const scraped = (await page.evaluate(`(() => {
        const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
        const items = Array.from(document.querySelectorAll(".chat-message-list .message-item"));
        let currentTime = "";
        const messages = [];
        let hasFriendResumeAttachment = false;
        for (const item of items) {
          const timeNode = item.querySelector(".message-time .time");
          if (timeNode) {
            const t = norm(timeNode.textContent);
            if (t) currentTime = t;
          }
          const friendRoot = item.querySelector(".item-friend");
          let friendText = "";
          if (friendRoot) {
            friendText = norm(friendRoot.querySelector(".text > span")?.textContent);
            if (!friendText) {
              const resumeIcon = friendRoot.querySelector(".resume-icon");
              const title = norm(friendRoot.querySelector(".message-card-top-title")?.textContent);
              const cardBtn = norm(friendRoot.querySelector(".message-card-buttons .card-btn")?.textContent);
              if (resumeIcon) hasFriendResumeAttachment = true;
              if (title || cardBtn) {
                const parts = [];
                if (title) parts.push(title);
                if (cardBtn) parts.push(cardBtn);
                friendText = parts.length ? parts.join(" · ") : "";
              }
              if (!friendText) friendText = norm(friendRoot.querySelector(".text")?.textContent);
            }
          }
          const myselfText = norm(item.querySelector(".item-myself .text span")?.textContent);
          const systemText =
            norm(item.querySelector(".item-system .message-card-top-title")?.textContent) ||
            norm(item.querySelector(".item-system .text span")?.textContent);
          if (friendText) {
            messages.push({ text: friendText, time: currentTime, from: "friend" });
          } else if (myselfText) {
            messages.push({ text: myselfText, time: currentTime, from: "myself" });
          } else if (systemText) {
            messages.push({ text: systemText, time: currentTime, from: "system" });
          }
        }
        return { messages, hasFriendResumeAttachment };
      })()`)) as {
        messages: Array<{
          time: string;
          from: 'friend' | 'myself' | 'system' | 'unknown';
          text: string;
        }>;
        hasFriendResumeAttachment: boolean;
      };
      fullMessages = scraped.messages;
      hasFriendResumeAttachment = scraped.hasFriendResumeAttachment;
      const lines = fullMessages.map(
        (m, i) => `${i + 1}. [${m.from}]${m.time ? `(${m.time})` : ''} ${m.text}`,
      );
      console.error(
        `[boss-cli] open_candidate_chat full_messages count=${fullMessages.length} hasFriendResumeAttachment=${String(hasFriendResumeAttachment)}\n${lines.length > 0 ? lines.join('\n') : '(empty)'
        }`,
      );
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      console.error(`[boss-cli] open_candidate_chat full_messages error: ${message}`);
    }

    console.error(`[boss-cli] open_candidate_chat ok name=${foundName} url=${url}`);
    return [
      `已进入候选人聊天：${foundName}`,
      `已读取完整聊天消息：${fullMessages.length} 条。`,
      hasFriendResumeAttachment ? '历史记录中已有候选人发来的附件简历卡片，一般无需再发起「求简历」。' : '',
    ]
      .filter(Boolean)
      .join('\n');
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error(`[boss-cli] open_candidate_chat error: ${message}`);
    if (e instanceof Error) {
      throw e;
    }
    throw new Error(`打开候选人聊天失败：${message}`);
  }
}
