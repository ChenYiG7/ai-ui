import { readComponentSource } from '@/lib/source';
import { buildComponentManifest } from '@/lib/registry-json';
import { getEntry, registry, toSummary } from '@/registry';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return registry.map((e) => ({ slug: e.slug }));
}

/** 返回某个条目的机器可读清单(JSON),供 CLI 与 AI 代理直接消费 */
export async function GET(
  _request: Request,
  ctx: { params: Promise<{ slug: string }> },
): Promise<Response> {
  const { slug } = await ctx.params;
  const entry = getEntry(slug);
  if (!entry) return new Response('未找到该条目', { status: 404 });

  const source = await readComponentSource(entry.file);
  const manifest = buildComponentManifest({ entry: toSummary(entry), source });
  return new Response(JSON.stringify(manifest, null, 2) + '\n', {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
