import type { ResumeSource } from './types.js';

export type ResumeSyncCliOptions = {
  source: ResumeSource;
  limit: number;
  unreadOnly: boolean;
  jsonOutput: boolean;
  search: boolean;
  coreRequirements?: string[];
  bonusRequirements?: string[];
  jobKeyword?: string;
  rootDir?: string;
};

export type ParsedCliTail = {
  rest: string[];
  flags: Set<string>;
  opts: Record<string, string>;
};

function readPositiveInt(raw: string | undefined, fallbackValue: number): number {
  if (!raw) {
    return fallbackValue;
  }
  const value = Number.parseInt(raw.trim(), 10);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error('❌ resumes 的 --limit 必须是正整数。');
  }
  return value;
}

function parseResumeSource(raw: string | undefined): ResumeSource {
  const value = (raw ?? '').trim().toLowerCase();
  if (value === 'chat' || value === 'recommend' || value === 'deep-search') {
    return value;
  }
  throw new Error('❌ 用法: resumes --from <chat|recommend|deep-search> [--job <岗位关键字>] [--limit <数量>] [--unread] [--root <目录>] [--json]');
}

export function parseRequirementList(raw: string | undefined): string[] | undefined {
  if (raw === undefined) {
    return undefined;
  }
  const items = raw
    .split(/[|｜]/)
    .map((item) => item.trim())
    .filter(Boolean);
  if (items.length === 0) {
    throw new Error('❌ resumes 的 --core / --bonus 不能为空。');
  }
  return items;
}

export function normalizeResumeSyncCliOptions(parsed: ParsedCliTail): ResumeSyncCliOptions {
  const unknownShortFlags = Array.from(parsed.flags).filter((flag) => flag !== 'unread' && flag !== 'json' && flag !== 'search');
  if (unknownShortFlags.length > 0) {
    throw new Error(`❌ resumes 不支持 flag: -${unknownShortFlags.join(', -')}`);
  }

  const source = parseResumeSource(parsed.opts.from);
  const limit = readPositiveInt(parsed.opts.limit, 20);
  const unreadOnly = parsed.flags.has('unread');
  const jsonOutput = parsed.flags.has('json');
  const search = parsed.flags.has('search');
  const jobKeyword = parsed.opts.job?.trim();
  const rootDir = parsed.opts.root?.trim();
  const coreRequirements = parseRequirementList(parsed.opts.core);
  const bonusRequirements = parseRequirementList(parsed.opts.bonus);
  const positional = parsed.rest.map((item) => item.trim()).filter(Boolean);

  if (positional.length > 0) {
    throw new Error('❌ resumes 不接受位置参数，请使用 --from / --job / --limit / --unread / --root / --json。');
  }
  if (source === 'chat' && jobKeyword) {
    throw new Error('❌ resumes --from chat 不支持 --job。');
  }
  if (source !== 'chat' && unreadOnly) {
    throw new Error('❌ 只有 resumes --from chat 支持 --unread。');
  }
  if (search && source !== 'deep-search') {
    throw new Error('❌ resumes --search 仅支持 --from deep-search。');
  }
  if (search && !jobKeyword) {
    throw new Error('❌ resumes --from deep-search --search 必须同时指定 --job。');
  }
  if ((coreRequirements || bonusRequirements) && (source !== 'deep-search' || !search)) {
    throw new Error('❌ resumes 的 --core / --bonus 仅支持与 --from deep-search --search 一起使用。');
  }
  if (source === 'deep-search' && jobKeyword && !search) {
    throw new Error('❌ resumes --from deep-search 使用 --job 时必须显式添加 --search，避免误触发 BOSS 立即匹配。');
  }

  const supportedKeys = new Set(['from', 'job', 'limit', 'root', 'core', 'bonus']);
  const extraKeys = Object.keys(parsed.opts).filter((key) => !supportedKeys.has(key));
  if (extraKeys.length > 0) {
    throw new Error(`❌ resumes 不支持参数: --${extraKeys.join(', --')}`);
  }

  return {
    source,
    limit,
    unreadOnly,
    jsonOutput,
    search,
    coreRequirements,
    bonusRequirements,
    jobKeyword: jobKeyword || undefined,
    rootDir: rootDir || undefined,
  };
}
