import type {
  CharacterReference,
  ExplanationReference,
  TitleReference,
} from "@/types/domain/references";
import { FIXTURE_IDS } from "@/data/fixtures/ids";

export const TITLE_REFERENCES = Object.freeze({
  lastSignalEn: {
    logicalId: FIXTURE_IDS.titles.lastSignal,
    locale: "en-US",
    slug: "the-last-signal",
    displayTitle: "The Last Signal",
    publicRouteFamily: "movies",
  } satisfies TitleReference,
  lastSignalBn: {
    logicalId: FIXTURE_IDS.titles.lastSignal,
    locale: "bn-BD",
    slug: "shesh-songket",
    displayTitle: "শেষ সংকেত",
    publicRouteFamily: "movies",
  } satisfies TitleReference,
  harborNineEn: {
    logicalId: FIXTURE_IDS.titles.harborNine,
    locale: "en-US",
    slug: "harbor-nine",
    displayTitle: "Harbor Nine",
    publicRouteFamily: "tv",
  } satisfies TitleReference,
  glassCometEn: {
    logicalId: FIXTURE_IDS.titles.glassComet,
    locale: "en-US",
    slug: "the-glass-comet",
    displayTitle: "The Glass Comet",
    publicRouteFamily: "anime",
  } satisfies TitleReference,
  winterVerdictEn: {
    logicalId: FIXTURE_IDS.titles.winterVerdict,
    locale: "en-US",
    slug: "winter-verdict",
    displayTitle: "Winter Verdict",
    publicRouteFamily: "k-drama",
  } satisfies TitleReference,
});

export const CHARACTER_REFERENCES = Object.freeze({
  maraValeEn: {
    logicalId: FIXTURE_IDS.characters.maraVale,
    locale: "en-US",
    slug: "mara-vale",
    displayName: "Mara Vale",
  } satisfies CharacterReference,
  eliasValeEn: {
    logicalId: FIXTURE_IDS.characters.eliasVale,
    locale: "en-US",
    slug: "elias-vale",
    displayName: "Elias Vale",
  } satisfies CharacterReference,
});

export const EXPLANATION_REFERENCES = Object.freeze({
  lastSignalMysteryEn: {
    logicalId: FIXTURE_IDS.explanations.lastSignalMystery,
    locale: "en-US",
    slug: "why-the-final-signal-repeats",
    articleTitle: "Why the Final Signal Repeats",
  } satisfies ExplanationReference,
  lastSignalMysteryBn: {
    logicalId: FIXTURE_IDS.explanations.lastSignalMystery,
    locale: "bn-BD",
    slug: "shesh-songket-keno-fire-ase",
    articleTitle: "শেষ সংকেতটি কেন আবার ফিরে আসে",
  } satisfies ExplanationReference,
  lastSignalBookVsScreenEn: {
    logicalId: FIXTURE_IDS.explanations.lastSignalBookVsScreen,
    locale: "en-US",
    slug: "last-signal-book-vs-screen",
    articleTitle: "The Last Signal: Book vs Screen Differences",
  } satisfies ExplanationReference,
  lastSignalCharacterEn: {
    logicalId: FIXTURE_IDS.explanations.lastSignalCharacter,
    locale: "en-US",
    slug: "why-mara-vale-keeps-the-station-key",
    articleTitle: "Why Mara Vale Keeps the Station Key",
  } satisfies ExplanationReference,
  lastSignalEndingEn: {
    logicalId: FIXTURE_IDS.explanations.lastSignalEnding,
    locale: "en-US",
    slug: "the-last-signal-ending-explained",
    articleTitle: "The Last Signal Ending Explained: What the Final Transmission Means",
  } satisfies ExplanationReference,
  lastSignalNextEn: {
    logicalId: FIXTURE_IDS.explanations.lastSignalNext,
    locale: "en-US",
    slug: "what-happens-after-the-last-signal",
    articleTitle: "What Happens After The Last Signal?",
  } satisfies ExplanationReference,
  lastSignalQuestionEn: {
    logicalId: FIXTURE_IDS.explanations.lastSignalQuestion,
    locale: "en-US",
    slug: "why-did-mara-hide-the-key",
    articleTitle: "Why Did Mara Hide the Station Key?",
  } satisfies ExplanationReference,
  harborNineEndingEn: {
    logicalId: FIXTURE_IDS.explanations.harborNineEnding,
    locale: "en-US",
    slug: "harbor-nine-ending-explained",
    articleTitle: "Harbor Nine Ending Explained",
  } satisfies ExplanationReference,
});
