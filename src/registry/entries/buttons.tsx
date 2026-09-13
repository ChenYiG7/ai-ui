import { ArrowRight, Fingerprint, Sparkles, Terminal } from 'lucide-react';
import { CopyCommand } from '@/registry/components/buttons/copy-command';
import { HoldToConfirm } from '@/registry/components/buttons/hold-to-confirm';
import { MagneticButton } from '@/registry/components/buttons/magnetic-button';
import { ShimmerButton } from '@/registry/components/buttons/shimmer-button';
import type { RegistryEntry } from '@/registry/types';

export const buttonEntries: RegistryEntry[] = [
  {
    slug: 'magnetic-button',
    title: '磁吸按钮',
    name: 'Magnetic Button',
    category: 'buttons',
    description: '鼠标靠近时按钮被吸向指针,文字以更小幅度跟随形成视差,离开后弹簧回弹。',
    designNotes: [
      '外层触发区比按钮四周各大 24px,让吸附在指针真正碰到按钮前就开始',
      '按钮位移 = 指针到按钮中心的偏移 × 0.35,内部文字再乘 0.45 形成两层视差',
      '位移经过弹簧平滑:stiffness 180、damping 16、mass 0.2,回弹带轻微过冲',
      'MotionValue 直接驱动位移,不触发重渲染;按下时缩放到 0.96',
      '禁用或 prefers-reduced-motion 时按钮与文字位移均为 0;键盘聚焦显示 2px 白 60% 焦点环',
    ],
    deps: ['motion'],
    file: 'buttons/magnetic-button.tsx',
    tags: ['CTA', '物理', '弹簧', '悬停'],
    usage: `import { ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";

export function Cta() {
  return (
    <MagneticButton onClick={() => console.log("clicked")}>
      开始使用
      <ArrowRight className="size-4" />
    </MagneticButton>
  );
}`,
    preview: (
      <MagneticButton>
        开始使用
        <ArrowRight className="size-4" />
      </MagneticButton>
    ),
  },
  {
    slug: 'shimmer-button',
    title: '流光按钮',
    name: 'Shimmer Button',
    category: 'buttons',
    description: '一道锥形光沿按钮边缘持续旋转,形成会呼吸的发光边框。',
    designNotes: [
      '外层是 1px 内边距、白 10% 静态底边的胶囊容器;150% 宽的正方形光层居中旋转,独立 translate 与 rotate 避免位移叠加',
      '锥形渐变从 55% 处透明开始,在 75% 处为主色 20%、88% 处达到主色、90% 处消失,默认每 3s 匀速绕行一圈',
      '内层底色 #161619、顶部 1px 白 8% 高光;悬停或键盘聚焦时浮现主色 12% 的底部光晕,500ms 淡入',
      '整体悬停上浮 2px,按下归位,300ms ease-out 过渡',
      '纯 CSS 动画;禁用时暂停旋转,prefers-reduced-motion 时停止旋转与上浮',
    ],
    deps: [],
    file: 'buttons/shimmer-button.tsx',
    tags: ['CTA', '发光', '边框', '纯 CSS'],
    usage: `import { Sparkles } from "lucide-react";
import { ShimmerButton } from "@/components/ui/shimmer-button";

export function Cta() {
  return (
    <ShimmerButton shimmerColor="#d7ff3c">
      <Sparkles className="size-4" />
      生成组件
    </ShimmerButton>
  );
}`,
    preview: (
      <div className="flex flex-wrap items-center justify-center gap-4">
        <ShimmerButton shimmerColor="#c9dbc5" speed={4} className="@md:text-base">
          <Sparkles className="size-4" />
          收入词典
        </ShimmerButton>
        <ShimmerButton shimmerColor="#aaa7d8" speed={5} className="@md:text-base">
          暮紫变体
        </ShimmerButton>
      </div>
    ),
  },
  {
    slug: 'hold-to-confirm',
    title: '长按确认',
    name: 'Hold To Confirm',
    category: 'buttons',
    description: '带机械按压感的长按确认:进度从左到右蓄满按钮才触发,松手、移出或失焦立即清零取消。',
    designNotes: [
      '按钮 min-h-14(56px)、rounded-2xl(16px)、1px #eef2e4 70% 边框,#e3e7d9 浅鼠尾草底配 #262e22 文字、水平内边距 20px;阴影为顶部 1px 白高光 + 6px 实体底边 #777e69 + 12px/24px 柔投影,构成机械按键',
      '按住默认 1200ms(duration 可调,下限 400ms),rAF 逐帧把 #bacda2 填充层从左到右 scaleX 0→1(origin-left);按住时按钮下沉 4px、底边由 6px 收窄到 2px',
      '只接受主指针左键,键盘用空格或 Enter 且忽略按住重复,聚焦显示 2px #e3e7d9 焦点环(8px 偏移);移出按钮边界、松开、失焦、窗口失焦、页面隐藏或 pointercancel 都立即取消并清空进度',
      'onConfirm 支持 Promise,处理中按钮禁用并显示「正在处理」,成功或失败终态停留 2200ms 后复位;右侧白 25% 底、9px 等宽小徽标实时显示本次所需秒数(如 1.2 s)',
      'prefers-reduced-motion 时取消按压位移(motion-reduce:translate-y-0)并停用连续填充,进度全程为 0,计时结束直接满格显示终态;disabled 时立即取消进行中的长按,按钮 cursor-not-allowed、opacity-45',
      '填充进度直接写入填充层的 style.scale,不逐帧 setState;结果经 sr-only 的 role=status 播报,卸载时取消帧循环与定时器',
    ],
    deps: [],
    file: 'buttons/hold-to-confirm.tsx',
    tags: ['长按', '确认', '防误触', '异步'],
    usage: `import { Trash2 } from "lucide-react";
import { HoldToConfirm } from "@/components/ui/hold-to-confirm";

export function DangerZone() {
  return (
    <HoldToConfirm
      label="长按删除项目"
      confirmedLabel="已删除"
      duration={1200}
      icon={<Trash2 className="size-4" />}
      onConfirm={async () => {
        await fetch("/api/projects/42", { method: "DELETE" });
      }}
    />
  );
}`,
    preview: (
      <div className="flex w-full max-w-md flex-wrap items-center justify-center gap-4">
        <HoldToConfirm
          label="长按,确认发布"
          confirmedLabel="准备就绪"
          icon={<Fingerprint className="size-4" />}
        />
      </div>
    ),
  },
  {
    slug: 'copy-command',
    title: '命令复制',
    name: 'Copy Command',
    category: 'buttons',
    description:
      '一行等宽字体命令条,点击复制完整命令,按钮随即变绿显示「已复制」,失败时给出手动复制指引。',
    designNotes: [
      '整体 rounded-2xl(16px)、#141618 底板、1px 白 12% 边框,内阴影顶部 1px 白 3% 高光叠加 16px/40px 柔和投影;标题栏与命令区之间为白 8% 分隔线,标题栏内边距 16px×12px',
      '命令为 11px 等宽字体(@md 容器查询起 14px)、whitespace-nowrap 独立横向滚动且可 Tab 聚焦;左侧 $ 前缀为 #bdd4bc,右侧复制按钮 min-h-9(36px)、rounded-lg、白 4% 底、白 10% 边框',
      '点击经 navigator.clipboard.writeText 复制完整命令原文,不截短不换行;成功后按钮切换为 #bdd4bc 文字、25% 同色边框、10% 同色底,2400ms 后复位',
      '同一时刻只放行一个复制请求,进行中按钮 disabled:opacity-50;clipboard 被拒或失败时,提示行以琥珀色 text-amber-200 显示「复制未完成,请选中命令手动复制」,经 role=status 播报',
      'prefers-reduced-motion 时关闭颜色过渡(过渡包在 motion-safe 下,150ms);状态仅在 idle/copying/copied/error 四档间 setState,命令横向滚动不触发重渲染,卸载时清理复位定时器',
    ],
    deps: [],
    file: 'buttons/copy-command.tsx',
    tags: ['复制', '命令行', '剪贴板', '文档'],
    usage: `import { CopyCommand } from "@/components/ui/copy-command";

export function InstallCommand() {
  return <CopyCommand label="安装依赖" command="pnpm add motion" className="max-w-md" />;
}`,
    preview: (
      <div className="flex w-full max-w-md flex-col items-center gap-5">
        <CopyCommand label="安装 / INSTALL" command="pnpm add motion" />
        <p className="flex items-center gap-2 text-[10px] text-zinc-500">
          <Terminal aria-hidden className="size-3.5" />
          从一行命令开始。
        </p>
      </div>
    ),
  },
];
