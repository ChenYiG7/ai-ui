/**
 * 注册表快速校验(秒级)。
 *
 * 覆盖 registry.test.ts 之外的约定细节:deps 白名单、usage 导入路径、
 * designNotes 质量底线等。约定来源:README「添加一个条目」+ v1 实施计划。
 * 用法:pnpm registry:check(--quiet 只在失败时输出)
 */
import { existsSync } from 'node:fs';
import path from 'node:path';
import { categories, registry } from '../src/registry/index';

const ALLOWED_DEPS = new Set(['motion', 'lucide-react']);
const componentsDir = path.join(process.cwd(), 'src', 'registry', 'components');

const errors: string[] = [];
const warnings: string[] = [];
const err = (slug: string, msg: string) => errors.push(`${slug}: ${msg}`);
const warn = (slug: string, msg: string) => warnings.push(`${slug}: ${msg}`);

const seenSlugs = new Set<string>();
for (const e of registry) {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(e.slug))
    err(e.slug, 'slug 必须是 kebab-case(小写字母/数字/连字符)');
  if (seenSlugs.has(e.slug)) err(e.slug, 'slug 全局重复');
  seenSlugs.add(e.slug);

  if (!categories.some((c) => c.id === e.category))
    err(e.slug, `分类非法:${String(e.category)}(合法值见 src/registry/categories.ts)`);

  if (!e.title?.trim()) err(e.slug, '缺少中文 title');
  if (!e.name?.trim()) err(e.slug, '缺少英文 name');
  else if (!/^[\x20-\x7e]+$/.test(e.name)) err(e.slug, `name 应为纯 ASCII,现在是「${e.name}」`);

  if (!e.description?.trim()) err(e.slug, '缺少一句话 description(会写入提示词)');
  else if (/TODO/.test(e.description)) warn(e.slug, 'description 仍是 TODO');

  if (!Array.isArray(e.designNotes) || e.designNotes.length < 3) {
    err(e.slug, `designNotes 至少 3 条(现在 ${e.designNotes?.length ?? 0} 条)`);
  } else {
    for (const n of e.designNotes) {
      if (typeof n !== 'string' || n.trim().length < 8) {
        err(e.slug, `designNotes 过于空泛,应写具体数值/行为:「${String(n).slice(0, 24)}」`);
      }
    }
    if (e.designNotes.some((n) => /TODO/.test(n))) warn(e.slug, 'designNotes 仍是 TODO');
    if (!e.designNotes.some((n) => /reduced-motion|禁用|disabled/i.test(n))) {
      warn(e.slug, 'designNotes 未提及 prefers-reduced-motion / 禁用态降级(强烈建议)');
    }
  }

  if (!e.file || !existsSync(path.join(componentsDir, e.file)))
    err(e.slug, `组件源码文件不存在:${e.file ?? '(空)'}`);

  const badDeps = (e.deps ?? []).filter((d) => !ALLOWED_DEPS.has(d));
  if (badDeps.length)
    err(
      e.slug,
      `deps 只允许 motion / lucide-react(clsx、tailwind-merge 默认有,不用声明),发现:${badDeps.join('、')}`,
    );

  if (!Array.isArray(e.tags) || e.tags.length === 0) err(e.slug, 'tags 至少 1 个');

  const componentName = (e.file?.split('/').pop() ?? '')
    .replace(/\.tsx$/, '')
    .split('-')
    .map((p) => (p ? p[0]!.toUpperCase() + p.slice(1) : p))
    .join('');
  if (!e.usage?.trim()) {
    err(e.slug, '缺少 usage 集成示例');
  } else {
    if (!e.usage.includes(componentName)) err(e.slug, `usage 未使用组件 ${componentName}`);
    if (/from\s+["']@\/registry/.test(e.usage))
      err(
        e.slug,
        'usage 是给读者项目用的,组件应从 @/components/ui/<文件名> 导入,不能指向本仓库的 @/registry',
      );
    if (/export\s+default/.test(e.usage))
      err(e.slug, 'usage 请用命名导出的示例函数,不要 export default');
    if (/TODO/.test(e.usage)) warn(e.slug, 'usage 仍是 TODO');
  }

  if (e.preview === undefined) err(e.slug, '缺少 preview 演示节点');
}

for (const c of categories) {
  if (!registry.some((e) => e.category === c.id))
    err(c.id, `分类「${c.label}」没有任何条目(完整性测试会挂)`);
}

const quiet = process.argv.includes('--quiet');
if (warnings.length) console.warn(warnings.map((w) => `⚠ ${w}`).join('\n'));
if (errors.length) {
  console.error(`\n✗ 注册表校验失败,共 ${errors.length} 处:`);
  for (const m of errors) console.error(`  · ${m}`);
  process.exit(1);
}
if (!quiet || warnings.length) {
  console.log(
    `✅ 注册表 OK:${registry.length} 条 / ${categories.length} 分类${warnings.length ? `(${warnings.length} 条 TODO 提醒)` : ''}`,
  );
}
