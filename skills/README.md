# 公开 Agent Skill（本包唯一）

本目录仅含 **`boss-cli/`** 一处，与 [Anthropic Agent Skills](https://github.com/anthropics/skills) 格式一致，随 npm 包发布。

```bash
boss skill              # 仅打印 Skill 说明（不安装）
boss skill install      # 安装到 ~/.agents/skills/boss-cli/
boss skill uninstall    # 移除该目录
```

可用环境变量 **`BOSS_AGENT_SKILLS_DIR`** 指定安装根目录（默认为用户目录下的 `.agents/skills`）。
