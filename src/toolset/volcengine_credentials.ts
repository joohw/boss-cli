import {
  getUserEnvPathForVolcengine,
  writeVolcengineCredentialsToUserEnv,
} from '../common/volcengine_user_env.js';

/**
 * 隐藏命令：将火山 OCR 的 Access Key / Secret Key 写入 ~/.boss-cli/.env，并更新当前进程环境变量。
 */
export function implSetVolcengineCredentials(accessKey: string, secretKey: string): string {
  const ak = accessKey.trim();
  const sk = secretKey.trim();
  if (!ak || !sk) {
    throw new Error('Access Key 与 Secret Key 均不能为空。');
  }
  writeVolcengineCredentialsToUserEnv(ak, sk);
  process.env.BOSS_RESUME_OCR_PROVIDER = 'volcengine';
  process.env.BOSS_VOLCENGINE_ACCESS_KEY = ak;
  process.env.BOSS_VOLCENGINE_SECRET_KEY = sk;
  const path = getUserEnvPathForVolcengine();
  return [
    '已保存火山 OCR 凭证。',
    `文件：${path}`,
    '当前进程已生效；新开终端或下次启动 boss 时会自动读取。',
    '已设置 BOSS_RESUME_OCR_PROVIDER=volcengine，不会自动回退到其他 OCR 服务商。',
  ].join('\n');
}
