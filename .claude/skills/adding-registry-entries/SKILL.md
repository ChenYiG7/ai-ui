---
name: adding-registry-entries
description: Use when adding or modifying anything under src/registry — new component entries (加组件/加条目), new categories (新增分类), porting from .reference/ (移植组件), or when pnpm registry:check / registry tests report schema or convention errors (校验失败/测试挂/约定错误).
---

# adding-registry-entries

## Overview

词典内容工作流唯一入口。原则:**机械部分交给脚本,人/AI 只做判断**(实现组件、写文案、定参数)。不要靠通读 `entries/*.tsx` 逆向约定——本 skill 与 conventions.md 就是权威,单个已有条目只当范例看。

## 快速参考

| 任务 | 命令 |
|---|---|
| 加条目骨架 | `pnpm registry:new <slug> --category <cat> [--title 中文名] [--name 英文名]` |
| 移植参考组件 | 同上 + `--copy-from .reference/src/registry/components/<cat>/<file>.tsx` |
| 秒级校验 | `pnpm registry:check`(PostToolUse 钩子在 registry 写入后自动跑) |
| 总览现有条目 | `pnpm registry:digest`(不要通读 entries 文件) |
| 收尾验证 | `pnpm test`;改动面大再 `pnpm verify` |

## 流程(三步)

1. `registry:new` 生成骨架(自动完成:组件文件、entries 追加、index.ts 接线);
2. 判断型工作:实现组件;填掉全部 TODO——写法与质量标准见 **[conventions.md](conventions.md)**;
3. `pnpm registry:check` 干净通过(无 ⚠),再 `pnpm test`。

## 新增分类(先于条目)

1. `src/registry/types.ts` 的 `CategoryId` 加 `| "<id>"`;
2. `src/registry/categories.ts` 加一行 `{ id, label 中文名, code 大写码, description 一句话 }`;
3. 之后照常 `registry:new`——它会发现 entries 文件不存在并自动创建、接线 index.ts。

注意:完整性测试要求每个分类至少 1 条;条目在 `index.ts` spread 中的顺序 = 词典编号顺序。

## 从 .reference 移植

- `.reference/` 本地只读参考仓库(不入库、不署名);零改动移植优先,`--copy-from` 负责复制并识别导出名。
- 组件内部 import 保留原样:`@/registry/components/…` 生成提示词时自动改写为 `@/components/ui/…`(`src/lib/source.ts`);`@/lib/utils` 两仓库同路径。
- 移植后必改:usage / preview 按组件**真实 props** 填(tsc 会指出缺什么);deps 补 `motion` / `lucide-react`。
- 原组件有动效就必须有一条 reduced-motion/禁用降级的 designNotes(写不出就实测)。

## Common mistakes

| 坑 | 正确做法 |
|---|---|
| 把展示名当代码标识符 | 标识符 = slug 的 PascalCase(`GlowDivider`);`name` 字段才是 `"Glow Divider"` |
| usage 从 `@/registry` 导入 | usage 面向读者项目:`@/components/ui/<slug>` |
| usage 用 `export default` | 命名导出示例函数(`Demo`/`Cta`…) |
| 把站点纸色/朱砂带进组件 | 组件只活在恒暗展台:近黑底 + 白低透明边框 + 荧光绿系强调(见 conventions.md) |
| 手写 import/条目样板 | 一律 `registry:new`——usage 串里有行首 `import` 这类文本陷阱,脚本已处理 |
| 通读 entries 逆推约定 | `digest` 看清单,本 skill 看规则,至多挑一个同类条目当范例 |

## Red flags — 停下来检查

- 想改 `src/app` 或 `src/lib` 来"接上"新条目 → 不需要,一切自动派生;动了就是做错。
- check 通过但 designNotes 全是定性形容("平滑""优雅")→ 未达标,按 conventions.md 数值化重写。
- 新条目形态与任何现有分类的语义都不符 → 不要硬塞,走「新增分类」。
