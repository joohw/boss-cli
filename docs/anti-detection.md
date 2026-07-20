# Boss 反自动化检测：防御策略文档

## 2026-07-20 baseline review

- Captured snapshot: `docs/research/boss-online-js/2026-07-20`.
- Boss index changed from `v10741` to `v10753`; Boss bundle changed from `v6237` to `v6240`; Zhipin sign stayed `v5312`.
- Same-URL hash changes: 0. After normalizing versioned paths, `risk-detection.js`, `polyfill.js`, and `remoteEntry.js` matched the previous baseline; all three Zhipin sign guarded scripts were byte-identical. The Boss app bootstrap changed only versioned asset references plus webpack chunk/module ids (`575` to `613` and related ids), with no new high-risk behavior.
- Guarded hashes were updated for Boss index `app.js`, `polyfill.js`, `risk-detection.js`, and Boss bundle `remoteEntry.js`; Zhipin sign hashes stayed unchanged.
- `src/common/boss_page_guards.ts` still covers the observed `zhipin-security`, `risk-detection`, `bosszhipin.com/static/zhipin/geek/sdk`, risk navigation, and report URLs in this snapshot; no guard change was required.

## 2026-07-16 baseline review

- Captured snapshot: `docs/research/boss-online-js/2026-07-16`.
- Boss index changed from `v10723` to `v10741`; Boss bundle changed from `v6232` to `v6237`; Zhipin sign changed from `v5310` to `v5312`.
- Same-URL hash changes: 0. After normalizing versioned paths, `risk-detection.js`, `remoteEntry.js`, and `iframe-core` matched the previous baseline; `boss app` and `vendors~app` changed only in versioned asset references/minified bytes, with high-risk pattern counts unchanged.
- Guarded hashes were updated for Boss index `app.js`, `polyfill.js`, `risk-detection.js`, Boss bundle `remoteEntry.js`, and Zhipin sign `app`/`vendors~app`; `iframe-core` hash stayed unchanged.
- `src/common/boss_page_guards.ts` still covers observed `zhipin-security`, `risk-detection`, `bosszhipin.com/static/zhipin/geek/sdk`, risk navigation, and report URLs in this snapshot; no guard change was required.

## 2026-07-15 baseline review

- Captured snapshot: `docs/research/boss-online-js/2026-07-15`.
- Boss index changed from `v10718` to `v10723`; Boss bundle changed from `v6230` to `v6232`; Zhipin sign changed from `v5309` to `v5310`.
- Same-URL hash changes: 0. After normalizing versioned paths, `risk-detection.js`, `polyfill.js`, `remoteEntry.js`, `iframe-core`, and `vendors~app` matched the previous baseline; entry app bootstraps changed chunk/module ids and the sign app CSS/app hash changed.
- `src/common/boss_availability.ts` was updated with the new Boss index, Boss bundle, and Zhipin sign entry scripts plus guarded hashes.
- `src/common/boss_page_guards.ts` request guards still cover the observed risk/security/report URLs in this snapshot; no guard change was required.

## 2026-07-13 baseline review

- Captured snapshot: `docs/research/boss-online-js/2026-07-13`.
- Boss index changed from `v10641` to `v10687`; Boss bundle changed from `v6202` to `v6214`; Zhipin sign stayed `v5309`.
- Same-URL hash changes: 0. Risk pattern categories matched the 2026-07-09 baseline.
- `src/common/boss_availability.ts` was updated with the new Boss index and bundle entry scripts plus guarded hashes.
- `src/common/boss_page_guards.ts` request guards still cover the observed risk/security/report URLs in this snapshot.

## 2026-07-09 baseline review

- Captured snapshot: `docs/research/boss-online-js/2026-07-09`.
- Boss index changed from `v10609` to `v10641`; Boss bundle stayed `v6202`; Zhipin sign stayed `v5309`.
- Same-URL hash changes: 0. Risk pattern categories matched the 2026-07-08 baseline.
- `src/common/boss_availability.ts` was updated with the new Boss index entry scripts and guarded hashes.
- `src/common/boss_page_guards.ts` request guards still cover the observed risk/security/report URLs in this snapshot.

## 概述

Boss 直聘的前端安全体系由多个检测模块组成，在 CDP 控制的浏览器中打开页面时，其安全模块会通过多种手段判断浏览器是否被自动化控制，并在检测到后执行数据上报、关闭/跳转/返回上一页等破坏性操作。本文档分两部分描述：

1. **第一部分（§一）**：单独梳理 Boss 的**反调试 / 反 DevTools 行为**——这是当前最容易被用户手动触发、也是历史上踩坑最多的检测面。
2. **第二部分（§二）**：按风险面从高到低梳理 Boss 前端的所有检测/上报模块，**主包**（最危险、是反调试和跳转触发的总入口）放在最前。

后续章节描述当前已落地的三层防御措施、完整执行时序、未实现的补强策略、涉及修改的文件以及可调环境变量。

---

## 一、Boss 反调试 / 反 DevTools 行为详解

> 反调试逻辑物理上位于「主包」（`zhipin-sign/.../vendors~app.*.js`，混淆模块特征 `VXjk` 一类）里，
> 与反篡改、跳转触发是同一个 webpack 包的不同模块。本章节聚焦反调试这一面；主包的其余能力（对象
> 完整性校验、上报通道、跳转触发）见 §二.1。

反调试不依赖 CDP 启动标志，**只要用户手动打开 DevTools 就可能命中**，因此即使本项目把 `--enable-automation`
等自动化标志全部清除掉，也无法靠启动参数消除这条风险——必须在页面层做对抗。

### 1.1 快捷键拦截

主包在 `window` 上挂 `keydown` 监听，拦截以下组合：

| 平台 | 组合键 | 用途 |
|------|--------|------|
| Win/Linux | `F12` | 打开 DevTools |
| Win/Linux | `Ctrl+Shift+I` / `Ctrl+Shift+J` | 打开 DevTools / Console |
| Win/Linux | `Ctrl+U` | 查看页面源码 |
| Win/Linux | `Ctrl+S` | 保存网页 |
| macOS | `Cmd+Option+I/J` / `Cmd+Option+U` / `Cmd+S` | 同上对应组合 |

监听内调用 `event.preventDefault()` + `event.stopPropagation()`。

