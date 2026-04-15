# boss-cli

在终端里使用的 Boss 直聘沟通页自动化工具：**登录**、**候选人列表**、**打开会话**、**发送消息**，以及读取本地 `~/.boss-cli/jd` 岗位说明（纯 CLI，无 Agent 运行时）。

---

## 依赖

- Node.js **≥ 20**
- 本机 **Chrome/Chromium**（不随包下载；由 Puppeteer 连接本机浏览器）

---

## 安装与本地运行

全局安装（推荐）：

```bash
npm install -g @joohw/boss-cli
```

安装后使用：

```bash
boss help
```

从源码：

```bash
npm install
npm run build
```

构建产物入口为 `dist/cli/index.js`，等价于命令 `boss`（见 `package.json` 的 `bin`）。

---

## 命令

与 `boss help` 一致：


| 用法                                                           | 说明                                |
| ------------------------------------------------------------ | --------------------------------- |
| `boss`                                                       | 交互模式                              |
| `boss help`                                                  | 打印帮助                              |
| `boss login`                                                 | 打开登录页（不校验登录状态；需自行完成登录）   |
| `boss list [--unread]`                                       | 读取「全部」聊天列表候选人；`--unread` 仅显示未读 |
| `boss chat <姓名> [--strict]`                                 | 打开指定联系人会话；默认包含匹配，`--strict` 为精确匹配 |
| `boss send [--text <内容>] [--action <…>]` | 可只发消息、只执行 action，或**两者同次**（先发消息再 action，步骤间默认随机间隔）；`request-resume` \| `agree-resume` \| `confuse-resume`（拒绝附件） |
| `boss jd`                                                    | 读取本地 `~/.boss-cli/jd` 目录下的岗位 Markdown |

旧名仍可用：`list-candidates`、`open-chat`、`send-message`、`list-positions`。

**交互模式**

- 支持单引号/双引号包裹含空格的参数。
- 输入 `help` 查看帮助，`exit` / `quit` 退出；**Ctrl+C** 正常退出，不当作错误。

---

## 数据目录

默认数据在 `~/.boss-cli/.cache/`（Cookie、缓存、浏览器用户数据目录等），细节见 `src/config.ts`。仓库内 **[AGENTS.md](./AGENTS.md)** 供自动化/协作参考。

---

## 浏览器生命周期

命令结束（含一次性子命令）时**不会**关闭浏览器窗口：CLI 只断开与浏览器的 CDP 连接，便于 Node 进程退出，浏览器进程仍保留；需要时请自行关闭窗口。

交互模式（无参数 `boss`）退出时同样**不会**关闭浏览器。

---

## Headless / Headful（是否显示浏览器窗口）

- 默认 **headful**（显示浏览器窗口）。
- **`boss login`**：同样为有头（便于扫码/验证/手动登录）。
- 若希望其它命令**无头**运行：设置环境变量 `BOSS_BROWSER_HEADLESS=true`（或 `1` / `yes`）。

```bash
# macOS/Linux
export BOSS_BROWSER_HEADLESS=true

# Windows PowerShell
$env:BOSS_BROWSER_HEADLESS="true"
```

---

## 开发脚本


| 命令              | 作用                             |
| --------------- | ------------------------------ |
| `npm run build` | `tsc` 编译到 `dist/`              |
| `npm run dev`   | 先 `build` 再执行无参 `boss`（进入交互模式） |


---

## 许可

本项目以 **GNU General Public License v3.0**（**GPL-3.0**）发布，全文见仓库根目录 [LICENSE](./LICENSE)。