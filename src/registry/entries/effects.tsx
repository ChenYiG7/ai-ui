import {
  Atom,
  Cloud,
  Code2,
  Compass,
  Database,
  Folder,
  GitBranch,
  Mail,
  MousePointerClick,
  Music,
  Settings,
  Terminal,
} from 'lucide-react';
import { BorderBeam } from '@/registry/components/effects/border-beam';
import { ClickSpark } from '@/registry/components/effects/click-spark';
import { Dock } from '@/registry/components/effects/dock';
import { Marquee } from '@/registry/components/effects/marquee';
import { NumberTicker } from '@/registry/components/effects/number-ticker';
import { OrbitingCircles } from '@/registry/components/effects/orbiting-circles';
import { TextPressure } from '@/registry/components/effects/text-pressure';
import { ThinkingMarquee } from '@/registry/components/effects/thinking-marquee';
import type { RegistryEntry } from '@/registry/types';

const marqueeItems = [
  'Next.js',
  'React 19',
  'Tailwind CSS',
  'TypeScript',
  'motion',
  'shiki',
  'Lucide',
  'pnpm',
];

const thinkingText =
  '先确认问题的边界,再把复杂的目标拆成几个可以验证的步骤。比较不同路径的成本,保留真正影响结果的约束。让新的线索从右侧安静地浮现,旧的思绪在左侧缓慢消散。等待不必被进度条填满,一点轻微的流动,就足以说明思考仍在继续。重新检查最初的假设,把零散的信息连接起来,再用清晰、简洁的语言组织最终回答。';

