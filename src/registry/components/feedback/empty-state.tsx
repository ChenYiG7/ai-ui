'use client';

import { motion, useReducedMotion } from 'motion/react';
import { Inbox } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  /** 一句话说明"为什么是空的" */
  title: string;
  /** 补一句出路:用户下一步能做什么 */
  description?: string;
  /** 图标,缺省 Inbox;建议传 lucide 图标并配 size-5 */
  icon?: ReactNode;
  /** 动作区插槽,通常放一个主按钮 */
  action?: ReactNode;
  className?: string;
}

/** 空状态:虚线展位 + 图标 + 一句去路;入场轻浮起,prefers-reduced-motion 时直接静态可见。 */
export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduced ? { duration: 0 } : { duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'flex flex-col items-center rounded-2xl border border-dashed border-white/12 bg-white/[0.015] px-6 py-10 text-center',
        className,
      )}
    >
      <span
        aria-hidden
        className="grid size-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-400"
      >
        {icon ?? <Inbox className="size-5" />}
      </span>
      <p className="mt-4 text-sm font-medium text-zinc-100">{title}</p>
      {description && (
        <p className="mt-1.5 max-w-60 text-xs leading-relaxed text-zinc-500">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
}
