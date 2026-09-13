import { BookOpen, ChartNoAxesCombined, Clock3, Folder, History, Library, Moon, SlidersHorizontal, Terminal } from 'lucide-react';
import { type Chapter, ChapterScrubber } from '@/registry/components/navigation/chapter-scrubber';
import { ProgressSteps } from '@/registry/components/navigation/progress-steps';
import { SlidingTabs } from '@/registry/components/navigation/sliding-tabs';
import type { RegistryEntry } from '@/registry/types';
import { ScrollProgress } from "@/registry/components/navigation/scroll-progress";
import { AnchorToc } from "@/registry/components/navigation/anchor-toc";
import { CommandPalette } from "@/registry/components/navigation/command-palette";

/** 演示数据:一期设计播客的章节表 */
const PODCAST_CHAPTERS: Chapter[] = [
  {
    id: 'intro',
    title: '开场与本期主题',
    meta: '00:00',
    description: '从一张海报聊到整套排版系统,为什么值得聊一整期。',
  },
  {
    id: 'font',
    title: '字体决定气质',
    meta: '01:42',
    description: '同一版式换三种字体,气质完全不同。',
  },
  {
    id: 'grid',
    title: '排版网格的秘密',
    meta: '04:12',
    description: '12 栏网格如何让信息自然对齐。',
  },
  {
    id: 'space',
    title: '留白是设计的一部分',
    meta: '08:05',
    description: '空白不是浪费,是呼吸的节奏。',
  },
  {
    id: 'dark',
    title: '深色模式的设计陷阱',
    meta: '11:30',
    description: '纯黑背景上最容易翻车的三个细节。',
  },
  {
    id: 'leading',
    title: '字距与行高的平衡',
    meta: '15:10',
    description: '中文正文为什么需要更大的行距。',
  },
  {
    id: 'cjk',
    title: '中文排版的特殊性',
    meta: '18:45',
    description: '标点悬挂、避头尾与中西文混排间距。',
  },
  {
    id: 'case',
    title: '案例拆解:新闻首页',
    meta: '22:20',
    description: '信息密度最高的页面如何保持可读。',
  },
  {
    id: 'rhythm',
    title: '动效里的文字节奏',
    meta: '26:00',
    description: '文字入场动画的时长与错峰。',
  },
  {
    id: 'tools',
    title: '工具箱与字体授权',
    meta: '29:35',
    description: '可商用中文字体的选择清单。',
  },
  { id: 'qa', title: '听众问答', meta: '33:10', description: '关于屏幕适配与印刷排版的两问。' },
  { id: 'outro', title: '收尾与下期预告', meta: '37:40', description: '下期:色彩系统的从零到一。' },
];

