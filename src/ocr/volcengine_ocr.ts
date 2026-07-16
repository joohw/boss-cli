/**
 * 火山引擎视觉智能 OCR：OCRNormal。
 * 需在环境变量中配置 `BOSS_VOLCENGINE_ACCESS_KEY`、`BOSS_VOLCENGINE_SECRET_KEY`。
 * @see https://www.volcengine.com/docs/86081/1660264?lang=zh
 */

import { Signer } from '@volcengine/openapi';

const VOLCENGINE_OCR_HOST = 'visual.volcengineapi.com';
const VOLCENGINE_OCR_ENDPOINT = `https://${VOLCENGINE_OCR_HOST}`;
const VOLCENGINE_OCR_ACTION = 'OCRNormal';
const VOLCENGINE_OCR_VERSION = '2020-08-26';
const VOLCENGINE_OCR_SERVICE = 'cv';
const VOLCENGINE_OCR_REGION = 'cn-north-1';

function accessKey(): string | undefined {
  return process.env.BOSS_VOLCENGINE_ACCESS_KEY?.trim() || process.env.VOLCENGINE_ACCESS_KEY?.trim();
}

function secretKey(): string | undefined {
  return process.env.BOSS_VOLCENGINE_SECRET_KEY?.trim() || process.env.VOLCENGINE_SECRET_KEY?.trim();
}

function sessionToken(): string | undefined {
  return process.env.BOSS_VOLCENGINE_SESSION_TOKEN?.trim() || process.env.VOLCENGINE_SESSION_TOKEN?.trim();
}

type VolcengineOcrLine = {
  text?: string;
  words?: string;
  line_text?: string;
};

type VolcengineOcrResponse = {
  ResponseMetadata?: {
    RequestId?: string;
    Error?: {
      Code?: string;
      Message?: string;
    };
  };
  code?: number;
  message?: string;
  data?: {
    ocr_infos?: VolcengineOcrLine[];
    line_texts?: string[];
  };
  result?: {
    ocr_infos?: VolcengineOcrLine[];
    line_texts?: string[];
  };
};


export function isVolcengineOcrConfigured(): boolean {
  return Boolean(accessKey() && secretKey());
}

function extractVolcengineOcrText(data: VolcengineOcrResponse): string {
  const container = data.data ?? data.result;
  const linesFromObjects = (container?.ocr_infos ?? [])
    .map((line) => (line.text ?? line.words ?? line.line_text ?? '').trim())
    .filter((text) => text.length > 0);
  const linesFromStrings = (container?.line_texts ?? [])
    .map((text) => text.trim())
    .filter((text) => text.length > 0);
  return [...linesFromObjects, ...linesFromStrings].join('\n').trim();
}

/** 对整张 PNG/JPG 做多语种文字识别，返回合并文本（按行拼接）。 */
export async function volcengineOcrImageBase64(imageBase64: string): Promise<string> {
  const ak = accessKey();
  const sk = secretKey();
  if (!ak || !sk) {
    throw new Error('缺少火山 OCR 凭证：请设置 BOSS_VOLCENGINE_ACCESS_KEY 与 BOSS_VOLCENGINE_SECRET_KEY');
  }

  const body = new URLSearchParams({ image_base64: imageBase64 });
  const request = {
    region: VOLCENGINE_OCR_REGION,
    method: 'POST',
    pathname: '/',
    params: {
      Action: VOLCENGINE_OCR_ACTION,
      Version: VOLCENGINE_OCR_VERSION,
    },
    headers: {
      Host: VOLCENGINE_OCR_HOST,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  };

  const signer = new Signer(request, VOLCENGINE_OCR_SERVICE);
  signer.addAuthorization(
    {
      accessKeyId: ak,
      secretKey: sk,
      sessionToken: sessionToken(),
    },
    new Date(),
  );

  const url = new URL(VOLCENGINE_OCR_ENDPOINT);
  url.searchParams.set('Action', VOLCENGINE_OCR_ACTION);
  url.searchParams.set('Version', VOLCENGINE_OCR_VERSION);

  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: request.headers,
    body,
  });

  const data = (await res.json()) as VolcengineOcrResponse;
  const metadataError = data.ResponseMetadata?.Error;
  if (!res.ok || metadataError || (data.code !== undefined && data.code !== 10000)) {
    const detail = metadataError
      ? `${metadataError.Code ?? ''} ${metadataError.Message ?? ''}`.trim()
      : data.message ?? JSON.stringify(data);
    const requestId = data.ResponseMetadata?.RequestId ? ` requestId=${data.ResponseMetadata.RequestId}` : '';
    throw new Error(`火山 OCR 失败: ${res.status} ${detail}${requestId}`);
  }

  return extractVolcengineOcrText(data);
}
