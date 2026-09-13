import { Search } from 'lucide-react';
import { StreamingText } from '@/registry/components/agent/streaming-text';
import { ThinkingBlock } from '@/registry/components/agent/thinking-block';
import { ToolCallCard } from '@/registry/components/agent/tool-call-card';
import { TypingDots } from '@/registry/components/agent/typing-dots';
import { PromptBox } from '@/registry/components/agent/prompt-box';
import { UsageMeter } from '@/registry/components/agent/usage-meter';
import type { RegistryEntry } from '@/registry/types';

export const AgentEntries: RegistryEntry[] = [
  {
    slug: 'streaming-text',
    title: '流式文本',
    name: 'Streaming Text',
    category: 'agent',
    description: '文字像模型回答一样逐字流出,末尾一枚方块光标持续闪烁,写完即驻留。',
    designNotes: [
      '正文 15px、行高 1.8、text-zinc-200,支持任意多行(whitespace-pre-wrap);光标为 7px × 1.05em 的圆角方块,底色 currentColor,与文字间距 2px',
      '回放时每 tick 前进 1 个字素(Intl.Segmenter 切分,不拆开组合字符),默认间隔 24ms、下限 8ms;实时流模式(streaming)下追加内容立即渲染,不做逐字回放',
      '光标以 1s steps(1) 无限闪烁(0–55% 实、56–100% 隐),流式模式下常驻;追加接续播放,替换或清空文本会重置',
      '读屏播报走 sr-only 礼貌区:播放中每 900ms 增量更新一次,完成时整段播报,可见文字对读屏隐藏',
      'prefers-reduced-motion 时跳过逐字动画,整段立即呈现,光标静态常驻不闪烁,loop 不生效',
    ],
    deps: [],
    file: 'agent/streaming-text.tsx',
    tags: ['流式', 'AI', '打字', '光标', 'SSE'],
    usage: `import { useEffect, useState } from "react";
import { StreamingText } from "@/components/ui/streaming-text";

const ANSWER = "组件源码随词典分发,提示词会按条目自动组装。";

export function Reply() {
  // 真实场景:每收到一个 SSE 增量就 append;这里用定时器模拟
  const [text, setText] = useState("");

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      index += 2;
      setText(ANSWER.slice(0, index));
      if (index >= ANSWER.length) clearInterval(timer);
    }, 60);
    return () => clearInterval(timer);
  }, []);

  return <StreamingText text={text} streaming />;
}`,
    preview: (
      <StreamingText
        text="检索完成:该组件暴露六个条目,其中流式文本负责把增量渲染成回答。"
        loop
        className="w-full max-w-md"
      />
    ),
  },
  {
    slug: 'thinking-block',
    title: '思考折叠块',
    name: 'Thinking Block',
    category: 'agent',
    description: '推理过程折叠在一行标头里,思考时圆点呼吸并计时,展开收起带高度弹簧。',
    designNotes: [
      '标头为 12px zinc-500 文本、32px 高点击区,左侧通栏 1px 白 10% 竖线,标头与内容统一左缩进 16px',
      '状态圆点 6px:思考中以 1.6s ease-in-out 呼吸(scale 0.7↔1.15、透明度 0.35↔0.9)并逐秒计时,结束后定格白 25%、显示「思考了 N 秒」',
      '展开高度 0↔auto 弹簧(stiffness 260、damping 30),内容透明度同步淡入;箭头 200ms 旋转 90°',
      '内容 13px、宽松行高、zinc-400;按钮携带 aria-expanded / aria-controls,内容区 id 关联',
      'prefers-reduced-motion 时弹簧 duration=0 直接切换,呼吸动画关闭、圆点定格',
    ],
    deps: ['motion', 'lucide-react'],
    file: 'agent/thinking-block.tsx',
    tags: ['AI', '思考', '折叠', '推理'],
    usage: `import { ThinkingBlock } from "@/components/ui/thinking-block";

export function Reasoning() {
  return (
    <ThinkingBlock duration={4}>
      用户在问部署方式。先查 README 的 Docker 小节,再对比裸机部署的差异,
      结论:默认推荐 Docker Compose,单机三分钟可跑通。
    </ThinkingBlock>
  );
}`,
    preview: (
      <div className="w-full max-w-md space-y-3 py-2">
        <ThinkingBlock thinking defaultOpen>
          正在通读 registry 的类型定义,确认条目字段与提示词的组装顺序……
        </ThinkingBlock>
        <ThinkingBlock duration={4}>已确认字段顺序:描述 → 设计要点 → 用法。</ThinkingBlock>
      </div>
    ),
  },
  {
    slug: 'tool-call-card',
    title: '工具调用卡',
    name: 'Tool Call Card',
    category: 'agent',
    description: '工具调用浓缩成一行状态卡:参数收起、结果可展开,状态从旋转环走到对勾。',
    designNotes: [
      '卡片 rounded-lg(8px)、1px 白 8% 边框、白 2% 底;标头行 36px 高、内边距 8px 12px,工具名 13px 等宽字体',
      '状态图标 14px:running 为 1.5px 边框旋转环 0.8s linear infinite;success 对勾 #d7ff3c、error 叉 #ff7a6b,状态文字走 sr-only 播报',
      '展开用 grid-template-rows 0fr↔1fr 240ms ease 过渡,内容顶部 1px 白 5% 分隔线,结果文本 12px zinc-400',
      '箭头 200ms 旋转 90°;无 children 时不渲染展开结构,标头退化为纯展示行',
      'prefers-reduced-motion 时旋转环静止(motion-reduce:animate-none)、全部过渡关闭(motion-reduce:transition-none)',
    ],
    deps: ['lucide-react'],
    file: 'agent/tool-call-card.tsx',
    tags: ['AI', '工具调用', '状态', '折叠', 'Agent'],
    usage: `import { ToolCallCard } from "@/components/ui/tool-call-card";

export function SearchStep() {
  return (
    <ToolCallCard tool="web_search" summary="registry manifest 安装方式" status="success">
      命中 3 条结果,已读取前 2 条:官方文档与安装指南。
    </ToolCallCard>
  );
}`,
    preview: (
      <div className="w-full max-w-md space-y-2">
        <ToolCallCard tool="web_search" summary="组件词典 部署" status="running" />
        <ToolCallCard tool="read_file" summary="src/registry/types.ts" status="success" defaultOpen>
          已读取 58 行:CategoryId 联合类型与 RegistryEntry 完整字段定义。
        </ToolCallCard>
      </div>
    ),
  },
  {
    slug: 'typing-dots',
    title: '输入中指示',
    name: 'Typing Dots',
    category: 'agent',
    description: '三枚圆点依次起伏,表示对方正在组织语言,比一句「请稍等」安静得多。',
    designNotes: [
      '三枚 6px 圆点、间距 4px,颜色继承文字色(currentColor),缺省 text-zinc-300,直径可用 size 调整',
      '呼吸动画 1.2s ease-in-out 无限循环,三枚依次延迟 150ms:scale 0.65↔1、透明度 0.3↔1',
      '纯 CSS 动画零 JS 开销,无客户端运行时;role=status + aria-label=「正在输入」,圆点对读屏隐藏',
      'prefers-reduced-motion 时不启动动画,三枚圆点静态常亮',
    ],
    deps: [],
    file: 'agent/typing-dots.tsx',
    tags: ['AI', '聊天', '等待', '纯 CSS'],
    usage: `import { TypingDots } from "@/components/ui/typing-dots";

export function Waiting() {
  return (
    <p className="flex items-center gap-2 text-sm text-zinc-400">
      对方正在输入
      <TypingDots />
    </p>
  );
}`,
    preview: (
      <div className="flex items-center gap-3 text-sm text-zinc-300">
        <span>正在组织语言</span>
        <TypingDots />
      </div>
    ),
  },
  {
    slug: 'prompt-box',
    title: '提示输入框',
    name: 'Prompt Box',
    category: 'agent',
    description: '对话输入框随内容长高,回车发送、Shift+回车换行,可发送时发送键点亮成荧光绿。',
    designNotes: [
      '容器 rounded-2xl(16px)、1px 白 10% 边框、白 2% 底、内边距 12px;focus-within 时边框升至白 25%,外扩 3px rgba(215,255,60,0.08) 光环,150ms 过渡',
      'textarea 透明无边框、14px、行高 24px,高度随内容自动生长,到 maxRows(默认 5 行 = 120px)后内部滚动',
      '发送键 32px 圆形:可发送时 #d7ff3c 底黑色图标,否则白 8% 底 zinc-500 图标,150ms 颜色过渡;发送中显示旋转环并整体禁用',
      'Enter 发送、Shift+Enter 换行;IME 组合输入(如中文拼音)期间回车不触发发送;发送后自动清空',
      'prefers-reduced-motion 时颜色与光环直接切换,旋转环静止',
    ],
    deps: ['lucide-react'],
    file: 'agent/prompt-box.tsx',
    tags: ['AI', '输入', '对话', '聊天'],
    usage: `import { PromptBox } from "@/components/ui/prompt-box";

export function Composer() {
  return (
    <PromptBox
      placeholder="问问这个组件怎么集成…"
      onSubmit={(text) => console.log("send:", text)}
    />
  );
}`,
    preview: <PromptBox placeholder="问问这个组件怎么集成…" className="w-full max-w-md" />,
  },
  {
    slug: 'usage-meter',
    title: '用量条',
    name: 'Usage Meter',
    category: 'agent',
    description: '配额消耗是一条会变色的细线:越过 70% 转琥珀、越过 90% 转红,数字同步读数。',
    designNotes: [
      '轨道高 6px、全圆角、白 6% 底;填充色三段:<70% 荧光绿 #d7ff3c、70–90% 琥珀 #fbbf24、≥90% 珊瑚红 #ff7a6b,并带 10px 同色 33% 辉光',
      '宽度变化 700ms cubic-bezier(0.22,1,0.36,1) 过渡;数值行 12px 等宽 tabular-nums,格式 used / limit,小数位可用 precision 调整',
      'role=meter 携带 aria-valuenow/min/max(0–100 百分比);limit ≤ 0 时按 0% 处理,比值钳制在 0–100%',
      '纯 CSS 过渡、无客户端运行时;label 与数值行可分别隐藏',
      'prefers-reduced-motion 时宽度直接跳变(motion-reduce:transition-none)',
    ],
    deps: [],
    file: 'agent/usage-meter.tsx',
    tags: ['配额', '用量', '仪表盘', '进度'],
    usage: `import { UsageMeter } from "@/components/ui/usage-meter";

export function Quotas() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <UsageMeter label="本月 token" used={184_000} limit={500_000} />
      <UsageMeter label="API 调用" used={9120} limit={10_000} />
    </div>
  );
}`,
    preview: (
      <div className="w-full max-w-sm space-y-4 py-2">
        <UsageMeter label="本月 token" used={210000} limit={500000} />
        <UsageMeter label="API 调用" used={7600} limit={10000} />
        <UsageMeter label="并发会话" used={47} limit={50} />
      </div>
    ),
  },
];
