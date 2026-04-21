import process from 'node:process';
import type { Page } from 'puppeteer-core';
import { sleepRandom } from '../browser/index.js';
import { createWaitManualLoginRequiredText } from '../common/auth.js';
import { withBossSessionPage } from '../common/boss_session_page.js';
import { clickBossSidebarMenuToPath } from '../common/boss_sidebar_nav.js';

const BOSS_CHAT_AI_FORM_URL = 'https://www.zhipin.com/web/chat/aiform';
const AI_FORM_SETTLE_MS = { min: 1600, max: 2600 } as const;

type SearchFormSnapshot = {
  selectedJob: string;
  coreRequirements: string[];
  bonusRequirements: string[];
  remainingCountText: string;
};

export type DeepSearchGeekItem = {
  name: string;
  meta: string;
  work: string;
  edu: string;
  reason: string;
};

export function isBossChatAiFormUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (!u.hostname.includes('zhipin.com')) {
      return false;
    }
    const p = u.pathname.replace(/\/+$/, '') || '/';
    return p === '/web/chat/aiform';
  } catch {
    return false;
  }
}

async function waitForAiFormReady(page: Page): Promise<void> {
  await page.waitForFunction(
    `(() => {
      const root = document.querySelector(".ai-form-left");
      const submit = document.querySelector(".ai-form-match-footer .btn-ai-match-v2");
      const selected = document.querySelector(".job-dropmenu-select .job-main-text");
      if (!root || !submit || !selected) {
        return false;
      }
      const text = (selected.textContent ?? "").replace(/\\s+/g, " ").trim();
      return text.length > 0;
    })()`,
    { timeout: 15_000 },
  );
}

export async function ensureInDeepSearchPage(page: Page): Promise<void> {
  if (!isBossChatAiFormUrl(page.url())) {
    throw new Error('当前不在深度搜索页（/web/chat/aiform），请先通过侧栏进入「深度搜索」。');
  }
  await waitForAiFormReady(page);
}

async function clickAddConditionInSection(page: Page, titleKeyword: string): Promise<void> {
  const titleLiteral = JSON.stringify(titleKeyword);
  const clicked = (await page.evaluate(`((titleKeyword) => {
    const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
    function findFormSectionByTitle(kw) {
      const h3s = Array.from(document.querySelectorAll(".form-content .form-content-title-h3"));
      const h3 = h3s.find((el) => norm(el.textContent).includes(kw));
      return h3 ? h3.closest(".form-content") : null;
    }
    const section = findFormSectionByTitle(titleKeyword);
    if (!section) return false;
    const header = section.querySelector(".form-content-header");
    const titleBtn = header?.querySelector(".form-content-title-btn");
    if (!(titleBtn instanceof HTMLElement)) return false;
    if (!norm(titleBtn.textContent).includes("添加条件")) return false;
    titleBtn.scrollIntoView({ block: "center", inline: "nearest" });
    titleBtn.click();
    return true;
  })(${titleLiteral})`)) as boolean;
  if (!clicked) {
    throw new Error(`未找到「${titleKeyword}」区域的「添加条件」。`);
  }
  await sleepRandom(280, 520);
}

/** 等待指定区块内第 idx 行已出现在 DOM 中（岗位切换等可能导致列表晚于表单壳渲染）。 */
async function waitForRequirementRowPresent(
  page: Page,
  titleKeyword: string,
  rowIndex: number,
  timeoutMs = 5000,
): Promise<boolean> {
  try {
    await page.waitForFunction(
      (kw: string, idx: number) => {
        function norm(v: string) {
          return (v ?? '').replace(/\s+/g, ' ').trim();
        }
        const h3s = Array.from(document.querySelectorAll('.form-content .form-content-title-h3'));
        const h3 = h3s.find((el) => norm(el.textContent ?? '').includes(kw));
        const section = h3 ? h3.closest('.form-content') : null;
        if (!section) return false;
        const list = section.querySelector('.form-content-list');
        if (!list) return false;
        const items = list.querySelectorAll('.form-content-list-item');
        if (idx < 0 || idx >= items.length) return false;
        return !!items[idx].querySelector('.form-content-list-item-title');
      },
      { timeout: timeoutMs },
      titleKeyword,
      rowIndex,
    );
    return true;
  } catch {
    return false;
  }
}

/** 深度搜索条件行：Boss 用 `.form-content-word` 展示文案（挂载很快，超时不宜过长）。 */
async function waitForFormContentWordInRow(
  page: Page,
  titleKeyword: string,
  rowIndex: number,
  timeoutMs = 1000,
): Promise<boolean> {
  try {
    await page.waitForFunction(
      (kw: string, idx: number) => {
        function norm(v: string) {
          return (v ?? '').replace(/\s+/g, ' ').trim();
        }
        const h3s = Array.from(document.querySelectorAll('.form-content .form-content-title-h3'));
        const h3 = h3s.find((el) => norm(el.textContent ?? '').includes(kw));
        const section = h3 ? h3.closest('.form-content') : null;
        if (!section) return false;
        const list = section.querySelector('.form-content-list');
        if (!list) return false;
        const items = list.querySelectorAll('.form-content-list-item');
        if (idx < 0 || idx >= items.length) return false;
        return !!items[idx].querySelector('.form-content-word');
      },
      { timeout: timeoutMs },
      titleKeyword,
      rowIndex,
    );
    return true;
  } catch {
    return false;
  }
}

