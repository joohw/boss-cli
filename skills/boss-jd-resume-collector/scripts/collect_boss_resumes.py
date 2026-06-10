#!/usr/bin/env python3
"""Collect exactly three usable BOSS resumes from each configured source for one JD."""

from __future__ import annotations

import argparse
import json
import os
import re
import shlex
import subprocess
import sys
from datetime import datetime
from pathlib import Path
from typing import Any


SOURCES = ("chat", "recommend", "deep-search")
USABLE_STATUSES = {"downloaded", "skipped_existing"}


def user_home() -> Path:
    return Path.home()


def default_resume_root() -> Path:
    return user_home() / ".boss-cli" / "resumes"


def default_runs_root() -> Path:
    return user_home() / ".boss-cli" / "runs"


def safe_segment(value: str, fallback: str = "jd") -> str:
    cleaned = re.sub(r'[<>:"/\\|?*\x00-\x1f]', "_", value).strip()
    cleaned = re.sub(r"\s+", "_", cleaned)
    return (cleaned[:80] or fallback)


def read_jd(args: argparse.Namespace) -> tuple[str, str]:
    if args.jd_file:
        path = Path(args.jd_file).expanduser()
        text = path.read_text(encoding="utf-8")
        return text, str(path)
    if args.jd_text:
        return args.jd_text, "inline"
    if not sys.stdin.isatty():
        text = sys.stdin.read()
        if text.strip():
            return text, "stdin"
    raise SystemExit("JD is required. Pass --jd-file, --jd-text, or pipe JD text on stdin.")


def infer_job_keyword(jd_text: str) -> str | None:
    lines = [line.strip() for line in jd_text.splitlines() if line.strip()]
    head = " ".join(lines[:6])
    patterns = [
        r"(?:职位|岗位|招聘岗位|岗位名称)[:：]\s*([^\n，,；;｜|]+)",
        r"(Java|Python|Golang|Go|前端|后端|全栈|算法|测试|运维|数据|产品|运营|UI|Android|iOS)[^\n，,；;]{0,24}(?:工程师|开发|实习生|岗位)?",
    ]
    for pattern in patterns:
        match = re.search(pattern, head, flags=re.IGNORECASE)
        if match:
            raw = match.group(1) if match.lastindex else match.group(0)
            keyword = re.sub(r"\s+", " ", raw).strip(" ：:-")
            if keyword:
                return keyword[:40]
    return None


def run_boss_resumes(
    boss_bin: str,
    source: str,
    root: Path,
    job_keyword: str | None,
) -> dict[str, Any]:
    cmd = [
        *shlex.split(boss_bin, posix=(os.name != "nt")),
        "resumes",
        "--from",
        source,
        "--limit",
        "3",
        "--root",
        str(root),
        "--json",
    ]
    if source == "recommend" and job_keyword:
        cmd.extend(["--job", job_keyword])

    completed = subprocess.run(
        cmd,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        encoding="utf-8",
        errors="replace",
    )
    if completed.returncode != 0:
        return {
            "ok": False,
            "source": source,
            "command": cmd,
            "exit_code": completed.returncode,
            "stdout": completed.stdout,
            "stderr": completed.stderr,
            "results": [],
            "counts": {},
            "usable_count": 0,
            "errors": [completed.stderr.strip() or completed.stdout.strip() or "boss resumes failed"],
        }

    try:
        parsed = json.loads(completed.stdout)
    except json.JSONDecodeError as exc:
        return {
            "ok": False,
            "source": source,
            "command": cmd,
            "exit_code": completed.returncode,
            "stdout": completed.stdout,
            "stderr": completed.stderr,
            "results": [],
            "counts": {},
            "usable_count": 0,
            "errors": [f"boss resumes did not return valid JSON: {exc}"],
        }

    parsed["command"] = cmd
    parsed["exit_code"] = completed.returncode
    parsed["stderr"] = completed.stderr
    return parsed


def path_exists(value: str | None) -> bool:
    return bool(value) and Path(value).exists()


def validate_source_result(source_result: dict[str, Any]) -> tuple[int, list[str]]:
    errors: list[str] = []
    usable_count = 0
    for item in source_result.get("results", []):
        status = item.get("status")
        artifacts = item.get("artifacts") or {}
        resume_md = artifacts.get("resumeMarkdownPath")
        resume_json = artifacts.get("resumeJsonPath")
        if status in USABLE_STATUSES and path_exists(resume_md) and path_exists(resume_json):
            usable_count += 1
            continue
        name = item.get("candidateName") or "unknown"
        message = item.get("message") or "missing resume artifacts"
        errors.append(f"{name}: {status} - {message}")

    if usable_count != 3:
        errors.append(f"{source_result.get('source')}: expected 3 usable resumes, got {usable_count}")
    return usable_count, errors


