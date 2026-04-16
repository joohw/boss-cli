import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

function getPackageJsonPath(): string {
  return join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'package.json');
}

export function getPackageMeta(): { name: string; version: string } {
  const raw = readFileSync(getPackageJsonPath(), 'utf8');
  const parsed = JSON.parse(raw) as { name?: string; version?: string };
  const name = typeof parsed.name === 'string' ? parsed.name : '';
  const version = typeof parsed.version === 'string' ? parsed.version : '';
  if (!name || !version) {
    throw new Error('package.json 缺少有效的 name 或 version 字段');
  }
  return { name, version };
}

/** 比较 semver x.y.z（忽略预发布标签，仅比较主版本段） */
function compareSemver(a: string, b: string): number {
  const core = (s: string) => s.split('-')[0] ?? '';
  const pa = core(a).split('.').map((x) => parseInt(x, 10));
  const pb = core(b).split('.').map((x) => parseInt(x, 10));
  if (pa.some((n) => Number.isNaN(n)) || pb.some((n) => Number.isNaN(n))) {
    throw new Error(`无法解析的版本号: ${JSON.stringify(a)} / ${JSON.stringify(b)}`);
  }
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const da = pa[i] ?? 0;
    const db = pb[i] ?? 0;
    if (da !== db) {
      return da > db ? 1 : -1;
    }
  }
  return 0;
}

export async function fetchNpmLatestVersion(packageName: string): Promise<string> {
  const path = `${encodeURIComponent(packageName)}/latest`;
  const url = `https://registry.npmjs.org/${path}`;
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`查询 npm 最新版本失败：HTTP ${res.status}（${url}）`);
  }
  const data = (await res.json()) as { version?: unknown };
  if (typeof data.version !== 'string' || data.version.length === 0) {
    throw new Error('npm registry 响应缺少有效的 version 字段');
  }
  return data.version;
}

export async function printVersionInfo(): Promise<void> {
  const { name, version: current } = getPackageMeta();
  console.log(`${name} ${current}`);
  const latest = await fetchNpmLatestVersion(name);
  const cmp = compareSemver(latest, current);
  if (cmp > 0) {
    console.log(`新版本可用: ${latest}（当前 ${current}）。更新: npm i -g ${name}`);
  }
}
