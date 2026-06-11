import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import path from 'node:path';
import { RESUME_SYNC_ROOT } from '../config.js';
import type {
  CandidateIndexEntry,
  JobIndexEntry,
  NormalizedResumeData,
  ResumeArtifacts,
  ResolvedResumeCandidate,
  ResumeSource,
} from './types.js';

type PersistResumeFilesParams = {
  rootDir?: string;
  source: ResumeSource;
  candidate: ResolvedResumeCandidate;
  rawResponse: unknown;
  resume: NormalizedResumeData;
};

function safeSegment(input: string): string {
  const normalized = input.replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_').trim();
  return normalized.length > 0 ? normalized.slice(0, 80) : 'unknown';
}

function nowIso(): string {
  return new Date().toISOString();
}

async function ensureDir(target: string): Promise<void> {
  await mkdir(target, { recursive: true });
}

async function readJsonFile<T>(target: string, fallbackValue: T): Promise<T> {
  try {
    const raw = await readFile(target, 'utf8');
    return JSON.parse(raw) as T;
  } catch {
    return fallbackValue;
  }
}

async function writeJsonFile(target: string, value: unknown): Promise<void> {
  await writeFile(target, JSON.stringify(value, null, 2), 'utf8');
}

function joinFields(...values: string[]): string {
  return values.filter(Boolean).join(' / ');
}

function pushSection(lines: string[], title: string, values: string[]): void {
  lines.push(`## ${title}`);
  lines.push('');
  const visible = values.map((item) => item.trim()).filter(Boolean);
  lines.push(...(visible.length > 0 ? visible : ['（空）']));
  lines.push('');
}

function renderReadableResumeMarkdown(resume: NormalizedResumeData): string {
  const lines: string[] = [
    `# ${resume.candidateName}`,
    '',
    `- 岗位: ${resume.jobName || '未知'}`,
    `- 简历地址: ${resume.resumeUrl}`,
    `- 同步时间: ${resume.fetchedAt}`,
    '',
  ];

  if (resume.source === 'recruiter-resume-api') {
    pushSection(lines, '基本信息', [
      joinFields(resume.basic.name, resume.basic.gender, resume.basic.age),
      joinFields(resume.basic.degree, resume.basic.workYears, resume.basic.activeStatus),
    ]);
    pushSection(lines, '个人简介', [resume.summary]);
    pushSection(
      lines,
      '求职期望',
      resume.expectationList.length > 0
        ? resume.expectationList.map((item) => joinFields(item.position, item.city, item.salary, item.industry))
        : [joinFields(resume.expectation.position, resume.expectation.salary, resume.expectation.city)],
    );
    pushSection(lines, '工作经历', resume.workExperience.flatMap((item) => [
      joinFields(item.company, item.position, item.department, joinFields(item.start, item.end), item.duration),
      item.responsibility,
      item.performance,
      item.keywords.length > 0 ? `关键词: ${item.keywords.join('、')}` : '',
    ]));
    pushSection(lines, '项目经历', resume.projectExperience.flatMap((item) => [
      joinFields(item.name, item.role, joinFields(item.start, item.end), item.duration),
      item.description,
      item.achievement,
    ]));
    pushSection(lines, '教育经历', resume.education.flatMap((item) => [
      joinFields(item.school, item.major, item.degree, joinFields(item.start, item.end)),
      item.majorRanking ? `专业排名: ${item.majorRanking}` : '',
      item.tags.length > 0 ? `标签: ${item.tags.join(' / ')}` : '',
      item.courseDescription ? `主修课程: ${item.courseDescription}` : '',
      item.educationDescription,
    ]));
    pushSection(lines, '资格证书', resume.certifications);
    pushSection(lines, '专业技能', resume.professionalSkills);
    pushSection(lines, '竞争力/亮点', resume.competitiveAnalysis);
    return lines.join('\n').trimEnd() + '\n';
  }

  for (const section of resume.sections) {
    pushSection(lines, section.title, section.lines);
  }
  if (resume.sections.length === 0 && resume.rawText) {
    pushSection(lines, '正文', [resume.rawText]);
  }
  return lines.join('\n').trimEnd() + '\n';
}

export function getResumeSyncRoot(rootDir?: string): string {
  const raw = rootDir?.trim();
  if (!raw) {
    return RESUME_SYNC_ROOT;
  }
  if (raw === '~') {
    return homedir();
  }
  if (raw.startsWith(`~${path.sep}`) || raw.startsWith('~/') || raw.startsWith('~\\')) {
    return path.join(homedir(), raw.slice(2));
  }
  return raw;
}

