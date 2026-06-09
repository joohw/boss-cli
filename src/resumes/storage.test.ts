import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { normalizeResumeFrameSnapshot } from './normalize.js';
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

test('persistResumeArtifacts writes raw, json and markdown files', async () => {
  const rootDir = await mkdtemp(path.join(tmpdir(), 'boss-cli-resumes-'));
  const candidate = buildCandidate();
  const resume = normalizeResumeFrameSnapshot({
    candidate,
    fetchedAt: '2026-06-09T00:00:00.000Z',
    resumeUrl: 'https://www.zhipin.com/web/frame/c-resume?encryptGeekId=geek-001',
    pageTitle: 'Resume Page',
    rawText: 'Summary\n\nPython\nDistributed Systems',
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
  };
  const markdown = await readFile(artifacts.resumeMarkdownPath!, 'utf8');
  const entry = await readExistingCandidateEntry(rootDir, candidate);

  assert.equal(rawResponse.ok, true);
  assert.equal(storedResume.candidateName, 'Alice Example');
  assert.match(markdown, /Alice Example/);
  assert.equal(entry?.status, 'downloaded');
});
