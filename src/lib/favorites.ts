'use client';

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'ai-ui:favorites';
const CHANGE_EVENT = 'ai-ui:favorites-change';

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

function getStorage(): StorageLike | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

/** 解析存储内容：只保留非空字符串 slug 并去重，损坏数据静默清零 */
export function parseFavorites(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return [...new Set(parsed.filter((slug): slug is string => typeof slug === 'string' && slug.length > 0))];
  } catch {
    return [];
  }
}

export function readFavorites(storage: StorageLike | null = getStorage()): string[] {
  return parseFavorites(storage?.getItem(STORAGE_KEY) ?? null);
}

export function writeFavorites(slugs: readonly string[], storage: StorageLike | null = getStorage()): void {
  storage?.setItem(STORAGE_KEY, JSON.stringify(slugs));
}

/** 纯翻转：已收藏则移除（保持原顺序），否则追加到末尾 */
export function toggleSlug(slugs: readonly string[], slug: string): string[] {
  return slugs.includes(slug) ? slugs.filter((s) => s !== slug) : [...slugs, slug];
}

/**
 * 本地收藏：localStorage 持久化，不进任何后端。
 * 挂载后才读存储（SSR 首帧恒为空，保证水合一致）；写入后广播事件，
 * 同页各按钮与跨标签页（storage 事件）自动同步。展示顺序由调用方按 registry 序过滤决定。
 */
export function useFavorites() {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setSlugs(readFavorites());
    sync();
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  // 以存储为唯一事实源，绕开多按钮间的状态过期问题
  const toggle = useCallback((slug: string) => {
    const next = toggleSlug(readFavorites(), slug);
    writeFavorites(next);
    window.dispatchEvent(new Event(CHANGE_EVENT));
    setSlugs(next);
  }, []);

  const has = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  return { favorites: slugs, has, toggle };
}
