import type { LocaleCode } from "@/lib/i18n/locales";
import type {
  LocalizedVariantPublicationState,
  LocalizedVariantAvailability,
  PublishedLocalizedVariant,
} from "@/types/domain/localization";
import type { LogicalEntityKind } from "@/types/domain/identity";

/**
 * Compatibility surface retained from PE-FE-01A/01B.
 * New domain code should normally import from `@/types/domain` directly.
 */
export type {
  CharacterLogicalGroupId,
  ExplanationLogicalGroupId,
  LocalizedVariantId,
  LogicalEntityIdentity,
  LogicalEntityKind,
  LogicalGroupId,
  TitleLogicalGroupId,
  WordPressPostId,
} from "@/types/domain/identity";

export type LocalizedPublicationState = LocalizedVariantPublicationState;
export type LocalizedVariantIdentity<
  TKind extends LogicalEntityKind = LogicalEntityKind,
  TLocale extends LocaleCode = LocaleCode,
> = LocalizedVariantAvailability<TKind, TLocale>;

export function isPublicLocalizedVariant<
  TKind extends LogicalEntityKind,
  TLocale extends LocaleCode,
>(
  variant: LocalizedVariantAvailability<TKind, TLocale> | null | undefined,
): variant is PublishedLocalizedVariant<TKind, TLocale> {
  return variant?.publicationState === "published";
}
