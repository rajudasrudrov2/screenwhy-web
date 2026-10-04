import type { LocaleCode } from "@/lib/i18n/locales";
import type { TitleRepository } from "@/data/repositories/contracts";
import type {
  TitleListQuery,
  TitleLookupQuery,
} from "@/data/repositories/queries";
import {
  titleFixturesForLocale,
  unavailableTitleVariant,
} from "@/data/mock/fixture-selectors";
import { paginate } from "@/data/mock/paginate";

export const mockTitleRepository: TitleRepository = {
  async getBySlug<TLocale extends LocaleCode>(query: TitleLookupQuery<TLocale>) {
    const match = titleFixturesForLocale(query.locale).find(
      (title) =>
        title.publicRouteFamily === query.routeFamily &&
        title.identity.localization.currentVariant.slug === query.slug,
    );

    if (match) {
      return {
        status: "available",
        requestedLocale: query.locale,
        value: match,
      };
    }

    const unavailable = unavailableTitleVariant(query);
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

  async list<TLocale extends LocaleCode>(query: TitleListQuery<TLocale>) {
    const items = titleFixturesForLocale(query.locale).filter(
      (title) =>
        !query.routeFamily || title.publicRouteFamily === query.routeFamily,
    );
    return paginate(items, query);
  },
};
