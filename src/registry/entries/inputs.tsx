import { AudioLines, Bell, Layers3, PenTool, Zap } from 'lucide-react';
import { ChoiceCards } from '@/registry/components/inputs/choice-cards';
import { ComparisonSlider } from '@/registry/components/inputs/comparison-slider';
import { ElasticSlider } from '@/registry/components/inputs/elastic-slider';
import { RotaryDial } from '@/registry/components/inputs/rotary-dial';
import { SoftSwitch } from '@/registry/components/inputs/soft-switch';
import { TierSlider } from '@/registry/components/inputs/tier-slider';
import type { RegistryEntry } from '@/registry/types';
import { OtpInput } from "@/registry/components/inputs/otp-input";
import { TagInput } from "@/registry/components/inputs/tag-input";

export const inputEntries: RegistryEntry[] = [
  {
    slug: 'soft-switch',
    title: '柔光开关',
    name: 'Soft Switch',
    category: 'inputs',
    description: '金属拨钮沿凹槽轻滑,柔和绿光回应状态,让设置页也有细腻触感。',
    designNotes: [
      '容器 #151719 底色、16px 圆角、1px 白色 10% 边框,内边距从小舞台 16px 过渡到大舞台 20px',
      '轨道 56×32px,22px 拨钮用 #f0f1ee 到 #aaaeab 的垂直渐变和 1px 内高光模拟金属;开启后横向移动 24px',
      '开启轨道为 emerald-200 的 20% 填充、25% 边框与 20px 外柔光;状态过渡 300ms,位移曲线 cubic-bezier(0.22,1,0.36,1)',
      '使用原生 checkbox 与 role=switch,支持空格、整行点击、name 表单提交,以及 checked / defaultChecked 两种状态模式',
      'disabled 时整体透明度 45%,焦点环 2px;prefers-reduced-motion 下取消 300ms 过渡,状态立即到位',
    ],
    deps: [],
    file: 'inputs/soft-switch.tsx',
    tags: ['开关', '设置', '表单', '柔光', '无障碍'],
    usage: `import { Bell } from "lucide-react";
import { SoftSwitch } from "@/components/ui/soft-switch";

export function NotificationSetting() {
  return (
    <SoftSwitch label="桌面通知" description="只在重要时刻提醒你"
      name="notifications" defaultChecked icon={<Bell className="size-4" />}
      className="max-w-sm" />
  );
}`,
    preview: (
      <div className="w-full max-w-sm space-y-2.5 @md:space-y-3">
        <SoftSwitch
          label="专注音景"
          description="把环境留在背景里"
          defaultChecked
          icon={<AudioLines className="size-4" />}
        />
        <SoftSwitch
          label="轻声提醒"
          description="只为重要的事打断"
          icon={<Bell className="size-4" />}
        />
      </div>
    ),
    previewClassName: 'px-4 pb-3 pt-11 @md:p-8',
  },
  {
    slug: 'tier-slider',
    title: '档位滑杆',
    name: 'Tier Slider',
    category: 'inputs',
    description: '渐变光随拖动流动、松手吸附档位的强度滑杆,拉满后进入呼吸发光。',
    designNotes: [
      '档位吸附:拖动中数值连续,松手按 Math.round(v / (100 / (档数 - 1))) 吸附到最近档位;方向键每次移动一档,Home / End 直达首尾',
      '填充色由 5 段 HSL 插值得出,从石墨灰蓝、靛蓝、电光紫、品红到熔金橙渐次绚烂;跨 0° 相位时给终点补 360° 再插值',
      '填充为 90deg 线性渐变,起点取更朴素的中间色;background-size 锁定为滑块像素位置防止渐变被拉伸;档位高于 60% 后叠加同色光晕',
      '最高档触发满档呼吸:填充、滑块、等级词同步进入 2.8s 无限循环呼吸;16 颗星光粒子用固定种子伪随机分布,随强度变亮',
      '位置更新在 rAF 循环中以 0.18 系数向目标值缓动;CSS 动画全部包在 prefers-reduced-motion: no-preference 内,reduce 时 JS 缓动直接跳到目标值;role=slider 并以 aria-valuetext 播报档位名',
    ],
    deps: [],
    file: 'inputs/tier-slider.tsx',
    tags: ['滑杆', '档位', '发光', '表单', '交互'],
    usage: `import { Zap } from "lucide-react";
import { TierSlider } from "@/components/ui/tier-slider";

export function PowerControl() {
  return (
    <TierSlider
      label="5.6 Sol"
      levels={["关闭", "轻柔", "均衡", "强劲", "极致"]}
      defaultIndex={2}
      icon={<Zap className="size-5" />}
      onChange={(index) => console.log("当前档位", index)}
    />
  );
}`,
    preview: (
      <TierSlider
        label="5.6 Sol"
        levels={['关闭', '轻柔', '均衡', '强劲', '极致']}
        defaultIndex={2}
        icon={<Zap className="size-5" />}
      />
    ),
  },
  {
    slug: 'rotary-dial',
    title: '刻度旋钮',
    name: 'Rotary Dial',
    category: 'inputs',
    description: '拉丝金属旋钮与细密刻度,把音量、强度这类参数调节变成模拟设备的手感。',
    designNotes: [
      '旋钮盘 128px(@md 起 176px),41 根刻度沿 -135° 到 135° 的 270° 圆弧分布,每 5 格为 10px 长刻度、其余 6px;点亮刻度 #d0dfbf 叠 5px #c4d4bd45 光晕,未点亮 white/15',
      '金属外圈为 from 30deg 锥形渐变(#555955→#202322→#454944→#1c201e→#62665e),内盘 #414640→#1a1e1b 径向渐变;指针 #e0efcb 叠 8px #d5f4a980 柔光,读数为 #e0e7d7 等宽数字',
      '竖直拖动 160px 映射整个 min→max 区间并按 step 吸附;方向键每次增减 1 步,Home / End 直达边界;支持 value 受控与 defaultValue 非受控,name 经隐藏 input 提交表单',
      'role=slider 完整播报 aria-valuemin / max / now 与 aria-valuetext(数值+单位)、aria-orientation=vertical;刻度坐标保留 4 位小数避免 SSR 水合偏差;焦点环 2px #c4d4bd 70%、偏移 4px',
      '键盘调节时旋钮以 150ms 过渡旋转,拖动中立即跟手;prefers-reduced-motion 下(motion-safe: 前缀)取消过渡直接定位;disabled 时整体透明度 45%、tabIndex=-1 并忽略指针与键盘操作',
    ],
    deps: [],
    file: 'inputs/rotary-dial.tsx',
    tags: ['旋钮', '音量', '参数', '拟物', '键盘'],
    usage: `import { RotaryDial } from "@/components/ui/rotary-dial";

export function GainControl() {
  return (
    <RotaryDial
      label="输出增益"
      min={-24}
      max={12}
      step={0.5}
      defaultValue={-6}
      unit="dB"
      name="gain"
    />
  );
}`,
    preview: (
      <div className="flex w-full max-w-xs flex-col items-center">
        <RotaryDial
          label="输出增益 / OUTPUT"
          min={-24}
          max={12}
          step={0.5}
          defaultValue={-6}
          unit="dB"
        />
        <p className="mt-3 text-[9px] tracking-wide text-zinc-500 @md:mt-5">
          上下拖动,找回旋钮的手感
        </p>
      </div>
    ),
    previewClassName: 'p-3 @md:p-8',
  },
  {
    slug: 'elastic-slider',
    title: '弹性滑杆',
    name: 'Elastic Slider',
    category: 'inputs',
    description: '拖到端点继续拖,整条轨道被拉弯、端点被拽出,松手后弹簧拉回原位。',
    designNotes: [
      'SVG viewBox 320×88、轨道两端各留 40px;完整轨道与填充共用同一条 5px 圆头二次贝塞尔曲线,填充用 pathLength=1 + strokeDasharray 按当前值截断,渐变 #7dd3fc→#a5b4fc(userSpaceOnUse 防止水平直线零高度时渐变消失),底轨白色 12%',
      '过冲量由 motion 弹簧驱动(stiffness 240、damping 12、mass 0.7):拖出端点时目标设为 ±30% 轨道宽,松手归零、轨道弹回直线;整条形变由单个 bend 值推导,弹簧每次变化统一触发一次重绘',
      '过冲时只有拖动端延伸、另一端保持锚定,贝塞尔控制点最多上抬 33px(110×0.3);拖动中滑块半径 6.5px→8px、外圈 11px→14px,数值文本固定在滑块上方 20px',
      'role=slider 播报 0–100 数值;方向键每次 ±5、Home / End 直达两端并触发 onChange;指针用 pointer capture,取消或丢失捕获即结束拖动;焦点环 2px sky-200 60%',
      'prefers-reduced-motion 下(useReducedMotion)过冲恒为 0、轨道保持直线,滑块不随拖动放大,键盘操作立即到位',
    ],
    deps: ['motion'],
    file: 'inputs/elastic-slider.tsx',
    tags: ['滑杆', '弹性', 'SVG', '表单', '交互'],
    usage: `import { ElasticSlider } from "@/components/ui/elastic-slider";

export function TensionControl() {
  return (
    <ElasticSlider
      label="张力"
      defaultValue={40}
      onChange={(value) => console.log("张力", value)}
    />
  );
}`,
    preview: (
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#111214] p-5 @md:p-7">
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-300">弹性张力</span>
          <span className="font-mono text-[9px] tracking-[0.16em] text-zinc-500">TENSION</span>
        </div>
        <ElasticSlider label="弹性张力" defaultValue={55} className="mx-auto my-2" />
        <p className="text-center text-[10px] text-zinc-500">在端点处继续拖动,松手回弹</p>
      </div>
    ),
  },
  {
    slug: 'choice-cards',
    title: '方案选择卡',
    name: 'Choice Cards',
    category: 'inputs',
    description: '把单选项变成有层次的方案卡,选中时边缘与底色一起回应。',
    designNotes: [
      '卡片 12px 圆角、纵向间距 8px,#141618 底 + 1px white/10 边框 + inset 0 1px 0 #ffffff05 顶部高光;小舞台内边距 14×12px,@md 加深到 16px',
      '选中卡底色 #1c2420、边框 #c4d4bd 45%;16px 单选圆点反转为 #c4d4bd 实心底 + 6px #1a241c 内点;badge 为 #c4d4bd 20% 边框、8% 底的 8px 小签',
      '图标容器 32px、8px 圆角,标题 12px(@md 14px),描述 10px(@md 12px),meta 用等宽数字右对齐;图标与圆点 shrink-0,文本列 min-w-0 防长词溢出',
      '原生 radio + fieldset / legend:每组以 name(未传则 useId 生成)保持单选,方向键循环、表单提交均为浏览器默认行为,同屏多实例互不串组',
      '选中配色 200ms transition-colors 切换,prefers-reduced-motion 下(motion-safe: 前缀)立即切换;单项 disabled 透明度 40%、整组禁用(fieldset)透明度 50%;焦点环 2px #d6e6ce',
    ],
    deps: [],
    file: 'inputs/choice-cards.tsx',
    tags: ['单选', '定价', '方案', '表单', '设置'],
    usage: `import { ChoiceCards, type ChoiceOption } from "@/components/ui/choice-cards";

const plans: ChoiceOption[] = [
  { value: "solo", label: "独立创作", description: "适合个人项目", meta: "¥0" },
  { value: "studio", label: "工作室", description: "适合团队协作", meta: "¥49", badge: "推荐" },
];

export function PlanPicker() {
  return (
    <ChoiceCards
      label="选择方案"
      options={plans}
      name="plan"
      defaultValue="studio"
      className="max-w-md"
    />
  );
}`,
    preview: (
      <ChoiceCards
        label="选择你的创作空间"
        defaultValue="studio"
        className="max-w-sm"
        options={[
          {
            value: 'solo',
            label: '独立创作',
            description: '留给专注的空间',
            meta: '¥0',
            icon: <PenTool className="size-3.5" />,
          },
          {
            value: 'studio',
            label: '工作室',
            description: '协作,让想法发生',
            meta: '¥49',
            badge: '推荐',
            icon: <Layers3 className="size-3.5" />,
          },
        ]}
      />
    ),
    previewClassName: 'px-4 pb-3 pt-11 @md:p-8',
  },
  {
    slug: 'comparison-slider',
    title: '前后对比',
    name: 'Comparison Slider',
    category: 'inputs',
    description: '拖动一条光洁的分界线,在同一画布上比较原稿与成品。',
    designNotes: [
      '舞台 aspect-[4/3]、16px 圆角、1px white/15 边框、#16191c 底;两个内容层均以 absolute inset-0 按 100% 重叠,前层用 clip-path inset 裁切,拖动时内容不被压缩',
      '分界线为 1px white/85 竖线叠 12px #0004 投影;手柄是 32×44px 磨砂胶囊(#ebedeb 90% 底、white/60 边框、backdrop-blur),内含 2 根 12×1px 抓握线,键盘聚焦时外扩 4px white/20 环',
      '只跟踪 1 个主指针并用 pointer capture,touch-pan-y 保留页面纵向滚动;左上 / 右上角标(黑 35% 底 + backdrop-blur)在分割位置 <15% / >85% 时自动隐藏让位',
      'role=slider 播报「beforeLabel X%,afterLabel Y%」;方向键每次 ±1%、Shift+方向键 ±10%、Home / End 直达两端;默认 50%、范围 0–100%,数值取整',
      '内容层加 inert 属性禁用内部交互,防止被裁切的控件被误聚焦;分割比例即时跟手、无自动动画,prefers-reduced-motion 下行为完全一致',
    ],
    deps: [],
    file: 'inputs/comparison-slider.tsx',
    tags: ['对比', '图片', '拖动', '作品集', '修图'],
    usage: `import { ComparisonSlider } from "@/components/ui/comparison-slider";

export function DesignComparison() {
  return (
    <ComparisonSlider
      className="max-w-xl"
      beforeLabel="原稿"
      afterLabel="成品"
      before={<div className="grid h-full place-items-center bg-zinc-800 text-3xl text-zinc-400">FORM</div>}
      after={<div className="grid h-full place-items-center bg-[#283b32] text-3xl tracking-[0.3em] text-[#d3e5bb]">FORM</div>}
    />
  );
}`,
    preview: (
      <ComparisonSlider
        className="max-w-md"
        beforeLabel="原始光线"
        afterLabel="苔绿调色"
        label="静物调色对比"
        before={
          <div className="relative h-full overflow-hidden bg-[radial-gradient(ellipse_at_60%_10%,#43484e,#1c2025_70%)]">
            <div
              aria-hidden
              className="absolute left-1/2 top-[20%] aspect-square w-[44%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_33%_24%,#9aa1a8_0%,#5b636b_38%,#232a30_72%,#0d1115_92%)] shadow-[16px_30px_22px_-14px_#000a]"
            />
            <div className="absolute bottom-5 left-5">
              <p className="font-mono text-[8px] tracking-[0.24em] text-white/40">
                STILL LIFE / 008
              </p>
              <p className="mt-2 text-xl font-light tracking-[0.12em] text-white/70 @md:text-2xl">
                静物习作
              </p>
            </div>
          </div>
        }
        after={
          <div className="relative h-full overflow-hidden bg-[radial-gradient(ellipse_at_60%_10%,#3d4a35,#1d261b_65%,#121710_90%)]">
            <div
              aria-hidden
              className="absolute left-1/2 top-[20%] aspect-square w-[44%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_33%_24%,#e4f3c0_0%,#b7d489_30%,#5c7a44_60%,#1c2617_88%)] shadow-[16px_30px_22px_-14px_#05070399]"
            />
            <div className="absolute bottom-5 left-5">
              <p className="font-mono text-[8px] tracking-[0.24em] text-[#d5f4a9]/60">
                STILL LIFE / 008
              </p>
              <p className="mt-2 text-xl font-light tracking-[0.12em] text-[#e6f4cf] @md:text-2xl">
                静物习作
              </p>
            </div>
          </div>
        }
      />
    ),
    previewClassName: 'px-3 pb-3 pt-11 @md:p-8',
  },
  {
    slug: "otp-input",
    title: "验证码输入",
    name: "OTP Input",
    category: "inputs",
    description: "六个格子一位一格:键入自动前进、粘贴自动铺开,填满即提交。",
    designNotes: [
      "单元格 44×44px、8px 圆角、白 4% 底;聚焦格荧光绿 70% 边框 + 3px 10% 光环,已填格边框白 14%,颜色过渡 150ms",
      "聚焦空格中央为 1.5×18px 荧光绿光标条,1.1s steps(1) 闪烁(0–55% 亮、56–100% 灭);原生 caret 以 caret-transparent 隐藏",
      "键入自动前进,Backspace 空格回退并清上一格,←→ 移动焦点,聚焦自动全选;粘贴取数字序列从当前格铺开、焦点落在最后一格;全部填满仅触发一次 onComplete",
      "每格独立 input(inputMode=numeric,首格 autoComplete=one-time-code),aria-label「第 N 位」逐格播报",
      "prefers-reduced-motion 时光标条常亮不闪烁,颜色过渡关闭",
    ],
    deps: [],
    file: "inputs/otp-input.tsx",
    tags: ["输入", "验证码", "OTP", "键盘"],
    usage: `import { OtpInput } from "@/components/ui/otp-input";

export function VerifyStep() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-zinc-400">输入邮件中的 6 位验证码</p>
      <OtpInput length={6} onComplete={(code) => console.log("自动提交:", code)} />
    </div>
  );
}`,
    preview: (
      <div className="flex w-full max-w-md flex-col items-start gap-3">
        <p className="text-xs text-zinc-500">输入邮件中的 6 位验证码</p>
        <OtpInput length={6} defaultValue="2046" />
      </div>
    ),
  },
  {
    slug: "tag-input",
    title: "标签输入",
    name: "Tag Input",
    category: "inputs",
    description: "回车落签、退格收回:把一行输入变成一把可删的标签。",
    designNotes: [
      "容器 min-h 44px、11px 圆角、白 4% 底,签 28px 高、6px 圆角、白 6% 底带白 8% 边框;草稿输入框宽度由镜像 span 同字号实测,中英文同等精确、随打随长",
      "回车(IME 守卫)/中英逗号/顿号/分号即时成签,失焦自动提交草稿;空草稿 Backspace 删末位签;粘贴按分隔符拆分批量入签,尾段留作草稿",
      "空串与重复静默忽略(播报「已存在」),max 满后输入框禁用、占位换为「最多 N 个」;每次增删经 sr-only status 播报「已添加/移除 xx,共 N 个」",
      "× 为真实 button(aria-label 含标签名,键盘可逐个移除);容器 focus-within 边框提亮至白 22% + 3px 荧光绿 8% 光环,150ms 过渡",
      "prefers-reduced-motion 时容器与 × 的颜色过渡关闭(无位移动画)",
    ],
    deps: ["lucide-react"],
    file: "inputs/tag-input.tsx",
    tags: ["输入", "标签", "多值", "键盘"],
    usage: `import { useState } from "react";
import { TagInput } from "@/components/ui/tag-input";

export function TopicPicker() {
  const [topics, setTopics] = useState<string[]>(["设计系统"]);
  return (
    <TagInput
      tags={topics}
      onTagsChange={setTopics}
      placeholder="输入感兴趣的话题"
      max={8}
    />
  );
}`,
    preview: (
      <div className="w-full max-w-md">
        <TagInput defaultTags={["排版", "栅格系统", "留白"]} max={6} />
        <p className="mt-3 text-[11px] text-zinc-500">试试粘贴「对比,节奏,字重」</p>
      </div>
    ),
  },
];
