'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface StreamingTextProps {
  /** 完整文本；追加内容会接续播放，替换或清空会重置 */
  text: string;
  /** 实时流模式：追加内容立即渲染，结束后设为 false */
  streaming?: boolean;
  /** 回放时每个字素的间隔（毫秒） */
  interval?: number;
  /** 播完停顿 2 秒后重播；实时流模式下不生效 */
  loop?: boolean;
  /** 非流式播放完成时触发 */
  onComplete?: () => void;
  className?: string;
}

const LOOP_PAUSE = 2000;
const ANNOUNCE_STEP = 900;

/** 流式文本：按字素逐字吐出，末尾方块光标闪烁；实时流模式下增量即时渲染。 */
export function StreamingText({
  text,
  streaming = false,
  interval = 24,
  loop = false,
  onComplete,
  className,
}: StreamingTextProps) {
  const [cursor, setCursor] = useState(0);
  const [done, setDone] = useState(false);
  const [reduced, setReduced] = useState(false);
  const prevTextRef = useRef('');
  const announcedRef = useRef(0);
  const lastAnnounceRef = useRef(0);
  const liveRef = useRef<HTMLSpanElement>(null);

  // 跟随系统的减少动态效果设置
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(media.matches);
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, []);

  // 追加接续播放；替换或清空则重置
  useEffect(() => {
    if (!text.startsWith(prevTextRef.current)) {
      setCursor(0);
      setDone(false);
      announcedRef.current = 0;
    }
    prevTextRef.current = text;
  }, [text]);

  // 减少动态：跳过逐字动画，整段立即呈现
  useEffect(() => {
    if (reduced && text) {
      setCursor(text.length);
      setDone(true);
    }
  }, [reduced, text]);

  // 逐字推进：按字素切分，不拆开组合字符
  useEffect(() => {
    if (reduced || streaming || done) return;
    if (!text.length || cursor >= text.length) return;
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    const timer = window.setInterval(() => {
      setCursor((current) => {
        if (current >= text.length) return current;
        const next = segmenter.segment(text.slice(current))[Symbol.iterator]().next();
        return next.done ? text.length : current + next.value.segment.length;
      });
    }, Math.max(8, interval));
    return () => window.clearInterval(timer);
  }, [reduced, streaming, done, cursor, text, interval]);

  // 完成判定与回调（实时流模式由调用方把 streaming 置 false 后触发）
  useEffect(() => {
    if (!streaming && text.length > 0 && cursor >= text.length && !done) {
      setDone(true);
      onComplete?.();
    }
  }, [streaming, cursor, text, done, onComplete]);

  // 循环重播：播完停顿后归零重来
  useEffect(() => {
    if (reduced || !loop || streaming || !done || !text) return;
    const timer = window.setTimeout(() => {
      setCursor(0);
      setDone(false);
      announcedRef.current = 0;
    }, LOOP_PAUSE);
    return () => window.clearTimeout(timer);
  }, [reduced, loop, streaming, done, text]);

  // 读屏播报：完成时整段，播放中每 900ms 增量一次，避免逐字轰炸
  useEffect(() => {
    const live = liveRef.current;
    if (!live) return;
    const now = Date.now();
    if (cursor >= text.length) {
      if (text) live.textContent = text;
      announcedRef.current = cursor;
      lastAnnounceRef.current = 0;
    } else if (cursor > announcedRef.current && now - lastAnnounceRef.current >= ANNOUNCE_STEP) {
      live.textContent = text.slice(0, cursor);
      announcedRef.current = cursor;
      lastAnnounceRef.current = now;
    }
  }, [cursor, text]);

  const showCaret = !done || streaming;

  return (
    <div className={cn('w-full', className)}>
      <p
        aria-hidden
        className="streaming-text-body min-w-0 whitespace-pre-wrap text-[15px] leading-[1.8] text-zinc-200"
      >
        {text.slice(0, cursor)}
        {showCaret && (
          <span
            aria-hidden
            className="streaming-text-caret ml-[2px] inline-block h-[1.05em] w-[7px] translate-y-[0.15em] rounded-[1px] bg-current"
          />
        )}
      </p>
      <span ref={liveRef} className="sr-only" aria-live="polite" aria-atomic="false" />
      <style href="streaming-text-keyframes" precedence="medium">{`
        @keyframes streaming-text-blink{0%,55%{opacity:1}56%,100%{opacity:0}}
        @media (prefers-reduced-motion: no-preference){
          .streaming-text-caret{animation:streaming-text-blink 1s steps(1) infinite}
        }
      `}</style>
    </div>
  );
}
