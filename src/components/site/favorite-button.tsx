'use client';

import { Heart } from 'lucide-react';
import { useFavorites } from '@/lib/favorites';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  slug: string;
  title: string;
  className?: string;
  /** 详情页大按钮：带「收藏 / 已收藏」文字 */
  withLabel?: boolean;
}

/** 本地收藏开关：写入 localStorage，卡片与详情页、跨标签页实时同步。 */
export function FavoriteButton({ slug, title, className, withLabel = false }: FavoriteButtonProps) {
  const { has, toggle } = useFavorites();
  const active = has(slug);
  const label = (active ? '取消收藏：' : '收藏：') + title;

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={label}
      title={label}
      onClick={() => toggle(slug)}
      className={cn(
        'inline-flex shrink-0 items-center gap-2 rounded-full border font-medium transition-colors duration-200',
        active
          ? 'border-accent/40 bg-accent/10 text-accent'
          : 'border-line bg-white/[0.025] text-mute hover:border-accent/40 hover:text-accent',
        withLabel ? 'h-11 px-5 text-sm' : 'size-8 justify-center',
        className,
      )}
    >
      <Heart aria-hidden className={cn('size-3.5', active && 'fill-current')} />
      {withLabel ? <span>{active ? '已收藏' : '收藏'}</span> : null}
    </button>
  );
}