function normFormText(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

/** 校验用：优先读 `.auto-resize-textarea-wrapper` 内 textarea/input，再读其它 input、最后 `.form-content-word`。 */
async function readRowRequirementShownText(
  page: Page,
  titleKeyword: string,
  rowIndex: number,
): Promise<string> {
  return page.evaluate(
    (kw: string, idx: number) => {
      function norm(v: string) {
        return (v ?? '').replace(/\s+/g, ' ').trim();
      }
      const h3s = Array.from(document.querySelectorAll('.form-content .form-content-title-h3'));
      const h3 = h3s.find((el) => norm(el.textContent ?? '').includes(kw));
      const section = h3 ? h3.closest('.form-content') : null;
      if (!section) return '';
      const list = section.querySelector('.form-content-list');
      if (!list) return '';
      const items = list.querySelectorAll('.form-content-list-item');
      if (idx < 0 || idx >= items.length) return '';
      const row = items[idx];
      const wrap = row.querySelector('.auto-resize-textarea-wrapper');
      if (wrap) {
        const ta = wrap.querySelector('textarea, input');
        if (ta instanceof HTMLTextAreaElement) {
          return norm(ta.value);
        }
        if (ta instanceof HTMLInputElement && ta.type !== 'hidden') {
          return norm(ta.value);
        }
      }
      const scope = row.querySelector('.form-content-list-item-content') ?? row;
      const inp = scope.querySelector('input, textarea');
      if (inp instanceof HTMLInputElement && inp.type !== 'hidden') {
        return norm(inp.value);
      }
      if (inp instanceof HTMLTextAreaElement) {
        return norm(inp.value);
      }
      const word =
        row.querySelector('.form-content-list-item-title .form-content-word') ||
        row.querySelector('.form-content-word');
      return norm(word?.textContent ?? '');
    },
    titleKeyword,
    rowIndex,
  );
}

/** 点击行内 `.form-content-list-item-content`，Boss 会在内部挂载 `.auto-resize-textarea-wrapper` + textarea。 */
async function clickFormContentListItemContent(
  page: Page,
  titleKeyword: string,
  rowIndex: number,
): Promise<boolean> {
  return page.evaluate(
    (kw: string, idx: number) => {
      function norm(v: string) {
        return (v ?? '').replace(/\s+/g, ' ').trim();
      }
      const h3s = Array.from(document.querySelectorAll('.form-content .form-content-title-h3'));
      const h3 = h3s.find((el) => norm(el.textContent ?? '').includes(kw));
      const section = h3 ? h3.closest('.form-content') : null;
      if (!section) return false;
      const items = section.querySelectorAll('.form-content-list .form-content-list-item');
      if (idx < 0 || idx >= items.length) return false;
      const row = items[idx];
      const content = row.querySelector('.form-content-list-item-content');
      if (!(content instanceof HTMLElement)) return false;
      content.scrollIntoView({ block: 'center', inline: 'nearest' });
      content.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      content.click();
      return true;
    },
    titleKeyword,
    rowIndex,
  );
}

async function waitForAutoResizeTextareaInRow(
  page: Page,
  titleKeyword: string,
  rowIndex: number,
  timeoutMs = 1800,
): Promise<boolean> {
  try {
    await page.waitForFunction(
      (kw: string, idx: number) => {
        function norm(v: string) {
          return (v ?? '').replace(/\s+/g, ' ').trim();
        }
        const h3s = Array.from(document.querySelectorAll('.form-content .form-content-title-h3'));
        const h3 = h3s.find((el) => norm(el.textContent ?? '').includes(kw));
        const section = h3 ? h3.closest('.form-content') : null;
        if (!section) return false;
        const items = section.querySelectorAll('.form-content-list .form-content-list-item');
        if (idx < 0 || idx >= items.length) return false;
        const row = items[idx];
        const wrap = row.querySelector('.auto-resize-textarea-wrapper');
        if (!wrap) return false;
        const ta = wrap.querySelector('textarea, input');
        if (ta instanceof HTMLTextAreaElement) return true;
        if (ta instanceof HTMLInputElement && ta.type !== 'hidden' && ta.type !== 'button' && ta.type !== 'submit') {
          return true;
        }
        return false;
      },
      { timeout: timeoutMs },
      titleKeyword,
      rowIndex,
    );
    return true;
  } catch {
    return false;
  }
}

async function fillAutoResizeTextareaInRow(
  page: Page,
  titleKeyword: string,
  rowIndex: number,
  value: string,
): Promise<boolean> {
  return page.evaluate(
    (kw: string, idx: number, v: string) => {
      function norm(s: string) {
        return (s ?? '').replace(/\s+/g, ' ').trim();
      }
      function setNativeValue(el: HTMLInputElement | HTMLTextAreaElement, val: string): void {
        const tracker = (el as unknown as { _valueTracker?: { setValue: (x: string) => void } })._valueTracker;
        if (tracker && typeof tracker.setValue === 'function') {
          tracker.setValue('');
        }
        const proto =
          el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
        const desc = Object.getOwnPropertyDescriptor(proto, 'value');
        if (desc?.set) {
          desc.set.call(el, val);
        } else {
          el.value = val;
        }
      }
      const h3s = Array.from(document.querySelectorAll('.form-content .form-content-title-h3'));
      const h3 = h3s.find((el) => norm(el.textContent ?? '').includes(kw));
      const section = h3 ? h3.closest('.form-content') : null;
      if (!section) return false;
      const items = section.querySelectorAll('.form-content-list .form-content-list-item');
      if (idx < 0 || idx >= items.length) return false;
      const row = items[idx];
      const wrap = row.querySelector('.auto-resize-textarea-wrapper');
      if (!wrap) return false;
      const el = wrap.querySelector('textarea, input');
      if (!(el instanceof HTMLTextAreaElement) && !(el instanceof HTMLInputElement)) return false;
      if (el instanceof HTMLInputElement && (el.type === 'hidden' || el.type === 'button' || el.type === 'submit')) {
        return false;
      }
      el.focus();
      setNativeValue(el, v);
      el.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true, data: v }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      const titleWrap = row.querySelector('.form-content-list-item-title');
      titleWrap?.classList.remove('error');
      el.blur();
      return true;
    },
    titleKeyword,
    rowIndex,
    value,
  );
}

