import assert from 'node:assert/strict';
import test from 'node:test';
import {
  collectIdentifierHits,
  collectIdentifierHitsFromUrl,
  resolveIdentifiers,
} from './identifiers.js';

test('collectIdentifierHits extracts recommend payload identifiers', () => {
  const hits = collectIdentifierHits({
    zpData: {
      items: [
        {
          encryptGeekId: 'geek-recommend',
          encryptJobId: 'job-recommend',
          securityId: 'sec-recommend',
        },
      ],
    },
  });

  const resolved = resolveIdentifiers(hits);
  assert.equal(resolved?.encryptGeekId, 'geek-recommend');
  assert.equal(resolved?.encryptJobId, 'job-recommend');
  assert.equal(resolved?.securityId, 'sec-recommend');
});

test('collectIdentifierHits extracts deep-search payload identifiers', () => {
  const hits = collectIdentifierHits({
    data: {
      cards: [
        {
          geekInfo: {
            encryptUid: 'geek-deep-search',
            security_id: 'sec-deep-search',
          },
          jobCard: {
            encrypt_job_id: 'job-deep-search',
          },
        },
      ],
    },
  });

  const resolved = resolveIdentifiers(hits);
  assert.equal(resolved?.encryptGeekId, 'geek-deep-search');
  assert.equal(resolved?.encryptJobId, 'job-deep-search');
  assert.equal(resolved?.securityId, 'sec-deep-search');
});

test('collectIdentifierHits extracts chat detail identifiers', () => {
  const hits = collectIdentifierHits({
    detail: {
      friendId: '123456',
      geekId: 'visible-geek',
      securityId: 'sec-chat',
      encryptJobId: 'job-chat',
      encryptGeekId: 'geek-chat',
    },
  });

  const resolved = resolveIdentifiers(hits, 'visible-geek');
  assert.equal(resolved?.encryptGeekId, 'geek-chat');
  assert.equal(resolved?.encryptJobId, 'job-chat');
  assert.equal(resolved?.securityId, 'sec-chat');
  assert.equal(resolved?.visibleGeekId, 'visible-geek');
  assert.equal(resolved?.friendId, '123456');
});

test('collectIdentifierHitsFromUrl reads identifiers from resume url', () => {
  const hits = collectIdentifierHitsFromUrl(
    'https://www.zhipin.com/web/frame/c-resume?encryptGeekId=geek-url&encryptJobId=job-url&securityId=sec-url',
  );

  const resolved = resolveIdentifiers(hits);
  assert.equal(resolved?.encryptGeekId, 'geek-url');
  assert.equal(resolved?.encryptJobId, 'job-url');
  assert.equal(resolved?.securityId, 'sec-url');
});

test('resolveIdentifiers returns null when fields are incomplete', () => {
  const hits = collectIdentifierHits({
    data: {
      geekInfo: {
        encryptGeekId: 'only-geek',
      },
    },
  });

  assert.equal(resolveIdentifiers(hits), null);
});
