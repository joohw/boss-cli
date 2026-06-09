import type { NormalizedResumeData, NormalizedResumeSection, ResolvedResumeCandidate } from './types.js';

function normalizeWhitespace(input: string): string {
  return input.replace(/\r/g, '').replace(/\t/g, ' ').replace(/[ \u00a0]+/g, ' ').trim();
}

function splitParagraphs(rawText: string): string[] {
  return rawText
    .split(/\n{2,}/)
    .map((item) => normalizeWhitespace(item))
    .filter(Boolean);
}

function buildSections(paragraphs: string[]): NormalizedResumeSection[] {
  return paragraphs.map((paragraph, index) => {
    const lines = paragraph
      .split('\n')
      .map((line) => normalizeWhitespace(line))
      .filter(Boolean);
    if (lines.length === 0) {
      return {
        title: `Section ${index + 1}`,
        lines: [],
      };
    }
    if (lines.length > 1 && lines[0]!.length <= 32) {
      return {
        title: lines[0]!,
        lines: lines.slice(1),
      };
    }
    return {
      title: `Section ${index + 1}`,
      lines,
    };
  });
}

export function normalizeResumeFrameSnapshot(params: {
  candidate: ResolvedResumeCandidate;
  fetchedAt: string;
  resumeUrl: string;
  pageTitle: string;
  rawText: string;
}): NormalizedResumeData {
  const normalizedText = params.rawText
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  const paragraphs = splitParagraphs(normalizedText);
  return {
    source: 'c-resume-frame',
    fetchedAt: params.fetchedAt,
    resumeUrl: params.resumeUrl,
    pageTitle: normalizeWhitespace(params.pageTitle),
    candidateName: params.candidate.candidateName,
    jobName: params.candidate.jobName,
    identifiers: {
      encryptGeekId: params.candidate.encryptGeekId,
      encryptJobId: params.candidate.encryptJobId,
      securityId: params.candidate.securityId,
    },
    rawText: normalizedText,
    paragraphs,
    sections: buildSections(paragraphs),
  };
}

function collectReadableStrings(input: unknown, out: string[] = []): string[] {
  if (typeof input === 'string') {
    const value = normalizeWhitespace(input);
    if (value.length >= 2 && !/^https?:\/\//i.test(value)) {
      out.push(value);
    }
    return out;
  }
  if (Array.isArray(input)) {
    input.forEach((item) => collectReadableStrings(item, out));
    return out;
  }
  if (input && typeof input === 'object') {
    Object.values(input).forEach((value) => collectReadableStrings(value, out));
  }
  return out;
}

export function normalizeResumeApiPayload(params: {
  candidate: ResolvedResumeCandidate;
  fetchedAt: string;
  resumeUrl: string;
  pageTitle: string;
  payload: unknown;
}): NormalizedResumeData {
  const rawText = Array.from(new Set(collectReadableStrings(params.payload)))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  const paragraphs = splitParagraphs(rawText);
  return {
    source: 'recruiter-resume-api',
    fetchedAt: params.fetchedAt,
    resumeUrl: params.resumeUrl,
    pageTitle: normalizeWhitespace(params.pageTitle),
    candidateName: params.candidate.candidateName,
    jobName: params.candidate.jobName,
    identifiers: {
      encryptGeekId: params.candidate.encryptGeekId,
      encryptJobId: params.candidate.encryptJobId,
      securityId: params.candidate.securityId,
    },
    rawText,
    paragraphs,
    sections: buildSections(paragraphs),
  };
}
