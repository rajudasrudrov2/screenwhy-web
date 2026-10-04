import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export function createRootMetadata(description: string): Metadata {
  return {
    metadataBase: new URL(siteConfig.origin),
    title: {
      default: siteConfig.defaultTitle,
      template: siteConfig.titleTemplate,
    },
    description,
    icons: {
      icon: [
        { url: "/brand/favicon/favicon.svg", type: "image/svg+xml" },
        { url: "/brand/favicon/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/brand/favicon/favicon-16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: [{ url: "/brand/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    robots: siteConfig.allowIndexing
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };
}
