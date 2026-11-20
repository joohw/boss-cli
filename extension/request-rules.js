// Reviewed browser-side rules from the 2026-11-17 Boss frontend snapshot.
const reports = [
  ['logapi.zhipin.com', '/dap/api/json'],
  ['logapi-dev.weizhipin.com', '/dap/api/json'],
  ['apm-fe.zhipin.com', '/wapi/zpApm/'],
  ['apm-fe-qa.weizhipin.com', '/wapi/zpApm/'],
  ['warlock.zhipin.com', '/wapi/warlock/'],
  ['shink.zhipin.com', '/wapi/dapCommon/json'],
];

const securityAssets = [
  ['www.zhipin.com', '/zhipin-security/web/boss/'],
  ['img.bosszhipin.com', '/static/zhipin/geek/sdk/'],
];

function matchesPath(pathname, path) {
  if (path.endsWith('/')) return pathname.startsWith(path);
  return pathname === path;
}

const rules = [
  ...reports.map(([host, path]) => ({
    pattern: 'http*://' + host + path + '*',
    kind: 'reports',
    matches: (url) => (url.protocol === 'https:' || url.protocol === 'http:') &&
      url.hostname === host && matchesPath(url.pathname, path),
  })),
  ...securityAssets.map(([host, path]) => ({
    pattern: 'https://' + host + path + '*',
    kind: 'assets',
    matches: (url) => url.protocol === 'https:' && url.hostname === host && matchesPath(url.pathname, path),
  })),
  {
    pattern: 'https://static.zhipin.com/zhipin-boss/index/*/static/js/risk-detection.js*',
    kind: 'assets',
    matches: (url) => url.origin === 'https://static.zhipin.com' &&
      /^\/zhipin-boss\/index\/v\d+\/static\/js\/risk-detection\.js$/.test(url.pathname),
  },
];

export const requestPatterns = rules.map(({ pattern }) => ({
  urlPattern: pattern,
  requestStage: 'Request',
}));

export function matchRequest(rawUrl) {
  const url = new URL(rawUrl);
  return rules.find((rule) => rule.matches(url))?.kind;
}

export function reportResponseHeaders(requestHeaders) {
  const headers = new Map(Object.entries(requestHeaders).map(([name, value]) => [name.toLowerCase(), value]));
  const response = [
    { name: 'access-control-allow-methods', value: 'GET, POST, OPTIONS' },
    { name: 'cache-control', value: 'no-store' },
  ];
  if (headers.has('origin')) {
    response.push(
      { name: 'access-control-allow-origin', value: headers.get('origin') },
      { name: 'access-control-allow-credentials', value: 'true' },
      { name: 'vary', value: 'Origin' },
    );
  }
  if (headers.has('access-control-request-headers')) {
    response.push({
      name: 'access-control-allow-headers',
      value: headers.get('access-control-request-headers'),
    });
  }
  return response;
}