**对我方影响**：本项目通过 CDP 启动调试，DevTools 用户从浏览器主菜单或右键检查也能打开，快捷键拦截
绕不过这两条路径，因此**这一项天然失效**，无需额外对抗。

### 1.2 `console.clear()` 周期性清屏

主包在反调试触发流程中会反复调用 `console.clear()`，把用户在 DevTools Console 看到的日志、错误、
报错栈等全部抹掉，让排查变得困难。

**我方对抗**：把 `console.clear` 替换为带原生形态的 noop（`Function.prototype.toString.call(console.clear)`
仍返回 `"function clear() { [native code] }"`），调用不再有任何副作用。详见 §三.2。

> 历史细节：第一版 noop 内部还会打印 `"数据已清空"`，等于自我暴露成"非原生 clear"；现在已改成纯空函数。
> Chromium 把 `clear` 挂在 `console` 实例的 own property 上而非 `Console.prototype` 上，patch 必须
> 落到实例 own，才能实际生效。

### 1.3 console 时间差探测（核心检测路径）

**原理**：

- DevTools 关闭时，`console.log(largeObj)` 仅把对象塞进 console buffer，O(1)，几乎零耗时。
- DevTools 打开（或 inspector 接管对象序列化）后，每次 `console.log(largeObj)` 都会**走 V8 inspector
  协议把对象序列化一遍**。

主包的典型探测代码：

```text
for (let i = 0; i < 50; i++) console.log(arr_of_500_items);
const a = performance.now();
for (let i = 0; i < 50; i++) console.table(arr_of_500_items);
const b = performance.now();
if (b - a > THRESHOLD) {  // DevTools 打开
  triggerDestroy();
}
```

500 元素 × 50 次会产生 10ms+ 量级的稳定差异，阈值一过即判定 DevTools 打开。

**触发后果**：调用 `window.close()` / `history.back()` / `location.href = ...` 等破坏动作（这些动作
我方在 §三.2 里都拦下了，但页面会反复重试，最终仍会脱壳）。

**我方对抗**：把 `console` 的 `log` / `info` / `debug` / `warn` / `error` / `table` / `dir` /
`dirxml` / `trace` / `group` / `groupCollapsed` 全部包装为「先把对象参数归一化为 `[object Type]`
字符串再交给原生方法」的形态——`Object.prototype.toString.call(arr)` 是 O(1)，inspector 序列化路径
只看到一个短字符串，耗时不再随 DevTools 状态变化。详见 §三.2 与 §六.5。

### 1.4 console 副作用探测（伴生路径）

**原理**：把一个对象作为参数交给 `console.log`，inspector 在展开对象树时会读取对象的所有属性、调用
属性 getter、调用 `RegExp.prototype.toString` / `Date.prototype.toString` / `Function.prototype.toString`、
读取 DOM 节点的 getter 等——这些读操作本身的副作用会被探测脚本捕获，从而判断是否进入了 inspector 的
对象渲染路径。

**典型预埋点**：

- 把 `RegExp` 实例放进数组，重写 `RegExp.prototype.toString`，看是否被调用。
- 用 `Object.defineProperty(node, 'id', { get: trap })` 给 DOM 节点装 getter trap。
- 给函数对象重写 `toString`，等待 inspector 渲染。

**我方对抗**：§1.3 的对抗手段顺带消除了这条路径——对象在进入 inspector **之前**已经被替换成
`[object Type]` 字符串，探测脚本预埋的 getter 再也不会被触发。

### 1.5 隐藏 iframe 取干净 console（主路径已验证覆盖）

**原理**：主包创建一个隐藏 iframe（同源），从 `iframe.contentWindow.console` 取一份「干净」的 console
引用，在该引用上重复 §1.3 / §1.4 的探测，绕过页面里被我方包装过的 console。

**当前覆盖情况**：puppeteer 的 `page.evaluateOnNewDocument` 内部会把脚本注册到主 frame CDP session，
并在 OOPIF / iframe target 通过 `Target.attachedToTarget` attach 时再次 addScript（见
`installBossBrowserPageGuards` 监听 `targetcreated`），iframe 也会被注入守卫脚本。

**2026-07-01 本地验证**：在守卫安装后创建动态 `iframe.srcdoc`，主 frame 与子 frame 的
`navigator.webdriver` 都为 `false`；两侧 `console.log({})` 都被归一化为 `"[object Object]"`。
这覆盖了线上 `zhipin-sign/v5303/static/js/vendors~app.9ac375ae.js` 模块 `VXjk` 通过
`srcdoc="<script>parent.__xbcw = window</script>"` 取 clean window / clean console 的主路径。

**仍需观察的边角**：如果页面 target 在守卫安装前已经执行过检测脚本，或出现特殊跨进程 OOPIF 时序，
仍需按实际日志分析。当前不通过阻断主包解决该问题，因为主包本身是业务代码，不能阻断。

### 1.6 关键对象完整性校验（反篡改）

**原理**：检查关键原型链 / 实例的类型一致性，防御「替换原生对象」类的注入：

- `window.location instanceof Location`
- `document instanceof HTMLDocument`
- `document.body instanceof HTMLBodyElement`
- `document.documentElement instanceof HTMLHtmlElement`
- `Function.prototype.toString.call(target)` 是否返回 `"[native code]"` 形态

**触发后果**：与 §1.3 类似，命中后走破坏动作链。

**我方对抗**：守卫脚本所有改写都遵循以下约束（详见 `src/common/boss_page_guards.ts`）：

- 替换的方法**保留 `name`**，并通过包装后的 `Function.prototype.toString` 让 `fn.toString()` 返回
  `"function NAME() { [native code] }"` 形态。
- 改写都落在 prototype（`Navigator.prototype` / `Window.prototype` / `History.prototype` /
  `Location.prototype` / `Console.prototype`）上，descriptor 形态保持 `configurable: true`、
  `enumerable` 跟随原值，**避免在实例上多出 own property** 被 `Object.getOwnPropertyDescriptor`
  一眼识破。
- 不替换 `document` / `Location` / `History` 等对象本体，只换其 prototype 上的方法，instanceof
  关系不破坏。

### 1.7 命中后的破坏动作链

主包反调试模块在判定 DevTools 打开后，会按顺序尝试以下破坏动作（来自源码逆向）：

