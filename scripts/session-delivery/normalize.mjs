#!/usr/bin/env node
/**
 * 将原始调用记录整理为：session 目录 + 按序 JSON 文件。
 * 用法见同目录 README.md
 */
import { randomUUID } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function die(msg) {
  console.error(msg);
  process.exit(1);
}

function parseJsonMaybe(s) {
  if (s === null || s === undefined) return null;
  if (typeof s === 'object') return s;
  if (typeof s !== 'string') return null;
  const t = s.trim();
  if (!t) return null;
  try {
    return JSON.parse(t);
  } catch {
    return null;
  }
}

/** 文件名安全：去掉 Windows 非法字符 */
function safeFilePart(s) {
  return String(s).replace(/[:<>"|?*\\/]/g, '-');
}

function isoFromUnixOrString(t) {
  if (t === undefined || t === null) return null;
  if (typeof t === 'number' && Number.isFinite(t)) {
    if (t > 1e12) return new Date(t).toISOString();
    return new Date(t * 1000).toISOString();
  }
  if (typeof t === 'string' && t.trim()) return t;
  return null;
}

function countUserMessages(messages) {
  if (!Array.isArray(messages)) return 0;
  return messages.filter((m) => m && m.role === 'user').length;
}

function matchesModel(model, patternRe) {
  if (!patternRe) return true;
  return patternRe.test(String(model ?? ''));
}

/**
 * 将一条「原始行」转为交付 JSON 形状（尽量补全核心字段）。
 */
function rowToDeliverable(raw, { defaultSessionId, defaultUserAgent }) {
  const req = parseJsonMaybe(raw.request) ?? {};
  const sessionId =
    raw.session_id ??
    req.session_id ??
    req.metadata?.session_id ??
    defaultSessionId;
  if (!sessionId) {
    throw new Error('缺少 session_id：请在数据行或 --default-session-id 中提供');
  }

  const model = raw.model ?? req.model ?? raw.model_name ?? 'unknown';
  const requestId =
    raw.request_id ??
    req.request_id ??
    raw.id?.toString?.() ??
    randomUUID();

  const startTime =
    isoFromUnixOrString(raw.start_time) ??
    isoFromUnixOrString(raw.created_at) ??
    isoFromUnixOrString(req.start_time) ??
    new Date().toISOString();

  const messages = Array.isArray(req.messages) ? req.messages : [];
  const system = Array.isArray(req.system) ? req.system : req.system_prompt ?? [];
  const tools = Array.isArray(req.tools) ? req.tools : [];

  const responseParsed = parseJsonMaybe(raw.response);
  const response =
    responseParsed && typeof responseParsed === 'object'
      ? { ...responseParsed, session_id: sessionId }
      : {
          response_id: String(requestId),
          model: String(model).split('/').pop(),
          session_id: sessionId,
          choices: typeof raw.response === 'string' ? [raw.response] : [],
          usage: raw.usage ?? {},
        };

  const out = {
    request_id: String(requestId),
    start_time: startTime,
    end_time: isoFromUnixOrString(raw.end_time) ?? startTime,
    session_id: sessionId,
    model: typeof model === 'string' ? model : String(model),
    user_agent: raw.user_agent ?? defaultUserAgent ?? 'unknown',
    call_type: raw.call_type ?? 'anthropic_messages',
    status: raw.status ?? 'success',
    tools,
    system: Array.isArray(system) ? system : [],
    messages,
    response,
  };

  if (raw.user_id !== undefined) out.user_id = raw.user_id;
  if (raw.prompt_tokens !== undefined) out.prompt_tokens = raw.prompt_tokens;
  if (raw.completion_tokens !== undefined) out.completion_tokens = raw.completion_tokens;
  if (raw.token_name !== undefined) out.token_name = raw.token_name;

  return out;
}

function buildFilename(index, startTime, requestId) {
  const idx = String(index).padStart(3, '0');
  const ts = startTime ? safeFilePart(startTime) : null;
  const rid = requestId ? safeFilePart(requestId) : null;
  if (ts && rid) return `${idx}_${ts}_${rid}.json`;
  if (rid) return `${idx}_${rid}.json`;
  return `${idx}.json`;
}

async function cmdExport(argv) {
  let input = null;
  let outDir = path.join(process.cwd(), 'session-export-out');
  let defaultSessionId = null;
  let defaultUserAgent = 'claude-cli/2.1.74 (external, cli)';
  let userId = null;
  let modelPattern = null;

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--input' && argv[i + 1]) {
      input = argv[++i];
      continue;
    }
    if (a === '--out' && argv[i + 1]) {
      outDir = path.resolve(argv[++i]);
      continue;
    }
    if (a === '--default-session-id' && argv[i + 1]) {
      defaultSessionId = argv[++i];
      continue;
    }
    if (a === '--user-id' && argv[i + 1]) {
      userId = argv[++i];
      continue;
    }
    if (a === '--user-agent' && argv[i + 1]) {
      defaultUserAgent = argv[++i];
      continue;
    }
    if (a === '--model-pattern' && argv[i + 1]) {
      modelPattern = new RegExp(argv[++i], 'i');
      continue;
    }
  }

  if (!input) die('用法: normalize.mjs export --input <raw.json> --out <dir> [--default-session-id id] [--user-id id] [--model-pattern regex]');

  const rawText = await readFile(path.resolve(input), 'utf8');
  const data = JSON.parse(rawText);
  const rows = Array.isArray(data) ? data : [data];

  const bySession = new Map();
  for (const row of rows) {
    let deliver;
    try {
      deliver = rowToDeliverable(row, { defaultSessionId, defaultUserAgent });
    } catch (e) {
      console.error(String(e instanceof Error ? e.message : e));
      process.exitCode = 1;
      continue;
    }
    if (!matchesModel(deliver.model, modelPattern)) continue;
    const sid = deliver.session_id;
    if (!bySession.has(sid)) bySession.set(sid, []);
    bySession.get(sid).push(deliver);
  }

  for (const [sid, list] of bySession) {
    list.sort((a, b) => String(a.start_time).localeCompare(String(b.start_time)));
  }

  for (const [sid, list] of bySession) {
    const dirName = userId != null ? `${userId}_${sid}` : String(sid);
    const sessionPath = path.join(outDir, dirName);
    await mkdir(sessionPath, { recursive: true });
    let idx = 1;
    for (const item of list) {
      const name = buildFilename(idx, item.start_time, item.request_id);
      await writeFile(path.join(sessionPath, name), JSON.stringify(item, null, 2), 'utf8');
      idx += 1;
    }
    console.error(`写入 ${list.length} 个文件 -> ${sessionPath}`);
  }
}

