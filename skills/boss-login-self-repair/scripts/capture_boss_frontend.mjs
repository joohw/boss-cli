#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const ENTRY_PAGES = [
  {
    label: 'chat',
    url: 'https://www.zhipin.com/web/chat/index',
  },
  {
    label: 'login',
    url: 'https://www.zhipin.com/web/user/?ka=header-login',
  },
];

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36';
const FETCH_TIMEOUT_MS = 30_000;
const RESEARCH_ROOT = path.join('docs', 'research', 'boss-online-js');
const PREVIOUS_BASELINE = '2026-07-01';
const HIGH_RISK_PATTERNS = [
  'risk-detection',
  'zhipin-sign',
  'zhipin-security',
  'browser-check',
  'warlock',
  'patas',
];
const CAPTURE_HOSTS = new Set([
  'static.zhipin.com',
  'www.zhipin.com',
  'img.bosszhipin.com',
]);
const SEARCH_TERMS = [
  '99001',
  '99002',
  '99004',
  '99005',
  'srcdoc',
  'MutationObserver',
  'isTrusted',
  'sendAction',
  'debugger',
  'Function(',
  'constructor',
  'setInterval',
  'console',
  'devtools',
  'verify',
  'security',
  '403.html',
];

function usage() {
  return [
    'Usage: node skills/boss-frontend-analysis/scripts/capture_boss_frontend.mjs [--date YYYY-MM-DD] [--force]',
    '',
    'Captures Boss/Zhipin frontend JavaScript into docs/research/boss-online-js/<date>.',
    'Without --force, the output directory must not already exist.',
  ].join('\n');
}

function parseArgs(argv) {
  const out = { force: false, date: null };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--force') {
      out.force = true;
      continue;
    }
    if (arg === '--date') {
      const value = argv[i + 1];
      if (!value || value.startsWith('--')) {
        throw new Error('--date requires YYYY-MM-DD');
      }
      out.date = value;
      i++;
      continue;
    }
    if (arg === '--help' || arg === '-h') {
      console.log(usage());
      process.exit(0);
    }
    throw new Error(`Unknown argument: ${arg}`);
  }
  if (out.date && !/^\d{4}-\d{2}-\d{2}$/.test(out.date)) {
    throw new Error(`Invalid --date: ${out.date}`);
  }
  return out;
}

function todayInShanghai() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

function normalizeUrl(raw, baseUrl) {
  try {
    return new URL(raw, baseUrl).toString();
  } catch {
    return null;
  }
}

