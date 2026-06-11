import assert from 'node:assert/strict';
import test from 'node:test';
import {
  extractGeekDetailInfo,
  normalizeRecruiterResumePayload,
} from './normalize.js';
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

test('normalizeRecruiterResumePayload parses recruiter resume fields into structured data', () => {
  const resume = normalizeRecruiterResumePayload({
    candidate: buildCandidate(),
    fetchedAt: '2026-06-09T00:00:00.000Z',
    resumeUrl: 'https://www.zhipin.com/web/frame/c-resume?encryptGeekId=geek-001',
    pageTitle: 'Resume Page',
    payload: {
      zpData: {
        geekDetailInfo: {
          geekBaseInfo: {
            name: 'Alice',
            gender: 2,
            ageDesc: '28岁',
            degreeCategory: '本科',
            workYearDesc: '5年',
            activeTimeDesc: '刚刚活跃',
            large: 'https://example.com/avatar.jpg',
            userDescription: 'Experienced backend engineer.',
          },
          showExpectPosition: null,
          geekExpPosList: [
            {
              positionName: '后端工程师',
              locationName: '上海',
              salaryDesc: '20-30K',
              industryDesc: 'SaaS',
            },
            {
              positionName: 'Java工程师',
              locationName: '杭州',
              salaryDesc: '18-25K',
              industryDesc: '企业服务',
            },
          ],
          geekWorkExpList: [
            {
              company: 'Acme',
              positionName: 'Senior Engineer',
              department: 'Platform',
              startYearMonStr: '2021.01',
              endYearMonStr: '至今',
              workYearDesc: '3年',
              responsibility: 'Built APIs',
              workPerformance: 'Reduced latency',
              workEmphasis: 'Node.js#&#TypeScript',
            },
          ],
          geekProjExpList: [
            {
              name: 'Resume Sync',
              roleName: 'Owner',
              startDateDesc: '2024.01',
              endDateDesc: '2024.06',
              workYearDesc: '6个月',
              projectDescription: 'Collected structured resumes',
              performance: 'Improved readability',
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
          geekCertificationList: [
            { certName: 'AWS SAA' },
          ],
          professionalSkill: '熟悉 Java\n熟悉 Spring Boot',
          jobCompetitive: {
            tips: [
              { content: '稳定性经验丰富' },
            ],
          },
        },
      },
    },
  });

  assert.equal(resume.source, 'recruiter-resume-api');
  assert.equal(resume.basic.name, 'Alice');
  assert.equal(resume.basic.gender, '女');
  assert.equal(resume.summary, 'Experienced backend engineer.');
  assert.equal(resume.expectation.position, '后端工程师');
  assert.equal(resume.expectation.city, '上海');
  assert.deepEqual(resume.expectationList, [
    { position: '后端工程师', city: '上海', salary: '20-30K', industry: 'SaaS' },
    { position: 'Java工程师', city: '杭州', salary: '18-25K', industry: '企业服务' },
  ]);
  assert.deepEqual(resume.workExperience[0]?.keywords, ['Node.js', 'TypeScript']);
  assert.equal(resume.projectExperience[0]?.name, 'Resume Sync');
  assert.equal(resume.education[0]?.degree, '本科');
  assert.equal(resume.education[0]?.start, '2015');
  assert.equal(resume.education[0]?.end, '2019');
  assert.equal(resume.education[0]?.majorRanking, '专业前10%');
  assert.equal(resume.education[0]?.courseDescription, 'Data Structures');
  assert.equal(resume.education[0]?.educationDescription, 'Exchange semester abroad');
  assert.deepEqual(resume.education[0]?.tags, ['211院校', '硕士推免资格']);
  assert.deepEqual(resume.certifications, ['AWS SAA']);
  assert.deepEqual(resume.professionalSkills, ['熟悉 Java', '熟悉 Spring Boot']);
  assert.deepEqual(resume.competitiveAnalysis, ['稳定性经验丰富']);
  assert.match(resume.rawText, /个人简介/);
  assert.match(resume.rawText, /求职期望/);
  assert.match(resume.rawText, /专业技能/);
});

test('normalizeRecruiterResumePayload prefers showExpectPosition when present', () => {
  const resume = normalizeRecruiterResumePayload({
    candidate: buildCandidate(),
    fetchedAt: '2026-06-09T00:00:00.000Z',
    resumeUrl: 'https://www.zhipin.com/web/frame/c-resume?encryptGeekId=geek-001',
    pageTitle: '',
    payload: {
      zpData: {
        geekDetailInfo: {
          showExpectPosition: {
            positionName: '平台工程师',
            salaryDesc: '25-35K',
            locationName: '北京',
          },
          geekExpPosList: [
            {
              positionName: '后端工程师',
              locationName: '上海',
              salaryDesc: '20-30K',
              industryDesc: 'SaaS',
            },
          ],
        },
      },
    },
  });

  assert.equal(resume.expectation.position, '平台工程师');
  assert.equal(resume.expectation.salary, '25-35K');
  assert.equal(resume.expectation.city, '北京');
  assert.equal(resume.expectationList[0]?.position, '后端工程师');
});

test('normalizeRecruiterResumePayload keeps missing fields empty without throwing', () => {
  const resume = normalizeRecruiterResumePayload({
    candidate: buildCandidate(),
    fetchedAt: '2026-06-09T00:00:00.000Z',
    resumeUrl: 'https://www.zhipin.com/web/frame/c-resume?encryptGeekId=geek-001',
    pageTitle: '',
    payload: {
      zpData: {
        geekDetailInfo: {},
      },
    },
  });

  assert.equal(resume.basic.name, '');
  assert.equal(resume.summary, '');
  assert.equal(resume.expectation.position, '');
  assert.deepEqual(resume.expectationList, []);
  assert.deepEqual(resume.workExperience, []);
  assert.deepEqual(resume.projectExperience, []);
  assert.deepEqual(resume.education, []);
  assert.deepEqual(resume.certifications, []);
  assert.deepEqual(resume.professionalSkills, []);
  assert.deepEqual(resume.competitiveAnalysis, []);
});

test('extractGeekDetailInfo returns null when recruiter payload is missing geekDetailInfo', () => {
  assert.equal(extractGeekDetailInfo({ zpData: {} }), null);
});
