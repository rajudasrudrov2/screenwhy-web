import type { PublicRouteFamily } from "@/config/routes";
import type { LocaleCode } from "@/lib/i18n/locales";
import type { CanonClassification } from "@/types/domain/canon";
import type { ExplanationType } from "@/types/domain/explanation";
import type {
  CharacterLogicalGroupId,
  TitleLogicalGroupId,
} from "@/types/domain/identity";
import type { PaginationQuery } from "@/data/repositories/pagination";

export interface TitleLookupQuery<TLocale extends LocaleCode = LocaleCode> {
  readonly locale: TLocale;
  readonly routeFamily: PublicRouteFamily;
  readonly slug: string;
}

export const TITLE_ARCHIVE_SORTS = [
  "title_asc",
  "title_desc",
  "release_newest",
  "release_oldest",
] as const;

export type TitleArchiveSort = (typeof TITLE_ARCHIVE_SORTS)[number];

export interface TitleListQuery<TLocale extends LocaleCode = LocaleCode>
  extends PaginationQuery {
  readonly locale: TLocale;
  readonly routeFamily?: PublicRouteFamily;
  readonly query?: string;
  readonly genreSlug?: string;
  readonly releaseYear?: number;
  readonly countrySlug?: string;
  readonly platformSlug?: string;
  readonly sort?: TitleArchiveSort;
}

export interface ExplanationLookupQuery<
  TLocale extends LocaleCode = LocaleCode,
> {
  readonly locale: TLocale;
  readonly slug: string;
}

export interface ExplanationListQuery<
  TLocale extends LocaleCode = LocaleCode,
> extends PaginationQuery {
  readonly locale: TLocale;
  readonly explanationType?: ExplanationType;
  readonly primaryTitleId?: TitleLogicalGroupId;
  readonly canonClassification?: CanonClassification;
}

export interface CharacterLookupQuery<
  TLocale extends LocaleCode = LocaleCode,
> {
  readonly locale: TLocale;
  readonly slug: string;
}

export const CHARACTER_ARCHIVE_SORTS = ["name_asc", "name_desc"] as const;

export type CharacterArchiveSort = (typeof CHARACTER_ARCHIVE_SORTS)[number];

export interface CharacterListQuery<TLocale extends LocaleCode = LocaleCode>
  extends PaginationQuery {
  readonly locale: TLocale;
  readonly titleLogicalId?: TitleLogicalGroupId;
  readonly query?: string;
  readonly sort?: CharacterArchiveSort;
}

export const SEARCH_ENTITY_KINDS = [
  "title",
  "explanation",
  "character",
] as const;

export type SearchEntityKind = (typeof SEARCH_ENTITY_KINDS)[number];

export interface SearchQuery<TLocale extends LocaleCode = LocaleCode>
  extends PaginationQuery {
  readonly locale: TLocale;
  readonly query: string;
  readonly kinds?: readonly SearchEntityKind[];
}

export interface RelationshipQuery {
  readonly titleLogicalId?: TitleLogicalGroupId;
  readonly characterLogicalId?: CharacterLogicalGroupId;
}

export type TimelineOrder = "chronology" | "presentation";

export interface TimelineQuery {
  readonly titleLogicalId: TitleLogicalGroupId;
  readonly characterLogicalId?: CharacterLogicalGroupId;
  readonly orderBy: TimelineOrder;
}
