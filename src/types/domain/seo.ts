import type { LocaleCode } from "@/lib/i18n/locales";
import type { MediaAsset } from "@/types/domain/media";

export interface OpenGraphMetadata {
  readonly title?: string;
  readonly description?: string;
  readonly image?: MediaAsset;
}

export interface SeoMetadata {
  readonly title?: string;
  readonly metaDescription?: string;
  readonly canonicalUrl: string;
  readonly index: boolean;
  readonly follow?: boolean;
  readonly openGraph?: OpenGraphMetadata;
  readonly socialImage?: MediaAsset;
  readonly breadcrumbLabel?: string;
}
