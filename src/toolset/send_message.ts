import {
  createWaitManualLoginRequiredText,
  isBossChatIndexUrl,
  sleep,
  withChatPage,
} from '../browser/index.js';
import type { Page } from 'puppeteer-core';


async function runRequestOfflineResume(page: Page): Promise<string> {
  try {
    const currentUrl = page.url();
    if (!isBossChatIndexUrl(currentUrl)) {
      throw new Error('请先进入聊天列表页（/web/chat/index）并打开候选人聊天。');
    }

    const inCandidateChat = await page.$('.base-info-single-container');
    if (!inCandidateChat) {
      throw new Error('请先打开候选人聊天详情页，再执行索取离线简历。');
    }

    const hasFriendResumeAttachment = (await page.evaluate(`(() => {
      const items = Array.from(document.querySelectorAll(".chat-message-list .message-item"));
      return items.some((item) => !!item.querySelector(".item-friend .resume-icon"));
    })()`)) as boolean;

    if (hasFriendResumeAttachment) {
      return '历史消息中已有候选人发来的附件简历，已跳过索取离线简历。';
    }

    const availability = (await page.evaluate(`(() => {
      const items = Array.from(document.querySelectorAll(".operate-icon-item"));
      const target = items.find((el) => {
        const text = (el.querySelector(".operate-btn")?.textContent ?? "").replace(/\\s+/g, "");
        return text.includes("求简历");
      });
      if (!target) return { found: false, available: false };
      const btn = target.querySelector(".operate-btn");
      const className = [target.className ?? "", btn?.className ?? ""].join(" ");
      const disabled = /disabled|forbid|ban/.test(className);
      return { found: true, available: !disabled };
    })()`)) as { found: boolean; available: boolean };

    if (!availability.found || !availability.available) {
      throw new Error(
        '当前不可索取离线简历。通常需要双方至少各发送过一条消息后，才会变为可索取状态。',
      );
    }

    const clicked = (await page.evaluate(`(() => {
      const items = Array.from(document.querySelectorAll(".operate-icon-item"));
      const target = items.find((el) => {
        const text = (el.querySelector(".operate-btn")?.textContent ?? "").replace(/\\s+/g, "");
        return text.includes("求简历");
      });
      if (!target) return false;
      const host = target;
      host.scrollIntoView({ block: "center", inline: "nearest" });
      const btn = target.querySelector(".operate-btn");
      (btn || host).click();
      return true;
    })()`)) as boolean;

    if (!clicked) {
      throw new Error('未找到“求简历”按钮，无法执行索取。');
    }

    const confirmed = (await page.evaluate(`(() => {
      const confirms = Array.from(document.querySelectorAll(".exchange-tooltip .boss-btn-primary.boss-btn"));
      const visible = confirms.find((el) => {
        const style = window.getComputedStyle(el);
        return style.display !== "none" && style.visibility !== "hidden";
      });
      if (!visible) return false;
      visible.click();
      return true;
    })()`)) as boolean;

    if (!confirmed) {
      throw new Error('已点击“求简历”，但未找到确认按钮（确定）。');
    }

    return '已发起索取离线简历请求。';
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    if (e instanceof Error) {
      throw e;
    }
    throw new Error(`索取离线简历失败：${message}`);
  }
}

export async function runSendChatMessage(
  text: string,
  alsoRequestResume = false,
  signal?: AbortSignal,
): Promise<string> {
  const messageText = text.trim();
  if (!messageText) {
    throw new Error('消息内容为空，未发送。');
  }

  try {
    return await withChatPage(async (page) => {
      const currentUrl = page.url();
      if (!isBossChatIndexUrl(currentUrl)) {
        throw new Error('请先进入聊天列表页（/web/chat/index）并打开候选人聊天。');
      }

      const input = await page.$('#boss-chat-editor-input');
      if (!input) {
        throw new Error('未找到聊天输入框（#boss-chat-editor-input）。');
      }

      await input.click({ delay: 20 });
      await page.keyboard.down('Control');
      await page.keyboard.press('KeyA');
      await page.keyboard.up('Control');
      await page.keyboard.press('Backspace');
      await page.keyboard.type(messageText, { delay: 15 });
      await page.keyboard.press('Enter');

      if (!alsoRequestResume) {
        return `已发送消息：${messageText}`;
      }

      await sleep(1_500, signal);
      const resumeLine = await runRequestOfflineResume(page);
      return [`已发送消息：${messageText}`, resumeLine].filter(Boolean).join('\n\n');
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error(`[boss-cli] send_chat_message error: ${message}`);
    if (e instanceof Error) {
      if (e.message.includes('浏览器会话尚未初始化')) {
        throw new Error(createWaitManualLoginRequiredText('发送消息'));
      }
      throw e;
    }
    throw new Error(`发送消息失败：${message}`);
  }
}
