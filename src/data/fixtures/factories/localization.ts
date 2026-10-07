import type { LocaleCode } from "@/lib/i18n/locales";
import type {
  LocalizedVariantId,
  LogicalEntityKind,
  LogicalGroupId,
} from "@/types/domain/identity";
import type {
  LocalizedEntityIdentity,
  PublishedLocalizedVariant,
} from "@/types/domain/localization";
import {
  localizedVariantId,
  wordpressPostId,
} from "@/data/fixtures/factories/fixture-values";

export function publishedVariant<
  TKind extends LogicalEntityKind,
  TLocale extends LocaleCode,
>(input: {
  readonly kind: TKind;
  readonly locale: TLocale;
  readonly variantKey: string;
  readonly postId: number;
  readonly slug: string;
}): PublishedLocalizedVariant<TKind, TLocale> {
  return {
    locale: input.locale,
    publicationState: "published",
    published: true,
    variantId: localizedVariantId(input.kind, input.variantKey),
    wordpressPostId: wordpressPostId(input.postId),
    slug: input.slug,
  };
}

export function localizedIdentity<
  TKind extends LogicalEntityKind,
  TLocale extends LocaleCode,
>(input: {
  readonly kind: TKind;
  readonly logicalId: LogicalGroupId<TKind>;
  readonly requestedLocale: TLocale;
  readonly currentVariant: PublishedLocalizedVariant<TKind, TLocale>;
}): LocalizedEntityIdentity<TKind, TLocale> {
  return {
    kind: input.kind,
    logicalId: input.logicalId,
    localization: {
      requestedLocale: input.requestedLocale,
      primaryLocale: "en-US",
      currentVariant: input.currentVariant,
    },
  };
}

export function variantIdValue<TKind extends LogicalEntityKind>(
  value: LocalizedVariantId<TKind>,
): string {
  return value;
}
