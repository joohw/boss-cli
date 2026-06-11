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

function asRecord(input: unknown): Record<string, unknown> {
  return input && typeof input === 'object' && !Array.isArray(input) ? input as Record<string, unknown> : {};
}

function asArray(input: unknown): unknown[] {
  return Array.isArray(input) ? input : [];
}

function safeString(input: unknown): string {
  if (input === null || input === undefined) {
    return '';
  }
  return normalizeWhitespace(String(input));
}

function splitKeywords(input: unknown): string[] {
  const value = safeString(input);
  return value ? value.split('#&#').map((item) => normalizeWhitespace(item)).filter(Boolean) : [];
}

function splitLines(input: unknown): string[] {
  return safeString(input)
    .split('\n')
    .map((item) => normalizeWhitespace(item))
    .filter(Boolean);
}

function joinFields(...values: string[]): string {
  return values.filter(Boolean).join(' / ');
}

function section(title: string, lines: string[]): NormalizedResumeSection {
  return {
    title,
    lines: lines.map((line) => normalizeWhitespace(line)).filter(Boolean),
  };
}

function emptyStructuredFields(): Pick<
  NormalizedResumeData,
  | 'basic'
  | 'summary'
  | 'expectation'
  | 'expectationList'
  | 'workExperience'
  | 'projectExperience'
  | 'education'
  | 'certifications'
  | 'professionalSkills'
  | 'competitiveAnalysis'
> {
  return {
    basic: {
      name: '',
      gender: '',
      age: '',
      degree: '',
      workYears: '',
      activeStatus: '',
      avatar: '',
    },
    summary: '',
    expectation: {
      position: '',
      salary: '',
      city: '',
    },
    expectationList: [],
    workExperience: [],
    projectExperience: [],
    education: [],
    certifications: [],
    professionalSkills: [],
    competitiveAnalysis: [],
  };
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
    ...emptyStructuredFields(),
    rawText: normalizedText,
    paragraphs,
    sections: buildSections(paragraphs),
  };
}

export function extractGeekDetailInfo(payload: unknown): Record<string, unknown> | null {
  const root = asRecord(payload);
  const data = asRecord(root.zpData ?? root.data ?? payload);
  const detail = data.geekDetailInfo;
  if (!detail || typeof detail !== 'object' || Array.isArray(detail)) {
    return null;
  }
  return detail as Record<string, unknown>;
}

function buildStructuredSections(
  resume: Pick<
    NormalizedResumeData,
    | 'basic'
    | 'summary'
    | 'expectation'
    | 'expectationList'
    | 'workExperience'
    | 'projectExperience'
    | 'education'
    | 'certifications'
    | 'professionalSkills'
    | 'competitiveAnalysis'
  >,
): NormalizedResumeSection[] {
  const basicLines = [
    joinFields(resume.basic.name, resume.basic.gender, resume.basic.age),
    joinFields(resume.basic.degree, resume.basic.workYears, resume.basic.activeStatus),
  ];
  const expectationLines =
    resume.expectationList.length > 0
      ? resume.expectationList.map((item) => joinFields(item.position, item.city, item.salary, item.industry))
      : [joinFields(resume.expectation.position, resume.expectation.salary, resume.expectation.city)];
  const workLines = resume.workExperience.flatMap((item) => [
    joinFields(item.company, item.position, item.department, joinFields(item.start, item.end), item.duration),
    item.responsibility,
    item.performance,
    item.keywords.length > 0 ? `Keywords: ${item.keywords.join(', ')}` : '',
  ]);
  const projectLines = resume.projectExperience.flatMap((item) => [
    joinFields(item.name, item.role, joinFields(item.start, item.end), item.duration),
    item.description,
    item.achievement,
  ]);
  const educationLines = resume.education.flatMap((item) => [
    joinFields(item.school, item.major, item.degree, joinFields(item.start, item.end)),
    item.majorRanking ? `专业排名: ${item.majorRanking}` : '',
    item.tags.length > 0 ? `标签: ${item.tags.join(' / ')}` : '',
    item.courseDescription ? `主修课程: ${item.courseDescription}` : '',
    item.educationDescription,
  ]);
  return [
    section('基本信息', basicLines),
    section('个人简介', resume.summary ? [resume.summary] : []),
    section('求职期望', expectationLines),
    section('工作经历', workLines),
    section('项目经历', projectLines),
    section('教育经历', educationLines),
    section('资格证书', resume.certifications),
    section('专业技能', resume.professionalSkills),
    section('竞争力/亮点', resume.competitiveAnalysis),
  ];
}