/** 用视口坐标点击 `.form-content-word` 中心，确保焦点落在真实文案节点上（比 programatic focus 更稳）。 */
async function clickFormContentWordCenter(page: Page, titleKeyword: string, rowIndex: number): Promise<boolean> {
  const pos = await page.evaluate(
    (kw: string, idx: number) => {
      function norm(v: string) {
        return (v ?? '').replace(/\s+/g, ' ').trim();
      }
      const h3s = Array.from(document.querySelectorAll('.form-content .form-content-title-h3'));
      const h3 = h3s.find((el) => norm(el.textContent ?? '').includes(kw));
      const section = h3 ? h3.closest('.form-content') : null;
      if (!section) return null;
      const list = section.querySelector('.form-content-list');
      if (!list) return null;
      const items = list.querySelectorAll('.form-content-list-item');
      if (idx < 0 || idx >= items.length) return null;
      const row = items[idx];
      const word =
        row.querySelector('.form-content-list-item-title .form-content-word') ||
        row.querySelector('.form-content-word');
      if (!(word instanceof HTMLElement)) return null;
      word.scrollIntoView({ block: 'center', inline: 'nearest' });
      const r = word.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    },
    titleKeyword,
    rowIndex,
  );
  if (!pos || !(pos.x > 0 && pos.y > 0)) {
    return false;
  }
  await page.mouse.click(pos.x, pos.y);
  return true;
}

async function tryFillRowViaDomEvaluate(
  page: Page,
  titleKeyword: string,
  rowIndex: number,
  value: string,
): Promise<boolean> {
  return page.evaluate(
    (kw: string, idx: number, v: string) => {
      function norm(s: string) {
        return (s ?? '').replace(/\s+/g, ' ').trim();
      }
      const h3s = Array.from(document.querySelectorAll('.form-content .form-content-title-h3'));
      const h3 = h3s.find((el) => norm(el.textContent ?? '').includes(kw));
      const section = h3 ? h3.closest('.form-content') : null;
      if (!section) return false;
      const list = section.querySelector('.form-content-list');
      if (!list) return false;
      const items = list.querySelectorAll('.form-content-list-item');
      const row = items[idx];
      if (!row) return false;
      row.scrollIntoView({ block: 'center', inline: 'nearest' });

      const scope = row.querySelector('.form-content-list-item-content') ?? row;
      function walkInput(root: Element | ShadowRoot): HTMLInputElement | HTMLTextAreaElement | null {
        const direct = root.querySelectorAll('input, textarea');
        for (let i = 0; i < direct.length; i++) {
          const el = direct[i];
          if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
            if (el.type === 'hidden' || el.type === 'submit' || el.type === 'button') continue;
            return el;
          }
        }
        for (const el of Array.from(root.querySelectorAll('*'))) {
          if (el.shadowRoot) {
            const f = walkInput(el.shadowRoot);
            if (f) return f;
          }
        }
        return null;
      }
      const inp = walkInput(scope);
      if (inp) {
        const tracker = (inp as unknown as { _valueTracker?: { setValue: (x: string) => void } })._valueTracker;
        if (tracker && typeof tracker.setValue === 'function') tracker.setValue('');
        const proto =
          inp instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
        const desc = Object.getOwnPropertyDescriptor(proto, 'value');
        if (desc?.set) desc.set.call(inp, v);
        else inp.value = v;
        inp.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true, data: v }));
        inp.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      }

      const word =
        row.querySelector('.form-content-list-item-title .form-content-word') ||
        row.querySelector('.form-content-word');
      if (word instanceof HTMLElement) {
        word.focus();
        word.click();
        try {
          document.execCommand('selectAll', false);
          document.execCommand('insertText', false, v);
        } catch {
          /* 由外层 CDP/键盘兜底 */
        }
        return true;
      }
      return false;
    },
    titleKeyword,
    rowIndex,
    value,
  );
}

/** 必须与目标文案一致（规范化空白后）；不用 includes，避免整段终端/回显误匹配。 */
function wordTextMatchesExpected(shown: string, expected: string): boolean {
  return normFormText(shown) === normFormText(expected);
}

/**
 * 直接改 DOM：文案在 `.form-content-list-item-title` > `.form-content-word` 内，无原生 input。
 * 同步写 inner 文本并向外层派发 input/change，并尝试去掉 error 态 class。
 */
