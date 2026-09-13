'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface TocItem {
  /** 对应标题元素的 id(页面里需存在 <h2 id=…> 等锚点) */
  id: string;
  /** 目录展示文本 */
  label: string;
}

interface AnchorTocProps {
  /** 章节列表,顺序即文档顺序 */
  items: TocItem[];
  className?: string;
}

/** 章节目录:侧边锚点导航,滚动时当前章节点亮,点击平滑跳转并同步 hash。 */
export function AnchorToc({ items, className }: AnchorTocProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '');
  // 调用方常传内联数组,用 id 串做依赖避免观察器反复重建
  const itemKey = items.map((item) => item.id).join('|');
  const itemsRef = useRef(items);
  itemsRef.current = items;

  useEffect(() => {
    const headings = itemsRef.current
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!headings.length) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        if (!visible.size) return;
        // 取文档顺序中最靠上的可见标题
        const top = headings.find((heading) => visible.has(heading.id));
        if (top) setActiveId(top.id);
      },
      // 视口上 20% 到 30% 之间的横带作为判定区
      { rootMargin: '-20% 0px -70% 0px' },
    );
    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [itemKey]);

  const jump = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    // 更新 hash 但不触发原生跳闪
    history.replaceState(null, '', `#${id}`);
    setActiveId(id);
  };

  return (
    <nav aria-label="页面目录" className={cn('w-full border-l border-white/[0.08]', className)}>
      <ul>
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active ? 'true' : undefined}
                onClick={(event) => jump(event, item.id)}
                className={cn(
                  'relative flex h-7 items-center pl-4 text-[13px] transition-colors duration-200',
                  active ? 'text-zinc-200' : 'text-zinc-500 hover:text-zinc-300',
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    'absolute left-0 top-1/2 w-0.5 -translate-y-1/2 rounded-full transition-all duration-200',
                    active ? 'h-6 bg-[#d7ff3c]' : 'h-3 bg-white/[0.12]',
                  )}
                />
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