export function normalizeRecruiterResumePayload(params: {
  candidate: ResolvedResumeCandidate;
  fetchedAt: string;
  resumeUrl: string;
  pageTitle: string;
  payload: unknown;
}): NormalizedResumeData {
  const info = extractGeekDetailInfo(params.payload);
  if (!info) {
    throw new Error(`候选人 ${params.candidate.candidateName} 的 recruiter 简历响应缺少 zpData.geekDetailInfo。`);
  }

  const base = asRecord(info.geekBaseInfo);
  const showExpectation = asRecord(info.showExpectPosition);
  const expectationList = asArray(info.geekExpPosList).map((item) => {
    const record = asRecord(item);
    return {
      position: safeString(record.positionName),
      city: safeString(record.locationName),
      salary: safeString(record.salaryDesc),
      industry: safeString(record.industryDesc),
    };
  });
  const primaryExpectation = expectationList[0] ?? {
    position: '',
    city: '',
    salary: '',
    industry: '',
  };

  const parsed = {
    basic: {
      name: safeString(base.name),
      gender: base.gender === 1 ? '男' : base.gender === 2 ? '女' : '',
      age: safeString(base.ageDesc),
      degree: safeString(base.degreeCategory),
      workYears: safeString(base.workYearDesc),
      activeStatus: safeString(base.activeTimeDesc),
      avatar: safeString(base.large),
    },
    summary: safeString(base.userDescription),
    expectation: {
      position: safeString(showExpectation.positionName) || primaryExpectation.position,
      salary: safeString(showExpectation.salaryDesc) || primaryExpectation.salary,
      city: safeString(showExpectation.locationName) || primaryExpectation.city,
    },
    expectationList,
    workExperience: asArray(info.geekWorkExpList).map((item) => {
      const record = asRecord(item);
      return {
        company: safeString(record.company),
        position: safeString(record.positionName),
        department: safeString(record.department),
        start: safeString(record.startYearMonStr),
        end: safeString(record.endYearMonStr),
        duration: safeString(record.workYearDesc),
        responsibility: safeString(record.responsibility),
        performance: safeString(record.workPerformance),
        keywords: splitKeywords(record.workEmphasis),
      };
    }),
    projectExperience: asArray(info.geekProjExpList).map((item) => {
      const record = asRecord(item);
      return {
        name: safeString(record.name),
        role: safeString(record.roleName),
        start: safeString(record.startDateDesc),
        end: safeString(record.endDateDesc),
        duration: safeString(record.workYearDesc),
        description: safeString(record.projectDescription),
        achievement: safeString(record.performance),
      };
    }),
    education: asArray(info.geekEduExpList).map((item) => {
      const record = asRecord(item);
      return {
        school: safeString(record.school),
        major: safeString(record.major),
        degree: safeString(record.degreeDesc) || safeString(record.degreeName),
        start: safeString(record.startYearMonStr) || safeString(record.startDateDesc),
        end: safeString(record.endYearMonStr) || safeString(record.endDateDesc),
        degreeName: safeString(record.degreeName),
        startDateDesc: safeString(record.startDateDesc),
        endDateDesc: safeString(record.endDateDesc),
        majorRanking: safeString(record.majorRankingDesc),
        courseDescription: safeString(record.courseDesc),
        educationDescription: safeString(record.eduDescription),
        tags: asArray(record.tags).map((entry) => safeString(entry)).filter(Boolean),
      };
    }),
    certifications: asArray(info.geekCertificationList)
      .map((item) => safeString(asRecord(item).certName))
      .filter(Boolean),
    professionalSkills: splitLines(info.professionalSkill),
    competitiveAnalysis: asArray(asRecord(info.jobCompetitive).tips)
      .map((item) => safeString(asRecord(item).content))
      .filter(Boolean),
  };

  const sections = buildStructuredSections(parsed);
  const rawText = sections
    .map((item) => [`# ${item.title}`, ...item.lines].filter(Boolean).join('\n'))
    .filter(Boolean)
    .join('\n\n')
    .trim();

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
    ...parsed,
    rawText,
    paragraphs: splitParagraphs(rawText),
    sections,
  };
}
