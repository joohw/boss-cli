import { getPageRef } from '../browser/index.js';
import {
  createWaitManualLoginRequiredText,
  isBossChatIndexUrl,
  sleep,
} from '../browser/index.js';
import { runRequestOfflineResume } from './request_offline_resume.js';

export async function runSendChatMessage(
  text: string,
  alsoRequestResume = false,
  signal?: AbortSignal,
): Promise<string> {
  const messageText = text.trim();
  console.error(
    `[boss-cli] send_chat_message called len=${messageText.length} alsoRequestResume=${String(alsoRequestResume)}`,
  );
  if (!messageText) {
    throw new Error('消息内容为空，未发送。');
  }

  try {
    const page = getPageRef();
    if (!page) {
      throw new Error(createWaitManualLoginRequiredText('发送消息'));
    }
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

    console.error(`[boss-cli] send_chat_message ok text=${messageText}`);
    if (!alsoRequestResume) {
      return `已发送消息：${messageText}`;
    }

    await sleep(1_500, signal);
    const resumeLine = await runRequestOfflineResume(page);
    return [`已发送消息：${messageText}`, resumeLine].filter(Boolean).join('\n\n');
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error(`[boss-cli] send_chat_message error: ${message}`);
    if (e instanceof Error) {
      throw e;
    }
    throw new Error(`发送消息失败：${message}`);
  }
}
