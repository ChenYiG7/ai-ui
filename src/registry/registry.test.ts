import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { categories } from './categories';
import { registry } from './index';

const categoryIds = new Set(categories.map((c) => c.id));
const componentsDir = path.join(process.cwd(), 'src', 'registry', 'components');

describe('注册表完整性', () => {
  it('slug 全局唯一且为 kebab-case', () => {
    const slugs = registry.map((e) => e.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it('分类合法,且每个分类至少 1 个条目', () => {
    for (const e of registry) {
      expect(categoryIds.has(e.category), `${e.slug} 分类非法`).toBe(true);
    }
    for (const c of categories) {
      expect(
        registry.some((e) => e.category === c.id),
        `分类 ${c.id} 没有条目`,
      ).toBe(true);
    }
  });

  it('每个条目的组件源码文件存在', () => {
    for (const e of registry) {
      expect(existsSync(path.join(componentsDir, e.file)), `缺少源码:${e.file}`).toBe(true);
    }
  });

  it('usage 中导入了对应的组件', () => {
    for (const e of registry) {
      const componentName = (e.file.split('/').pop() ?? '')
        .replace(/\.tsx$/, '')
        .split('-')
        .map((p) => p[0]!.toUpperCase() + p.slice(1))
        .join('');
      expect(e.usage, `${e.slug} 的 usage 未导入 ${componentName}`).toContain(componentName);
    }
  });

  it('designNotes 至少 3 条,description 与 tags 非空', () => {
    for (const e of registry) {
      expect(e.designNotes.length, `${e.slug} 设计意图过少`).toBeGreaterThanOrEqual(3);
      expect(e.description.length).toBeGreaterThan(0);
      expect(e.tags.length).toBeGreaterThan(0);
    }
  });
});
