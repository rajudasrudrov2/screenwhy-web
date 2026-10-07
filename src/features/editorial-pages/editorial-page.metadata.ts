import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { EDITORIAL_PAGE_CONTENT } from "./editorial-page.content";
import type { EditorialPageKey } from "./editorial-page.types";

export function createEditorialPageMetadata(pageKey: EditorialPageKey): Metadata {
  const page = EDITORIAL_PAGE_CONTENT[pageKey];
  const canonical = `${siteConfig.origin}${page.route}`;
  return {
    title: page.title,
    description: page.metaDescription,
    alternates: { canonical },
    robots: { index: siteConfig.allowIndexing, follow: siteConfig.allowIndexing },
    openGraph: {
      title: `${page.title} | ScreenWhy`,
      description: page.metaDescription,
      url: canonical,
      siteName: "ScreenWhy",
      type: "website",
    },
  };
}
