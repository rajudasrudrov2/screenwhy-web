import type { Metadata } from "next";
import { SiteFrame } from "@/components/navigation/SiteFrame";
import { PUBLIC_HUB_ROUTES, type PublicRouteFamily } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { getRepositories } from "@/data/repositories";
import { CharacterArchivePage, TitleArchivePage } from "./ArchivePage";
import { TITLE_ARCHIVES } from "./archive.config";
import { loadCharacterArchive, loadTitleArchive } from "./archive.loader";
import { archiveBaseRoute, parseCharacterArchiveFilters, parseTitleArchiveFilters } from "./archive.utils";
import type { ArchiveSearchParams } from "./archive.types";

export type ArchiveRouteSearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export async function resolveArchiveSearchParams(searchParams: ArchiveRouteSearchParams): Promise<ArchiveSearchParams> {
  const params = await searchParams;
  return {
    q: first(params.q),
    genre: first(params.genre),
    year: first(params.year),
    country: first(params.country),
    platform: first(params.platform),
    sort: first(params.sort),
    page: first(params.page),
  };
}

function hasFacetOrSearch(params: ArchiveSearchParams, defaultSort: string): boolean {
  return Boolean(params.q?.trim() || params.genre || params.year || params.country || params.platform || (params.sort && params.sort !== defaultSort));
}

function paginationCanonical(baseRoute: string, page: number): string {
  return `${siteConfig.origin}${baseRoute}${page > 1 ? `?page=${page}` : ""}`;
}

export async function createTitleArchiveMetadata(routeFamily: PublicRouteFamily, params: ArchiveSearchParams): Promise<Metadata> {
  const definition = TITLE_ARCHIVES[routeFamily];
  const filters = parseTitleArchiveFilters(params);
  const filtered = hasFacetOrSearch(params, "title_asc");
  const baseRoute = archiveBaseRoute(routeFamily);
  const repositories = getRepositories();
  const availability = await repositories.titles.list({ locale: "en-US", routeFamily, page: 1, pageSize: 1 });
  const canonical = filtered ? `${siteConfig.origin}${baseRoute}` : paginationCanonical(baseRoute, filters.page);
  const index = siteConfig.allowIndexing && availability.totalItems > 0 && !filtered;
  const title = filters.page > 1 && !filtered ? `${definition.heading} — Page ${filters.page}` : definition.heading;
  return {
    title,
    description: definition.description,
    alternates: { canonical },
    robots: { index, follow: siteConfig.allowIndexing },
    openGraph: { title: `${title} | ScreenWhy`, description: definition.description, url: canonical, siteName: "ScreenWhy", type: "website" },
  };
}

export async function renderTitleArchiveRoute(routeFamily: PublicRouteFamily, params: ArchiveSearchParams) {
  const model = await loadTitleArchive(routeFamily, params);
  return <SiteFrame locale="en-US" activePath={archiveBaseRoute(routeFamily)}><TitleArchivePage model={model} /></SiteFrame>;
}

export async function createCharacterArchiveMetadata(params: ArchiveSearchParams): Promise<Metadata> {
  const filters = parseCharacterArchiveFilters(params);
  const filtered = hasFacetOrSearch(params, "name_asc");
  const repositories = getRepositories();
  const availability = await repositories.characters.list({ locale: "en-US", page: 1, pageSize: 1 });
  const canonical = filtered ? `${siteConfig.origin}${PUBLIC_HUB_ROUTES.characters}` : paginationCanonical(PUBLIC_HUB_ROUTES.characters, filters.page);
  const index = siteConfig.allowIndexing && availability.totalItems > 0 && !filtered;
  const title = filters.page > 1 && !filtered ? `Characters — Page ${filters.page}` : "Characters";
  const description = "Browse ScreenWhy characters for spoiler-safe story context, relationships and clear post-watch explanations.";
  return {
    title,
    description,
    alternates: { canonical },
    robots: { index, follow: siteConfig.allowIndexing },
    openGraph: { title: `${title} | ScreenWhy`, description, url: canonical, siteName: "ScreenWhy", type: "website" },
  };
}

export async function renderCharacterArchiveRoute(params: ArchiveSearchParams) {
  const model = await loadCharacterArchive(params);
  return <SiteFrame locale="en-US" activePath={PUBLIC_HUB_ROUTES.characters}><CharacterArchivePage model={model} /></SiteFrame>;
}
