import { siteConfig } from "@/config/site";

export function absoluteSiteUrl(pathname: string): string {
  return new URL(pathname, `${siteConfig.origin}/`).toString();
}

export function canonicalUrl(pathname: string): string {
  return absoluteSiteUrl(pathname);
}
