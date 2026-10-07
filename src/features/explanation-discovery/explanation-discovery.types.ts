import type { PublicRouteFamily } from "@/config/routes";
import type { PaginatedResult } from "@/data/repositories/pagination";
import type { ExplanationArchiveSort } from "@/data/repositories/queries";
import type { CanonClassification } from "@/types/domain/canon";
import type { ExplanationSummary, ExplanationType } from "@/types/domain/explanation";

export interface ExplanationDiscoverySearchParams {
  readonly q?: string;
  readonly type?: string;
  readonly family?: string;
  readonly canon?: string;
  readonly sort?: string;
  readonly page?: string;
}

export interface ExplanationDiscoveryFilters {
  readonly query: string;
  readonly explanationType?: ExplanationType;
  readonly routeFamily?: PublicRouteFamily;
  readonly canonClassification?: CanonClassification;
  readonly sort: ExplanationArchiveSort;
  readonly page: number;
}

export type CuratedExplanationArchiveKey =
  | "ending"
  | "character"
  | "mystery"
  | "book-vs-screen";

export interface ExplanationDiscoveryDefinition {
  readonly key: "all" | CuratedExplanationArchiveKey;
  readonly route: string;
  readonly heading: string;
  readonly description: string;
  readonly resultsHeading: string;
  readonly lockedType?: ExplanationType;
}

export interface ExplanationDiscoveryViewModel {
  readonly definition: ExplanationDiscoveryDefinition;
  readonly filters: ExplanationDiscoveryFilters;
  readonly results: PaginatedResult<ExplanationSummary<"en-US">>;
  readonly featured?: ExplanationSummary<"en-US">;
}
