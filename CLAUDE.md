@AGENTS.md

# AI-UI 工作速览

- 组件词典站点,registry 驱动:内容只进 `src/registry/`(组件源码 + entries 元数据),页面、`/llms.txt`、提示词 API、⌘K 搜索全部自动派生。
- **加条目 / 加分类 / 从 `.reference/` 移植,先读 skill:`adding-registry-entries`**,骨架一律用 `pnpm registry:new <slug> --category <cat> [--copy-from <路径>]` 生成,不手写样板。
- 校验:`pnpm registry:check`(秒级,抓约定错误)+ `pnpm verify`(test + typecheck + check + build,慢,收尾用)。`src/registry` 有写入时 PostToolUse 钩子会自动跑 check,报错当场修。
- 总览现有条目用 `pnpm registry:digest`,不要通读 `entries/*.tsx`。
- 品牌字符串只在 `src/lib/site.ts`;视觉令牌在 `src/app/globals.css`。
- `mcp/`(stdio + streamable-http 双传输)与 `Dockerfile` + `docker/`:条目变动自动反映,无需维护;本地 `pnpm mcp` / `pnpm mcp:http` 起服务。
- `.reference/` 是本地只读参考仓库(已加入 .gitignore,不入库、不署名);WebFetch 对 github/vercel 被本机拦截,改用 web_reader MCP 或 git clone。
