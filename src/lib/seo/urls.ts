import { siteConfig } from "@/config/site";
import type { LocaleCode } from "@/lib/i18n/locales";

export type PublishedLocalePaths = Partial<Record<LocaleCode, string>>;

export function absoluteSiteUrl(pathname: string): string {
  return new URL(pathname, `${siteConfig.origin}/`).toString();
}

export function canonicalUrl(pathname: string): string {
  return absoluteSiteUrl(pathname);
}

export function publishedLocaleAlternates(
  paths: PublishedLocalePaths,
): Record<string, string> {
  const alternates: Record<string, string> = {};
  const englishPath = paths["en-US"];

  if (englishPath) {
    const englishUrl = absoluteSiteUrl(englishPath);
    alternates["en-US"] = englishUrl;
    alternates["x-default"] = englishUrl;
  }

  return alternates;
}
