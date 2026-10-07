import type { PublicRouteFamily } from "@/config/routes";
import type { PaginatedResult } from "@/data/repositories/pagination";
import type { CharacterArchiveSort, TitleArchiveSort } from "@/data/repositories/queries";
import type { CharacterSummary } from "@/types/domain/character";
import type { ClassificationTerm, TitleSummary } from "@/types/domain/title";

export interface ArchiveSearchParams {
  readonly q?: string;
  readonly genre?: string;
  readonly year?: string;
  readonly country?: string;
  readonly platform?: string;
  readonly sort?: string;
  readonly page?: string;
}

export interface TitleArchiveFilters {
  readonly query: string;
  readonly genreSlug?: string;
  readonly releaseYear?: number;
  readonly sort: TitleArchiveSort;
  readonly page: number;
}

export interface CharacterArchiveFilters {
  readonly query: string;
  readonly sort: CharacterArchiveSort;
  readonly page: number;
}

export interface TitleArchiveDefinition {
  readonly routeFamily: PublicRouteFamily;
  readonly heading: string;
  readonly description: string;
  readonly searchLabel: string;
  readonly searchPlaceholder: string;
  readonly genreOptions: readonly ClassificationTerm[];
  readonly yearOptions: readonly number[];
}

export interface TitleArchiveViewModel {
  readonly definition: TitleArchiveDefinition;
  readonly filters: TitleArchiveFilters;
  readonly results: PaginatedResult<TitleSummary<"en-US">>;
}

export interface CharacterArchiveViewModel {
  readonly filters: CharacterArchiveFilters;
  readonly results: PaginatedResult<CharacterSummary<"en-US">>;
}
