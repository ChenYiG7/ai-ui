'use client';

import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { cn } from '@/lib/utils';

interface ScrollProgressProps {
  /** fixed:贴视口顶部;inline:绝对定位于最近的 positioned 祖先顶部(自行提供 relative 容器) */
  variant?: 'fixed' | 'inline';
  /** 进度条高度（px） */
  height?: number;
  /** 进度条颜色 */
  color?: string;
  className?: string;
}

/** 阅读进度条:一条贴顶细线随页面滚动生长,scaleX 驱动不触发重排。 */
export function ScrollProgress({
  variant = 'fixed',
  height = 2,
  color = '#d7ff3c',
  className,
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion();
  // 弹簧平滑快速滚动,带一点惯性感;reduced 时直接映射进度
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 30, mass: 0.3 });

  return (
    <motion.div
      aria-hidden
      className={cn(
        'inset-x-0 top-0 origin-left',
        variant === 'fixed' ? 'fixed z-50' : 'absolute',
        className,
      )}
      style={{ height, backgroundColor: color, scaleX: reduced ? scrollYProgress : scaleX }}
    />
  );
}