export async function persistResumeArtifacts(
  params: PersistResumeFilesParams,
): Promise<ResumeArtifacts> {
  const rootDir = getResumeSyncRoot(params.rootDir);
  const jobDir = path.join(
    rootDir,
    'jobs',
    `${safeSegment(params.candidate.encryptJobId)}_${safeSegment(params.candidate.jobName)}`,
  );
  const candidateDir = path.join(
    jobDir,
    'resumes',
    `${safeSegment(params.candidate.candidateName)}_${safeSegment(params.candidate.encryptGeekId)}`,
  );
  await ensureDir(candidateDir);

  const rawResponsePath = path.join(candidateDir, 'raw_response.json');
  const resumeJsonPath = path.join(candidateDir, 'resume.json');
  const resumeMarkdownPath = path.join(candidateDir, 'resume.md');

  await writeJsonFile(rawResponsePath, params.rawResponse);
  await writeJsonFile(resumeJsonPath, params.resume);
  await writeFile(resumeMarkdownPath, renderReadableResumeMarkdown(params.resume), 'utf8');

  const jobFile = path.join(jobDir, 'job.json');
  const jobIndexPath = path.join(rootDir, 'job_index.json');
  const candidateIndexPath = path.join(jobDir, 'candidate_index.json');
  const jobs = await readJsonFile<JobIndexEntry[]>(jobIndexPath, []);
  const nextJobEntry: JobIndexEntry = {
    jobId: params.candidate.encryptJobId,
    jobName: params.candidate.jobName,
    updatedAt: nowIso(),
    source: params.source,
    jobDir,
    candidateIndexPath,
  };
  const mergedJobs = jobs.filter((item) => item.jobId !== nextJobEntry.jobId);
  mergedJobs.push(nextJobEntry);
  await ensureDir(jobDir);
  await writeJsonFile(jobFile, {
    jobId: params.candidate.encryptJobId,
    jobName: params.candidate.jobName,
    source: params.source,
    updatedAt: nextJobEntry.updatedAt,
  });
  await writeJsonFile(jobIndexPath, mergedJobs);

  const candidates = await readJsonFile<CandidateIndexEntry[]>(candidateIndexPath, []);
  const nextCandidateEntry: CandidateIndexEntry = {
    candidateId: params.candidate.encryptGeekId,
    candidateName: params.candidate.candidateName,
    jobId: params.candidate.encryptJobId,
    jobName: params.candidate.jobName,
    source: params.candidate.source,
    updatedAt: nowIso(),
    status: 'downloaded',
    message: 'resume synced',
    securityId: params.candidate.securityId,
    visibleGeekId: params.candidate.visibleGeekId,
    sourceMeta: params.candidate.sourceMeta,
    artifacts: {
      candidateDir,
      rawResponsePath,
      resumeJsonPath,
      resumeMarkdownPath,
    },
  };
  const mergedCandidates = candidates.filter((item) => item.candidateId !== nextCandidateEntry.candidateId);
  mergedCandidates.push(nextCandidateEntry);
  await writeJsonFile(candidateIndexPath, mergedCandidates);

  return {
    candidateDir,
    rawResponsePath,
    resumeJsonPath,
    resumeMarkdownPath,
  };
}

export async function readExistingCandidateEntry(
  rootDir: string | undefined,
  candidate: ResolvedResumeCandidate,
): Promise<CandidateIndexEntry | null> {
  const root = getResumeSyncRoot(rootDir);
  const candidateIndexPath = path.join(
    root,
    'jobs',
    `${safeSegment(candidate.encryptJobId)}_${safeSegment(candidate.jobName)}`,
    'candidate_index.json',
  );
  const entries = await readJsonFile<CandidateIndexEntry[]>(candidateIndexPath, []);
  return entries.find((item) => item.candidateId === candidate.encryptGeekId) ?? null;
}

export async function upsertCandidateFailureEntry(params: {
  rootDir?: string;
  candidateName: string;
  jobName: string;
  source: ResumeSource;
  sourceMeta: Record<string, string | number | boolean | null>;
  identifiers?: {
    encryptGeekId?: string;
    encryptJobId?: string;
    securityId?: string;
    visibleGeekId?: string;
  };
  status: 'missing_identifiers' | 'download_failed';
  message: string;
}): Promise<void> {
  const rootDir = getResumeSyncRoot(params.rootDir);
  const jobId = params.identifiers?.encryptJobId || 'unknown-job';
  const candidateId = params.identifiers?.encryptGeekId || `missing-${safeSegment(params.candidateName)}`;
  const jobDir = path.join(
    rootDir,
    'jobs',
    `${safeSegment(jobId)}_${safeSegment(params.jobName || 'unknown-job')}`,
  );
  const candidateIndexPath = path.join(jobDir, 'candidate_index.json');
  await ensureDir(jobDir);
  const entries = await readJsonFile<CandidateIndexEntry[]>(candidateIndexPath, []);
  const nextEntry: CandidateIndexEntry = {
    candidateId,
    candidateName: params.candidateName,
    jobId,
    jobName: params.jobName,
    source: params.source,
    updatedAt: nowIso(),
    status: params.status,
    message: params.message,
    securityId: params.identifiers?.securityId,
    visibleGeekId: params.identifiers?.visibleGeekId,
    sourceMeta: params.sourceMeta,
  };
  const mergedEntries = entries.filter((item) => item.candidateId !== nextEntry.candidateId);
  mergedEntries.push(nextEntry);
  await writeJsonFile(candidateIndexPath, mergedEntries);
}
