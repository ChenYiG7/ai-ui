'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CommandItem {
  /** 唯一标识 */
  id: string;
  /** 展示文本 */
  label: string;
  /** 右侧提示（分组名或快捷键） */
  hint?: string;
  /** 额外匹配关键词（不展示） */
  keywords?: string;
  /** 左侧图标 */
  icon?: React.ReactNode;
}

interface CommandPaletteProps {
  /** 命令列表 */
  commands: CommandItem[];
  /** 选中回调；modal 模式下选中后自动关闭 */
  onSelect?: (item: CommandItem) => void;
  /** modal:居中浮层 + ⌘/Ctrl+K;inline:嵌入页面的无遮罩变体 */
  variant?: 'modal' | 'inline';
  /** modal 模式全局快捷键（⌘/Ctrl + 该键） */
  hotkey?: string;
  /** modal 模式初始是否展开 */
  defaultOpen?: boolean;
  /** 初始搜索词 */
  defaultQuery?: string;
  /** 搜索占位文本 */
  placeholder?: string;
  className?: string;
}

/** 命令面板:⌘K 唤起的模糊过滤列表,方向键选择、回车执行,支持嵌入式 inline 变体。 */
export function CommandPalette({
  commands,
  onSelect,
  variant = 'modal',
  hotkey = 'k',
  defaultOpen = false,
  defaultQuery = '',
  placeholder = '搜索命令…',
  className,
}: CommandPaletteProps) {
  const [open, setOpen] = useState(variant === 'inline' ? true : defaultOpen);
  const [query, setQuery] = useState(defaultQuery);
  const [activeIndex, setActiveIndex] = useState(0);
  const reduced = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return commands;
    return commands.filter((command) =>
      `${command.label} ${command.keywords ?? ''}`.toLowerCase().includes(needle),
    );
  }, [commands, query]);

  // 搜索词或结果集变化时,高亮回到第一项
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (activeIndex >= filtered.length) setActiveIndex(Math.max(0, filtered.length - 1));
  }, [activeIndex, filtered.length]);

  // modal:全局快捷键开关
  useEffect(() => {
    if (variant !== 'modal') return;
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === hotkey) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [variant, hotkey]);

  // modal:展开时锁定背景滚动
  useEffect(() => {
    if (variant !== 'modal' || !open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [variant, open]);

  useEffect(() => {
    if (variant === 'modal' && open) inputRef.current?.focus();
  }, [variant, open]);

  const close = () => variant === 'modal' && setOpen(false);

  const select = (item: CommandItem) => {
    onSelect?.(item);
    close();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (filtered.length) setActiveIndex((index) => (index + 1) % filtered.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (filtered.length) setActiveIndex((index) => (index - 1 + filtered.length) % filtered.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const item = filtered[activeIndex];
      if (item) select(item);
    } else if (event.key === 'Escape') {
      close();
    }
  };

  const body = (
    <PaletteBody
      commands={filtered}
      query={query}
      onQueryChange={setQuery}
      activeIndex={activeIndex}
      onActiveIndexChange={setActiveIndex}
      onKeyDown={onKeyDown}
      onSelect={select}
      inputRef={inputRef}
      listId={listId}
      placeholder={placeholder}
      showFooter={variant === 'modal'}
    />
  );

  if (variant === 'inline') {
    return (
      <div
        className={cn(
          'w-full overflow-hidden rounded-2xl border border-white/[0.12] bg-[#141412]',
          className,
        )}
      >
        {body}
      </div>
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-[12vh] backdrop-blur-[4px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.2 }}
          onClick={close}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="命令面板"
            className={cn(
              'w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.12] bg-[#141412] shadow-2xl',
              className,
            )}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 4 }}
            transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 30 }}
            onClick={(event) => event.stopPropagation()}
          >
            {body}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface PaletteBodyProps {
  commands: CommandItem[];
  query: string;
  onQueryChange: (query: string) => void;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onSelect: (item: CommandItem) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  listId: string;
  placeholder: string;
  showFooter: boolean;
}

function PaletteBody({
  commands,
  query,
  onQueryChange,
  activeIndex,
  onActiveIndexChange,
  onKeyDown,
  onSelect,
  inputRef,
  listId,
  placeholder,
  showFooter,
}: PaletteBodyProps) {
  return (
    <>
      <div className="flex h-12 items-center gap-2.5 border-b border-white/[0.06] px-4">
        <Search aria-hidden className="size-4 shrink-0 text-zinc-500" />
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-label="搜索命令"
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
        />
        <kbd className="shrink-0 rounded border border-white/10 bg-white/[0.05] px-1.5 py-0.5 font-mono text-[10px] text-zinc-500">
          esc
        </kbd>
      </div>
      <ul id={listId} role="listbox" aria-label="命令列表" className="max-h-72 overflow-y-auto p-1.5">
        {commands.map((command, index) => {
          const active = index === activeIndex;
          return (
            <li
              key={command.id}
              role="option"
              aria-selected={active}
              id={`${listId}-${command.id}`}
              onMouseMove={() => onActiveIndexChange(index)}
              onClick={() => onSelect(command)}
              className={cn(
                'relative flex h-11 cursor-pointer items-center gap-3 rounded-lg px-3 text-[13px]',
                active ? 'bg-white/[0.06] text-zinc-100' : 'text-zinc-400',
              )}
            >
              {command.icon && <span className="shrink-0 text-zinc-500">{command.icon}</span>}
              <span className="min-w-0 flex-1 truncate">{command.label}</span>
              {command.hint && (
                <span className="shrink-0 font-mono text-[11px] text-zinc-600">{command.hint}</span>
              )}
              {active && (
                <span aria-hidden className="shrink-0 font-mono text-[11px] text-[#d7ff3c]">
                  ↵
                </span>
              )}
            </li>
          );
        })}
        {!commands.length && (
          <li aria-disabled className="px-3 py-8 text-center text-xs text-zinc-500">
            没有匹配的命令
          </li>
        )}
      </ul>
      {showFooter && (
        <div className="flex h-9 items-center gap-4 border-t border-white/[0.06] px-4 text-[11px] text-zinc-600">
          <span>
            <Kbd>↑</Kbd> <Kbd>↓</Kbd> 选择
          </span>
          <span>
            <Kbd>↵</Kbd> 确认
          </span>
          <span>
            <Kbd>esc</Kbd> 关闭
          </span>
        </div>
      )}
    </>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-white/10 bg-white/[0.05] px-1 py-0.5 font-mono text-[10px]">
      {children}
    </kbd>
  );
}
