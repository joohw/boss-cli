#!/usr/bin/env node
// boss-cli 入口：子命令见 cliRouter；业务能力见 toolset（impl*）
// 环境变量：先读 ~/.boss-cli/.env，再读当前工作目录下的 .env（后者覆盖前者）。

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { APP_HOME } from '../config.js';
import { runCli, isReadlineAbortError } from './cliRouter.js';

const userEnvPath = join(APP_HOME, '.env');
if (existsSync(userEnvPath)) {
  loadEnv({ path: userEnvPath, quiet: true });
}
loadEnv({ quiet: true });

async function main() {
  const args = process.argv.slice(2);
  try {
    await runCli(args);
  } catch (error) {
    if (isReadlineAbortError(error)) {
      process.exit(0);
    }
    console.error('❌ 执行出错:', error);
    if (error instanceof Error) {
      console.error('错误信息:', error.message);
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('❌ 未捕获错误:', err);
  process.exit(1);
});
