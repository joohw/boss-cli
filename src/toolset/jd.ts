import { access, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  createWaitManualLoginRequiredText,
  sleepRandom,
  withChatPage,
} from '../browser/index.js';
import { JD_DIR } from '../config.js';
import type { Frame, Page } from 'puppeteer-core';

export type ListOpenPositionsDeps = {
  settleWaitMsMin?: number;
  settleWaitMsMax?: number;
  detail?: boolean;
  detailName?: string;
  projectDir?: string;
  detailWaitMs?: number;
};

const BOSS_CHAT_JOB_LIST_URL = 'https://www.zhipin.com/web/chat/job/list';
const JD_PAGE_SETTLE_MS = { min: 3200, max: 5600 } as const;
const JD_DETAIL_DEFAULT_WAIT_MS = 10_000;

function isBossChatJobListUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (!u.hostname.includes('zhipin.com')) {
      return false;
    }
    const p = u.pathname.replace(/\/+$/, '') || '/';
    return p === '/web/chat/job/list';
  } catch {
    return false;
  }
}

async function clickSidebarMenuToPath(
  page: Page,
  menuLabel: string,
  targetPath: string,
): Promise<void> {
  const clicked = (await page.evaluate(
    ({ label, path }) => {
      const norm = (v: string | null | undefined) => (v ?? '').replace(/\s+/g, '');
      const links = Array.from(document.querySelectorAll('.menu-list a'));
      const target = links.find((a) => {
        const href = a.getAttribute('href') ?? '';
        if (href.includes(path)) {
          return true;
        }
        const text = norm(a.querySelector('.menu-item-content span')?.textContent ?? a.textContent);
        return text.includes(label);
      });
      if (!(target instanceof HTMLElement)) {
        return false;
      }
      target.scrollIntoView({ block: 'center', inline: 'nearest' });
      target.click();
      return true;
    },
    { label: menuLabel, path: targetPath },
  )) as boolean;

  if (!clicked) {
    throw new Error(`未找到侧边栏菜单“${menuLabel}”，无法跳转到 ${targetPath}。`);
  }

  await page.waitForFunction(
    (path) => {
      try {
        const p = window.location.pathname.replace(/\/+$/, '') || '/';
        return p === path;
      } catch {
        return false;
      }
    },
    { timeout: 15_000 },
    targetPath,
  );
}

type JobListItem = {
  id: string;
  title: string;
  label: string;
  status: string;
  meta: string[];
  viewed: string;
  chatted: string;
  interested: string;
};

type JobReadState = {
  rows: number;
  totalText: string;
  title: string;
  url: string;
  bodyPreview: string;
};

type JobReadResult = JobReadState & {
  jobs: JobListItem[];
};

type JobListContext = {
  frame: Frame;
  data: JobReadResult;
  fromFrame: boolean;
  frameUrl: string;
  mainState: JobReadState;
};

type JobDetail = {
  pageTitle: string;
  pageUrl: string;
  company: string;
  recruitmentType: string;
  jobName: string;
  description: string;
  overseas: string;
  jobCategory: string;
  experience: string;
  education: string;
  salaryRange: string;
  salaryMonths: string;
  keywords: string;
  workLocation: string;
};

