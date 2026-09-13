'use client';

import { useEffect, useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThinkingBlockProps {
  /** 是否仍在思考：圆点呼吸 + 秒数计时；结束后定格为「思考了 N 秒」 */
  thinking?: boolean;
  /** 思考耗时（秒），仅在 thinking=false 时展示 */
  duration?: number;
  /** 默认是否展开 */
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

/** 思考折叠块：一行标头收纳推理过程，思考时呼吸计时，展开收起带高度弹簧。 */
export function ThinkingBlock({
  thinking = false,
  duration = 0,
  defaultOpen = false,
  children,
  className,
}: ThinkingBlockProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [elapsed, setElapsed] = useState(0);
  const reduced = useReducedMotion();
  const contentId = useId();

  // 思考中的逐秒计时
  useEffect(() => {
    if (!thinking) return;
    setElapsed(0);
    const timer = window.setInterval(() => setElapsed((seconds) => seconds + 1), 1000);
    return () => window.clearInterval(timer);
  }, [thinking]);

  return (
    <div className={cn('relative w-full pl-4', className)}>
      <span aria-hidden className="absolute inset-y-0 left-0 w-px bg-white/10" />
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={contentId}
        className="flex h-8 w-full items-center gap-2 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
      >
        <span
          aria-hidden
          className={cn(
            'size-1.5 shrink-0 rounded-full',
            thinking ? 'thinking-block-dot bg-[#d7ff3c]' : 'bg-white/25',
          )}
        />
        <span>{thinking ? `思考中 · ${elapsed}s` : `思考了 ${duration}s`}</span>
        <motion.span
          aria-hidden
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: reduced ? 0 : 0.2 }}
          className="ml-auto"
        >
          <ChevronRight className="size-3.5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={contentId}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="pb-3 pt-1 text-[13px] leading-relaxed text-zinc-400">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
      <style href="thinking-block-keyframes" precedence="medium">{`
        @keyframes thinking-block-breathe{0%,100%{transform:scale(.7);opacity:.35}50%{transform:scale(1.15);opacity:.9}}
        @media (prefers-reduced-motion: no-preference){
          .thinking-block-dot{animation:thinking-block-breathe 1.6s ease-in-out infinite}
        }
      `}</style>
    </div>
  );
}
