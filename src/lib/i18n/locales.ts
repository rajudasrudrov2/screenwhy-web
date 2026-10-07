export const SUPPORTED_LOCALES = ["en-US"] as const;

export type LocaleCode = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: LocaleCode = "en-US";

export function isLocaleCode(value: string): value is LocaleCode {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function localeFromRequestHeader(value: string | null): LocaleCode {
  return value && isLocaleCode(value) ? value : DEFAULT_LOCALE;
}
