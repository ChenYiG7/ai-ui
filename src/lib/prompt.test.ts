import { describe, expect, it } from 'vitest';
import type { RegistrySummary } from '@/registry/types';
import { buildPrompt } from './prompt';

const entry: RegistrySummary = {
  slug: 'demo-card',
  title: '演示卡片',
  name: 'Demo Card',
  category: 'cards',
  description: '一张会发光的演示卡片。',
  designNotes: ['要点一', '要点二', '要点三'],
  deps: ['motion'],
  file: 'cards/demo-card.tsx',
  usage:
    'import { DemoCard } from "@/components/ui/demo-card";\n\nexport function Demo() {\n  return <DemoCard />;\n}',
  tags: ['演示'],
};

const source = 'export function DemoCard() {\n  return <div />;\n}\n';

describe('buildPrompt', () => {
  it('包含标题、描述与全部设计意图', () => {
    const p = buildPrompt({ entry, source });
    expect(p).toContain('演示卡片');
    expect(p).toContain('Demo Card');
    expect(p).toContain('一张会发光的演示卡片。');
    expect(p).toContain('1. 要点一');
    expect(p).toContain('3. 要点三');
  });

  it('包含完整源码与集成示例', () => {
    const p = buildPrompt({ entry, source });
    expect(p).toContain('src/components/ui/demo-card.tsx');
    expect(p).toContain('export function DemoCard()');
    expect(p).toContain('from "@/components/ui/demo-card"');
  });

  it('前置条件列出全部依赖(含基础依赖)', () => {
    const p = buildPrompt({ entry, source });
    expect(p).toContain('pnpm add clsx tailwind-merge motion');
  });

  it('usage 使用 lucide-react 时提示安装图标库', () => {
    const withLucide = buildPrompt({
      entry: {
        ...entry,
        usage:
          'import { Sparkles } from "lucide-react";\nimport { DemoCard } from "@/components/ui/demo-card";\n\nexport function D() {\n  return <DemoCard icon={<Sparkles className="size-4" />} />;\n}',
      },
      source,
    });
    expect(withLucide).toContain('lucide-react');
  });

  it('验收清单覆盖类型检查、reduced-motion 与深色展台', () => {
    const p = buildPrompt({ entry, source });
    expect(p).toContain('prefers-reduced-motion');
    expect(p).toContain('深色');
  });
});
