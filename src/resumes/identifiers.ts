import type { ResumeIdentifiers } from './types.js';

type IdentifierHit = ResumeIdentifiers & {
  source: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function nonEmptyString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function assignString(target: ResumeIdentifiers, key: keyof ResumeIdentifiers, value: unknown): void {
  const next = nonEmptyString(value);
  if (next) {
    target[key] = next;
  }
}

function readIdentifierObject(input: Record<string, unknown>, source: string): IdentifierHit | null {
  const next: ResumeIdentifiers = {};
  assignString(next, 'encryptGeekId', input.encryptGeekId);
  assignString(next, 'encryptGeekId', input.encryptGeekid);
  assignString(next, 'encryptGeekId', input.encryptGeek);
  assignString(next, 'encryptGeekId', input.encryptUid);
  assignString(next, 'encryptGeekId', input.encrypt_uid);
  assignString(next, 'encryptJobId', input.encryptJobId);
  assignString(next, 'encryptJobId', input.encrypt_job_id);
  assignString(next, 'securityId', input.securityId);
  assignString(next, 'securityId', input.security_id);
  assignString(next, 'visibleGeekId', input.geekId);
  assignString(next, 'friendId', input.friendId);
  assignString(next, 'friendId', input.friend_id);

  if (!next.encryptGeekId && !next.encryptJobId && !next.securityId && !next.friendId) {
    return null;
  }
  return { ...next, source };
}

export function collectIdentifierHits(input: unknown, source = 'payload'): IdentifierHit[] {
  const queue: Array<{ value: unknown; source: string }> = [{ value: input, source }];
  const hits: IdentifierHit[] = [];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) {
      continue;
    }
    const { value, source: currentSource } = current;
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        queue.push({ value: item, source: `${currentSource}[${index}]` });
      });
      continue;
    }
    if (!isRecord(value)) {
      continue;
    }

    const hit = readIdentifierObject(value, currentSource);
    if (hit) {
      hits.push(hit);
    }

    for (const [key, child] of Object.entries(value)) {
      queue.push({ value: child, source: `${currentSource}.${key}` });
    }
  }

  return hits;
}

export function collectIdentifierHitsFromUrl(url: string): IdentifierHit[] {
  try {
    const parsed = new URL(url);
    const params = parsed.searchParams;
    const hit: ResumeIdentifiers = {};
  assignString(hit, 'encryptGeekId', params.get('geekId'));
  assignString(hit, 'encryptGeekId', params.get('encryptGeekId'));
  assignString(hit, 'encryptGeekId', params.get('encryptUid'));
  assignString(hit, 'encryptJobId', params.get('jobId'));
  assignString(hit, 'encryptJobId', params.get('encryptJid'));
  assignString(hit, 'encryptJobId', params.get('encryptJobId'));
    assignString(hit, 'securityId', params.get('securityId'));
    assignString(hit, 'friendId', params.get('friendId'));
    if (!hit.encryptGeekId && !hit.encryptJobId && !hit.securityId && !hit.friendId) {
      return [];
    }
    return [{ ...hit, source: `url:${parsed.pathname}` }];
  } catch {
    return [];
  }
}

function hitScore(hit: ResumeIdentifiers, preferredVisibleGeekId?: string): number {
  let score = 0;
  if (hit.encryptGeekId) score += 4;
  if (hit.encryptJobId) score += 4;
  if (hit.securityId) score += 4;
  if (hit.friendId) score += 1;
  if (preferredVisibleGeekId && hit.visibleGeekId === preferredVisibleGeekId) {
    score += 3;
  }
  return score;
}

export function resolveIdentifiers(
  hits: ResumeIdentifiers[],
  preferredVisibleGeekId?: string,
): ResumeIdentifiers | null {
  if (hits.length === 0) {
    return null;
  }

  const ranked = [...hits].sort((left, right) => {
    return hitScore(right, preferredVisibleGeekId) - hitScore(left, preferredVisibleGeekId);
  });

  const resolved: ResumeIdentifiers = {};
  for (const hit of ranked) {
    resolved.encryptGeekId ||= hit.encryptGeekId;
    resolved.encryptJobId ||= hit.encryptJobId;
    resolved.securityId ||= hit.securityId;
    resolved.visibleGeekId ||= hit.visibleGeekId;
    resolved.friendId ||= hit.friendId;
  }
  if (!resolved.encryptGeekId && preferredVisibleGeekId) {
    resolved.encryptGeekId = preferredVisibleGeekId;
    resolved.visibleGeekId ||= preferredVisibleGeekId;
  }

  if (!resolved.encryptGeekId || !resolved.encryptJobId || !resolved.securityId) {
    return null;
  }
  return resolved;
}
