'use client';

import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

export interface GlowProgressProps {
  /** 0–100 的确定进度;不传则进入待定(indeterminate)模式 */
  value?: number;
  /** 轨道左侧与 aria-label 共用的名称 */
  label?: string;
  /** 是否在右侧显示等宽字体百分比读数(待定模式忽略) */
  showValue?: boolean;
  className?: string;
}

/** 辉光进度条:荧光绿填充沿轨道生长并散发柔光,数值变化以弹簧推进;待定模式下光段来回巡航。 */
export function GlowProgress({ value, label = '进度', showValue = true, className }: GlowProgressProps) {
  const reduced = useReducedMotion();
  const indeterminate = value === undefined;
  const clamped = Math.min(100, Math.max(0, value ?? 0));

  return (
    <div
      role="progressbar"
      aria-label={label}
      {...(indeterminate
        ? {}
        : { 'aria-valuenow': Math.round(clamped), 'aria-valuemin': 0, 'aria-valuemax': 100 })}
      className={cn('w-full', className)}
    >
      <div className="mb-2 flex items-baseline justify-between text-[10px]">
        <span className="text-zinc-400">{label}</span>
        {!indeterminate && showValue && (
          <span className="font-mono text-zinc-500">{String(Math.round(clamped)).padStart(3, '0')}%</span>
        )}
      </div>
      <div className="h-1.5 overflow-hidden rounded-full border border-white/[0.06] bg-white/[0.05]">
        {indeterminate ? (
          <div className="glow-progress-sweep h-full w-2/5 rounded-full bg-gradient-to-r from-[#d7ff3c]/40 to-[#d7ff3c] shadow-[0_0_12px_rgba(215,255,60,0.4)]" />
        ) : (
          <motion.div
            initial={false}
            animate={{ width: `${clamped}%` }}
            transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 170, damping: 26 }}
            className="h-full rounded-full bg-gradient-to-r from-[#d7ff3c]/40 to-[#d7ff3c] shadow-[0_0_12px_rgba(215,255,60,0.4)]"
          />
        )}
      </div>
      <style href="glow-progress-keyframes" precedence="medium">{`
        @keyframes glow-progress-sweep {
          from { transform: translateX(-110%); }
          to { transform: translateX(280%); }
        }
        .glow-progress-sweep {
          animation: glow-progress-sweep 1.5s cubic-bezier(0.45, 0, 0.55, 1) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .glow-progress-sweep { animation: none; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
