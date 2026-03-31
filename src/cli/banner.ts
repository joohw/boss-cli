/**
 * 进入交互模式（无参 `boss`）时在终端打印品牌条（红底白字）与作者信息。
 * 无 NO_COLOR 且 stderr 为 TTY 时使用 ANSI；否则纯文本仍输出，避免「看不到」。
 */
import process from 'node:process';

/** 主标题 + 作者（两行均着色，保证在交互入口足够显眼） */
const BANNER_LINES = ['  boss-cli · Boss 直聘', '  dev by @joo'];

export function printBossInteractiveBanner(): void {
  const useAnsi =
    !process.env.NO_COLOR && process.env.TERM !== 'dumb' && (process.stderr.isTTY ?? false);

  console.error('');
  if (useAnsi) {
    const R = '\x1b[41m';
    const W = '\x1b[97m';
    const B = '\x1b[1m';
    const Z = '\x1b[0m';
    for (const line of BANNER_LINES) {
      console.error(`${R}${W}${B}${line}${Z}`);
    }
  } else {
    for (const line of BANNER_LINES) {
      console.error(line);
    }
  }
  console.error('');
}
