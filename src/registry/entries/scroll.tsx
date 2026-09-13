import { FullscreenExpandTransition } from '@/registry/components/scroll/fullscreen-expand-transition';
import { ScrollMascot } from '@/registry/components/scroll/scroll-mascot';
import { ScrollRingCarousel } from '@/registry/components/scroll/scroll-ring-carousel';
import { ScrollScene } from '@/registry/components/scroll/scroll-scene';
import { ScrollSnapGallery } from '@/registry/components/scroll/scroll-snap-gallery';
import { StackedScrollCards } from '@/registry/components/scroll/stacked-scroll-cards';
import type { RegistryEntry } from '@/registry/types';

export const ScrollEntries: RegistryEntry[] = [
  {
    slug: 'scroll-scene',
    title: '滚动场景切换',
    name: 'Scroll Scene',
    category: 'scroll',
    description: '滚过一个视口便切换一幕,以交叉淡化、色彩和章节进度组织连续叙事。',
    designNotes: [
      '组件内部自建与舞台等高的纵向滚动容器,每个场景占满一屏(min-h-full)并 snap-start + snap-always,滚过一个视口切换一幕',
      '当前场景索引 = round(scrollTop / clientHeight),钳制在 0 至 items.length-1;右侧章节进度条激活段 24px 纯白、其余 8px 白 25%,300ms 过渡',
      '场景间 700ms opacity 交叉淡化,缓动 cubic-bezier(0.22,1,0.36,1);背景为 72% 24% 圆心、42% 处透明的彩色径向光晕,叠加 #18181b→#09090b 145° 线性渐变',
      '文字左下对齐,内边距 24px(@md 36px),标题 24px→36px→48px、字距 -0.04em;右上 112–160px 白 20% 描边圆环,带 0 0 70px 白 12% 光晕与背景模糊',
      'prefers-reduced-motion 时取消 700ms 淡化(motion-reduce:transition-none)直接切换;onScroll 只把滚动位置取整为索引,视觉全靠 CSS opacity 过渡,无 rAF',
    ],
    deps: [],
    file: 'scroll/scroll-scene.tsx',
    tags: ['滚动叙事', '场景', '吸附', '交叉淡化'],
    usage: `import { ScrollScene } from "@/components/ui/scroll-scene";

const scenes = [
  { eyebrow: "Chapter 01", title: "抵达", description: "从一束微光进入故事。", color: "#1d4ed8" },
  { eyebrow: "Chapter 02", title: "穿越", description: "滚动一次,切换一幕。", color: "#7c3aed" },
  { eyebrow: "Chapter 03", title: "远方", description: "让结尾停在新的地平线。", color: "#0f766e" },
];

export function Story() {
  return <ScrollScene items={scenes} className="h-screen" />;
}`,
    preview: (
      <ScrollScene
        className="absolute inset-0"
        items={[
          {
            eyebrow: 'Chapter 01',
            title: '抵达',
            description: '从一束冷光进入故事。',
            color: '#1d4ed8',
          },
          {
            eyebrow: 'Chapter 02',
            title: '穿越',
            description: '滚动一次,空间随之换幕。',
            color: '#7c3aed',
          },
          {
            eyebrow: 'Chapter 03',
            title: '远方',
            description: '在新的地平线结束旅程。',
            color: '#0f766e',
          },
        ]}
      />
    ),
    previewClassName: 'p-0',
  },
  {
    slug: 'scroll-ring-carousel',
    title: '滚动 3D 环形轮播',
    name: 'Scroll Ring Carousel',
    category: 'scroll',
    description: '纵向滚动驱动一组卡片沿 Y 轴成环旋转,把浏览进度变成立体轨道。',
    designNotes: [
      '舞台 perspective 760px,卡片按 rotateY(index × 360°/数量) translateZ(半径) 排成圆环;半径由 radius 传入并钳制在 90–220px,默认 150px',
      '滚动轨道高度为 max(220%, 数量×70)%,滚动进度连续映射为整环 rotateY 角度;角度直接写入 ring 的 style.transform(preserve-3d,卡片 backface-visibility:hidden),React 只在整数索引变化时重渲染',
      '卡面背景为 linear-gradient(155deg, 主色, #151518 68%),圆角 16px、1px 白 15% 边框;卡宽 clamp(96px,40cqh,176px)、卡高 clamp(112px,48cqh,208px),内边距 16px(@md 20px)',
      '舞台底部预留 48px(@md 64px) 放置 Scroll to orbit 提示与当前卡片名,避免与卡片重叠;中央横贯一条 1px 白 15% 的水平渐变基准线',
      'prefers-reduced-motion 时(matchMedia 监听)连续旋转退化为按最近索引的离散跳转,键盘聚焦与滚动选择能力保留',
    ],
    deps: [],
    file: 'scroll/scroll-ring-carousel.tsx',
    tags: ['3D', '环形轮播', '滚动驱动', '作品集'],
    usage: `import { ScrollRingCarousel } from "@/components/ui/scroll-ring-carousel";

const projects = [
  { label: "Identity", title: "North / 01", color: "#172554" },
  { label: "Digital", title: "Pulse / 02", color: "#4c1d95" },
  { label: "Space", title: "Field / 03", color: "#134e4a" },
  { label: "Motion", title: "Orbit / 04", color: "#7c2d12" },
];

export function Portfolio() {
  return <ScrollRingCarousel items={projects} radius={150} className="h-screen" />;
}`,
    preview: (
      <ScrollRingCarousel
        className="absolute inset-0"
        radius={140}
        items={[
          { label: 'Identity', title: 'North / 01', color: '#172554' },
          { label: 'Digital', title: 'Pulse / 02', color: '#4c1d95' },
          { label: 'Space', title: 'Field / 03', color: '#134e4a' },
          { label: 'Motion', title: 'Orbit / 04', color: '#7c2d12' },
          { label: 'Object', title: 'Form / 05', color: '#3f3f46' },
        ]}
      />
    ),
    previewClassName: 'p-0',
  },
  {
    slug: 'scroll-snap-gallery',
    title: '滚动吸附',
    name: 'Scroll Snap Gallery',
    category: 'scroll',
    description: '横向浏览时每张内容卡自动停在舞台中央,保留手势惯性又避免半屏悬停。',
    designNotes: [
      '横向滚动容器自身声明 snap-x snap-mandatory 与 overscroll-x-contain,每张卡 snap-center + snap-always,释放手势后整卡停靠在容器中线',
      '卡宽 72cqw(@md 68cqw)、高度撑满容器,圆角 16px、1px 白 10% 边框;首尾各垫 14cqw(@md 16cqw) 空档,让第一张与最后一张也能精确吸附到中线',
      '卡片间距 12px(@md 20px)、纵向内边距 16px(@md 24px);卡面叠加 145° 渐变(白 9% → 45% 处透明 → 黑 45%),右上压 text-7xl→9xl 的白 6% 序号水印',
      '卡底色直接取 items 的 color,渐变层负责压暗以保证白色文字对比;标题 20px→30px、字距 -0.035em,正文 12px→14px 白 55%',
      '性能与降级:纯 CSS 实现零 JavaScript、无任何滚动监听,禁用 JavaScript 时吸附浏览完全可用;滚动条视觉隐藏但容器 tabIndex=0 可键盘聚焦,Shift+滚轮或触控板横向滑动',
    ],
    deps: [],
    file: 'scroll/scroll-snap-gallery.tsx',
    tags: ['CSS Snap', '横向滚动', '画廊', '触控'],
    usage: `import { ScrollSnapGallery } from "@/components/ui/scroll-snap-gallery";

const slides = [
  { eyebrow: "01 / Observe", title: "看见节奏", description: "每一屏只讲一件事。", color: "#172554" },
  { eyebrow: "02 / Focus", title: "自动停靠", description: "释放手势后回到视觉中心。", color: "#4c1d95" },
  { eyebrow: "03 / Continue", title: "继续探索", description: "下一张始终露出线索。", color: "#134e4a" },
];

export function Gallery() {
  return <ScrollSnapGallery items={slides} className="h-[70vh]" />;
}`,
    preview: (
      <ScrollSnapGallery
        className="absolute inset-0"
        items={[
          {
            eyebrow: '01 / Observe',
            title: '看见节奏',
            description: '每一屏,只讲一件事。',
            color: '#172554',
          },
          {
            eyebrow: '02 / Focus',
            title: '自动停靠',
            description: '释放手势,内容回到中心。',
            color: '#4c1d95',
          },
          {
            eyebrow: '03 / Continue',
            title: '继续探索',
            description: '下一张始终留下一点线索。',
            color: '#134e4a',
          },
        ]}
      />
    ),
    previewClassName: 'p-0',
  },
  {
    slug: 'stacked-scroll-cards',
    title: '滚动叠层转场',
    name: 'Stacked Scroll Cards',
    category: 'scroll',
    description: '卡片随滚动依次吸附到同一位置,后一层覆盖前一层形成连续的纵深转场。',
    designNotes: [
      '每张卡 position:sticky:首层 top 16px(@md 28px),后续每层递增 12px(@md 14px),z-index 按序 +1,后卡覆盖前卡形成叠层',
      '单卡高 76cqh、最小高 160px(@md 208px),层间垂直距离 80px(@md 112px);容器声明 container-type:size,让 cqh 单位可靠解析',
      '卡片圆角 16px、1px 白 10% 边框、顶部阴影 0 -18px 50px 黑 35% 强调叠层边界;卡面叠 80% 12% 圆心的白 14% 径向高光与 145° 压暗渐变,底色取 items 的 color',
      '末尾垫 52cqh 滚动缓冲,保证最后一张也能完整吸附停留后再离场;卡内 Layer 编号 9px 字距 0.28em 白 55%,右上角 8px 白 65% 状态点',
      '性能与降级:纯 CSS sticky 实现,零 JavaScript、零滚动监听,禁用 JavaScript 行为完全一致;滚动条视觉隐藏,容器 tabIndex=0 可键盘聚焦',
    ],
    deps: [],
    file: 'scroll/stacked-scroll-cards.tsx',
    tags: ['Sticky', '叠层', '转场', '滚动叙事'],
    usage: `import { StackedScrollCards } from "@/components/ui/stacked-scroll-cards";

const chapters = [
  { number: "01", title: "发现", description: "先看见真正的问题。", color: "#172554" },
  { number: "02", title: "塑形", description: "让想法获得清晰边界。", color: "#4c1d95" },
  { number: "03", title: "抵达", description: "用最后一层完成叙事。", color: "#134e4a" },
];

export function Process() {
  return <StackedScrollCards items={chapters} className="h-screen" />;
}`,
    preview: (
      <StackedScrollCards
        className="absolute inset-0"
        items={[
          { number: '01', title: '发现', description: '先看见真正的问题。', color: '#172554' },
          { number: '02', title: '塑形', description: '让想法获得清晰边界。', color: '#4c1d95' },
          { number: '03', title: '抵达', description: '用最后一层完成叙事。', color: '#134e4a' },
        ]}
      />
    ),
    previewClassName: 'p-0',
  },
  {
    slug: 'fullscreen-expand-transition',
    title: '滚动全屏扩展转场',
    name: 'Fullscreen Expand Transition',
    category: 'scroll',
    description: '中心画面随滚动由悬浮窗口扩展至全屏,让章节切换像一次镜头推进。',
    designNotes: [
      '面板初始 scale 0.58(startScale 可配,钳制 0.4–0.9)、圆角 28px,随滚动扩展到 scale 1、圆角 0px,如一次镜头推进',
      '内部滚动轨道高 190%,进度经 easeOutCubic(1-(1-p)³) 缓动,起步快、收尾稳',
      '辉光层取 accent 色(默认 #7c3aed),四周内缩 16%、blur 70px、初始 opacity 0.7,随扩展线性淡出到 0;面板底色为 accent 径向渐变(72% 24% 圆心、40% 处透明)叠加 #202024→#09090b 145° 渐变,外框 1px 白 10%、阴影 0 30px 100px 黑 75%',
      '性能:scale、圆角、辉光透明度全部经 ref 直接写 style,缩放用独立 CSS scale 属性避免与 Tailwind transform 叠加,滚动全程零 React 重渲染',
      'prefers-reduced-motion 时跳过缓动,直接呈现 scale 1、圆角 0 的全屏终态并隐藏辉光',
    ],
    deps: [],
    file: 'scroll/fullscreen-expand-transition.tsx',
    tags: ['全屏', '缩放', '镜头推进', '滚动进度'],
    usage: `import { FullscreenExpandTransition } from "@/components/ui/fullscreen-expand-transition";

export function ChapterCover() {
  return (
    <FullscreenExpandTransition className="h-screen" accent="#7c3aed">
      <div className="flex h-full flex-col justify-end p-12">
        <p className="text-sm text-white/50">Chapter 02</p>
        <h2 className="mt-3 text-7xl font-semibold">进入下一幕</h2>
      </div>
    </FullscreenExpandTransition>
  );
}`,
    preview: (
      <FullscreenExpandTransition className="absolute inset-0" accent="#6d28d9">
        <div className="flex h-full flex-col justify-between p-6 @md:p-10">
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/45">Chapter 02</p>
          <div>
            <h3 className="text-2xl font-semibold tracking-[-0.045em] @md:text-5xl">进入下一幕</h3>
            <p className="mt-2 text-xs text-white/50 @md:text-sm">向下滚动,让画面占满舞台。</p>
          </div>
        </div>
      </FullscreenExpandTransition>
    ),
    previewClassName: 'p-0',
  },
  {
    slug: 'scroll-mascot',
    title: 'IP 跟随角色',
    name: 'Scroll Mascot',
    category: 'scroll',
    description: 'IP 角色注视光标,并随滚动方向倾斜、升降和更换对白,让品牌形象参与浏览。',
    designNotes: [
      '光标在容器内的归一化坐标映射为角色位移 x ±18px、y ±14px,眼球再映射 x ±4px、y ±3px,始终看向指针',
      '光标跟随弹簧 stiffness 180、damping 18、mass 0.45;滚动倾斜弹簧 stiffness 150、damping 14、mass 0.5,倾斜角钳制 ±10°(位移差 × 0.45),停止滚动 120ms 后回正;升降弹簧 stiffness 120、damping 18、mass 0.6',
      '滚动进度把角色从 -12px 升到 +12px,并按进度等分切换 messages 对白;底部指示条激活段 28px 纯白、其余 8px 白 20%,300ms 过渡',
      '性能:指针与滚动全部走 MotionValue + useSpring 直接写 transform,不逐帧 setState;React 仅在整数对白索引变化时重渲染',
      'prefers-reduced-motion(useReducedMotion)时停用光标跟随、倾斜与升降,角色静止,仅保留对白切换',
    ],
    deps: ['motion'],
    file: 'scroll/scroll-mascot.tsx',
    tags: ['IP 形象', '鼠标跟随', '滚动方向', '品牌角色'],
    usage: `import { ScrollMascot } from "@/components/ui/scroll-mascot";

export function Companion() {
  return (
    <ScrollMascot
      className="h-screen"
      color="#a3e635"
      messages={["嗨,我会看向你的光标。", "继续滚动,我也会跟上。", "到站啦,下次见!"]}
    />
  );
}`,
    preview: (
      <ScrollMascot
        className="absolute inset-0"
        messages={['嗨,我会看向你的光标。', '继续滚动,我也会跟上。', '到站啦,下次见!']}
      />
    ),
    previewClassName: 'p-0',
  },
];
