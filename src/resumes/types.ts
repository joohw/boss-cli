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

export type NormalizedResumeBasic = {
  name: string;
  gender: string;
  age: string;
  degree: string;
  workYears: string;
  activeStatus: string;
  avatar: string;
};

export type NormalizedResumeExpectation = {
  position: string;
  salary: string;
  city: string;
};

export type NormalizedResumeExpectationItem = {
  position: string;
  city: string;
  salary: string;
  industry: string;
};

export type NormalizedResumeWorkExperience = {
  company: string;
  position: string;
  department: string;
  start: string;
  end: string;
  duration: string;
  responsibility: string;
  performance: string;
  keywords: string[];
};

export type NormalizedResumeProjectExperience = {
  name: string;
  role: string;
  start: string;
  end: string;
  duration: string;
  description: string;
  achievement: string;
};

export type NormalizedResumeEducation = {
  school: string;
  major: string;
  degree: string;
  start: string;
  end: string;
  degreeName: string;
  startDateDesc: string;
  endDateDesc: string;
  majorRanking: string;
  courseDescription: string;
  educationDescription: string;
  tags: string[];
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
  basic: NormalizedResumeBasic;
  summary: string;
  expectation: NormalizedResumeExpectation;
  expectationList: NormalizedResumeExpectationItem[];
  workExperience: NormalizedResumeWorkExperience[];
  projectExperience: NormalizedResumeProjectExperience[];
  education: NormalizedResumeEducation[];
  certifications: string[];
  professionalSkills: string[];
  competitiveAnalysis: string[];
  rawText: string;
  paragraphs: string[];
  sections: NormalizedResumeSection[];
};
