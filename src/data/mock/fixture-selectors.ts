import type { LocaleCode } from "@/lib/i18n/locales";
import type { CharacterDetail } from "@/types/domain/character";
import type { ExplanationDetail } from "@/types/domain/explanation";
import type { UnavailableLocalizedVariant } from "@/types/domain/localization";
import type { TitleDetail } from "@/types/domain/title";
import {
  MOCK_CHARACTERS_BN,
  MOCK_CHARACTERS_EN,
  MOCK_CHARACTER_UNAVAILABLE_LOOKUPS,
} from "@/data/fixtures/characters";
import {
  MOCK_EXPLANATIONS_BN,
  MOCK_EXPLANATIONS_EN,
  MOCK_EXPLANATION_UNAVAILABLE_LOOKUPS,
} from "@/data/fixtures/explanations";
import {
  MOCK_TITLES_BN,
  MOCK_TITLES_EN,
  MOCK_TITLE_UNAVAILABLE_LOOKUPS,
} from "@/data/fixtures/titles";

/**
 * Locale narrowing boundary for fixture-only arrays.
 *
 * TypeScript cannot preserve a generic TLocale through an indexed runtime
 * branch over two separately typed fixture arrays. The assertions below are
 * isolated here and guarded by an exact locale branch; they never change the
 * locale value or synthesize fallback content.
 */
export function titleFixturesForLocale<TLocale extends LocaleCode>(
  locale: TLocale,
): readonly TitleDetail<TLocale>[] {
  const records = locale === "en-US" ? MOCK_TITLES_EN : MOCK_TITLES_BN;
  return records as unknown as readonly TitleDetail<TLocale>[];
}

export function explanationFixturesForLocale<TLocale extends LocaleCode>(
  locale: TLocale,
): readonly ExplanationDetail<TLocale>[] {
  const records =
    locale === "en-US" ? MOCK_EXPLANATIONS_EN : MOCK_EXPLANATIONS_BN;
  return records as unknown as readonly ExplanationDetail<TLocale>[];
}

export function characterFixturesForLocale<TLocale extends LocaleCode>(
  locale: TLocale,
): readonly CharacterDetail<TLocale>[] {
  const records = locale === "en-US" ? MOCK_CHARACTERS_EN : MOCK_CHARACTERS_BN;
  return records as unknown as readonly CharacterDetail<TLocale>[];
}

export function unavailableTitleVariant<TLocale extends LocaleCode>(input: {
  readonly locale: TLocale;
  readonly routeFamily: string;
  readonly slug: string;
}): UnavailableLocalizedVariant<"title", TLocale> | undefined {
  if (input.locale !== "bn-BD") return undefined;

  const match = MOCK_TITLE_UNAVAILABLE_LOOKUPS.find(
    (entry) =>
      entry.locale === input.locale &&
      entry.routeFamily === input.routeFamily &&
      entry.slug === input.slug,
  );

  return match?.variant as
    | UnavailableLocalizedVariant<"title", TLocale>
    | undefined;
}

export function unavailableExplanationVariant<TLocale extends LocaleCode>(input: {
  readonly locale: TLocale;
  readonly slug: string;
}): UnavailableLocalizedVariant<"explanation", TLocale> | undefined {
  if (input.locale !== "bn-BD") return undefined;
  const match = MOCK_EXPLANATION_UNAVAILABLE_LOOKUPS.find(
    (entry) => entry.locale === input.locale && entry.slug === input.slug,
  );
  return match?.variant as
    | UnavailableLocalizedVariant<"explanation", TLocale>
    | undefined;
}

export function unavailableCharacterVariant<TLocale extends LocaleCode>(input: {
  readonly locale: TLocale;
  readonly slug: string;
}): UnavailableLocalizedVariant<"character", TLocale> | undefined {
  if (input.locale !== "bn-BD") return undefined;
  const match = MOCK_CHARACTER_UNAVAILABLE_LOOKUPS.find(
    (entry) => entry.locale === input.locale && entry.slug === input.slug,
  );
  return match?.variant as
    | UnavailableLocalizedVariant<"character", TLocale>
    | undefined;
}
