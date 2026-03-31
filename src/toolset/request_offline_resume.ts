import type { Page } from 'puppeteer-core';
import { getPageRef } from '../browser/index.js';
import { createWaitManualLoginRequiredText, isBossChatIndexUrl } from '../browser/index.js';

/**
 * 与「索取离线简历」工具相同逻辑，供 `send_chat_message` 附带索简历等场景复用。
 * 调用方需已保证 `page` 存在。
 */
export async function runRequestOfflineResume(page: Page): Promise<string> {
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
      console.error('[boss-cli] request_offline_resume skipped: friend resume already in chat');
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

    console.error('[boss-cli] request_offline_resume ok');
    return '已发起索取离线简历请求。';
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error(`[boss-cli] request_offline_resume error: ${message}`);
    if (e instanceof Error) {
      throw e;
    }
    throw new Error(`索取离线简历失败：${message}`);
  }
}

export async function runRequestOfflineResumeFromSession(): Promise<string> {
  console.error('[boss-cli] request_offline_resume called');
  const page = getPageRef();
  if (!page) {
    throw new Error(createWaitManualLoginRequiredText('索取离线简历'));
  }
  return runRequestOfflineResume(page);
}
