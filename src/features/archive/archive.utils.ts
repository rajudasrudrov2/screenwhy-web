import { PUBLIC_HUB_ROUTES, type PublicRouteFamily } from "@/config/routes";
import { CHARACTER_ARCHIVE_SORTS, TITLE_ARCHIVE_SORTS, type CharacterArchiveSort, type TitleArchiveSort } from "@/data/repositories/queries";
import type { ArchiveSearchParams, CharacterArchiveFilters, TitleArchiveFilters } from "./archive.types";

const MAX_QUERY_LENGTH = 120;

function cleanQuery(value: string | undefined): string {
  return value?.trim().replace(/\s+/g, " ").slice(0, MAX_QUERY_LENGTH) ?? "";
}

function positivePage(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

function releaseYear(value: string | undefined): number | undefined {
  if (!/^\d{4}$/.test(value ?? "")) return undefined;
  const parsed = Number(value);
  return parsed >= 1888 && parsed <= 2200 ? parsed : undefined;
}

export function parseTitleArchiveFilters(params: ArchiveSearchParams): TitleArchiveFilters {
  const sort = TITLE_ARCHIVE_SORTS.includes(params.sort as TitleArchiveSort) ? params.sort as TitleArchiveSort : "title_asc";
  return {
    query: cleanQuery(params.q),
    genreSlug: params.genre?.trim() || undefined,
    releaseYear: releaseYear(params.year),
    sort,
    page: positivePage(params.page),
  };
}

export function parseCharacterArchiveFilters(params: ArchiveSearchParams): CharacterArchiveFilters {
  const sort = CHARACTER_ARCHIVE_SORTS.includes(params.sort as CharacterArchiveSort) ? params.sort as CharacterArchiveSort : "name_asc";
  return { query: cleanQuery(params.q), sort, page: positivePage(params.page) };
}

export function archiveBaseRoute(routeFamily: PublicRouteFamily): string {
  if (routeFamily === "k-drama") return PUBLIC_HUB_ROUTES.kDrama;
  return PUBLIC_HUB_ROUTES[routeFamily];
}

export function titleArchiveHref(routeFamily: PublicRouteFamily, filters: TitleArchiveFilters, page = filters.page): string {
  const params = new URLSearchParams();
  if (filters.query) params.set("q", filters.query);
  if (filters.genreSlug) params.set("genre", filters.genreSlug);
  if (filters.releaseYear) params.set("year", String(filters.releaseYear));
  if (filters.sort !== "title_asc") params.set("sort", filters.sort);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return `${archiveBaseRoute(routeFamily)}${query ? `?${query}` : ""}`;
}

export function characterArchiveHref(filters: CharacterArchiveFilters, page = filters.page): string {
  const params = new URLSearchParams();
  if (filters.query) params.set("q", filters.query);
  if (filters.sort !== "name_asc") params.set("sort", filters.sort);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return `${PUBLIC_HUB_ROUTES.characters}${query ? `?${query}` : ""}`;
}

export function titleArchiveHasFilters(filters: TitleArchiveFilters): boolean {
  return Boolean(filters.query || filters.genreSlug || filters.releaseYear || filters.sort !== "title_asc");
}

export function characterArchiveHasFilters(filters: CharacterArchiveFilters): boolean {
  return Boolean(filters.query || filters.sort !== "name_asc");
}
