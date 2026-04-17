import type { Page } from 'puppeteer-core';
import { randomIntInclusive, sleep } from './timing.js';

/** 导航到沟通页并 load 后，等待 SPA/接口渲染 */
export const CHAT_GOTO_SETTLE_MS = { min: 2800, max: 5200 } as const;

/** 页面执行上下文被销毁后重试前 */
export const CONTEXT_DESTROY_RETRY_MS = { min: 900, max: 1800 } as const;

/** 列表滚动查找候选人时，每轮之间的间隔 */
export const OPEN_CHAT_SCROLL_GAP_MS = { min: 200, max: 580 } as const;

/** 点击会话行后，等待右侧面板出现的短停顿 */
export const OPEN_CHAT_AFTER_ROW_CLICK_MS = { min: 420, max: 1200 } as const;

/** mouse.click 的按下/抬起间隔（Puppeteer delay 选项） */
export const MOUSE_CLICK_PRESS_MS = { min: 55, max: 180 } as const;

/** 筛选「全部」等操作之间的停顿 */
export const LIST_FILTER_GAP_MS = { min: 780, max: 1400 } as const;

/** 列表稳定轮询间隔（随机） */
export const LIST_POLL_MS = { min: 340, max: 620 } as const;

/** 列表为空时至少等待多久才认为稳定 */
export const LIST_MIN_BEFORE_EMPTY_OK_MS = 3600;

/** 登录态探测轮询间隔 */
export const PROBE_LOGIN_POLL_MS = { min: 520, max: 980 } as const;

/** 点击聊天输入框 */
export const SEND_INPUT_CLICK_MS = { min: 45, max: 160 } as const;

/** 逐字输入：字符间隔（随机） */
export const SEND_TYPING_GAP_MS = { min: 38, max: 125 } as const;

/** 按下 Enter 后、流程结束前短停顿 */
export const SEND_AFTER_ENTER_MS = { min: 260, max: 920 } as const;

/** `send` 中先发完文字后、再执行 `--action` 前的默认随机间隔（求简历 / 同意或拒绝附件等） */
export const SEND_BEFORE_RESUME_MS = { min: 2800, max: 5600 } as const;

/** 点击「沟通记录」后等待弹窗与列表渲染 */
export const CHAT_HISTORY_DIALOG_WAIT_MS = { min: 500, max: 1400 } as const;

/** 「同事沟通」/「我的沟通」切换后等待列表刷新 */
export const CHAT_HISTORY_TAB_SWITCH_MS = { min: 350, max: 900 } as const;

/** 点击「在线简历」后等待 iframe 出现 */
export const ONLINE_RESUME_IFRAME_APPEAR_MS = { min: 600, max: 1600 } as const;

/**
 * 点击后等待 c-resume iframe 出现、或判定为付费墙弹层的上限（毫秒）。
 * 仅在未出现付费墙时才会接近该时长；若先出现付费墙会提前结束（见 `waitForCResumeIframeOrPaywall`）。
 */
export const ONLINE_RESUME_IFRAME_WAIT_MAX_MS = 12_000;

/** iframe 出现后等待简历区域渲染 */
export const ONLINE_RESUME_IFRAME_SETTLE_MS = { min: 1800, max: 4200 } as const;

/**
 * 逐字符输入，字符之间为随机间隔（末尾字符后不再额外等待）。
 */
export async function typeTextWithRandomKeyDelay(
  page: Page,
  text: string,
  minGapMs: number,
  maxGapMs: number,
  signal?: AbortSignal,
): Promise<void> {
  const codepoints = Array.from(text);
  for (let i = 0; i < codepoints.length; i++) {
    if (signal?.aborted) {
      throw new Error('Aborted');
    }
    const ch = codepoints[i]!;
    await page.keyboard.type(ch, { delay: 0 });
    if (i < codepoints.length - 1) {
      await sleep(randomIntInclusive(minGapMs, maxGapMs), signal);
    }
  }
}
