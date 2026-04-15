/**
 * 本 npm 包仅含一个 Agent Skill：`skills/boss-cli/` → 安装到 ~/.agents/skills/boss-cli/
 */
import { existsSync } from 'node:fs';
import { cp, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ensureAppDataLayout, getAgentSkillsDir } from '../config.js';

/** 包内唯一 skill 目录名（与文件夹一致） */
export const PACKAGE_SKILL_NAME = 'boss-cli';

/** 与 `dist/toolset/skill.js` 相对：包根目录下的 `skills/` */
export function bundledSkillsRoot(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  return join(here, '..', '..', 'skills');
}

function bundledSkillSourcePath(): string {
  return join(bundledSkillsRoot(), PACKAGE_SKILL_NAME);
}

export async function implSkillInstall(): Promise<string> {
  ensureAppDataLayout();
  const skillsRoot = getAgentSkillsDir();
  const src = bundledSkillSourcePath();
  if (!existsSync(join(src, 'SKILL.md'))) {
    throw new Error(`❌ 包内缺少 ${src}/SKILL.md（本包应自带唯一 skill）`);
  }
  const dest = join(skillsRoot, PACKAGE_SKILL_NAME);
  await rm(dest, { recursive: true, force: true }).catch(() => {});
  await cp(src, dest, { recursive: true });

  return [
    `已安装 Agent Skill「${PACKAGE_SKILL_NAME}」`,
    `目录: ${dest}`,
    '',
    '多数客户端已将 ~/.agents/skills 列为默认扫描路径；若未识别，请在该应用的 Skills 设置中指向上述目录。',
  ].join('\n');
}

export async function implSkillUninstall(): Promise<string> {
  ensureAppDataLayout();
  const dest = join(getAgentSkillsDir(), PACKAGE_SKILL_NAME);
  if (!existsSync(dest)) {
    throw new Error(`❌ 未安装「${PACKAGE_SKILL_NAME}」：${dest}`);
  }
  await rm(dest, { recursive: true, force: true });
  return `已移除「${PACKAGE_SKILL_NAME}」\n${dest}`;
}

/** `boss skill`：仅输出说明，不安装。 */
export function implSkillDescribe(): string {
  const dest = join(getAgentSkillsDir(), PACKAGE_SKILL_NAME);
  return [
    'boss-cli Agent Skill（本 npm 包唯一公开 Skill）',
    '',
    '用途：为 Claude / Cursor 等 Agent 提供说明，指导如何配合 `boss` CLI 操作 Boss 直聘（本机 Chrome/Edge + CDP、聊天、在线简历截图、可选百度 OCR 等）。目录结构与 Anthropic Agent Skills 一致（SKILL.md）。',
    '',
    `安装后的目标路径: ${dest}`,
    '',
    '命令:',
    '  boss skill           显示本说明（不写入磁盘）',
    '  boss skill install   将包内 skills/boss-cli/ 复制到上述路径',
    '  boss skill uninstall 删除该路径',
    '',
    '安装根目录默认 ~/.agents/skills，可用 BOSS_AGENT_SKILLS_DIR 设为绝对路径覆盖。',
  ].join('\n');
}

/**
 * `boss skill` 仅描述；`boss skill install` / `uninstall` 才改磁盘。
 */
export async function implSkillCli(tail: string[]): Promise<string> {
  if (tail.length === 0) {
    return implSkillDescribe();
  }
  const first = tail[0]?.trim().toLowerCase() ?? '';
  if (first === 'install') {
    if (tail.length > 1) {
      throw new Error('❌ 本包仅提供一个 skill，用法: boss skill install（不要附加参数）');
    }
    return implSkillInstall();
  }
  if (first === 'uninstall') {
    if (tail.length > 1) {
      throw new Error('❌ 用法: boss skill uninstall（不要附加参数）');
    }
    return implSkillUninstall();
  }
  throw new Error('❌ 用法: boss skill  |  boss skill install  |  boss skill uninstall');
}
