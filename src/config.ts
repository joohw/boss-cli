// 配置文件 — 应用数据位于 ~/.boss-cli/.cache/

import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

/** 应用主目录（业务数据在 .cache 下） */
export const APP_HOME = join(homedir(), '.boss-cli');

/** 存放岗位 JD 的目录（每个岗位一个 .md 文件） */
export const JD_DIR = join(APP_HOME, 'jd');

/**
 * 应用缓存与生成数据根目录（浏览器配置等）
 */
export const CACHE_DIR = join(APP_HOME, '.cache');

/** Puppeteer 用户数据目录（与 CDP 启动默认目录一致） */
export const BROWSER_USER_DATA_DIR = join(CACHE_DIR, 'browser-data');

/** `chat` 抓取在线简历时对 iframe 区域截图保存目录 */
export const RESUME_SCREENSHOTS_DIR = join(CACHE_DIR, 'resume-screenshots');

/** 在线简历截图经 OCR 后的纯文本保存目录（与截图同名 `.txt`） */
export const RESUME_OCR_DIR = join(CACHE_DIR, 'ocr');

let appDataLayoutReady = false;

/** 确保 `~/.boss-cli/.cache` 目录存在（幂等） */
export function ensureAppDataLayout(): void {
  if (appDataLayoutReady) {
    return;
  }
  appDataLayoutReady = true;
  if (!existsSync(CACHE_DIR)) {
    mkdirSync(CACHE_DIR, { recursive: true });
  }
  if (!existsSync(BROWSER_USER_DATA_DIR)) {
    mkdirSync(BROWSER_USER_DATA_DIR, { recursive: true });
  }
  if (!existsSync(JD_DIR)) {
    mkdirSync(JD_DIR, { recursive: true });
  }
  if (!existsSync(RESUME_SCREENSHOTS_DIR)) {
    mkdirSync(RESUME_SCREENSHOTS_DIR, { recursive: true });
  }
  if (!existsSync(RESUME_OCR_DIR)) {
    mkdirSync(RESUME_OCR_DIR, { recursive: true });
  }
}
