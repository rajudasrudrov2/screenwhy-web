import { siteConfig } from "@/config/site";
import type { LocaleCode } from "@/lib/i18n/locales";

export type PublishedLocalePaths = Partial<Record<LocaleCode, string>>;

export function absoluteSiteUrl(pathname: string): string {
  return new URL(pathname, `${siteConfig.origin}/`).toString();
}

export function canonicalUrl(pathname: string): string {
  return absoluteSiteUrl(pathname);
}

/**
 * Build hreflang links only from variants the caller has already confirmed as
 * publicly published. This intentionally never invents a bn-BD alternate.
 */
export function publishedLocaleAlternates(
  paths: PublishedLocalePaths,
): Record<string, string> {
  const alternates: Record<string, string> = {};

  if (paths["en-US"]) {
    const englishUrl = absoluteSiteUrl(paths["en-US"]);
    alternates["en-US"] = englishUrl;
    alternates["x-default"] = englishUrl;
  }

  if (paths["bn-BD"]) {
    alternates["bn-BD"] = absoluteSiteUrl(paths["bn-BD"]);
  }

  return alternates;
}
