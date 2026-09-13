import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { registry } from "@/registry";

/** 静态导出时生成 out/sitemap.xml,URL 跟随 site.ts 的占位域名,部署后自动生效 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/+$/, "");
  const lastModified = new Date();

  return [
    { url: base + "/", lastModified, changeFrequency: "weekly", priority: 1 },
    { url: base + "/mcp", lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: base + "/docker", lastModified, changeFrequency: "monthly", priority: 0.6 },
    ...registry.map((entry) => ({
      url: `${base}/c/${entry.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
