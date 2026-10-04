import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export function createRootMetadata(description: string): Metadata {
  return {
    metadataBase: new URL(siteConfig.origin),
    applicationName: siteConfig.name,
    title: {
      default: siteConfig.defaultTitle,
      template: siteConfig.titleTemplate,
    },
    description,
    openGraph: {
      siteName: siteConfig.name,
      type: "website",
    },
    robots: siteConfig.allowIndexing
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };
}
