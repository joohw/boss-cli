---
name: boss-login-self-repair
description: Diagnose and self-repair boss-cli login failures caused by Boss/Zhipin frontend JavaScript baseline changes. Use when Codex needs to fix `boss login` or other boss-cli commands disabled by “Boss 线上前端 JS 与已验证基线不一致”, archive current Boss frontend scripts, review anti-debug/risk diffs, update `src/common/boss_availability.ts`, and verify the login safety gate after Boss changes zhipin-boss, zhipin-sign, risk-detection, remoteEntry, or security scripts.
---

# Boss Login Self-Repair

Use this skill inside the `boss-cli` repository when `boss login` is blocked because Boss online frontend assets no longer match the verified safety baseline. Keep the repair strict: update git first, validate before changing, archive and review risk changes only if validation fails, patch only accepted baselines, validate again, then commit with a Chinese git message.

## Git-First Policy

Always run the git workflow before changing code unless the user explicitly says not to commit.

1. Inspect the working tree:

```bash
git status --short
```

- Do not overwrite, reset, stash, or stage unrelated user changes without explicit permission.
- If unrelated changes exist, continue only when the repair can be isolated and later staged by exact path.

2. Update the current branch with a fast-forward only pull:

```bash
git pull --ff-only
```

- If this fails, stop and expose the git error. Do not merge, rebase, or add workaround commits unless the user explicitly asks.

3. Validate before repair:

```bash
npm run build
node -e "import('./dist/common/boss_availability.js').then(m=>m.assertBossCliAvailable()).then(()=>console.log('available'))"
```

- If both commands pass, report that no repair is needed and do not commit.
- If build fails for an unrelated reason, report the failure and do not change the Boss baseline.
- If the availability command fails with the Boss frontend baseline mismatch, proceed with the self-repair workflow.

4. After repair, validate again with the same commands. Only commit if validation passes.

5. Stage only repair-related paths, for example:

```bash
git add src/common/boss_availability.ts docs/anti-detection.md docs/research/boss-online-js/<date>
```

6. Commit with a Chinese commit message:

```bash
git commit -m "修复 Boss 登录前端基线"
```

- Git commit messages and final git-related summaries must use Chinese.
- Do not include unrelated files in the commit.

## Self-Repair Workflow

Follow this sequence when a user asks to fix `boss login` or a command fails with the Boss availability error.

1. Locate current guard state:

```bash
rg -n "boss_availability|VERIFIED_BOSS|VERIFIED_ZHIPIN|Boss CLI 已禁用|zhipin-boss/index|zhipin-sign" src docs skills
```

2. Capture current Boss frontend scripts from the repository root. If the date directory already exists from a failed or partial capture, inspect it; use `--force` only when it is empty or intentionally being refreshed.

```bash
node /Users/chenmeng/.codex/skills/boss-login-self-repair/scripts/capture_boss_frontend.mjs
node /Users/chenmeng/.codex/skills/boss-login-self-repair/scripts/capture_boss_frontend.mjs --force
```

3. Read the generated `docs/research/boss-online-js/<date>/analysis.md` and `manifest.json`. Extract:

- Boss index version and entry URLs: `polyfill.js`, `app.js`, `risk-detection.js`.
- Boss bundle version and `remoteEntry.js` URL.
- Zhipin sign version and entry URLs: `app.*.js`, `iframe-core.*.js`, `vendors~app.*.js`.
- SHA-256 hashes for every guarded URL in `src/common/boss_availability.ts`.

4. Compare against the previous verified baseline. Prefer normalization checks for version-only churn:

- Normalize `zhipin-boss/index/v*`, `zhipin-boss/bundle/v*`, and `zhipin-sign/v*` paths before comparing high-risk files.
- Confirm `risk-detection.js`, sign `vendors~app`, and sign `iframe-core` have no semantic/high-risk changes, or explicitly document the changes.
- Review high-risk hits for `99001`, `99002`, `99004`, `99005`, `srcdoc`, `MutationObserver`, `isTrusted`, `sendAction`, `Function(`, `constructor`, `setInterval`, `console`, `devtools`, `security`, and `403.html`.

5. Inspect guard coverage before patching:

- `src/common/boss_page_guards.ts` must still block observed risk/security scripts and risky navigation/report URLs.
- Do not broaden guards blindly. Add or change patterns only when the new snapshot contains a concrete uncovered risk URL.
- Keep Puppeteer `page.evaluate` / `page.waitForFunction` additions as string scripts, never callback functions.

6. Patch only the accepted baseline:

- Update `VERIFIED_CAPTURE_LABEL`, `VERIFIED_BOSS_INDEX_VERSION`, `VERIFIED_BOSS_BUNDLE_VERSION`, and `VERIFIED_ZHIPIN_SIGN_VERSION` in `src/common/boss_availability.ts`.
- Update `REQUIRED_ENTRY_SCRIPT_URLS`, `REQUIRED_LOGIN_SCRIPT_URLS`, and guarded URL/hash pairs in `GUARDED_SCRIPT_HASHES`.
- Add a dated baseline review at the top of `docs/anti-detection.md` with version changes, hash-change summary, normalized comparison result, and guard coverage decision.

7. Validate with the narrowest useful checks:

```bash
npm run build
node -e "import('./dist/common/boss_availability.js').then(m=>m.assertBossCliAvailable()).then(()=>console.log('available'))"
```

If the second command prints `available`, the login safety gate accepts the new baseline. If it fails with a mismatch, fix the baseline root cause; do not add bypasses, fallback logic, or environment switches.

## Guardrails

- Do not add fallback logic or bypass switches for availability checks.
- If online entry pages reference unverified Boss JS versions, boss-cli must remain disabled until capture and review are complete.
- Only update `boss_availability.ts` after raw scripts are archived and the risk strategy has been reviewed.
- Do not mask root causes with glue code; expose clear errors with concrete script URLs and hashes.

## Output Guidance

When reporting results, include:

- Current online versions and whether they match the verified baseline.
- Whether `boss login` should remain disabled or can be re-enabled.
- Exact files/constants updated.
- Any selectors, request patterns, or script guards that changed.
- Build and runtime checks performed.