| # | 动作 | 我方拦截 |
|---|------|---------|
| 1 | `window.close()` | ✅ `Window.prototype.close` 替换为 noop |
| 2 | `history.back()` / `history.go(-1)` | ✅ `History.prototype.back/go(n<0)` 替换为 noop |
| 3 | `location.href = "about:blank"` 或风控页 | ✅ `Location.prototype.href` setter 拦截 + CDP 风险 URL 拦截 |
| 4 | 制造内存压力（大数组循环） | ❌ 无对抗（业务代码可恢复） |
| 5 | 注入隐藏/模糊页面样式 | ❌ 无对抗（CSS 注入会改 DOM，但 risk-detection 99001 也会上报，存在牵制） |
| 6 | 设置空跳转 | ✅ Location 守卫 |
| 7 | `navigator.sendBeacon(...)` 上报到 `logapi.zhipin.com/dap/api/json` | ✅ CDP `Fetch.fulfillRequest` 返回 204 |

> 上报通道还包括 `fetch(..., {keepalive: true})`、同步/异步 XHR——任意通道走的都是 logapi 域，一律
> 被 §三.3 的 CDP 拦截 204 掉，**无论本地检测是否被打穿，外层都拿不到上报数据**。

### 1.8 我方对抗一览

| Boss 行为 | 我方位置 | 状态 |
|-----------|---------|------|
| F12 / Ctrl+Shift+I 等快捷键 | （DevTools 也能从菜单/右键打开，快捷键不影响调试） | 不影响 |
| `console.clear()` 周期性清屏 | §三.2 `console.clear` noop 替身 | ✅ 已实现 |
| console 时间差探测 | §三.2 `console.log` 等参数归一化 | ✅ 已实现，实测有效 |
| console 副作用探测 | §三.2 同上（连带消除） | ✅ 已实现 |
| 隐藏 iframe 取干净 console | §三.2 `evaluateOnNewDocument` 走 puppeteer 注册到所有 frame target | ✅ `srcdoc` 主路径已验证 |
| 关键对象完整性校验 | §三.2 改写都落 prototype，保留 toString 原生形态 | ✅ 已实现 |
| 命中后破坏动作（关页/跳转） | §三.2 + §三.3 | ✅ 已实现 |
| 命中后破坏动作（上报到 logapi） | §三.3 CDP 返回 204 | ✅ 已实现 |

> **建议补强**：自动化命令执行时**避免手动打开页面 DevTools**——主包的 DevTools 检测只要面板打开
> 就可能命中。需要观察日志时优先用
> CDP `Runtime.consoleAPICalled`、`Log.entryAdded`、Network 事件或外部日志文件。

---

## 二、检测模块识别

通过网络抓包和代码分析，已识别出 Boss 前端的以下检测/上报模块。**按风险面从高到低排序**——
主包是反调试与跳转触发的总入口，放在最前；其余按"会触发跳转 → 上报观测 → 与自动化检测无关"
依次排列。

### 1. 主包反 DevTools / 反篡改 / 跳转触发逻辑 — `zhipin-sign/.../vendors~app.*.js`

**定位**：主业务包中的反调试、反篡改、跳转触发与检测结果上报逻辑。代码片段中对应 webpack 模块特征
为 `VXjk` 一类混淆模块。它是历史上最明确的"DevTools 打开检测 + 页面破坏"来源，且不依赖 CDP 启动
标志，只要用户手动打开 DevTools 就可能命中。

**主要能力**：

| 能力分组 | 描述 | 详细章节 |
|---------|------|---------|
| 反 DevTools | F12 拦截、`console.clear`、console 时间差/副作用探测、隐藏 iframe 取干净 console | §一.1–1.5 |
| 反篡改 | 关键对象 `instanceof` 完整性校验、原生函数 `toString` 形态校验 | §一.6 |
| 跳转触发 | 命中后调 `window.close` / `history.back` / `location.href` 重写 | §一.7 |
| 上报通道 | `navigator.sendBeacon`、`fetch(..., keepalive: true)`、同步/异步 XHR → `https://logapi.zhipin.com/dap/api/json` | §一.7、§三.3 |

**当前现状（2026-07-01 复查）**：

- 线上聊天壳为 `zhipin-boss/index/v10576/static/js/app.js`，该入口继续动态加载
  `zhipin-boss/bundle/v6199/static/remoteEntry.js` 与业务 chunks；反调试主逻辑仍位于
  `zhipin-sign/v5303/static/js/vendors~app.9ac375ae.js` 的 `VXjk` 模块。
- **console 时间差路径**已被 §三.2 打掉，DevTools 打开下不再触发关页/跳转。
- **console 副作用路径**（探测对象上的 `RegExp.toString` / `Date.toString` / `Function.toString` /
  DOM getter）也被同一层包装连带消除——对象在进入 inspector 之前已经被替换成 `[object Type]` 字符串，
  探测脚本预埋的 getter 再也不会被触发。
- **隐藏 `srcdoc` iframe 取 clean console** 的主路径已用本地 Puppeteer 验证覆盖：子 frame 中
  `navigator.webdriver === false`，对象 console 输出同样被归一化。
- **关闭/跳转破坏动作**已被 §三.2 与 §三.3 双层拦下。
- **上报通道**已被 §三.3 网络拦截 204 掉，即使本地检测被打穿，外层也拿不到数据。

### 2. Passport 控制逻辑 — 主包 `handlePassportController`

**定位**：风控响应码到页面跳转的控制层。代码片段中存在 `CmPassportCode` / `ZpPassportCode` 枚举和
`handlePassportController(config)`。

**关键响应码**：

- CM：`-1000031` / `-1000032` / `-1000035` / `-1000036` / `-1000037`
- ZP：`31` / `32` / `35` / `36` / `37`

**触发行为**：

- `31/32` 一类封禁码跳转到 `/web/passport/zp/403.html` 或 `/web/passport/cm/403.html`。
- `35/36` 一类灰度/验证码跳转到 `/web/passport/zp/verify.html` 或 `/web/passport/cm/verify.html`。
- `37` 安全检查码跳转到 `/web/passport/zp/security.html` 或 `/web/passport/cm/security-check.html`。
- 跳转参数会带上 `callbackUrl`、`appName`、`code`，ZP 安全检查还会带 `seed`、`ts`、`name`。