async function setFormContentWordDirect(
  page: Page,
  titleKeyword: string,
  rowIndex: number,
  value: string,
): Promise<boolean> {
  return page.evaluate(
    (kw: string, idx: number, v: string) => {
      function norm(s: string) {
        return (s ?? '').replace(/\s+/g, ' ').trim();
      }
      const h3s = Array.from(document.querySelectorAll('.form-content .form-content-title-h3'));
      const h3 = h3s.find((el) => norm(el.textContent ?? '').includes(kw));
      const section = h3 ? h3.closest('.form-content') : null;
      if (!section) return false;
      const list = section.querySelector('.form-content-list');
      if (!list) return false;
      const items = list.querySelectorAll('.form-content-list-item');
      if (idx < 0 || idx >= items.length) return false;
      const row = items[idx];
      const titleWrap = row.querySelector('.form-content-list-item-title');
      let word =
        row.querySelector('.form-content-list-item-title .form-content-word') ||
        row.querySelector('.form-content-word');
      if (!(word instanceof HTMLElement)) {
        if (titleWrap instanceof HTMLElement) {
          word = document.createElement('div');
          word.className = 'form-content-word';
          titleWrap.appendChild(word);
        } else {
          return false;
        }
      }
      word.textContent = v;
      if (titleWrap instanceof HTMLElement) {
        titleWrap.classList.remove('error');
      }
      function fire(el: Element): void {
        try {
          el.dispatchEvent(
            new InputEvent('input', { bubbles: true, composed: true, data: v, inputType: 'insertText' }),
          );
        } catch {
          el.dispatchEvent(new Event('input', { bubbles: true }));
        }
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
      fire(word);
      if (titleWrap instanceof HTMLElement) {
        fire(titleWrap);
      }
      return true;
    },
    titleKeyword,
    rowIndex,
    value,
  );
}

/**
 * 在区块内按行下标写入一条条件（有内容则直接覆盖）。
 * Boss：先点 `.form-content-list-item-content`，再填 `.auto-resize-textarea-wrapper` 内 textarea；失败再改 word div / 键盘。
 */
async function fillRowAtIndexInSection(
  page: Page,
  titleKeyword: string,
  rowIndex: number,
  text: string,
): Promise<boolean> {
  const rowPresent = await waitForRequirementRowPresent(page, titleKeyword, rowIndex);
  if (!rowPresent) {
    return false;
  }

  const contentClicked = await clickFormContentListItemContent(page, titleKeyword, rowIndex);
  let clickedIndex = rowIndex;
  if (!contentClicked) {
    clickedIndex = await page.evaluate(
      (kw: string, idx: number) => {
        function norm(v: string) {
          return (v ?? '').replace(/\s+/g, ' ').trim();
        }
        function findFormSectionByTitle(keyword: string): HTMLElement | null {
          const h3s = Array.from(document.querySelectorAll('.form-content .form-content-title-h3'));
          const h3 = h3s.find((el) => norm(el.textContent ?? '').includes(keyword));
          const section = h3 ? h3.closest('.form-content') : null;
          if (!section?.querySelector('.form-content-list')) {
            return null;
          }
          return section as HTMLElement;
        }
        const section = findFormSectionByTitle(kw);
        if (!section) return -1;
        const list = section.querySelector('.form-content-list');
        if (!list) return -1;
        const items = list.querySelectorAll('.form-content-list-item');
        if (idx < 0 || idx >= items.length) return -1;
        const row = items[idx];
        const titleEl = row.querySelector('.form-content-list-item-title');
        if (!(titleEl instanceof HTMLElement)) return -1;
        titleEl.scrollIntoView({ block: 'center', inline: 'nearest' });
        titleEl.dispatchEvent(
          new MouseEvent('click', { bubbles: true, cancelable: true, view: window }),
        );
        titleEl.click();
        return idx;
      },
      titleKeyword,
      rowIndex,
    );
    if (clickedIndex < 0) {
      return false;
    }
  }

  await sleepRandom(120, 280);

  const tryVerify = async (): Promise<boolean> => {
    await sleepRandom(40, 100);
    const shown = await readRowRequirementShownText(page, titleKeyword, clickedIndex);
    return wordTextMatchesExpected(shown, text);
  };

  let hasAutoResize = await waitForAutoResizeTextareaInRow(page, titleKeyword, clickedIndex, 1800);
  if (!hasAutoResize && contentClicked) {
    await clickFormContentListItemContent(page, titleKeyword, clickedIndex);
    await sleepRandom(80, 160);
    hasAutoResize = await waitForAutoResizeTextareaInRow(page, titleKeyword, clickedIndex, 1200);
  }
  if (hasAutoResize) {
    await fillAutoResizeTextareaInRow(page, titleKeyword, clickedIndex, text);
    if (await tryVerify()) {
      await page.keyboard.press('Tab').catch(() => {});
      return true;
    }
    await page.evaluate(
      (kw: string, idx: number) => {
        function norm(v: string) {
          return (v ?? '').replace(/\s+/g, ' ').trim();
        }
        const h3s = Array.from(document.querySelectorAll('.form-content .form-content-title-h3'));
        const h3 = h3s.find((el) => norm(el.textContent ?? '').includes(kw));
        const section = h3 ? h3.closest('.form-content') : null;
        if (!section) return;
        const items = section.querySelectorAll('.form-content-list .form-content-list-item');
        const row = items[idx];
        const wrap = row?.querySelector('.auto-resize-textarea-wrapper');
        const ta = wrap?.querySelector('textarea, input');
        if (ta instanceof HTMLElement) {
          ta.focus();
          ta.click();
        }
      },
      titleKeyword,
      clickedIndex,
    );
    await sleepRandom(50, 120);
    await fillAutoResizeTextareaInRow(page, titleKeyword, clickedIndex, text);
    if (await tryVerify()) {
      await page.keyboard.press('Tab').catch(() => {});
      return true;
    }
  }

  let hasWord = await waitForFormContentWordInRow(page, titleKeyword, clickedIndex, 2000);
  if (!hasWord) {
    await page.evaluate(
      (kw: string, idx: number) => {
        function norm(v: string) {
          return (v ?? '').replace(/\s+/g, ' ').trim();
        }
        const h3s = Array.from(document.querySelectorAll('.form-content .form-content-title-h3'));
        const h3 = h3s.find((el) => norm(el.textContent ?? '').includes(kw));
        const section = h3 ? h3.closest('.form-content') : null;
        if (!section) return;
        const list = section.querySelector('.form-content-list');
        if (!list) return;
        const items = list.querySelectorAll('.form-content-list-item');
        const row = items[idx];
        const titleEl = row?.querySelector('.form-content-list-item-title');
        if (titleEl instanceof HTMLElement) {
          titleEl.dispatchEvent(new MouseEvent('dblclick', { bubbles: true, cancelable: true, view: window }));
          titleEl.click();
        }
      },
      titleKeyword,
      clickedIndex,
    );
    await sleepRandom(120, 240);
    hasWord = await waitForFormContentWordInRow(page, titleKeyword, clickedIndex, 1200);
  }

  if (await setFormContentWordDirect(page, titleKeyword, clickedIndex, text)) {
    if (await tryVerify()) {
      await page.keyboard.press('Tab').catch(() => {});
      return true;
    }
  }

  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => resolve());
        });
      }),
  );
  if (await setFormContentWordDirect(page, titleKeyword, clickedIndex, text)) {
    if (await tryVerify()) {
      await page.keyboard.press('Tab').catch(() => {});
      return true;
    }
  }

  await tryFillRowViaDomEvaluate(page, titleKeyword, clickedIndex, text);
  if (await tryVerify()) {
    await page.keyboard.press('Tab').catch(() => {});
    return true;
  }

  if (hasWord) {
    await clickFormContentWordCenter(page, titleKeyword, clickedIndex);
    await sleepRandom(60, 120);
    await page.evaluate(
      (kw: string, idx: number) => {
        function norm(v: string) {
          return (v ?? '').replace(/\s+/g, ' ').trim();
        }
        const h3s = Array.from(document.querySelectorAll('.form-content .form-content-title-h3'));
        const h3 = h3s.find((el) => norm(el.textContent ?? '').includes(kw));
        const section = h3 ? h3.closest('.form-content') : null;
        if (!section) return;
        const items = section.querySelectorAll('.form-content-list .form-content-list-item');
        const row = items[idx];
        const word =
          row?.querySelector('.form-content-list-item-title .form-content-word') ||
          row?.querySelector('.form-content-word');
        if (word instanceof HTMLElement) {
          word.focus();
        }
      },
      titleKeyword,
      clickedIndex,
    );
  } else {
    await page.evaluate(
      (kw: string, idx: number) => {
        function norm(v: string) {
          return (v ?? '').replace(/\s+/g, ' ').trim();
        }
        const h3s = Array.from(document.querySelectorAll('.form-content .form-content-title-h3'));
        const h3 = h3s.find((el) => norm(el.textContent ?? '').includes(kw));
        const section = h3 ? h3.closest('.form-content') : null;
        if (!section) return;
        const items = section.querySelectorAll('.form-content-list .form-content-list-item');
        const row = items[idx];
        const titleEl = row?.querySelector('.form-content-list-item-title');
        if (titleEl instanceof HTMLElement) {
          titleEl.scrollIntoView({ block: 'center', inline: 'nearest' });
          titleEl.focus();
          titleEl.click();
        }
      },
      titleKeyword,
      clickedIndex,
    );
    await sleepRandom(60, 100);
  }

  const selectAllMod = process.platform === 'darwin' ? 'Meta' : 'Control';
  await page.keyboard.down(selectAllMod);
  await page.keyboard.press('KeyA');
  await page.keyboard.up(selectAllMod);
  await sleepRandom(40, 80);
  await page.keyboard.type(text, { delay: 12 });
  await page.keyboard.press('Tab');
  await sleepRandom(50, 100);

  if (await tryVerify()) {
    return true;
  }

  return false;
}

