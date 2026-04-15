/**
 * 验证百度 OAuth token 端点（需项目根目录 `.env` 中 API_KEY、SECRET_KEY）。
 * 用法：node --env-file=.env scripts/test-baidu-ocr.mjs
 */
const id = process.env.API_KEY?.trim();
const sec = process.env.SECRET_KEY?.trim();
if (!id || !sec) {
  console.error('缺少 API_KEY 或 SECRET_KEY（请使用 node --env-file=.env 运行）');
  process.exit(1);
}

const url = new URL('https://aip.baidubce.com/oauth/2.0/token');
url.searchParams.set('grant_type', 'client_credentials');
url.searchParams.set('client_id', id);
url.searchParams.set('client_secret', sec);

const res = await fetch(url.toString(), {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

const data = await res.json();
console.log('HTTP', res.status);
console.log(JSON.stringify(data, null, 2));

if (!data.access_token) {
  process.exit(1);
}
console.error('\nOAuth 端点正常，access_token 长度:', data.access_token.length);
