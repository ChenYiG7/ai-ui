import { cn } from '@/lib/utils';

interface UsageMeterProps {
  /** 已用量 */
  used: number;
  /** 总量 */
  limit: number;
  /** 标签 */
  label?: string;
  /** 是否显示右侧数值 */
  showValue?: boolean;
  /** 数值小数位 */
  precision?: number;
  className?: string;
}

const TONES = {
  default: '#d7ff3c',
  warning: '#fbbf24',
  danger: '#ff7a6b',
} as const;

/** 用量条：一条会变色的配额细线，越过 70% 转琥珀、越过 90% 转红，数字同步读数。 */
export function UsageMeter({
  used,
  limit,
  label,
  showValue = true,
  precision = 0,
  className,
}: UsageMeterProps) {
  const ratio = limit > 0 ? Math.min(1, Math.max(0, used / limit)) : 0;
  const percent = ratio * 100;
  const tone = percent >= 90 ? TONES.danger : percent >= 70 ? TONES.warning : TONES.default;

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-baseline justify-between gap-3 text-xs">
          <span className="text-zinc-400">{label}</span>
          {showValue && (
            <span className="font-mono tabular-nums text-zinc-500">
              {used.toFixed(precision)} / {limit.toFixed(precision)}
            </span>
          )}
        </div>
      )}
      <div
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percent)}
        aria-label={label}
        className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]"
      >
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={{ width: `${percent}%`, backgroundColor: tone, boxShadow: `0 0 10px ${tone}55` }}
        />
      </div>
    </div>
  );
}