export const effectEntries: RegistryEntry[] = [
  {
    slug: 'marquee',
    title: '无限跑马灯',
    name: 'Marquee',
    category: 'effects',
    description: '内容无缝横向滚动,悬停暂停,两侧柔和淡出,适合展示合作方与技术栈。',
    designNotes: [
      '内容渲染两份首尾相接,每份用 translateX(-100%) 位移自身宽度后循环,第二份 aria-hidden',
      '元素间距同时作为每份的右内边距计入宽度,保证接缝处距离与其他间距一致',
      '默认 30s 一轮线性匀速,支持 reverse 反向;悬停时 animation-play-state: paused',
      '容器两侧用线性渐变 mask 淡出(12% 与 88% 处开始)',
      '纯 CSS 动画,关键帧随组件内联,尊重 prefers-reduced-motion',
    ],
    deps: [],
    file: 'effects/marquee.tsx',
    tags: ['Logo 墙', '循环', '纯 CSS', '横向滚动'],
    usage: `import { Marquee } from "@/components/ui/marquee";

const logos = ["Next.js", "Tailwind CSS", "TypeScript", "motion"];

export function LogoWall() {
  return (
    <Marquee duration={24}>
      {logos.map((name) => (
        <span key={name} className="text-2xl font-semibold text-zinc-400">
          {name}
        </span>
      ))}
    </Marquee>
  );
}`,
    previewClassName: 'px-0',
    preview: (
      <div className="flex w-full flex-col gap-4">
        <Marquee duration={22}>
          {marqueeItems.map((name) => (
            <span
              key={name}
              className="text-lg font-semibold tracking-tight text-zinc-300 @md:text-2xl"
            >
              {name}
            </span>
          ))}
        </Marquee>
        <Marquee duration={28} reverse>
          {marqueeItems.map((name) => (
            <span
              key={name}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-zinc-400 @md:text-sm"
            >
              {name}
            </span>
          ))}
        </Marquee>
      </div>
    ),
  },
  {
    slug: 'number-ticker',
    title: '数字滚动',
    name: 'Number Ticker',
    category: 'effects',
    description: '进入视口后数字从 0 平滑增长到目标值,用于统计数据与里程碑展示。',
    designNotes: [
      '使用 useInView 监听,元素有一半进入视口后只播放一次',
      '用 motion 的 animate(0, value) 驱动,时长 1.8s,缓动 cubic-bezier(0.16,1,0.3,1) 先快后慢',
      '通过 Intl.NumberFormat 格式化,支持千分位、小数位、前后缀',
      '使用 tabular-nums 统一每位数字宽度;并排数据用 flex-wrap、横向 40px 间距,避免长数字与相邻项重合',
      '服务端渲染最终值利于 SEO,客户端挂载后再重置为 0 开始播放;尊重 prefers-reduced-motion',
    ],
    deps: ['motion'],
    file: 'effects/number-ticker.tsx',
    tags: ['统计', '数据', '滚动触发', '里程碑'],
    usage: `import { NumberTicker } from "@/components/ui/number-ticker";

export function Stats() {
  return (
    <div className="flex flex-wrap gap-x-12 gap-y-4">
      <div>
        <NumberTicker value={12800} suffix="+" className="text-5xl font-semibold" />
        <p className="text-sm text-zinc-500">开发者</p>
      </div>
      <div>
        <NumberTicker value={99.9} decimals={1} suffix="%" className="text-5xl font-semibold" />
        <p className="text-sm text-zinc-500">可用性</p>
      </div>
    </div>
  );
}`,
    preview: (
      <div className="flex w-full max-w-md flex-wrap items-baseline justify-center gap-x-10 gap-y-4 text-center">
        {[
          { value: 12800, suffix: '+', label: '条目', decimals: 0 },
          { value: 99.9, suffix: '%', label: '可用性', decimals: 1 },
          { value: 48, suffix: 'ms', label: '延迟', decimals: 0 },
        ].map((s) => (
          <div key={s.label}>
            <NumberTicker
              value={s.value}
              suffix={s.suffix}
              decimals={s.decimals}
              className="text-2xl font-semibold tracking-tight text-white @md:text-4xl @xl:text-5xl"
            />
            <p className="mt-1 text-[10px] uppercase tracking-widest text-zinc-500 @md:text-xs">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    ),
  },
  {
    slug: 'border-beam',
    title: '边框光束',
    name: 'Border Beam',
    category: 'effects',
    description: '一段渐变光沿着容器边框匀速绕行,让静态卡片拥有可见的「心跳」。',
    designNotes: [
      '光束是一个 64px 的正方形渐变(品牌色→紫→透明),沿 offset-path: rect(0 auto auto 0 round 64px) 运动',
      '通过 offset-distance 从 0% 到 100% 的关键帧完成绕行,默认 6s 线性无限循环',
      '外层用双层 mask(padding-box 与 border-box 相减)只保留 1.5px 边框区域,光束在其他区域不可见',
      '组件绝对定位、pointer-events-none、rounded-[inherit],父元素需 relative + overflow-hidden 并设定圆角',
      '支持 delay 与 reverse,多条光束叠加时可错开相位;动画类挂 motion-safe:,开启 prefers-reduced-motion 时光束静止在起始角不再循环;纯 CSS 动画',
    ],
    deps: [],
    file: 'effects/border-beam.tsx',
    tags: ['边框', '发光', '卡片', '纯 CSS'],
    usage: `import { BorderBeam } from "@/components/ui/border-beam";

export function Card() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 p-8">
      <h3 className="text-lg font-semibold">Pro 计划</h3>
      <p className="mt-2 text-sm text-zinc-400">每月 ¥99,含全部组件。</p>
      <BorderBeam />
      <BorderBeam delay={3} colorFrom="#06b6d4" colorTo="#7c3aed" />
    </div>
  );
}`,
    preview: (
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 p-7">
        <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">Pro 计划</p>
        <p className="mt-4 text-3xl font-semibold tracking-tight text-white">
          ¥99<span className="text-sm text-zinc-500"> / 月</span>
        </p>
        <p className="mt-2 text-sm text-zinc-400">含全部组件与未来更新。</p>
        <BorderBeam />
        <BorderBeam delay={3} colorFrom="#06b6d4" colorTo="#7c3aed" />
      </div>
    ),
  },
  {
    slug: 'click-spark',
    title: '点击火花',
    name: 'Click Spark',
    category: 'effects',
    description: '在容器内任意位置点击,迸出一圈短线火花向外飞散淡出。',
    designNotes: [
      'Canvas 绝对定位叠在内容之上,pointer-events-none 且 aria-hidden,不拦截任何点击;点击坐标经 onClick 换算为画布内坐标',
      '默认每次点击迸出 8 条 2px 圆头短线,线色 #ffffff、基准长度 14px,角度均分圆周再加 0-0.5rad 随机偏移',
      '每条线寿命 420ms,头部以基准长度的 1.6 倍(约 22px)向外推进,尾部逐渐追上头部收束消散,透明度从 1 线性降到 0',
      '画布按 devicePixelRatio(上限 2)缩放,ResizeObserver 跟随容器尺寸;requestAnimationFrame 循环只做清屏与重绘,不触发 React 重渲染',
      'prefers-reduced-motion: reduce 时点击不再产生火花,容器内容的交互不受影响',
    ],
    deps: [],
    file: 'effects/click-spark.tsx',
    tags: ['点击', 'Canvas', '微交互', '包装器'],
    usage: `import { ClickSpark } from "@/components/ui/click-spark";

export function Panel() {
  return (
    <ClickSpark className="rounded-2xl border border-white/10 p-8">
      <p>在这一区域内的任意位置点击</p>
    </ClickSpark>
  );
}`,
    preview: (
      <ClickSpark
        sparkColor="#d7ff3c"
        className="w-full max-w-sm rounded-2xl border border-dashed border-white/15 p-8 text-center"
      >
        <MousePointerClick className="mx-auto size-6 text-zinc-500" />
        <p className="mt-3 text-sm text-zinc-400">点击画面任意位置,迸出一圈火花</p>
      </ClickSpark>
    ),
  },
  {
    slug: 'text-pressure',
    title: '压力字体',
    name: 'Text Pressure',
    category: 'effects',
    description: '指针靠近的字符被压粗,划过时像手指按过一行软字,离开后回落。',
    designNotes: [
      '每个字符先以最大字重 850 的隐藏副本占位锁定字宽,动态字重不推动邻字;rAF 合并指针事件,先集中读取全部字框再批量写入 style,不触发 React 重渲染',
      '指针距离在 130px 生效半径内线性映射字重 400→850,font-weight 与 font-variation-settings("wght") 双写;离开生效区后回落到最细字重',
      '动态字上加 100ms 的 font-weight 过渡消除跳变,需要可变字体才有平滑效果(系统 UI 字体多为可变)',
      '外层 span 以 aria-label 保留完整文本,逐字占位与显示副本均 aria-hidden,并加 cursor-default select-none 防止选中干扰',
      'prefers-reduced-motion 时跳过指针监听,全部字符保持最细字重 400 静态显示',
    ],
    deps: ['motion'],
    file: 'effects/text-pressure.tsx',
    tags: ['字体', '指针', '可变字体', '交互'],
    usage: `import { TextPressure } from "@/components/ui/text-pressure";

export function Headline() {
  return (
    <h1 className="text-7xl tracking-tight">
      <TextPressure text="PRESSURE" />
    </h1>
  );
}`,
    preview: (
      <div className="flex flex-col items-center gap-3">
        <TextPressure
          text="PRESSURE"
          className="text-2xl font-medium tracking-tight text-white @md:text-4xl @xl:text-6xl"
        />
        <p className="text-xs text-zinc-500 @md:text-sm">把鼠标划过这行字</p>
      </div>
    ),
  },
  {
    slug: 'thinking-marquee',
    title: '思考流跑马灯',
    name: 'Thinking Marquee',
    category: 'effects',
    description: '推理文字向左轻柔流动,微光掠过字面,让等待拥有安静的呼吸感。',
    designNotes: [
      '默认字号 15px、字重 300、行高 1.85、字距 0.024em,文字色 oklch(72% 0.01 250);右侧指示点 4px、与视口间距 12px',
      '默认每 48ms 追加 2 个字素,新片段以 620ms cubic-bezier(0.25,1,0.5,1) 纯透明度淡入;两侧渐隐 mask 左取 min(148px,22%)、右取 min(64px,9%),滚动目标在尾部多留 56px',
      '速度由 24px/s 起步,按积压量 1.8 倍加速,指数平滑时间常数 90ms,上限 2400px/s;积压上限为 max(600px, 2.5 倍视口宽),离开左侧一屏的节点回收并补偿位移',
      '扫光为 110deg 渐变、白色 12% 透明度、背景长 200%,3s 线性循环并以 mix-blend-screen 固定在视口;4px 指示点以 3.4s 呼吸,透明度 0.2-0.55、scale 0.78-1',
      '逐帧位移以 translate3d 直写轨道 style,节点插入与回收走 DOM API,不经过 React 状态与重渲染',
      'streaming 模式每帧最多插入 48 个节点实时接续,播完触发 onComplete;loop 默认关闭,开启后停顿 2s 重播;每 900ms 经 aria-live 礼貌播报新增文字',
      'prefers-reduced-motion 或 reducedMotion 属性为真时一次性显示全部文本,停用逐字动画、扫光与呼吸,loop 失效;装饰动画全部包在 prefers-reduced-motion: no-preference 内',
    ],
    deps: [],
    file: 'effects/thinking-marquee.tsx',
    tags: ['AI', '流式文本', '等待反馈', '跑马灯', '扫光'],
    usage: `import { ThinkingMarquee } from "@/components/ui/thinking-marquee";

export function ThinkingIndicator() {
  return (
    <div className="max-w-xl rounded-[14px] border border-white/10 bg-[#111214] px-[18px] py-3.5">
      <p className="mb-2 text-xs text-zinc-500">推理过程</p>
      <ThinkingMarquee text="先确认问题的边界,再比较不同方案。检查关键假设,整理线索,形成清晰的回答。" />
    </div>
  );
}

// 接入实时输出:把累计文本传入 text,生成期间保持 streaming 为 true,
// 结束后设为 false;传入空字符串可清空,paused 可暂停,onComplete 可接收完成通知。
export function LiveThinking({ text, streaming }: { text: string; streaming: boolean }) {
  return <ThinkingMarquee text={text} streaming={streaming} />;
}`,
    preview: (
      <div className="w-full max-w-xl space-y-5 @md:space-y-6">
        <div className="rounded-[14px] border border-white/10 bg-[#111214] px-4 py-3 @md:px-[18px] @md:py-3.5">
          <p className="mb-2.5 font-mono text-[10px] tracking-[0.09em] text-zinc-500 @md:text-xs">
            推理过程
          </p>
          <ThinkingMarquee text={thinkingText} loop className="text-xs @md:text-[15px]" />
        </div>
        <p className="text-[10px] tracking-wide text-zinc-500 @md:text-xs">
          思绪轻轻流过,答案正在成形。
        </p>
      </div>
    ),
  },
  {
    slug: 'dock',
    title: '程序坞',
    name: 'Dock',
    category: 'effects',
    description: '仿 macOS Dock:图标随指针距离平滑放大,相邻图标被推开,附悬停标签。',
    designNotes: [
      '指针 clientX 记录进单个 MotionValue,各图标按自身中心的横向距离独立求值并直写宽高,不经 React 状态、不触发重渲染;离开容器置为 Infinity 让全部图标回到基础尺寸',
      '默认基础图标 44px、峰值放大 1.7 倍、影响范围 ±140px;ResizeObserver 按可用宽度减 26px 容器横向内边距与边框、每格 8px 间距与放大余量推算可容纳尺寸(下限 16px),小舞台同步收缩影响范围',
      '图标宽高经弹簧(mass 0.1、stiffness 170、damping 14)平滑,放大与回弹都带惯性',
      '容器圆角 20px、边框白 15%、backdrop-blur-xl,底色由白 10% 渐变到 3.5%;图标由 #303237 渐变到 #1b1c20、圆角为边长 28%,叠 1px 白 8% 顶部高光',
      '悬停与键盘聚焦都显示顶部标签(text-[11px]),按钮以 aria-label 保留名称;prefers-reduced-motion 时停用放大与弹簧,图标保持自适应基础尺寸',
    ],
    deps: ['motion'],
    file: 'effects/dock.tsx',
    tags: ['导航', 'macOS', '弹簧', '图标'],
    usage: `import { Compass, Folder, Mail, Music, Settings } from "lucide-react";
import { Dock } from "@/components/ui/dock";

export function AppDock() {
  return (
    <Dock
      items={[
        { label: "探索", icon: <Compass /> },
        { label: "文件", icon: <Folder /> },
        { label: "邮件", icon: <Mail /> },
        { label: "音乐", icon: <Music /> },
        { label: "设置", icon: <Settings /> },
      ]}
    />
  );
}`,
    preview: (
      <Dock
        items={[
          { label: '探索', icon: <Compass /> },
          { label: '文件', icon: <Folder /> },
          { label: '终端', icon: <Terminal /> },
          { label: '邮件', icon: <Mail /> },
          { label: '音乐', icon: <Music /> },
          { label: '设置', icon: <Settings /> },
        ]}
      />
    ),
  },
  {
    slug: 'orbiting-circles',
    title: '环绕轨道',
    name: 'Orbiting Circles',
    category: 'effects',
    description: '图标沿圆周匀速公转且始终保持正立,叠多层半径与速度可组成星轨。',
    designNotes: [
      '轨道项均分圆周:初始角 = 360° / 项数 × 序号 + startAngle;容器为 radius×2 + 96px 的正方形,并以直径 radius×2 的 1px 白 8% 圆环标出轨迹',
      '关键帧为 rotate(角) translateY(radius px) rotate(-角):先转到轨道点、推出半径、再反向转回,项自身始终保持正立;轨道项用 Tailwind 独立 translate 属性居中,与关键帧 transform 不叠加冲突',
      '默认 24s 一圈线性匀速,支持 reverse 反向(animation-direction: reverse)与任意 startAngle 起始角',
      '纯 CSS 关键帧实现,动画只落在轨道项自身的 transform 上,无 JS 参与、不触发重渲染',
      '关键帧包在 prefers-reduced-motion: no-preference 内,系统减少动态时轨道项静止并均匀分布在圆周上',
    ],
    deps: [],
    file: 'effects/orbiting-circles.tsx',
    tags: ['图标', '公转', '科技', '纯 CSS'],
    usage: `import { Atom, Cloud, Code2, Database, GitBranch } from "lucide-react";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";

const chip = "flex size-10 items-center justify-center rounded-xl border border-white/10 bg-zinc-900 text-zinc-300";

export function TechOrbit() {
  return (
    <OrbitingCircles
      center={<Atom className="size-8 text-lime-300" />}
      radius={90}
      duration={20}
      items={[
        <span className={chip}><Code2 className="size-5" /></span>,
        <span className={chip}><Database className="size-5" /></span>,
        <span className={chip}><Cloud className="size-5" /></span>,
        <span className={chip}><GitBranch className="size-5" /></span>,
      ]}
    />
  );
}`,
    preview: (
      <div className="flex items-center justify-center">
        <OrbitingCircles
          center={
            <span className="flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-zinc-900">
              <Atom className="size-7 text-lime-300" />
            </span>
          }
          radius={86}
          duration={18}
          items={[
            <span className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-zinc-900 text-zinc-300">
              <Code2 className="size-5" />
            </span>,
            <span className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-zinc-900 text-zinc-300">
              <Database className="size-5" />
            </span>,
            <span className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-zinc-900 text-zinc-300">
              <Cloud className="size-5" />
            </span>,
            <span className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-zinc-900 text-zinc-300">
              <GitBranch className="size-5" />
            </span>,
          ]}
        />
      </div>
    ),
  },
];
