import type { LocaleCode } from "@/lib/i18n/locales";
import type { CharacterRepository } from "@/data/repositories/contracts";
import type {
  CharacterListQuery,
  CharacterLookupQuery,
} from "@/data/repositories/queries";
import {
  characterFixturesForLocale,
  unavailableCharacterVariant,
} from "@/data/mock/fixture-selectors";
import { paginate } from "@/data/mock/paginate";

export const mockCharacterRepository: CharacterRepository = {
  async getBySlug<TLocale extends LocaleCode>(
    query: CharacterLookupQuery<TLocale>,
  ) {
    const match = characterFixturesForLocale(query.locale).find(
      (character) =>
        character.identity.localization.currentVariant.slug === query.slug,
    );

    if (match) {
      return {
        status: "available",
        requestedLocale: query.locale,
        value: match,
      };
    }

    const unavailable = unavailableCharacterVariant(query);
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

  async list<TLocale extends LocaleCode>(query: CharacterListQuery<TLocale>) {
    const items = characterFixturesForLocale(query.locale).filter(
      (character) =>
        !query.titleLogicalId ||
        character.titleContexts.some(
          (title) => title.logicalId === query.titleLogicalId,
        ),
    );
    return paginate(items, query);
  },
};
