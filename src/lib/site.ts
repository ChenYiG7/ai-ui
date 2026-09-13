export const site = {
  /** 品牌:改名只需改这里 */
  name: 'AI-UI',
  tagline: '面向 AI Vibe Coding 的前端组件词典',
  description:
    '为 Vibe Coding 准备的前端组件词典。每个组件都附带精心编写的 AI 提示词与完整源码,粘贴给 Claude Code、Cursor 或 v0 即可复现同样的效果。',
  /** 部署后替换为实际域名 */
  url: 'https://ai-ui.example.com',
  /** 发布仓库地址,部署前替换 */
  github: 'https://github.com/ChenYiG7/ai-ui',
  /** Docker Hub 镜像,发布后替换;/docker 页的拉取命令引用 */
  dockerImage: 'chenyig7/ai-ui:latest',
  /** 期刊式卷号,出现在 Hero 徽标与页脚 */
  volume: 'VOL.01',
} as const;
