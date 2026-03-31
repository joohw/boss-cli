import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export type ListOpenPositionsDeps = {
  /**
   * 存放岗位 JD 的目录（每个岗位一个 .md/.MD 文件）。
   * 默认：本包根目录下的 `jd/`（相对 `src/toolset` 或 `dist/toolset` 解析）。
   */
  jdDir?: string;
};

function defaultJdDir(): string {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.join(here, '..', '..', 'jd');
}

function isMdFile(name: string): boolean {
  return name.toLowerCase().endsWith('.md');
}

export async function runListOpenPositions(
  deps: ListOpenPositionsDeps = {},
): Promise<string> {
  const jdDir = deps.jdDir ?? defaultJdDir();
  console.error(`[boss-cli] list_open_positions jdDir=${jdDir}`);

  try {
    const entries = await readdir(jdDir, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile() && isMdFile(e.name))
      .map((e) => e.name)
      .sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'));

    type Row = { title: string; filename: string; content: string };
    const positions: Row[] = [];
    for (const filename of files) {
      const full = path.join(jdDir, filename);
      const content = await readFile(full, 'utf8');
      const base = path.basename(filename, path.extname(filename));
      positions.push({ title: base, filename, content });
    }

    const header = `已读取 ${positions.length} 个岗位 JD（目录：${jdDir}）`;
    const blocks = positions.map((p, i) => {
      const sep = '---';
      return [`## ${i + 1}. ${p.title}（${p.filename}）`, sep, p.content.trimEnd()].join('\n');
    });
    const textBody = blocks.length > 0 ? blocks.join('\n\n') : '（该目录下暂无 .md/.MD 岗位文件）';

    return [header, textBody].filter(Boolean).join('\n');
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error(`[boss-cli] list_open_positions error: ${message}`);
    throw new Error(`读取岗位 JD 失败：${message}`);
  }
}