/**
 * 每条条件按顺序对应第 0、1、2… 行：有行则覆盖内容；行不够则点「添加条件」再填。
 */
async function applyLinesToSection(page: Page, titleKeyword: string, lines: string[]): Promise<void> {
  let processed = 0;
  let nextRowIndex = 0;
  for (const raw of lines) {
    const text = raw.trim();
    if (!text) {
      continue;
    }
    let ok = await fillRowAtIndexInSection(page, titleKeyword, nextRowIndex, text);
    if (!ok) {
      await clickAddConditionInSection(page, titleKeyword);
      ok = await fillRowAtIndexInSection(page, titleKeyword, nextRowIndex, text);
    }
    if (!ok) {
      throw new Error(
        `「${titleKeyword}」第 ${processed + 1} 条条件无法填入（该区块无可用行或「添加条件」后仍失败）。`,
      );
    }
    processed += 1;
    nextRowIndex += 1;
  }
}

async function applyAiFormRequirementLists(
  page: Page,
  opts: { core?: string[]; bonus?: string[] },
): Promise<void> {
  if (opts.core !== undefined) {
    await applyLinesToSection(page, '核心要求', opts.core);
  }
  if (opts.bonus !== undefined) {
    await applyLinesToSection(page, '加分项', opts.bonus);
  }
}

