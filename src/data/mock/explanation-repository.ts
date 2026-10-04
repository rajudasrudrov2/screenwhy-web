import type { LocaleCode } from "@/lib/i18n/locales";
import type { ExplanationRepository } from "@/data/repositories/contracts";
import type {
  ExplanationListQuery,
  ExplanationLookupQuery,
} from "@/data/repositories/queries";
import {
  explanationFixturesForLocale,
  unavailableExplanationVariant,
} from "@/data/mock/fixture-selectors";
import { paginate } from "@/data/mock/paginate";

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

    const unavailable = unavailableExplanationVariant(query);
    if (unavailable) {
      return {
        status: "unavailable",
        requestedLocale: query.locale,
        value: null,
        variant: unavailable,
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
    const items = explanationFixturesForLocale(query.locale).filter(
      (explanation) =>
        (!query.explanationType ||
          explanation.explanationType === query.explanationType) &&
        (!query.primaryTitleId ||
          explanation.primaryTitle.logicalId === query.primaryTitleId) &&
        (!query.canonClassification ||
          explanation.canon.classification === query.canonClassification),
    );
    return paginate(items, query);
  },
};
