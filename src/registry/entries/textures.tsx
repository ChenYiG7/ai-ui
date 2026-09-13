import { FlickeringGrid } from '@/registry/components/textures/flickering-grid';
import { LetterGlitch } from '@/registry/components/textures/letter-glitch';
import type { RegistryEntry } from '@/registry/types';

const fill = 'absolute inset-0 flex items-center justify-center';

export const TexturesEntries: RegistryEntry[] = [
  {
    slug: 'flickering-grid',
    title: '闪烁网格',
    name: 'Flickering Grid',
    category: 'textures',
    description: '满屏 1px 微光方块各自按小概率明灭、缓缓滑向新亮度,像一块正在呼吸的电路板底纹。',
    designNotes: [
      'Canvas 满铺容器:网格单元默认 8px(cellSize),每格中心只画 1px 方块;底色 #0b0b0d,方块默认白 #ffffff,color 支持 #rgb / #rrggbb',
      '每帧每格 4% 概率(flickerChance 0.04)重抽 0–0.35(maxOpacity)的随机目标亮度,当前亮度以 0.08 系数向目标缓动,低于 0.01 的格子跳过绘制,形成呼吸式明灭',
      'prefers-reduced-motion: reduce 时只绘制一帧静态网格,不进入 requestAnimationFrame 动画循环',
      '性能约定:画布按 devicePixelRatio(上限 2)缩放,ResizeObserver 触发时重排网格并重绘一帧,卸载时 cancelAnimationFrame 并断开 observer',
      '容器 relative isolate overflow-hidden,canvas aria-hidden 且 pointer-events-none,children 叠在独立层级之上',
    ],
    deps: [],
    file: 'textures/flickering-grid.tsx',
    tags: ['底纹', 'Canvas', '满屏', '科技感'],
    usage: `import { FlickeringGrid } from "@/components/ui/flickering-grid";

export function Hero() {
  return (
    <FlickeringGrid className="flex min-h-screen items-center justify-center">
      <h1 className="text-6xl font-semibold text-white">信号永不静止</h1>
    </FlickeringGrid>
  );
}`,
    previewClassName: 'p-0',
    preview: (
      <FlickeringGrid className={fill}>
        <p className="text-xl font-semibold tracking-tight text-white @md:text-3xl @xl:text-5xl">
          微光明灭不息
        </p>
      </FlickeringGrid>
    ),
  },
  {
    slug: 'letter-glitch',
    title: '字符雨屏',
    name: 'Letter Glitch',
    category: 'textures',
    description: '满屏青绿等宽字符随机跳变,中心亮、四周渐隐,一层数字噪声质感的底纹。',
    designNotes: [
      'Canvas 满铺容器:字符单元默认 14px(cellSize),字号取 cellSize-2 即 12px 等宽字体;字符集为符号+字母+数字「!<>-_\\/[]{}=+*^?#$%&@ABCDEFXYZ0123456789」',
      '每帧每格 6% 概率(glitchChance 0.06)同时重抽字符与颜色;色板 6 档以青 rgba(18,255,255) 0.55/0.45/0.32 与绿 rgba(0,255,102) 0.38/0.25 为主,掺一档 40% 白作高光',
      'canvas 整层加径向遮罩 radial-gradient(120% 120% at 50% 50%, #000 30%, transparent 76%),中心全显、四周渐隐,自然融入 #0b0b0d 底色',
      'prefers-reduced-motion: reduce 时只绘制一帧静态字符场,不进入 requestAnimationFrame 动画循环',
      '性能约定:画布按 devicePixelRatio(上限 2)缩放,ResizeObserver 触发时重排字符网格,卸载时 cancelAnimationFrame 并断开 observer',
    ],
    deps: [],
    file: 'textures/letter-glitch.tsx',
    tags: ['底纹', '字符', 'Canvas', '赛博'],
    usage: `import { LetterGlitch } from "@/components/ui/letter-glitch";

export function Section() {
  return (
    <LetterGlitch className="flex min-h-screen items-center justify-center">
      <h2 className="text-6xl font-semibold text-white">躲在噪声之下</h2>
    </LetterGlitch>
  );
}`,
    previewClassName: 'p-0',
    preview: (
      <LetterGlitch className={fill}>
        <p className="text-xl font-semibold tracking-tight text-white @md:text-3xl @xl:text-5xl">
          躲进数字噪声
        </p>
      </LetterGlitch>
    ),
  },
];
