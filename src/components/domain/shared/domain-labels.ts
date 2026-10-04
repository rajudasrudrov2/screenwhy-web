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
  "bn-BD": {
    tv_canon: "টিভি ক্যানন",
    movie_canon: "মুভি ক্যানন",
    novel_canon: "উপন্যাস ক্যানন",
    book_canon: "বই ক্যানন",
    manga_canon: "মাঙ্গা ক্যানন",
    game_canon: "গেম ক্যানন",
    adaptation_difference: "অ্যাডাপ্টেশন পার্থক্য",
    interpretation: "ব্যাখ্যামূলক বিশ্লেষণ",
    unconfirmed_speculative: "অনিশ্চিত / অনুমানভিত্তিক",
  },
};

export const spoilerLabels: Record<LocaleCode, Record<SpoilerLevel, string>> = {
  "en-US": {
    spoiler_free: "Spoiler Free",
    minor: "Minor Spoilers",
    major: "Major Spoilers",
    full: "Full Spoilers",
  },
  "bn-BD": {
    spoiler_free: "স্পয়লার-মুক্ত",
    minor: "সামান্য স্পয়লার",
    major: "গুরুত্বপূর্ণ স্পয়লার",
    full: "পূর্ণ স্পয়লার",
  },
};

export const sourceMaterialSpoilerLabels: Record<
  LocaleCode,
  Record<SourceMaterialSpoilerLevel, string>
> = {
  "en-US": {
    none: "No source-material spoilers",
    minor: "Minor source-material spoilers",
    major: "Major source-material spoilers",
    full: "Full source-material spoilers",
  },
  "bn-BD": {
    none: "উৎসকর্মে স্পয়লার নেই",
    minor: "উৎসকর্মে সামান্য স্পয়লার",
    major: "উৎসকর্মে গুরুত্বপূর্ণ স্পয়লার",
    full: "উৎসকর্মে পূর্ণ স্পয়লার",
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
  "bn-BD": {
    ending_explained: "শেষের ব্যাখ্যা",
    character_explained: "চরিত্রের ব্যাখ্যা",
    mystery_explained: "রহস্যের ব্যাখ্যা",
    scene_explained: "দৃশ্যের ব্যাখ্যা",
    relationship_explained: "সম্পর্কের ব্যাখ্যা",
    timeline_explained: "টাইমলাইনের ব্যাখ্যা",
    what_happens_next: "এরপর কী ঘটে",
    book_vs_screen: "বই বনাম স্ক্রিন",
    recap: "সংক্ষিপ্ত পুনরালোচনা",
    question_answer: "প্রশ্নের উত্তর",
  },
};