**当前判断**：这是风控接口返回后执行跳转的明确入口。它和 `/web/user/?ka=bticket` 的前端票据初始化
不是同一类跳转，但同属于"页面被带离主业务壳"的风险面。`risk-detection` 与主包反调试模块的上报最终
也通过这条路径下发跳转码。

**当前覆盖**：§三.3 CDP 已拦截所有上述跳转 URL；即使主包真触发跳转，主框架 `framenavigated` 守卫
也会把页面重新拉回沟通页。

### 3. risk-detection.js — `static.zhipin.com`

| 文件 | 路径 |
|------|------|
| 风险检测 | `https://static.zhipin.com/zhipin-boss/index/v10576/static/js/risk-detection.js` |

**定位**：webpack 入口模块 `42302`，独立的"DOM 注入 + 全局污染 + 合成点击"完整性检测器。
不依赖 console 副作用、不依赖 DevTools 开关，只看页面 DOM/window/click 形态有无被外部
（自动化脚本、油猴扩展、广告拦截器等）改动。

**检测项（共 6 类，每类对应一个 code）**：

| code | 触发条件 | 携带字段 |
|------|----------|----------|
| `99000` | `body` 上动态插入 `<script src="...">`，`src` 的二级域不在白名单（`bosszhipin.com` / `kanzhun.com` / `zhipin.com` / `weizhipin.com` / `zpurl.cn` / `amap.com` / `dianzhangzhipin.com` / `map.baidu.com`），且不以 `/` 开头 | `code, url, timestamp` |
| `99001` | `body` 上动态插入 DOM 元素，且**全部**白名单条件都不命中（见下） | `code, nodeJson, textContent, url, timestamp` |
| `99002` | `body` 上动态插入内联 `<script>`（无 `src` 但有 `textContent`） | `code, textContent, timestamp` |
| `99003` | `window.onload` 触发后，`Object.keys(window)` 里出现 known-list 之外的非数字键名（移动端 UA 跳过） | `code, windowKeys, timestamp` |
| `99004` | 收到 `click` 事件且 `event.isTrusted === false` **或** `pageX <= 0 && pageY <= 0` | `code, isTrusted, targetElement, pageX, pageY, timestamp` |
| `99005` | 连续 10 次 `click` 间隔 `<= 50ms`（极速连点） | `code, clickList[10]` |

**99001 的白名单（满足任一即不上报）**：

- class 命中 19 项内置 UI 类名之一：`__wm` / `iframe-slider-wrap` / `popover-wrap` / `toast` /
  `chat-global-outer-wrap` / `chat-label-hidden` / `operation-container` /
  `message-comdesc-label` / `jobdesc-label` / `resume-hidden-label` /
  `conversation-label-hide` / `interview-panel-dialog` / `tooltip-common` /
  `ui-tooltip-popper` / `vip-feature-guide` / `geetest_fullpage_click` /
  `business-block-tips` / `avatar_layer` / `dialog-wrap`
- id 命中 8 项之一：`wrap` / `__svg__icons__dom__` / `__SVG_SPRITE_NODE__` / `__id__TEMP` /
  `boss-editor-sub` / `lockpage` / `position-avatar` / `boss-copy-input`，或 `id` 以
  `boss-dynamic-dialog` 开头且 `dataset.type === "boss-dialog"`
- `dataset.transfer` 存在
- `src` / `href` 的二级域在白名单内，或以 `/` 开头
- 节点 JSON 的任意属性以 `data-v` 开头（Vue scoped CSS 标记）
- 节点属性含 `dir` 或 `d-c`（boss 自定义指令）
- 整体形状是水印层：根 `div` style 为
  `position: absolute; border: 0px; width: 0px; height: 0px; top: 0px; left: -9999px;`，
  且第一个子 `div` style 为
  `display: inline; margin: 0px; border: 0px; padding: 1px; width: 1px; zoom: 1;`

**99003 的 known-list**：模块里硬编码了一个 ~330 项的"已知 window 属性"白名单，覆盖标准
Web API + Boss 自家全局对象（`iBossRoot` / `zpAegis` / `Warlock` / `BossAnalytics` /
`Vue` / `_AMapSecurityConfig` / `__bzcoco_*` 等），其余全报。

2026-07-01 复查：`99000` 在压缩产物中仍写作 `99e3`；known-list 已包含
`__SECURITY_WASM_BRIDGE__`、`fetchLater`、`oncommand`、`__xbcw` 等新键，但检测模型仍是
`99000`-`99005` 六类，没有新增需要修改守卫策略的检测码。

**生命周期 hook 点**：

```text
DOMContentLoaded → MutationObserver(body, {childList:true})       开始监听 99000/99001/99002
window.onload    → requestIdleCallback chain：
                     1) 打开发送阀门 g=true，开始 flush 队列
                     2) 扫描 window 未知键 → 上报 99003
                   → 注册 document.click 监听            开始监听 99004/99005
```

**去重与上报**：所有事件先经 `L(n)` 去重（`99001` 用 `(code, url, normalized nodeJson)`
做去重 key，其它 code 用 `(code, 除 timestamp 外的全部字段)`），再进 `h[]` 队列。`A()`
触发 1000ms 防抖、每批最多 5 条，通过 **`window.iBossRoot.sendAction({ action:
"boss_risk_report", customType: "2", params: { insertList } })`** 出网。

**触发后果**：本模块本身**只上报、不破坏页面**。破坏动作（`window.close` / `history.back` /
`location.href` 重写）在 §1（主包反 DevTools 模块）和 §2（Passport 控制逻辑）里。
风险路径是：`risk-detection` 上报 → 后端打分 → 下次接口下发 `code: 35/36` 之类
→ Passport 触发跳转。

**当前防线对它的命中情况**：

