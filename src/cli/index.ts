#!/usr/bin/env node
// boss-cli 入口：子命令见 cliRouter；业务能力见 toolset（impl*）

import { loadBossEnv } from '../load_env.js';
import { runCli, isReadlineAbortError } from './cliRouter.js';

async function main() {
  loadBossEnv();
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

main();
