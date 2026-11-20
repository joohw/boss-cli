import { createHash } from 'node:crypto';

const CHECK_ENTRY_URL = 'https://www.zhipin.com/web/chat/index';
const CHECK_LOGIN_URL = 'https://www.zhipin.com/web/user/?ka=header-login';
const CHECK_TIMEOUT_MS = 20_000;
const VERIFIED_CAPTURE_LABEL = '2026-11-17 boss-online-js snapshot';
const VERIFIED_BOSS_INDEX_VERSION = 'v11778';
const VERIFIED_BOSS_BUNDLE_VERSION = 'v6477';
const VERIFIED_ZHIPIN_SIGN_VERSION = 'v5333';
const BOSS_INDEX_APP_URL = 'https://static.zhipin.com/zhipin-boss/index/v11778/static/js/app.js';
const VERIFIED_BOSS_BUNDLE_HASH = '4659c081238430b95d503f1108ba59086c22ee9fbc45980ca55b54b1ea1587d4';

const CHECK_HEADERS = {
  'user-agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
  accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
} as const;

const REQUIRED_ENTRY_SCRIPT_URLS = [
  'https://static.zhipin.com/assets/sdk/warlock/warlockdata.min.2.2.15.js',
  'https://static.zhipin.com/assets/sdk/apm/patas-compat.2.1.0.min.js',
  'https://static.zhipin.com/assets/zhipin/chat/mqtt-v1.2.min.js',
  'https://static.zhipin.com/zhipin-boss/index/v11778/static/js/polyfill.js',
  BOSS_INDEX_APP_URL,
  'https://static.zhipin.com/zhipin-boss/index/v11778/static/js/risk-detection.js',
] as const;

const REQUIRED_LOGIN_SCRIPT_URLS = [
  'https://img.bosszhipin.com/static/zhipin/geek/sdk/browser-check-v2.js',
  'https://static.zhipin.com/assets/sdk/apm/patas.2.3.0.min.js',
  'https://static.zhipin.com/assets/sdk/warlock/warlockdata.min.2.2.15.js',
  'https://static.zhipin.com/zhipin-sign/v5333/static/js/iframe-core.a35c6000.js',
  'https://static.zhipin.com/zhipin-sign/v5333/static/js/vendors.9a2efe85.js',
  'https://static.zhipin.com/zhipin-sign/v5333/static/js/app.85b65004.js',
] as const;

const GUARDED_SCRIPT_HASHES = [
  {
    label: 'browser-check-v2',
    url: 'https://img.bosszhipin.com/static/zhipin/geek/sdk/browser-check-v2.js',
    sha256: '0ba94a338ed00ba353384a091f36fca73c67651cf6fe28c588c5e926aaa0399e',
  },
  {
    label: 'chat apm patas-compat',
    url: 'https://static.zhipin.com/assets/sdk/apm/patas-compat.2.1.0.min.js',
    sha256: '2c8d059c16800f91639bc7eb2040bfa8a211425d02a8b702831c9cd5b2f6315a',
  },
  {
    label: 'login apm patas',
    url: 'https://static.zhipin.com/assets/sdk/apm/patas.2.3.0.min.js',
    sha256: 'cf96ad9e6da919b4a88d623b53d7ba2cc49529df9d12ef7d886164c3482424cc',
  },
  {
    label: 'chat and login warlock',
    url: 'https://static.zhipin.com/assets/sdk/warlock/warlockdata.min.2.2.15.js',
    sha256: '51bd06ef6a77d5ceecef040c5ff8c44324f425104bb505137302de1e20327345',
  },
  {
    label: 'chat mqtt',
    url: 'https://static.zhipin.com/assets/zhipin/chat/mqtt-v1.2.min.js',
    sha256: 'd63db9287a0aba5dc81c3b1fb393303a63b1a6c0dd0aec5bc26ddc84b0dfc67f',
  },
  {
    label: 'boss-index app',
    url: BOSS_INDEX_APP_URL,
    sha256: 'f2bac935fab96e2fc8bb09f8d8ad19dda8a6aa1b939512f0d9624d01a9aaae54',
  },
  {
    label: 'boss-index polyfill',
    url: 'https://static.zhipin.com/zhipin-boss/index/v11778/static/js/polyfill.js',
    sha256: 'de3813688681685a453586735263b76c4b39a675cdb301553c9827cf35de340a',
  },
  {
    label: 'boss-index risk-detection',
    url: 'https://static.zhipin.com/zhipin-boss/index/v11778/static/js/risk-detection.js',
    sha256: '04d87024d60139241c07b4762c64b0c29ff2fc4dd88f9bf566c3f4ffbe1bbe84',
  },
  {
    label: 'zhipin-sign app',
    url: 'https://static.zhipin.com/zhipin-sign/v5333/static/js/app.85b65004.js',
    sha256: '8c678738585c5bbd42e3d778176408a462031bde5eb6ea08dc0ca0e2f06a44de',
  },
  {
    label: 'zhipin-sign iframe-core',
    url: 'https://static.zhipin.com/zhipin-sign/v5333/static/js/iframe-core.a35c6000.js',
    sha256: '4bde3350c0d8be98bf34f49b92e6e0e9745760a7638f621b45500678c23dfec1',
  },
  {
    label: 'zhipin-sign vendor',
    url: 'https://static.zhipin.com/zhipin-sign/v5333/static/js/vendors.9a2efe85.js',
    sha256: '5a6e06340abd02c6b77472f4465b16fc23fdcfc3f2ace5a32863a3d6f12ca6a3',
  },
] as const;

