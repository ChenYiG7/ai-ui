import type { RegistrySummary } from '@/registry/types';

export interface PromptInput {
  entry: RegistrySummary;
  source: string;
}

function depsLine(deps: string[]): string {
  const all = ['clsx', 'tailwind-merge', ...deps];
  return `pnpm add ${all.join(' ')}`;
}

/**
 * 生成可直接粘贴给 AI 编程助手的完整提示词。
 * 结构:任务 → 前置条件 → 设计意图 → 完整源码 → 集成示例 → 验收清单。
 */
export function buildPrompt({ entry, source }: PromptInput): string {
  const notes = entry.designNotes.map((n, i) => `${i + 1}. ${n}`).join('\n');
  const fileName = entry.file.split('/').pop() ?? entry.file;
  const usesLucide = entry.usage.includes('lucide-react');

  return `# 任务:在我的项目中实现「${entry.title}」(${entry.name})组件

${entry.description}

## 前置条件
- 技术栈:React 18+ / TypeScript(严格模式)/ Tailwind CSS v4${entry.deps.length ? `,额外依赖:${entry.deps.join('、')}` : ',无额外运行时依赖'}
- 安装依赖:\`${depsLine(entry.deps)}\`${usesLucide ? '\n- 集成示例中的图标来自 lucide-react(`pnpm add lucide-react`),可替换为任意 SVG 图标' : ''}
- 项目需要 \`cn\` 工具函数(位于 \`@/lib/utils\`):
\`\`\`ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
\`\`\`
- 组件按深色展台设计,请放置在深色背景容器中使用

## 设计意图(改造时请保留)
${notes}

## 完整源码
请把下面的代码原样写入 \`src/components/ui/${fileName}\`:

\`\`\`tsx
${source.trim()}
\`\`\`

## 集成示例
\`\`\`tsx
${entry.usage.trim()}
\`\`\`

## 验收清单
- [ ] 严格模式类型检查通过,不使用 any 与 @ts-ignore
- [ ] 源码中对 prefers-reduced-motion 的处理完整保留,不因简化而删除
- [ ] 组件呈现在深色背景容器中,视觉与本档案的设计意图一致
- [ ] 调整颜色、尺寸、速度时优先使用组件暴露的 props,而非修改内部实现
- [ ] 交互型组件键盘可达:可聚焦且有可见焦点环
`;
}
