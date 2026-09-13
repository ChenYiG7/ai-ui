import { AuroraBackground } from '@/registry/components/backgrounds/aurora-background';
import { DotGrid } from '@/registry/components/backgrounds/dot-grid';
import { GridBeams } from '@/registry/components/backgrounds/grid-beams';
import { LightRays } from '@/registry/components/backgrounds/light-rays';
import { Meteors } from '@/registry/components/backgrounds/meteors';
import { Ripple } from '@/registry/components/backgrounds/ripple';
import type { RegistryEntry } from '@/registry/types';

const fill = 'absolute inset-0 flex items-center justify-center';

export const backgroundEntries: RegistryEntry[] = [
  {
    slug: 'dot-grid',
    title: '交互点阵',
    name: 'Dot Grid',
    category: 'backgrounds',
    description: '均匀的暗点铺满背景,指针像手电筒一样扫过,点亮周围一片点阵。',
    designNotes: [
      '点阵用 radial-gradient 平铺实现:1px 实心圆、1.5px 处透明,背景尺寸 24px,居中对齐',
      '两层完全相同排布的点阵:底层暗点(白 14%),顶层亮点(品牌色)',
      '顶层加一个跟随鼠标、半径 220px 的径向遮罩(中心不透明、70% 处透明),只显露指针附近的亮点',
      '鼠标坐标用 MotionValue 写入 mask-image,离开容器时把坐标移到画面外',
      '容器 isolate + overflow-hidden;prefers-reduced-motion 时停止鼠标跟随,保留中心点亮的静态点阵',
    ],
    deps: ['motion'],
    file: 'backgrounds/dot-grid.tsx',
    tags: ['Hero', '交互', '鼠标', '点阵'],
    usage: `import { DotGrid } from "@/components/ui/dot-grid";

export function Section() {
  return (
    <DotGrid className="flex min-h-[60vh] items-center justify-center rounded-3xl">
      <h2 className="text-4xl font-semibold text-white">移动鼠标</h2>
    </DotGrid>
  );
}`,
    previewClassName: 'p-0',
    preview: (
      <DotGrid className={fill}>
        <p className="text-xl font-semibold tracking-tight text-white @md:text-3xl @xl:text-5xl">
          移动鼠标
        </p>
      </DotGrid>
    ),
  },
  {
    slug: 'meteors',
    title: '流星雨',
    name: 'Meteors',
    category: 'backgrounds',
    description: '细长光条头亮尾散,从右上向左下错峰坠落,安静夜空里的一阵流星。',
    designNotes: [
      '每条流星是 120px×1px 的圆角细条,白色 70% 向右渐隐;头部 3px 白点带 6px 半径的白 35% 光晕',
      '光条旋转 -35°,沿自身负 X 轴推进 480px,从右上飞向左下;前 15% 淡入、70% 前保持全亮、随后淡出,时长 3.5–6.5s 各不相同',
      'animation-fill-mode: backwards 且基础态 opacity-0:错峰延迟期与 prefers-reduced-motion 下均不可见,避免横条裸露',
      '数量默认 14 条,top/left/延迟/时长由索引经确定性伪随机派生,服务端与客户端渲染一致',
      '纯 CSS 关键帧,无限循环,尊重 prefers-reduced-motion;容器 isolate + overflow-hidden',
    ],
    deps: [],
    file: 'backgrounds/meteors.tsx',
    tags: ['夜空', 'Hero', '循环', '纯 CSS'],
    usage: `import { Meteors } from "@/components/ui/meteors";

export function Hero() {
  return (
    <Meteors className="flex min-h-screen items-center justify-center">
      <h1 className="text-6xl font-semibold text-white">今夜有流星</h1>
    </Meteors>
  );
}`,
    previewClassName: 'p-0',
    preview: (
      <Meteors className={fill}>
        <p className="text-xl font-semibold tracking-tight text-white @md:text-3xl @xl:text-5xl">
          今夜有流星
        </p>
      </Meteors>
    ),
  },
  {
    slug: 'ripple',
    title: '同心波纹',
    name: 'Ripple',
    category: 'backgrounds',
    description: '多圈圆环从中心依次扩散淡出、周而复始,像水面被轻轻叩了一下。',
    designNotes: [
      '默认 5 圈正圆环,1px 白 25% 描边,宽度撑满容器(上限 640px)并保持 1:1',
      '每圈从 scale 0.15、不透明度 0.55 扩散到 scale 1、完全透明,一轮 4.5s,线性匀速',
      '圈与圈之间以总时长等分的负延迟错开,默认依次为 0、-0.9、-1.8、-2.7、-3.6s,首帧即呈现不同扩散进度',
      '圆环默认不透明度为 0,避免动画生效前叠出白圈;动画走独立 scale 属性,开启 prefers-reduced-motion 时保持透明',
    ],
    deps: [],
    file: 'backgrounds/ripple.tsx',
    tags: ['水波', '扩散', '极简', '纯 CSS'],
    usage: `import { Ripple } from "@/components/ui/ripple";

export function Section() {
  return (
    <Ripple className="flex min-h-[60vh] items-center justify-center">
      <h2 className="text-4xl font-semibold text-white">一圈,又一圈</h2>
    </Ripple>
  );
}`,
    previewClassName: 'p-0',
    preview: (
      <Ripple className={fill}>
        <p className="text-xl font-semibold tracking-tight text-white @md:text-3xl @xl:text-5xl">
          一圈,又一圈
        </p>
      </Ripple>
    ),
  },
  {
    slug: 'aurora-background',
    title: '极光背景',
    name: 'Aurora Background',
    category: 'backgrounds',
    description: '三道低饱和的紫、青、灰绿光带在夜色里极缓交错游移,像高空极光晕开了整片夜空。',
    designNotes: [
      '底色 #080c12;三道椭圆光带默认 #7564c9、#4da6a8、#b4d4c0,每道宽 120%、高 75%,径向渐变在 49%–52% 形成亮脊、66% 处淡为透明',
      '光带组向左右各外扩 20%、上下各外扩 30%,整体倾斜 -12°、模糊 28px、整层 65% 不透明度,保留暗色间隙避免混成实心色块',
      '每道光带独立漂移:translate 在 x -4%→5%、y -3%→6% 间往返,同时 rotate -8°→3°、scale 0.98→1.06,ease-in-out 无限 alternate;时长按 speed+i×5s 取 18/23/28s,负延迟 0/-6/-12s 错峰',
      '底部叠加第二色 22% 的椭圆光晕(中心在 50% 110%、70% 处透明);噪点层 5.5% 不透明度、soft-light 混合;边缘经径向渐变叠上 rgba(8,12,18,0.6) 暗角',
      '纯 CSS 关键帧,动画走独立 translate/rotate/scale 属性由 GPU 合成;装饰层全部 aria-hidden,正文位于最上层',
      '动画类挂 motion-safe: 前缀,prefers-reduced-motion 时停用漂移,保留静止的弧形光带与噪点层次',
    ],
    deps: [],
    file: 'backgrounds/aurora-background.tsx',
    tags: ['Hero', '氛围', '模糊', '纯 CSS'],
    usage: `import { AuroraBackground } from "@/components/ui/aurora-background";

export function Hero() {
  return (
    <AuroraBackground className="flex min-h-screen items-center justify-center">
      <h1 className="text-6xl font-semibold text-white">在极光下发布</h1>
    </AuroraBackground>
  );
}`,
    previewClassName: 'p-0',
    preview: (
      <AuroraBackground className={fill}>
        <p className="text-xl font-semibold tracking-tight text-white @md:text-3xl @xl:text-5xl">
          夜色,缓缓流动
        </p>
      </AuroraBackground>
    ),
  },
  {
    slug: 'grid-beams',
    title: '网格光束',
    name: 'Grid Beams',
    category: 'backgrounds',
    description: '淡淡的网格线上,几束细光沿竖向网格线从上方坠落,到边缘柔和淡出。',
    designNotes: [
      '容器近黑底(bg-zinc-950);网格由两组 1px 线性渐变平铺,默认间距 48px、线色 rgba(255,255,255,0.06),整体套椭圆径向遮罩,中心 40% 内全显、85% 处完全淡出',
      '每束光是 1px 宽、容器 40% 高的竖条,填充透明→#d7ff3c→透明的竖向渐变,整束 80% 不透明度;left = 列序号 × 48px,默认 7 束精确压在网格线上',
      '关键帧把光束从 translateY(-100%) 推到 300%,线性匀速无限循环;时长取 5/7.5/6/8.5/5.5/7/6.5s,负延迟取 0/2.1/4.7/1.3/3.9/0.6/2.9s,两组数表互不成比例,多束不会周期性同步',
      '纯 CSS 动画,关键帧以 <style> 内联随组件下发;容器 isolate + overflow-hidden,内容置于光效之上',
      '动画类挂 motion-safe: 前缀,prefers-reduced-motion 时坠落停用,光束静止停在所在列顶部,只剩一段 40% 高的静息光条',
    ],
    deps: [],
    file: 'backgrounds/grid-beams.tsx',
    tags: ['Hero', '科技', '网格', '纯 CSS'],
    usage: `import { GridBeams } from "@/components/ui/grid-beams";

export function Hero() {
  return (
    <GridBeams className="flex min-h-screen items-center justify-center">
      <h1 className="text-6xl font-semibold text-white">构建于网格之上</h1>
    </GridBeams>
  );
}`,
    previewClassName: 'p-0',
    preview: (
      <GridBeams className={fill}>
        <p className="text-xl font-semibold tracking-tight text-white @md:text-3xl @xl:text-5xl">
          构建于网格之上
        </p>
      </GridBeams>
    ),
  },
  {
    slug: 'light-rays',
    title: '光束倾泻',
    name: 'Light Rays',
    category: 'backgrounds',
    description: '数道冷白光束从顶边中点向下张开,两层光幕反向缓缓摆动,像放映机的灯锥扫过尘埃。',
    designNotes: [
      '容器底色 #0b0b0d,顶部先铺 rgba(200,224,242,0.16) 的椭圆径向光晕(65% 处透明);两层光幕各宽 200%、高 140%、顶部上移 5%',
      '锥形渐变原点在顶边中点:主层从 135° 起铺 4 道冷白光束,峰值不透明度 16%–25%、模糊 3px、整层 80%;副层从 140° 起铺,模糊加大到 18px、整层 60%,只留空气感柔光',
      '线性遮罩让两层分别在自身高度 88% / 90% 处完全淡出;顶边中央另有 30% 宽、1px 高的光源线,白 60% 向两侧渐隐,叠加 0 0 20px 3px、12% 透明度的冷白辉光',
      '两层光幕以顶边中点为原点做 ±2° 独立 rotate,分别 14s 与 21s ease-in-out 往返且方向相反,摆动节奏彼此错开',
      '纯 CSS 实现,关键帧以 <style> 内联随组件下发,装饰层全部 aria-hidden',
      '摆动动画包在 @media (prefers-reduced-motion: no-preference) 内,偏好减弱时光幕静止,保留清晰的光束一帧',
    ],
    deps: [],
    file: 'backgrounds/light-rays.tsx',
    tags: ['光束', '氛围', '放映机', '纯 CSS'],
    usage: `import { LightRays } from "@/components/ui/light-rays";

export function Hero() {
  return (
    <LightRays className="flex min-h-screen items-center justify-center">
      <h1 className="text-6xl font-semibold text-white">聚光灯下</h1>
    </LightRays>
  );
}`,
    previewClassName: 'p-0',
    preview: (
      <LightRays className={fill}>
        <p className="text-xl font-semibold tracking-tight text-white @md:text-3xl @xl:text-5xl">
          聚光灯下
        </p>
      </LightRays>
    ),
  },
];
