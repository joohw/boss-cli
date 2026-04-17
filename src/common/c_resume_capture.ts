import type { Page } from 'puppeteer-core';
import { sleepRandom } from '../browser/timing.js';
import { resumeHeight, setTempHeight } from '../browser/viewport_temp.js';

/** 截图文件名安全段（在线简历 / 推荐预览共用） */
export function safeResumeScreenshotFileBase(name: string): string {
  const t = name.replace(/[/\\?%*:|"<>]/g, '_').trim().slice(0, 64);
  return t.length > 0 ? t : 'candidate';
}

/** 关闭含 `c-resume` iframe 的弹层（聊天「在线简历」与推荐「预览」共用）。 */
export async function closeCResumePanel(page: Page): Promise<void> {
  try {
    await page.evaluate(() => {
      const wraps = Array.from(document.querySelectorAll('.boss-popup__wrapper'));
      for (const w of wraps) {
        if (w.querySelector('iframe[src*="c-resume"], iframe[src*="frame/c-resume"]')) {
          const c = w.querySelector('.boss-popup__close');
          if (c) {
            (c as HTMLElement).click();
            return;
          }
        }
      }
      const iframe = document.querySelector(
        'iframe[src*="c-resume"], iframe[src*="frame/c-resume"]',
      );
      let node: Element | null = iframe?.parentElement ?? null;
      for (let i = 0; i < 12 && node; i++) {
        const c = node.querySelector('.boss-popup__close, .drawer-close, .icon-close');
        if (c) {
          (c as HTMLElement).click();
          return;
        }
        node = node.parentElement;
      }
    });
    await sleepRandom(200, 450);
  } catch {
    /* ignore */
  }
}

/**
 * 在已出现 `c-resume` iframe 的页面上，对 iframe 整框截图并关闭弹层。
 * `preOpenViewport` 为打开弹层前的视口快照，请用 `snapshotBossPageViewport(page)`（`page.viewport()` 常为 null 时勿直接用默认尺寸）。
 */
export async function captureCResumeIframeToFile(
  page: Page,
  preOpenViewport: Awaited<ReturnType<Page['viewport']>>,
  absPath: string,
): Promise<boolean> {
  try {
    await setTempHeight(page, preOpenViewport);
    await sleepRandom(100, 320);

    const iframe = await page.$('iframe[src*="c-resume"], iframe[src*="frame/c-resume"]');
    if (!iframe) {
      return false;
    }

    await iframe.evaluate((el) => {
      (el as HTMLElement).scrollIntoView({ block: 'start', inline: 'nearest' });
    });

    const box = await iframe.boundingBox();
    if (!box) {
      await iframe.dispose();
      return false;
    }

    try {
      await iframe.screenshot({
        path: absPath,
        type: 'png',
        captureBeyondViewport: true,
      });
    } finally {
      await iframe.dispose();
    }

    await closeCResumePanel(page);
    return true;
  } finally {
    await resumeHeight(page, preOpenViewport);
  }
}
