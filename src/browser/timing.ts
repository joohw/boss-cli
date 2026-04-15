import { randomInt } from 'node:crypto';

/** 固定休眠（支持 AbortSignal，与原先 auth.sleep 行为一致） */
export function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new Error('Aborted'));
      return;
    }
    const id = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(id);
      reject(new Error('Aborted'));
    };
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

/** 含两端在内的随机整数（使用 crypto.randomInt） */
export function randomIntInclusive(min: number, max: number): number {
  if (max < min) {
    const t = min;
    min = max;
    max = t;
  }
  return randomInt(min, max + 1);
}

/** 在 [minMs, maxMs] 内随机等待 */
export async function sleepRandom(
  minMs: number,
  maxMs: number,
  signal?: AbortSignal,
): Promise<void> {
  const ms = randomIntInclusive(minMs, maxMs);
  return sleep(ms, signal);
}
