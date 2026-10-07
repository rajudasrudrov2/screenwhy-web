import type { LocaleCode } from "@/lib/i18n/locales";
import type { TitleRepository } from "@/data/repositories/contracts";
import type {
  TitleListQuery,
  TitleLookupQuery,
} from "@/data/repositories/queries";
import {
  titleFixturesForLocale
} from "@/data/mock/fixture-selectors";
import { paginate } from "@/data/mock/paginate";
import type { TitleDetail } from "@/types/domain/title";

function normalized(value: string | undefined): string {
  return value?.trim().toLocaleLowerCase() ?? "";
}

function matchesDiscovery<TLocale extends LocaleCode>(
  title: TitleDetail<TLocale>,
  query: TitleListQuery<TLocale>,
): boolean {
  const search = normalized(query.query);
  if (search) {
    const searchable = [
      title.displayTitle,
      title.originalTitle,
      ...(title.alternateOfficialTitles ?? []),
    ].filter((value): value is string => Boolean(value));
    if (!searchable.some((value) => normalized(value).includes(search))) return false;
  }
  if (query.genreSlug && !title.genres?.some((genre) => genre.slug === query.genreSlug)) return false;
  if (query.releaseYear && title.releaseYear !== query.releaseYear) return false;
  if (query.countrySlug && !title.classifications.countries?.some((country) => country.slug === query.countrySlug)) return false;
  if (query.platformSlug && !title.classifications.platforms?.some((platform) => platform.slug === query.platformSlug)) return false;
  return true;
}

function sortTitles<TLocale extends LocaleCode>(
  items: readonly TitleDetail<TLocale>[],
  sort: TitleListQuery<TLocale>["sort"],
): readonly TitleDetail<TLocale>[] {
  const copy = [...items];
  switch (sort) {
    case "title_desc": return copy.sort((a, b) => b.displayTitle.localeCompare(a.displayTitle));
    case "release_newest": return copy.sort((a, b) => (b.releaseYear ?? 0) - (a.releaseYear ?? 0) || a.displayTitle.localeCompare(b.displayTitle));
    case "release_oldest": return copy.sort((a, b) => (a.releaseYear ?? Number.MAX_SAFE_INTEGER) - (b.releaseYear ?? Number.MAX_SAFE_INTEGER) || a.displayTitle.localeCompare(b.displayTitle));
    case "title_asc":
    default: return copy.sort((a, b) => a.displayTitle.localeCompare(b.displayTitle));
  }
}

export const mockTitleRepository: TitleRepository = {
  async getBySlug<TLocale extends LocaleCode>(query: TitleLookupQuery<TLocale>) {
    const match = titleFixturesForLocale(query.locale).find(
      (title) =>
        title.publicRouteFamily === query.routeFamily &&
        title.identity.localization.currentVariant.slug === query.slug,
    );

    if (match) {
      return { status: "available", requestedLocale: query.locale, value: match };
    }

    return {
      status: "unavailable",
      requestedLocale: query.locale,
      value: null,
      variant: { locale: query.locale, publicationState: "not-created", published: false },
    };
  },

  async list<TLocale extends LocaleCode>(query: TitleListQuery<TLocale>) {
    const filtered = titleFixturesForLocale(query.locale).filter(
      (title) =>
        (!query.routeFamily || title.publicRouteFamily === query.routeFamily) &&
        matchesDiscovery(title, query),
    );
    return paginate(sortTitles(filtered, query.sort), query);
  },
};
