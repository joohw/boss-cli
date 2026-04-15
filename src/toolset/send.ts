import {
  createWaitManualLoginRequiredText,
  isBossChatIndexUrl,
  randomIntInclusive,
  SEND_AFTER_ENTER_MS,
  SEND_BEFORE_RESUME_MS,
  SEND_INPUT_CLICK_MS,
  SEND_TYPING_GAP_MS,
  sleepRandom,
  typeTextWithRandomKeyDelay,
  withChatPage,
} from '../browser/index.js';
import type { Page } from 'puppeteer-core';

/** CLI `--action` 与内部逻辑共用 */
export type SendAction =
  | 'request-resume'
  | 'agree-resume'
  /** 在「附件简历」卡片上点「拒绝」 */
  | 'confuse-resume';

export type SendChatMessageOptions = {
  text?: string;
  /** 可与 text 同次执行；若有先发消息，再 action，中间有默认随机间隔 */
  action?: SendAction;
  signal?: AbortSignal;
};

type IncomingCardBtn = 'agree' | 'refuse';

/**
 * 对方「附件简历」确认卡片上点击「同意」或「拒绝」。
 * 对应按钮 disabled 时视为已处理。
 */
async function runIncomingResumeCardAction(page: Page, which: IncomingCardBtn): Promise<string> {
  const currentUrl = page.url();
  if (!isBossChatIndexUrl(currentUrl)) {
    throw new Error('请先进入聊天列表页（/web/chat/index）并打开候选人聊天。');
  }
  const inCandidateChat = await page.$('.base-info-single-container');
  if (!inCandidateChat) {
    throw new Error('请先打开候选人聊天详情页，再操作附件简历卡片。');
  }

  await sleepRandom(200, 550);

  const result = (await page.evaluate((w: 'agree' | 'refuse') => {
    function norm(v: string | null | undefined) {
      return (v ?? "").replace(/\\s+/g, " ").trim();
    }
    function isDisabledBtn(el: Element) {
      const cls = el.className ?? "";
      if (/disabled|forbid|ban/i.test(cls)) return true;
      if (el.getAttribute("disabled") !== null) return true;
      const st = window.getComputedStyle(el);
      return st.pointerEvents === "none" || Number(st.opacity) < 0.35;
    }
    function matchesLabel(t: string, mode: string) {
      if (mode === "agree") {
        return t === "同意" || t.indexOf("同意") === 0;
      }
      return t === "拒绝" || t.indexOf("拒绝") === 0;
    }
    const items = Array.from(document.querySelectorAll(".chat-message-list .message-item"));
    for (let i = items.length - 1; i >= 0; i--) {
      const friend = items[i].querySelector(".item-friend");
      if (!friend) continue;
      const title = norm(friend.querySelector(".message-card-top-title")?.textContent);
      if (!title || title.indexOf("附件简历") === -1) continue;
      const buttons = friend.querySelectorAll(".message-card-buttons .card-btn");
      for (let j = 0; j < buttons.length; j++) {
        const btn = buttons[j];
        const t = norm(btn.textContent);
        if (!matchesLabel(t, w)) continue;
        if (isDisabledBtn(btn)) {
          return { kind: "already_handled", which: w };
        }
        (btn as HTMLElement).scrollIntoView({ block: "center", inline: "nearest" });
        (btn as HTMLElement).click();
        return { kind: "clicked", which: w };
      }
    }
    return { kind: "not_found", which: w };
  }, which)) as
    | { kind: 'clicked'; which: IncomingCardBtn }
    | { kind: 'already_handled'; which: IncomingCardBtn }
    | { kind: 'not_found'; which: IncomingCardBtn };

  if (result.kind === 'not_found') {
    throw new Error('未找到待处理的「对方发送附件简历」确认卡片（标题需含「附件简历」）。');
  }
  if (result.kind === 'already_handled') {
    return result.which === 'agree'
      ? '对方发来的附件简历请求已处理（同意按钮已禁用）。'
      : '对方发来的附件简历请求已处理（拒绝按钮已禁用）。';
  }
  await sleepRandom(350, 900);
  return result.which === 'agree'
    ? '已点击「同意」，接受对方发送的附件简历。'
    : '已点击「拒绝」，拒绝接收对方附件简历。';
}

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

    await sleepRandom(280, 720);

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

    await sleepRandom(400, 980);

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

export async function runSendChatMessage(options: SendChatMessageOptions): Promise<string> {
  const messageText = (options.text ?? '').trim();
  const action = options.action;
  const signal = options.signal;

  if (!messageText && !action) {
    throw new Error('请指定 --text 或 --action 至少其一。');
  }

  try {
    return await withChatPage(async (page) => {
      const currentUrl = page.url();
      if (!isBossChatIndexUrl(currentUrl)) {
        throw new Error('请先进入聊天列表页（/web/chat/index）并打开候选人聊天。');
      }

      const lines: string[] = [];

      if (messageText) {
        const input = await page.$('#boss-chat-editor-input');
        if (!input) {
          throw new Error('未找到聊天输入框（#boss-chat-editor-input）。');
        }

        await input.click({
          delay: randomIntInclusive(SEND_INPUT_CLICK_MS.min, SEND_INPUT_CLICK_MS.max),
        });
        await sleepRandom(60, 220, signal);
        await page.keyboard.down('Control');
        await page.keyboard.press('KeyA');
        await page.keyboard.up('Control');
        await sleepRandom(45, 180, signal);
        await page.keyboard.press('Backspace');
        await sleepRandom(80, 260, signal);
        await typeTextWithRandomKeyDelay(
          page,
          messageText,
          SEND_TYPING_GAP_MS.min,
          SEND_TYPING_GAP_MS.max,
          signal,
        );
        await sleepRandom(120, 420, signal);
        await page.keyboard.press('Enter');
        await sleepRandom(SEND_AFTER_ENTER_MS.min, SEND_AFTER_ENTER_MS.max, signal);
        lines.push(`已发送消息：${messageText}`);
      }

      if (action) {
        if (lines.length > 0) {
          await sleepRandom(SEND_BEFORE_RESUME_MS.min, SEND_BEFORE_RESUME_MS.max, signal);
        }
        switch (action) {
          case 'request-resume':
            lines.push(await runRequestOfflineResume(page));
            break;
          case 'agree-resume':
            lines.push(await runIncomingResumeCardAction(page, 'agree'));
            break;
          case 'confuse-resume':
            lines.push(await runIncomingResumeCardAction(page, 'refuse'));
            break;
          default: {
            const _x: never = action;
            throw new Error(`未知的 action: ${String(_x)}`);
          }
        }
      }

      return lines.join('\n\n');
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    if (e instanceof Error) {
      if (e.message.includes('浏览器会话尚未初始化')) {
        throw new Error(createWaitManualLoginRequiredText('发送消息'));
      }
      throw e;
    }
    throw new Error(`发送消息失败：${message}`);
  }
}