async function readSearchFormSnapshot(page: Page): Promise<SearchFormSnapshot> {
  return (await page.evaluate(`(() => {
    const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
    function itemLineText(item) {
      const word = item.querySelector(".form-content-word");
      const w = word ? norm(word.textContent) : "";
      if (w) return w;
      const inp = item.querySelector("input, textarea");
      if (inp && norm(inp.value)) return norm(inp.value);
      const ce = item.querySelector("[contenteditable='true']");
      if (ce) return norm(ce.textContent);
      const titleEl = item.querySelector(".form-content-list-item-title");
      if (titleEl) return norm(titleEl.textContent);
      return "";
    }
    const selectedJob = norm(document.querySelector(".job-dropmenu-select .job-main-text")?.textContent);
    const sections = Array.from(document.querySelectorAll(".form-content"));
    const coreRequirements = [];
    const bonusRequirements = [];
    for (const section of sections) {
      const title = norm(section.querySelector(".form-content-header .form-content-title-h3")?.textContent);
      const items = section.querySelectorAll(".form-content-list-item");
      const words = Array.from(items)
        .map((item) => itemLineText(item))
        .filter(Boolean);
      if (title.includes("核心要求")) {
        coreRequirements.push(...words);
        continue;
      }
      if (title.includes("加分项")) {
        bonusRequirements.push(...words);
      }
    }
    const remainingCountText = norm(document.querySelector(".ai-form-match-footer-text-count")?.textContent);
    return {
      selectedJob,
      coreRequirements,
      bonusRequirements,
      remainingCountText,
    };
  })()`)) as SearchFormSnapshot;
}

export async function selectAiFormJob(page: Page, keyword: string): Promise<string> {
  const kw = keyword.trim();
  if (!kw) {
    throw new Error('岗位关键字不能为空。');
  }
  const kwLiteral = JSON.stringify(kw);

  const opened = (await page.evaluate(`(() => {
    const host = document.querySelector(".job-dropmenu-select");
    if (!(host instanceof HTMLElement)) return false;
    host.scrollIntoView({ block: "center", inline: "nearest" });
    host.click();
    return true;
  })()`)) as boolean;
  if (!opened) {
    throw new Error('未找到深度搜索页岗位下拉（.job-dropmenu-select）。');
  }
  await sleepRandom(450, 900);

  const searched = (await page.evaluate(`(() => {
    const kw = ${kwLiteral};
    const inputs = Array.from(
      document.querySelectorAll(
        ".ui-dropmenu-list input[type='text'], .ui-dropmenu-list input, .job-dropmenu-options .chat-job-search, .job-dropmenu-popover .chat-job-search, .top-chat-search .chat-job-search, input.chat-job-search",
      ),
    );
    const input = inputs.find((el) => {
      if (!(el instanceof HTMLInputElement)) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });
    if (!input) return false;
    input.focus();
    input.value = kw;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  })()`)) as boolean;
  if (searched) {
    await sleepRandom(520, 1080);
  } else {
    await sleepRandom(200, 450);
  }

  const picked = (await page.evaluate(`(() => {
    const kw = ${kwLiteral};
    const norm = (v) => (v ?? "").replace(/\\s+/g, "").trim().toLowerCase();
    const rows = Array.from(
      document.querySelectorAll(
        ".job-dropmenu-list .job-dropmenu-item, .job-dropmenu-options .job-list .job-item, .job-dropmenu-popover .job-list .job-item, .job-dropmenu-options .job-item",
      ),
    );
    if (rows.length === 0) return { ok: false, reason: "empty" };
    const target = rows.find((el) => {
      const label = norm(
        el.querySelector(".job-option-text, .label")?.textContent || el.textContent || "",
      );
      return label.includes(norm(kw));
    });
    if (!(target instanceof HTMLElement)) return { ok: false, reason: "not_found" };
    const label = (
      target.querySelector(".job-option-text, .label")?.textContent ?? target.textContent ?? ""
    )
      .replace(/\\s+/g, " ")
      .trim();
    target.scrollIntoView({ block: "center", inline: "nearest" });
    target.click();
    return { ok: true, label };
  })()`)) as { ok: boolean; label?: string; reason?: string };
  if (!picked.ok) {
    throw new Error(`未找到匹配岗位「${kw}」。`);
  }
  await sleepRandom(900, 1500);
  return picked.label ?? kw;
}

/** 深度搜索页当前选中的岗位文案（无则「默认」） */
export async function readAiFormSelectedJobLabel(page: Page): Promise<string> {
  return (await page.evaluate(`(() => {
    const t = (document.querySelector(".job-dropmenu-select .job-main-text")?.textContent ?? "")
      .replace(/\\s+/g, " ")
      .trim();
    return t.length > 0 ? t : "默认";
  })()`)) as string;
}

/**
 * 在深度搜索（aiform）主文档中按姓名或序号打开在线简历预览（与 {@link clickGreetDeepSearch} 同一卡片集合，排除「继续沟通」）。
 */
