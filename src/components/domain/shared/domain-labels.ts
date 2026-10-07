import type { LocaleCode } from "@/lib/i18n/locales";
import type { CanonClassification } from "@/types/domain/canon";
import type { ExplanationType } from "@/types/domain/explanation";
import type { SourceMaterialSpoilerLevel, SpoilerLevel } from "@/types/domain/spoiler";

export const canonLabels: Record<LocaleCode, Record<CanonClassification, string>> = {
  "en-US": {
    tv_canon: "TV Canon",
    movie_canon: "Movie Canon",
    novel_canon: "Novel Canon",
    book_canon: "Book Canon",
    manga_canon: "Manga Canon",
    game_canon: "Game Canon",
    adaptation_difference: "Adaptation Difference",
    interpretation: "Interpretation",
    unconfirmed_speculative: "Unconfirmed / Speculative",
  },
};

export const spoilerLabels: Record<LocaleCode, Record<SpoilerLevel, string>> = {
  "en-US": {
    spoiler_free: "Spoiler Free",
    minor: "Minor Spoilers",
    major: "Major Spoilers",
    full: "Full Spoilers",
  },
};

export const sourceMaterialSpoilerLabels: Record<LocaleCode, Record<SourceMaterialSpoilerLevel, string>> = {
  "en-US": {
    none: "No source-material spoilers",
    minor: "Minor source-material spoilers",
    major: "Major source-material spoilers",
    full: "Full source-material spoilers",
  },
};

export const explanationTypeLabels: Record<LocaleCode, Record<ExplanationType, string>> = {
  "en-US": {
    ending_explained: "Ending Explained",
    character_explained: "Character Explained",
    mystery_explained: "Mystery Explained",
    scene_explained: "Scene Explained",
    relationship_explained: "Relationship Explained",
    timeline_explained: "Timeline Explained",
    what_happens_next: "What Happens Next",
    book_vs_screen: "Book vs Screen",
    recap: "Recap",
    question_answer: "Question Answer",
  },
};
