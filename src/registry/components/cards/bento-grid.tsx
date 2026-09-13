import { cn } from '@/lib/utils';

interface BentoGridProps {
  /** 桌面端（md 起）列数；小屏恒为 2 列 */
  columns?: 2 | 3 | 4;
  children: React.ReactNode;
  className?: string;
}

/** 列数类名保持字面量映射，保证 Tailwind 扫描器可见 */
const COLUMN_CLASSES = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
} as const;

/** 便当格：不规则网格布局容器，大小格子错落占位，信息一眼分层。 */
export function BentoGrid({ columns = 3, children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        'grid auto-rows-[minmax(96px,auto)] grid-cols-2 gap-3',
        COLUMN_CLASSES[columns],
        className,
      )}
    >
      {children}
    </div>
  );
}
