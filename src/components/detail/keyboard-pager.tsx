'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface KeyboardPagerProps {
  prevHref?: string;
  nextHref?: string;
}

/** 详情页键盘翻页：← / → 跳上一 / 下一组件。不渲染任何内容，挂在页面底部即可。 */
export function KeyboardPager({ prevHref, nextHref }: KeyboardPagerProps) {
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      // 焦点在输入控件、可编辑区域或打开的弹层（⌘K 面板）里时让路
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        target.closest('input, textarea, select, [contenteditable], dialog[open]')
      ) {
        return;
      }
      const href = event.key === 'ArrowLeft' ? prevHref : nextHref;
      if (href) {
        event.preventDefault();
        router.push(href);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [router, prevHref, nextHref]);

  return null;
}
