import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { buildPrompt } from '../src/lib/prompt';
import { buildComponentManifest } from '../src/lib/registry-json';
import { formatIndex, registry, toSummary } from '../src/registry/index';
import type { CategoryId, RegistrySummary } from '../src/registry/types';

/** 列表行的形状:纯数据 summary 加上词典编号 No.XX */
export type ComponentRow = RegistrySummary & { no: string };

/**
 * 定位仓库根目录:优先从入口脚本路径推导(stdio 客户端 spawn 时 cwd 不可控),
 * 校验失败回退 process.cwd(),仍失败则抛出中文错误。
 * 不能用 import.meta(tsx 输出可能是 CJS)。
 */
function resolveRepoRoot(): string {
  const fromArgv = path.resolve(path.dirname(process.argv[1] ?? ''), '..');
  if (existsSync(path.join(fromArgv, 'src', 'registry', 'index.ts'))) return fromArgv;
  if (existsSync(path.join(process.cwd(), 'src', 'registry', 'index.ts'))) return process.cwd();
  throw new Error(
    '无法定位 ai-ui 仓库根目录(未找到 src/registry/index.ts),请在仓库内运行 MCP 服务器',
  );
}

const repoRoot = resolveRepoRoot();

/** 词典组件总数(用于列表表头) */
export const componentCount = registry.length;

/**
 * 读取组件源码并把 `@/registry/components/<分类>/` 前缀的导入路径改写为 `@/components/ui/`。
 * 与 lib/source.ts 逻辑一致,但不能复用它——那里 `import "server-only"` 在纯 Node 下会抛错。
 */
async function readComponentSource(file: string): Promise<string> {
  const raw = await readFile(path.join(repoRoot, 'src', 'registry', 'components', file), 'utf8');
  return raw.replace(/@\/registry\/components\/[\w/-]+\//g, '@/components/ui/');
}

/** MCP 用的确定性过滤:category 精确匹配 + 关键词空格分隔按 AND 匹配。 */
export interface EntryFilter {
  category: CategoryId | 'all';
  query: string;
}

/**
 * 与站内 lib/search.ts 分工不同:那边是加权模糊搜索(给 ⌘K 排序用),
 * 这里要确定性的子串过滤(模型按 slug/标签精确查词)。
 */
function filterEntries<T extends RegistrySummary>(entries: readonly T[], filter: EntryFilter): T[] {
  const q = filter.query.trim().toLowerCase();
  return entries.filter((e) => {
    if (filter.category !== 'all' && e.category !== filter.category) return false;
    if (!q) return true;
    const haystack = [e.title, e.name, e.slug, e.description, ...e.tags].join(' ').toLowerCase();
    return q.split(/\s+/).every((word) => haystack.includes(word));
  });
}

/** 列出组件(可按分类与关键词过滤),编号与注册表顺序一致 */
export function listComponents(filter: EntryFilter): ComponentRow[] {
  const rows = registry.map((entry, i) => ({ ...toSummary(entry), no: formatIndex(i) }));
  return filterEntries(rows, filter);
}

/** 生成指定组件的完整 AI 提示词；未找到时返回 undefined */
export async function getComponentPrompt(slug: string): Promise<string | undefined> {
  const entry = registry.find((e) => e.slug === slug);
  if (!entry) return undefined;
  const source = await readComponentSource(entry.file);
  return buildPrompt({ entry: toSummary(entry), source });
}

/** 生成指定组件的机器可读清单(格式化 JSON);未找到时返回 undefined */
export async function getComponentManifest(slug: string): Promise<string | undefined> {
  const entry = registry.find((e) => e.slug === slug);
  if (!entry) return undefined;
  const source = await readComponentSource(entry.file);
  return JSON.stringify(buildComponentManifest({ entry: toSummary(entry), source }), null, 2) + '\n';
}

/** 给错误提示用的相近 slug 建议:子串互相匹配,最多 3 个,无匹配时补词典前 3 个 */
export function suggestSlugs(slug: string): string[] {
  const q = slug.toLowerCase();
  const matched = registry
    .filter((e) => e.slug.includes(q) || q.includes(e.slug))
    .map((e) => e.slug);
  return (matched.length > 0 ? matched : registry.map((e) => e.slug)).slice(0, 3);
}
