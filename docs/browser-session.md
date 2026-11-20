# 浏览器连接与会话管理

## 架构概览

```
src/browser/
├── cdp_browser.ts      # Chrome 启动 + CDP 连接
├── browser_session.ts  # 浏览器/页面引用 & 会话生命周期
└── timing.ts           # sleep / random 工具

src/common/
└── boss_session_page.ts  # Boss 页面壳：导航、侧栏检测、安全拦截
```

## 连接流程

### 1. connectBrowser() — `src/browser/cdp_browser.ts`

```
connectBrowser()
  │
  ├── 第1步：HTTP 探测固定调试端口（800ms 超时）
  │    └── GET http://127.0.0.1:53470/json/version
  │         200 → puppeteer.connect(webSocketDebuggerUrl)        ← 复用已有 Chrome
  │         非 200 / 不通 → 继续第2步
  │
  ├── 第2步：spawn 新 Chrome 进程
  │    ├── 启动参数：
  │    │   --remote-debugging-port=53470       ← 固定端口，跨命令复用
  │    │   --disable-infobars
  │    │   --js-flags=--noexpose_wasm          ← 默认禁 WebAssembly
  │    │   --user-data-dir=~/.boss-cli/.cache/browser-data
  │    ├── 等 stdout 出现 "DevTools listening on ws://..."
  │    └── puppeteer.connect(wsUrl)
  │
  └── 返回 Browser 句柄
```

**关键设计**：
- `spawn` + `connect` 而非 `puppeteer.launch()`，避免 Node 退出时浏览器被 kill
- `proc.unref()` 让 Node 进程不因 Chrome 子进程存活而阻塞退出
- 端口 53470 是 boss-cli 独立 user-data-dir 上的稳定占用，可用 `BOSS_BROWSER_REMOTE_DEBUGGING_PORT` 覆盖；不再依赖 `DevToolsActivePort` 这种二级状态文件
- 第2步若进程在拿到 stdout 之前就以代码 0 退出，说明 user-data-dir 被另一只「无远程调试端口」的 Chrome 占用，单例锁触发 spawn 把命令行交还给它后立即退出 —— 此时直接抛错，不再做兜底

### 2. ensureBrowserSession() — `src/browser/browser_session.ts`

```
ensureBrowserSession()
  │
  ├── browserRef 已连接 & pageRef 活着
  │    ├── page URL 是 about:blank → pickOrCreatePage 换到 zhipin 页面
  │    └── 直接返回（复用现有会话）
  │
  ├── browserRef 已连接 & pageRef 死了
  │    └── pickOrCreatePage 重新选页
  │
  └── browserRef 断开
       └── establishSession()
            ├── 关闭旧 browser 连接
            ├── connectBrowser()
            ├── pickOrCreatePage(browser)
            │    ├── 优先 zhipin.com 页面
            │    ├── 其次任何非 about:blank 页面
            │    └── 最后 newPage()
            └── 关掉多余的 blank 页面
```

### 3. withBossSessionPage() — `src/common/boss_session_page.ts`

```
withBossSessionPage(callback)
  │
  ├── ensureBrowserSession()           ← 获取健康的浏览器+页面
  ├── getPageRef() / pickExistingPage  ← 确认为 zhipin.com 页面
  ├── page.bringToFront()
  │
  ├── installBossPageGuards(page)      ← 同一会话内每个 Page 安装一次
  │   ├── evaluateOnNewDocument() 注册脚本，当前文档也立即尝试注入
  │   ├── navigator.webdriver → false
  │   ├── navigator.languages 为空时 → ['zh-CN','zh','en']
  │   ├── 尝试包装 window.close()（本机 Chrome 未替换成功）
  │   ├── history.back() / forward() / go(n<0) → no-op
  │   ├── 尝试包装 Location 上可修改的导航入口
  │   └── 默认让 console.clear() 不清屏，并简化 console 对象参数
  │
  ├── CDP 拦截（同一会话内每个 Page 安装一次）：
  │   ├── Network.setCacheDisabled     ← 禁用 HTTP 缓存
  │   └── Fetch.enable patterns:       ← 请求阶段拦截安全文件、风险跳转和检测上报
  │        *zhipin-security/web/boss/*       (aegis_bg.wasm, index.js)
  │        *zhipin-boss*risk-detection*      (risk-detection.js)
  │        *bosszhipin.com/static/zhipin/geek/sdk/*  (browser-check等)
  │        *logapi.zhipin.com/dap/api/json*  (返回 204)
  │        *apm-fe.zhipin.com/wapi/zpApm/*   (返回 204)
  │        Passport 风险页精确列表           (含 CM security.html 与 security-check.html)
  │
  ├── framenavigated 主框架守卫       ← 若落到 about:blank / 403 / verify / passport，则回到沟通页
  │
  ├── 按命令选项校验沟通页 URL 和侧栏状态
  └── callback(page)                   ← 执行具体命令（list/chat等）
```

页面注入与 CDP 请求拦截都在 `src/common/boss_page_guards.ts`。守卫只影响已安装页面中的脚本、匹配的请求和导航；账号状态、服务端限流和服务端响应仍由平台决定。`npm run check:boss-frontend` 是独立的发布验收，普通命令不会自动执行。

## 跨命令复用

```
boss chat 张三
  → 探测 127.0.0.1:53470/json/version → 不通
  → spawn Chrome（--remote-debugging-port=53470）
  → 等 stdout: DevTools listening on ws://127.0.0.1:53470/devtools/browser/<uuid>
  → puppeteer.connect(wsUrl)

boss list
  → 探测 127.0.0.1:53470/json/version → 200，拿到 webSocketDebuggerUrl
  → puppeteer.connect(已有 Chrome)        ← 不 spawn 新进程
  → pickOrCreatePage → 复用 zhipin 页面
  → page.goto(chat/index) → 导航

boss chat 李四
  → 同上，继续复用
```

同一 `userDataDir` 的所有命令共享：
- 同一 Chrome 进程
- 同一登录态（cookies/localStorage）
- 同一 `--remote-debugging-port=53470`

## 调试注意事项

Boss 主包中存在反 DevTools / 反篡改逻辑，可能通过 `console.log` / `console.table` 副作用、`console.clear()`、快捷键拦截、打印大对象耗时、原生对象完整性检查等方式判断 DevTools 是否打开。

自动化命令执行时，不建议手动打开页面 DevTools。需要排查页面行为时，优先使用 CDP 事件、Network initiator、外部日志或截图；如果必须打开 DevTools，应预期页面可能触发检测上报、清空控制台、跳转、隐藏页面或关闭/回退页面。
