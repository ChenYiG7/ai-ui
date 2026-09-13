/**
 * 注册表条目脚手架:把「加一个条目」的机械部分全部自动化,人/AI 只填 TODO。
 *
 * 用法:
 *   pnpm registry:new <slug> --category <cat> [--title "中文名"] [--name "英文名"] [--copy-from <路径>]
 *
 * 行为:
 *   1. 创建 src/registry/components/<cat>/<slug>.tsx(骨架,或 --copy-from 复制移植);
 *   2. 在 src/registry/entries/<cat>.tsx 追加注册条目(文件不存在则创建);
 *   3. 新建 entries 文件时自动接线 src/registry/index.ts;
 *   4. 打印剩余手工步骤。完成后跑 pnpm registry:check 验证。
 *
 * 名词约定:
 *   标识符(代码里用)= slug 的 PascalCase,如 glow-divider → GlowDivider;
 *   展示名(name 字段)= 带空格的英文名,如 Glow Divider;--name 只影响展示名。
 */
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function fail(msg: string, hint?: string): never {
  console.error(`✗ ${msg}`);
  if (hint) console.error(`\n${hint}`);
  process.exit(1);
}

// ---------- 参数解析(在任何 import 注册表之前,保证报错始终可读) ----------
const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith('--'));
let category: string | undefined;
let title: string | undefined;
let name: string | undefined;
let copyFrom: string | undefined;
for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case '--category':
      category = args[++i];
      break;
    case '--title':
      title = args[++i];
      break;
    case '--name':
      name = args[++i];
      break;
    case '--copy-from':
      copyFrom = args[++i];
      break;
  }
}

if (!slug || !category) {
  fail(
    '用法:pnpm registry:new <slug> --category <分类> [--title 中文名] [--name 英文名] [--copy-from 源文件]',
  );
}
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) fail(`slug「${slug}」不是 kebab-case`);

const pascal = (s: string) =>
  s
    .split('-')
    .map((p) => p[0]!.toUpperCase() + p.slice(1))
    .join('');
const spaced = (s: string) =>
  s
    .split('-')
    .map((p) => p[0]!.toUpperCase() + p.slice(1))
    .join(' ');
const identifier = pascal(slug); // 组件导出的标识符
const displayName = name ?? spaced(slug); // entry.name 展示名

let categories: readonly { id: string; label: string }[];
let registry: readonly { slug: string; file: string }[];
try {
  const m = await import('../src/registry/index');
  categories = m.categories;
  registry = m.registry;
} catch (e) {
  fail(
    '注册表代码加载失败(可能有语法错误或类型不匹配)。',
    `先运行 pnpm typecheck 定位;原始错误:\n${e instanceof Error ? e.message : String(e)}`,
  );
}

const compFile = path.join(root, 'src', 'registry', 'components', category!, `${slug}.tsx`);
const compRel = `${category}/${slug}.tsx`;
if (existsSync(compFile)) fail(`组件文件已存在:${compRel}`);
if (registry.some((e) => e.slug === slug))
  fail(`slug「${slug}」已存在(${registry.find((e) => e.slug === slug)?.file})`);

const knownCategory = categories.find((c) => c.id === category);
if (!knownCategory) {
  const typesSrc = readFileSync(path.join(root, 'src', 'registry', 'types.ts'), 'utf8');
  const unionMissing = !typesSrc.includes(`| "${category}"`);
  fail(
    `分类「${category}」不存在。现有分类:${categories.map((c) => c.id).join('、')}`,
    unionMissing
      ? `要新增分类,先改两个文件再重跑:\n` +
          `  1. src/registry/types.ts — CategoryId 联合类型加上 "| ${category}";\n` +
          `  2. src/registry/categories.ts — categories 数组加一行 { id, label 中文名, code 大写码, description 一句话 };`
      : `types.ts 已有分类「${category}」,但 categories.ts 还没有对应行(label/code/description)。`,
  );
}

// ---------- 1. 组件源码 ----------
let exportName = identifier;
if (copyFrom) {
  const srcPath = path.resolve(copyFrom);
  if (!existsSync(srcPath)) fail(`--copy-from 源文件不存在:${srcPath}`);
  copyFileSync(srcPath, compFile);
  const src = readFileSync(compFile, 'utf8');
  const m = src.match(/export\s+(?:const|function|class)\s+(\w+)/);
  if (m) exportName = m[1]!;
  const suspicious = [...src.matchAll(/from\s+["']([^"']+)["']/g)]
    .map((x) => x[1]!)
    .filter((s) => !/^(@\/|react|motion|lucide-react|clsx|tailwind-merge)/.test(s));
  console.log(`📄 已复制 ${srcPath} → ${compRel}(导出 ${exportName})`);
  if (suspicious.length)
    console.warn(`⚠ 源文件含非常规导入,移植后请手动核对:${suspicious.join('、')}`);
} else {
  const stub = `import { cn } from "@/lib/utils";

// TODO:深色展台组件(近黑底、白色低透明度边框系);动画类组件必须写 prefers-reduced-motion 降级。
export function ${identifier}({ className }: { className?: string }) {
  return <div className={cn("TODO", className)} />;
}
`;
  writeFileSync(compFile, stub, 'utf8');
  console.log(`📄 已创建骨架 ${compRel}(导出 ${identifier})`);
}

