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
| `boss login`                                                 | 打开登录页并等待你完成登录                     |
| `boss list-candidates [--unread]`                           | 读取「全部」聊天列表候选人；`--unread` 仅显示未读 |
| `boss open-chat <姓名> [--strict]`                            | 打开指定联系人会话；默认包含匹配，`--strict` 为精确匹配 |
| `boss send-message --text <内容> [--also-request-resume]`      | 发送消息；可选在发送后触发「求简历」                |
| `boss list-positions`                                        | 读取本地 `~/.boss-cli/jd` 目录下的岗位 Markdown |


**交互模式**

- 支持单引号/双引号包裹含空格的参数。
- 输入 `help` 查看帮助，`exit` / `quit` 退出；**Ctrl+C** 正常退出，不当作错误。

---

## 数据目录

默认数据在 `~/.boss-cli/.cache/`（Cookie、缓存、浏览器用户数据目录等），细节见 `src/config.ts`。仓库内 **[AGENTS.md](./AGENTS.md)** 供自动化/协作参考。

---

## 浏览器是否自动关闭

默认情况下，`boss` **不会**在命令执行结束后关闭浏览器窗口（方便你继续手动操作页面）。

如果你希望命令执行完后**自动关闭**由本工具启动/连接的浏览器进程（避免残留进程），请在运行前设置环境变量：

```bash
# macOS/Linux
export BOSS_BROWSER_AUTO_CLOSE=1

# Windows PowerShell
$env:BOSS_BROWSER_AUTO_CLOSE="1"
```

---

## Headless / Headful（是否显示浏览器窗口）

- **除 `boss login` 之外**：默认 **headless**（不显示窗口）。
- **`boss login`**：强制 **headful**（显示窗口，便于你扫码/验证/手动登录）。
- 如果你希望其它命令也显示窗口：设置环境变量 `bosscliheadful=1`。

```bash
# macOS/Linux
export bosscliheadful=1

# Windows PowerShell
$env:bosscliheadful="1"
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