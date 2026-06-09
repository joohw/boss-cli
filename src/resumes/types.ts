export type ResumeSource = 'chat' | 'recommend' | 'deep-search';

export type ResumeSyncStatus =
  | 'downloaded'
  | 'skipped_existing'
  | 'missing_identifiers'
  | 'download_failed';

export type SourceMetaValue = string | number | boolean | null;

export type SourceCandidate = {
  source: ResumeSource;
  name: string;
  jobLabel: string;
  visibleGeekId?: string;
  sourceMeta: Record<string, SourceMetaValue>;
};

export type ResolvedResumeCandidate = {
  candidateName: string;
  jobName: string;
  encryptGeekId: string;
  encryptJobId: string;
  securityId: string;
  visibleGeekId?: string;
  source: ResumeSource;
  sourceMeta: Record<string, SourceMetaValue>;
};

export type ResumeArtifacts = {
  candidateDir: string;
  rawResponsePath?: string;
  resumeJsonPath?: string;
  resumeMarkdownPath?: string;
};

export type ResumeSyncResult = {
  status: ResumeSyncStatus;
  message: string;
  artifacts?: ResumeArtifacts;
};

export type ResumeIdentifiers = {
  encryptGeekId?: string;
  encryptJobId?: string;
  securityId?: string;
  visibleGeekId?: string;
  friendId?: string;
};

export type CandidateIndexEntry = {
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobName: string;
  source: ResumeSource;
  updatedAt: string;
  status: ResumeSyncStatus;
  message: string;
  securityId?: string;
  visibleGeekId?: string;
  sourceMeta: Record<string, SourceMetaValue>;
  artifacts?: ResumeArtifacts;
};

export type JobIndexEntry = {
  jobId: string;
  jobName: string;
  updatedAt: string;
  source: ResumeSource;
  jobDir: string;
  candidateIndexPath: string;
};

export type NormalizedResumeSection = {
  title: string;
  lines: string[];
};

export type NormalizedResumeData = {
  source: 'c-resume-frame' | 'recruiter-resume-api';
  fetchedAt: string;
  resumeUrl: string;
  pageTitle: string;
  candidateName: string;
  jobName: string;
  identifiers: {
    encryptGeekId: string;
    encryptJobId: string;
    securityId: string;
  };
  rawText: string;
  paragraphs: string[];
  sections: NormalizedResumeSection[];
};
