import { Check, MessageSquare, Upload, X } from 'lucide-react';
import { ToastStack } from '@/registry/components/feedback/toast-stack';
import type { RegistryEntry } from '@/registry/types';
import { ShimmerSkeleton } from "@/registry/components/feedback/shimmer-skeleton";
import { EmptyState } from "@/registry/components/feedback/empty-state";
import { GlowProgress } from "@/registry/components/feedback/glow-progress";
import { StatusCallout } from "@/registry/components/feedback/status-callout";
import { Confetti } from "@/registry/components/feedback/confetti";
import { UndoToast } from "@/registry/components/feedback/undo-toast";

export const feedbackEntries: RegistryEntry[] = [
  {
    slug: 'toast-stack',
    title: '通知叠栈',
    name: 'Toast Stack',
    category: 'feedback',
    description: '通知像信笺一样轻叠,展开浏览、逐条关闭,把反馈留在恰好的分寸里。',
    designNotes: [
      '卡片小舞台高 104px、内边距 12px,大舞台高 112px、内边距 16px;16px 圆角、#1a1e1f 底板与 1px 白色 15% 边框,图标容器 32px',
      '折叠时最多展示 3 张,每层下移 14px、缩小 5.5%、透明度递减 22%,变换原点在底部中心',
      '展开后所有消息进入可滚动列表;视窗高 136px、大舞台 176px,避免列表撑出预览区域',
      '状态变化采用 stiffness 360、damping 32 的弹簧,prefers-reduced-motion 时 duration=0;初次挂载静态可见',
      '默认不自动关闭,用户逐条移除并移交焦点;折叠后只有第 1 张参与键盘和读屏,aria-live 礼貌播报增减,onDismiss 接收被关闭的 id',
    ],
    deps: ['motion'],
    file: 'feedback/toast-stack.tsx',
    tags: ['通知', '反馈', '消息', '叠栈', 'Toast'],
    usage: `import { ToastStack, type ToastItem } from "@/components/ui/toast-stack";

const notifications: ToastItem[] = [
  { id: "saved", title: "修改已保存", description: "你的工作已安全保留。", tone: "success", meta: "刚刚" },
  { id: "comment", title: "收到新评论", description: "打开项目,继续这次讨论。", tone: "info", meta: "2 分钟前" },
];

export function Notifications() {
  return <ToastStack label="最近动态" items={notifications} />;
}`,
    preview: (
      <ToastStack
        label="工作室收件箱"
        className="[&>div:first-child]:hidden @md:[&>div:first-child]:flex"
        items={[
          {
            id: 'saved',
            title: '所有修改,已妥善保存',
            description: '专注创作,剩下的交给词典。',
            meta: '刚刚',
            tone: 'success',
            icon: <Check className="size-4" />,
          },
          {
            id: 'comment',
            title: '一条新的设计反馈',
            description: '「这版留白的节奏很舒服。」',
            meta: '2 分钟前',
            tone: 'info',
            icon: <MessageSquare className="size-3.5" />,
          },
          {
            id: 'export',
            title: '导出文件已准备好',
            description: '品牌手册 · 最终版本。',
            meta: '5 分钟前',
            tone: 'warning',
            icon: <Upload className="size-3.5" />,
          },
        ]}
      />
    ),
    previewClassName: 'px-3 pb-3 pt-11 @md:p-8',
  },
  {
    slug: "shimmer-skeleton",
    title: "骨架屏",
    name: "Shimmer Skeleton",
    category: "feedback",
    description: "占位块表面有一道柔光缓缓扫过,告诉人们内容正在路上,而不是页面卡住了。",
    designNotes: [
      "占位块底色为白 4.5% 透明度、圆角 6px,形状完全由调用方的 h-/w-/rounded- 类决定;流光层是 100deg 线性渐变,中点白 7% 高光",
      "流光以 translateX -100% → 100% 循环扫过,1.6s、cubic-bezier(0.4, 0, 0.2, 1)、无限重复,纯 CSS 实现,零 JS 开销",
      "prefers-reduced-motion 时移除扫光动画,占位块保持静态可见",
      "组件根节点 aria-hidden:加载语义由外层容器(如 aria-busy 区域或 role=status)负责,占位块本身对读屏不可见",
    ],
    deps: [],
    file: "feedback/shimmer-skeleton.tsx",
    tags: ["加载", "占位", "骨架", "纯 CSS"],
    usage: `import { ShimmerSkeleton } from "@/components/ui/shimmer-skeleton";

export function ProfileLoading() {
  return (
    <div aria-busy="true" className="flex items-center gap-4 rounded-2xl border border-white/10 p-5">
      <ShimmerSkeleton circle className="size-12" />
      <div className="flex-1 space-y-2.5">
        <ShimmerSkeleton className="h-3 w-1/3" />
        <ShimmerSkeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}`,
    preview: (
      <div aria-busy="true" className="w-full max-w-sm space-y-4 rounded-2xl border border-white/10 bg-black/20 p-5">
        <div className="flex items-center gap-3">
          <ShimmerSkeleton circle className="size-10" />
          <div className="flex-1 space-y-2">
            <ShimmerSkeleton className="h-2.5 w-1/3" />
            <ShimmerSkeleton className="h-2.5 w-1/2" />
          </div>
        </div>
        <div className="space-y-2">
          <ShimmerSkeleton className="h-2.5 w-full" />
          <ShimmerSkeleton className="h-2.5 w-11/12" />
          <ShimmerSkeleton className="h-2.5 w-4/6" />
        </div>
        <ShimmerSkeleton className="h-20 w-full rounded-xl" />
      </div>
    ),
  },
  {
    slug: "empty-state",
    title: "空状态",
    name: "Empty State",
    category: "feedback",
    description: "列表空着时给出虚线展位、图标与下一步动作,轻浮入场,不让空页面显得像故障。",
    designNotes: [
      "容器为虚线边框(白 12%)、圆角 16px、内边距 40px 24px,底色白 1.5%,内容整体居中",
      "图标展位 44px 见方、圆角 12px、白 4% 底、描边白 10%;标题 text-sm,说明文字最宽 240px、text-xs 宽松行高",
      "入场为 8px 上浮 + 淡入,450ms、cubic-bezier(0.16, 1, 0.3, 1);prefers-reduced-motion 时 duration=0 直接静态可见",
      "图标与动作均为插槽,缺省图标 Inbox;动作区只负责排版,焦点样式由调用方的按钮自带",
    ],
    deps: ['motion', 'lucide-react'],
    file: "feedback/empty-state.tsx",
    tags: ["空状态", "占位", "引导", "列表"],
    usage: `import { Compass } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export function NoProjects() {
  return (
    <EmptyState
      icon={<Compass className="size-5" />}
      title="还没有任何项目"
      description="创建第一个项目,所有组件与提示词都会归档在这里。"
      action={
        <button type="button" className="rounded-full bg-[#d7ff3c] px-5 py-2 text-xs font-medium text-black">
          新建项目
        </button>
      }
    />
  );
}`,
    preview: (
      <EmptyState
        className="w-full max-w-sm"
        title="检索没有命中"
        description="换个关键词,或清空筛选条件再试一次。"
        action={
          <button
            type="button"
            className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-xs text-zinc-200 transition-colors hover:border-white/25 hover:bg-white/[0.1]"
          >
            清空筛选
          </button>
        }
      />
    ),
  },
  {
    slug: "glow-progress",
    title: "辉光进度条",
    name: "Glow Progress",
    category: "feedback",
    description: "荧光绿填充沿轨道生长并散发柔光,数值变化以弹簧推进;不确定等待时,光段来回巡航。",
    designNotes: [
      "轨道高 6px、全圆角、白 5% 底色加白 6% 细描边;填充为 90deg 渐变:荧光绿 #d7ff3c 从 40% 透明度过渡到实色",
      "填充带 0 0 12px rgba(215,255,60,0.4) 的同色辉光;确定进度变化以 stiffness 170、damping 26 的弹簧推进宽度",
      "待定模式用 40% 轨道宽的光段,1.5s、cubic-bezier(0.45, 0, 0.55, 1) 无限往复巡航;prefers-reduced-motion 时弹簧 duration=0、光段静止",
      "role=progressbar 携带 aria-valuenow/min/max,待定模式省略 now;百分比读数为等宽字体三位补零(如 072%),避免数字跳动抖动布局",
    ],
    deps: ['motion'],
    file: "feedback/glow-progress.tsx",
    tags: ["进度", "加载", "辉光", "弹簧"],
    usage: `import { GlowProgress } from "@/components/ui/glow-progress";

export function UploadProgress() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <GlowProgress label="上传素材" value={72} />
      <GlowProgress label="等待队列" />
    </div>
  );
}`,
    preview: (
      <div className="w-full max-w-sm space-y-5 py-2">
        <GlowProgress label="构建进度" value={72} />
        <GlowProgress label="等待队列" showValue={false} />
      </div>
    ),
  },
  {
    slug: "status-callout",
    title: "状态提示条",
    name: "Status Callout",
    category: "feedback",
    description: "操作结果以四色柔和提示条就地出现,警告与危险自动升级为强提醒,可就地关闭。",
    designNotes: [
      "容器圆角 12px、内边距 12px,边框与底色取同色相 tint:边框 20% 透明度、底色 6%;图标展位 28px、圆角 8px、同色 10% 底",
      "色调常量与 toast-stack 一致:success #c0d9ad、info #acc8dc、warning #dfc59e,danger 补 #e0a3a3;标题 text-xs,说明 text-[10px]",
      "warning / danger 渲染为 role=alert 立即播报,success / info 为 role=status 礼貌播报;图标缺省 6px 圆点,可用插槽替换",
      "入场 320ms、cubic-bezier(0.16, 1, 0.3, 1),关闭退场 180ms 淡出并上移 4px;prefers-reduced-motion 时均为 duration=0",
    ],
    deps: ['motion'],
    file: "feedback/status-callout.tsx",
    tags: ["提示", "警告", "状态", "Alert"],
    usage: `import { Check } from "lucide-react";
import { StatusCallout } from "@/components/ui/status-callout";

export function SavedNotice() {
  return (
    <StatusCallout
      tone="success"
      icon={<Check className="size-3.5" />}
      title="修改已保存"
      description="所有变更已同步到云端副本。"
      onDismiss={() => console.log("dismissed")}
    />
  );
}`,
    preview: (
      <div className="w-full max-w-md space-y-3">
        <StatusCallout
          tone="success"
          icon={<Check className="size-3.5" />}
          title="修改已保存"
          description="所有变更已同步到云端副本。"
        />
        <StatusCallout
          tone="danger"
          icon={<X className="size-3.5" />}
          title="发布失败"
          description="版本号已被占用,换一个再试。"
        />
      </div>
    ),
  },
  {
    slug: "confetti",
    title: "纸屑庆祝",
    name: "Confetti",
    category: "feedback",
    description: "一次发射,满屏纸片上抛、翻面、飘落,给完成时刻一点仪式感。",
    designNotes: [
      "单次默认 90 枚 6–11px 矩形纸片,初速 6–13 px/帧、上抛角 −90°±55°;重力 0.35/帧²、空气阻力 0.985/帧,时间步按帧间隔归一化到 60fps 基准,高刷屏速度一致",
      "纸片三重运动叠加:自转 ±0.14 rad/帧、绕纵轴翻面(scaleY=cos(flip),转到侧缘时呈一线)、横向 sin 摆动 ±0.6px;生命周期 90–150 帧,末期 24 帧内淡出",
      "canvas 按 devicePixelRatio(上限 2)缩放,绘制全部发生在 transform 层不触发布局;fire 计数变化即发射,demo 模式挂载即射并按 interval 自动连发;variant=inline 覆盖 positioned 祖先、fixed 覆盖视口",
      "prefers-reduced-motion 时不发射任何粒子(纯装饰动效、信息量为零,直接省略)",
    ],
    deps: [],
    file: "feedback/confetti.tsx",
    tags: ["庆祝", "纸屑", "canvas", "动效"],
    usage: `import { useState } from "react";
import { Confetti } from "@/components/ui/confetti";

export function PublishAction() {
  const [fires, setFires] = useState(0);
  return (
    <>
      <Confetti fire={fires} count={120} />
      <button onClick={() => setFires((n) => n + 1)}>发布新版本</button>
    </>
  );
}`,
    preview: (
      <div className="relative flex h-52 w-full max-w-md items-center justify-center overflow-hidden rounded-xl border border-white/[0.06] bg-black/20">
        <Confetti variant="inline" demo interval={2800} origin={{ x: 0.5, y: 0.55 }} />
        <div className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-1.5 text-xs text-zinc-300">
          已发布 · v2.4.0
        </div>
      </div>
    ),
  },
  {
    slug: "undo-toast",
    title: "撤销提示",
    name: "Undo Toast",
    category: "feedback",
    description: "操作先执行、给几秒反悔:倒计时走完前,一条「撤销」随时挽回。",
    designNotes: [
      "条目高约 56px:32px 圆形图标位 + 13px 文案 + 32px 高撤销按钮;底部 2px 荧光绿 80% 进度条 scaleX 1→0 线性收干,行尾 11px 等宽数字同步显示剩余秒数",
      "倒计时 100ms 步进渲染,悬停即暂停、秒数换为「已暂停」;duration=0 表示常驻,隐藏进度条与秒数",
      "入场 y 14px + scale 0.97 弹簧(stiffness 380、damping 30),退场 150ms 下沉淡出;撤销触发 onUndo 并立即关闭,归零触发 onExpire;sr-only status 仅入场播报一次「操作 · N 秒内可撤销」;demo 模式关闭后 1.4s 自动重新入场",
      "prefers-reduced-motion 时入场退场即时切换,倒计时照常走完(信息性动效)",
    ],
    deps: ["motion", "lucide-react"],
    file: "feedback/undo-toast.tsx",
    tags: ["toast", "撤销", "倒计时", "反馈"],
    usage: `import { useState } from "react";
import { UndoToast } from "@/components/ui/undo-toast";

export function DeleteFlow() {
  const [deleted, setDeleted] = useState(false);
  if (!deleted) {
    return <button onClick={() => setDeleted(true)}>删除草稿</button>;
  }
  return (
    <UndoToast
      open
      action="已删除「深夜草稿」"
      duration={6000}
      onUndo={() => setDeleted(false)}
      onExpire={() => console.log("删除已确认")}
    />
  );
}`,
    preview: (
      <div className="flex h-20 w-full max-w-md items-center justify-center">
        <UndoToast action="已删除「深夜草稿 · v3」" duration={5000} defaultOpen demo />
      </div>
    ),
  },
];
