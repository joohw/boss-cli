import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { config } from 'dotenv';
import { APP_HOME } from './config.js';

/**
 * 1) 当前工作目录下的 `.env`
 * 2) `~/.boss-cli/.env`
 * 3) 旧版 `%USERPROFILE%\boss-agent\.env`（若存在）
 */
export function loadBossEnv(): void {
  config();
  const paths = [join(APP_HOME, '.env'), join(homedir(), 'boss-agent', '.env')];
  for (const p of paths) {
    if (existsSync(p)) {
      config({ path: p, override: true });
    }
  }
}
