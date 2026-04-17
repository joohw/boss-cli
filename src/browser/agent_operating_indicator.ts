import type { Page } from 'puppeteer-core';

const OVERLAY_ID = '__boss_cli_agent_operating__';
const STYLE_ID = '__boss_cli_agent_operating_style__';

/**
 * 全屏半透明彩虹蒙层（呼吸式明暗脉冲），文案视口居中；`pointer-events: none` 不拦截页面点击与自动化操作。
 * 与 {@link hideAgentOperatingIndicator} 成对使用。
 */
export async function showAgentOperatingIndicator(page: Page): Promise<void> {
  await page.evaluate(
    (ids: { overlay: string; style: string }) => {
      const { overlay, style: styleId } = ids;
      if (document.getElementById(overlay)) {
        return;
      }

      const styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.textContent = `
        @keyframes boss-cli-breathe {
          0%,
          100% {
            opacity: 0.82;
            filter: brightness(0.96) saturate(0.95);
          }
          50% {
            opacity: 1;
            filter: brightness(1.05) saturate(1.05);
          }
        }
        #${overlay} {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          height: 100dvh;
          z-index: 2147483647;
          pointer-events: none;
          overflow: hidden;
          box-sizing: border-box;
          background:
            radial-gradient(ellipse 80% 60% at 50% 45%, rgba(255, 255, 255, 0.07) 0%, transparent 55%),
            linear-gradient(
              125deg,
              rgba(255, 89, 94, 0.22) 0%,
              rgba(255, 146, 76, 0.18) 16%,
              rgba(255, 202, 58, 0.16) 32%,
              rgba(197, 224, 99, 0.14) 46%,
              rgba(138, 201, 38, 0.15) 54%,
              rgba(25, 130, 196, 0.2) 70%,
              rgba(106, 76, 147, 0.18) 84%,
              rgba(185, 103, 255, 0.2) 100%
            );
          animation: boss-cli-breathe 2.6s ease-in-out infinite;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        #${overlay} .boss-cli-agent-label {
          max-width: min(36rem, 92vw);
          font: 600 14px/1.45 system-ui, -apple-system, "Segoe UI", sans-serif;
          color: #ffffff;
          letter-spacing: 0.02em;
          text-align: center;
          text-shadow:
            0 0 12px rgba(0, 0, 0, 0.55),
            0 1px 4px rgba(0, 0, 0, 0.45);
        }
      `;

      const bar = document.createElement('div');
      bar.id = overlay;
      bar.setAttribute('role', 'status');
      bar.setAttribute('aria-live', 'polite');

      const label = document.createElement('div');
      label.className = 'boss-cli-agent-label';
      label.textContent = 'boss-cli 正在操作您的浏览器 请稍候';

      bar.appendChild(label);

      const root = document.body ?? document.documentElement;
      root.appendChild(styleEl);
      root.appendChild(bar);
    },
    { overlay: OVERLAY_ID, style: STYLE_ID },
  );
}

/** 移除 {@link showAgentOperatingIndicator} 注入的样式与全屏蒙层（幂等）。 */
export async function hideAgentOperatingIndicator(page: Page): Promise<void> {
  try {
    await page.evaluate(
      (ids: { overlay: string; style: string }) => {
        document.getElementById(ids.overlay)?.remove();
        document.getElementById(ids.style)?.remove();
      },
      { overlay: OVERLAY_ID, style: STYLE_ID },
    );
  } catch {
    /* 页面已关闭或导航中时不抛 */
  }
}
