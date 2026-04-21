/**
 * 将百度 OCR 凭证写入用户级 ~/.boss-cli/.env（与 cli 入口加载顺序一致）。
 * 使用 BOSS_BAIDU_*，避免与项目内通用 API_KEY 混淆。
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { APP_HOME } from '../config.js';

export const BAIDU_ENV_KEYS = {
  apiKey: 'BOSS_BAIDU_API_KEY',
  secretKey: 'BOSS_BAIDU_SECRET_KEY',
} as const;

const USER_ENV_PATH = join(APP_HOME, '.env');

function formatEnvLine(key: string, value: string): string {
  if (/^[A-Za-z0-9_.\-]+$/.test(value)) {
    return `${key}=${value}`;
  }
  return `${key}="${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`;
}

function mergeUserEnv(updates: Record<string, string>): void {
  if (!existsSync(APP_HOME)) {
    mkdirSync(APP_HOME, { recursive: true });
  }
  const dropKeys = new Set(Object.keys(updates));
  let lines: string[] = [];
  if (existsSync(USER_ENV_PATH)) {
    const raw = readFileSync(USER_ENV_PATH, 'utf8');
    lines = raw.split(/\r?\n/);
  }
  const kept: string[] = [];
  for (const line of lines) {
    const m = /^([A-Za-z_][A-Za-z0-9_]*)=/.exec(line);
    if (m && dropKeys.has(m[1]!)) {
      continue;
    }
    kept.push(line);
  }
  while (kept.length > 0 && kept[kept.length - 1] === '') {
    kept.pop();
  }
  const out = kept.length > 0 ? [...kept, ''] : [];
  for (const [k, v] of Object.entries(updates)) {
    out.push(formatEnvLine(k, v));
  }
  out.push('');
  writeFileSync(USER_ENV_PATH, out.join('\n'), 'utf8');
}

export function getUserEnvPathForBaidu(): string {
  return USER_ENV_PATH;
}

export function writeBaiduCredentialsToUserEnv(apiKey: string, secretKey: string): void {
  mergeUserEnv({
    [BAIDU_ENV_KEYS.apiKey]: apiKey,
    [BAIDU_ENV_KEYS.secretKey]: secretKey,
  });
}
