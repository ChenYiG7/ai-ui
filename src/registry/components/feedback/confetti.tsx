'use client';

import { useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface ConfettiOrigin {
  /** 横向位置,占容器宽度的比例(0–1) */
  x: number;
  /** 纵向位置,占容器高度的比例(0–1) */
  y: number;
}

interface ConfettiProps {
  /** 数值变化即发射一次(从 0 开始计数) */
  fire?: number;
  /** 演示模式:挂载立即发射,并按 interval 自动连发 */
  demo?: boolean;
  /** demo 模式连发间隔(ms) */
  interval?: number;
  /** 发射原点,占容器宽高的比例 */
  origin?: ConfettiOrigin;
  /** 单次发射的粒子数量 */
  count?: number;
  /** 纸片色板 */
  colors?: string[];
  /** fixed:覆盖视口;inline:覆盖最近的 positioned 祖先(自行提供 relative 容器) */
  variant?: 'fixed' | 'inline';
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  flip: number;
  flipSpeed: number;
  wobble: number;
  wobbleSpeed: number;
  width: number;
  height: number;
  color: string;
  life: number;
  ttl: number;
}

const DEFAULT_COLORS = ['#d7ff3c', '#fbbf24', '#ff7a6b', '#7dd3fc', '#e4e4e7'];

/** 纸屑庆祝:canvas 粒子上抛、翻面、飘落,给发布成功与完成时刻一点仪式感。 */
export function Confetti({
  fire = 0,
  demo = false,
  interval = 3200,
  origin,
  count = 90,
  colors = DEFAULT_COLORS,
  variant = 'fixed',
  className,
}: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef(0);
  const lastTimeRef = useRef(0);
  const runningRef = useRef(false);
  const sizeRef = useRef({ width: 0, height: 0 });
  const originRef = useRef(origin);
  originRef.current = origin;

  const spawn = useCallback(
    (width: number, height: number): Particle[] => {
      const point = originRef.current ?? { x: 0.5, y: 0.5 };
      const ox = point.x * width;
      const oy = point.y * height;
      const next: Particle[] = [];
      for (let i = 0; i < count; i++) {
        const angle = ((-90 + (Math.random() - 0.5) * 110) * Math.PI) / 180;
        const speed = 6 + Math.random() * 7;
        next.push({
          x: ox,
          y: oy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          rotation: Math.random() * Math.PI,
          rotationSpeed: (Math.random() - 0.5) * 0.28,
          flip: Math.random() * Math.PI * 2,
          flipSpeed: 0.08 + Math.random() * 0.16,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: 0.05 + Math.random() * 0.1,
          width: 5 + Math.random() * 6,
          height: 7 + Math.random() * 7,
          color: colors[(Math.random() * colors.length) | 0],
          life: 0,
          ttl: 90 + Math.random() * 60,
        });
      }
      return next;
    },
    [count, colors],
  );

  const tick = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) {
      runningRef.current = false;
      return;
    }
    const now = performance.now();
    // 时间步归一化到 60fps 基准,高刷屏不加速
    const t = lastTimeRef.current ? Math.min((now - lastTimeRef.current) / 16.7, 2) : 1;
    lastTimeRef.current = now;
    const { width, height } = sizeRef.current;
    ctx.clearRect(0, 0, width, height);
    const alive: Particle[] = [];
    for (const p of particlesRef.current) {
      p.life += t;
      if (p.life > p.ttl || p.y > height + 24) continue;
      p.vy += 0.35 * t;
      p.vx *= Math.pow(0.985, t);
      p.vy *= Math.pow(0.99, t);
      p.wobble += p.wobbleSpeed * t;
      p.x += (p.vx + Math.sin(p.wobble) * 0.6) * t;
      p.y += p.vy * t;
      p.rotation += p.rotationSpeed * t;
      p.flip += p.flipSpeed * t;
      // 生命末期 24 帧内淡出
      ctx.save();
      ctx.globalAlpha = Math.min(1, (p.ttl - p.life) / 24);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      // cos 翻面:纸片转到侧缘时呈一线
      ctx.scale(1, Math.sin(p.flip) || 0.001);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
      ctx.restore();
      alive.push(p);
    }
    particlesRef.current = alive;
    if (alive.length) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, width, height);
      runningRef.current = false;
    }
  }, []);
  const tickRef = useRef(tick);
  tickRef.current = tick;

  const burst = useCallback(() => {
    if (typeof window === 'undefined') return;
    // 纯装饰动效:reduced-motion 时不发射
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const { width, height } = sizeRef.current;
    if (!width || !height) return;
    particlesRef.current.push(...spawn(width, height));
    if (!runningRef.current) {
      runningRef.current = true;
      lastTimeRef.current = 0;
      rafRef.current = requestAnimationFrame(() => tickRef.current());
    }
  }, [spawn]);
  const burstRef = useRef(burst);
  burstRef.current = burst;

  // 画布随容器(inline)或视口(fixed)缩放,按 devicePixelRatio 渲染
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const isFixed = variant === 'fixed';
    const resize = () => {
      const { width, height } = isFixed
        ? { width: window.innerWidth, height: window.innerHeight }
        : (canvas.parentElement?.getBoundingClientRect() ?? { width: 0, height: 0 });
      sizeRef.current = { width, height };
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    if (isFixed) {
      window.addEventListener('resize', resize);
      return () => window.removeEventListener('resize', resize);
    }
    const parent = canvas.parentElement;
    if (!parent) return;
    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    return () => observer.disconnect();
  }, [variant]);

  useEffect(() => {
    if (fire > 0) burstRef.current();
  }, [fire]);

  useEffect(() => {
    if (!demo) return;
    burstRef.current();
    const id = window.setInterval(() => burstRef.current(), interval);
    return () => window.clearInterval(id);
  }, [demo, interval]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn(
        'pointer-events-none inset-0',
        variant === 'fixed' ? 'fixed z-50' : 'absolute',
        className,
      )}
    />
  );
}
