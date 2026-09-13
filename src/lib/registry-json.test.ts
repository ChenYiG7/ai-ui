import { describe, expect, it } from 'vitest';
import { buildPrompt } from './prompt';
import type { RegistrySummary } from '@/registry/types';
import { buildComponentManifest } from './registry-json';

const entry: RegistrySummary = {
  slug: 'demo-card',
  title: '演示卡片',
  name: 'Demo Card',
  category: 'cards',
  description: '一张会发光的演示卡片。',
  designNotes: ['要点一'],
  deps: ['motion'],
  file: 'cards/demo-card.tsx',
  usage: 'import { DemoCard } from "@/components/ui/demo-card";\n\nexport function D() {\n  return <DemoCard />;\n}',
  tags: ['演示'],
};

const source = 'export function DemoCard() {\n  return <div />;\n}\n';

describe('buildComponentManifest', () => {
  it('依赖列表含基础依赖且去重于 deps 之前', () => {
    const m = buildComponentManifest({ entry, source });
    expect(m.dependencies).toEqual(['clsx', 'tailwind-merge', 'motion']);
  });

  it('文件路径按消费者约定放置,内容去除首尾空白', () => {
    const m = buildComponentManifest({ entry, source });
    expect(m.files).toEqual([
      { path: 'src/components/ui/demo-card.tsx', content: 'export function DemoCard() {\n  return <div />;\n}' },
    ]);
  });

  it('清单内嵌完整提示词,与 buildPrompt 输出一致', () => {
    const m = buildComponentManifest({ entry, source });
    expect(m.prompt).toBe(buildPrompt({ entry, source }));
  });

  it('元数据原样透传', () => {
    const m = buildComponentManifest({ entry, source });
    expect(m.slug).toBe('demo-card');
    expect(m.title).toBe('演示卡片');
    expect(m.category).toBe('cards');
    expect(m.designNotes).toEqual(['要点一']);
    expect(m.usage).toContain('DemoCard');
  });
});
