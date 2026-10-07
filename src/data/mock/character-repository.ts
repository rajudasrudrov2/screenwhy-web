import type { LocaleCode } from "@/lib/i18n/locales";
import type { CharacterRepository } from "@/data/repositories/contracts";
import type {
  CharacterListQuery,
  CharacterLookupQuery,
} from "@/data/repositories/queries";
import {
  characterFixturesForLocale
} from "@/data/mock/fixture-selectors";
import { paginate } from "@/data/mock/paginate";
import type { CharacterDetail } from "@/types/domain/character";

function sortCharacters<TLocale extends LocaleCode>(
  items: readonly CharacterDetail<TLocale>[],
  sort: CharacterListQuery<TLocale>["sort"],
): readonly CharacterDetail<TLocale>[] {
  const copy = [...items];
  if (sort === "name_desc") return copy.sort((a, b) => b.displayName.localeCompare(a.displayName));
  return copy.sort((a, b) => a.displayName.localeCompare(b.displayName));
}

export const mockCharacterRepository: CharacterRepository = {
  async getBySlug<TLocale extends LocaleCode>(query: CharacterLookupQuery<TLocale>) {
    const match = characterFixturesForLocale(query.locale).find(
      (character) => character.identity.localization.currentVariant.slug === query.slug,
    );

    if (match) return { status: "available", requestedLocale: query.locale, value: match };

    return {
      status: "unavailable",
      requestedLocale: query.locale,
      value: null,
      variant: { locale: query.locale, publicationState: "not-created", published: false },
    };
  },

  async list<TLocale extends LocaleCode>(query: CharacterListQuery<TLocale>) {
    const search = query.query?.trim().toLocaleLowerCase();
    const filtered = characterFixturesForLocale(query.locale).filter(
      (character) =>
        (!query.titleLogicalId || character.titleContexts.some((title) => title.logicalId === query.titleLogicalId)) &&
        (!search || character.displayName.toLocaleLowerCase().includes(search) || character.aliases?.some((alias) => alias.toLocaleLowerCase().includes(search))),
    );
    return paginate(sortCharacters(filtered, query.sort), query);
  },
};
