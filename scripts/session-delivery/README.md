# 会话交付格式（Session Delivery）

将多轮模型交互整理为「一个 session 一个目录、每次交互一个 JSON」，便于归档与上传 S3 兼容桶。

## 目录命名

- `[user_id]_[session_id]`，或仅 `session_id`（无 `user_id` 时）
- `session_id` 建议带前缀，如 `session_xxx`，与 JSON 内字段一致

## 文件命名

按时间顺序，单次模型交互一个文件：

- 首选：`[index]_[timestamp]_[request_id].json`
  - `index`：从 `001` 起的零填充序号
  - `timestamp`：建议 ISO 8601，文件名中可去掉 `:`（如 `20260312T190449443Z`）
  - `request_id`：本次请求唯一 ID（UUID 等）
- 若缺少 `timestamp` 或 `request_id`：退化为 `[index].json`（如 `001.json`）

## 单个 JSON 核心字段

| 字段 | 说明 |
|------|------|
| `session_id` | 会话 ID，与目录对应 |
| `model` | 模型标识（如 `anthropic/claude-sonnet-4-6`） |
| `user_agent` | 客户端标识 |
| `system` | system 块，与 Messages API 一致（常为 `text` 块数组） |
| `tools` | 工具定义数组 |
| `messages` | 对话消息（含 user / assistant，含 tool_use 等） |
| `response` | 模型返回体；`response.session_id` 须与外层 `session_id` 一致 |

其余字段（如 `request_id`、`start_time`、`end_time`、`call_type`、`status`、`usage`）有则保留，便于审计与计费对齐。

## 会话级约束（交付前自检）

- 同一 session 内：**对话不少于五轮**。脚本默认将「一轮」计为 **一条 user 消息**（在**该次请求**的 `messages` 里统计）；若你的数据是「一条记录里带完整多轮上下文」，请改用 `--min-user-messages` 或拆分多条文件。
- 模型以 **Claude Sonnet / Opus 4.6** 为主时，可用 `--model-pattern` 过滤文件名或元数据。

## 使用脚本整理

```bash
# 从 JSON 数组文件导出（每元素为一条原始调用记录，需含或可解析出 session_id）
node scripts/session-delivery/normalize.mjs export --input ./raw-logs.json --out ./out

# 仅打包已有符合规范的目录
node scripts/session-delivery/normalize.mjs validate --root ./out --min-interactions 5
```

## 上传到 S3 兼容桶

需本机已配置 AWS CLI（或兼容工具，如 `rclone` / `mc`）。示例：

```bash
aws s3 sync ./out/session_xxx s3://your-bucket/prefix/session_xxx --endpoint-url https://s3.example.com
```

将 `endpoint-url`、`profile`、`region` 按你的云厂商说明填写。
