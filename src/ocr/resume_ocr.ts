import { basename, join } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { ensureAppDataLayout, RESUME_OCR_DIR } from '../config.js';
import { baiduOcrImageBase64, isBaiduOcrConfigured } from './baidu_ocr.js';
import { isVolcengineOcrConfigured, volcengineOcrImageBase64 } from './volcengine_ocr.js';

type ResumeOcrProvider = 'baidu' | 'volcengine';

/**
 * 是否对在线简历截图做 OCR。关闭：`BOSS_RESUME_OCR=0`。
 * 开启时需通过 `BOSS_RESUME_OCR_PROVIDER` 显式选择服务商；未设置时保持兼容，使用百度。
 */
export function isResumeOcrEnabled(): boolean {
  const v = process.env.BOSS_RESUME_OCR?.trim().toLowerCase();
  return v !== '0' && v !== 'false' && v !== 'no';
}

function resumeOcrProvider(): ResumeOcrProvider {
  const provider = process.env.BOSS_RESUME_OCR_PROVIDER?.trim().toLowerCase() || 'baidu';
  if (provider === 'baidu' || provider === 'volcengine') {
    return provider;
  }
  throw new Error('未知简历 OCR 服务商：请设置 BOSS_RESUME_OCR_PROVIDER=baidu 或 volcengine');
}

async function ocrImageBase64ByConfiguredProvider(imageBase64: string): Promise<string> {
  const provider = resumeOcrProvider();
  if (provider === 'baidu') {
    if (!isBaiduOcrConfigured()) {
      throw new Error(
        '已开启简历 OCR（BOSS_RESUME_OCR_PROVIDER=baidu），但未配置百度密钥：请设置 API_KEY 与 SECRET_KEY（或 BOSS_BAIDU_API_KEY / BOSS_BAIDU_SECRET_KEY）。',
      );
    }
    return baiduOcrImageBase64(imageBase64);
  }
  if (!isVolcengineOcrConfigured()) {
    throw new Error(
      '已开启简历 OCR（BOSS_RESUME_OCR_PROVIDER=volcengine），但未配置火山密钥：请设置 BOSS_VOLCENGINE_ACCESS_KEY 与 BOSS_VOLCENGINE_SECRET_KEY。',
    );
  }
  return volcengineOcrImageBase64(imageBase64);
}

/** 串行执行 OCR，避免并发请求交错 */
let ocrChain: Promise<unknown> = Promise.resolve();

/**
 * 对简历区域 PNG 调用已配置的 OCR，将结果写入 `~/.boss-cli/.cache/ocr/`（与截图同名 `.txt`）。
 */
export async function ocrResumePngToTextFile(pngAbsPath: string): Promise<{ textPath: string; text: string }> {
  ensureAppDataLayout();

  const base = basename(pngAbsPath).replace(/\.png$/i, '.txt');
  const textPath = join(RESUME_OCR_DIR, base);

  const run = async (): Promise<{ textPath: string; text: string }> => {
    const buf = await readFile(pngAbsPath);
    const text = await ocrImageBase64ByConfiguredProvider(buf.toString('base64'));
    await writeFile(textPath, text.endsWith('\n') ? text : `${text}\n`, 'utf8');
    return { textPath, text };
  };

  const p = ocrChain.then(run);
  ocrChain = p.catch((err) => {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[boss-cli] resume OCR chain reset after failure:', msg);
  });
  return p;
}
