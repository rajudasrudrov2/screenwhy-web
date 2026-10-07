import type { Metadata } from "next";
import { SiteFrame } from "@/components/navigation/SiteFrame";
import { PUBLIC_HUB_ROUTES } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { getRepositories } from "@/data/repositories";
import { ExplanationDiscovery } from "./ExplanationDiscovery";
import { CURATED_EXPLANATION_ARCHIVES, GENERAL_EXPLANATION_DISCOVERY } from "./explanation-discovery.config";
import { EXPLANATION_DISCOVERY_PAGE_SIZE, loadExplanationDiscovery } from "./explanation-discovery.loader";
import {
  curatedExplanationHref,
  curatedRouteForType,
  explanationDiscoveryHasIndexBlockingInput,
  parseExplanationDiscoveryFilters,
} from "./explanation-discovery.utils";
import type {
  CuratedExplanationArchiveKey,
  ExplanationDiscoverySearchParams,
} from "./explanation-discovery.types";

export type ExplanationDiscoveryRouteSearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export async function resolveExplanationDiscoverySearchParams(
  searchParams: ExplanationDiscoveryRouteSearchParams,
): Promise<ExplanationDiscoverySearchParams> {
  const params = await searchParams;
  return {
    q: first(params.q),
    type: first(params.type),
    family: first(params.family),
    canon: first(params.canon),
    sort: first(params.sort),
    page: first(params.page),
  };
}

function absolute(pathname: string): string {
  return `${siteConfig.origin}${pathname}`;
}

function generalCanonical(params: ExplanationDiscoverySearchParams): string {
  const filters = parseExplanationDiscoveryFilters(params);
  const curated = filters.explanationType ? curatedRouteForType(filters.explanationType) : undefined;
  if (curated) return absolute(curatedExplanationHref(curated, filters.page));
  if (explanationDiscoveryHasIndexBlockingInput(params)) return absolute(PUBLIC_HUB_ROUTES.explanations);
  return absolute(curatedExplanationHref(PUBLIC_HUB_ROUTES.explanations, filters.page));
}

export async function createExplanationDiscoveryMetadata(
  params: ExplanationDiscoverySearchParams,
  curatedKey?: CuratedExplanationArchiveKey,
): Promise<Metadata> {
  const repositories = getRepositories();
  const definition = curatedKey ? CURATED_EXPLANATION_ARCHIVES[curatedKey] : GENERAL_EXPLANATION_DISCOVERY;
  const parsed = parseExplanationDiscoveryFilters(params);
  const hasExtraCuratedQuery = Boolean(
    curatedKey &&
      (params.q?.trim() || params.type?.trim() || params.family?.trim() || params.canon?.trim() || params.sort?.trim()),
  );
  const page = parsed.page;
  const availability = await repositories.explanations.list({
    locale: "en-US",
    page,
    pageSize: EXPLANATION_DISCOVERY_PAGE_SIZE,
    explanationType: definition.lockedType ?? parsed.explanationType,
    query: curatedKey ? undefined : parsed.query || undefined,
    routeFamily: curatedKey ? undefined : parsed.routeFamily,
    canonClassification: curatedKey ? undefined : parsed.canonClassification,
    sort: curatedKey ? "updated_newest" : parsed.sort,
  });

  const filteredGeneral = !curatedKey && explanationDiscoveryHasIndexBlockingInput(params);
  const canonical = curatedKey
    ? absolute(curatedExplanationHref(definition.route, page))
    : generalCanonical(params);
  const index = siteConfig.allowIndexing && availability.totalItems > 0 && !filteredGeneral && !hasExtraCuratedQuery;
  const title = page > 1 && !filteredGeneral && !hasExtraCuratedQuery
    ? `${definition.heading} — Page ${page}`
    : definition.heading;

  return {
    title,
    description: definition.description,
    alternates: { canonical },
    robots: { index, follow: siteConfig.allowIndexing },
    openGraph: {
      title: `${title} | ScreenWhy`,
      description: definition.description,
      url: canonical,
      siteName: "ScreenWhy",
      type: "website",
    },
  };
}

export async function renderExplanationDiscoveryRoute(
  params: ExplanationDiscoverySearchParams,
  curatedKey?: CuratedExplanationArchiveKey,
) {
  const model = await loadExplanationDiscovery(params, curatedKey);
  return (
    <SiteFrame locale="en-US" activePath={PUBLIC_HUB_ROUTES.explanations}>
      <ExplanationDiscovery model={model} />
    </SiteFrame>
  );
}