function localPathForUrl(url) {
  const u = new URL(url);
  const parts = u.pathname.split('/').filter(Boolean);
  const filename = parts.pop() || 'index';
  let dir = parts.join('/');
  dir = dir
    .replace(/^assets\//, 'assets/')
    .replace(/^static\//, 'static/')
    .replace(/^zhipin-boss\/index\/([^/]+)\/static\/js$/, 'boss-index-$1')
    .replace(/^zhipin-boss\/bundle\/([^/]+)\/static$/, 'boss-bundle-$1')
    .replace(/^zhipin-boss\/bundle\/([^/]+)\/static\/js$/, 'boss-bundle-$1/static/js')
    .replace(/^zhipin-sign\/([^/]+)\/static\/js$/, 'zhipin-sign-$1')
    .replace(/^zhipin-security\/web\/geek\/polyfill$/, 'zhipin-security/geek-polyfill')
    .replace(/^web\/user$/, 'entry');
  const safeDir = dir || u.hostname.replace(/[^A-Za-z0-9.-]+/g, '_');
  return path.join('raw', safeDir, filename);
}

function addDiscovered(discovered, url, source, note, required = true) {
  if (!url) {
    return;
  }
  const normalized = normalizeUrl(url, source.url);
  if (!normalized) {
    return;
  }
  if (!new URL(normalized).pathname.endsWith('.js')) {
    return;
  }
  if (!discovered.has(normalized)) {
    discovered.set(normalized, { url: normalized, sources: [], required: false });
  }
  discovered.get(normalized).required = discovered.get(normalized).required || required;
  discovered.get(normalized).sources.push({ source: source.label, note });
}

function isCaptureScope(url) {
  try {
    const host = new URL(url).hostname;
    return CAPTURE_HOSTS.has(host);
  } catch {
    return false;
  }
}

function extractHtmlScripts(html, baseUrl) {
  const urls = [];
  const re = /<script\b[^>]+src=["']([^"']+)["']/gi;
  for (const match of html.matchAll(re)) {
    const url = normalizeUrl(match[1], baseUrl);
    if (url && new URL(url).pathname.endsWith('.js')) {
      urls.push(url);
    }
  }
  return urls;
}

function extractAbsoluteScriptUrls(jsText, baseUrl) {
  const urls = new Set();
  const absoluteRe = /https?:\/\/[^"'()<>\s\\]+?\.js(?:\?[^"'()<>\s\\]*)?/g;
  for (const match of jsText.matchAll(absoluteRe)) {
    urls.add(match[0]);
  }
  const protocolRelativeRe = /\/\/[^"'()<>\s\\]+?\.js(?:\?[^"'()<>\s\\]*)?/g;
  for (const match of jsText.matchAll(protocolRelativeRe)) {
    urls.add(`https:${match[0]}`);
  }
  const current = new URL(baseUrl);
  const rootRelativeRe = /["'](\/[^"'()<>\s\\]+?\.js(?:\?[^"'()<>\s\\]*)?)["']/g;
  for (const match of jsText.matchAll(rootRelativeRe)) {
    urls.add(`${current.origin}${match[1]}`);
  }
  return Array.from(urls);
}

function extractStaticJsPaths(jsText, baseUrl) {
  const urls = new Set();
  const base = new URL(baseUrl);
  const publicPathMatches = Array.from(
    jsText.matchAll(/[A-Za-z_$][\w$]*\.p\s*=\s*["']([^"']+)["']/g),
  );
  const publicPaths = publicPathMatches
    .map((match) => normalizeUrl(match[1], baseUrl))
    .filter(Boolean);

  const literalPathRe = /["'](static\/js\/[^"']+?\.js)["']/g;
  for (const match of jsText.matchAll(literalPathRe)) {
    for (const publicPath of publicPaths) {
      urls.add(normalizeUrl(match[1], publicPath));
    }
  }

  return Array.from(urls).filter(Boolean);
}

function extractInferredWebpackChunkUrls(jsText, baseUrl) {
  const publicPathMatches = Array.from(
    jsText.matchAll(/[A-Za-z_$][\w$]*\.p\s*=\s*["']([^"']+)["']/g),
  );
  const publicPaths = publicPathMatches
    .map((match) => normalizeUrl(match[1], baseUrl))
    .filter(Boolean);
  if (publicPaths.length === 0 || !/\.u\s*=\s*function\([^)]*\)\s*\{return["']static\/js\//.test(jsText)) {
    return [];
  }
  const ids = Array.from(new Set(Array.from(jsText.matchAll(/\.e\((\d+)\)/g)).map((m) => m[1])));
  const urls = [];
  for (const publicPath of publicPaths) {
    for (const id of ids) {
      urls.push(normalizeUrl(`static/js/${id}.js`, publicPath));
    }
  }
  return urls.filter(Boolean);
}

async function fetchStrict(url) {
  let res;
  try {
    res = await fetch(url, {
      headers: {
        'user-agent': USER_AGENT,
        accept: '*/*',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`Fetch failed for ${url}: ${msg}`);
  }
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText} while fetching ${url}`);
  }
  return {
    finalUrl: res.url || url,
    contentType: res.headers.get('content-type') || '',
    buffer: Buffer.from(await res.arrayBuffer()),
  };
}

async function pathExists(target) {
  try {
    await stat(target);
    return true;
  } catch (e) {
    if (e && e.code === 'ENOENT') {
      return false;
    }
    throw e;
  }
}

async function latestBaselineFolder(root, excludeDate) {
  if (!(await pathExists(root))) {
    return null;
  }
  const names = await readdir(root);
  const dated = names
    .filter((name) => /^\d{4}-\d{2}-\d{2}$/.test(name) && name !== excludeDate)
    .sort();
  return dated.at(-1) || null;
}

async function readPreviousManifest(root, date) {
  const manifestPath = path.join(root, date, 'manifest.json');
  if (!(await pathExists(manifestPath))) {
    return null;
  }
  return JSON.parse(await readFile(manifestPath, 'utf8'));
}

function parseVersion(url, marker) {
  const idx = url.indexOf(marker);
  if (idx === -1) {
    return null;
  }
  const rest = url.slice(idx + marker.length);
  const version = rest.split('/')[0];
  return version || null;
}

function summarizeVersions(entries) {
  const urls = entries.map((e) => e.url);
  return {
    bossIndex: Array.from(
      new Set(urls.map((u) => parseVersion(u, '/zhipin-boss/index/')).filter(Boolean)),
    ).sort(),
    bossBundle: Array.from(
      new Set(urls.map((u) => parseVersion(u, '/zhipin-boss/bundle/')).filter(Boolean)),
    ).sort(),
    zhipinSign: Array.from(
      new Set(urls.map((u) => parseVersion(u, '/zhipin-sign/')).filter(Boolean)),
    ).sort(),
  };
}

function searchHits(text) {
  const hits = {};
  for (const term of SEARCH_TERMS) {
    const count = text.split(term).length - 1;
    if (count > 0) {
      hits[term] = count;
    }
  }
  return hits;
}

function uniqueSorted(values) {
  return Array.from(new Set(values)).sort();
}

function buildAnalysis({ date, baselineDate, manifest, previousManifest }) {
  const currentVersions = summarizeVersions(manifest.entries);
  const previousVersions = previousManifest ? summarizeVersions(previousManifest.entries || []) : null;
  const currentUrls = new Set(manifest.entries.map((e) => e.url));
  const previousUrls = new Set((previousManifest?.entries || []).map((e) => e.url));
  const added = uniqueSorted(Array.from(currentUrls).filter((url) => !previousUrls.has(url)));
  const removed = uniqueSorted(Array.from(previousUrls).filter((url) => !currentUrls.has(url)));
  const changedHashes = [];

  if (previousManifest) {
    const prevByUrl = new Map(previousManifest.entries.map((entry) => [entry.url, entry]));
    for (const entry of manifest.entries) {
      const prev = prevByUrl.get(entry.url);
      if (prev && prev.sha256 !== entry.sha256) {
        changedHashes.push({
          url: entry.url,
          previousSha256: prev.sha256,
          currentSha256: entry.sha256,
        });
      }
    }
  }

  const highRisk = manifest.entries.filter((entry) =>
    HIGH_RISK_PATTERNS.some((pattern) => entry.url.includes(pattern)),
  );
  const riskHits = highRisk
    .map((entry) => ({
      path: entry.localPath,
      url: entry.url,
      hits: entry.searchHits,
    }))
    .filter((entry) => Object.keys(entry.hits).length > 0);

  const baselineChanged =
    JSON.stringify(currentVersions.bossIndex) !== JSON.stringify(previousVersions?.bossIndex || []) ||
    JSON.stringify(currentVersions.bossBundle) !==
      JSON.stringify(previousVersions?.bossBundle || []) ||
    JSON.stringify(currentVersions.zhipinSign) !==
      JSON.stringify(previousVersions?.zhipinSign || []);

  const lines = [
    `# Boss Frontend Analysis - ${date}`,
    '',
    `Baseline compared: ${baselineDate || 'none'}`,
    '',
    '## Versions',
    '',
    `- Current Boss index: ${currentVersions.bossIndex.join(', ') || 'none'}`,
    `- Previous Boss index: ${previousVersions?.bossIndex.join(', ') || 'none'}`,
    `- Current Boss bundle: ${currentVersions.bossBundle.join(', ') || 'none'}`,
    `- Previous Boss bundle: ${previousVersions?.bossBundle.join(', ') || 'none'}`,
    `- Current Zhipin sign: ${currentVersions.zhipinSign.join(', ') || 'none'}`,
    `- Previous Zhipin sign: ${previousVersions?.zhipinSign.join(', ') || 'none'}`,
    '',
    '## Asset Diff',
    '',
    `- Added URLs: ${added.length}`,
    `- Removed URLs: ${removed.length}`,
    `- Same-URL hash changes: ${changedHashes.length}`,
    '',
  ];

  if (added.length > 0) {
    lines.push('### Added URLs', '', ...added.map((url) => `- ${url}`), '');
  }
  if (removed.length > 0) {
    lines.push('### Removed URLs', '', ...removed.map((url) => `- ${url}`), '');
  }
  if (changedHashes.length > 0) {
    lines.push(
      '### Same-URL Hash Changes',
      '',
      ...changedHashes.map(
        (item) => `- ${item.url}: ${item.previousSha256} -> ${item.currentSha256}`,
      ),
      '',
    );
  }

  lines.push('## High-Risk Pattern Hits', '');
  if (riskHits.length === 0) {
    lines.push('- No configured high-risk terms found in high-risk scripts.', '');
  } else {
    for (const item of riskHits) {
      const summary = Object.entries(item.hits)
        .map(([term, count]) => `${term}=${count}`)
        .join(', ');
      lines.push(`- ${item.path}: ${summary}`);
    }
    lines.push('');
  }

  if (manifest.skippedNestedScriptUrls.length > 0) {
    lines.push('## Skipped Nested Script URLs', '');
    lines.push(
      'These URLs were discovered inside downloaded JavaScript but are outside the capture host allowlist.',
      '',
      ...manifest.skippedNestedScriptUrls.map((item) => `- ${item.url} (from ${item.source})`),
      '',
    );
  }

  if (manifest.unresolvedScriptUrls.length > 0) {
    lines.push('## Unresolved Inferred Script URLs', '');
    lines.push(
      'These URLs were inferred from webpack runtime chunk ids but could not be downloaded.',
      '',
      ...manifest.unresolvedScriptUrls.map(
        (item) => `- ${item.url}: ${item.error} (from ${item.source})`,
      ),
      '',
    );
  }

  lines.push('## Recommendation', '');
  if (baselineChanged || added.length > 0 || removed.length > 0 || changedHashes.length > 0) {
    lines.push(
      '- Keep boss-cli disabled until the archived raw scripts are manually reviewed.',
      '- Update `src/common/boss_availability.ts` only after accepting the new script versions and hashes.',
      '- Re-check `src/common/boss_page_guards.ts` request patterns against any new risk, security, or reporting script URLs.',
      '- Update `docs/anti-detection.md` with the new versions and risk findings.',
    );
  } else {
    lines.push(
      '- Online scripts match the compared baseline at URL/version/hash level.',
      '- Keep existing availability constants unless manual review finds behavior changes.',
    );
  }
  lines.push('');

  return lines.join('\n');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const date = args.date || todayInShanghai();
  const outDir = path.join(RESEARCH_ROOT, date);
  if ((await pathExists(outDir)) && !args.force) {
    throw new Error(`Output directory already exists: ${outDir}. Use --force to overwrite files.`);
  }

  await mkdir(path.join(outDir, 'raw'), { recursive: true });

  const discovered = new Map();
  const entryPages = [];
  for (const entry of ENTRY_PAGES) {
    const fetched = await fetchStrict(entry.url);
    const html = fetched.buffer.toString('utf8');
    entryPages.push({
      label: entry.label,
      url: entry.url,
      finalUrl: fetched.finalUrl,
      bytes: fetched.buffer.length,
      sha256: sha256(fetched.buffer),
      scripts: extractHtmlScripts(html, entry.url),
    });
    for (const scriptUrl of extractHtmlScripts(html, entry.url)) {
      addDiscovered(discovered, scriptUrl, entry, 'entry page script');
    }
  }

  const queue = Array.from(discovered.keys());
  const fetchedScripts = new Map();
  const skippedNestedScripts = new Map();
  const unresolvedScripts = [];

  for (let i = 0; i < queue.length; i++) {
    const url = queue[i];
    const meta = discovered.get(url);
    let fetched;
    try {
      fetched = await fetchStrict(url);
    } catch (e) {
      if (!meta?.required) {
        unresolvedScripts.push({
          url,
          source: (meta?.sources || []).map((item) => item.source).join(', '),
          error: e instanceof Error ? e.message : String(e),
        });
        continue;
      }
      throw e;
    }
    const text = fetched.buffer.toString('utf8');
    fetchedScripts.set(url, { fetched, text });

    const source = { label: url, url };
    const nested = [...extractAbsoluteScriptUrls(text, url), ...extractStaticJsPaths(text, url)];
    for (const nestedUrl of nested) {
      if (!nestedUrl || !nestedUrl.endsWith('.js')) {
        continue;
      }
      if (!new URL(nestedUrl).pathname.endsWith('.js')) {
        continue;
      }
      if (!isCaptureScope(nestedUrl)) {
        if (!skippedNestedScripts.has(nestedUrl)) {
          skippedNestedScripts.set(nestedUrl, []);
        }
        skippedNestedScripts.get(nestedUrl).push(url);
        continue;
      }
      if (!discovered.has(nestedUrl)) {
        discovered.set(nestedUrl, { url: nestedUrl, sources: [] });
        queue.push(nestedUrl);
      }
      discovered.get(nestedUrl).sources.push({ source: source.label, note: 'nested script reference' });
    }
    for (const chunkUrl of extractInferredWebpackChunkUrls(text, url)) {
      addDiscovered(discovered, chunkUrl, source, 'inferred webpack chunk', false);
      if (!queue.includes(chunkUrl)) {
        queue.push(chunkUrl);
      }
    }
  }

  const entries = [];
  for (const url of Array.from(fetchedScripts.keys()).sort()) {
    const { fetched, text } = fetchedScripts.get(url);
    const localPath = localPathForUrl(url);
    const absLocal = path.join(outDir, localPath);
    await mkdir(path.dirname(absLocal), { recursive: true });
    await writeFile(absLocal, fetched.buffer);
    entries.push({
      url,
      finalUrl: fetched.finalUrl,
      localPath: localPath.replace(/\\/g, '/'),
      bytes: fetched.buffer.length,
      sha256: sha256(fetched.buffer),
      contentType: fetched.contentType,
      sources: discovered.get(url)?.sources || [],
      searchHits: searchHits(text),
    });
  }

  const manifest = {
    capturedAt: new Date().toISOString(),
    entryPages,
    count: entries.length,
    totalBytes: entries.reduce((sum, entry) => sum + entry.bytes, 0),
    skippedNestedScriptUrls: Array.from(skippedNestedScripts.entries())
      .map(([url, sources]) => ({ url, source: uniqueSorted(sources).join(', ') }))
      .sort((a, b) => a.url.localeCompare(b.url)),
    unresolvedScriptUrls: unresolvedScripts.sort((a, b) => a.url.localeCompare(b.url)),
    entries,
  };
  await writeFile(path.join(outDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  await writeFile(
    path.join(outDir, '.gitattributes'),
    ['raw/** -text diff', 'manifest.json text eol=lf', 'analysis.md text eol=lf', ''].join('\n'),
  );

  const baselineDate =
    (await latestBaselineFolder(RESEARCH_ROOT, date)) ||
    (await pathExists(path.join(RESEARCH_ROOT, PREVIOUS_BASELINE)) ? PREVIOUS_BASELINE : null);
  const previousManifest = baselineDate ? await readPreviousManifest(RESEARCH_ROOT, baselineDate) : null;
  const analysis = buildAnalysis({ date, baselineDate, manifest, previousManifest });
  await writeFile(path.join(outDir, 'analysis.md'), analysis);

  console.log(`Captured ${entries.length} scripts to ${outDir}`);
  console.log(`Wrote ${path.join(outDir, 'manifest.json')}`);
  console.log(`Wrote ${path.join(outDir, 'analysis.md')}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
