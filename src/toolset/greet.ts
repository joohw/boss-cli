import {
  GREET_PAYWALL_WAIT_MAX_MS,
  ONLINE_RESUME_IFRAME_APPEAR_MS,
  resumeHeight,
  setTempHeight,
  sleepRandom,
  snapshotBossPageViewport,
} from '../browser/index.js';
import { createWaitManualLoginRequiredText } from '../common/auth.js';
import {
  closeBossPaywallPopupIfPresent,
  describeBossPaywallPopupIfPresent,
  waitForBossPaywallPopup,
} from '../common/boss_paywall_popup.js';
import { withBossSessionPage } from '../common/boss_session_page.js';
import {
  clickGreetDeepSearch,
  ensureInDeepSearchPage,
  isBossChatAiFormUrl,
  readDeepSearchGeekList,
  renderGeekListSection,
} from './deep-search.js';
import {
  clickGreet,
  ensureInRecommendPage,
  markGreetProduced,
  readRecommendList,
  renderRecommendList,
} from './recommend.js';
import type { Page } from 'puppeteer-core';

/** 打招呼前临时拉高父页视口，使 iframe 内更多卡片进入 DOM（与 recommend 列表读取已解耦）。 */
const RECOMMEND_GREET_EXPAND_HEIGHT_PX = 3000;
const RECOMMEND_GREET_EXPAND_SETTLE_MS = { min: 600, max: 1400 } as const;

async function assertNoGreetPaywallPopup(page: Page): Promise<void> {
  await sleepRandom(ONLINE_RESUME_IFRAME_APPEAR_MS.min, ONLINE_RESUME_IFRAME_APPEAR_MS.max);
  if (await waitForBossPaywallPopup(page, GREET_PAYWALL_WAIT_MAX_MS)) {
    const paywall = await describeBossPaywallPopupIfPresent(page, 'greet');
    await closeBossPaywallPopupIfPresent(page);
    if (paywall) {
      throw new Error(paywall);
    }
    throw new Error('页面出现 VIP/付费购买弹层，打招呼可能需开通权益或充值直豆。');
  }
}

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
        await assertNoGreetPaywallPopup(page);
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
        await assertNoGreetPaywallPopup(page);
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
