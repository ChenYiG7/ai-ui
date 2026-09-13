import type { ReactNode } from 'react';

export type CategoryId =
  | 'cards'
  | 'buttons'
  | 'text'
  | 'effects'
  | 'backgrounds'
  | 'inputs'
  | 'feedback'
  | 'navigation'
  | 'scroll'
  | 'textures'
  | 'agent';

export interface Category {
  id: CategoryId;
  /** 中文名称 */
  label: string;
  /** 英文标识,用于装饰性排版 */
  code: string;
  description: string;
}

/** 词典条目:一个组件的全部元数据 */
export interface RegistryEntry {
  /** URL 中使用的唯一标识 */
  slug: string;
  /** 中文名称 */
  title: string;
  /** 英文名称 */
  name: string;
  category: CategoryId;
  /** 一句话描述,会写入提示词 */
  description: string;
  /** 设计意图,逐条写入提示词,改造时应保留 */
  designNotes: string[];
  /** 除 clsx / tailwind-merge 之外的额外 npm 依赖 */
  deps: string[];
  /** 组件源文件路径,相对于 src/registry/components */
  file: string;
  /** 集成示例代码 */
  usage: string;
  tags: string[];
  /** 演示节点,在展台中渲染 */
  preview: ReactNode;
  /** 展台容器附加类名,例如背景类组件需要去内边距 */
  previewClassName?: string;
}

/** 可安全传给客户端组件的序列化子集(去掉 ReactNode) */
export type RegistrySummary = Omit<RegistryEntry, 'preview' | 'previewClassName'>;
