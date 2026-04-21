import { getUserEnvPathForBaidu, writeBaiduCredentialsToUserEnv } from '../common/baidu_user_env.js';
import { clearBaiduTokenCache } from '../ocr/baidu_ocr.js';

/**
 * 隐藏命令：将百度 OCR 的 API Key / Secret 写入 ~/.boss-cli/.env，并更新当前进程环境变量。
 */
export function implSetBaiduCredentials(apiKey: string, secretKey: string): string {
  const ak = apiKey.trim();
  const sk = secretKey.trim();
  if (!ak || !sk) {
    throw new Error('API Key 与 Secret Key 均不能为空。');
  }
  writeBaiduCredentialsToUserEnv(ak, sk);
  process.env.BOSS_BAIDU_API_KEY = ak;
  process.env.BOSS_BAIDU_SECRET_KEY = sk;
  clearBaiduTokenCache();
  const path = getUserEnvPathForBaidu();
  return [
    '已保存百度 OCR 凭证。',
    `文件：${path}`,
    '当前进程已生效；新开终端或下次启动 boss 时会自动读取。',
    '若当前工作目录下存在 .env 且含 BOSS_BAIDU_* 或 API_KEY/SECRET_KEY，加载顺序为：用户配置先、项目 .env 后（后者可覆盖）。',
  ].join('\n');
}
