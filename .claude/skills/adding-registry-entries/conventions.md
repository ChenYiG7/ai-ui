# 词典条目写作约定(判断型标准)

机械规则(slug 格式、deps 白名单、导入路径、唯一性)由 `pnpm registry:check` 强制,这里只写**脚本判不了的质量标准**。范例:`src/registry/entries/cards.tsx` 的 spotlight-card。

记住一个背景:`description`、`designNotes`、`usage` 会被 `src/lib/prompt.ts` 原样组装成完整提示词,读者的 AI 会把它们当规格逐条执行——写成规格,不是写成介绍。

## 字段逐个说

**slug / title / name** — slug 是 URL 与 API 路径,定了不改;title 中文展示名;name 带空格英文名(`Tilt Card`)。

**description**(一句话)——写「体感行为」,不写实现。
- ✅ `一束柔光跟随鼠标在卡片表面游走,同时点亮靠近指针的那段边框。`
- ❌ `一个使用 motion 的卡片组件,有光斑效果。`(复述实现,无体感)

**designNotes**(≥3 条,声明「改造时应保留」)——每条 = 具体数值 + 行为:
- 几何:尺寸、圆角、边框宽度与透明度、内边距(`rounded-2xl、1px 白色 10% 边框、内边距 32px`);
- 动效:时长、缓动、弹簧参数(`stiffness 200、damping 20、mass 0.4`)、位移与透明度幅度;
- 颜色:精确色值或透明度(`品牌色 16% 透明度,70% 处完全透明`);
- 必须恰有一条 `prefers-reduced-motion` / 禁用态降级;
- 性能约定单列一条(`MotionValue 直接写入渐变,不触发重渲染`、`纯 CSS 动画`)。

**deps** — 只允许 `motion` / `lucide-react`;`clsx`、`tailwind-merge` 默认有,不声明。

**usage** — 面向**读者项目**的完整可运行示例:
```ts
import { ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button"; // 路径恒为 @/components/ui/<slug>

export function Cta() {
  return (
    <MagneticButton onClick={() => console.log("clicked")}>
      开始使用
      <ArrowRight className="size-4" />
    </MagneticButton>
  );
}
```
`cn` 来自 `@/lib/utils`;命名导出函数;它会被读者整段复制。

**tags** — 2–5 个,中文为主,通用词可用英文(CTA / Toast / Hero / 3D)。

**preview**(恒暗展台 `#171512` 里渲染)——
- 文字:`text-white` 标题、`text-zinc-400` 说明;强调用荧光绿系 `rgba(215,255,60,*)` 或组件自带主色;**不要**把站点的暖纸/朱砂带进展台;
- 尺寸:`w-full max-w-sm` ~ `max-w-md`,或定宽 `w-72` / `w-80`;高度别超过展台可视区;
- 展示变体时并排:`<div className="flex flex-wrap items-center justify-center gap-4">`;
- `previewClassName`:只有全幅类(铺满展台的 meteors / dot-grid / marquee)才去内边距,普通组件保持展台 `p-6`。

## 分类语义边界

卡片=信息容器;按钮=触发动作;文字动效=内容显现;特效=页面节律;背景=氛围层;输入=调节手感;反馈=操作回应。条目与分类语义不符时,新增分类优于硬塞(流程见 SKILL.md)。

## 组件实现硬知识(Tailwind v4 / React 19)

- **不要把变量插值进 className 的动画工具类**(Tailwind 扫描器看不到)→ 用字面量类名,再内联 `style={{ animationDuration: ... }}` 覆盖细节;
- 组件私有 keyframes 用内联 `<style href="<slug>-keyframes" precedence="medium">`,不污染全局 CSS;
- 有 hooks / motion 才加 `"use client"`,纯 CSS 静态组件不加;
- 指针跟随类动效走 `MotionValue` + `useSpring`(motion),禁止 setState 逐帧;
- 中文 props JSDoc + 组件头注释,与现有组件一致。
