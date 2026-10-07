import type { LocaleCode } from "@/lib/i18n/locales";
import type {
  LocalizedVariantId,
  LogicalEntityIdentity,
  LogicalEntityKind,
  WordPressPostId,
} from "@/types/domain/identity";

export type PrimaryLocale = "en-US";

export type LocalizedVariantPublicationState =
  | "not-created"
  | "draft"
  | "published"
  | "unpublished";

export interface PublishedLocalizedVariant<
  TKind extends LogicalEntityKind,
  TLocale extends LocaleCode,
> {
  readonly locale: TLocale;
  readonly publicationState: "published";
  readonly published: true;
  readonly variantId: LocalizedVariantId<TKind>;
  readonly wordpressPostId?: WordPressPostId;
  readonly slug: string;
}

export type UnavailableLocalizedVariant<
  TKind extends LogicalEntityKind,
  TLocale extends LocaleCode,
> =
  | {
      readonly locale: TLocale;
      readonly publicationState: "not-created";
      readonly published: false;
      readonly variantId?: never;
      readonly wordpressPostId?: never;
      readonly slug?: never;
    }
  | {
      readonly locale: TLocale;
      readonly publicationState: "draft" | "unpublished";
      readonly published: false;
      readonly variantId: LocalizedVariantId<TKind>;
      readonly wordpressPostId?: WordPressPostId;
      readonly slug?: string;
    };

export type LocalizedVariantAvailability<
  TKind extends LogicalEntityKind,
  TLocale extends LocaleCode,
> =
  | PublishedLocalizedVariant<TKind, TLocale>
  | UnavailableLocalizedVariant<TKind, TLocale>;

/**
 * Current public localization context. Logical identity remains independent
 * from the concrete release locale, while this frontend currently supports
 * only the published English variant.
 */
export interface LocalizationContext<
  TKind extends LogicalEntityKind,
  TLocale extends LocaleCode,
> {
  readonly requestedLocale: TLocale;
  readonly primaryLocale: PrimaryLocale;
  readonly currentVariant: PublishedLocalizedVariant<TKind, TLocale>;
}

export interface LocalizedEntityIdentity<
  TKind extends LogicalEntityKind,
  TLocale extends LocaleCode = LocaleCode,
> extends LogicalEntityIdentity<TKind> {
  readonly localization: LocalizationContext<TKind, TLocale>;
}

export type LocalizedLookupResult<
  TKind extends LogicalEntityKind,
  TLocale extends LocaleCode,
  TValue extends { readonly identity: LocalizedEntityIdentity<TKind, TLocale> },
> =
  | {
      readonly status: "available";
      readonly requestedLocale: TLocale;
      readonly value: TValue;
    }
  | {
      readonly status: "unavailable";
      readonly requestedLocale: TLocale;
      readonly value: null;
      readonly variant: UnavailableLocalizedVariant<TKind, TLocale>;
    };
