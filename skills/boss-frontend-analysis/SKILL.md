---
name: boss-frontend-analysis
description: Capture, archive, diff, and assess Boss/Zhipin frontend JavaScript for boss-cli safety gates and anti-debug guard updates. Use when Codex needs to re-analyze current Boss frontend scripts, compare online JS with docs/research/boss-online-js baselines, update boss_availability, or recommend code changes after Boss changes zhipin-boss, zhipin-sign, risk-detection, remoteEntry, or security scripts.
---

# Boss Frontend Analysis

Use this skill when Boss online frontend assets changed and boss-cli must decide whether to stay disabled, update the verified baseline, or change page guards.

## Workflow

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
- If online entry pages reference unverified Boss JS, hold releases until the review passes. Normal CLI commands do not run the check.
- Only update `boss_availability.ts` after raw scripts are archived and the risk strategy has been reviewed.
- Run `npm run check:boss-frontend` to verify the release baseline against the live entry scripts and their actual remote bundle.
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
- Whether the release baseline passes, separate from normal CLI behavior.
- Exact files or constants that need updates.
- Any selectors, request patterns, or script guards that changed.
- Build and runtime checks performed.
