import { getRepositories } from "@/data/repositories";
import { CURATED_EXPLANATION_ARCHIVES, GENERAL_EXPLANATION_DISCOVERY } from "./explanation-discovery.config";
import { parseExplanationDiscoveryFilters } from "./explanation-discovery.utils";
import type {
  CuratedExplanationArchiveKey,
  ExplanationDiscoverySearchParams,
  ExplanationDiscoveryViewModel,
} from "./explanation-discovery.types";

export const EXPLANATION_DISCOVERY_PAGE_SIZE = 12;

export async function loadExplanationDiscovery(
  params: ExplanationDiscoverySearchParams,
  curatedKey?: CuratedExplanationArchiveKey,
): Promise<ExplanationDiscoveryViewModel> {
  const repositories = getRepositories();
  const definition = curatedKey
    ? CURATED_EXPLANATION_ARCHIVES[curatedKey]
    : GENERAL_EXPLANATION_DISCOVERY;
  const parsed = parseExplanationDiscoveryFilters(params);
  const filters = curatedKey
    ? {
        ...parsed,
        query: "",
        explanationType: definition.lockedType,
        routeFamily: undefined,
        canonClassification: undefined,
        sort: "updated_newest" as const,
      }
    : parsed;

  const [results, featuredPage] = await Promise.all([
    repositories.explanations.list({
      locale: "en-US",
      page: filters.page,
      pageSize: EXPLANATION_DISCOVERY_PAGE_SIZE,
      query: filters.query || undefined,
      explanationType: filters.explanationType,
      routeFamily: filters.routeFamily,
      canonClassification: filters.canonClassification,
      sort: filters.sort,
    }),
    curatedKey
      ? Promise.resolve(undefined)
      : repositories.explanations.list({
          locale: "en-US",
          page: 1,
          pageSize: 1,
          sort: "updated_newest",
        }),
  ]);

  return {
    definition,
    filters,
    results,
    featured: featuredPage?.items[0],
  };
}
