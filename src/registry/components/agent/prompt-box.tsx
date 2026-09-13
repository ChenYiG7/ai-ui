'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PromptBoxProps {
  /** 发送回调；组件自身管理输入内容，发送后自动清空 */
  onSubmit?: (text: string) => void;
  /** 发送中：输入与发送键禁用，键内显示旋转环 */
  sending?: boolean;
  /** 占位提示 */
  placeholder?: string;
  /** 最大行数，超过后内部滚动 */
  maxRows?: number;
  disabled?: boolean;
  className?: string;
}

const LINE_HEIGHT = 24;

/** 提示输入框：随内容长高的对话输入框，Enter 发送、Shift+Enter 换行，可发送时发送键点亮。 */
export function PromptBox({
  onSubmit,
  sending = false,
  placeholder = '输入消息，Shift+Enter 换行',
  maxRows = 5,
  disabled = false,
  className,
}: PromptBoxProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canSend = value.trim().length > 0 && !sending && !disabled;

  // 高度随内容自动生长，到 maxRows 后内部滚动
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, maxRows * LINE_HEIGHT)}px`;
  }, [value, maxRows]);

  const submit = () => {
    const text = value.trim();
    if (!text || !canSend) return;
    onSubmit?.(text);
    setValue('');
  };

  return (
    <div
      className={cn(
        'flex w-full items-end gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-3 transition-[border-color,box-shadow] duration-150 focus-within:border-white/25 focus-within:shadow-[0_0_0_3px_rgba(215,255,60,0.08)] motion-reduce:transition-none',
        className,
      )}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          // IME 组合中（如中文输入）不触发发送
          if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
            event.preventDefault();
            submit();
          }
        }}
        rows={1}
        disabled={disabled}
        placeholder={placeholder}
        aria-label="消息输入框"
        className="min-w-0 flex-1 resize-none overflow-y-auto bg-transparent text-sm leading-6 text-zinc-100 outline-none placeholder:text-zinc-600 disabled:opacity-50"
      />
      <button
        type="button"
        onClick={submit}
        disabled={!canSend}
        aria-label={sending ? '发送中' : '发送'}
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-full transition-colors duration-150 motion-reduce:transition-none',
          canSend ? 'bg-[#d7ff3c] text-black' : 'bg-white/[0.08] text-zinc-500',
        )}
      >
        {sending ? (
          <span
            aria-hidden
            className="size-3.5 animate-spin rounded-full border-[1.5px] border-black/25 border-t-black/80 motion-reduce:animate-none"
          />
        ) : (
          <ArrowUp aria-hidden className="size-4" strokeWidth={2.5} />
        )}
      </button>
    </div>
  );
}
