import {
  LOCALE_PATH_PREFIX,
  stripLocalePrefix,
  type LocaleCode,
} from "@/lib/i18n/locales";

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
  titles: "/titles/",
  characters: "/characters/",
  explanations: "/explanations/",
  search: "/search/",
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

export function localizedRoute(pathname: string, locale: LocaleCode): string {
  const normalized = ensureTrailingSlash(
    stripLocalePrefix(pathname.startsWith("/") ? pathname : `/${pathname}`),
  );
  const prefix = LOCALE_PATH_PREFIX[locale];

  if (!prefix) return normalized;
  if (normalized === "/") return `${prefix}/`;

  return `${prefix}${normalized}`;
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
