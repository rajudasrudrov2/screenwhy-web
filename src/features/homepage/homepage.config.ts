import {
  PUBLIC_HUB_ROUTES,
  localizedRoute,
  searchRoute,
  titleHubRoute,
} from "@/config/routes";
import type { ExplanationType } from "@/types/domain/explanation";
import type { HomepageGateway, HomepageLocale } from "./homepage.types";

export const FEATURED_EXPLANATION_TYPE_ORDER = [
  "ending_explained",
  "mystery_explained",
  "book_vs_screen",
] as const satisfies readonly ExplanationType[];

export const DISCOVERY_LANE_TYPES = Object.freeze({
  ending: ["ending_explained"],
  charactersMysteries: [
    "character_explained",
    "mystery_explained",
    "relationship_explained",
  ],
  next: ["what_happens_next"],
} as const satisfies Record<string, readonly ExplanationType[]>);

export function homepageGateways(locale: HomepageLocale): readonly HomepageGateway[] {
  return [
    {
      routeFamily: "movies",
      title: "Movies",
      description: "Endings, characters, scenes and adaptation questions.",
      href: titleHubRoute("movies", locale),
    },
    {
      routeFamily: "tv",
      title: "TV Shows",
      description: "Episodes, finales, timelines and ongoing mysteries.",
      href: titleHubRoute("tv", locale),
    },
    {
      routeFamily: "anime",
      title: "Anime",
      description: "Series and films with canon-aware explanation.",
      href: titleHubRoute("anime", locale),
    },
    {
      routeFamily: "k-drama",
      title: "K-Drama",
      description: "Characters, relationships, finales and what comes next.",
      href: titleHubRoute("k-drama", locale),
    },
  ];
}

export function homepageBrowseExplanationsHref(locale: HomepageLocale): string {
  return localizedRoute(PUBLIC_HUB_ROUTES.explanations, locale);
}

export function homepageSearchHref(locale: HomepageLocale): string {
  return searchRoute(locale);
}
