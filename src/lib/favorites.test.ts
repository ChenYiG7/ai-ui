import { describe, expect, it } from 'vitest';
import { parseFavorites, toggleSlug } from './favorites';

describe('parseFavorites', () => {
  it('空输入返回空数组', () => {
    expect(parseFavorites(null)).toEqual([]);
    expect(parseFavorites('')).toEqual([]);
  });

  it('正常解析 slug 列表', () => {
    expect(parseFavorites(JSON.stringify(['a', 'b']))).toEqual(['a', 'b']);
  });

  it('损坏 JSON 与非数组数据静默清零', () => {
    expect(parseFavorites('{oops')).toEqual([]);
    expect(parseFavorites(JSON.stringify({ a: 1 }))).toEqual([]);
    expect(parseFavorites('42')).toEqual([]);
  });

  it('过滤非字符串与空串并去重，保持首次出现顺序', () => {
    expect(parseFavorites(JSON.stringify(['b', 'a', 'b', '', 3, null, 'a']))).toEqual(['b', 'a']);
  });
});

describe('toggleSlug', () => {
  it('未收藏则追加到末尾', () => {
    expect(toggleSlug(['a', 'b'], 'c')).toEqual(['a', 'b', 'c']);
  });

  it('已收藏则移除且不影响其余顺序', () => {
    expect(toggleSlug(['a', 'b', 'c'], 'b')).toEqual(['a', 'c']);
  });

  it('重复翻转回到原状态', () => {
    const slugs = ['a', 'b'];
    expect(toggleSlug(toggleSlug(slugs, 'x'), 'x')).toEqual(slugs);
  });
});
