import type { RegistrySummary } from '@/registry/types';

/** 按名称、标题、描述、标签做不区分大小写的加权匹配,支持子序列模糊命中 */
export function searchEntries(entries: RegistrySummary[], query: string): RegistrySummary[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...entries];

  const scored: { entry: RegistrySummary; score: number }[] = [];
  for (const entry of entries) {
    let score = 0;
    if (entry.slug.toLowerCase().includes(q)) score += 6;
    if (entry.title.toLowerCase().includes(q)) score += 5;
    if (entry.name.toLowerCase().includes(q)) score += 5;
    if (entry.tags.some((t) => t.toLowerCase().includes(q))) score += 4;
    if (entry.description.toLowerCase().includes(q)) score += 2;
    if (score === 0 && isSubsequence(q, entry.name.toLowerCase())) score += 1;
    if (score > 0) scored.push({ entry, score });
  }
  return scored.sort((a, b) => b.score - a.score).map((h) => h.entry);
}

function isSubsequence(q: string, text: string): boolean {
  let i = 0;
  for (const ch of text) {
    if (ch === q[i]) i += 1;
    if (i === q.length) return true;
  }
  return i === q.length;
}
