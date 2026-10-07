import { searchRoute } from "@/config/routes";
import type { SearchFilter } from "@/features/search/search.types";
import type { LocaleCode } from "@/lib/i18n/locales";

export const SEARCH_QUERY_MAX_LENGTH = 160;
export const SEARCH_PAGE_SIZE = 6;
export const SEARCH_GROUP_PREVIEW_SIZE = 4;

const FILTER_SET = new Set<SearchFilter>([
  "all",
  "explanations",
  "titles",
  "characters",
  "questions",
]);

const STOP_WORDS = new Set([
  "a", "an", "and", "are", "at", "be", "did", "do", "does", "for", "from",
  "how", "in", "is", "it", "of", "on", "or", "the", "to", "was", "what",
  "when", "where", "which", "who", "why", "with",
]);

export function normalizeSearchQuery(value: string | undefined): string {
  return (value ?? "")
    .normalize("NFKC")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, SEARCH_QUERY_MAX_LENGTH);
}

export function parseSearchFilter(value: string | undefined): SearchFilter {
  if (!value || !FILTER_SET.has(value as SearchFilter)) return "all";
  return value as SearchFilter;
}

export function parseSearchPage(value: string | undefined): number {
  if (!value) return 1;
  const parsed = Number.parseInt(value, 10);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 1;
}

export function normalizedText(value: string): string {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function meaningfulTokens(value: string): readonly string[] {
  const tokens = normalizedText(value).split(" ").filter(Boolean);
  const meaningful = tokens.filter((token) => token.length > 1 && !STOP_WORDS.has(token));
  return meaningful.length ? meaningful : tokens;
}

export function relevanceScore(query: string, candidate: string): number {
  const q = normalizedText(query);
  const c = normalizedText(candidate);
  if (!q || !c) return 0;
  if (q === c) return 1000;
  if (c.startsWith(q)) return 850;
  if (c.includes(q)) return 760;

  const qTokens = meaningfulTokens(q);
  const cTokens = new Set(meaningfulTokens(c));
  const matches = qTokens.filter((token) => cTokens.has(token)).length;
  if (!matches) return 0;
  const coverage = matches / Math.max(qTokens.length, 1);
  return Math.round(300 + coverage * 400 + matches * 15);
}

export function buildSearchHref(
  query: string,
  filter: SearchFilter = "all",
  page = 1,
  locale: LocaleCode = "en-US",
): string {
  const params = new URLSearchParams();
  const normalized = normalizeSearchQuery(query);
  if (normalized) params.set("q", normalized);
  if (filter !== "all") params.set("type", filter);
  if (page > 1) params.set("page", String(page));
  const suffix = params.toString();
  return suffix ? `${searchRoute(locale)}?${suffix}` : searchRoute(locale);
}

export function levenshteinDistance(left: string, right: string): number {
  const a = normalizedText(left);
  const b = normalizedText(right);
  if (!a) return b.length;
  if (!b) return a.length;
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    let diagonal = previous[0];
    previous[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const old = previous[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      previous[j] = Math.min(previous[j] + 1, previous[j - 1] + 1, diagonal + cost);
      diagonal = old;
    }
  }
  return previous[b.length];
}
