import type { Page } from 'puppeteer-core';
import { ONLINE_RESUME_IFRAME_WAIT_MAX_MS } from '../browser/human_delay.js';
import { sleepRandom } from '../browser/timing.js';

/** 与 {@link describeBossPaywallPopupIfPresent} 中付费层判定一致；先匹配到 c-resume iframe 则返回 iframe。 */
const WAIT_FOR_IFRAME_OR_PAYWALL_SCRIPT = `(() => {
  const iframe = document.querySelector(
    'iframe[src*="c-resume"], iframe[src*="frame/c-resume"]',
  );
  if (iframe instanceof HTMLElement) {
    const r = iframe.getBoundingClientRect();
    if (r.width > 8 && r.height > 8) return "iframe";
  }
  const roots = Array.from(
    document.querySelectorAll(".boss-popup__wrapper, .boss-dialog__wrapper"),
  );
  for (const root of roots) {
    if (!(root instanceof HTMLElement)) continue;
    const st = window.getComputedStyle(root);
    if (st.display === "none" || st.visibility === "hidden" || Number(st.opacity) < 0.05) {
      continue;
    }
    const rect = root.getBoundingClientRect();
    if (rect.width < 20 || rect.height < 20) continue;
    const hasVipUi = root.querySelector(
      ".block-vip2, .vip2-layout, .payment-layout-v2, .rights-table-vip, .qrcode-v1, .pay-wrap-qrcode-v1, .panel-deadline",
    );
    const text = (root.textContent || "").replace(/\\s+/g, " ");
    const hasPayText =
      /VIP账号|商品需付|直豆|扫码支付|请使用.*支付宝|请使用.*微信|增值服务协议|VIP\\s*\\d+项|限时特惠|直豆抵扣/.test(
        text,
      );
    if (!hasVipUi && !hasPayText) continue;
    return "paywall";
  }
  return "";
})()`;

/**
 * 轮询直到出现 c-resume iframe、或出现付费墙、或超时。付费墙出现时不必再等满 {@link ONLINE_RESUME_IFRAME_WAIT_MAX_MS}。
 */
export async function waitForCResumeIframeOrPaywall(
  page: Page,
  timeoutMs: number = ONLINE_RESUME_IFRAME_WAIT_MAX_MS,
): Promise<'iframe' | 'paywall' | 'neither'> {
  try {
    const handle = await page.waitForFunction(WAIT_FOR_IFRAME_OR_PAYWALL_SCRIPT, {
      timeout: timeoutMs,
      polling: 200,
    });
    const v = (await handle.jsonValue()) as unknown;
    if (v === 'iframe' || v === 'paywall') {
      return v;
    }
    return 'neither';
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (/timeout|Timeout|exceeded|Waiting failed/i.test(msg)) {
      return 'neither';
    }
    throw e;
  }
}

/**
 * 若当前存在 VIP/付费类弹层（判定规则与 {@link describeBossPaywallPopupIfPresent} 一致），
 * 则点击关闭按钮以恢复页面可操作状态。返回是否执行了关闭。
 */
export async function closeBossPaywallPopupIfPresent(page: Page): Promise<boolean> {
  const closed = (await page.evaluate(`(() => {
    const roots = Array.from(
      document.querySelectorAll(".boss-popup__wrapper, .boss-dialog__wrapper"),
    );
    for (const root of roots) {
      if (!(root instanceof HTMLElement)) continue;
      const st = window.getComputedStyle(root);
      if (st.display === "none" || st.visibility === "hidden" || Number(st.opacity) < 0.05) {
        continue;
      }
      const rect = root.getBoundingClientRect();
      if (rect.width < 20 || rect.height < 20) continue;
      const hasVipUi = root.querySelector(
        ".block-vip2, .vip2-layout, .payment-layout-v2, .rights-table-vip, .qrcode-v1, .pay-wrap-qrcode-v1, .panel-deadline",
      );
      const text = (root.textContent || "").replace(/\\s+/g, " ");
      const hasPayText =
        /VIP账号|商品需付|直豆|扫码支付|请使用.*支付宝|请使用.*微信|增值服务协议|VIP\\s*\\d+项|限时特惠|直豆抵扣/.test(
          text,
        );
      if (!hasVipUi && !hasPayText) continue;
      const closeBtn = root.querySelector(
        ".boss-popup__close, .boss-dialog__close, .drawer-close, .icon-close",
      );
      if (closeBtn instanceof HTMLElement) {
        closeBtn.click();
        return true;
      }
    }
    return false;
  })()`)) as boolean;
  if (closed) {
    await sleepRandom(220, 480);
  }
  return closed;
}

/**
 * 检测 Boss 页面上是否出现 VIP/付费购买类弹层（如点击「在线简历」或推荐预览后拦截权益时）。
 * 命中则返回简短中文说明，供与「未出现 c-resume iframe」类错误拼接。
 */
export async function describeBossPaywallPopupIfPresent(page: Page): Promise<string | null> {
  return (await page.evaluate(`(() => {
    const roots = Array.from(
      document.querySelectorAll(".boss-popup__wrapper, .boss-dialog__wrapper"),
    );
    for (const root of roots) {
      if (!(root instanceof HTMLElement)) continue;
      const st = window.getComputedStyle(root);
      if (st.display === "none" || st.visibility === "hidden" || Number(st.opacity) < 0.05) {
        continue;
      }
      const rect = root.getBoundingClientRect();
      if (rect.width < 20 || rect.height < 20) continue;
      const hasVipUi = root.querySelector(
        ".block-vip2, .vip2-layout, .payment-layout-v2, .rights-table-vip, .qrcode-v1, .pay-wrap-qrcode-v1, .panel-deadline",
      );
      const text = (root.textContent || "").replace(/\\s+/g, " ");
      const hasPayText =
        /VIP账号|商品需付|直豆|扫码支付|请使用.*支付宝|请使用.*微信|增值服务协议|VIP\\s*\\d+项|限时特惠|直豆抵扣/.test(
          text,
        );
      if (!hasVipUi && !hasPayText) continue;
      const h = root.querySelector("h3.title, h4.title, .card-header .title");
      const title = (h?.textContent || "").replace(/\\s+/g, " ").trim();
      if (title) {
        return (
          "页面出现付费弹层（" +
          title +
          "），可能需开通 VIP 或购买权益后才能查看在线简历。"
        );
      }
      return "页面出现 VIP/付费购买弹层，可能需开通权益后才能查看在线简历。";
    }
    return null;
  })()`)) as string | null;
}
