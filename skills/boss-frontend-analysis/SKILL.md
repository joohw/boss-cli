---
name: boss-frontend-analysis
description: Capture, archive, diff, assess, and self-repair Boss/Zhipin frontend JavaScript baselines for boss-cli safety gates and anti-debug guard updates. Use when Codex needs to fix `boss login` or other boss-cli commands disabled by “Boss 线上前端 JS 与已验证基线不一致”, re-analyze current Boss frontend scripts, compare online JS with docs/research/boss-online-js baselines, update boss_availability, or recommend code changes after Boss changes zhipin-boss, zhipin-sign, risk-detection, remoteEntry, or security scripts.
---

# Boss Frontend Analysis

Use this skill when Boss online frontend assets changed and boss-cli must decide whether to stay disabled, update the verified baseline, or change page guards. Treat the workflow as a strict self-repair run: archive first, review risk changes second, patch only accepted baselines third, then verify.

## Self-Repair Workflow

Follow this sequence when a user asks to fix `boss login` or a command fails with the Boss availability error.

1. Locate current guard state:

```bash
rg -n "boss_availability|VERIFIED_BOSS|VERIFIED_ZHIPIN|Boss CLI 已禁用|zhipin-boss/index|zhipin-sign" src docs skills
```

2. Run the capture script from the repository root. If the date directory already exists from a failed/partial capture, inspect it; use `--force` only when it is empty or intentionally being refreshed.

```bash
node skills/boss-frontend-analysis/scripts/capture_boss_frontend.mjs
node skills/boss-frontend-analysis/scripts/capture_boss_frontend.mjs --force
```

3. Read the generated `analysis.md` and `manifest.json`. Extract these values from the current snapshot:

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

If the second command prints `available`, the safety gate accepts the new baseline. If it fails with a mismatch, fix the baseline root cause; do not add bypasses or fallback logic.

## Capture-Only Workflow

Use this shorter workflow when the user only asks for analysis or a recommendation, not a repair.

1. Run the capture script from the repository root:

```bash
node skills/boss-frontend-analysis/scripts/capture_boss_frontend.mjs
```

2. Read the generated files under `docs/research/boss-online-js/<date>/`:

- `manifest.json`: captured URLs, final URLs, byte sizes, SHA-256 hashes, and source category.
- `analysis.md`: version changes, high-risk script notes, and code-change recommendations.
- `raw/`: unmodified script bodies for diffing.

3. Compare against the previous verified baseline, usually the latest dated folder under `docs/research/boss-online-js/`.

4. Inspect these repo files before recommending or changing code:

- `src/common/boss_availability.ts`
- `src/common/boss_page_guards.ts`
- `docs/anti-detection.md`
- `docs/browser-session.md`

5. Keep the policy strict:

- Do not add fallback or bypass switches for availability checks.
- If online entry pages reference unverified Boss JS versions, boss-cli must remain disabled.
- Only update `boss_availability.ts` after raw scripts are archived and the risk strategy has been reviewed.
- Puppeteer `page.evaluate` / `page.waitForFunction` additions must use string scripts, not callback functions.

## Analysis Checklist

- Chat entry page: identify current `zhipin-boss/index/v*/static/js/app.js`, `polyfill.js`, and `risk-detection.js`.
- Remote bundle: identify current `zhipin-boss/bundle/v*/static/remoteEntry.js` and downloaded chunks.
- Sign/login page: identify `zhipin-sign/v*/static/js/app.*.js`, `iframe-core.*.js`, and `vendors~app.*.js`.
- Security scripts: note `zhipin-security`, `browser-check`, Warlock, APM, MQTT, and reporting SDK version changes.
- Risk detector: search for codes such as `99001`, `99002`, `99004`, `99005`, `srcdoc`, `MutationObserver`, `isTrusted`, `sendAction`, and security redirects.
- Sign vendor anti-debug: search for `debugger`, `Function(`, `constructor`, `setInterval`, `console`, `devtools`, and obfuscated modules around those hits.
- Guard coverage: verify request-blocking patterns in `boss_page_guards.ts` still cover risk scripts and security redirects.

## Output Guidance

When reporting results, include:

- Current online versions and whether they match the verified baseline.
- Whether boss-cli should remain disabled.
- Exact files or constants that need updates.
- Any selectors, request patterns, or script guards that changed.
- Build and runtime checks performed.