| 检测项 | 我们这一侧的实际行为 | 是否会触发 |
|---|---|---|
| `99000` 外部 `<script>` 注入 | 我们走 CDP `evaluateOnNewDocument`，**不向 DOM 添加 `<script>`** | ❌ 不触发 |
| `99001` 普通 DOM 注入 | 我们不向 `body` 添加任何元素，只改 prototype 和实例 own property | ❌ 不触发 |
| `99002` 内联 `<script>` 注入 | 同上，注入完全不经过 DOM | ❌ 不触发 |
| `99003` 未知 window 属性 | 守卫脚本里所有变量都是 IIFE 内 `var` 闭包，**没有挂任何东西到 `window`**；console own property 在 known-list 内 | ❌ 不触发（前提：没人用 `page.evaluate` 写一句 `window.foo=...`） |
| `99004` 合成点击 | Puppeteer/CDP 的 `Input.dispatchMouseEvent` 在浏览器侧 `event.isTrusted === true`；但 `page.click()` 不传坐标默认从元素中心算，**不会出现 pageX/Y 全 ≤ 0** | ⚠️ 仅当显式传 `{x:0,y:0}` 才会踩 |
| `99005` 极速连点 | 自动化点击间隔通常远大于 50ms | ⚠️ 批量点击场景需保留 ≥ 60ms 间隔 |

**兜底防线**：即使本模块漏过加载、检测出问题、入队 `h[]` 想发出去，最终调的是
`iBossRoot.sendAction`——而 `sendAction` 内部出网最终落在 `logapi.zhipin.com/dap/api/json`
等域，已被 §三.3 的 CDP 拦截 204 掉，**外层即使触发也无法上报到后端**。这层冗余让"§三.3 的
URL 白名单只要还覆盖 logapi 系列、就不会被本模块打穿"成为关键不变量。

> **写自动化代码时需要避开的两条**：
> 1. 任何 `page.evaluate(() => { window.someName = ... })` 都会被 99003 抓到，**全局变量
>    一律改用闭包内变量或 dataset/属性**。
> 2. 批量点击/输入循环里，相邻动作的间隔保留 ≥ 60ms（含 jitter 更佳），避开 99005 阈值。

### 4. zpAegis（腾讯云 Aegis）— `www.zhipin.com`

| 文件 | 路径 |
|------|------|
| JS 加载器 | `https://www.zhipin.com/zhipin-security/web/boss/index.js` |
| WASM 模块 | `https://www.zhipin.com/zhipin-security/web/boss/aegis_bg.wasm` |

**检测内容**：浏览器指纹、WebAssembly 环境检测、系统进程扫描、鼠标轨迹分析、键盘输入节奏分析、
剪贴板/粘贴行为检测、简历可见性检测、iframe 可见性检测、第三方脉脉/飞书等监测模块。此模块更有
可能做的是性能检测的行为，与反自动化检测不直接相关。

**当前覆盖**：§三.3 CDP 直接 `failRequest` 拦截 `index.js` 与 `aegis_bg.wasm`，模块完全无法加载。

### 5. Warlock Data SDK — `static.zhipin.com/assets/sdk/warlock/warlockdata.min.*.js`

**定位**：行为埋点与页面分析 SDK。

**主要能力**：

- 重写 `window.XMLHttpRequest`，监听 `ajaxLoad` / `ajaxError` / `ajaxReadyStateChange` 等生命周期事件。
- 改写 `history.pushState` / `history.replaceState`，监听 SPA 路由切换。
- 监听 `click`、`pagehide`、`pageshow`、`unload`、`visibilitychange`、`focus`、`blur` 等事件。
- 采集 `PageView`、`WebClick`、`WebPageLeave`、`Ajax`、`Login`、页面来源、屏幕尺寸、视口尺寸、滚动位置等信息。
- 使用 `localStorage` / `sessionStorage` / cookie 维护用户标识和批量上报队列。

**上报目标**：

- `https://logapi.zhipin.com/dap/api/json`
- `https://warlock.zhipin.com/wapi/warlock/cross/event/visible/client/fetch`

**当前判断**：该 SDK 更偏观测层，不像 `/web/user/?ka=bticket` 跳转的直接触发点，但会记录页面跳转、
接口异常、资源加载失败和页面停留等结果。上报通道已被 §三.3 拦截 204。

### 6. Patas / APM SDK — `static.zhipin.com/assets/sdk/apm/patas.*.min.js`

**定位**：前端异常、性能、接口质量和白屏监控 SDK。

**主要能力**：

- 监听 `window.error`、`unhandledrejection`、资源加载失败、Vue 错误、`console.error`。
- 包装 `window.fetch` 和 `XMLHttpRequest.prototype.open/send/setRequestHeader`，采集接口请求、响应状态、部分响应体和耗时。
- 使用 `performance.timing`、`performance.getEntriesByType('resource'/'navigation')`、`performance.memory` 采集性能数据。
- 使用 `document.elementFromPoint` 做白屏检测。
- 监听 `history.pushState` / `history.replaceState`、`popstate`、`hashchange`、`visibilitychange` 采集页面访问。
- 可选动态加载 Warlock SDK。

**上报目标**：

- `https://apm-fe.zhipin.com/wapi/zpApm/actionLog/fe/common.json`
- `https://apm-fe.zhipin.com/wapi/zpApm/httpMetrics/getConfig`
- `https://apm-fe.zhipin.com/wapi/zpApm/httpMetrics/report`

**当前判断**：该 SDK 是观测层，但会记录资源被拦截、接口异常、页面白屏、页面跳转和控制台错误。上报
通道已被 §三.3 拦截 204。

### 7. Boss Geek SDK — `img.bosszhipin.com`

| 文件 | 路径 | 状态 |
|------|------|------|
| 浏览器检测 | `https://img.bosszhipin.com/static/zhipin/geek/sdk/browser-check.min.js` | ✅ 已排除（仅 IE 兼容检查） |
| 验证码 SDK | 同目录下其他 SDK 文件（极验、阿里、网易易盾等） | 🚫 已拦截 |

**browser-check.min.js 分析**：仅检查 UA 是否包含 `msie` 或 `trident`，命中则跳转到不兼容页面。
Chrome 147 永不命中，不参与自动化检测。

**验证码 SDK 检测**：服务器返回 `code: 31/32/35/36` 时触发 `window.location.href` 跳转到 403 或
滑块验证页，或执行 `history.back()` 返回上一页——这些跳转入口已被 §2（Passport）和 §三.2 / §三.3
双层拦截。

---

## 三、防御措施

### 第一层：Chrome 启动参数

位置：`src/browser/cdp_browser.ts`

