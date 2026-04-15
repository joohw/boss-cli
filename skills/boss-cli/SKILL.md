---
name: boss-cli
description: >-
  Automates Boss 直聘 (zhipin.com) in a real Chrome/Edge via Puppeteer and CDP:
  login, chat list, open candidate chat, online resume screenshot, and optional
  Baidu OCR. Use when the user mentions boss-cli, Boss 直聘 automation, 招聘
  聊天, 候选人, 在线简历截图, or running the `boss` CLI.
---

# Boss 直聘 CLI (`boss-cli`)

## What this is

- **Repository**: local Node/TypeScript CLI (`boss` binary) that drives **already installed** Chrome or Edge with **puppeteer-core** (no bundled browser).
- **Not** a hosted API: the agent runs `boss` in a terminal with network access; the user must be logged in (or use `login`).

## Alignment with Anthropic “Agent Skills”

Anthropic’s open repo [anthropics/skills](https://github.com/anthropics/skills) defines skills as **folders with `SKILL.md`** (YAML frontmatter + instructions). The cross-tool spec lives at [agentskills.io](https://agentskills.io). This file follows the same **frontmatter + body** pattern so it can be reused in Cursor, Claude Code plugins, or other Agent Skills hosts.

## Agent Skill 安装路径

- **`boss skill`** 仅输出 Skill 说明，不安装；**`boss skill install`**（无附加参数）才复制到 **`~/.agents/skills/boss-cli/`**（Windows：`%USERPROFILE%\.agents\skills\boss-cli`）。**`boss skill uninstall`** 移除该目录。根目录可用 `BOSS_AGENT_SKILLS_DIR` 覆盖。

## Prerequisites

- **Build**: `npm install` then `npm run build`; entry is `dist/cli/index.js` (see `package.json` `bin`).
- **Chrome/Edge path**: set `CHROME_PATH` or `PUPPETEER_EXECUTABLE_PATH` if auto-detection fails (Windows common paths are tried).
- **Credentials**: never commit secrets. Config goes to **`%USERPROFILE%\.boss-cli\.env`** and/or **cwd `.env`** (loaded in that order; cwd overrides). Baidu OCR needs `API_KEY` + `SECRET_KEY` when `BOSS_RESUME_OCR` is enabled.

## How to run

- **Interactive REPL** (default): run `node dist/cli/index.js` or `boss` **with no arguments** → `boss> ` prompt.
- **One-shot**: `boss <subcommand> ...` (non-interactive; exits after the command).

## Subcommands (normalize short names)

| Intent | Example |
|--------|---------|
| Login | `login` |
| List candidates | `list` |
| Open chat with candidate | `chat <name>` |
| Send message / resume actions | `send ...` |
| List JD / positions | `jd` |

Exact flags and `--action` values are defined in `src/cli/cliRouter.ts` and `help` output.

## Automation notes for the agent

1. Prefer **documented env vars** over hardcoding paths; read `src/config.ts` and `src/browser/cdp_browser.ts` for directories and viewport defaults.
2. **Online resume + OCR**: flow lives in `src/toolset/open_chat.ts` and `src/ocr/`; failures should surface real errors (Baidu quota, missing keys, network).
3. **Puppeteer `evaluate`**: this project prefers **string scripts** for `page.evaluate` / `waitForFunction` to avoid build artifacts like `__name is not defined` in the browser context (see `AGENTS.md`).
4. Do not add silent fallbacks; match project rules in `AGENTS.md`.

## When not to use this skill

- Tasks that only need public web scraping without a logged-in Boss account.
- Headless-only sandboxes where Chrome cannot run or CDP cannot attach (unless the user explicitly uses headless and accepts limits).