export async function openDeepSearchResumePreview(page: Page, target: string): Promise<boolean> {
  const raw = target.trim();
  const targetLiteral = JSON.stringify(raw);
  return (await page.evaluate(`(() => {
    const raw = ${targetLiteral};
    const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
    const allCards = Array.from(
      document.querySelectorAll(".geeks-box .geek-card-item, .geek-card-list .geek-card-item"),
    );
    if (allCards.length === 0) return false;
    const cards = allCards.filter((item) => {
      const chatLabel = norm(item.querySelector(".geek-chat")?.textContent);
      return !chatLabel.includes("继续沟通");
    });
    if (cards.length === 0) return false;

    const idxNum = Number.parseInt(raw, 10);
    var targetCard = null;
    if (Number.isFinite(idxNum) && idxNum >= 1 && idxNum <= cards.length) {
      targetCard = cards[idxNum - 1];
    } else {
      targetCard =
        cards.find((item) => {
          const name = norm(item.querySelector(".geek-name")?.textContent);
          return name === raw || name.includes(raw);
        }) ?? null;
    }
    if (!targetCard) return false;

    function tryOpen(el) {
      if (!(el instanceof HTMLElement)) return false;
      if (el.classList.contains("disabled")) return false;
      const st = window.getComputedStyle(el);
      if (st.pointerEvents === "none" || Number(st.opacity) < 0.3) return false;
      el.scrollIntoView({ block: "center", inline: "nearest" });
      el.click();
      return true;
    }

    const nameEl = targetCard.querySelector(".geek-name");
    if (nameEl instanceof HTMLElement) {
      nameEl.scrollIntoView({ block: "center", inline: "nearest" });
      nameEl.click();
      return true;
    }

    const resumeOnline = targetCard.querySelector("a.resume-btn-online");
    if (tryOpen(resumeOnline)) return true;
    const hrefResume = targetCard.querySelector('a[href*="c-resume"], a[href*="frame/c-resume"]');
    if (tryOpen(hrefResume)) return true;

    const links = Array.from(targetCard.querySelectorAll("a, button, .btn")).filter((node) => {
      const t = norm(node.textContent);
      return /在线简历|查看简历|简历预览|预览/.test(t);
    });
    if (links.length > 0 && tryOpen(links[0])) return true;

    const geekInfo = targetCard.querySelector(".geek-info, .geek-card-main, .card-content");
    if (geekInfo instanceof HTMLElement) {
      geekInfo.scrollIntoView({ block: "center", inline: "nearest" });
      geekInfo.click();
      return true;
    }

    return false;
  })()`)) as boolean;
}

export async function readDeepSearchGeekList(page: Page): Promise<DeepSearchGeekItem[]> {
  return (await page.evaluate(`(() => {
    const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
    const items = Array.from(
      document.querySelectorAll(".geeks-box .geek-card-item, .geek-card-list .geek-card-item"),
    );
    return items
      .map((item) => {
        const chatLabel = norm(item.querySelector(".geek-chat")?.textContent);
        if (chatLabel.includes("继续沟通")) {
          return null;
        }
        const name = norm(item.querySelector(".geek-name")?.textContent);
        const splits = Array.from(item.querySelectorAll(".geek-exp .split"))
          .map((el) => norm(el.getAttribute("title") || el.textContent || ""))
          .filter(Boolean);
        const meta = splits.join(" · ");
        const work = norm(item.querySelector(".geek-works span")?.textContent);
        const edu = norm(item.querySelector(".geek-edus span")?.textContent);
        const recEl = item.querySelector(".geek-recommend-text");
        let reason = "";
        if (recEl) {
          reason = norm(recEl.textContent).replace(/^推荐理由\\s*/, "").trim();
        }
        return { name, meta, work, edu, reason };
      })
      .filter((x) => x !== null);
  })()`)) as DeepSearchGeekItem[];
}

export function renderGeekListSection(title: string, items: DeepSearchGeekItem[]): string {
  const lines: string[] = [title, `共 ${items.length} 人`, ''];
  items.forEach((g, i) => {
    const n = i + 1;
    lines.push(`${n}. ${g.name || '（无姓名）'}`);
    if (g.meta) {
      lines.push(`   概要：${g.meta}`);
    }
    if (g.work) {
      lines.push(`   经历：${g.work}`);
    }
    if (g.edu) {
      lines.push(`   教育：${g.edu}`);
    }
    if (g.reason) {
      lines.push(`   推荐：${g.reason}`);
    }
    lines.push('');
  });
  return lines.join('\n').trimEnd();
}

export async function clickGreetDeepSearch(page: Page, target: string): Promise<{ message: string }> {
  const targetLiteral = JSON.stringify(target.trim());
  const result = (await page.evaluate(
    `(() => {
      const raw = ${targetLiteral};
      const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
      const allCards = Array.from(
        document.querySelectorAll(".geeks-box .geek-card-item, .geek-card-list .geek-card-item"),
      );
      if (allCards.length === 0) {
        return { kind: "empty" };
      }
      const cards = allCards.filter((item) => {
        const chatLabel = norm(item.querySelector(".geek-chat")?.textContent);
        return !chatLabel.includes("继续沟通");
      });
      if (cards.length === 0) {
        return { kind: "all_continue" };
      }

      const idxNum = Number.parseInt(raw, 10);
      let targetCard = null;
      if (Number.isFinite(idxNum) && idxNum >= 1 && idxNum <= cards.length) {
        targetCard = cards[idxNum - 1];
      } else {
        targetCard =
          cards.find((item) => {
            const name = norm(item.querySelector(".geek-name")?.textContent);
            return name === raw || name.includes(raw);
          }) ?? null;
      }
      if (!targetCard) {
        return { kind: "not_found", target: raw };
      }

      const name = norm(targetCard.querySelector(".geek-name")?.textContent);
      const btn =
        targetCard.querySelector(".geek-chat .btn-ai-v2") ||
        targetCard.querySelector(".geek-chat span.btn-ai-v2") ||
        targetCard.querySelector(".geek-chat span[class*='btn-ai']");
      if (!(btn instanceof HTMLElement)) {
        return { kind: "no_btn", name };
      }
      const label = norm(btn.textContent);
      if (!label.includes("打招呼")) {
        return { kind: "not_greet", name, label };
      }
      const cls = btn.className ?? "";
      const disabled = /disabled|forbid|ban/i.test(cls) || btn.getAttribute("disabled") !== null;
      if (disabled) {
        return { kind: "disabled", name };
      }
      btn.scrollIntoView({ block: "center", inline: "nearest" });
      btn.click();
      return { kind: "clicked", name };
    })()`,
  )) as
    | { kind: 'empty' }
    | { kind: 'all_continue' }
    | { kind: 'not_found'; target: string }
    | { kind: 'no_btn'; name: string }
    | { kind: 'not_greet'; name: string; label: string }
    | { kind: 'disabled'; name: string }
    | { kind: 'clicked'; name: string };

  switch (result.kind) {
    case 'empty':
      throw new Error('深度搜索暂无候选人列表，请先在页面点击「立即匹配」后再试。');
    case 'all_continue':
      throw new Error('当前列表均为「继续沟通」状态，已无待打招呼人选（与 boss deep-search 列表展示一致）。');
    case 'not_found':
      throw new Error(
        `未在可打招呼的深度搜索列表中找到目标：${result.target}（「继续沟通」人选已排除，请用 boss deep-search 核对序号与姓名）。`,
      );
    case 'no_btn':
      throw new Error(`候选人 ${result.name} 缺少「打招呼」按钮，无法执行。`);
    case 'not_greet':
      throw new Error(`候选人 ${result.name} 当前按钮为「${result.label}」，无法执行打招呼。`);
    case 'disabled':
      throw new Error(`候选人 ${result.name} 的打招呼不可用（可能已打过招呼）。`);
    case 'clicked':
      return { message: `已对 ${result.name} 在深度搜索页点击「打招呼」。` };
    default: {
      const _x: never = result;
      throw new Error(`未知结果：${String(_x)}`);
    }
  }
}

