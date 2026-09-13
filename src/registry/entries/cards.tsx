import { Activity, Boxes, Cpu, Gauge, Gem, Wand2, Waves, Zap } from 'lucide-react';
import { ElectricBorder } from '@/registry/components/cards/electric-border';
import { FluidDistortionCard } from '@/registry/components/cards/fluid-distortion-card';
import { GlareCard } from '@/registry/components/cards/glare-card';
import { GlassSurface } from '@/registry/components/cards/glass-surface';
import { MetricCard } from '@/registry/components/cards/metric-card';
import { SpotlightCard } from '@/registry/components/cards/spotlight-card';
import { TiltCard } from '@/registry/components/cards/tilt-card';
import { WobbleCard } from '@/registry/components/cards/wobble-card';
import type { RegistryEntry } from '@/registry/types';
import { BentoGrid } from "@/registry/components/cards/bento-grid";

export const cardEntries: RegistryEntry[] = [
  {
    slug: 'spotlight-card',
    title: '聚光灯卡片',
    name: 'Spotlight Card',
    category: 'cards',
    description: '一束柔光跟随鼠标在卡片表面游走,同时点亮靠近指针的那段边框。',
    designNotes: [
      '卡片为 rounded-2xl、1px 白色 10% 边框、近黑底色,内边距 32px',
      '光斑是 320px 半径的径向渐变,品牌色 16% 透明度,70% 处完全透明',
      '另一层更亮的径向渐变经双层 mask(content-box 与 border-box 相减)只保留 1px 边框区域,做出边框被点亮的效果',
      '两层光斑默认透明,悬停时 500ms 淡入;鼠标坐标用 MotionValue 直接写入渐变,不触发重渲染',
      '内容层 relative 置于光层之上;prefers-reduced-motion 时改为中心固定柔光,关闭移动边光与渐变过渡',
    ],
    deps: ['motion'],
    file: 'cards/spotlight-card.tsx',
    tags: ['悬停', '光斑', '特性卡'],
    usage: `import { Cpu } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";

export function Feature() {
  return (
    <SpotlightCard className="max-w-sm">
      <Cpu className="size-6 text-lime-300" />
      <h3 className="mt-4 text-lg font-semibold">本地优先</h3>
      <p className="mt-2 text-sm text-zinc-400">
        所有组件源码随仓库分发,不依赖任何远端服务。
      </p>
    </SpotlightCard>
  );
}`,
    preview: (
      <SpotlightCard className="w-full max-w-sm">
        <Cpu className="size-6 text-lime-300" />
        <h4 className="mt-5 text-lg font-semibold text-white">本地优先</h4>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          所有源码随词典分发,不依赖任何远端服务。移动鼠标试试。
        </p>
      </SpotlightCard>
    ),
  },
  {
    slug: 'tilt-card',
    title: '3D 倾斜卡片',
    name: 'Tilt Card',
    category: 'cards',
    description: '卡片随指针位置绕 X/Y 轴旋转,镜面高光跟随角度移动,内容微微浮起。',
    designNotes: [
      '固定外框建立 perspective 1000px 并测量指针,归一化坐标钳制到 0–1 后映射为 ±8° 倾斜,卡面旋转不干扰测量',
      '旋转值经过弹簧(stiffness 200、damping 20、mass 0.4)平滑,离开后缓慢回正到 0',
      '悬停整体缩放 1.02;内容 translateZ(24px),卡面保留 preserve-3d 且不使用 overflow-hidden,避免三维层级被压平',
      '高光为 rgba(219,228,245,0.16) 的径向渐变,65% 处淡出;底色 #12141b、1px 白 15% 边框、28px 内边距',
      '触屏不触发倾斜;prefers-reduced-motion 时立即归零旋转与景深,缩放固定为 1,保留静态高光',
    ],
    deps: ['motion'],
    file: 'cards/tilt-card.tsx',
    tags: ['3D', '视差', '悬停', '展示卡'],
    usage: `import { TiltCard } from "@/components/ui/tilt-card";

export function Showcase() {
  return (
    <TiltCard className="w-80">
      <p className="text-xs uppercase tracking-widest text-zinc-500">Vol.01</p>
      <h3 className="mt-3 text-2xl font-semibold">组件词典</h3>
      <p className="mt-2 text-sm text-zinc-400">移动鼠标,感受景深。</p>
    </TiltCard>
  );
}`,
    preview: (
      <TiltCard className="h-48 w-72 @md:h-56 @md:w-80">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-2 top-7 size-28 rounded-full border border-sky-200/15 bg-[radial-gradient(circle_at_30%_25%,rgba(186,214,239,0.12),transparent_70%)] shadow-[inset_0_0_28px_rgba(186,214,239,0.06)] @md:size-36"
        />
        <div className="flex items-center justify-between">
          <p className="font-mono text-[9px] tracking-[0.24em] text-slate-400">OBJECT / 001</p>
        </div>
        <div className="absolute inset-x-0 bottom-0">
          <h4 className="text-2xl font-medium tracking-tight text-white @md:text-3xl">
            浮于表面之上
          </h4>
          <p className="mt-2 text-xs text-slate-400">移动光标,换一个视角。</p>
        </div>
      </TiltCard>
    ),
  },
  {
    slug: 'electric-border',
    title: '电流边框卡片',
    name: 'Electric Border',
    category: 'cards',
    description: '细电丝贴着卡片边框持续游走、反复扭曲,冷色辉光微微颤动,底板与正文始终不随之变形。',
    designNotes: [
      '固定底板为 #0e1419、rounded-2xl(16px)、1px 白色 8% 边框、内容内边距 24px;只有外侧一层电丝参与滤镜,底板与正文保持完整',
      'feTurbulence 为 fractalNoise、2 倍频、seed 7;feDisplacementMap 位移强度 4px、取 R/G 通道,滤镜区域向四周各扩 20%(整体 140%)防止电丝被裁边',
      'SMIL 在 6s 内把 baseFrequency 从 0.012/0.025 连续摆到 0.018/0.035 再返回起点,循环往复形成游走的细电丝',
      '电丝颜色默认 #8bbdcc、65% 透明度;外辉光 10px / 16%、内辉光 16px / 6%,全部用 color-mix 混色,可替换为任意 CSS 颜色',
      '动画完全由 SVG 的 SMIL 动画自主驱动,React 不参与逐帧更新,仅在系统偏好变化时切换一次状态;滤镜 id 由 useId 生成,多实例互不串扰',
      '动态监听 prefers-reduced-motion:匹配时移除 SMIL 动画并把位移强度归零,只留静止的辉光边框',
    ],
    deps: [],
    file: 'cards/electric-border.tsx',
    tags: ['电弧', '滤镜', '辉光', '科幻'],
    usage: `import { Zap } from "lucide-react";
import { ElectricBorder } from "@/components/ui/electric-border";

export function Signal() {
  return (
    <ElectricBorder className="w-full max-w-sm">
      <Zap className="size-5 text-[#8bbdcc]" />
      <h3 className="mt-5 text-xl font-medium text-white">保持共振</h3>
      <p className="mt-2 text-sm text-slate-400">微弱的电流,沿边界流动。</p>
    </ElectricBorder>
  );
}`,
    preview: (
      <ElectricBorder className="w-full max-w-xs @md:max-w-sm">
        <div className="flex items-center justify-between text-[#8bbdcc]">
          <Zap aria-hidden className="size-5" />
          <span className="font-mono text-[9px] tracking-[0.2em]">LIVE SIGNAL</span>
        </div>
        <h4 className="mt-6 text-xl font-medium tracking-tight text-white @md:text-2xl">
          保持共振
        </h4>
        <div className="mt-3 flex items-center justify-between border-t border-white/8 pt-3 text-[10px] text-zinc-400">
          <span>微弱电流,沿边界流动</span>
          <span className="font-mono text-zinc-300">50.00 Hz</span>
        </div>
      </ElectricBorder>
    ),
  },
  {
    slug: 'metric-card',
    title: '趋势指标卡',
    name: 'Metric Card',
    category: 'cards',
    description: '大号等宽数值配一条轻盈趋势线,指针或方向键划过曲线即可逐点读出当时的数据。',
    designNotes: [
      '底板 #141719、rounded-2xl(16px)、1px 白色 10% 边框,内边距 12px 起步、窄容器 16px、宽容器 24px,顶部带 1px 白 3% 内高光;主数值为等宽字体 tabular-nums,小舞台 28px、宽容器 36px,字距 -0.06em,颜色 #e9ede3',
      'SVG viewBox 320×100,横向两端各内缩 8px,数据按线性映射到 y 16–80(单点或等值序列固定在 y=48);相邻点以中点为控制点的三次贝塞尔相连,线宽固定 2px 且 non-scaling',
      '趋势色三档:正向 #bdd5ac、负向 #e8b4a4、中性 #adbed4;面积渐变从同色 18% 衰减到 0%,网格为 3 条白 6% 虚线(dash 2 5),分别位于 y=20/50/80',
      '图表上叠一层全透明原生 range:指针横移或方向键逐点选取,选中点显示 7px 同色 15% 光圈、3px 实心圆(描边 #141719 1.5px)与竖直虚线,数值、标签与涨跌徽标(同色 22% 边框 / 6% 底色)同步更新,移出且失焦后恢复汇总值',
      '渲染是纯静态 SVG,无进场无循环动画;渐变 id 由 useId 隔离,多实例互不串色,非有限数值会被过滤,空数据与单点各有占位形态',
      '没有动画,因此不需要 prefers-reduced-motion 降级;取值层保留原生 range 语义(aria-label + aria-valuetext),焦点环 2px、偏移 4px、颜色 #c4d4bd/60',
    ],
    deps: [],
    file: 'cards/metric-card.tsx',
    tags: ['数据', '图表', '趋势', '指标', '仪表盘'],
    usage: `import { MetricCard, type MetricPoint } from "@/components/ui/metric-card";

const data: MetricPoint[] = [
  { label: "周一", value: 1200 }, { label: "周二", value: 1800 },
  { label: "周三", value: 1600 }, { label: "周四", value: 2400 },
  { label: "周五", value: 3100 },
];

export function Analytics() {
  return <MetricCard label="每周访问" value="10,100" change="+24.8%"
    footnote="较上一周" data={data} className="max-w-sm" />;
}`,
    preview: (
      <MetricCard
        label="本月营收"
        value="¥48,290"
        change="+18.6%"
        footnote="较上月 · 划过曲线查看数据"
        className="max-w-sm"
        data={[
          { label: '09.01', value: 21400, formattedValue: '¥21,400' },
          { label: '09.04', value: 28200, formattedValue: '¥28,200' },
          { label: '09.07', value: 26300, formattedValue: '¥26,300' },
          { label: '09.10', value: 35200, formattedValue: '¥35,200' },
          { label: '09.13', value: 31400, formattedValue: '¥31,400' },
          { label: '09.16', value: 38700, formattedValue: '¥38,700' },
          { label: '09.19', value: 36600, formattedValue: '¥36,600' },
          { label: '09.22', value: 43100, formattedValue: '¥43,100' },
          { label: '09.25', value: 41200, formattedValue: '¥41,200' },
          { label: '09.28', value: 48290, formattedValue: '¥48,290' },
        ]}
      />
    ),
    previewClassName: 'px-4 pb-3 pt-11 @md:p-8',
  },
  {
    slug: 'glass-surface',
    title: '玻璃面板',
    name: 'Glass Surface',
    category: 'cards',
    description: '毛玻璃底、顶部光泽、边缘内高光与细噪点四层叠加,一块有厚度的静态玻璃面板。',
    designNotes: [
      '基底为白色 4.5% 填充 + backdrop-blur 40px、1px 白 15% 边框、rounded-2xl(16px),外投影 0 20px 60px -30px 黑 80% 表现悬浮厚度',
      '左上角 120%×90% 径向渐变从白 12% 衰减到 55% 处透明,再叠一层 135° 斜面渐变(白 4% → 40% 处透明 → 白 2.5%)做出顶部光泽',
      '边缘内高光:顶部 1px 白 20%、底部 1px 白 4%,外加 24px 白 3% 内泛光形成细腻倒角',
      '细噪点为 160×160 的 feTurbulence 贴图(baseFrequency 0.8、2 倍频)平铺,整层透明度 5% + mix-blend-overlay,消除毛玻璃的塑料感',
      '纯 CSS 四层装饰、零 JavaScript 零动画,装饰层全部 aria-hidden 且 pointer-events-none,内容层 relative 置于其上',
      '组件完全静态,没有需要按 prefers-reduced-motion 关闭的动效,任何偏好下渲染一致',
    ],
    deps: [],
    file: 'cards/glass-surface.tsx',
    tags: ['毛玻璃', '质感', '静态', '容器'],
    usage: `import { Gem } from "lucide-react";
import { GlassSurface } from "@/components/ui/glass-surface";

export function Feature() {
  return (
    <GlassSurface className="w-full max-w-sm p-6">
      <Gem className="size-6 text-sky-300" />
      <h3 className="mt-4 text-lg font-semibold">磨砂与光泽</h3>
      <p className="mt-2 text-sm text-zinc-400">
        放在任何彩色背景上,玻璃质感都会透出来。
      </p>
    </GlassSurface>
  );
}`,
    preview: (
      <div className="relative w-full max-w-xs py-6 @md:max-w-sm">
        <div
          aria-hidden
          className="absolute -left-4 -top-2 size-28 rounded-full bg-linear-to-br from-[#a4bec6] to-[#355d70] @md:size-36"
        />
        <div
          aria-hidden
          className="absolute -bottom-4 right-0 size-28 rounded-full bg-linear-to-br from-[#b8a1c8] to-[#605075] @md:size-36"
        />
        <GlassSurface className="h-44 p-6 @md:h-52 @md:p-8">
          <div className="flex h-full flex-col justify-between">
            <div className="flex items-center justify-between text-white/65">
              <span className="font-mono text-[9px] tracking-[0.2em]">MATERIAL / 01</span>
              <Gem aria-hidden className="size-4" />
            </div>
            <div>
              <h4 className="text-2xl font-medium tracking-tight text-white">光的收藏</h4>
              <p className="mt-2 text-xs text-white/60">透过磨砂,留下温柔的轮廓。</p>
            </div>
          </div>
        </GlassSurface>
      </div>
    ),
  },
  {
    slug: 'glare-card',
    title: '炫光卡片',
    name: 'Glare Card',
    category: 'cards',
    description: '细密拉丝与斜向柔光构成的金属卡面,指针掠过时反光随角度缓缓滑动。',
    designNotes: [
      '底板 #141519、rounded-2xl、1px 白 15% 边框、24px 内边距,叠加周期 3px、线宽 1px、白 2% 的横向拉丝纹理',
      '指针坐标直接写进 CSS 变量 --gx / --gy(setProperty),光带位移不经过 React 状态,不触发重渲染',
      '115° 光带铺在 220%×220% 的背景上,峰值在 48% 处的白 16%(rgba(245,247,255,0.16));常态透明度 35%,悬停或卡内聚焦时 500ms 升到 100%',
      '顶边高光线是左右内缩 16px 的 1px 横向渐变(峰值白 40%),常态透明度 40%,与光带同步淡入;悬停时边框过渡到白 25%(500ms)',
      'prefers-reduced-motion 时 onMove 直接返回,光带停在原地,所有过渡关闭(motion-reduce:transition-none),保留静态金属反光',
    ],
    deps: [],
    file: 'cards/glare-card.tsx',
    tags: ['悬停', '光带', '反光', '特性卡'],
    usage: `import { Wand2 } from "lucide-react";
import { GlareCard } from "@/components/ui/glare-card";

export function Feature() {
  return (
    <GlareCard className="max-w-sm">
      <Wand2 className="size-6 text-sky-300" />
      <h3 className="mt-4 text-lg font-semibold">流光掠过</h3>
      <p className="mt-2 text-sm text-zinc-400">移动鼠标,光带会跟着走。</p>
    </GlareCard>
  );
}`,
    preview: (
      <GlareCard className="w-full max-w-xs @md:max-w-sm">
        <div className="flex items-center justify-between text-zinc-400">
          <Wand2 aria-hidden className="size-4" />
          <span className="font-mono text-[9px] tracking-[0.2em]">BRUSHED ALLOY</span>
        </div>
        <h4 className="mt-6 text-4xl font-light tracking-[-0.06em] text-zinc-200 @md:text-5xl">
          FORM / 01
        </h4>
        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3 text-[10px] text-zinc-400">
          <span>形态研究</span>
          <span>移动光标,捕捉反光</span>
        </div>
      </GlareCard>
    ),
  },
  {
    slug: 'wobble-card',
    title: '果冻卡片',
    name: 'Wobble Card',
    category: 'cards',
    description: '指尖揉动时柔软形变,按住挤扁、松手弹颤,像一块有厚度的半透明果冻。',
    designNotes: [
      '悬停挤压 0.06、按压 0.18;横向缩放 = 1 + 挤压量 + (|x| − |y|) × 0.035,纵向取倒数保持面积,中心按压稳定在约 1.18 × 0.85',
      '位移弹簧 stiffness 180 / damping 10 / mass 0.8,挤压弹簧 240 / 9 / 0.8,松开或离开后以低阻尼振荡弹回原形',
      '外层固定 perspective 800px 且从不形变,指针从外层测量;卡体位移 ±10 / ±6px、rotateX / rotateY ±5°、rotate ±2°、skew ±4°,圆角 32px 随方向与挤压增减、下限 14px',
      '底色 #111225、白色 20% 边框;224px 天蓝 30% 与 256px 紫 35% 两团色晕模糊 40px、反向位移 18–24px,叠加顶部 1px 白 50% 高光线与跟随指针的 rgb(224 242 254 / 0.18) 光泽',
      '形变全部经 MotionValue + useTransform 计算(光泽用 useMotionTemplate 拼渐变),指针事件只 set 值,不触发 React 重渲染',
      '支持主指针按压与 Enter / 空格按压,链接与表单子元素的点击不受影响;prefers-reduced-motion 时跳过全部形变,触屏悬停不劫持滚动',
    ],
    deps: ['motion'],
    file: 'cards/wobble-card.tsx',
    tags: ['弹簧', '挤压', '果冻', '回弹', '悬停'],
    usage: `import { WobbleCard } from "@/components/ui/wobble-card";

export function Showcase() {
  return (
    <WobbleCard className="w-80 max-w-full">
      <h3 className="text-2xl font-semibold">软软的容器</h3>
      <p className="mt-2 text-sm text-zinc-300">移动揉一揉,按住再松手。</p>
    </WobbleCard>
  );
}`,
    preview: (
      <WobbleCard className="w-64 p-6 @md:w-96 @md:p-8">
        <Waves aria-hidden className="mb-5 size-6 text-sky-200 @md:mb-8 @md:size-8" />
        <h4 className="text-xl font-semibold tracking-tight text-white @md:text-2xl">软软的容器</h4>
        <p className="mt-2 text-xs text-zinc-300 @md:text-sm">移动揉一揉,按住再松手。</p>
      </WobbleCard>
    ),
  },
  {
    slug: 'fluid-distortion-card',
    title: '流体扭曲卡片',
    name: 'Fluid Distortion Card',
    category: 'cards',
    description: '指针掠过时,指针附近的彩色色场像隔着液体玻璃一样被扭曲折射,正文始终保持清晰。',
    designNotes: [
      '卡体 rounded-3xl(24px)、1px 白 12% 边框、#09090b 底色、内容内边距 28px;正文位于 z-10,始终不被滤镜扭曲',
      '背景色场:190px 青色 #22d3ee(透明度 42%、模糊 42px)与 220px 紫色 #a855f7(透明度 40%、模糊 52px)分居对角,加一条 80px 高、76% 宽、-12° 的混色光带;再叠 112° 斜向流线(白 45% 1px 线、14px 间距、整层 12%)',
      'SVG 滤镜 = fractalNoise(baseFrequency 0.012 0.025、2 倍频、seed 7)+ feDisplacementMap,scale 默认 32、可配 0–64、取 R/B 通道,只作用于扭曲副本层',
      '扭曲副本只在指针周围 110px 径向遮罩内显示(中心到 42% 全强度),坐标写进 CSS 变量;进入 180ms 淡入、离开 260ms 淡出,叠白 13% 中心高光与 69–71% 处白 18% 折射环',
      '指针坐标通过 setProperty 写 CSS 变量,不触发 React 重渲染;色场漂移由纯 CSS 关键帧循环(8s / 9s / 10s,cubic-bezier(0.45,0,0.55,1))自主运行',
      'prefers-reduced-motion 下停用全部漂移关键帧与指针跟随,只保留 26% 透明度的静态色场(位移上限压到 12、遮罩移除)',
    ],
    deps: [],
    file: 'cards/fluid-distortion-card.tsx',
    tags: ['流体', 'SVG 滤镜', '鼠标跟随', '交互卡片'],
    usage: `import { Waves } from "lucide-react";
import { FluidDistortionCard } from "@/components/ui/fluid-distortion-card";

export function Feature() {
  return (
    <FluidDistortionCard className="h-60 w-full max-w-sm">
      <div className="flex h-full flex-col justify-between">
        <Waves className="size-6 text-cyan-200" />
        <div>
          <h3 className="text-2xl font-semibold text-white">流动界面</h3>
          <p className="mt-2 text-sm text-zinc-300">
            移动指针,让色彩像液体一样发生偏折。
          </p>
        </div>
      </div>
    </FluidDistortionCard>
  );
}`,
    preview: (
      <FluidDistortionCard className="h-52 w-full max-w-xs @md:h-60 @md:max-w-sm">
        <div className="flex h-full flex-col justify-between">
          <div className="flex items-center justify-between">
            <Waves aria-hidden className="size-5 text-cyan-100 @md:size-6" />
            <span className="font-mono text-[9px] tracking-[0.24em] text-white/45 @md:text-[10px]">
              INTERACTIVE SURFACE
            </span>
          </div>
          <div>
            <h4 className="text-xl font-semibold tracking-tight text-white @md:text-2xl">
              流动界面
            </h4>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-zinc-300 @md:text-sm">
              移动指针,让色彩像液体一样发生偏折。
            </p>
          </div>
        </div>
      </FluidDistortionCard>
    ),
  },
  {
    slug: "bento-grid",
    title: "便当格",
    name: "Bento Grid",
    category: "cards",
    description: "不规则网格容器:大小格子错落占位,一块主格压阵,信息一眼分层。",
    designNotes: [
      "网格基础 2 列、间距 12px;md 起切换为 columns 指定列数(默认 3,可选 2–4),行高 minmax(96px,auto) 保证格子有最低呼吸感",
      "组件只负责布局,格子样式与占位由调用方决定:col-span / row-span 自由拼装,如 col-span-2 row-span-2 形成 2×2 主格、col-span-N 形成通栏格",
      "列数类名用字面量映射(COLUMN_CLASSES),不拼接变量,保证 Tailwind 扫描器可见",
      "纯 CSS 布局、零动画零依赖,不涉及 prefers-reduced-motion 分支",
    ],
    deps: [],
    file: "cards/bento-grid.tsx",
    tags: ["布局", "网格", "仪表盘", "落地页"],
    usage: `import { Activity, Gauge, Zap } from "lucide-react";
import { BentoGrid } from "@/components/ui/bento-grid";

export function Overview() {
  return (
    <BentoGrid className="max-w-3xl">
      <div className="col-span-2 row-span-2 rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <Zap className="size-5 text-[#d7ff3c]" />
        <h3 className="mt-3 font-semibold">核心指标</h3>
        <p className="mt-1 text-sm text-zinc-400">2×2 主格,放最重要的那件事。</p>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <Gauge className="size-4 text-zinc-500" />
      </div>
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <Activity className="size-4 text-zinc-500" />
      </div>
    </BentoGrid>
  );
}`,
    preview: (
      <BentoGrid className="w-full max-w-md">
        <div className="col-span-2 row-span-2 flex flex-col justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
          <Zap aria-hidden className="size-4 text-[#d7ff3c]" />
          <div>
            <p className="text-sm font-medium text-white">核心指标</p>
            <p className="mt-1 text-xs text-zinc-500">2×2 主格,放最重要的那件事。</p>
          </div>
        </div>
        <div className="flex flex-col justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
          <Gauge aria-hidden className="size-4 text-zinc-500" />
          <p className="text-xs text-zinc-400">次级数据</p>
        </div>
        <div className="flex flex-col justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
          <Activity aria-hidden className="size-4 text-zinc-500" />
          <p className="text-xs text-zinc-400">实时状态</p>
        </div>
        <div className="col-span-3 flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
          <p className="text-xs text-zinc-400">通栏格:横向铺陈</p>
          <Boxes aria-hidden className="size-4 text-zinc-500" />
        </div>
      </BentoGrid>
    ),
  },
];