| 参数 | 作用 |
|------|------|
| `--disable-infobars` | 隐藏"Chrome 正受到自动测试软件的控制"通知条 |
| `--js-flags=--noexpose_wasm` | **默认不启用**。开启后会让 `typeof WebAssembly === 'undefined'`，本身就是强自动化指纹；aegis_bg.wasm 已在 CDP `Fetch` 层阻断，无须再禁用 WASM 引擎。仅在 `BOSS_BROWSER_DISABLE_WASM=true` 时附加。 |
| `--remote-debugging-port=53470` | 固定为非常见端口，跨命令复用同一 Chrome 进程 |
| `--no-first-run` | puppeteer 默认参数，跳过首次运行引导 |
| `--no-default-browser-check` | puppeteer 默认参数，不检查默认浏览器 |

**关键**：puppeteer 默认添加的 `--enable-automation` 参数在 `filter` 中被移除，避免暴露自动化标志。

### 第二层：页面级 JavaScript 伪装

位置：`src/common/boss_page_guards.ts`，通过 puppeteer `page.evaluateOnNewDocument()` 注入。
puppeteer 内部会把脚本同步注册到主 frame CDP session，并在 OOPIF/iframe target 通过
`Target.attachedToTarget` attach 时再次 addScript，因此可以覆盖隐藏 iframe 反检测对照场景（详见 §一.5）。

注入脚本满足以下约束：

- 不在 `window` 上挂任何 Symbol/字符串自描述属性，避免 `Object.getOwnPropertySymbols(window)` 之类指纹。
- `Function.prototype.toString` 被替换为统一的 `fakeToString`，配合 `Map` 让所有被我们包装的函数对
  `fn.toString()` 返回 `"function NAME() { [native code] }"`，骗过反篡改"非原生函数"特征。
- 改写都落在 prototype（`Navigator.prototype`/`Window.prototype`/`History.prototype`/`Location.prototype`/
  `Console.prototype`）上，descriptor 形态保持 `configurable: true`、`enumerable` 跟随原值，避免实例上
  出现"原本不该有"的 own property，被 `Object.getOwnPropertyDescriptor` 一眼识破。

#### 3.1 浏览器指纹伪装

| 属性 | 默认（自动化） | 伪装后 |
|------|--------------|--------|
| `navigator.webdriver` | `true` | `false`（在 `Navigator.prototype` 上覆盖 getter） |
| `navigator.languages` | 可能为空 | 仅当为空时回填 `['zh-CN','zh','en']` |

不再伪造 `navigator.plugins`：原生 `navigator.plugins` 是 `PluginArray`，伪造为普通数组会被
`Object.prototype.toString.call(navigator.plugins) === "[object Array]"` 或
`navigator.plugins[0] instanceof Plugin === false` 一眼分辨；现代 Chrome 默认有 `PDF Viewer`
等内建插件，足以避开"空 plugins=自动化"这一类古早检测。

不再注入 `window.chrome.runtime/loadTimes/csi/app`：Chrome 147 已自带这些字段，且过去伪造的形态
（普通对象、`function() {}`）和原生形态完全对不上，反而成为指纹。

#### 3.2 关闭/跳转阻止 + 反调试对抗

| 攻击手段 | 防御方式 |
|----------|---------|
| `window.close()` | 替换为带原生 toString 的 noop（落在 `Window.prototype.close`） |
| `location.assign(url)` | `Location.prototype.assign` 包装，命中 `BLOCK_PATH` 或 `about:blank` 直接吞掉 |
| `location.replace(url)` | `Location.prototype.replace` 包装，规则同上 |
| `location.href = ...` 直接赋值 | `Location.prototype.href` setter 包装，规则同上（覆盖直接赋值场景） |
| `history.back()` / `history.forward()` | 替换为带原生 toString 的 noop |
| `history.go(-N)` | `go(n)` 包装，仅当 `n < 0` 时短路返回；`go(0)`/`go(N>=0)` 走原生 |
| `console.clear()` 周期清屏 | 替换为带原生形态的 noop（详见 §一.2） |
| `console.log/info/debug/warn/error/table/dir/dirxml/trace/group/groupCollapsed` 时间差与副作用探测 | 包装：先把对象参数归一化为 `[object Type]` 字符串再交给原生方法（详见 §一.3 / §一.4） |

> 不再覆盖 `window.closed`：`close()` 已经是 noop，原生 `closed` 自然保持 `false`，无需在实例
> 上再加一个 accessor 让 descriptor 异常。

> **console 包装实现细节**：Chromium 把 `console.log` 等方法挂在 **`console` 实例的 own property**
> 上，不在 `Console.prototype` 上（与 `clear` 一样）。所以脚本的查找顺序是"先 instance own、再退回
> prototype"，而 patch **始终落到实例的 own property** 上——这样既能直接覆盖 Chromium 形态、又能
> 在 prototype 形态下用实例 own 去 shadow 掉原方法，两条路径都生效。包装函数继续走 `asNative`：
> `name` 与原方法一致、`fn.toString()` 仍报告 `[native code]`，不引入"非原生函数"指纹。

### 第三层：网络请求拦截（CDP Fetch.enable）

位置：`src/common/boss_page_guards.ts`（`installBossPageGuards` → `ensurePageRequestGuard`）

在每次页面导航**之前**，通过 Chrome DevTools Protocol 的 `Fetch.enable` 域，在请求阶段
（`requestStage: 'Request'`）拦截并直接失败所有安全模块的加载请求：

```text
Network.setCacheDisabled → 禁用 HTTP 缓存，防止 304 Not Modified 绕过

Fetch.enable patterns:
  *zhipin-security/web/boss/*         → 拦截 aegis_bg.wasm + index.js
  *zhipin-boss*risk-detection*        → 拦截 risk-detection.js
  *bosszhipin.com/static/zhipin/geek/sdk/* → 拦截 browser-check + 验证码 SDK
  *logapi.zhipin.com/dap/api/json*    → 检测/埋点上报返回 204
  *apm-fe.zhipin.com/wapi/zpApm/*     → APM 上报返回 204
  *warlock.zhipin.com/wapi/warlock/*  → Warlock 上报返回 204
  *shink.zhipin.com/wapi/dapCommon/json* → DAP 上报返回 204
  */web/common/(403|nonsupport).html* → 风控跳转页直接阻断
  */web/user/safe/verify*             → 滑块验证页直接阻断
  */web/passport/(zp|cm)/...          → Passport 风控跳转页直接阻断

安全脚本与风险跳转匹配后执行 Fetch.failRequest → errorReason: BlockedByClient
上报请求匹配后执行 Fetch.fulfillRequest → responseCode: 204
```

