'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagInputProps {
  /** 受控标签数组 */
  tags?: string[];
  /** 非受控初始标签 */
  defaultTags?: string[];
  onTagsChange?: (tags: string[]) => void;
  /** 草稿占位文本 */
  placeholder?: string;
  /** 最多标签数,满后输入框禁用 */
  max?: number;
  disabled?: boolean;
  className?: string;
}

const SEPARATORS = /[,、;;]/;

/** 标签输入:回车落签、退格收回,把一行输入变成一把可删的标签。 */
export function TagInput({
  tags: controlledTags,
  defaultTags = [],
  onTagsChange,
  placeholder = '回车或逗号添加',
  max,
  disabled = false,
  className,
}: TagInputProps) {
  const [innerTags, setInnerTags] = useState(defaultTags);
  const tags = controlledTags ?? innerTags;
  const [draft, setDraft] = useState('');
  const [announce, setAnnounce] = useState('');
  const [inputWidth, setInputWidth] = useState(120);
  const inputRef = useRef<HTMLInputElement>(null);
  const sizerRef = useRef<HTMLSpanElement>(null);

  const atMax = max !== undefined && tags.length >= max;
  const inputPlaceholder = atMax ? `最多 ${max} 个` : placeholder;

  // 镜像 span 实测草稿宽度,中英文同等精确
  useLayoutEffect(() => {
    if (sizerRef.current) setInputWidth(sizerRef.current.offsetWidth + 2);
  }, [draft, inputPlaceholder]);

  const update = (next: string[], message: string) => {
    if (controlledTags === undefined) setInnerTags(next);
    onTagsChange?.(next);
    setAnnounce(message);
  };

  const addDraft = () => {
    const value = draft.trim();
    setDraft('');
    if (!value) return;
    if (atMax) {
      setAnnounce(`最多 ${max} 个标签`);
      return;
    }
    if (tags.includes(value)) {
      setAnnounce(`标签「${value}」已存在`);
      return;
    }
    update([...tags, value], `已添加「${value}」,共 ${tags.length + 1} 个`);
  };

  const remove = (tag: string) => {
    const next = tags.filter((item) => item !== tag);
    update(next, `已移除「${tag}」,共 ${next.length} 个`);
    inputRef.current?.focus();
  };

  // 按分隔符拆分批量入签,尾段留作草稿
  const commitBatch = (raw: string) => {
    const parts = raw.split(SEPARATORS);
    const tail = (parts.pop() ?? '').trim();
    const next = [...tags];
    let added = 0;
    for (const part of parts) {
      const value = part.trim();
      if (!value || next.includes(value) || (max !== undefined && next.length >= max)) continue;
      next.push(value);
      added += 1;
    }
    if (added) update(next, `已添加 ${added} 个标签,共 ${next.length} 个`);
    setDraft(tail);
  };

  const handleDraftChange = (raw: string) => {
    // 键入分隔符即时成签
    if (SEPARATORS.test(raw)) {
      commitBatch(raw);
      return;
    }
    setDraft(raw);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
      event.preventDefault();
      addDraft();
    } else if (event.key === 'Backspace' && !draft) {
      const last = tags[tags.length - 1];
      if (last) remove(last);
    } else if (event.key === 'Escape') {
      setDraft('');
    }
  };

  return (
    <div
      className={cn(
        'relative flex min-h-11 flex-wrap items-center gap-1.5 rounded-xl border border-white/[0.10] bg-white/[0.04] px-2.5 py-2 transition-colors duration-150 focus-within:border-white/[0.22] focus-within:shadow-[0_0_0_3px_rgba(215,255,60,0.08)] motion-reduce:transition-none',
        disabled && 'pointer-events-none opacity-40',
        className,
      )}
    >
      {tags.map((tag) => (
        <span
          key={tag}
          className="flex h-7 items-center gap-0.5 rounded-md border border-white/[0.08] bg-white/[0.06] pl-2 pr-1 text-[13px] text-zinc-200"
        >
          {tag}
          <button
            type="button"
            onClick={() => remove(tag)}
            aria-label={`移除 ${tag}`}
            className="grid size-5 place-items-center rounded text-zinc-500 transition-colors hover:bg-white/[0.08] hover:text-zinc-200 motion-reduce:transition-none"
          >
            <X aria-hidden className="size-3" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={draft}
        onChange={(event) => handleDraftChange(event.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={(event) => {
          event.preventDefault();
          commitBatch(event.clipboardData.getData('text'));
        }}
        onBlur={() => addDraft()}
        disabled={disabled || atMax}
        placeholder={inputPlaceholder}
        aria-label="添加标签"
        className="h-7 min-w-6 bg-transparent text-[13px] text-zinc-100 caret-[#d7ff3c] outline-none placeholder:text-zinc-600"
        style={{ width: Math.max(inputWidth, 24) }}
      />
      <span role="status" className="sr-only">
        {announce}
      </span>
      <span
        ref={sizerRef}
        aria-hidden
        className="pointer-events-none invisible absolute left-0 top-0 -z-10 whitespace-pre text-[13px]"
      >
        {draft || inputPlaceholder}
      </span>
    </div>
  );
}
