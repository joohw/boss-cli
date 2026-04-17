import {
  createWaitManualLoginRequiredText,
  resumeHeight,
  setTempHeight,
  sleepRandom,
  snapshotBossPageViewport,
  withBossSessionPage,
} from '../browser/index.js';
import {
  clickGreet,
  ensureInRecommendPage,
  markGreetProduced,
  readRecommendList,
  renderRecommendList,
} from './recommend.js';

/** 打招呼前临时拉高父页视口，使 iframe 内更多卡片进入 DOM（与 recommend 列表读取已解耦）。 */
const RECOMMEND_GREET_EXPAND_HEIGHT_PX = 3000;
const RECOMMEND_GREET_EXPAND_SETTLE_MS = { min: 600, max: 1400 } as const;
import {
  clickGreetDeepSearch,
  ensureInDeepSearchPage,
  isBossChatAiFormUrl,
  readDeepSearchGeekList,
  renderGeekListSection,
} from './deep-search.js';

export async function runRecommendGreet(target: string): Promise<string> {
  const t = target.trim();
  if (!t) {
    throw new Error('请提供打招呼目标（姓名或序号）。');
  }
  try {
    return await withBossSessionPage(async (page) => {
      const url = page.url();
      if (isBossChatAiFormUrl(url)) {
        await ensureInDeepSearchPage(page);
        const greetResult = await clickGreetDeepSearch(page, t);
        await sleepRandom(380, 1000);
        const after = await readDeepSearchGeekList(page);
        return [greetResult.message, '', '当前深度搜索列表：', renderGeekListSection('深度搜索匹配结果', after)].join(
          '\n',
        );
      }

      const frame = await ensureInRecommendPage(page);
      const savedViewport = await snapshotBossPageViewport(page);
      try {
        await setTempHeight(page, savedViewport, RECOMMEND_GREET_EXPAND_HEIGHT_PX);
        await sleepRandom(
          RECOMMEND_GREET_EXPAND_SETTLE_MS.min,
          RECOMMEND_GREET_EXPAND_SETTLE_MS.max,
        );
        const before = await readRecommendList(frame);
        const greetResult = await clickGreet(frame, t);
        await sleepRandom(380, 1000);
        const after = await readRecommendList(frame);
        markGreetProduced(before, after);
        return [greetResult.message, '', '当前推荐列表（来源分组）：', renderRecommendList(after)].join('\n');
      } finally {
        await resumeHeight(page, savedViewport);
      }
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    if (e instanceof Error && e.message.includes('浏览器会话尚未初始化')) {
      throw new Error(createWaitManualLoginRequiredText('打招呼'));
    }
    throw new Error(`执行打招呼失败：${message}`);
  }
}