> `about:blank` 是浏览器内置 URL、不会进入 CDP 网络拦截，因此不放在 `Fetch.enable` 模式里；
> 该路径只能靠页面内 `Location` 守卫与 `framenavigated` 事件兜底处理。

#### 拦截事件日志

每条命中规则的请求都会通过 CDP `Runtime.evaluate` 直接调 `console.info(...)`，
**写到目标页面的 DevTools Console**（不写终端 stdout / stderr，避免污染 list /
recommend / chat 等命令的输出，对 agent / 脚本调用方零侵入）。

打开页面 DevTools Console 后，会看到：

```text
[boss-cli][report:204]    POST  https://logapi.zhipin.com/dap/api/json  body={"action":"boss_risk_report","customType":"2","params":{"insertList":[{"code":99001,...}]}}
[boss-cli][block:script]  GET   https://www.zhipin.com/zhipin-security/web/boss/index.js
[boss-cli][block:nav]     GET   https://www.zhipin.com/web/common/403.html?bizError=...
```

三种标签对应 `classifyPausedRequest()` 的三个分类：

| 标签 | 含义 | 处理 |
|---|---|---|
| `report:204` | 命中 `REPORT_REQUEST_RE`：检测/埋点上报 | 返回 204，附 200 字节内 body 预览 |
| `block:script` | 命中 `BLOCKED_SECURITY_SCRIPT_PATTERNS`：安全脚本/WASM/SDK | `failRequest(BlockedByClient)` |
| `block:nav` | 命中 `RISK_NAVIGATION_RE`：403 / verify / passport 风控跳转 | `failRequest(BlockedByClient)` |

`report:204` 的 body 预览是查"对方到底上报了哪些 code、哪些 nodeJson"的最直接证据，
比抓 Network 面板更稳（被拦请求在 DevTools 里只显示 `(blocked:other)`，看不到 payload）。
预览长度上限 `POST_DATA_PREVIEW_LIMIT = 200` 字符，避免极长 JSON 刷屏。

> 这条日志走 CDP 注入，会经过页面里 §三.2 的 `console.info` 包装。字符串参数原样通过，
> 不会触发 V8 inspector 对象序列化慢路径，因此**不会**反向被 Boss 的时间差 DevTools
> 探测命中（即使 Boss 给 console 装了 telemetry hook，最终上报通道也已被本节自身的
> `report:204` 规则 204 掉）。
>
> 极早期请求（页面执行上下文还没创建出来时触发的 `Fetch.requestPaused`）会因为
> `Runtime.evaluate` 找不到 context 而日志丢失，但**拦截动作本身不依赖此日志**——
> 这是有意的"日志可丢、防线必稳"分层。
>
> 真实 CDP send 异常（`Fetch.fulfillRequest` / `failRequest` 失败）仍走 Node stderr：
> 这是 ops 级故障，必须让外层立即可见。

---

## 四、完整执行时序

每次命令执行时，`withBossSessionPage()` 按以下顺序建立防线：

```text
1. ensureBrowserSession()
   → 连接/复用 Chrome 实例（固定端口 53470）

2. page.bringToFront()
   → 激活当前页

3. page.evaluateOnNewDocument(伪装脚本)
   → 注入浏览器指纹伪装 + 关闭/跳转阻止 + console 反调试对抗

4. page.createCDPSession()
   → 建立 CDP 会话

5. Network.setCacheDisabled(true)
   → 禁用 HTTP 缓存

6. Fetch.enable(patterns)
   → 注册安全脚本 / 上报 / 风控跳转三组 URL pattern 拦截规则

7. Fetch.requestPaused listener
   → 安全脚本/风险跳转立即 fail，上报请求返回 204

8. page.goto(https://www.zhipin.com/web/chat/index)
   → 强制导航，此时：
     - 页面级伪装已在新文档脚本执行前注册（第二层）
     - 安全模块的 <script> / wasm 请求被 CDP 拦截（第三层）
     - 任何页面内触发的关闭/跳转被伪装脚本阻止（第二层）
     - 缓存已禁用，不会出现 304 绕过（第三层）

9. ensureMenuListStableAfterLoad()
   → 等侧栏加载稳定

10. callback(page)
   → 执行具体命令逻辑（list / chat 等）
```

---

## 五、已落地策略与后续可行策略

以下策略按优先级排序；除"已实现"外，均需要实测验证，避免引入新的指纹或破坏业务脚本。

### 1. 已实现：拦截破坏性导航/关页

当前守卫脚本已覆盖：

- `window.close()`
- `history.back()` / `history.forward()` / `history.go(n < 0)`
- `Location.assign/replace` 指向 `about:blank`、403、nonsupport、verify、Passport 风控页面
- 主框架如果仍被带到风险 URL，会触发 `framenavigated` 守卫重新回到沟通页

这能挡住主包检测命中后的部分破坏动作；`location.href = ...` 直接赋值则主要依靠 CDP 风险导航请求
拦截和主框架导航守卫兜底。

### 2. 已实现：扩大风险 URL 拦截范围

现有 `BLOCK_PATH` 和 CDP 风险导航拦截已覆盖：

```text
/web/common/403.html
/web/common/nonsupport.html
/web/user/safe/verify
/web/passport/zp/403.html
/web/passport/zp/verify.html
/web/passport/zp/security.html
/web/passport/cm/403.html
/web/passport/cm/verify.html
/web/passport/cm/security-check.html
```

### 3. 已实现：控制检测结果上报

主包、Warlock、Patas 都会向日志域上报。当前 CDP 请求拦截对这些端点返回 `204 No Content`，让
`sendBeacon` / `fetch` / XHR 尽量走"成功但无内容"的路径：

```text
*logapi.zhipin.com/dap/api/json*
*logapi-dev.weizhipin.com/dap/api/json*
*apm-fe.zhipin.com/wapi/zpApm/*
*apm-fe-qa.weizhipin.com/wapi/zpApm/*
*warlock.zhipin.com/wapi/warlock/*
*shink.zhipin.com/wapi/dapCommon/json*
```

风险：这些端点可能也承载正常埋点、A/B 或业务可见性数据。若业务出现依赖埋点回传的异常，再考虑把
上报拦截做成环境变量。

