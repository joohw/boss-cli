import type { Page } from 'puppeteer-core';
import { defaultViewportFromEnv } from './cdp_browser.js';

/** 临时拉高视口时的默认高度（CSS px）。可用 `BOSS_RESUME_SCREENSHOT_VIEWPORT_HEIGHT` 覆盖。 */
const DEFAULT_TEMP_VIEWPORT_HEIGHT_PX = 5000;

type ViewportState = Awaited<ReturnType<Page['viewport']>>;
export type BossViewportSnapshot = NonNullable<ViewportState>;

type ViewportNonNull = BossViewportSnapshot;

function resolvedTempHeightPx(heightPx?: number): number {
  if (heightPx !== undefined) {
    return heightPx;
  }
  const envH = Number.parseInt(process.env.BOSS_RESUME_SCREENSHOT_VIEWPORT_HEIGHT?.trim() ?? '', 10);
  return Number.isFinite(envH) && envH > 0 ? envH : DEFAULT_TEMP_VIEWPORT_HEIGHT_PX;
}

function dimensionsForTempHeight(prev: ViewportState, heightPx?: number): ViewportNonNull {
  const height = resolvedTempHeightPx(heightPx);
  const base = defaultViewportFromEnv();
  return {
    width: prev?.width ?? base.width,
    height,
    deviceScaleFactor: prev?.deviceScaleFactor ?? 1,
    isMobile: prev?.isMobile ?? false,
    hasTouch: prev?.hasTouch ?? false,
    isLandscape: prev?.isLandscape ?? false,
  };
}

function dimensionsAfterResume(prev: ViewportState): ViewportNonNull {
  if (prev) {
    return prev;
  }
  const d = defaultViewportFromEnv();
  return {
    width: d.width,
    height: d.height,
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
    isLandscape: false,
  };
}

/**
 * 供临时拉高/恢复视口使用。未设置 Puppeteer 固定视口时 `page.viewport()` 常为 `null`；
 * 若此时仍用 {@link defaultViewportFromEnv}（如 1280×1200）恢复，会改掉用户真实窗口对应的布局视口。
 * 在打开弹层/截图**之前**调用，用页面 `innerWidth`/`innerHeight` 作为恢复基准。
 */
export async function snapshotBossPageViewport(page: Page): Promise<BossViewportSnapshot> {
  const v = await page.viewport();
  if (v) {
    return {
      width: v.width,
      height: v.height,
      deviceScaleFactor: v.deviceScaleFactor ?? 1,
      isMobile: v.isMobile ?? false,
      hasTouch: v.hasTouch ?? false,
      isLandscape: v.isLandscape ?? false,
    };
  }
  const dims = await page.evaluate(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
    dpr: window.devicePixelRatio || 1,
  }));
  const width = Math.max(320, Math.round(dims.width));
  const height = Math.max(240, Math.round(dims.height));
  return {
    width,
    height,
    deviceScaleFactor: dims.dpr,
    isMobile: false,
    hasTouch: false,
    isLandscape: width > height,
  };
}

/** 截图前临时拉高视口高度；`prev` 一般为进入流程前 `await page.viewport()` 的快照。 */
export async function setTempHeight(
  page: Page,
  prev: ViewportState,
  heightPx?: number,
): Promise<void> {
  await page.setViewport(dimensionsForTempHeight(prev, heightPx));
}

/** 与 {@link setTempHeight} 配对，恢复截图前的视口。 */
export async function resumeHeight(page: Page, prev: ViewportState): Promise<void> {
  await page.setViewport(dimensionsAfterResume(prev));
}
