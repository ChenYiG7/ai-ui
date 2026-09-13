'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { RotateCcw, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UndoToastProps {
  /** 操作描述,如「已删除 3 个文件」 */
  action: string;
  /** 自动确认时长(ms);0 表示常驻不倒计时 */
  duration?: number;
  /** 受控开关;受控时关闭由调用方决定 */
  open?: boolean;
  /** 非受控初始状态 */
  defaultOpen?: boolean;
  /** 点击撤销,随后自动关闭 */
  onUndo?: () => void;
  /** 倒计时归零自动关闭时触发 */
  onExpire?: () => void;
  /** 左侧图标,默认为删除隐喻 */
  icon?: React.ReactNode;
  /** 演示模式:关闭后 1.4s 自动重新入场 */
  demo?: boolean;
  className?: string;
}

/** 撤销提示:操作先执行、给几秒反悔,倒计时走完前一条「撤销」随时挽回。 */
export function UndoToast({
  action,
  duration = 6000,
  open: controlledOpen,
  defaultOpen = false,
  onUndo,
  onExpire,
  icon,
  demo = false,
  className,
}: UndoToastProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = controlledOpen ?? uncontrolledOpen;
  const [remaining, setRemaining] = useState(duration);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();

  const onUndoRef = useRef(onUndo);
  onUndoRef.current = onUndo;
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;
  const demoRef = useRef(demo);
  demoRef.current = demo;
  const durationRef = useRef(duration);
  durationRef.current = duration;
  const reenterRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setOpen = (value: boolean) => {
    if (controlledOpen === undefined) setUncontrolledOpen(value);
  };

  const close = (kind: 'undo' | 'expire') => {
    setOpen(false);
    if (kind === 'expire') onExpireRef.current?.();
    if (demoRef.current) {
      reenterRef.current = setTimeout(() => {
        setRemaining(durationRef.current);
        setOpen(true);
      }, 1400);
    }
  };

  // 入场时重置倒计时
  useEffect(() => {
    if (isOpen) setRemaining(duration);
  }, [isOpen, duration]);

  // 100ms 步进倒计时;悬停暂停或常驻(toast 未展开且仍有剩余)时停止
  useEffect(() => {
    if (!isOpen || paused || !duration) return;
    const id = window.setInterval(() => {
      setRemaining((value) => Math.max(0, value - 100));
    }, 100);
    return () => window.clearInterval(id);
  }, [isOpen, paused, duration]);

  useEffect(() => {
    if (isOpen && duration && remaining <= 0) close('expire');
  }, [remaining, isOpen, duration]);

  useEffect(
    () => () => {
      if (reenterRef.current) clearTimeout(reenterRef.current);
    },
    [],
  );

  const seconds = Math.max(1, Math.ceil(remaining / 1000));
  const progress = duration > 0 ? remaining / duration : 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={cn(
            'relative w-full overflow-hidden rounded-xl border border-white/[0.10] bg-[#151617] px-4 pb-3.5 pt-3 shadow-[0_12px_40px_rgba(0,0,0,0.45)]',
            className,
          )}
          initial={reduced ? false : { opacity: 0, y: 14, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={
            reduced
              ? { opacity: 0, transition: { duration: 0 } }
              : { opacity: 0, y: 10, scale: 0.98, transition: { duration: 0.15, ease: 'easeIn' } }
          }
          transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 30 }}
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
        >
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="grid size-8 shrink-0 place-items-center rounded-full border border-white/[0.08] bg-white/[0.05] text-zinc-400"
            >
              {icon ?? <Trash2 className="size-3.5" />}
            </span>
            <p className="min-w-0 flex-1 truncate text-[13px] text-zinc-200">{action}</p>
            {duration > 0 && (
              <span
                className={cn(
                  'shrink-0 font-mono text-[11px] tabular-nums transition-colors motion-reduce:transition-none',
                  paused ? 'text-zinc-600' : 'text-zinc-500',
                )}
              >
                {paused ? '已暂停' : `${seconds}s`}
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                close('undo');
                onUndoRef.current?.();
              }}
              className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-[#d7ff3c] transition-colors hover:bg-[#d7ff3c]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d7ff3c]/60 motion-reduce:transition-none"
            >
              <RotateCcw aria-hidden className="size-3" />
              撤销
            </button>
          </div>
          {duration > 0 && (
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-white/[0.06]">
              <div
                className="h-full origin-left bg-[#d7ff3c]/80"
                style={{ transform: `scaleX(${progress})` }}
              />
            </div>
          )}
          <span className="sr-only">
            {action} · {duration > 0 ? `${Math.round(duration / 1000)} 秒内可撤销` : '可撤销'}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