### 4. 已实现：限制 `console.clear()` 的破坏性

详见 §一.2 / §三.2。

`Console.prototype.clear`（以及如果实例上存在 own `clear`）替换为带"原生形态 toString" 的真正空函数。
替身函数本身的 `name` 是 `"clear"`，`Function.prototype.toString.call(console.clear)` 会返回
`"function clear() { [native code] }"`，避免被反篡改的"非原生函数"特征命中。

如需恢复页面原始行为，可设置：

```text
BOSS_BROWSER_ALLOW_CONSOLE_CLEAR=true
```

### 5. 已实现：对抗 console 时间差 / 副作用 DevTools 探测

详见 §一.3 / §一.4 / §三.2。

把 `console` 的 `log` / `info` / `debug` / `warn` / `error` / `table` / `dir` / `dirxml` /
`trace` / `group` / `groupCollapsed` 全部包装成"先把对象参数归一化为 `[object Type]` 字符串、
再交给原生方法"的形态。

**代价**：DevTools 控制台中对象会显示成 `"[object Array]"` / `"[object Object]"` 这种概要，
**失去对象树展开 UX**；断点 / Watch / Sources / 调用栈 / 直接在 console 输入 `someVar` 自动求值
全部不受影响，主要的调试能力都还在。

如需恢复完整的对象展开 UX（代价：会重新被时间差检测命中）：

```text
BOSS_BROWSER_ALLOW_VERBOSE_CONSOLE=true
```

#### 实测结果（2026-07-01）

在 Boss 直聘主框架 + DevTools 打开的场景下实测确认：

- `console.log` / `console.table` / `console.dir` 等方法**已被成功覆盖**，主包探测脚本
  （当前为 `zhipin-sign/v5303/static/js/vendors~app.9ac375ae.js` 的 `VXjk` 模块）打印
  `Array(50)` 大对象时，DevTools 中显示的是
  `'[object Array]'` 字符串而非可展开的真数组；`()=>{}` 箭头函数显示为 `'[Function: anonymous]'`。
- 50 次大对象打印的 `performance.now()` 差值塌缩到常数级，**不再随 DevTools 开关变化**，
  阈值检测不再命中，不再触发 `window.close()` / `history.back()` / `location.href` 重写
  这一连串破坏动作。
- `console.clear` 的替身同步生效，DevTools 日志面板不再被周期性清空。
- 动态 `iframe.srcdoc` 子 frame 中同样生效：`navigator.webdriver === false`，且
  `console.log({})` 进入 CDP console 事件时已变成 `"[object Object]"`。

> 历史教训：第一版实现只去 `Console.prototype` 上找方法，结果在 Chromium 上一个都没 patch
> 上（Chromium 把这些方法挂在 `console` 实例的 own property 上）。修复后改成"先 instance
> own、再退回 prototype；patch 一律落到实例 own"才真正生效。**新加 console 方法时切勿改回
> 仅 prototype 路径。**

风险：探测脚本可以改用别的方法（例如直接调 `performance.mark` 测自己包装过的代码段），
或改变 iframe 创建/执行时序。命中再具体分析。

### 6. 建议补强：不要在自动化会话中手动打开 DevTools

主包的 DevTools 检测不依赖 CDP 标志，主要依赖 console 展开副作用和打印性能差异。只要 DevTools
面板打开，就可能被发现。自动化命令执行时应避免打开页面 DevTools；需要观察日志时优先使用 CDP
`Runtime.consoleAPICalled`、`Log.entryAdded`、Network 事件或外部日志文件。

### 7. 建议补强：页面完整性防线要尽量少改原生对象

主包会检查 `Location`、`document`、`document.body`、`document.documentElement` 等对象是否仍是
预期类型（详见 §一.6）。后续新增防御时应优先：

- 用 CDP 层拦截网络和导航。
- 少改 `document`、`Location`、`History` 等原生对象本体。
- 如果必须包装函数，保留原函数引用、函数名、长度和 `toString()` 形态，避免被"非原生函数"检测命中。

### 8. 建议补强：记录而不是静默吞掉检测动作

对跳转、关页、上报拦截建议打内部日志，至少记录：

- 触发 URL
- 调用方式：`assign` / `replace` / `history.back` / `sendBeacon` / `fetch` / `XHR`
- 当前页面 URL
- 简短调用栈

这样可以区分"正常业务跳转""Passport 风控跳转""DevTools 检测破坏动作"，避免靠现象猜测。

---

## 六、涉及修改的文件

| 文件 | 修改内容 |
|------|---------|
| `src/browser/cdp_browser.ts` | 固定远程调试端口 53470；移除 `--enable-automation`；`--js-flags=--noexpose_wasm` 改为**仅在 `BOSS_BROWSER_DISABLE_WASM=true` 时**附加 |
| `src/common/boss_page_guards.ts` | 页面预注入脚本（prototype 入口 + 原生 toString 包装 + Location.href setter 拦截 + console 反调试对抗）；CDP `Fetch.enable` 安全脚本 / 风控跳转 / 上报多组拦截 |
| `src/browser/browser_session.ts` | 在每次连接 / 选页后调用 `installBossBrowserPageGuards` / `installBossPageGuards` |

---

## 七、可调环境变量

| 变量 | 默认值 | 作用 |
|------|--------|------|
| `BOSS_BROWSER_DISABLE_WASM` | `false` | 设为 `true`/`1` 时附加 `--js-flags=--noexpose_wasm`，但会让 `WebAssembly` 全局缺失，本身就是强自动化指纹，仅特殊场景手动启用 |
| `BOSS_BROWSER_DISABLE_JS` | `false` | 完全禁用页面 JavaScript（适配极端场景） |
| `BOSS_BROWSER_HEADLESS` | `false` | 启用无头模式 |
| `BOSS_CLI_NO_AGENT_OVERLAY` | `false` | 关闭顶部操作指示条 |
| `BOSS_BROWSER_ALLOW_CONSOLE_CLEAR` | `false` | 允许页面调用 `console.clear()` 清空控制台 |
| `BOSS_BROWSER_ALLOW_VERBOSE_CONSOLE` | `false` | 允许 `console.log` 等方法把对象原样交给 V8 inspector（恢复对象树展开 UX，但会重新被时间差 DevTools 探测命中） |
