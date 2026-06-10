import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeResumeSyncCliOptions } from './options.js';

test('normalizeResumeSyncCliOptions parses recommend defaults', () => {
  const options = normalizeResumeSyncCliOptions({
    rest: [],
    flags: new Set<string>(),
    opts: { from: 'recommend' },
  });

  assert.deepEqual(options, {
    source: 'recommend',
    limit: 20,
    unreadOnly: false,
    jsonOutput: false,
    jobKeyword: undefined,
    rootDir: undefined,
  });
});

test('normalizeResumeSyncCliOptions parses json flag', () => {
  const options = normalizeResumeSyncCliOptions({
    rest: [],
    flags: new Set<string>(['json']),
    opts: { from: 'chat', limit: '3' },
  });

  assert.equal(options.jsonOutput, true);
  assert.equal(options.limit, 3);
});

test('normalizeResumeSyncCliOptions rejects invalid source', () => {
  assert.throws(
    () =>
      normalizeResumeSyncCliOptions({
        rest: [],
        flags: new Set<string>(),
        opts: { from: 'invalid' },
      }),
    /--from/,
  );
});

test('normalizeResumeSyncCliOptions rejects --job with chat', () => {
  assert.throws(
    () =>
      normalizeResumeSyncCliOptions({
        rest: [],
        flags: new Set<string>(),
        opts: { from: 'chat', job: 'python' },
      }),
    /--job/,
  );
});

test('normalizeResumeSyncCliOptions rejects --unread outside chat', () => {
  assert.throws(
    () =>
      normalizeResumeSyncCliOptions({
        rest: [],
        flags: new Set<string>(['unread']),
        opts: { from: 'recommend' },
      }),
    /--unread/,
  );
});

test('normalizeResumeSyncCliOptions rejects non-positive limit', () => {
  assert.throws(
    () =>
      normalizeResumeSyncCliOptions({
        rest: [],
        flags: new Set<string>(),
        opts: { from: 'chat', limit: '0' },
      }),
    /--limit/,
  );
});
