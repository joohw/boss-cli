import type { CDPSession, Page } from 'puppeteer-core';
import { createPageCDPSession } from '../browser/index.js';
import { collectIdentifierHits, collectIdentifierHitsFromUrl, resolveIdentifiers } from './identifiers.js';
import type { ResumeIdentifiers } from './types.js';

type NetworkResponseEvent = {
  requestId: string;
  type?: string;
  response: {
    url: string;
    status: number;
    mimeType?: string;
  };
};

function bodyLooksJson(body: string): boolean {
  const trimmed = body.trimStart();
  return trimmed.startsWith('{') || trimmed.startsWith('[');
}

async function readResponseBody(
  cdp: CDPSession,
  requestId: string,
): Promise<string | null> {
  try {
    const result = (await cdp.send('Network.getResponseBody', {
      requestId,
    })) as {
      body: string;
      base64Encoded: boolean;
    };
    return result.base64Encoded
      ? Buffer.from(result.body, 'base64').toString('utf8')
      : result.body;
  } catch {
    return null;
  }
}

export class BossResumeObserver {
  private readonly page: Page;

  private cdp: CDPSession | null = null;

  private readonly pending = new Set<Promise<void>>();

  private readonly hits: ResumeIdentifiers[] = [];

  private readonly onResponseReceived = (params: NetworkResponseEvent) => {
    const task = this.captureResponse(params).finally(() => {
      this.pending.delete(task);
    });
    this.pending.add(task);
  };

  constructor(page: Page) {
    this.page = page;
  }

  async start(): Promise<void> {
    this.cdp = await createPageCDPSession(this.page);
    await this.cdp.send('Network.enable');
    this.cdp.on('Network.responseReceived', this.onResponseReceived);
  }

  async stop(): Promise<void> {
    await this.flush();
    if (!this.cdp) {
      return;
    }
    this.cdp.off('Network.responseReceived', this.onResponseReceived);
    await this.cdp.send('Network.disable').catch(() => {});
    await this.cdp.detach().catch(() => {});
    this.cdp = null;
  }

  async flush(): Promise<void> {
    if (this.pending.size === 0) {
      return;
    }
    await Promise.allSettled(Array.from(this.pending));
  }

  resolve(preferredVisibleGeekId?: string, extraUrls: string[] = []): ResumeIdentifiers | null {
    const candidates = [...this.hits];
    for (const url of extraUrls) {
      candidates.push(...collectIdentifierHitsFromUrl(url));
    }
    return resolveIdentifiers(candidates, preferredVisibleGeekId);
  }

  private async captureResponse(params: NetworkResponseEvent): Promise<void> {
    if (!this.cdp) {
      return;
    }
    const { response } = params;
    if (!response.url || response.status < 200 || response.status >= 400) {
      return;
    }
    if (!/zhipin\.com/i.test(response.url)) {
      return;
    }

    const urlHits = collectIdentifierHitsFromUrl(response.url);
    if (urlHits.length > 0) {
      this.hits.push(...urlHits);
    }

    const mime = (response.mimeType ?? '').toLowerCase();
    if (!mime.includes('json') && !/json|api|friend|resume|geek|job/i.test(response.url)) {
      return;
    }

    const body = await readResponseBody(this.cdp, params.requestId);
    if (!body || !bodyLooksJson(body)) {
      return;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(body);
    } catch {
      return;
    }

    this.hits.push(...collectIdentifierHits(parsed, response.url));
  }
}
