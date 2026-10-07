import {
  EXPLANATION_DISCOVERY_ROUTES,
  PUBLIC_HUB_ROUTES,
  PUBLIC_ROUTE_FAMILIES,
  type PublicRouteFamily,
} from "@/config/routes";
import {
  EXPLANATION_ARCHIVE_SORTS,
  type ExplanationArchiveSort,
} from "@/data/repositories/queries";
import {
  CANON_CLASSIFICATIONS,
  type CanonClassification,
} from "@/types/domain/canon";
import { EXPLANATION_TYPES, type ExplanationType } from "@/types/domain/explanation";
import type {
  ExplanationDiscoveryFilters,
  ExplanationDiscoverySearchParams,
} from "./explanation-discovery.types";

const MAX_QUERY_LENGTH = 120;

function cleanQuery(value: string | undefined): string {
  return value?.trim().replace(/\s+/g, " ").slice(0, MAX_QUERY_LENGTH) ?? "";
}

function positivePage(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

function isExplanationType(value: string | undefined): value is ExplanationType {
  return Boolean(value && EXPLANATION_TYPES.includes(value as ExplanationType));
}

function isRouteFamily(value: string | undefined): value is PublicRouteFamily {
  return Boolean(value && PUBLIC_ROUTE_FAMILIES.includes(value as PublicRouteFamily));
}

function isCanonClassification(value: string | undefined): value is CanonClassification {
  return Boolean(value && CANON_CLASSIFICATIONS.includes(value as CanonClassification));
}

function isExplanationSort(value: string | undefined): value is ExplanationArchiveSort {
  return Boolean(value && EXPLANATION_ARCHIVE_SORTS.includes(value as ExplanationArchiveSort));
}

export function parseExplanationDiscoveryFilters(
  params: ExplanationDiscoverySearchParams,
): ExplanationDiscoveryFilters {
  return {
    query: cleanQuery(params.q),
    explanationType: isExplanationType(params.type) ? params.type : undefined,
    routeFamily: isRouteFamily(params.family) ? params.family : undefined,
    canonClassification: isCanonClassification(params.canon) ? params.canon : undefined,
    sort: isExplanationSort(params.sort) ? params.sort : "updated_newest",
    page: positivePage(params.page),
  };
}

export function curatedRouteForType(type: ExplanationType): string | undefined {
  switch (type) {
    case "ending_explained":
      return EXPLANATION_DISCOVERY_ROUTES.endingExplained;
    case "character_explained":
      return EXPLANATION_DISCOVERY_ROUTES.characterExplained;
    case "mystery_explained":
      return EXPLANATION_DISCOVERY_ROUTES.mysteryExplained;
    case "book_vs_screen":
      return EXPLANATION_DISCOVERY_ROUTES.bookVsScreen;
    default:
      return undefined;
  }
}

export function explanationTypeDiscoveryHref(type: ExplanationType): string {
  const curated = curatedRouteForType(type);
  if (curated) return curated;
  const params = new URLSearchParams({ type });
  return `${PUBLIC_HUB_ROUTES.explanations}?${params.toString()}`;
}

export function explanationDiscoveryHref(
  filters: ExplanationDiscoveryFilters,
  page = filters.page,
): string {
  const params = new URLSearchParams();
  if (filters.query) params.set("q", filters.query);
  if (filters.explanationType) params.set("type", filters.explanationType);
  if (filters.routeFamily) params.set("family", filters.routeFamily);
  if (filters.canonClassification) params.set("canon", filters.canonClassification);
  if (filters.sort !== "updated_newest") params.set("sort", filters.sort);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return `${PUBLIC_HUB_ROUTES.explanations}${query ? `?${query}` : ""}`;
}

export function curatedExplanationHref(route: string, page: number): string {
  return `${route}${page > 1 ? `?page=${page}` : ""}`;
}

export function explanationDiscoveryHasFilters(filters: ExplanationDiscoveryFilters): boolean {
  return Boolean(
    filters.query ||
      filters.explanationType ||
      filters.routeFamily ||
      filters.canonClassification ||
      filters.sort !== "updated_newest",
  );
}

export function explanationDiscoveryHasIndexBlockingInput(
  params: ExplanationDiscoverySearchParams,
): boolean {
  return Boolean(
    params.q?.trim() ||
      params.type?.trim() ||
      params.family?.trim() ||
      params.canon?.trim() ||
      (params.sort?.trim() && params.sort !== "updated_newest"),
  );
}
