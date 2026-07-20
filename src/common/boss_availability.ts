import { createHash } from 'node:crypto';

const CHECK_ENTRY_URL = 'https://www.zhipin.com/web/chat/index';
const CHECK_LOGIN_URL = 'https://www.zhipin.com/web/user/?ka=header-login';
const CHECK_TIMEOUT_MS = 20_000;
const VERIFIED_CAPTURE_LABEL = '2026-07-14 boss-online-js snapshot';
const VERIFIED_BOSS_INDEX_VERSION = 'v10718';
const VERIFIED_BOSS_BUNDLE_VERSION = 'v6230';
const VERIFIED_ZHIPIN_SIGN_VERSION = 'v5309';

const CHECK_HEADERS = {
  'user-agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
  accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
} as const;

const REQUIRED_ENTRY_SCRIPT_URLS = [
  'https://static.zhipin.com/assets/sdk/warlock/warlockdata.min.2.2.14.js',
  'https://static.zhipin.com/assets/sdk/apm/patas-compat.2.1.0.min.js',
  'https://static.zhipin.com/assets/zhipin/chat/mqtt-v1.2.min.js',
  'https://static.zhipin.com/zhipin-boss/index/v10718/static/js/polyfill.js',
  'https://static.zhipin.com/zhipin-boss/index/v10718/static/js/app.js',
  'https://static.zhipin.com/zhipin-boss/index/v10718/static/js/risk-detection.js',
] as const;

const REQUIRED_LOGIN_SCRIPT_URLS = [
  'https://img.bosszhipin.com/static/zhipin/geek/sdk/browser-check-v2.js',
  'https://static.zhipin.com/assets/sdk/apm/patas.2.3.0.min.js',
  'https://static.zhipin.com/assets/sdk/warlock/warlockdata.min.2.2.15.js',
  'https://static.zhipin.com/zhipin-sign/v5309/static/js/iframe-core.7fa9fa18.js',
  'https://static.zhipin.com/zhipin-sign/v5309/static/js/vendors~app.9ac375ae.js',
  'https://static.zhipin.com/zhipin-sign/v5309/static/js/app.ee012dc3.js',
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
    label: 'chat warlock',
    url: 'https://static.zhipin.com/assets/sdk/warlock/warlockdata.min.2.2.14.js',
    sha256: '5979a30734aa6ce729989e545c61f52a8b6e717bdd544e894e3c60db893e7d68',
  },
  {
    label: 'login warlock',
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
    url: 'https://static.zhipin.com/zhipin-boss/index/v10718/static/js/app.js',
    sha256: '68f6c03dd3625e991536a9142dd9b32b857d58fe87f2514e534594d64ce3eef3',
  },
  {
    label: 'boss-index polyfill',
    url: 'https://static.zhipin.com/zhipin-boss/index/v10718/static/js/polyfill.js',
    sha256: 'a13c89ce208f95a56384bf532360b44a8a57bd433e64e5337bc8566dd5099a23',
  },
  {
    label: 'boss-index risk-detection',
    url: 'https://static.zhipin.com/zhipin-boss/index/v10718/static/js/risk-detection.js',
    sha256: '7db62a24265be651efb47fcc3a3ef1ca89c3c1edabbddf6bf097c12987d38f22',
  },
  {
    label: 'boss-bundle remoteEntry',
    url: 'https://static.zhipin.com/zhipin-boss/bundle/v6230/static/remoteEntry.js',
    sha256: 'dd4bde71d20bf53882fa5e8cdae03baa4cd3d4347f5c1e66be8aadfc4aa64ab8',
  },
  {
    label: 'zhipin-sign app',
    url: 'https://static.zhipin.com/zhipin-sign/v5309/static/js/app.ee012dc3.js',
    sha256: '038e5a007c0d708f2ce370dbbb02de8c202d85dbfef59ad084e672f07446a2f5',
  },
  {
    label: 'zhipin-sign iframe-core',
    url: 'https://static.zhipin.com/zhipin-sign/v5309/static/js/iframe-core.7fa9fa18.js',
    sha256: '2170fa54732f95da0b233a80a5cec6858bb2c8aec15361febe4764200a4eb02d',
  },
  {
    label: 'zhipin-sign vendor',
    url: 'https://static.zhipin.com/zhipin-sign/v5309/static/js/vendors~app.9ac375ae.js',
    sha256: 'bf6cd6d0be836703b86916f2ddeee69987e4e3c4f9476f16091bf9314458883b',
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
  if (assetUrls.includes(expectedUrl)) {
    return { url: expectedUrl, reason: null };
  }

  const expectedIdentity = toStableScriptIdentity(expectedUrl);
  if (expectedIdentity === expectedUrl) {
    return { url: null, reason: null };
  }

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

function formatDisabledMessage(reasons: string[]): string {
  return [
    'Boss CLI 已禁用：Boss 线上前端 JS 与已验证基线不一致。',
    `已验证基线：${VERIFIED_CAPTURE_LABEL}，Boss index ${VERIFIED_BOSS_INDEX_VERSION}，Boss bundle ${VERIFIED_BOSS_BUNDLE_VERSION}，Zhipin sign ${VERIFIED_ZHIPIN_SIGN_VERSION}。`,
    '',
    '触发原因：',
    ...reasons.map((reason) => `- ${reason}`),
    '',
    '处理方式：重新归档 Boss 线上原始 JS，复核反调试/风控策略，然后更新 boss_availability 基线后再发版。',
  ].join('\n');
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

export async function assertBossCliAvailable(): Promise<void> {
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
  const currentAssetUrls = [...entryPage.assetUrls, ...loginPage.assetUrls];

  if (reasons.length > 0) {
    throw new BossAvailabilityError(formatDisabledMessage(reasons));
  }

  for (const guarded of GUARDED_SCRIPT_HASHES) {
    const current = findCurrentScriptUrl(currentAssetUrls, guarded.url);
    if (current.reason) {
      reasons.push(`${guarded.label} ${current.reason}`);
      continue;
    }

    const guardedUrl = current.url ?? guarded.url;
    try {
      const { buffer, finalUrl } = await fetchBufferStrict(guardedUrl);
      if (finalUrl !== guardedUrl) {
        reasons.push(`${guarded.label} 发生跳转：${guardedUrl} -> ${finalUrl}`);
        continue;
      }
      const actualSha256 = sha256(buffer);
      if (actualSha256 !== guarded.sha256) {
        reasons.push(
          `${guarded.label} SHA-256 不一致：url ${guardedUrl}, expected ${guarded.sha256}, actual ${actualSha256}`,
        );
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      reasons.push(`${guarded.label} 读取失败：${msg}`);
    }
  }

  if (reasons.length > 0) {
    throw new BossAvailabilityError(formatDisabledMessage(reasons));
  }
}
