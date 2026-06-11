import assert from 'node:assert/strict';
import test from 'node:test';
import { buildRecruiterResumeInfoUrl } from './sync.js';

test('buildRecruiterResumeInfoUrl targets recruiter geek info endpoint with identifiers', () => {
  const url = new URL(buildRecruiterResumeInfoUrl({
    encryptGeekId: 'geek 001',
    encryptJobId: 'job/001',
    securityId: 'sec+001',
  }));

  assert.equal(url.origin, 'https://www.zhipin.com');
  assert.equal(url.pathname, '/wapi/zpjob/view/geek/info');
  assert.equal(url.searchParams.get('encryptGeekId'), 'geek 001');
  assert.equal(url.searchParams.get('encryptJobId'), 'job/001');
  assert.equal(url.searchParams.get('securityId'), 'sec+001');
});
