export const SUPPORTED_LOCALES = ["en-US", "bn-BD"] as const;

export type LocaleCode = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: LocaleCode = "en-US";
export const SECONDARY_LOCALE: LocaleCode = "bn-BD";

export const LOCALE_PATH_PREFIX: Readonly<Record<LocaleCode, string>> = {
  "en-US": "",
  "bn-BD": "/bn",
};

export function isLocaleCode(value: string): value is LocaleCode {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function localeFromPathname(pathname: string): LocaleCode {
  return pathname === "/bn" || pathname.startsWith("/bn/")
    ? SECONDARY_LOCALE
    : DEFAULT_LOCALE;
}

export function stripLocalePrefix(pathname: string): string {
  if (pathname === "/bn" || pathname === "/bn/") {
    return "/";
  }

  if (pathname.startsWith("/bn/")) {
    return pathname.slice(3) || "/";
  }

  return pathname || "/";
}

export function localeFromRequestHeader(value: string | null): LocaleCode {
  return value && isLocaleCode(value) ? value : DEFAULT_LOCALE;
}
