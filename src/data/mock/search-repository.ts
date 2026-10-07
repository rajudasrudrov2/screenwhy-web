import type { LocaleCode } from "@/lib/i18n/locales";
import type {
  SearchRepository,
  SearchResult,
} from "@/data/repositories/contracts";
import type { SearchQuery } from "@/data/repositories/queries";
import {
  characterFixturesForLocale,
  explanationFixturesForLocale,
  titleFixturesForLocale,
} from "@/data/mock/fixture-selectors";
import { paginate } from "@/data/mock/paginate";

const STOP_WORDS = new Set([
  "a", "an", "and", "are", "at", "be", "did", "do", "does", "for", "from",
  "how", "in", "is", "it", "of", "on", "or", "the", "to", "was", "what",
  "when", "where", "which", "who", "why", "with",
]);

function normalize(value: string): string {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function meaningfulTokens(value: string): readonly string[] {
  const tokens = normalize(value).split(" ").filter(Boolean);
  const meaningful = tokens.filter((token) => token.length > 1 && !STOP_WORDS.has(token));
  return meaningful.length ? meaningful : tokens;
}

function matchScore(candidate: string, rawQuery: string): number {
  const haystack = normalize(candidate);
  const needle = normalize(rawQuery);
  if (!needle || !haystack) return 0;
  if (haystack === needle) return 1000;
  if (haystack.startsWith(needle)) return 850;
  if (haystack.includes(needle)) return 760;
  const queryTokens = meaningfulTokens(needle);
  const candidateTokens = new Set(meaningfulTokens(haystack));
  const matches = queryTokens.filter((token) => candidateTokens.has(token)).length;
  if (!matches) return 0;
  const coverage = matches / Math.max(queryTokens.length, 1);
  return Math.round(300 + coverage * 400 + matches * 15);
}

export const mockSearchRepository: SearchRepository = {
  async search<TLocale extends LocaleCode>(query: SearchQuery<TLocale>) {
    const enabled = new Set(query.kinds ?? ["title", "explanation", "character"]);
    const scored: Array<{ readonly result: SearchResult<TLocale>; readonly score: number; readonly label: string }> = [];

    if (query.query.trim() && enabled.has("title")) {
      for (const title of titleFixturesForLocale(query.locale)) {
        const score = matchScore(title.displayTitle, query.query);
        if (score > 0) scored.push({ result: { kind: "title", item: title }, score, label: title.displayTitle });
      }
    }

    if (query.query.trim() && enabled.has("explanation")) {
      for (const explanation of explanationFixturesForLocale(query.locale)) {
        const score = Math.max(
          matchScore(explanation.articleTitle, query.query),
          matchScore(explanation.primaryTitle.displayTitle, query.query),
        );
        if (score > 0) scored.push({ result: { kind: "explanation", item: explanation }, score, label: explanation.articleTitle });
      }
    }

    if (query.query.trim() && enabled.has("character")) {
      for (const character of characterFixturesForLocale(query.locale)) {
        const score = Math.max(
          matchScore(character.displayName, query.query),
          matchScore(character.primaryTitleContext.displayTitle, query.query),
        );
        if (score > 0) scored.push({ result: { kind: "character", item: character }, score, label: character.displayName });
      }
    }

    scored.sort((left, right) => right.score - left.score || left.label.localeCompare(right.label));
    return paginate(scored.map(({ result }) => result), query);
  },
};
