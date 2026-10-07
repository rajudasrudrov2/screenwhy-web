import type { LocaleCode } from "@/lib/i18n/locales";
import type { ExplanationRepository } from "@/data/repositories/contracts";
import type {
  ExplanationListQuery,
  ExplanationLookupQuery,
} from "@/data/repositories/queries";
import { explanationFixturesForLocale } from "@/data/mock/fixture-selectors";
import { paginate } from "@/data/mock/paginate";
import type { ExplanationDetail } from "@/types/domain/explanation";

function normalized(value: string | undefined): string {
  return value?.trim().replace(/\s+/g, " ").toLocaleLowerCase() ?? "";
}

function sortableDate(value: string | undefined): number {
  if (!value) return 0;
  const time = Date.parse(value);
  return Number.isNaN(time) ? 0 : time;
}

function matchesDiscovery<TLocale extends LocaleCode>(
  explanation: ExplanationDetail<TLocale>,
  query: ExplanationListQuery<TLocale>,
): boolean {
  if (query.explanationType && explanation.explanationType !== query.explanationType) return false;
  if (query.primaryTitleId && explanation.primaryTitle.logicalId !== query.primaryTitleId) return false;
  if (query.canonClassification && explanation.canon.classification !== query.canonClassification) return false;
  if (query.routeFamily && explanation.primaryTitle.publicRouteFamily !== query.routeFamily) return false;

  const search = normalized(query.query);
  if (!search) return true;
  const searchable = [
    explanation.articleTitle,
    explanation.excerpt,
    explanation.intendedSubjectQuestion,
    explanation.primaryTitle.displayTitle,
  ].filter((value): value is string => Boolean(value));
  return searchable.some((value) => normalized(value).includes(search));
}

function sortExplanations<TLocale extends LocaleCode>(
  items: readonly ExplanationDetail<TLocale>[],
  sort: ExplanationListQuery<TLocale>["sort"],
): readonly ExplanationDetail<TLocale>[] {
  const copy = [...items];
  switch (sort) {
    case "published_newest":
      return copy.sort(
        (a, b) =>
          sortableDate(b.dates.datePublished) - sortableDate(a.dates.datePublished) ||
          a.articleTitle.localeCompare(b.articleTitle),
      );
    case "title_asc":
      return copy.sort((a, b) => a.articleTitle.localeCompare(b.articleTitle));
    case "title_desc":
      return copy.sort((a, b) => b.articleTitle.localeCompare(a.articleTitle));
    case "updated_newest":
    default:
      return copy.sort(
        (a, b) =>
          sortableDate(b.dates.dateModified ?? b.dates.datePublished) -
            sortableDate(a.dates.dateModified ?? a.dates.datePublished) ||
          a.articleTitle.localeCompare(b.articleTitle),
      );
  }
}

export const mockExplanationRepository: ExplanationRepository = {
  async getBySlug<TLocale extends LocaleCode>(
    query: ExplanationLookupQuery<TLocale>,
  ) {
    const match = explanationFixturesForLocale(query.locale).find(
      (explanation) =>
        explanation.identity.localization.currentVariant.slug === query.slug,
    );

    if (match) {
      return {
        status: "available",
        requestedLocale: query.locale,
        value: match,
      };
    }

    return {
      status: "unavailable",
      requestedLocale: query.locale,
      value: null,
      variant: {
        locale: query.locale,
        publicationState: "not-created",
        published: false,
      },
    };
  },

  async list<TLocale extends LocaleCode>(query: ExplanationListQuery<TLocale>) {
    const filtered = explanationFixturesForLocale(query.locale).filter((explanation) =>
      matchesDiscovery(explanation, query),
    );
    return paginate(sortExplanations(filtered, query.sort), query);
  },
};
