import type { LocaleCode } from "@/lib/i18n/locales";
import type { CharacterDetail } from "@/types/domain/character";
import type { ExplanationDetail } from "@/types/domain/explanation";
import type { TitleDetail } from "@/types/domain/title";
import { MOCK_CHARACTERS_EN } from "@/data/fixtures/characters";
import { MOCK_EXPLANATIONS_EN } from "@/data/fixtures/explanations";
import { MOCK_TITLES_EN } from "@/data/fixtures/titles";

export function titleFixturesForLocale<TLocale extends LocaleCode>(
  _locale: TLocale,
): readonly TitleDetail<TLocale>[] {
  return MOCK_TITLES_EN as unknown as readonly TitleDetail<TLocale>[];
}

export function explanationFixturesForLocale<TLocale extends LocaleCode>(
  _locale: TLocale,
): readonly ExplanationDetail<TLocale>[] {
  return MOCK_EXPLANATIONS_EN as unknown as readonly ExplanationDetail<TLocale>[];
}

export function characterFixturesForLocale<TLocale extends LocaleCode>(
  _locale: TLocale,
): readonly CharacterDetail<TLocale>[] {
  return MOCK_CHARACTERS_EN as unknown as readonly CharacterDetail<TLocale>[];
}
