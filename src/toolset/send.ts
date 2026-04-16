import {
  createWaitManualLoginRequiredText,
  isBossChatIndexUrl,
  randomIntInclusive,
  SEND_AFTER_ENTER_MS,
  SEND_INPUT_CLICK_MS,
  SEND_TYPING_GAP_MS,
  sleepRandom,
  typeTextWithRandomKeyDelay,
  withChatPage,
} from '../browser/index.js';

export type SendChatMessageOptions = {
  text?: string;
  signal?: AbortSignal;
};

export async function runSendChatMessage(options: SendChatMessageOptions): Promise<string> {
  const messageText = (options.text ?? '').trim();
  const signal = options.signal;

  if (!messageText) {
    throw new Error('请指定 --text <消息> 或 -t <消息>。');
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
      return `已发送消息：${messageText}`;
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