function renderFormSnapshotOnly(snap: SearchFormSnapshot): string {
  const core = snap.coreRequirements.length > 0 ? snap.coreRequirements.join('｜') : '（空）';
  const bonus = snap.bonusRequirements.length > 0 ? snap.bonusRequirements.join('｜') : '（空）';
  return [
    '已更新深度搜索表单（未触发「立即匹配」）。',
    `职位：${snap.selectedJob || '未知职位'}`,
    `核心要求(${snap.coreRequirements.length})：${core}`,
    `加分项(${snap.bonusRequirements.length})：${bonus}`,
    `今日匹配剩余：${snap.remainingCountText || '未知'}`,
    `来源页面：${BOSS_CHAT_AI_FORM_URL}`,
  ].join('\n');
}

export async function runBossSearchSet(opts: {
  jobKeyword?: string;
  coreRequirements?: string[];
  bonusRequirements?: string[];
}): Promise<string> {
  const jobKeyword = opts.jobKeyword?.trim();
  const coreReq = opts.coreRequirements;
  const bonusReq = opts.bonusRequirements;
  const hasFormEdit = coreReq !== undefined || bonusReq !== undefined;
  if (!jobKeyword && !hasFormEdit) {
    throw new Error('请至少指定 --job/-j、--core/-c 或 --bonus/-b 之一。');
  }

  try {
    return await withBossSessionPage(async (page) => {
      const currentUrl = page.url();
      if (!isBossChatAiFormUrl(currentUrl)) {
        await clickBossSidebarMenuToPath(page, '深度搜索', '/web/chat/aiform');
        await sleepRandom(AI_FORM_SETTLE_MS.min, AI_FORM_SETTLE_MS.max);
      }
      if (!isBossChatAiFormUrl(page.url())) {
        throw new Error('通过侧边栏“深度搜索”进入页面失败，请确认已登录并可访问 /web/chat/aiform。');
      }
      await ensureInDeepSearchPage(page);

      if (jobKeyword) {
        await selectAiFormJob(page, jobKeyword);
        await ensureInDeepSearchPage(page);
        if (hasFormEdit) {
          await sleepRandom(500, 900);
        }
      }

      if (hasFormEdit) {
        await applyAiFormRequirementLists(page, {
          core: coreReq,
          bonus: bonusReq,
        });
        await ensureInDeepSearchPage(page);
      }

      const snap = await readSearchFormSnapshot(page);
      return renderFormSnapshotOnly(snap);
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    if (e instanceof Error && e.message.includes('浏览器会话尚未初始化')) {
      throw new Error(createWaitManualLoginRequiredText('设置深度搜索条件'));
    }
    console.error(`[boss-cli] boss_search_set error: ${message}`);
    throw new Error(`设置深度搜索条件失败：${message}`);
  }
}

export async function runBossSearch(opts: { jobKeyword?: string } = {}): Promise<string> {
  const jobKeyword = opts.jobKeyword?.trim();

  try {
    return await withBossSessionPage(async (page) => {
      const currentUrl = page.url();
      if (!isBossChatAiFormUrl(currentUrl)) {
        await clickBossSidebarMenuToPath(page, '深度搜索', '/web/chat/aiform');
        await sleepRandom(AI_FORM_SETTLE_MS.min, AI_FORM_SETTLE_MS.max);
      }
      if (!isBossChatAiFormUrl(page.url())) {
        throw new Error('通过侧边栏“深度搜索”进入页面失败，请确认已登录并可访问 /web/chat/aiform。');
      }
      await ensureInDeepSearchPage(page);

      if (jobKeyword) {
        await selectAiFormJob(page, jobKeyword);
        await ensureInDeepSearchPage(page);
        await sleepRandom(600, 1200);
      }

      const geeks = await readDeepSearchGeekList(page);
      const title = jobKeyword
        ? `深度搜索当前列表（岗位：${jobKeyword}，未触发「立即匹配」）`
        : '深度搜索当前匹配结果（未触发「立即匹配」）';
      return renderGeekListSection(title, geeks);
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    if (e instanceof Error && e.message.includes('浏览器会话尚未初始化')) {
      throw new Error(createWaitManualLoginRequiredText('读取深度搜索列表'));
    }
    console.error(`[boss-cli] boss_search error: ${message}`);
    throw new Error(`读取深度搜索列表失败：${message}`);
  }
}