export const NavigationEntries: RegistryEntry[] = [
  {
    slug: 'chapter-scrubber',
    title: '章节擦洗器',
    name: 'Chapter Scrubber',
    category: 'navigation',
    description: '垂直刻度轨道,悬停时指针周围泛起升余弦放大波,预览卡跟随光标逐章扫过。',
    designNotes: [
      '整条轨道只由两个共享 MotionValue 弹簧驱动、刻度行 memo 化,经 useTransform 直接写入宽度/透明度/厚度,无逐行状态:指针弹簧 stiffness 700、damping 52、mass 0.5,近临界阻尼、几乎零延迟跟随光标且从不过冲;强度弹簧 stiffness 260、damping 30、mass 0.6,更软,波形起落带呼吸感',
      '每根刻度为 2px 高圆角胶囊,行距 10px;抬升量 = 强度 × 升余弦波(与指针的行距 / 半径 4 行,波峰为 1、半径外为 0、两端斜率为零),刻度由静息 14px 伸长至峰值 56px,透明度 0.22(当前章节 0.55)升至 1,厚度 scaleY 1 → 1.4;当前章节刻度以 lime-300 强调色常亮',
      '预览卡宽 min(260px, 100cqw − 104px)、距轨道 76px(峰长 56 + 间距 20),rounded-2xl、1px 白 10% 边框、底色 #151617、内边距 16px × 14px;top 钳制在轨道上下界内,距视口边缘不足 288px 时自动翻向更宽敞一侧;出现时 scale 0.97 → 1、横向 6px 归位',
      '轨道为 role=listbox + roving tabindex(同一时刻仅一章可 Tab),↑↓←→ 逐章移动、Home/End 跳首尾,Enter/Space 走按钮原生点击触发 onSelect;aria-activedescendant 与 aria-selected 跟随活动项,焦点环 2px 白 60%',
      'prefers-reduced-motion 时绕过两个弹簧、直接写原始 MotionValue,保留空间波形,抬升与预览卡即时呈现',
    ],
    deps: ['motion'],
    file: 'navigation/chapter-scrubber.tsx',
    tags: ['导航', '章节', '悬停', '弹簧', '可访问性'],
    usage: `import { ChapterScrubber, type Chapter } from "@/components/ui/chapter-scrubber";

const chapters: Chapter[] = [
  { id: "intro", title: "开场", meta: "00:00", description: "主题与嘉宾介绍。" },
  { id: "grid", title: "排版网格的秘密", meta: "04:12", description: "12 栏网格如何让信息自然对齐。" },
  { id: "qa", title: "听众问答", meta: "33:10", description: "关于屏幕适配与印刷排版的两问。" },
];

export function PlayerChapters() {
  return (
    <ChapterScrubber
      chapters={chapters}
      currentIndex={1}
      onSelect={(chapter) => console.log("跳转章节", chapter.id)}
    />
  );
}`,
    preview: (
      <div className="flex h-full w-full items-center gap-5 @xl:gap-8">
        <ChapterScrubber chapters={PODCAST_CHAPTERS} currentIndex={3} />
        <div className="min-w-0 flex-1 border-l border-white/10 pl-5">
          <p className="font-mono text-[9px] tracking-[0.2em] text-zinc-500 @md:text-[10px]">
            DESIGN NOTES / 012
          </p>
          <h4 className="mt-4 text-xl font-medium tracking-tight text-white @md:text-3xl">
            留白之间
          </h4>
          <p className="mt-2 text-[10px] text-zinc-400 @md:text-xs">关于字体、秩序与阅读的节奏</p>
          <p className="mt-6 text-[9px] text-lime-300/80 @md:text-[11px]">划过左侧刻度,预览章节</p>
        </div>
      </div>
    ),
  },
  {
    slug: 'sliding-tabs',
    title: '滑动页签',
    name: 'Sliding Tabs',
    category: 'navigation',
    description: '浅色浮片在深色轨道中滑行,清楚标记当前位置,也保留面板中的输入状态。',
    designNotes: [
      '轨道为 #101314、12px 圆角、6px 内边距、1px 白色 10% 边框,并带 0 2px 5px 黑 33% 内阴影;每个标签最小高 40px、8px 圆角,标签间距 4px,水平内边距 12px(大舞台 20px)',
      '选中浮片 #dbe4d1 底色、#233020 文字、1px #ecf3e2 70% 边框、顶部 1px 白色内高光加 0 2px 5px 黑 25% 投影,铺满单个标签;未选中标签文字 zinc-400、悬停提亮到 zinc-200,禁用项 35% 透明度',
      '浮片换位为弹簧动画 stiffness 420、damping 34,初次挂载不播入场动画;prefers-reduced-motion 时 duration=0,切换瞬时到位',
      '浮片用 motion 共享 layoutId 布局动画在标签间滑行,无需手动测量位置;面板挂在轨道下方 12px(大舞台 16px),以 hidden 切换而非卸载,已填的表单状态在切页后保留',
      '完整 tablist / tab / tabpanel 语义,useId 为每个实例生成独立 id 对;roving tabindex 仅选中项可 Tab,←/→ 循环移动并跳过禁用项,Home/End 跳首尾;支持 value / defaultValue / onValueChange 受控与非受控双模式',
    ],
    deps: ['motion'],
    file: 'navigation/sliding-tabs.tsx',
    tags: ['页签', '导航', '弹簧', '面板', '键盘'],
    usage: `import { SlidingTabs, type SlidingTab } from "@/components/ui/sliding-tabs";

const tabs: SlidingTab[] = [
  { id: "overview", label: "概览", content: <p className="p-4 text-sm text-zinc-300">项目概览</p> },
  { id: "activity", label: "动态", content: <p className="p-4 text-sm text-zinc-300">最近的项目动态</p> },
  { id: "settings", label: "设置", content: <label className="block p-4 text-sm text-zinc-300"><input type="checkbox" defaultChecked /> 自动保存</label> },
];

export function ProjectTabs() {
  return <SlidingTabs label="项目视图" tabs={tabs} className="max-w-md" />;
}`,
    preview: (
      <SlidingTabs
        label="工作室视图"
        className="max-w-sm"
        tabs={[
          {
            id: 'overview',
            label: '概览',
            icon: <ChartNoAxesCombined className="size-3.5" />,
            content: (
              <div className="rounded-xl border border-white/10 bg-[#151a18] p-3 @md:p-5">
                <div className="flex items-center justify-between text-[9px]">
                  <span className="text-zinc-400">本周访问</span>
                  <span className="text-[#bed3ad]">+18.6%</span>
                </div>
                <p className="mt-2 font-mono text-2xl tracking-tight text-white @md:mt-3 @md:text-3xl">
                  24,680
                </p>
                <div aria-hidden className="mt-2 flex h-4 items-end gap-1.5 @md:mt-3 @md:h-6">
                  {[35, 55, 42, 65, 58, 80, 72, 95, 82, 100, 86, 98].map((height, index) => (
                    <span
                      key={index}
                      className="flex-1 rounded-t-sm bg-[#c3d8b1]/40 last:bg-[#c3d8b1]"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>
            ),
          },
          {
            id: 'activity',
            label: '动态',
            icon: <Clock3 className="size-3.5" />,
            content: (
              <div className="rounded-xl border border-white/10 bg-[#151a18] p-3 @md:p-5">
                <p className="text-[9px] text-zinc-400">今天,一切都在发生</p>
                <div className="mt-2 flex items-center justify-between border-b border-white/10 pb-2 text-xs text-zinc-200 @md:mt-3 @md:pb-3">
                  <span>品牌手册已更新</span>
                  <span className="font-mono text-[9px] text-zinc-500">14:32</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-zinc-200 @md:mt-3">
                  <span>新成员加入工作室</span>
                  <span className="font-mono text-[9px] text-zinc-500">10:18</span>
                </div>
              </div>
            ),
          },
          {
            id: 'settings',
            label: '设置',
            icon: <SlidersHorizontal className="size-3.5" />,
            content: (
              <div className="rounded-xl border border-white/10 bg-[#151a18] p-3 @md:p-5">
                <p className="text-xs text-zinc-200">让灵感被妥善保留</p>
                <p className="mt-2 text-[10px] text-zinc-400">切换页签后,选择依然保留。</p>
                <label className="mt-4 flex items-center gap-2 text-[10px] text-zinc-300">
                  <input type="checkbox" defaultChecked className="size-3.5 accent-[#c3d8b1]" />
                  自动保存工作进度
                </label>
              </div>
            ),
          },
        ]}
      />
    ),
  },
  {
    slug: 'progress-steps',
    title: '步骤导航',
    name: 'Progress Steps',
    category: 'navigation',
    description: '珠点与细线串联任务进度,把复杂流程拆成清晰、可返回的小步。',
    designNotes: [
      '底板为 #141719、16px 圆角、1px 白 10% 边框与顶部 1px 白 3% 内高光;步骤节点小舞台 24px、大舞台 32px,外侧 5px #141719 同色隔离环把连接线从数字后隔开;导航区上下内边距小舞台 12px / 8px、大舞台 24px / 16px',
      '已到达节点 #dce8cd 底色、#253220 数字,未来节点 #1b1f20 底色、白 12% 边框、zinc-500 数字;连接线为 1px 白 10%,已走过段以 #c2d5b9 从左向右 scaleX 0 → 1,350ms 到位',
      'prefers-reduced-motion 时连接线 duration=0 瞬时到位,节点变色用的 motion-safe:transition-colors(300ms)也一并停用',
      '连接线进度是 motion 的 transform scaleX 动画,不触发布局重排;每步面板以 hidden 切换而非卸载,表单状态保留;value / defaultValue / onValueChange 支持受控与非受控,index 钳制在 0 到 步数−1',
      '当前及之前的步骤可点击回跳,未来步骤禁用、只能靠「下一步」推进;第 1 步禁用返回(opacity 30%),最后一步显示 finalAction 插槽或「已到最后一步」(role=status);当前节点 aria-current=step,底部 sr-only 实时播报「第 N 步,共 M 步」,切换后焦点移到新步骤标题,焦点环 2px #c2d5b9 70%',
    ],
    deps: ['motion'],
    file: 'navigation/progress-steps.tsx',
    tags: ['步骤', '流程', '引导', '导航', '进度'],
    usage: `import { ProgressSteps, type ProgressStep } from "@/components/ui/progress-steps";

const steps: ProgressStep[] = [
  { id: "space", title: "工作空间", content: <label className="text-sm text-zinc-300">名称<input defaultValue="我的工作室" className="ml-3 rounded border border-white/20 bg-white/5 p-2" /></label> },
  { id: "style", title: "视觉语言", content: <p className="text-sm text-zinc-400">选择适合你的风格。</p> },
  { id: "ready", title: "准备就绪", content: <p className="text-sm text-zinc-400">一切就绪,可以开始创作。</p> },
];

export function SetupFlow() {
  return <ProgressSteps label="创建工作空间" steps={steps} className="max-w-md" />;
}`,
    preview: (
      <ProgressSteps
        label="创建工作空间"
        className="max-w-sm"
        steps={[
          {
            id: 'space',
            title: '工作空间',
            content: (
              <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                <Folder aria-hidden className="size-3.5 text-[#c2d5b9]" />
                <span>Studio / 我们的下一次创作</span>
              </div>
            ),
          },
          {
            id: 'style',
            title: '视觉语言',
            content: (
              <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                <span
                  aria-hidden
                  className="size-3 rounded-full border border-white/20 bg-[#1c2420]"
                />
                <span aria-hidden className="size-3 rounded-full bg-[#c2d5b9]" />
                <span>石墨与鼠尾草</span>
              </div>
            ),
          },
          {
            id: 'ready',
            title: '准备就绪',
            content: <p className="text-[10px] text-[#c2d5b9]">空间已准备好,下一步交给灵感。</p>,
          },
        ]}
      />
    ),
  },
  {
    slug: "scroll-progress",
    title: "阅读进度条",
    name: "Scroll Progress",
    category: "navigation",
    description: "一条贴着视口顶端的细线随滚动生长,读到哪里,光就走到哪里。",
    designNotes: [
      "fixed 变体贴视口顶部(inset-x-0、top-0、z-50),高度默认 2px,transform-origin 左侧;默认色荧光绿 #d7ff3c,color 可换",
      "进度用 scaleX(0→1) 写入 transform 而非 width,滚动全程不触发重排;进度源为 useScroll 的页面滚动进度",
      "宽度经弹簧平滑(stiffness 180、damping 30、mass 0.3),快速滚动带惯性感;variant=inline 时改为绝对定位于 positioned 祖先顶部,适配局部滚动容器",
      "组件整体 aria-hidden:页面位置语义由原生滚动与文档结构承担,进度条纯视觉装饰",
      "prefers-reduced-motion 时绕过弹簧,进度直接映射滚动位置(指示功能保留,无平滑动画)",
    ],
    deps: ["motion"],
    file: "navigation/scroll-progress.tsx",
    tags: ["滚动", "进度", "阅读", "文档"],
    usage: `import { ScrollProgress } from "@/components/ui/scroll-progress";

export function ArticleShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollProgress />
      <article className="mx-auto max-w-2xl">{children}</article>
    </>
  );
}`,
    preview: (
      <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-white/[0.06] bg-black/20">
        <ScrollProgress variant="inline" height={3} />
        <div className="space-y-3 p-5 pt-6">
          <div className="h-2.5 w-1/3 rounded bg-white/[0.10]" />
          <div className="h-2 w-full rounded bg-white/[0.05]" />
          <div className="h-2 w-11/12 rounded bg-white/[0.05]" />
          <div className="h-2 w-4/6 rounded bg-white/[0.05]" />
          <div className="h-2 w-5/6 rounded bg-white/[0.05]" />
        </div>
      </div>
    ),
  },
  {
    slug: "anchor-toc",
    title: "章节目录",
    name: "Anchor Toc",
    category: "navigation",
    description: "侧边目录与正文互为镜子:滚到哪一节,轨道上的指示条就在哪里点亮长高。",
    designNotes: [
      "每项 28px 高、13px 文本;左侧通栏 1px 白 8% 轨道,项指示条 2px 宽:非激活 12px 高白 12%,激活 24px 高 #d7ff3c,均 200ms 过渡",
      "激活项文本 zinc-200,非激活 zinc-500、悬停 zinc-300;激活态同步 aria-current",
      "IntersectionObserver 以 rootMargin -20% 0px -70% 0px 的横带判定当前章节,取文档顺序最靠上的可见标题;未命中前默认高亮第一项",
      "点击平滑滚动到目标标题,并 history.replaceState 更新 hash(不触发原生跳闪)",
      "prefers-reduced-motion 时滚动改为瞬时(behavior auto),指示条过渡关闭",
    ],
    deps: [],
    file: "navigation/anchor-toc.tsx",
    tags: ["目录", "锚点", "文档", "滚动"],
    usage: `import { AnchorToc } from "@/components/ui/anchor-toc";

const sections = [
  { id: "install", label: "安装" },
  { id: "usage", label: "用法" },
  { id: "api", label: "API 参考" },
];

export function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-5xl gap-10">
      <aside className="sticky top-24 hidden w-48 shrink-0 md:block">
        {/* 页面里需有对应 id 的标题,如 <h2 id="install"> */}
        <AnchorToc items={sections} />
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}`,
    preview: (
      <div className="w-44">
        <AnchorToc
          items={[
            { id: "toc-preview-install", label: "安装" },
            { id: "toc-preview-usage", label: "用法" },
            { id: "toc-preview-api", label: "API 参考" },
            { id: "toc-preview-faq", label: "常见问题" },
          ]}
        />
      </div>
    ),
  },
  {
    slug: "command-palette",
    title: "命令面板",
    name: "Command Palette",
    category: "navigation",
    description: "⌘K 唤起命令面板:输入即过滤,方向键选择、回车执行,像给站点装上终端。",
    designNotes: [
      "浮层 max-w-lg(32rem)、rounded-2xl(16px)、1px 白 12% 边框、#141412 底;遮罩黑 60% + 4px 背景模糊,200ms 淡入",
      "面板入场 scale 0.96→1 + y 8px→0 弹簧(stiffness 320、damping 30),退场 150ms 收缩淡出;列表最高 288px 内部滚动",
      "条目 44px 高、13px,激活项白 6% 底 + 行尾荧光绿 ↵;搜索行高 48px,esc 徽章 10px 等宽字体;匹配范围含 label 与隐藏 keywords",
      "⌘/Ctrl+K 全局开关(hotkey 可改),↑↓ 循环选择、回车执行并关闭、esc 或点遮罩关闭;listbox/option + aria-activedescendant 语义完备",
      "modal 展开时锁定背景滚动并自动聚焦输入框;variant=inline 为无遮罩嵌入变体(无全局快捷键、不锁滚动)",
      "prefers-reduced-motion 时弹簧与淡入改为 duration=0 直接切换",
    ],
    deps: ["motion", "lucide-react"],
    file: "navigation/command-palette.tsx",
    tags: ["⌘K", "命令面板", "搜索", "键盘"],
    usage: `import { BookOpen, Terminal } from "lucide-react";
import { CommandPalette } from "@/components/ui/command-palette";

export function SiteCommands() {
  return (
    <CommandPalette
      placeholder="搜索命令…"
      onSelect={(item) => console.log("run:", item.id)}
      commands={[
        { id: "copy-install", label: "复制安装命令", hint: "pnpm", icon: <Terminal className="size-3.5" />, keywords: "install cli" },
        { id: "open-guide", label: "打开接入指南", icon: <BookOpen className="size-3.5" />, keywords: "guide docs" },
      ]}
    />
  );
}`,
    preview: (
      <CommandPalette
        variant="inline"
        className="w-full max-w-md"
        commands={[
          { id: "copy-install", label: "复制安装命令", hint: "pnpm", icon: <Terminal className="size-3.5" />, keywords: "install cli" },
          { id: "open-guide", label: "打开接入指南", icon: <BookOpen className="size-3.5" />, keywords: "guide docs" },
          { id: "browse-registry", label: "浏览全部条目", hint: "65", icon: <Library className="size-3.5" />, keywords: "registry" },
          { id: "toggle-theme", label: "切换深浅主题", hint: "⌘⇧L", icon: <Moon className="size-3.5" />, keywords: "theme dark light" },
          { id: "changelog", label: "查看更新日志", icon: <History className="size-3.5" />, keywords: "release notes" },
        ]}
      />
    ),
  },
];
