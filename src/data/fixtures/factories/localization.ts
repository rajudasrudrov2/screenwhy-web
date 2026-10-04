import type { LocaleCode } from "@/lib/i18n/locales";
import type {
  LocalizedVariantId,
  LogicalEntityKind,
  LogicalGroupId,
} from "@/types/domain/identity";
import type {
  CounterpartLocale,
  LocalizedEntityIdentity,
  PublishedLocalizedVariant,
  UnavailableLocalizedVariant,
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

export function unavailableVariant<
  TKind extends LogicalEntityKind,
  TLocale extends LocaleCode,
>(input: {
  readonly kind: TKind;
  readonly locale: TLocale;
  readonly publicationState: "not-created" | "draft" | "unpublished";
  readonly variantKey?: string;
  readonly postId?: number;
  readonly slug?: string;
}): UnavailableLocalizedVariant<TKind, TLocale> {
  if (input.publicationState === "not-created") {
    return {
      locale: input.locale,
      publicationState: "not-created",
      published: false,
    };
  }

  return {
    locale: input.locale,
    publicationState: input.publicationState,
    published: false,
    variantId: localizedVariantId(
      input.kind,
      input.variantKey ?? `${input.kind}:${input.locale}:fixture-unpublished`,
    ),
    wordpressPostId:
      input.postId === undefined ? undefined : wordpressPostId(input.postId),
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
  readonly counterpart:
    | PublishedLocalizedVariant<TKind, CounterpartLocale<TLocale>>
    | UnavailableLocalizedVariant<TKind, CounterpartLocale<TLocale>>;
}): LocalizedEntityIdentity<TKind, TLocale> {
  return {
    kind: input.kind,
    logicalId: input.logicalId,
    localization: {
      requestedLocale: input.requestedLocale,
      primaryLocale: "en-US",
      currentVariant: input.currentVariant,
      counterpart: input.counterpart,
    },
  };
}

export interface UnavailableLookupAlias<
  TKind extends LogicalEntityKind,
  TLocale extends LocaleCode,
> {
  readonly locale: TLocale;
  readonly slug: string;
  readonly variant: UnavailableLocalizedVariant<TKind, TLocale>;
}

export function variantIdValue<TKind extends LogicalEntityKind>(
  value: LocalizedVariantId<TKind>,
): string {
  return value;
}
