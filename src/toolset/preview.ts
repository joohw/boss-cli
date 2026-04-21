/**
 * 在线简历预览：须在「推荐」页或「深度搜索 aiform」页且列表已加载；不自动跳转，否则报错。
 */
import { join } from 'node:path';
import {
  ONLINE_RESUME_IFRAME_APPEAR_MS,
  ONLINE_RESUME_IFRAME_SETTLE_MS,
  ONLINE_RESUME_IFRAME_WAIT_MAX_MS,
  sleepRandom,
  snapshotBossPageViewport,
} from '../browser/index.js';
import { createWaitManualLoginRequiredText } from '../common/auth.js';
import { withBossSessionPage } from '../common/boss_session_page.js';
import {
  closeBossPaywallPopupIfPresent,
  describeBossPaywallPopupIfPresent,
  waitForCResumeIframeOrPaywall,
} from '../common/boss_paywall_popup.js';
import {
  captureCResumeIframeToFile,
  closeCResumePanel,
  safeResumeScreenshotFileBase,
} from '../common/c_resume_capture.js';
import { ensureAppDataLayout, RESUME_SCREENSHOTS_DIR } from '../config.js';
import { isResumeOcrEnabled, ocrResumePngToTextFile } from '../ocr/index.js';
import {
  ensureInDeepSearchPage,
  isBossChatAiFormUrl,
  openDeepSearchResumePreview,
  readAiFormSelectedJobLabel,
  selectAiFormJob,
} from './deep-search.js';
import {
  assertRecommendPageReadyForPreview,
  isBossChatRecommendUrl,
  openRecommendResumePreview,
  selectRecommendJob,
} from './recommend.js';

export type PreviewOptions = {
  candidateTarget: string;
  jobKeyword?: string;
};

export async function runPreview(options: PreviewOptions): Promise<string> {
  const target = options.candidateTarget.trim();
  if (!target) {
    throw new Error('请提供候选人姓名或列表序号。');
  }
  try {
    return await withBossSessionPage(async (page) => {
      const kw = (options.jobKeyword ?? '').trim();
      const url = page.url();
      let jobLine: string;
      let savedOriginal: Awaited<ReturnType<typeof snapshotBossPageViewport>>;
      let opened: boolean;

      if (isBossChatAiFormUrl(url)) {
        await ensureInDeepSearchPage(page);
        if (kw) {
          const label = await selectAiFormJob(page, kw);
          await ensureInDeepSearchPage(page);
          jobLine = `当前岗位：${label}`;
        } else {
          const label = await readAiFormSelectedJobLabel(page);
          jobLine = `当前岗位：${label}`;
        }
        savedOriginal = await snapshotBossPageViewport(page);
        opened = await openDeepSearchResumePreview(page, target);
      } else if (isBossChatRecommendUrl(url)) {
        const frame = await assertRecommendPageReadyForPreview(page);
        const selectedJob = await selectRecommendJob(frame, kw);
        jobLine = selectedJob ? `当前岗位：${selectedJob}` : '当前岗位：默认';
        savedOriginal = await snapshotBossPageViewport(page);
        opened = await openRecommendResumePreview(frame, target);
      } else {
        throw new Error('当前不在推荐列表页或搜索结果页，无法预览候选人。');
      }

      if (!opened) {
        throw new Error('未在列表中找到该候选人，或点击未能打开简历预览。');
      }

      await sleepRandom(ONLINE_RESUME_IFRAME_APPEAR_MS.min, ONLINE_RESUME_IFRAME_APPEAR_MS.max);
      const outcome = await waitForCResumeIframeOrPaywall(page, ONLINE_RESUME_IFRAME_WAIT_MAX_MS);
      if (outcome !== 'iframe') {
        const paywall = await describeBossPaywallPopupIfPresent(page);
        await closeBossPaywallPopupIfPresent(page);
        if (paywall) {
          throw new Error(paywall);
        }
        throw new Error('点击后未出现在线简历 iframe（c-resume）。');
      }
      await sleepRandom(ONLINE_RESUME_IFRAME_SETTLE_MS.min, ONLINE_RESUME_IFRAME_SETTLE_MS.max);

      ensureAppDataLayout();
      const fileName = `preview-${safeResumeScreenshotFileBase(target)}-${Date.now()}.png`;
      const absPath = join(RESUME_SCREENSHOTS_DIR, fileName);

      const ok = await captureCResumeIframeToFile(page, savedOriginal, absPath);
      if (!ok) {
        await closeCResumePanel(page);
        throw new Error('在线简历 iframe 截图失败。');
      }

      const disclaimer =
        '说明：平台对在线简历的每日可查看次数有限，请按需使用、谨慎查看。';

      if (!isResumeOcrEnabled()) {
        return [jobLine, `简历预览截图：${absPath}`, '', disclaimer].join('\n');
      }
      try {
        const ocr = await ocrResumePngToTextFile(absPath);
        return [
          jobLine,
          `简历预览截图：${absPath}`,
          '',
          '在线简历 OCR 正文：',
          '',
          ocr.text,
          '',
          disclaimer,
        ].join('\n');
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        throw new Error(`简历预览截图已保存，但 OCR 失败：${msg}`);
      }
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    if (e instanceof Error && e.message.includes('浏览器会话尚未初始化')) {
      throw new Error(createWaitManualLoginRequiredText('简历预览截图'));
    }
    throw new Error(`简历预览失败：${message}`);
  }
}
