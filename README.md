# boss-cli — Boss直聘自动化 CLI | 批量发消息 · 自动打招呼 · AI Agent 招聘工具

[![npm version](https://img.shields.io/npm/v/@joohw/boss-cli)](https://www.npmjs.com/package/@joohw/boss-cli)
[![npm downloads](https://img.shields.io/npm/dm/@joohw/boss-cli)](https://www.npmjs.com/package/@joohw/boss-cli)
[![license](https://img.shields.io/github/license/joohw/boss-cli)](./LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/joohw/boss-cli)](https://github.com/joohw/boss-cli)

官网主页：[boss-cli.com](https://boss-cli.com)

**boss-cli**（`@joohw/boss-cli`）是开源的 **Boss直聘自动化命令行工具**。基于 Puppeteer / CDP 协议驱动本机 Chrome，无需 Selenium，把 Boss直聘 B 端的核心 HR 操作搬进终端：**候选人列表**、**批量发消息**、**自动打招呼**、**在线简历预览**、**深度搜索**、**职位管理**。

适合 HR 日常提效，也适合 Claude / GPT / Gemini 等 **AI Agent** 通过子进程调用，搭建全自动化招聘流水线。

```bash
npm install -g @joohw/boss-cli@latest
boss login
boss help
```

> 纯 CLI，不内置对话式 Agent。每条命令输出结构化纯文本，Agent 可直接解析并编排多步流程。

---

## 为什么选择 boss-cli？

| 场景 | 命令 |
| --- | --- |
| Boss直聘批量发消息 | `boss send --text "..."` 配合脚本循环 |
| Boss直聘自动打招呼 | `boss greet <姓名> [--job <岗位>]` |
| Boss直聘候选人筛选 | `boss list` / `boss list --unread` |
| Boss直聘脚本自动化 | 本机 Chrome + CDP，Cookie 本地存储 |
| AI 招聘 Agent | 子进程调用，输出 Agent 友好 |
| 数据隐私 | 不经过第三方服务器，数据在 `~/.boss-cli/` |

---

## 安装

**要求**：Node.js ≥ 20，本机已安装 Chrome / Chromium。

```bash
npm install -g @joohw/boss-cli@latest
boss help
```

如果你觉得 boss-cli 好用，欢迎给本仓库一个 Star；使用中遇到问题请提交 Issue，新功能或改进也欢迎提交 PR。

> **macOS / Linux 权限问题**：系统 Node 默认全局前缀在 `/usr/local`，当前账户无写权限。建议先把全局前缀挪到用户目录（一次性配置）：
>
> ```bash
> mkdir -p ~/.npm-global
> npm config set prefix ~/.npm-global
> echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc   # bash 用 ~/.bash_profile
> source ~/.zshrc
> ```
>
> 使用 `fnm` / `nvm` / `volta` 的用户可跳过此步。Windows 用户无需此步。

---

## 命令一览

| 命令 | 说明 |
| --- | --- |
| `boss login` | 打开 Boss直聘登录页（扫码/验证后手动完成） |
| `boss update` | 通过 npm 安装最新版 boss-cli |
| `boss list [--unread]` | 读取聊天列表；`--unread` 仅未读 |
| `boss chat <姓名> [--strict]` | 打开指定候选人会话 |
| `boss chat [姓名] --index <序号> [--unread] [--strict]` | 按 `boss list` 输出序号打开会话；同名候选人建议用序号 |
| `boss send [--text <内容>]` | 向当前会话发送消息 |
| `boss action <操作>` | 索要简历 / 不合适 / 备注 / 交换微信等 |
| `boss recommend [岗位关键字]` | 读取推荐候选人列表 |
| `boss search [关键词]` | 常规搜索牛人列表 |
| `boss greet <姓名> [--job <岗位>]` | 在当前推荐/深度搜索页对候选人打招呼（不会自动跳转） |
| `boss preview <姓名>` | 在线简历预览（每日次数有限） |
| `boss deep-search [岗位关键字] [--core <要求>] [--bonus <加分项>] [--clear-core] [--clear-bonus] [--match]` | 深度搜索表单状态；`--core` / `--bonus` 可重复，并按传入列表同步分组；`--clear-*` 清空分组；默认不输出候选列表，`--match` 输出最新 20 条 |
| `boss positions` | 读取职位列表 |
| `boss jd <名称>` | 抓取职位 JD 缓存到本地 |

完整用法：`boss help`

---

## 快速上手

```bash
# 1. 登录
boss login

# 2. 查看未读候选人
boss list --unread

# 3. 打开会话并发送消息
boss chat 张三
boss send --text "您好，请问方便发一下简历吗？"

# 同名或姓名定位失败时，按 list 序号打开；--unread 对应 list --unread 的序号
boss chat --index 2 --unread
boss chat 张三 --index 2 --unread --strict

# 4. 先进入推荐页，再在当前页打招呼
boss recommend 前端工程师
boss greet 张三 --job 前端工程师

# 5. 常规搜索牛人
boss search "langgraph"

# 6. 深度搜索：按传入列表同步分组条件，但不消耗匹配次数
boss deep-search --core "AI产品经理" --core "做过 RAG 或 Agent 产品落地" --bonus "有 ToB 平台经验"

# 只有明确添加 --match 才会点击「立即匹配」，会消耗今日匹配次数，并只输出最新 20 条
boss deep-search --match
```

---

## 在线简历 OCR

`boss action resume` 与 `boss preview <姓名>` 会先保存在线简历截图；默认开启 OCR，结果写入 `~/.boss-cli/.cache/ocr/`。如只需要截图地址，可关闭 OCR：

```bash
BOSS_RESUME_OCR=0 boss action resume
```

OCR 服务商通过 `BOSS_RESUME_OCR_PROVIDER` 显式选择；不做自动回退。未设置时保持兼容，使用 `baidu`。

```bash
# 火山引擎 OCR（OCRNormal）
boss _volcengine-keys --access-key <AccessKeyId> --secret-key <SecretAccessKey>
boss action resume

# 或手动配置
export BOSS_RESUME_OCR_PROVIDER=volcengine
export BOSS_VOLCENGINE_ACCESS_KEY=<AccessKeyId>
export BOSS_VOLCENGINE_SECRET_KEY=<SecretAccessKey>
```

百度 OCR 仍可通过 `BOSS_RESUME_OCR_PROVIDER=baidu` 与 `BOSS_BAIDU_API_KEY` / `BOSS_BAIDU_SECRET_KEY` 使用。

---

## 与 AI Agent 集成

boss-cli 每条命令输出纯文本，适合 LLM 通过子进程编排：

```
1. boss list --unread     → 获取未读候选人
2. boss chat <姓名>       → 打开会话
   同名时用 boss chat [姓名] --index <序号> [--unread]
3. boss action resume     → 索要简历
4. boss send -t "..."     → 发送消息
5. boss recommend         → 读取推荐列表
6. boss search <关键词>   → 读取常规搜索列表
7. boss greet <姓名>      → 批量打招呼
```

详见 [AGENTS.md](./AGENTS.md)。

---

## 常见问题

**boss-cli 是什么？**
开源 Boss直聘自动化 CLI，用终端命令代替手动操作 Boss直聘网页，支持 AI Agent 编排。

**和 Selenium / Playwright 有什么区别？**
boss-cli 基于 CDP 连接本机 Chrome，复用已有登录态，针对 Boss直聘 B 端页面做了专用封装，开箱即用。

**需要额外下载浏览器吗？**
不需要。使用本机已安装的 Chrome / Chromium，通过 CDP 协议连接。

**数据会上传到服务器吗？**
不会。Cookie 和缓存仅存储在本地 `~/.boss-cli/`，CLI 不经过任何第三方服务器。

**如何无头模式运行？**
设置环境变量 `BOSS_BROWSER_HEADLESS=true`（默认 headful，便于扫码登录）。

**如何自定义操作蒙层品牌？**
设置环境变量 `BOSS_CLI_AGENT_BRAND=你的品牌名`。

---

## 数据目录

| 路径 | 内容 |
| --- | --- |
| `~/.boss-cli/.cache/` | Cookie、浏览器用户数据 |
| `~/.boss-cli/jd/` | `boss jd` 缓存的岗位描述 |

---

## 开发

```bash
npm run build   # 编译到 dist/
npm run dev     # build + 交互模式
```

---

## 发布

仓库通过 GitHub Actions 自动发布，工作流文件是 `.github/workflows/tag-publish.yml`。

发布新版本时，本地只需要更新 `package.json` 版本号、提交代码、创建并推送 `v*` tag：

```bash
git tag -a v0.6.0 -m "v0.6.0"
git push origin main
git push origin v0.6.0
```

tag 推送后，workflow 会自动安装依赖、构建、检查 npm 版本、发布 `@joohw/boss-cli`、更新 `latest` dist-tag，并创建或更新 GitHub Release。npm 发布依赖仓库 Secret `NPM_TOKEN`，本地不需要手动执行 `npm publish`。

---

## 许可

[GPL-3.0](./LICENSE)

---

## 相关链接

- 官网：[boss-cli.com](https://boss-cli.com)
- npm：[@joohw/boss-cli](https://www.npmjs.com/package/@joohw/boss-cli)
- GitHub：[joohw/boss-cli](https://github.com/joohw/boss-cli)
- 问题反馈：[Issues](https://github.com/joohw/boss-cli/issues)
