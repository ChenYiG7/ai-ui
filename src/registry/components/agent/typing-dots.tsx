import { cn } from '@/lib/utils';

interface TypingDotsProps {
  /** 圆点直径（px） */
  size?: number;
  /** 读屏标签 */
  label?: string;
  className?: string;
}

/** 输入中指示：三枚圆点依次起伏，纯 CSS 动画，颜色继承文字色。 */
export function TypingDots({ size = 6, label = '正在输入', className }: TypingDotsProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn('inline-flex items-center gap-1 text-zinc-300', className)}
    >
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          aria-hidden
          className="typing-dots-dot inline-block rounded-full bg-current"
          style={{ width: size, height: size, animationDelay: `${index * 150}ms` }}
        />
      ))}
      <style href="typing-dots-keyframes" precedence="medium">{`
        @keyframes typing-dots-breathe{0%,100%{transform:scale(.65);opacity:.3}40%{transform:scale(1);opacity:1}}
        @media (prefers-reduced-motion: no-preference){
          .typing-dots-dot{animation:typing-dots-breathe 1.2s ease-in-out infinite}
        }
      `}</style>
    </span>
  );
}
