/**
 * 百度 AI 开放平台：OAuth + 通用文字识别（高精度含位置版 accurate_basic）。
 * 需在环境变量中配置 `API_KEY`、`SECRET_KEY`（与百度控制台一致）。
 * @see https://ai.baidu.com/ai-doc/OCR/zk3h7xz52
 */

const BAIDU_TOKEN_URL = 'https://aip.baidubce.com/oauth/2.0/token';
const BAIDU_OCR_ACCURATE_BASIC = 'https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic';

function apiKey(): string | undefined {
  return process.env.API_KEY?.trim() || process.env.BOSS_BAIDU_API_KEY?.trim();
}

function secretKey(): string | undefined {
  return process.env.SECRET_KEY?.trim() || process.env.BOSS_BAIDU_SECRET_KEY?.trim();
}

export function isBaiduOcrConfigured(): boolean {
  return !!(apiKey() && secretKey());
}

let cachedToken: { token: string; expiresAtMs: number } | null = null;

/** 获取 access_token（带简单内存缓存，过期前 1 分钟刷新）。 */
export async function getBaiduAccessToken(): Promise<string> {
  const client_id = apiKey();
  const client_secret = secretKey();
  if (!client_id || !client_secret) {
    throw new Error('缺少百度 OCR 凭证：请设置 API_KEY 与 SECRET_KEY（或 BOSS_BAIDU_API_KEY / BOSS_BAIDU_SECRET_KEY）');
  }

  const now = Date.now();
  if (cachedToken && now < cachedToken.expiresAtMs - 60_000) {
    return cachedToken.token;
  }

  const u = new URL(BAIDU_TOKEN_URL);
  u.searchParams.set('grant_type', 'client_credentials');
  u.searchParams.set('client_id', client_id);
  u.searchParams.set('client_secret', client_secret);

  const res = await fetch(u.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  const data = (await res.json()) as {
    access_token?: string;
    expires_in?: number;
    error?: string;
    error_description?: string;
  };

  if (!res.ok || !data.access_token) {
    throw new Error(
      `百度 OAuth 失败: ${res.status} ${data.error ?? ''} ${data.error_description ?? JSON.stringify(data)}`,
    );
  }

  const expiresInSec = typeof data.expires_in === 'number' ? data.expires_in : 2592000;
  cachedToken = {
    token: data.access_token,
    expiresAtMs: now + expiresInSec * 1000,
  };
  return data.access_token;
}

type BaiduOcrLine = { words?: string };

/** 对整张 PNG/JPG 做高精度识别，返回合并文本（按行拼接）。 */
export async function baiduOcrImageBase64(imageBase64: string): Promise<string> {
  const token = await getBaiduAccessToken();
  const url = new URL(BAIDU_OCR_ACCURATE_BASIC);
  url.searchParams.set('access_token', token);

  const body = new URLSearchParams();
  body.set('image', imageBase64);
  body.set('language_type', 'CHN_ENG');

  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: body.toString(),
  });

  const data = (await res.json()) as {
    words_result?: BaiduOcrLine[];
    error_code?: number;
    error_msg?: string;
  };

  if (!res.ok || (data.error_code !== undefined && data.error_code !== 0)) {
    throw new Error(`百度 OCR 失败: ${res.status} ${data.error_msg ?? JSON.stringify(data)}`);
  }

  const lines = (data.words_result ?? [])
    .map((r) => (r.words ?? '').trim())
    .filter((s) => s.length > 0);
  return lines.join('\n').trim();
}
