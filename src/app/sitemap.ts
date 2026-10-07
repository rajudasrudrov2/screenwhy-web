import type { MetadataRoute } from "next";
import { PUBLIC_INDEXABLE_STATIC_ROUTES } from "@/config/routes";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteConfig.allowIndexing) return [];

  return PUBLIC_INDEXABLE_STATIC_ROUTES.map((pathname) => ({
    url: new URL(pathname, `${siteConfig.origin}/`).toString(),
  }));
}
