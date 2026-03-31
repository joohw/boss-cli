# boss-cli

在终端里使用的 Boss 直聘沟通页自动化工具：**登录**、**候选人列表**、**打开会话**、**发送消息**，以及读取本地 `jd/` 岗位说明（纯 CLI，无 Agent 运行时）。

---

## 依赖

- Node.js **≥ 20**
- 本机 **Chrome/Chromium**（不随包下载；由 Puppeteer 连接本机浏览器）

---

## 安装与本地运行

全局安装（推荐）：

```bash
npm install -g boss-cli
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
| `boss login`                                                 | 打开登录页并等待你完成登录                     |
| `boss list-candidates [--unread]`                           | 读取「全部」聊天列表候选人；`--unread` 仅显示未读 |
| `boss open-chat <姓名> [--fuzzy]`                             | 打开指定联系人会话；默认精确匹配，`--fuzzy` 为包含匹配 |
| `boss send-message --text <内容> [--also-request-resume]`      | 发送消息；可选在发送后触发「求简历」                |
| `boss list-positions`                                        | 读取本地 `jd/` 目录下的岗位 Markdown        |


**交互模式**

- 支持单引号/双引号包裹含空格的参数。
- 输入 `help` 查看帮助，`exit` / `quit` 退出；**Ctrl+C** 正常退出，不当作错误。

---

## 数据目录

默认数据在 `~/.boss-cli/.cache/`（Cookie、缓存、浏览器用户数据目录等），细节见 `src/config.ts`。仓库内 **[AGENTS.md](./AGENTS.md)** 供自动化/协作参考。

---

## 开发脚本


| 命令              | 作用                             |
| --------------- | ------------------------------ |
| `npm run build` | `tsc` 编译到 `dist/`              |
| `npm run dev`   | 先 `build` 再执行无参 `boss`（进入交互模式） |


---

## 许可

本项目以 **GNU General Public License v3.0**（**GPL-3.0**）发布，全文见仓库根目录 [LICENSE](./LICENSE)。