async function cmdValidate(argv) {
  let root = process.cwd();
  let minInteractions = 5;
  let minUserMessages = 0;

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--root' && argv[i + 1]) {
      root = path.resolve(argv[++i]);
      continue;
    }
    if (a === '--min-interactions' && argv[i + 1]) {
      minInteractions = Number(argv[++i]);
      continue;
    }
    if (a === '--min-user-messages' && argv[i + 1]) {
      minUserMessages = Number(argv[++i]);
      continue;
    }
  }

  const dirs = (await readdir(root, { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  let ok = true;
  for (const d of dirs) {
    const p = path.join(root, d);
    const files = (await readdir(p)).filter((f) => f.endsWith('.json')).sort();
    if (files.length < minInteractions) {
      console.error(`❌ ${d}: 仅 ${files.length} 个交互文件，需要 >= ${minInteractions}`);
      ok = false;
      continue;
    }
    if (minUserMessages > 0) {
      const lastPath = path.join(p, files[files.length - 1]);
      const j = JSON.parse(await readFile(lastPath, 'utf8'));
      const n = countUserMessages(j.messages);
      if (n < minUserMessages) {
        console.error(`❌ ${d}: messages 中 user 条数 ${n}，需要 >= ${minUserMessages}`);
        ok = false;
      }
    }
    console.error(`✅ ${d}: ${files.length} 个 JSON`);
  }

  if (!ok) process.exit(1);
}

function printHelp() {
  console.log(`session-delivery 工具

命令:
  export --input <file.json> --out <dir> [选项]
  validate --root <dir> [选项]

export 选项:
  --default-session-id <id>   当原始行无 session_id 时整表共用
  --user-id <id>              目录名前缀 user_id_session_id
  --model-pattern <regex>     只导出 model 匹配的记录
  --user-agent <string>       写入默认 user_agent

validate 选项:
  --min-interactions <n>      每个 session 子目录至少 n 个 json（默认 5）
  --min-user-messages <n>     可选：最后一个 json 的 messages 里 user 条数
`);
}

const [, , cmd, ...rest] = process.argv;
if (!cmd || cmd === '--help' || cmd === '-h') {
  printHelp();
  process.exit(0);
}

if (cmd === 'export') {
  await cmdExport(rest);
} else if (cmd === 'validate') {
  await cmdValidate(rest);
} else {
  die(`未知命令: ${cmd}`);
}
