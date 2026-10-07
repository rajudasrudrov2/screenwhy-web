import type { LocaleCode } from "@/lib/i18n/locales";

// Editorial/public discovery classification; intentionally not a taxonomy.
export const PUBLIC_ROUTE_FAMILIES = [
  "movies",
  "tv",
  "anime",
  "k-drama",
  "documentaries",
] as const;

export type PublicRouteFamily = (typeof PUBLIC_ROUTE_FAMILIES)[number];

export const PUBLIC_HUB_ROUTES = {
  home: "/",
  movies: "/movies/",
  tv: "/tv/",
  anime: "/anime/",
  kDrama: "/k-drama/",
  documentaries: "/documentaries/",
  characters: "/characters/",
  explanations: "/explanations/",
  search: "/search/",
} as const;

export const EXPLANATION_DISCOVERY_ROUTES = {
  all: PUBLIC_HUB_ROUTES.explanations,
  endingExplained: "/explanations/ending-explained/",
  characterExplained: "/explanations/character-explained/",
  mysteryExplained: "/explanations/mystery-explained/",
  bookVsScreen: "/explanations/book-vs-screen/",
} as const;

export const EDITORIAL_ROUTES = {
  about: "/about/",
  contact: "/contact/",
  editorialPolicy: "/editorial-policy/",
  sourcingPolicy: "/sourcing-policy/",
  correctionsPolicy: "/corrections-policy/",
  aiUsagePolicy: "/ai-usage-policy/",
  privacy: "/privacy/",
  terms: "/terms/",
  copyrightDmca: "/copyright-dmca/",
} as const;

export const PUBLIC_INDEXABLE_STATIC_ROUTES = [
  PUBLIC_HUB_ROUTES.home,
  PUBLIC_HUB_ROUTES.movies,
  PUBLIC_HUB_ROUTES.tv,
  PUBLIC_HUB_ROUTES.anime,
  PUBLIC_HUB_ROUTES.kDrama,
  PUBLIC_HUB_ROUTES.documentaries,
  PUBLIC_HUB_ROUTES.characters,
  PUBLIC_HUB_ROUTES.explanations,
  EXPLANATION_DISCOVERY_ROUTES.endingExplained,
  EXPLANATION_DISCOVERY_ROUTES.characterExplained,
  EXPLANATION_DISCOVERY_ROUTES.mysteryExplained,
  EXPLANATION_DISCOVERY_ROUTES.bookVsScreen,
  ...Object.values(EDITORIAL_ROUTES),
] as const;

function cleanSegment(value: string, label: string): string {
  const segment = value.trim().replace(/^\/+|\/+$/g, "");

  if (!segment || segment.includes("/")) {
    throw new Error(`${label} must be exactly one non-empty URL segment.`);
  }

  return segment;
}

function ensureTrailingSlash(pathname: string): string {
  if (pathname === "/") return pathname;
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

export function localizedRoute(pathname: string, _locale: LocaleCode): string {
  return ensureTrailingSlash(pathname.startsWith("/") ? pathname : `/${pathname}`);
}

export function titleHubRoute(
  routeFamily: PublicRouteFamily,
  locale: LocaleCode = "en-US",
): string {
  return localizedRoute(`/${routeFamily}/`, locale);
}

export function titleRoute(
  routeFamily: PublicRouteFamily,
  slug: string,
  locale: LocaleCode = "en-US",
): string {
  return localizedRoute(
    `/${routeFamily}/${cleanSegment(slug, "Title slug")}/`,
    locale,
  );
}

export function relationshipRoute(
  routeFamily: PublicRouteFamily,
  titleSlug: string,
  characterASlug: string,
  characterBSlug: string,
  locale: LocaleCode = "en-US",
): string {
  return localizedRoute(
    `/${routeFamily}/${cleanSegment(titleSlug, "Title slug")}/relationships/${cleanSegment(characterASlug, "Character A slug")}/${cleanSegment(characterBSlug, "Character B slug")}/`,
    locale,
  );
}

export function timelineRoute(
  routeFamily: PublicRouteFamily,
  titleSlug: string,
  order: "chronology" | "presentation" = "chronology",
  locale: LocaleCode = "en-US",
): string {
  const pathname = localizedRoute(
    `/${routeFamily}/${cleanSegment(titleSlug, "Title slug")}/timeline/`,
    locale,
  );
  return order === "presentation" ? `${pathname}?order=presentation` : pathname;
}

export function characterRoute(
  slug: string,
  locale: LocaleCode = "en-US",
): string {
  return localizedRoute(
    `/characters/${cleanSegment(slug, "Character slug")}/`,
    locale,
  );
}

export function explanationRoute(
  slug: string,
  locale: LocaleCode = "en-US",
): string {
  return localizedRoute(
    `/explain/${cleanSegment(slug, "Explanation slug")}/`,
    locale,
  );
}

export function searchRoute(locale: LocaleCode = "en-US"): string {
  return localizedRoute(PUBLIC_HUB_ROUTES.search, locale);
}
