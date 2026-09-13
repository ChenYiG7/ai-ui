import { describe, expect, it } from 'vitest';
import type { RegistrySummary } from '@/registry/types';
import { searchEntries } from './search';

const make = (slug: string, over: Partial<RegistrySummary> = {}): RegistrySummary => ({
  slug,
  title: slug,
  name: slug,
  category: 'cards',
  description: '',
  designNotes: [],
  deps: [],
  file: `${slug}.tsx`,
  usage: `import { X } from "@/components/ui/${slug}";`,
  tags: [],
  ...over,
});

const entries = [
  make('magnetic-button', {
    title: '磁吸按钮',
    name: 'Magnetic Button',
    description: '指针靠近时被吸附',
    tags: ['CTA', '物理'],
  }),
  make('shimmer-button', {
    title: '流光按钮',
    name: 'Shimmer Button',
    description: '边缘旋转的锥形光',
    tags: ['CTA', '发光'],
  }),
  make('toast-stack', {
    title: '信笺通知',
    name: 'Toast Stack',
    description: '通知像信笺轻叠',
    tags: ['通知'],
  }),
];

describe('searchEntries', () => {
  it('空查询按原顺序返回全部', () => {
    expect(searchEntries(entries, '')).toHaveLength(3);
    expect(searchEntries(entries, '  ')).toEqual(entries);
  });

  it('命中中文标题', () => {
    expect(searchEntries(entries, '磁吸')).toEqual([entries[0]]);
  });

  it('命中英文名,不区分大小写', () => {
    expect(searchEntries(entries, 'SHIMMER')).toEqual([entries[1]]);
  });

  it('命中标签', () => {
    const hits = searchEntries(entries, 'CTA');
    expect(hits).toContain(entries[0]);
    expect(hits).toContain(entries[1]);
    expect(hits).not.toContain(entries[2]);
  });

  it('标题命中排在描述命中之前', () => {
    const others = [
      make('alpha', { name: 'Marquee', title: '跑马灯' }),
      make('beta', { name: 'Other', title: '其他', description: '类似 marquee 的滚动横幅' }),
    ];
    expect(searchEntries(others, 'marquee')[0]).toBe(others[0]);
  });

  it('支持子序列模糊匹配', () => {
    expect(searchEntries(entries, 'mgtc').map((e) => e.slug)).toContain('magnetic-button');
  });

  it('无命中返回空数组', () => {
    expect(searchEntries(entries, '不存在的东西xyz')).toEqual([]);
  });
});
