import type { PublicRouteFamily } from "@/config/routes";
import type { TitleArchiveDefinition } from "./archive.types";

const GENRES = {
  mystery: { slug: "mystery", label: "Mystery" },
  scienceFiction: { slug: "science-fiction", label: "Science Fiction" },
} as const;

export const TITLE_ARCHIVES: Readonly<Record<PublicRouteFamily, TitleArchiveDefinition>> = Object.freeze({
  movies: {
    routeFamily: "movies",
    heading: "Movies",
    description: "Clear explanations for movie endings, characters, mysteries and the story questions that stay with you after the credits.",
    searchLabel: "Search movies",
    searchPlaceholder: "Search movies…",
    genreOptions: [GENRES.mystery, GENRES.scienceFiction],
    yearOptions: [2026],
  },
  tv: {
    routeFamily: "tv",
    heading: "TV Shows",
    description: "Understand TV stories, characters, endings and unanswered questions without wading through a database.",
    searchLabel: "Search TV shows",
    searchPlaceholder: "Search TV shows…",
    genreOptions: [GENRES.mystery],
    yearOptions: [2026],
  },
  anime: {
    routeFamily: "anime",
    heading: "Anime",
    description: "Understand anime characters, endings, mysteries and adaptation context with clear post-watch explanations.",
    searchLabel: "Search anime",
    searchPlaceholder: "Search anime…",
    genreOptions: [],
    yearOptions: [2025],
  },
  "k-drama": {
    routeFamily: "k-drama",
    heading: "K-Drama",
    description: "Clear post-watch answers for K-drama stories, characters, endings and the questions that matter after an episode or finale.",
    searchLabel: "Search K-dramas",
    searchPlaceholder: "Search K-dramas…",
    genreOptions: [],
    yearOptions: [2026],
  },
  documentaries: {
    routeFamily: "documentaries",
    heading: "Documentaries",
    description: "Browse ScreenWhy documentary coverage for clear context, story questions and explanations after watching.",
    searchLabel: "Search documentaries",
    searchPlaceholder: "Search documentaries…",
    genreOptions: [],
    yearOptions: [],
  },
});
