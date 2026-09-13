# ai-ui CLI

把 AI-UI 词典里的组件一键装进你的项目。零依赖,Node ≥ 18。

## 本仓库内试用

```bash
pnpm ai-ui list
pnpm ai-ui search 极光
pnpm ai-ui add aurora-background --registry http://localhost:3000
```

`--registry` 指向任意部署了本词典的站点(本地 dev、线上静态托管均可);
缺省读环境变量 `AIUI_REGISTRY`。

## 在其他项目中安装(待发布)

包当前为 `private`,发布到 npm 前需在 `package.json` 中:

1. 确定包名(如 `ai-ui` 被占用可换 `@<scope>/ai-ui` 或 `create-ai-ui`);
2. 去掉 `"private": true`;
3. `npm publish`(`ai-ui.mjs` 已通过 `bin` 暴露为 `ai-ui` 命令)。

之后消费者即可:

```bash
npx ai-ui add magnetic-button shimmer-button
```

## 数据来源

CLI 只消费三个静态文件,不依赖任何服务端:

- `/api/registry/<slug>` — 组件清单 JSON(文件路径、源码、依赖、提示词);
- `/llms.txt` — 词典总目录(list / search 直接解析它);
- 站点首页与详情页。

因此把 `out/` 部署到 Nginx / Vercel / Cloudflare 后,CLI 与 AI 代理即可直接工作。
