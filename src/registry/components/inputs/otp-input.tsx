'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface OtpInputProps {
  /** 位数 */
  length?: number;
  /** 受控值 */
  value?: string;
  /** 非受控初始值 */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** 全部填满时触发一次 */
  onComplete?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

function toCells(raw: string, length: number): string[] {
  const digits = raw.match(/\d/g) ?? [];
  return Array.from({ length }, (_, index) => digits[index] ?? '');
}

/** 验证码输入:一位一格,键入自动前进、粘贴自动铺开,填满即触发提交。 */
export function OtpInput({
  length = 6,
  value,
  defaultValue = '',
  onChange,
  onComplete,
  disabled = false,
  className,
}: OtpInputProps) {
  const [cells, setCells] = useState(() => toCells(defaultValue, length));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const completedRef = useRef('');

  // 受控值同步
  useEffect(() => {
    if (value !== undefined) setCells(toCells(value, length));
  }, [value, length]);

  const focusCell = (index: number) => {
    inputsRef.current[index]?.focus();
  };

  const commit = (next: string[]) => {
    setCells(next);
    const joined = next.join('');
    onChange?.(joined);
    if (joined.length === length && !joined.includes('') && completedRef.current !== joined) {
      completedRef.current = joined;
      onComplete?.(joined);
    }
  };

  const fillFrom = (start: number, digits: string) => {
    if (!digits) return;
    const next = [...cells];
    let cursor = start;
    for (const digit of digits) {
      if (cursor >= length) break;
      next[cursor] = digit;
      cursor += 1;
    }
    commit(next);
    focusCell(Math.min(cursor, length - 1));
  };

  const handleInput = (index: number, raw: string) => {
    const digits = raw.replace(/\D/g, '');
    if (!digits) {
      const next = [...cells];
      next[index] = '';
      commit(next);
      return;
    }
    // 输入法或长按一次吐出多位:从当前格铺开
    if (digits.length > 1) {
      fillFrom(index, digits);
      return;
    }
    const next = [...cells];
    next[index] = digits;
    commit(next);
    focusCell(Math.min(index + 1, length - 1));
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      event.preventDefault();
      const next = [...cells];
      if (next[index]) {
        next[index] = '';
        commit(next);
      } else if (index > 0) {
        next[index - 1] = '';
        commit(next);
        focusCell(index - 1);
      }
    } else if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      focusCell(index - 1);
    } else if (event.key === 'ArrowRight' && index < length - 1) {
      event.preventDefault();
      focusCell(index + 1);
    }
  };

  return (
    <div
      role="group"
      aria-label="验证码输入"
      className={cn('flex gap-2', disabled && 'pointer-events-none opacity-40', className)}
    >
      {cells.map((digit, index) => {
        const focused = focusedIndex === index;
        return (
          <div key={index} className="relative">
            <input
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              value={digit}
              onChange={(event) => handleInput(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              onFocus={(event) => {
                setFocusedIndex(index);
                event.currentTarget.select();
              }}
              onBlur={() => setFocusedIndex((current) => (current === index ? null : current))}
              onPaste={(event) => {
                event.preventDefault();
                fillFrom(index, event.clipboardData.getData('text').replace(/\D/g, ''));
              }}
              inputMode="numeric"
              autoComplete={index === 0 ? 'one-time-code' : 'off'}
              maxLength={1}
              disabled={disabled}
              aria-label={`第 ${index + 1} 位`}
              className={cn(
                'size-11 rounded-lg border bg-white/[0.04] text-center text-lg font-medium tabular-nums text-zinc-100 caret-transparent outline-none transition-colors duration-150 motion-reduce:transition-none',
                focused
                  ? 'border-[#d7ff3c]/70 shadow-[0_0_0_3px_rgba(215,255,60,0.10)]'
                  : digit
                    ? 'border-white/[0.14]'
                    : 'border-white/[0.08]',
              )}
            />
            {focused && !digit && (
              <span
                aria-hidden
                className="otp-input-caret pointer-events-none absolute left-1/2 top-1/2 h-[18px] w-[1.5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d7ff3c]/90"
              />
            )}
          </div>
        );
      })}
      <style href="otp-input-keyframes" precedence="medium">
        {`@media (prefers-reduced-motion: no-preference) {
  .otp-input-caret { animation: otp-input-blink 1.1s steps(1) infinite; }
}
@keyframes otp-input-blink {
  0%, 55% { opacity: 1; }
  56%, 100% { opacity: 0; }
}`}
      </style>
    </div>
  );
}
