import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { normalizeRecruiterResumePayload } from './normalize.js';
import { getResumeSyncRoot, persistResumeArtifacts, readExistingCandidateEntry } from './storage.js';
import type { ResolvedResumeCandidate } from './types.js';

function buildCandidate(): ResolvedResumeCandidate {
  return {
    candidateName: 'Alice Example',
    jobName: 'Backend Engineer',
    encryptGeekId: 'geek-001',
    encryptJobId: 'job-001',
    securityId: 'sec-001',
    source: 'recommend',
    sourceMeta: { listIndex: 0 },
  };
}

test('getResumeSyncRoot expands home shorthand', () => {
  const expanded = getResumeSyncRoot('~/boss-resumes');
  assert.ok(expanded.includes('boss-resumes'));
  assert.notEqual(expanded, '~/boss-resumes');
});

test('persistResumeArtifacts writes raw, json and structured markdown files', async () => {
  const rootDir = await mkdtemp(path.join(tmpdir(), 'boss-cli-resumes-'));
  const candidate = buildCandidate();
  const resume = normalizeRecruiterResumePayload({
    candidate,
    fetchedAt: '2026-06-09T00:00:00.000Z',
    resumeUrl: 'https://www.zhipin.com/web/frame/c-resume?encryptGeekId=geek-001',
    pageTitle: 'Resume Page',
    payload: {
      zpData: {
        geekDetailInfo: {
          geekBaseInfo: {
            name: 'Alice Example',
            gender: 2,
            ageDesc: '28岁',
            degreeCategory: '本科',
            workYearDesc: '5年',
            userDescription: 'Built backend services at scale.',
          },
          geekExpPosList: [
            {
              positionName: 'Backend Engineer',
              locationName: 'Shanghai',
              salaryDesc: '20-30K',
              industryDesc: 'SaaS',
            },
            {
              positionName: 'Platform Engineer',
              locationName: 'Hangzhou',
              salaryDesc: '25-35K',
              industryDesc: 'Cloud',
            },
          ],
          geekWorkExpList: [
            {
              company: 'Acme',
              positionName: 'Engineer',
              responsibility: 'Built Python services',
            },
          ],
          geekEduExpList: [
            {
              school: 'Example University',
              major: 'Computer Science',
              degreeName: '本科',
              startDateDesc: '2015',
              endDateDesc: '2019',
              majorRankingDesc: '专业前10%',
              courseDesc: 'Data Structures',
              eduDescription: 'Exchange semester abroad',
              tags: ['211院校', '硕士推免资格'],
            },
          ],
          professionalSkill: '熟悉 Java\n熟悉 Spring Boot',
        },
      },
    },
  });

  const artifacts = await persistResumeArtifacts({
    rootDir,
    source: candidate.source,
    candidate,
    rawResponse: { ok: true, value: 1 },
    resume,
  });

  assert.ok(artifacts.rawResponsePath);
  assert.ok(artifacts.resumeJsonPath);
  assert.ok(artifacts.resumeMarkdownPath);

  const rawResponse = JSON.parse(await readFile(artifacts.rawResponsePath!, 'utf8')) as { ok: boolean };
  const storedResume = JSON.parse(await readFile(artifacts.resumeJsonPath!, 'utf8')) as {
    candidateName: string;
    source: string;
    summary: string;
    expectationList: Array<{ position: string }>;
  };
  const markdown = await readFile(artifacts.resumeMarkdownPath!, 'utf8');
  const entry = await readExistingCandidateEntry(rootDir, candidate);

  assert.equal(rawResponse.ok, true);
  assert.equal(storedResume.candidateName, 'Alice Example');
  assert.equal(storedResume.source, 'recruiter-resume-api');
  assert.equal(storedResume.summary, 'Built backend services at scale.');
  assert.equal(storedResume.expectationList[1]?.position, 'Platform Engineer');
  assert.match(markdown, /Alice Example/);
  assert.match(markdown, /岗位: Backend Engineer/);
  assert.match(markdown, /简历地址: https:\/\/www\.zhipin\.com\/web\/frame\/c-resume/);
  assert.match(markdown, /同步时间: 2026-06-09T00:00:00.000Z/);
  assert.match(markdown, /## 个人简介/);
  assert.match(markdown, /Built backend services at scale\./);
  assert.match(markdown, /## 求职期望/);
  assert.match(markdown, /Backend Engineer \/ Shanghai \/ 20-30K \/ SaaS/);
  assert.match(markdown, /Platform Engineer \/ Hangzhou \/ 25-35K \/ Cloud/);
  assert.match(markdown, /## 教育经历/);
  assert.match(markdown, /专业排名: 专业前10%/);
  assert.match(markdown, /标签: 211院校 \/ 硕士推免资格/);
  assert.match(markdown, /主修课程: Data Structures/);
  assert.match(markdown, /Exchange semester abroad/);
  assert.match(markdown, /## 专业技能/);
  assert.match(markdown, /熟悉 Spring Boot/);
  assert.equal(entry?.status, 'downloaded');
});
