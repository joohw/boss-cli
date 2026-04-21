import type { Page } from 'puppeteer-core';
import {
  CHAT_HISTORY_DIALOG_WAIT_MS,
  CHAT_HISTORY_TAB_SWITCH_MS,
  MOUSE_CLICK_PRESS_MS,
  OPEN_CHAT_AFTER_ROW_CLICK_MS,
  OPEN_CHAT_SCROLL_GAP_MS,
  randomIntInclusive,
  sleepRandom,
} from '../browser/index.js';
import { isBossChatIndexUrl } from '../common/auth.js';
import { ensureChatIndexAllFilter } from './list.js';

type ChatFrom = 'friend' | 'myself' | 'system' | 'unknown';

function chatRoleTag(from: ChatFrom): string {
  switch (from) {
    case 'friend':
      return '[candidate]';
    case 'myself':
      return '[you]';
    case 'system':
      return '[system]';
    default:
      return '[unknown]';
  }
}

/**
 * 打开「沟通记录」弹窗，依次读取「同事沟通」「我的沟通」列表，关闭弹窗。
 * 未找到入口时返回 null（视为暂无同事沟通记录，不输出该段）。
 */
async function fetchColleagueChatHistorySection(page: Page): Promise<string | null> {
  const clicked = await page.evaluate(() => {
    function norm(v: string | null | undefined) {
      return (v ?? '').replace(/\s+/g, ' ').trim();
    }
    const tooltips = Array.from(document.querySelectorAll('.chat-tooltip-custom'));
    for (const el of tooltips) {
      if (!norm(el.textContent).includes('沟通记录')) continue;
      const host = el.closest('span.icon') ?? el.closest('span') ?? el.parentElement;
      if (host) {
        (host as HTMLElement).click();
        return true;
      }
      (el as HTMLElement).click();
      return true;
    }
    const uses = Array.from(document.querySelectorAll('use'));
    for (const u of uses) {
      const h =
        u.getAttribute('href') ||
        u.getAttributeNS('http://www.w3.org/1999/xlink', 'href') ||
        '';
      if (h.includes('icon-chat-history')) {
        const p = u.closest('span.icon') ?? u.parentElement?.parentElement;
        if (p) {
          (p as HTMLElement).click();
          return true;
        }
      }
    }
    return false;
  });

  if (!clicked) {
    return null;
  }

  try {
    await page.waitForSelector('.boss-dialog__body .chat-history-process', { timeout: 12_000 });
  } catch {
    return '(已点击「沟通记录」，但弹窗未在预期时间内出现。)';
  }

  await sleepRandom(CHAT_HISTORY_DIALOG_WAIT_MS.min, CHAT_HISTORY_DIALOG_WAIT_MS.max);

  const scrapeRows = () =>
    page.evaluate(() => {
      function norm(v: string | null | undefined) {
        return (v ?? '').replace(/\s+/g, ' ').trim();
      }
      const root = document.querySelector('.chat-history-process');
      if (!root) return [] as Array<{ action: string; operat: string }>;
      return Array.from(root.querySelectorAll('.record li'))
        .map((li) => ({
          action: norm(li.querySelector('.action')?.textContent),
          operat: norm(li.querySelector('.operat')?.textContent),
        }))
        .filter((x) => x.action || x.operat);
    });

  const clickTab = (label: string) =>
    page.evaluate((lab: string) => {
      function norm(v: string | null | undefined) {
        return (v ?? '').replace(/\s+/g, ' ').trim();
      }
      const root = document.querySelector('.chat-history-process');
      if (!root) return;
      const spans = Array.from(root.querySelectorAll('.tab-hd span'));
      const sp = spans.find((s) => norm(s.textContent) === lab);
      if (sp && !sp.classList.contains('selected')) {
        (sp as HTMLElement).click();
      }
    }, label);

  await clickTab('同事沟通');
  await sleepRandom(CHAT_HISTORY_TAB_SWITCH_MS.min, CHAT_HISTORY_TAB_SWITCH_MS.max);
  const rowsColleague = await scrapeRows();

  await clickTab('我的沟通');
  await sleepRandom(CHAT_HISTORY_TAB_SWITCH_MS.min, CHAT_HISTORY_TAB_SWITCH_MS.max);
  const rowsMine = await scrapeRows();

  const fmt = (label: string, rows: Array<{ action: string; operat: string }>): string[] => {
    const lines = [`[${label}]`];
    if (rows.length === 0) {
      lines.push('(暂无)');
      return lines;
    }
    rows.forEach((r, i) => {
      const line = [r.action, r.operat].filter(Boolean).join(' ｜ ');
      lines.push(`${i + 1}. ${line}`);
    });
    return lines;
  };

  const parts: string[] = [];
  parts.push(...fmt('同事沟通', rowsColleague));
  parts.push('');
  parts.push(...fmt('我的沟通', rowsMine));

  await closeChatHistoryPopup(page);

  return parts.join('\n');
}

