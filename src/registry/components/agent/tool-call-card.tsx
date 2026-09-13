'use client';

import { useId, useState } from 'react';
import { Check, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToolCallStatus = 'running' | 'success' | 'error';

interface ToolCallCardProps {
  /** 工具名，如 web_search */
  tool: string;
  /** 调用状态：running 旋转环 / success 对勾 / error 叉 */
  status: ToolCallStatus;
  /** 一行参数摘要，收起时显示 */
  summary?: string;
  /** 结果内容，展开后可见 */
  children?: React.ReactNode;
  /** 默认是否展开 */
  defaultOpen?: boolean;
  className?: string;
}

const STATUS_META: Record<ToolCallStatus, { label: string }> = {
  running: { label: '执行中' },
  success: { label: '已完成' },
  error: { label: '失败' },
};

/** 工具调用卡：一行收纳工具名、参数与状态，结果可展开；状态从旋转环走到对勾。 */
export function ToolCallCard({
  tool,
  status,
  summary,
  children,
  defaultOpen = false,
  className,
}: ToolCallCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();
  const expandable = children !== undefined && children !== null;

  return (
    <div className={cn('w-full rounded-lg border border-white/[0.08] bg-white/[0.02]', className)}>
      <button
        type="button"
        onClick={() => expandable && setOpen((value) => !value)}
        aria-expanded={expandable ? open : undefined}
        aria-controls={expandable ? contentId : undefined}
        className={cn(
          'flex h-9 w-full items-center gap-2 px-3 text-left',
          expandable && 'cursor-pointer',
        )}
      >
        {expandable && (
          <ChevronRight
            aria-hidden
            className={cn(
              'size-3.5 shrink-0 text-zinc-600 transition-transform duration-200 motion-reduce:transition-none',
              open && 'rotate-90',
            )}
          />
        )}
        <span
          aria-hidden
          className="shrink-0 font-mono text-[13px] text-zinc-200"
        >
          {tool}
        </span>
        {summary && (
          <span className="min-w-0 flex-1 truncate text-xs text-zinc-500">{summary}</span>
        )}
        {!summary && <span className="flex-1" />}
        <span className="sr-only">{STATUS_META[status].label}</span>
        <StatusIcon status={status} />
      </button>
      {expandable && (
        <div
          id={contentId}
          aria-hidden={!open}
          className={cn(
            'grid transition-[grid-template-rows] duration-240 ease-out motion-reduce:transition-none',
            open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
          )}
        >
          <div className="overflow-hidden">
            <div className="border-t border-white/[0.05] px-3 py-2 text-xs leading-relaxed text-zinc-400">
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusIcon({ status }: { status: ToolCallStatus }) {
  if (status === 'running') {
    return (
      <span
        aria-hidden
        className="size-3.5 shrink-0 animate-spin rounded-full border-[1.5px] border-white/25 border-t-white/80 motion-reduce:animate-none"
      />
    );
  }
  const Icon = status === 'success' ? Check : X;
  return (
    <span
      aria-hidden
      className={cn(
        'flex size-3.5 shrink-0 items-center justify-center',
        status === 'success' ? 'text-[#d7ff3c]' : 'text-[#ff7a6b]',
      )}
    >
      <Icon className="size-3.5" strokeWidth={2.5} />
    </span>
  );
}
