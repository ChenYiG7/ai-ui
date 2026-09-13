import { site } from '@/lib/site';
import { categories, getEntriesByCategory } from '@/registry';

export const dynamic = 'force-static';

/** AI 可读的词典总目录(相对路径,避免绑定部署域名) */
export function GET(): Response {
  const lines: string[] = [`# ${site.name}`, '', `> ${site.description}`, ''];
  for (const c of categories) {
    lines.push(`## ${c.label}(${c.code})`);
    lines.push('');
    for (const e of getEntriesByCategory(c.id)) {
      lines.push(
        `- [${e.title} ${e.name}](/c/${e.slug}):${e.description} [提示词](/api/prompt/${e.slug}) [JSON](/api/registry/${e.slug})`,
      );
    }
    lines.push('');
  }
  return new Response(lines.join('\n'), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
