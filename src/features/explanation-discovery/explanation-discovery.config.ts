import { EXPLANATION_DISCOVERY_ROUTES, PUBLIC_HUB_ROUTES } from "@/config/routes";
import type { CuratedExplanationArchiveKey, ExplanationDiscoveryDefinition } from "./explanation-discovery.types";

export const GENERAL_EXPLANATION_DISCOVERY: ExplanationDiscoveryDefinition = Object.freeze({
  key: "all",
  route: PUBLIC_HUB_ROUTES.explanations,
  heading: "Explanations",
  description:
    "Find clear post-watch answers about endings, characters, mysteries, scenes, relationships, timelines and the story questions that stay with you.",
  resultsHeading: "All Explanations",
});

export const CURATED_EXPLANATION_ARCHIVES: Readonly<Record<CuratedExplanationArchiveKey, ExplanationDiscoveryDefinition>> = Object.freeze({
  ending: {
    key: "ending",
    route: EXPLANATION_DISCOVERY_ROUTES.endingExplained,
    heading: "Ending Explained",
    description:
      "Understand what the ending means, what the final scenes confirm, and which details are interpretation rather than established canon.",
    resultsHeading: "Ending Explanations",
    lockedType: "ending_explained",
  },
  character: {
    key: "character",
    route: EXPLANATION_DISCOVERY_ROUTES.characterExplained,
    heading: "Character Explained",
    description:
      "Explore character choices, motivations, relationships and story roles through focused post-watch explanations.",
    resultsHeading: "Character Explanations",
    lockedType: "character_explained",
  },
  mystery: {
    key: "mystery",
    route: EXPLANATION_DISCOVERY_ROUTES.mysteryExplained,
    heading: "Mystery Explained",
    description:
      "Work through clues, unanswered questions and story mechanics without turning uncertainty into false certainty.",
    resultsHeading: "Mystery Explanations",
    lockedType: "mystery_explained",
  },
  "book-vs-screen": {
    key: "book-vs-screen",
    route: EXPLANATION_DISCOVERY_ROUTES.bookVsScreen,
    heading: "Book vs Screen",
    description:
      "Compare screen adaptations with their source material while keeping Canon differences and source-material spoilers clear.",
    resultsHeading: "Book vs Screen Explanations",
    lockedType: "book_vs_screen",
  },
});
