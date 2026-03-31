// 配置文件 — 应用数据位于 ~/.boss-cli/.cache/

import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

/** 应用主目录（业务数据在 .cache 下） */
export const APP_HOME = join(homedir(), '.boss-cli');

/**
 * 应用缓存与生成数据根目录（浏览器配置等）
 */
export const CACHE_DIR = join(APP_HOME, '.cache');

/** Puppeteer 用户数据目录（与 CDP 启动默认目录一致） */
export const BROWSER_USER_DATA_DIR = join(CACHE_DIR, 'browser-data');

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
}
