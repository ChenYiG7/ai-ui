'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { type ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';

export interface StatusCalloutProps {
  /** 提示主句 */
  title: string;
  /** 补充说明,可省 */
  description?: string;
  /** 语义色调;warning / danger 会渲染为 role=alert */
  tone?: 'success' | 'info' | 'warning' | 'danger';
  /** 图标,缺省为 6px 圆点;建议传 lucide 图标并配 size-3.5 */
  icon?: ReactNode;
  /** 传入后显示关闭按钮,组件自行管理退场动画 */
  onDismiss?: () => void;
  className?: string;
}

/** 四色柔和提示条:边框与底色同色相 tint,与 toast-stack 共用同一组色调常量。 */
const TONES: Record<NonNullable<StatusCalloutProps['tone']>, { box: string; tile: string }> = {
  success: {
    box: 'border-[#c0d9ad]/20 bg-[#c0d9ad]/[0.06]',
    tile: 'border-[#c0d9ad]/25 bg-[#c0d9ad]/10 text-[#c0d9ad]',
  },
  info: {
    box: 'border-[#acc8dc]/20 bg-[#acc8dc]/[0.06]',
    tile: 'border-[#acc8dc]/25 bg-[#acc8dc]/10 text-[#acc8dc]',
  },
  warning: {
    box: 'border-[#dfc59e]/20 bg-[#dfc59e]/[0.06]',
    tile: 'border-[#dfc59e]/25 bg-[#dfc59e]/10 text-[#dfc59e]',
  },
  danger: {
    box: 'border-[#e0a3a3]/20 bg-[#e0a3a3]/[0.06]',
    tile: 'border-[#e0a3a3]/25 bg-[#e0a3a3]/10 text-[#e0a3a3]',
  },
};

/** 状态提示条:操作结果就地出现;warning / danger 以 alert 立即播报,其余以 status 礼貌播报。 */
export function StatusCallout({ title, description, tone = 'info', icon, onDismiss, className }: StatusCalloutProps) {
  const reduced = useReducedMotion();
  const [dismissed, setDismissed] = useState(false);
  const tones = TONES[tone];

  return (
    <AnimatePresence initial={false}>
      {!dismissed && (
        <motion.div
          role={tone === 'warning' || tone === 'danger' ? 'alert' : 'status'}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={
            reduced
              ? { opacity: 0 }
              : { opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.18, ease: 'easeIn' } }
          }
          transition={reduced ? { duration: 0 } : { duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className={cn('flex items-start gap-3 rounded-xl border p-3', tones.box, className)}
        >
          <span
            aria-hidden
            className={cn('mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg border', tones.tile)}
          >
            {icon ?? <span className="size-1.5 rounded-full bg-current" />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-zinc-100">{title}</p>
            {description && <p className="mt-1 text-[10px] leading-relaxed text-zinc-400">{description}</p>}
          </div>
          {onDismiss && (
            <button
              type="button"
              aria-label="关闭提示"
              onClick={() => {
                setDismissed(true);
                onDismiss();
              }}
              className="min-h-6 shrink-0 rounded px-1 text-[9px] text-zinc-500 hover:text-zinc-200 focus-visible:outline-2 focus-visible:outline-white/60"
            >
              关闭
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
