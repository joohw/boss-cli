---
name: boss-jd-resume-collector
description: Use this skill when the user wants to input a JD/job description and collect BOSS/Zhipin resumes for later matching, including “输入 JD 找合适简历”, “BOSS 简历采集”, “根据 JD 收集候选人”, or “先采集候选人简历”. It orchestrates boss-cli resume collection only; it does not rank or match resumes against the JD.
---

# BOSS JD Resume Collector

## Purpose

Collect local BOSS/Zhipin resume data for a JD so later steps can match candidates offline. This skill only performs data collection and validation; do not score, rank, or recommend candidates in v1.

## Preconditions

- `boss` is available on PATH from this repository build.
- The user is logged in to BOSS in the browser session used by `boss-cli`.
- The BOSS search/deep-search page is already set to the target role/search condition. v1 does not switch the search page job automatically.

## Workflow

1. Save or receive the JD text.
2. Identify a job keyword from the JD title/content. If unclear, ask the user for the exact job keyword before collecting.
3. Run the bundled collector script:

```bash
python "<skill_dir>/scripts/collect_boss_resumes.py" --jd-file "<jd.md>" --job-keyword "<keyword>"
```

Alternatively pass JD text directly:

```bash
python "<skill_dir>/scripts/collect_boss_resumes.py" --jd-text "<JD text>" --job-keyword "<keyword>"
```

The script runs exactly these three source collections:

```bash
boss resumes --from chat --limit 3 --json
boss resumes --from recommend --limit 3 --json --job <keyword>
boss resumes --from deep-search --limit 3 --json
```

## Success Criteria

- Each source must produce exactly 3 usable resumes.
- Usable statuses are `downloaded` and `skipped_existing`.
- Every usable item must have existing `resume.md` and `resume.json` paths.
- If any source has fewer than 3 usable resumes, treat the collection as failed and report the failed source and candidate errors.

## Outputs

The script writes a run directory under:

```text
~/.boss-cli/runs/<timestamp>_<safe_jd_title>/
```

Files:

- `jd.md`: the JD used for this run.
- `collection_manifest.json`: machine-readable run manifest.
- `collection_summary.md`: concise human-readable summary.

Use only `jd.md`, `collection_manifest.json`, and listed local `resume.md` / `resume.json` files for later matching. Do not query BOSS during matching.

## Safety

- Do not send messages to candidates.
- Do not change job status.
- Do not broaden collection beyond 3 per source in v1.
- Treat downloaded resumes as private recruiting data.
