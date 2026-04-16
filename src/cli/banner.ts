/**
 * 进入交互模式（无参 `boss`）时在终端打印大号 ASCII 品牌条。
 * figlet -f big BOSS-CLI（全大写，斜线/竖线/下划线拼字）；无 NO_COLOR 且 stderr 为 TTY 时黑底白字。
 */
import process from 'node:process';

/** 比字形略宽，左右留白（字形本身 54 列） */
const BANNER_WIDTH = 60;

/** figlet -f big BOSS-CLI（每行 54 字符） */
const BANNER_ART = [
  '  ____   ____   _____ _____        _____ _      _____ ',
  ' |  _ \\ / __ \\ / ____/ ____|      / ____| |    |_   _|',
  ' | |_) | |  | | (___| (___ ______| |    | |      | |  ',
  ' |  _ <| |  | |\\___ \\\\___ \\______| |    | |      | |  ',
  ' | |_) | |__| |____) |___) |     | |____| |____ _| |_ ',
  ' |____/ \\____/|_____/_____/       \\_____|______|_____|',
];

function padCenter(line: string, width: number): string {
  const t = line.length > width ? line.slice(0, width) : line;
  if (t.length >= width) return t;
  return t
    .padStart(Math.floor((width + t.length) / 2), ' ')
    .padEnd(width, ' ');
}

const BANNER_LINES = BANNER_ART.map((line) => padCenter(line, BANNER_WIDTH));
const TYPEWRITER_DELAY_MS = 5;
const CLI_VERSION = 'v0.1.8';

/** 黑底（40）+ 亮白字（97）+ 粗体，与空白行一致，保证整条色带对比度一致 */
const BG = '\x1b[40m';
const FG = '\x1b[97m';
const BD = '\x1b[1m';
const Z = '\x1b[0m';

function styleBannerLine(content: string): string {
  return `${BG}${FG}${BD}${content}${Z}`;
}

function blankBannerLine(useAnsi: boolean): void {
  if (useAnsi) {
    console.error(styleBannerLine(' '.repeat(BANNER_WIDTH)));
  } else {
    console.error('');
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function printTypewriterLine(line: string, useAnsi: boolean): Promise<void> {
  if (!(process.stderr.isTTY ?? false)) {
    if (useAnsi) {
      console.error(styleBannerLine(line));
    } else {
      console.error(line);
    }
    return;
  }

  if (useAnsi) {
    let built = '';
    for (const ch of Array.from(line)) {
      built += ch;
      process.stderr.write(`\r${styleBannerLine(built.padEnd(BANNER_WIDTH, ' '))}`);
      await sleep(TYPEWRITER_DELAY_MS);
    }
    process.stderr.write('\n');
    return;
  }

  for (const ch of Array.from(line)) {
    process.stderr.write(ch);
    await sleep(TYPEWRITER_DELAY_MS);
  }
  process.stderr.write('\n');
}

export async function printBossInteractiveBanner(): Promise<void> {
  const useAnsi =
    !process.env.NO_COLOR && process.env.TERM !== 'dumb' && (process.stderr.isTTY ?? false);
  const repoUrl = 'https://github.com/joohw/boss-cli';

  console.error('');
  if (useAnsi) {
    blankBannerLine(true);
    for (const line of BANNER_LINES) {
      console.error(styleBannerLine(line));
    }
    blankBannerLine(true);
  } else {
    blankBannerLine(false);
    for (const line of BANNER_LINES) {
      console.error(line);
    }
    blankBannerLine(false);
  }
  await printTypewriterLine(`⭐ 欢迎使用 boss-cli ${CLI_VERSION}`, false);
  await printTypewriterLine(`🌟 GitHub: ${repoUrl}`, false);
  await printTypewriterLine('✨ 欢迎提交 Issue 或 Star', false);
  await printTypewriterLine('💫 exit/quit 退出交互模式', false);
  await printTypewriterLine('🌠 输入 help 查看所有可用命令。', false);
  console.error('');
}