export class BossAvailabilityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BossAvailabilityError';
  }
}

function normalizeRemoteUrl(raw: string, baseUrl: string): string | null {
  try {
    return new URL(raw, baseUrl).toString();
  } catch {
    return null;
  }
}

function extractAssetUrls(html: string, baseUrl: string): string[] {
  const urls = new Set<string>();
  const attrRe = /<(?:script|link)\b[^>]+(?:src|href)=["']([^"']+)["']/gi;
  for (const match of html.matchAll(attrRe)) {
    const raw = match[1];
    if (!raw) {
      continue;
    }
    const url = normalizeRemoteUrl(raw, baseUrl);
    if (url) {
      urls.add(url);
    }
  }
  return Array.from(urls).sort();
}

async function fetchBufferStrict(url: string): Promise<{ buffer: Buffer; finalUrl: string }> {
  const res = await fetch(url, {
    headers: CHECK_HEADERS,
    redirect: 'follow',
    signal: AbortSignal.timeout(CHECK_TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText} while fetching ${url}`);
  }
  const body = Buffer.from(await res.arrayBuffer());
  return { buffer: body, finalUrl: res.url || url };
}

function sha256(buffer: Buffer): string {
  return createHash('sha256').update(buffer).digest('hex');
}

const VERSIONED_SCRIPT_RE = /\/(?:zhipin-boss\/index|zhipin-sign)\/v\d+\//;

function toStableScriptIdentity(url: string): string {
  return url
    .replace(VERSIONED_SCRIPT_RE, (segment) => segment.replace(/\/v\d+\//, '/v*/'))
    .replace(/\/static\/js\/([^/.]+(?:~[^/.]+)?)\.[a-f0-9]{8,}\.js$/i, '/static/js/$1.*.js');
}

function findCurrentScriptUrl(
  assetUrls: readonly string[],
  expectedUrl: string,
): { url: string | null; reason: string | null } {
  const expectedIdentity = toStableScriptIdentity(expectedUrl);
  const matches = assetUrls.filter((url) => toStableScriptIdentity(url) === expectedIdentity);
  if (matches.length === 0) {
    return { url: null, reason: null };
  }
  if (matches.length > 1) {
    return {
      url: null,
      reason: `多个当前脚本匹配同一个已验证身份 ${expectedIdentity}: ${matches.join(', ')}`,
    };
  }
  return { url: matches[0], reason: null };
}

function formatReviewFailure(reasons: string[]): string {
  return [
    'Boss 前端发布验收失败：线上脚本未通过基线校验。',
    `已验证基线：${VERIFIED_CAPTURE_LABEL}，Boss index ${VERIFIED_BOSS_INDEX_VERSION}，Boss bundle ${VERIFIED_BOSS_BUNDLE_VERSION}，Zhipin sign ${VERIFIED_ZHIPIN_SIGN_VERSION}。`,
    '',
    '触发原因：',
    ...reasons.map((reason) => `- ${reason}`),
    '',
    '处理方式：重新归档 Boss 线上原始 JS，复核反调试/风控策略，然后更新 boss_availability 基线后再发版。',
  ].join('\n');
}

async function fetchVerifiedScript(url: string, expectedSha256: string): Promise<Buffer> {
  const { buffer, finalUrl } = await fetchBufferStrict(url);
  if (finalUrl !== url) {
    throw new Error(`脚本发生跳转：${url} -> ${finalUrl}`);
  }
  const actualSha256 = sha256(buffer);
  if (actualSha256 !== expectedSha256) {
    throw new Error(`SHA-256 不一致：url ${url}, expected ${expectedSha256}, actual ${actualSha256}`);
  }
  return buffer;
}

async function verifyCurrentBundle(chatApp: Buffer, chatAppUrl: string): Promise<void> {
  const matches = new Set(
    Array.from(
      chatApp.toString('utf8').matchAll(/https:\/\/static\.zhipin\.com\/zhipin-boss\/bundle\/v\d+\/static\/remoteEntry\.js(?=["'])/g),
      (match) => match[0],
    ),
  );
  if (matches.size !== 1) {
    throw new Error(`聊天脚本 ${chatAppUrl} 应引用一个业务包入口，实际 ${matches.size} 个：${[...matches].join(', ')}`);
  }
  const [url] = matches;
  await fetchVerifiedScript(url, VERIFIED_BOSS_BUNDLE_HASH);
}

async function assertEntryPageMatches(params: {
  pageLabel: string;
  url: string;
  requiredScripts: readonly string[];
}): Promise<{ reasons: string[]; assetUrls: string[] }> {
  try {
    const reasons: string[] = [];
    const { buffer, finalUrl } = await fetchBufferStrict(params.url);
    if (finalUrl !== params.url) {
      reasons.push(`${params.pageLabel} 发生跳转：${params.url} -> ${finalUrl}`);
    }
    const assetUrls = extractAssetUrls(buffer.toString('utf8'), params.url);

    for (const url of params.requiredScripts) {
      const current = findCurrentScriptUrl(assetUrls, url);
      if (current.reason) {
        reasons.push(`${params.pageLabel} ${current.reason}`);
        continue;
      }
      if (!current.url) {
        reasons.push(`${params.pageLabel} 缺少已验证脚本：${url}`);
      }
    }

    return { reasons, assetUrls };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { reasons: [`无法读取 ${params.pageLabel} ${params.url}：${msg}`], assetUrls: [] };
  }
}

export async function assertBossFrontendBaseline(): Promise<void> {
  const entryPage = await assertEntryPageMatches({
    pageLabel: 'Boss 聊天入口页',
    url: CHECK_ENTRY_URL,
    requiredScripts: REQUIRED_ENTRY_SCRIPT_URLS,
  });
  const loginPage = await assertEntryPageMatches({
    pageLabel: 'Boss 登录入口页',
    url: CHECK_LOGIN_URL,
    requiredScripts: REQUIRED_LOGIN_SCRIPT_URLS,
  });
  const reasons = [...entryPage.reasons, ...loginPage.reasons];
  const currentAssetUrls = [...new Set([...entryPage.assetUrls, ...loginPage.assetUrls])];

  if (reasons.length > 0) {
    throw new BossAvailabilityError(formatReviewFailure(reasons));
  }

  for (const guarded of GUARDED_SCRIPT_HASHES) {
    const current = findCurrentScriptUrl(currentAssetUrls, guarded.url);
    if (current.reason) {
      reasons.push(`${guarded.label} ${current.reason}`);
      continue;
    }

    if (!current.url) {
      reasons.push(`${guarded.label} 缺少已验证脚本：${guarded.url}`);
      continue;
    }

    let buffer: Buffer;
    try {
      buffer = await fetchVerifiedScript(current.url, guarded.sha256);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      reasons.push(`${guarded.label} ${current.url}：${msg}`);
      continue;
    }

    if (guarded.url === BOSS_INDEX_APP_URL) {
      try {
        await verifyCurrentBundle(buffer, current.url);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        reasons.push(`boss-bundle remoteEntry：${msg}`);
      }
    }
  }

  if (reasons.length > 0) {
    throw new BossAvailabilityError(formatReviewFailure(reasons));
  }
}
