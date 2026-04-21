import type { ElementHandle, Frame, Page } from 'puppeteer-core';
import { sleepRandom } from '../browser/timing.js';
import { resumeHeight, setTempHeight } from '../browser/viewport_temp.js';

/** 在线简历 iframe：`src` 常为相对路径 `/web/frame/c-resume/...`，故用子串匹配 */
export const C_RESUME_IFRAME_SELECTOR =
  'iframe[src*="c-resume"], iframe[src*="frame/c-resume"]' as const;

const CLOSE_C_RESUME_PANEL_SCRIPT = `(() => {
  const sel = ${JSON.stringify(C_RESUME_IFRAME_SELECTOR)};
  const wraps = Array.from(document.querySelectorAll('.boss-popup__wrapper'));
  for (var wi = 0; wi < wraps.length; wi++) {
    var w = wraps[wi];
    if (w.querySelector(sel)) {
      var c = w.querySelector('.boss-popup__close') || w.querySelector('.btn-quxiao');
      if (c) {
        c.click();
        return true;
      }
    }
  }
  var iframe = document.querySelector(sel);
  var node = iframe ? iframe.parentElement : null;
  for (var i = 0; i < 12 && node; i++) {
    var closeBtn = node.querySelector(
      '.boss-popup__close, .drawer-close, .icon-close, .btn-quxiao',
    );
    if (closeBtn) {
      closeBtn.click();
      return true;
    }
    node = node.parentElement;
  }
  return false;
})()`;

const VISIBLE_C_RESUME_IN_FRAME_SCRIPT = `(() => {
  var iframe = document.querySelector(${JSON.stringify(C_RESUME_IFRAME_SELECTOR)});
  if (!(iframe instanceof HTMLElement)) return false;
  var r = iframe.getBoundingClientRect();
  return r.width > 8 && r.height > 8;
})()`;

export async function frameHasVisibleCResumeIframe(frame: Frame): Promise<boolean> {
  try {
    return (await frame.evaluate(VISIBLE_C_RESUME_IN_FRAME_SCRIPT)) as boolean;
  } catch {
    return false;
  }
}

/** 截图文件名安全段（在线简历 / 推荐预览共用） */
export function safeResumeScreenshotFileBase(name: string): string {
  const t = name.replace(/[/\\?%*:|"<>]/g, '_').trim().slice(0, 64);
  return t.length > 0 ? t : 'candidate';
}

/** 关闭含 `c-resume` iframe 的弹层（聊天「在线简历」与推荐「预览」共用）。含 `.boss-popup__close`、`.btn-quxiao`（取消）等。会在主文档与各子 frame 中尝试。 */
export async function closeCResumePanel(page: Page): Promise<void> {
  try {
    for (const frame of page.frames()) {
      try {
        await frame.evaluate(CLOSE_C_RESUME_PANEL_SCRIPT);
      } catch {
        /* detached / 无权限 */
      }
    }
    await sleepRandom(200, 450);
  } catch {
    /* ignore */
  }
}

/**
 * 在任意 frame（含主 frame、`recommendFrame` 等）中查找已挂载且尺寸可见的 c-resume iframe。
 */
export async function findVisibleCResumeIframeHandle(page: Page): Promise<ElementHandle<Element> | null> {
  for (const frame of page.frames()) {
    try {
      if (!(await frameHasVisibleCResumeIframe(frame))) {
        continue;
      }
      const h = await frame.$(C_RESUME_IFRAME_SELECTOR);
      if (h) {
        return h;
      }
    } catch {
      /* detached */
    }
  }
  return null;
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

    const iframe = await findVisibleCResumeIframeHandle(page);
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
