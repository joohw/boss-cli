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
    search: false,
    coreRequirements: undefined,
    bonusRequirements: undefined,
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

test('normalizeResumeSyncCliOptions parses deep-search search requirements', () => {
  const options = normalizeResumeSyncCliOptions({
    rest: [],
    flags: new Set<string>(['search']),
    opts: { from: 'deep-search', job: 'Java', core: 'Java｜Spring | MySQL', bonus: '实习' },
  });

  assert.equal(options.search, true);
  assert.equal(options.jobKeyword, 'Java');
  assert.deepEqual(options.coreRequirements, ['Java', 'Spring', 'MySQL']);
  assert.deepEqual(options.bonusRequirements, ['实习']);
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

test('normalizeResumeSyncCliOptions rejects search outside deep-search', () => {
  assert.throws(
    () =>
      normalizeResumeSyncCliOptions({
        rest: [],
        flags: new Set<string>(['search']),
        opts: { from: 'recommend', job: 'Java' },
      }),
    /--search/,
  );
});

test('normalizeResumeSyncCliOptions rejects deep-search search without job', () => {
  assert.throws(
    () =>
      normalizeResumeSyncCliOptions({
        rest: [],
        flags: new Set<string>(['search']),
        opts: { from: 'deep-search' },
      }),
    /--job/,
  );
});

test('normalizeResumeSyncCliOptions rejects core without search', () => {
  assert.throws(
    () =>
      normalizeResumeSyncCliOptions({
        rest: [],
        flags: new Set<string>(),
        opts: { from: 'deep-search', core: 'Java' },
      }),
    /--core/,
  );
});
