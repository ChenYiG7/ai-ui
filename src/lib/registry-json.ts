import type { RegistrySummary } from '@/registry/types';
import { buildPrompt } from './prompt';

/** 机器可读的组件清单:CLI 与 AI 代理按此直接写入文件、安装依赖 */
export interface ComponentManifest {
  slug: string;
  /** 中文名称 */
  title: string;
  /** 英文名称 */
  name: string;
  category: RegistrySummary['category'];
  description: string;
  designNotes: string[];
  tags: string[];
  /** 完整安装列表,含基础依赖 clsx / tailwind-merge */
  dependencies: string[];
  /** 目标路径(相对消费者项目根)→ 组件源码 */
  files: { path: string; content: string }[];
  /** 集成示例代码 */
  usage: string;
  /** 完整 AI 提示词(与 /api/prompt/{slug} 一致) */
  prompt: string;
}

/**
 * 把条目 + 源码组装成可编程消费的清单。
 * 与 buildPrompt 同构(entry + source 进,纯字符串出),route 与 MCP 各自负责读源码。
 */
export function buildComponentManifest({ entry, source }: { entry: RegistrySummary; source: string }): ComponentManifest {
  const fileName = entry.file.split('/').pop() ?? entry.file;
  return {
    slug: entry.slug,
    title: entry.title,
    name: entry.name,
    category: entry.category,
    description: entry.description,
    designNotes: entry.designNotes,
    tags: entry.tags,
    dependencies: ['clsx', 'tailwind-merge', ...entry.deps],
    files: [{ path: `src/components/ui/${fileName}`, content: source.trim() }],
    usage: entry.usage.trim(),
    prompt: buildPrompt({ entry, source }),
  };
}
