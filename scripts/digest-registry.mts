/**
 * 词典注册表紧凑总览:替代「通读 entries/*.tsx」。
 * 用法:pnpm registry:digest [--json]
 */
import { categories, registry } from '../src/registry/index';

if (process.argv.includes('--json')) {
  console.log(
    JSON.stringify(
      {
        total: registry.length,
        categories: categories.map((c) => ({
          ...c,
          count: registry.filter((e) => e.category === c.id).length,
        })),
        entries: registry.map((e, i) => ({
          no: i + 1,
          slug: e.slug,
          title: e.title,
          name: e.name,
          category: e.category,
          deps: e.deps,
          tags: e.tags,
          file: e.file,
        })),
      },
      null,
      2,
    ),
  );
} else {
  for (const c of categories) {
    const items = registry.filter((e) => e.category === c.id);
    console.log(`\n[${c.code}] ${c.label}(${items.length})— ${c.description}`);
    for (const e of items) {
      const no = String(registry.indexOf(e) + 1).padStart(2, '0');
      const deps = e.deps.length ? ` · deps:${e.deps.join(',')}` : '';
      console.log(
        `  ${no} ${e.slug.padEnd(18)} ${e.title} / ${e.name}${deps} · ${e.tags.join('/')}`,
      );
    }
  }
  console.log(`\n共 ${registry.length} 条 / ${categories.length} 分类(--json 输出机器可读格式)`);
}