export async function runGetCommunicationHistory(page: Page): Promise<string> {
  const currentUrl = page.url();
  if (!isBossChatIndexUrl(currentUrl)) {
    throw new Error('请先进入聊天列表页（/web/chat/index）并打开候选人聊天。');
  }
  const inCandidateChat = await page.$('.base-info-single-container');
  if (!inCandidateChat) {
    throw new Error('请先打开候选人聊天详情页，再执行“沟通记录”操作。');
  }

  let historyBlock: string | null = null;
  try {
    historyBlock = await fetchColleagueChatHistorySection(page);
  } catch {
    historyBlock = null;
  }
  if (historyBlock === null) {
    return '未找到「沟通记录」入口，或当前候选人暂无可读取记录。';
  }
  return ['同事/我的沟通记录：', '', historyBlock].join('\n');
}

/** 关闭「沟通记录」弹层（优先点 Boss 提供的 popup 关闭钮） */
async function closeChatHistoryPopup(page: Page): Promise<void> {
  try {
    const selectors = [
      '.boss-popup__wrapper.chat-history .boss-popup__close',
      '.boss-dialog__wrapper.chat-history .boss-popup__close',
      '.boss-popup__wrapper.boss-dialog.chat-history .boss-popup__close',
    ];
    let btn = null as Awaited<ReturnType<typeof page.$>>;
    for (const sel of selectors) {
      btn = await page.$(sel);
      if (btn) break;
    }
    if (btn) {
      await btn.click();
    } else {
      await page.evaluate(() => {
        const root =
          document.querySelector('.boss-popup__wrapper.chat-history') ||
          document.querySelector('.boss-dialog__wrapper.chat-history');
        const c = root?.querySelector('.boss-popup__close') ?? document.querySelector('.boss-popup__close');
        if (c) {
          (c as HTMLElement).click();
        }
      });
    }
    await sleepRandom(250, 550);
    const popupWrap = await page.$('.boss-popup__wrapper.chat-history');
    if (popupWrap) {
      await page.evaluate(() => {
        const root =
          document.querySelector('.boss-popup__wrapper.chat-history') ||
          document.querySelector('.boss-dialog__wrapper.chat-history');
        const c = root?.querySelector('.boss-popup__close') ?? document.querySelector('.boss-popup__close');
        (c as HTMLElement | null)?.click();
      });
      await sleepRandom(150, 350);
    }
  } catch {
    /* ignore */
  }
}

type CandidateSummary = {
  name: string;
  active: string;
  basicFacts: string[];
  recentExperience: string[];
  communicationPosition: string;
  expectation: string;
  remark: string;
};

async function fetchCandidateSummary(page: Page): Promise<CandidateSummary> {
  const scraped = (await page.evaluate(`(() => {
    const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
    const root = document.querySelector(".base-info-single-container");
    if (!root) {
      throw new Error("未找到候选人详情容器（.base-info-single-container）。");
    }
    const name = norm(root.querySelector(".name-box")?.textContent);
    const active = norm(root.querySelector(".high-light-orange.active-time span")?.textContent);
    const basicFacts = Array.from(root.querySelectorAll(".base-info-single-detial > div"))
      .filter((el) => !el.classList.contains("name-contet") && !el.classList.contains("active-time"))
      .map((el) => norm(el.textContent))
      .filter((v) => v.length > 0);
    const recentExperience = Array.from(
      root.querySelectorAll(".experience-content.detail-list .work-content .value"),
    )
      .map((el) => norm(el.textContent))
      .filter((v) => v.length > 0);
    const communicationPosition = norm(
      root.querySelector(".position-item .position-name")?.textContent,
    );
    const expectation = norm(root.querySelector(".position-item.expect .value.job")?.textContent);
    const remark = norm(
      root.querySelector(".label-remark-content .remark span:last-child")?.textContent,
    );
    return {
      name,
      active,
      basicFacts,
      recentExperience,
      communicationPosition,
      expectation,
      remark,
    };
  })()`)) as CandidateSummary;
  return scraped;
}

