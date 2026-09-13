import { cn } from "@/lib/utils";

export interface ShimmerSkeletonProps {
  /** 附加类名,形状(宽高、圆角)完全由调用方用 h-/w-/rounded- 决定 */
  className?: string;
  /** 渲染为正圆(头像占位),忽略 rounded-* 类 */
  circle?: boolean;
}

/**
 * 骨架屏基元:一块带流光扫过的暗色占位块。
 * 纯 CSS 实现(无 hooks),可在服务端组件中直接使用;
 * 读屏语义交给外层容器(如 aria-busy 的区域),本组件只负责视觉。
 */
export function ShimmerSkeleton({ className, circle = false }: ShimmerSkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative overflow-hidden bg-white/[0.045]",
        circle ? "rounded-full" : "rounded-md",
        className,
      )}
    >
      <span aria-hidden className="shimmer-skeleton-sweep absolute inset-0" />
      <style href="shimmer-skeleton-keyframes" precedence="medium">{`
        @keyframes shimmer-skeleton-sweep {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }
        .shimmer-skeleton-sweep {
          background-image: linear-gradient(100deg, transparent 20%, rgba(255, 255, 255, 0.07) 50%, transparent 80%);
          animation: shimmer-skeleton-sweep 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .shimmer-skeleton-sweep { animation: none; }
        }
      `}</style>
    </div>
  );
}