// ---------- 2. 条目对象 ----------
const entry = `  {
    slug: "${slug}",
    title: ${JSON.stringify(title ?? 'TODO 中文名')},
    name: ${JSON.stringify(displayName)},
    category: "${category}",
    description: "TODO:一句话写体感行为,会原样进入词典提示词。",
    designNotes: [
      "TODO:结构与几何——尺寸、圆角、边框、内边距,写具体数值",
      "TODO:动效与颜色——时长、缓动、位移、透明度、色值,写具体数值",
      "TODO:prefers-reduced-motion(或禁用态)时的降级行为",
    ],
    deps: [], // TODO:额外依赖只允许 motion / lucide-react
    file: "${compRel}",
    tags: ["TODO"],
    usage: \`import { ${exportName} } from "@/components/ui/${slug}";

export function Demo() {
  return <${exportName} />;
}\`,
    preview: <${exportName} className="w-full max-w-md" />,
  },
`;

/** 在文件头部(首个非 import 非空行之前)的最后一个 import 行后插入一行。
 *  不能用 /^import /m 全文匹配:usage 示例代码里也有行首 import。 */
function insertImport(src: string, line: string): string {
  const lines = src.split('\n');
  let at = -1;
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i]!.trim();
    if (t === '') continue;
    if (t.startsWith('import ')) at = i;
    else break;
  }
  if (at === -1) fail('entries 文件头部没有 import 块,结构异常,请手动处理');
  lines.splice(at + 1, 0, line.replace(/\r$/, ''));
  return lines.join('\n');
}

// ---------- 3. 写入 entries/<cat>.tsx(不存在则创建并接线 index.ts) ----------
const entriesFile = path.join(root, 'src', 'registry', 'entries', `${category}.tsx`);
// 现有惯例:registry 内部导入不带 .tsx 扩展名
const importLine = `import { ${exportName} } from "@/registry/components/${compRel.replace(/\.tsx$/, '')}";`;

if (!existsSync(entriesFile)) {
  writeFileSync(
    entriesFile,
    `${importLine}\nimport type { RegistryEntry } from "@/registry/types";\n\nexport const ${pascal(category!)}Entries: RegistryEntry[] = [\n${entry}];\n`,
    'utf8',
  );
  console.log(`🗂 已创建 src/registry/entries/${category}.tsx`);

  const indexPath = path.join(root, 'src', 'registry', 'index.ts');
  let indexSrc = readFileSync(indexPath, 'utf8');
  if (!indexSrc.includes(`./entries/${category}`)) {
    indexSrc = insertImport(
      indexSrc,
      `import { ${pascal(category!)}Entries } from "./entries/${category}";`,
    );
    const arrayStart = indexSrc.indexOf('const registry');
    const arrayEnd = indexSrc.indexOf('];', arrayStart);
    indexSrc =
      indexSrc.slice(0, arrayEnd) +
      `  ...${pascal(category!)}Entries,\n` +
      indexSrc.slice(arrayEnd);
    writeFileSync(indexPath, indexSrc, 'utf8');
    console.log(
      `🔌 已把 ${pascal(category!)}Entries 接入 src/registry/index.ts(追加在数组末尾 = 编号最后;想调整编号顺序请手动移动 spread 行)`,
    );
  }
} else {
  let src = readFileSync(entriesFile, 'utf8');
  src = insertImport(src, importLine);
  const at = src.lastIndexOf('];');
  src = src.slice(0, at) + entry + src.slice(at);
  writeFileSync(entriesFile, src, 'utf8');
  console.log(`🗂 已把条目追加到 src/registry/entries/${category}.tsx`);
}

// ---------- 4. 下一步 ----------
console.log(`
✅ 骨架就绪。剩余步骤(全是判断型工作,脚本不代劳):
  1. 实现 ${compRel} 的真实组件逻辑;
  2. 填 entries 里的 TODO:title / description / designNotes(数值化)/ tags / usage / preview;
  3. 依赖 motion 或 lucide-react 时填入 deps;
  4. pnpm registry:check 秒级校验,再 pnpm test。
`);
