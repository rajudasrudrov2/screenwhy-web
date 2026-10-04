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

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase();
}

function includesNeedle(haystack: string, needle: string): boolean {
  return normalize(haystack).includes(needle);
}

export const mockSearchRepository: SearchRepository = {
  async search<TLocale extends LocaleCode>(query: SearchQuery<TLocale>) {
    const needle = normalize(query.query);
    const enabled = new Set(query.kinds ?? ["title", "explanation", "character"]);
    const results: SearchResult<TLocale>[] = [];

    if (needle && enabled.has("title")) {
      for (const title of titleFixturesForLocale(query.locale)) {
        if (includesNeedle(title.displayTitle, needle)) {
          results.push({ kind: "title", item: title });
        }
      }
    }

    if (needle && enabled.has("explanation")) {
      for (const explanation of explanationFixturesForLocale(query.locale)) {
        if (includesNeedle(explanation.articleTitle, needle)) {
          results.push({ kind: "explanation", item: explanation });
        }
      }
    }

    if (needle && enabled.has("character")) {
      for (const character of characterFixturesForLocale(query.locale)) {
        if (includesNeedle(character.displayName, needle)) {
          results.push({ kind: "character", item: character });
        }
      }
    }

    return paginate(results, query);
  },
};
