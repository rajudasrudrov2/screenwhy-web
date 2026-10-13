import type { MetadataRoute } from "next";
import { createApiRepositories } from "@/data/api";
import { env } from "@/config/env";
import { siteConfig } from "@/config/site";
import { collectApprovedPublicSitemap } from "@/lib/seo/sitemap-public";
import { getLiveExplanations, isLiveApiMode } from "@/lib/live-explanations";

export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!siteConfig.allowIndexing) return [];
  if (!isLiveApiMode()) {
    if (env.dataSource !== "api" || !env.dataSourceExplicitlyConfigured) return [];
    if (!env.cmsApiBaseUrl) throw new Error("Indexable sitemap requires CMS API configuration.");
    return collectApprovedPublicSitemap(createApiRepositories(), siteConfig.origin);
  }
  const additions: MetadataRoute.Sitemap = [];
  for (let page = 1; page <= 20; page++) {
    const batch = await getLiveExplanations({ page, perPage: 50 });
    for (const entry of batch.items) {
      const parsed = entry.modifiedAt ? new Date(entry.modifiedAt.replace(" ", "T") + "Z") : undefined;
      additions.push({ url: `${siteConfig.origin}${entry.publicPath}`, ...(parsed && Number.isFinite(parsed.getTime()) ? { lastModified: parsed } : {}) });
    }
    if (batch.items.length < 50 || page * 50 >= batch.total) break;
  }
  // Keep existing Title/Character and static routes whenever the previous public contract is healthy.
  let historical: MetadataRoute.Sitemap = [];
  try { historical = await collectApprovedPublicSitemap(createApiRepositories(), siteConfig.origin); }
  catch { /* Legacy mapper may reject absent optional metadata; never exclude genuine published live explanations. */ }
  const byUrl = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const entry of historical) byUrl.set(entry.url, entry);
  for (const entry of additions) byUrl.set(entry.url, entry);
  return [...byUrl.values()];
}
