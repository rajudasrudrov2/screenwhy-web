import type { MetadataRoute } from "next";
import { createApiRepositories } from "@/data/api";
import { env } from "@/config/env";
import { siteConfig } from "@/config/site";
import { collectApprovedPublicSitemap } from "@/lib/seo/sitemap-public";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!siteConfig.allowIndexing) return [];
  if (env.dataSource !== "api" || !env.dataSourceExplicitlyConfigured) return [];
  if (!env.cmsApiBaseUrl) throw new Error("Indexable sitemap requires CMS API configuration.");
  return collectApprovedPublicSitemap(createApiRepositories(), siteConfig.origin);
}