function stripControlChars(input: string): string {
  return input.replace(/[<>:"/\\|?*]/g, '_');
}

function cacheFileCandidates(projectDir: string, title: string): string[] {
  const exact = path.resolve(projectDir, `${title}.md`);
  const safe = path.resolve(projectDir, `${stripControlChars(title)}.md`);
  if (safe === exact) {
    return [exact];
  }
  return [exact, safe];
}

async function fileExists(target: string): Promise<boolean> {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

async function readJobsFromFrame(frame: Frame): Promise<JobReadResult> {
  return (await frame.evaluate(
    `(() => {
      const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
      const rows = Array.from(document.querySelectorAll(".job-jobInfo-warp"));
      const jobs = rows.map((el) => {
        const statusText = norm(el.querySelector(".job-status-wrapper .status-box")?.textContent);
        const labelText = norm(el.querySelector(".job-title .label-common")?.textContent);
        const meta = Array.from(el.querySelectorAll(".job-main-info-wrapper .info-labels span"))
          .map((x) => norm(x.textContent))
          .filter(Boolean);
        const nums = Array.from(el.querySelectorAll(".job-about-num-wrapper .inner-box .num"))
          .map((x) => norm(x.textContent));
        return {
          id: norm(el.getAttribute("data-id")),
          title: norm(el.querySelector(".job-title a")?.textContent),
          label: labelText,
          status: statusText,
          meta,
          viewed: nums[0] || "0",
          chatted: nums[1] || "0",
          interested: nums[2] || "0",
        };
      });
      const totalText = norm(document.querySelector(".total-num")?.textContent);
      const bodyText = norm(document.body?.innerText ?? "");
      return {
        rows: rows.length,
        totalText,
        title: document.title || "",
        url: location.href,
        bodyPreview: bodyText.slice(0, 120),
        jobs,
      };
    })()`,
  )) as JobReadResult;
}

async function readJobsFromPageAnyFrame(
  page: Page,
): Promise<JobListContext> {
  const main = await readJobsFromFrame(page.mainFrame());
  if (main.rows > 0 || main.totalText.length > 0) {
    return {
      frame: page.mainFrame(),
      data: main,
      fromFrame: false,
      frameUrl: main.url,
      mainState: main,
    };
  }

  const frames = page.frames();
  for (const frame of frames) {
    if (frame === page.mainFrame()) {
      continue;
    }
    try {
      const state = await readJobsFromFrame(frame);
      if (state.rows > 0 || state.totalText.length > 0) {
        return {
          frame,
          data: state,
          fromFrame: true,
          frameUrl: state.url,
          mainState: main,
        };
      }
    } catch {
      // ignore cross-origin / detached frames
    }
  }

  return {
    frame: page.mainFrame(),
    data: main,
    fromFrame: false,
    frameUrl: main.url,
    mainState: main,
  };
}

async function waitForJobRowsReady(
  page: Page,
  timeoutMs: number,
): Promise<JobListContext> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const state = await readJobsFromPageAnyFrame(page);
    if (state.data.rows > 0 || state.data.totalText.length > 0) {
      return state;
    }
    await sleepRandom(260, 520);
  }
  const last = await readJobsFromPageAnyFrame(page);
  throw new Error(
    [
      '等待职位列表超时',
      `main.rows=${last.mainState.rows}`,
      `main.total="${last.mainState.totalText}"`,
      `main.title="${last.mainState.title}"`,
      `main.url=${last.mainState.url}`,
      `main.body="${last.mainState.bodyPreview}"`,
      `frameHit=${last.fromFrame ? 'yes' : 'no'}`,
      `frame.url=${last.frameUrl}`,
    ].join('；'),
  );
}

async function clickEditForJob(frame: Frame, job: JobListItem): Promise<void> {
  const targetId = JSON.stringify(job.id ?? '');
  const targetTitle = JSON.stringify(job.title ?? '');
  const clicked = (await frame.evaluate(
    `(() => {
      const jobId = ${targetId};
      const title = ${targetTitle};
      const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
      const rows = Array.from(document.querySelectorAll(".job-jobInfo-warp"));
      let row = null;
      if (jobId) {
        row = rows.find((el) => norm(el.getAttribute("data-id")) === jobId) ?? null;
      }
      if (!row && title) {
        row = rows.find((el) => {
          const t = norm(el.querySelector(".job-title a")?.textContent);
          return t === title;
        }) ?? null;
      }
      if (!row) return false;
      const editBtn = row.querySelector(".position-edit");
      if (!(editBtn instanceof HTMLElement)) return false;
      editBtn.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
      editBtn.click();
      return true;
    })()`,
  )) as boolean;
  if (!clicked) {
    throw new Error(`未找到职位“${job.title}”的编辑入口`);
  }
}

async function readJobDetailFromFrame(frame: Frame): Promise<JobDetail | null> {
  const detail = (await frame.evaluate(
    `(() => {
      const norm = (v) => (v ?? "").replace(/\\s+/g, " ").trim();
      const root = document.querySelector(".job-edit-container.edit-job");
      if (!root) {
        return null;
      }
      const rows = Array.from(root.querySelectorAll(".form-row"));
      const rowValueByTitle = {};
      for (const row of rows) {
        const title = norm(row.querySelector(".title")?.textContent);
        if (!title) continue;
        const content = norm(row.querySelector(".content")?.innerText);
        if (content && !rowValueByTitle[title]) {
          rowValueByTitle[title] = content;
        }
      }
      const salaryValues = Array.from(
        root.querySelectorAll(".scope-selecter .scope-select .ui-select-selected-value"),
      ).map((el) => norm(el.textContent));
      const keywordValues = Array.from(
        root.querySelectorAll(".job-skill-content .job-skill-item, .job-skill-content .skill-tag, .job-skill-content .tag"),
      )
        .map((el) => norm(el.textContent))
        .filter(Boolean);
      const detail = {
        pageTitle: document.title || "",
        pageUrl: location.href,
        company: norm(root.querySelector(".base-info .text-primary")?.textContent),
        recruitmentType: norm(root.querySelector(".recruitment-type-wrap .ui-select-selected-value")?.textContent),
        jobName:
          norm(root.querySelector("input[name='jobName']")?.value) ||
          norm(root.querySelector(".job-name input")?.value) ||
          (rowValueByTitle["职位名称"] || ""),
        description: norm(root.querySelector(".performance-row textarea")?.value),
        overseas: norm(root.querySelector(".overseas-entry-container .chose-item.active")?.textContent),
        jobCategory:
          norm(root.querySelector("input[name='jobCategory']")?.value) ||
          norm(root.querySelector(".job-category-tag-container")?.innerText),
        experience:
          norm(root.querySelector(".job-experience-row .experience-select .ui-select-selected-value")?.textContent) ||
          (rowValueByTitle["经验"] || ""),
        education:
          norm(root.querySelector(".form-row .title")?.textContent?.includes("学历")
            ? root.querySelector(".form-row .experience-select .ui-select-selected-value")?.textContent
            : "") ||
          (rowValueByTitle["学历"] || ""),
        salaryRange:
          salaryValues.length >= 2 ? (salaryValues[0] + "-" + salaryValues[1]) : salaryValues.join("-"),
        salaryMonths: norm(root.querySelector(".salaryMonth-select .ui-select-selected-value")?.textContent),
        keywords: keywordValues.join("｜"),
        workLocation:
          norm(root.querySelector(".job-address input.ipt")?.value) ||
          (rowValueByTitle["工作地点"] || ""),
      };
      return detail;
    })()`,
  )) as JobDetail | null;
  return detail;
}

async function waitForJobDetailReady(page: Page, timeoutMs: number): Promise<JobDetail> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    for (const frame of page.frames()) {
      try {
        const detail = await readJobDetailFromFrame(frame);
        if (detail) {
          return detail;
        }
      } catch {
        // ignore detached/cross-origin frame read errors
      }
    }
    await sleepRandom(260, 520);
  }
  throw new Error('等待职位详情表单超时，未找到 .job-edit-container.edit-job');
}

