import {
  createWaitManualLoginRequiredText,
  sleepRandom,
  withChatPage,
} from '../browser/index.js';
import {
  clickGreet,
  ensureInRecommendPage,
  markGreetProduced,
  readRecommendList,
  renderRecommendList,
} from './recommend.js';

export async function runRecommendGreet(target: string): Promise<string> {
  const t = target.trim();
  if (!t) {
    throw new Error('请提供打招呼目标（姓名或序号）。');
  }
  try {
    return await withChatPage(async (page) => {
      const frame = await ensureInRecommendPage(page);
      const before = await readRecommendList(frame);
      const greetResult = await clickGreet(frame, t);
      await sleepRandom(380, 1000);
      const after = await readRecommendList(frame);
      markGreetProduced(before, after);
      return [greetResult.message, '', '当前推荐列表（来源分组）：', renderRecommendList(after)].join('\n');
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    if (e instanceof Error && e.message.includes('浏览器会话尚未初始化')) {
      throw new Error(createWaitManualLoginRequiredText('推荐打招呼'));
    }
    throw new Error(`执行推荐打招呼失败：${message}`);
  }
}