export async function runOpenCandidateChat(
  page: Page,
  candidateName: string,
  exact = true,
): Promise<string> {
  const targetName = candidateName.trim();

  try {
    await ensureChatIndexAllFilter(page);
    if (!isBossChatIndexUrl(page.url())) {
      throw new Error('当前不在沟通列表页（/web/chat/index），无法打开候选人聊天。');
    }

    const norm = (v: string | null | undefined) => (v ?? '').replace(/\s+/g, ' ').trim();
    const matcher = (value: string) =>
      exact ? value === targetName : value.includes(targetName);
    let targetWrap: Awaited<ReturnType<typeof page.$>> | null = null;
    let foundName = '';

    const maxScrollRounds = 40;
    for (let round = 0; round < maxScrollRounds && !targetWrap; round++) {
      const wraps = await page.$$('.geek-item-wrap');
      for (const wrap of wraps) {
        const nameText = await wrap
          .$eval('.geek-name', (el) => (el.textContent ?? '').trim())
          .catch(() => '');
        const candidate = norm(nameText);
        if (!candidate) continue;
        if (matcher(candidate)) {
          targetWrap = wrap;
          foundName = candidate;
          break;
        }
      }
      if (targetWrap) break;

      const scrollState = (await page.evaluate(`(() => {
        const first = document.querySelector(".geek-item-wrap");
        if (!first) return { moved: false, atEnd: true };
        let node = first.parentElement;
        let scroller = null;
        while (node) {
          const style = window.getComputedStyle(node);
          const overflowY = style.overflowY;
          const canScroll =
            (overflowY === "auto" || overflowY === "scroll") &&
            node.scrollHeight > node.clientHeight;
          if (canScroll) {
            scroller = node;
            break;
          }
          node = node.parentElement;
        }
        if (!scroller) return { moved: false, atEnd: true };
        const prev = scroller.scrollTop;
        const step = Math.max(160, Math.floor(scroller.clientHeight * 0.8));
        scroller.scrollTop = Math.min(scroller.scrollTop + step, scroller.scrollHeight);
        const moved = scroller.scrollTop !== prev;
        const atEnd = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2;
        return { moved, atEnd };
      })()`)) as { moved: boolean; atEnd: boolean };
      if (!scrollState.moved || scrollState.atEnd) {
        break;
      }
      await sleepRandom(OPEN_CHAT_SCROLL_GAP_MS.min, OPEN_CHAT_SCROLL_GAP_MS.max);
    }

    if (!targetWrap) {
      throw new Error(`未在聊天列表中找到候选人：${targetName}`);
    }

    try {
      await targetWrap.evaluate((el) => {
        const row = el.querySelector<HTMLElement>('.geek-item') ?? (el as HTMLElement);
        row.scrollIntoView({ behavior: 'instant', block: 'center', inline: 'nearest' });
        row.click();
      });
    } catch {
      const box = await targetWrap.boundingBox();
      if (!box) {
        throw new Error(`已定位候选人 ${foundName}，但元素不可点击。`);
      }
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2, {
        delay: randomIntInclusive(MOUSE_CLICK_PRESS_MS.min, MOUSE_CLICK_PRESS_MS.max),
      });
    }

    await sleepRandom(OPEN_CHAT_AFTER_ROW_CLICK_MS.min, OPEN_CHAT_AFTER_ROW_CLICK_MS.max);

    const selected = await targetWrap
      .$eval('.geek-item', (el) => el.classList.contains('selected'))
      .catch(() => false);

    try {
      await page.waitForSelector('.base-info-single-container', { timeout: 12_000 });
      await page.waitForFunction(
        `((name) => {
          const text = document.querySelector(".base-info-single-container .name-box")?.textContent ?? "";
          return text.replace(/\\s+/g, " ").trim().includes(name);
        })`,
        { timeout: 12_000 },
        foundName || targetName,
      );
      await page.waitForFunction(
        `(() => {
          const list = document.querySelector(".chat-message-list");
          if (!list) return false;
          const items = list.querySelectorAll(".message-item");
          if (!items || items.length === 0) return false;
          const hasText = Array.from(items).some((item) => {
            const txt =
              item.querySelector(".item-friend .text span")?.textContent ??
              item.querySelector(".item-myself .text span")?.textContent ??
              item.querySelector(".item-system .message-card-top-title")?.textContent ??
              "";
            return txt.replace(/\\s+/g, " ").trim().length > 0;
          });
          return hasText;
        })()`,
        { timeout: 16_000 },
      );
    } catch {
      throw new Error(
        `已尝试点击 ${foundName}（selected=${String(selected)}），但未检测到对应聊天详情面板。`,
      );
    }

    let fullMessages: Array<{
      time: string;
      from: ChatFrom;
      text: string;
    }> = [];
    let hasFriendResumeAttachment = false;
    try {
      const scraped = (await page.evaluate(`(() => {
        const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
        /** Boss 系统里的「消息优先提醒」增值服务条，对业务无意义，过滤掉 */
        function isBossPriorityUpsellSystemText(text) {
          return norm(text).indexOf("优先提醒") !== -1;
        }
        const items = Array.from(document.querySelectorAll(".chat-message-list .message-item"));
        let currentTime = "";
        const messages = [];
        let hasFriendResumeAttachment = false;
        for (const item of items) {
          const timeNode = item.querySelector(".message-time .time");
          if (timeNode) {
            const t = norm(timeNode.textContent);
            if (t) currentTime = t;
          }
          const friendRoot = item.querySelector(".item-friend");
          let friendText = "";
          if (friendRoot) {
            friendText = norm(friendRoot.querySelector(".text > span")?.textContent);
            if (!friendText) {
              const resumeIcon = friendRoot.querySelector(".resume-icon");
              const title = norm(friendRoot.querySelector(".message-card-top-title")?.textContent);
              const cardBtn = norm(friendRoot.querySelector(".message-card-buttons .card-btn")?.textContent);
              if (resumeIcon) hasFriendResumeAttachment = true;
              if (title || cardBtn) {
                const parts = [];
                if (title) parts.push(title);
                if (cardBtn) parts.push(cardBtn);
                friendText = parts.length ? parts.join(" · ") : "";
              }
              if (!friendText) friendText = norm(friendRoot.querySelector(".text")?.textContent);
            }
          }
          const myselfText = norm(item.querySelector(".item-myself .text span")?.textContent);
          const systemText =
            norm(item.querySelector(".item-system .message-card-top-title")?.textContent) ||
            norm(item.querySelector(".item-system .text span")?.textContent);
          if (friendText) {
            messages.push({ text: friendText, time: currentTime, from: "friend" });
          } else if (myselfText) {
            messages.push({ text: myselfText, time: currentTime, from: "myself" });
          } else if (systemText) {
            if (!isBossPriorityUpsellSystemText(systemText)) {
              messages.push({ text: systemText, time: currentTime, from: "system" });
            }
          }
        }
        return { messages, hasFriendResumeAttachment };
      })()`)) as {
        messages: Array<{
          time: string;
          from: 'friend' | 'myself' | 'system' | 'unknown';
          text: string;
        }>;
        hasFriendResumeAttachment: boolean;
      };
      fullMessages = scraped.messages;
      hasFriendResumeAttachment = scraped.hasFriendResumeAttachment;
    } catch {
      /* 抓取消息失败时仍返回摘要，不刷屏 stderr */
    }

    const detailLines = fullMessages.map((m) => {
      const tag = chatRoleTag(m.from);
      const timePart = m.time ? ` ${m.time}` : '';
      return `${tag}${timePart} ${m.text}`.trimEnd();
    });

    const resumeStatus = hasFriendResumeAttachment ? '已获取' : '未获取';
    const summary = await fetchCandidateSummary(page);

    const out: string[] = [
      `成功进入候选人聊天：${foundName}`,
      `简历获取状态: ${resumeStatus}`,
    ];
    const summaryLines: string[] = [];
    const summaryName = summary.name || foundName || targetName;
    summaryLines.push(`姓名: ${summaryName}`);
    if (summary.active) {
      summaryLines.push(`活跃状态: ${summary.active}`);
    }
    if (summary.basicFacts.length > 0) {
      summaryLines.push(`基本信息: ${summary.basicFacts.join(' / ')}`);
    }
    if (summary.communicationPosition) {
      summaryLines.push(`沟通职位: ${summary.communicationPosition}`);
    }
    if (summary.expectation) {
      summaryLines.push(`期望: ${summary.expectation}`);
    }
    if (summary.recentExperience.length > 0) {
      summaryLines.push('近期经历:');
      summary.recentExperience.forEach((it, idx) => {
        summaryLines.push(`${idx + 1}. ${it}`);
      });
    }
    if (summaryLines.length > 0) {
      out.push('', '人才摘要：', '', ...summaryLines);
    }
    if (summary.remark) {
      out.push('', `备注: ${summary.remark}`);
    }
    out.push('', '完整聊天消息：');
    if (detailLines.length > 0) {
      out.push('', ...detailLines);
    } else {
      out.push('', '(暂无)');
    }
    return out.join('\n');
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    if (e instanceof Error) {
      throw e;
    }
    throw new Error(`打开候选人聊天失败：${message}`);
  }
}
