import { withBossSessionPage } from '../common/boss_session_page.js';
import { syncResumesOnPage } from '../resumes/sync.js';
import type { ResumeSyncCliOptions } from '../resumes/options.js';

export async function runResumes(options: ResumeSyncCliOptions): Promise<string> {
  try {
    return await withBossSessionPage((page) => syncResumesOnPage(page, options));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`在线简历同步失败：${message}`);
  }
}
