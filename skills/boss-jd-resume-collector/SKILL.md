---
name: boss-jd-resume-collector
description: 当用户想输入 JD/岗位描述并采集 BOSS 直聘候选人简历用于后续匹配时使用本 skill，例如“输入 JD 找合适简历”、“BOSS 简历采集”、“根据 JD 收集候选人”、“先采集候选人简历”。本 skill 只编排 boss-cli 采集简历，不做 JD/简历匹配、排序或推荐。
---

# BOSS JD 简历采集

## 目标

根据一份 JD，在本机采集 BOSS 直聘简历数据，供后续离线匹配使用。v1 只负责采集、校验和生成清单，不给候选人打分、不排序、不推荐。

## 前置条件

- `boss` 命令可用：优先使用 `--boss-bin`，其次使用 `BOSS_BIN`、PATH，Windows 下还会检查 npm 全局的 `boss.cmd`。
- 当前 `boss-cli` 使用的浏览器会话已经登录 BOSS。
- deep-search 来源会显式执行一次真实深搜匹配：`boss resumes --from deep-search --job <keyword> --search`，可能消耗 BOSS 匹配次数。

## 工作流程

1. 接收或保存用户提供的 JD 文本。
2. 从 JD 标题或正文中识别岗位关键词。如果关键词不明确，先向用户确认准确岗位关键词，不要盲目采集。
3. 调用 skill 自带采集脚本：

```bash
python "<skill_dir>/scripts/collect_boss_resumes.py" --jd-file "<jd.md>" --job-keyword "<keyword>"
```

也可以直接传入 JD 文本：

```bash
python "<skill_dir>/scripts/collect_boss_resumes.py" --jd-text "<JD text>" --job-keyword "<keyword>"
```

脚本会先做采集前自检：

```bash
boss help
boss recommend <keyword>
boss deep-search <keyword>
boss resumes --from chat --limit 1 --json
```

自检通过后，脚本严格执行三路采集：

```bash
boss resumes --from chat --limit 3 --json
boss resumes --from recommend --limit 3 --json --job <keyword>
boss resumes --from deep-search --limit 3 --json --job <keyword> --search
```

## 成功标准

- `chat`、`recommend`、`deep-search` 每个来源都必须有 3 份可用简历。
- 可用状态只包括 `downloaded` 和 `skipped_existing`。
- 每条可用结果都必须能找到本地 `resume.md` 和 `resume.json`。
- 任一来源不足 3 份时，本轮采集视为失败；但仍要报告失败来源、失败分类、候选人级错误，以及已经落地的可用简历总数。

## 输出

脚本会在下面目录生成一次 run：

```text
~/.boss-cli/runs/<timestamp>_<safe_jd_title>/
```

文件说明：

- `jd.md`：本轮采集使用的 JD。
- `collection_manifest.json`：机器可读的采集清单。
- `collection_summary.md`：给人看的中文摘要。

后续匹配逻辑只能读取 `jd.md`、`collection_manifest.json`，以及 manifest 中列出的本地 `resume.md` / `resume.json` 文件。匹配阶段不要再实时访问 BOSS。

失败 run 也可能包含已成功落地的简历；后续匹配只消费 manifest 中状态为 `downloaded` 或 `skipped_existing` 且本地文件存在的条目。

## 安全约束

- 不给候选人发消息。
- 不修改职位状态。
- v1 不扩大每来源 3 份的采集范围。
- 下载的简历属于敏感招聘数据，按私密数据处理。