def flatten_items(source_results: dict[str, dict[str, Any]]) -> list[dict[str, Any]]:
    items: list[dict[str, Any]] = []
    for source, result in source_results.items():
        for item in result.get("results", []):
            artifacts = item.get("artifacts") or {}
            items.append(
                {
                    "source": source,
                    "candidateName": item.get("candidateName"),
                    "candidateId": item.get("candidateId"),
                    "jobName": item.get("jobName"),
                    "jobId": item.get("jobId"),
                    "status": item.get("status"),
                    "message": item.get("message"),
                    "resumeMarkdownPath": artifacts.get("resumeMarkdownPath"),
                    "resumeJsonPath": artifacts.get("resumeJsonPath"),
                    "rawResponsePath": artifacts.get("rawResponsePath"),
                }
            )
    return items


def unique_items(items: list[dict[str, Any]]) -> list[dict[str, Any]]:
    seen: set[str] = set()
    out: list[dict[str, Any]] = []
    for item in items:
        key = item.get("candidateId") or f"{item.get('source')}:{item.get('candidateName')}"
        if key in seen:
            continue
        seen.add(key)
        out.append(item)
    return out


def write_summary(path: Path, manifest: dict[str, Any]) -> None:
    lines = [
        "# BOSS JD Resume Collection",
        "",
        f"- OK: {manifest['ok']}",
        f"- JD source: {manifest['jd']['source']}",
        f"- Job keyword: {manifest['jd'].get('job_keyword') or '(none)'}",
        f"- Resume root: {manifest['resume_root']}",
        "",
        "## Sources",
        "",
    ]
    for source in SOURCES:
        result = manifest["sources"][source]
        lines.append(
            f"- {source}: usable={result['usable_count']}/3, "
            f"downloaded={result.get('counts', {}).get('downloaded', 0)}, "
            f"skipped_existing={result.get('counts', {}).get('skipped_existing', 0)}, "
            f"missing_identifiers={result.get('counts', {}).get('missing_identifiers', 0)}, "
            f"download_failed={result.get('counts', {}).get('download_failed', 0)}"
        )
        for error in result.get("errors", []):
            lines.append(f"  - {error}")
    path.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--jd-file")
    parser.add_argument("--jd-text")
    parser.add_argument("--job-keyword")
    parser.add_argument("--boss-bin", default=os.environ.get("BOSS_BIN", "boss"))
    parser.add_argument("--resume-root", default=str(default_resume_root()))
    parser.add_argument("--runs-root", default=str(default_runs_root()))
    args = parser.parse_args()

    jd_text, jd_source = read_jd(args)
    job_keyword = (args.job_keyword or "").strip() or infer_job_keyword(jd_text)
    if not job_keyword:
        raise SystemExit("Job keyword is unclear. Pass --job-keyword before collecting resumes.")

    created_at = datetime.now().strftime("%Y%m%d_%H%M%S")
    title = job_keyword or "jd"
    runs_root = Path(args.runs_root).expanduser()
    run_dir = runs_root / f"{created_at}_{safe_segment(title)}"
    run_dir.mkdir(parents=True, exist_ok=False)

    jd_path = run_dir / "jd.md"
    jd_path.write_text(jd_text.strip() + "\n", encoding="utf-8")

    resume_root = Path(args.resume_root).expanduser()
    sources: dict[str, dict[str, Any]] = {}
    for source in SOURCES:
        result = run_boss_resumes(args.boss_bin, source, resume_root, job_keyword)
        usable_count, errors = validate_source_result(result)
        result["usable_count"] = usable_count
        result["errors"] = errors
        sources[source] = result

    items = flatten_items(sources)
    manifest = {
        "ok": all(sources[source]["usable_count"] == 3 and not sources[source]["errors"] for source in SOURCES),
        "created_at": datetime.now().isoformat(timespec="seconds"),
        "run_dir": str(run_dir),
        "resume_root": str(resume_root),
        "jd": {
            "source": jd_source,
            "path": str(jd_path),
            "job_keyword": job_keyword,
        },
        "sources": sources,
        "items": items,
        "unique_items": unique_items(items),
    }

    manifest_path = run_dir / "collection_manifest.json"
    summary_path = run_dir / "collection_summary.md"
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    write_summary(summary_path, manifest)

    print(json.dumps({
        "ok": manifest["ok"],
        "run_dir": str(run_dir),
        "manifest": str(manifest_path),
        "summary": str(summary_path),
        "job_keyword": job_keyword,
        "source_usable_counts": {source: sources[source]["usable_count"] for source in SOURCES},
    }, ensure_ascii=False, indent=2))
    return 0 if manifest["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