function formatJobDetailMarkdown(job: JobListItem, detail: JobDetail): string {
  return [
    `# ${job.title}`,
    '',
    `- 状态: ${job.status || '未知'}`,
    `- 标签: ${job.label || '无'}`,
    '',
    '## 基本信息',
    `- 公司: ${detail.company || '未知'}`,
    `- 招聘类型: ${detail.recruitmentType || '未知'}`,
    `- 职位名称: ${detail.jobName || job.title}`,
    `- 职位类型: ${detail.jobCategory || '未知'}`,
    `- 是否驻外: ${detail.overseas || '未知'}`,
    '',
    '## 要求',
    `- 经验: ${detail.experience || '未知'}`,
    `- 学历: ${detail.education || '未知'}`,
    `- 薪资范围: ${detail.salaryRange || '未知'}`,
    `- 薪资月数: ${detail.salaryMonths || '未知'}`,
    `- 关键词: ${detail.keywords || '无'}`,
    `- 工作地点: ${detail.workLocation || '未知'}`,
    '',
    '## 职位描述',
    detail.description || '（空）',
    '',
  ].join('\n');
}

export async function runListOpenPositions(
  deps: ListOpenPositionsDeps = {},
): Promise<string> {
  const settleMin = deps.settleWaitMsMin ?? JD_PAGE_SETTLE_MS.min;
  const settleMax = deps.settleWaitMsMax ?? JD_PAGE_SETTLE_MS.max;
  const detailMode = deps.detail === true;
  const detailName = (deps.detailName ?? '').trim();
  const projectDir = deps.projectDir ?? JD_DIR;
  const detailWaitMs = deps.detailWaitMs ?? JD_DETAIL_DEFAULT_WAIT_MS;

  if (detailMode && detailName) {
    const candidates = cacheFileCandidates(projectDir, detailName);
    for (const p of candidates) {
      if (await fileExists(p)) {
        return readFile(p, 'utf8');
      }
    }
  }

  try {
    return await withChatPage(async (page) => {
      const currentUrl = page.url();
      if (!isBossChatJobListUrl(currentUrl)) {
        await clickSidebarMenuToPath(page, '职位管理', '/web/chat/job/list');
        await sleepRandom(settleMin, settleMax);
      }
      if (!isBossChatJobListUrl(page.url())) {
        throw new Error('通过侧边栏“职位管理”进入职位页失败，请确认已登录并可访问 /web/chat/job/list。');
      }
      const ready = await waitForJobRowsReady(page, 16_000);
      await sleepRandom(350, 920);

      const jobs = ready.data.jobs.filter((it) => it.title.length > 0);
      const jobLines = jobs.map((it, idx) => {
        const info = it.meta.length > 0 ? it.meta.join('｜') : '信息缺失';
        const stats = `看过我:${it.viewed}｜沟通过:${it.chatted}｜感兴趣:${it.interested}`;
        const tag = it.label ? `｜标签:${it.label}` : '';
        const id = it.id ? `｜ID:${it.id}` : '';
        return `${idx + 1}. ${it.title}｜状态:${it.status || '未知'}${tag}｜${info}｜${stats}${id}`;
      });
      const details = jobLines.length > 0 ? jobLines.join('\n') : '当前页面未读取到职位。';
      const openCount = jobs.filter((it) => it.status.includes('开放中')).length;
      const waitOpenCount = jobs.filter((it) => it.status.includes('待开放')).length;
      const closedCount = jobs.filter((it) => it.status.includes('已关闭')).length;
      const totalText = ready.data.totalText ? `（页面统计：${ready.data.totalText}）` : '';

      if (!detailMode) {
        return [
          `已读取 ${jobs.length} 个职位${totalText}。`,
          `状态统计：开放中 ${openCount}｜待开放 ${waitOpenCount}｜已关闭 ${closedCount}`,
          `来源页面：${BOSS_CHAT_JOB_LIST_URL}`,
          `职位明细：\n${details}`,
        ].join('\n');
      }
      const targetJob = jobs.find((job) => job.title === detailName);
      if (!targetJob) {
        const available = jobs.slice(0, 8).map((j) => j.title).join('｜');
        throw new Error(
          `未找到职位“${detailName}”。可选职位：${available || '（空）'}`,
        );
      }
      const candidates = cacheFileCandidates(projectDir, targetJob.title);
      const listCtx = await waitForJobRowsReady(page, 16_000);
      await clickEditForJob(listCtx.frame, targetJob);
      await sleepRandom(detailWaitMs, detailWaitMs);
      const detail = await waitForJobDetailReady(page, 12_000);
      const outPath = candidates[candidates.length - 1]!;
      const markdown = formatJobDetailMarkdown(targetJob, detail);
      await writeFile(outPath, markdown, 'utf8');
      return markdown;
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    if (e instanceof Error && e.message.includes('浏览器会话尚未初始化')) {
      throw new Error(createWaitManualLoginRequiredText('获取岗位列表'));
    }
    console.error(`[boss-cli] list_open_positions error: ${message}`);
    throw new Error(`获取岗位列表失败：${message}`);
  }
}
