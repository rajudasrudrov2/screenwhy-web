import { getRepositories } from "@/data/repositories";
import { TITLE_ARCHIVES } from "./archive.config";
import { parseCharacterArchiveFilters, parseTitleArchiveFilters } from "./archive.utils";
import type { ArchiveSearchParams, CharacterArchiveViewModel, TitleArchiveViewModel } from "./archive.types";
import type { PublicRouteFamily } from "@/config/routes";

const ARCHIVE_PAGE_SIZE = 12;

export async function loadTitleArchive(routeFamily: PublicRouteFamily, params: ArchiveSearchParams): Promise<TitleArchiveViewModel> {
  const filters = parseTitleArchiveFilters(params);
  const definition = TITLE_ARCHIVES[routeFamily];
  const allowedGenre = definition.genreOptions.some((genre) => genre.slug === filters.genreSlug) ? filters.genreSlug : undefined;
  const allowedYear = definition.yearOptions.includes(filters.releaseYear ?? -1) ? filters.releaseYear : undefined;
  const normalizedFilters = { ...filters, genreSlug: allowedGenre, releaseYear: allowedYear };
  const repositories = getRepositories();
  const results = await repositories.titles.list({
    locale: "en-US",
    routeFamily,
    page: normalizedFilters.page,
    pageSize: ARCHIVE_PAGE_SIZE,
    query: normalizedFilters.query || undefined,
    genreSlug: normalizedFilters.genreSlug,
    releaseYear: normalizedFilters.releaseYear,
    sort: normalizedFilters.sort,
  });
  return { definition, filters: normalizedFilters, results };
}

export async function loadCharacterArchive(params: ArchiveSearchParams): Promise<CharacterArchiveViewModel> {
  const filters = parseCharacterArchiveFilters(params);
  const repositories = getRepositories();
  const results = await repositories.characters.list({
    locale: "en-US",
    page: filters.page,
    pageSize: ARCHIVE_PAGE_SIZE,
    query: filters.query || undefined,
    sort: filters.sort,
  });
  return { filters, results };
}
