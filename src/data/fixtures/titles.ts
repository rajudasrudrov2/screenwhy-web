import type { TitleDetail } from "@/types/domain/title";
import {
  localizedIdentity,
  publishedVariant,
} from "@/data/fixtures/factories/localization";
import {
  serializedDate,
  serializedDateTime,
  titleReleaseStatus,
} from "@/data/fixtures/factories/fixture-values";
import { FIXTURE_IDS } from "@/data/fixtures/ids";
import { MOCK_INSTALLMENTS } from "@/data/fixtures/installments";
import {
  CHARACTER_REFERENCES,
  EXPLANATION_REFERENCES,
  TITLE_REFERENCES,
} from "@/data/fixtures/references";
import { LAST_SIGNAL_SOURCE_WORK } from "@/data/fixtures/sources";

const lastSignalEnVariant = publishedVariant({
  kind: "title",
  locale: "en-US",
  variantKey: "variant:title:last-signal:en-US",
  postId: 1001,
  slug: "the-last-signal",
});

const harborNineEnVariant = publishedVariant({
  kind: "title",
  locale: "en-US",
  variantKey: "variant:title:harbor-nine:en-US",
  postId: 1002,
  slug: "harbor-nine",
});

const glassCometEnVariant = publishedVariant({
  kind: "title",
  locale: "en-US",
  variantKey: "variant:title:glass-comet:en-US",
  postId: 1003,
  slug: "the-glass-comet",
});

const winterVerdictEnVariant = publishedVariant({
  kind: "title",
  locale: "en-US",
  variantKey: "variant:title:winter-verdict:en-US",
  postId: 1004,
  slug: "winter-verdict",
});

const commonEditorDates = {
  datePublished: serializedDateTime("2026-09-01T10:00:00+00:00"),
  dateModified: serializedDateTime("2026-09-18T12:00:00+00:00"),
  lastReviewed: serializedDateTime("2026-09-20T09:30:00+00:00"),
} as const;

export const MOCK_TITLES_EN: readonly TitleDetail<"en-US">[] = Object.freeze([
  {
    identity: localizedIdentity({
      kind: "title",
      logicalId: FIXTURE_IDS.titles.lastSignal,
      requestedLocale: "en-US",
      currentVariant: lastSignalEnVariant,
    }),
    displayTitle: "The Last Signal",
    titleType: "movie",
    publicRouteFamily: "movies",
    releaseYear: 2026,
    genres: [
      { slug: "science-fiction", label: "Science Fiction" },
      { slug: "mystery", label: "Mystery" },
    ],
    verification: {
      state: "approved",
      sourceIds: [FIXTURE_IDS.sources.lastSignalFilm],
      verifiedAt: serializedDateTime("2026-09-20T09:30:00+00:00"),
      verifiedBy: FIXTURE_IDS.users.reviewerNoor,
    },
    spoilerFreePremise:
      "A radio engineer receives a repeating transmission from a station that was closed years earlier.",
    originalTitle: "The Last Signal",
    release: {
      releaseDate: serializedDate("2026-03-14"),
      releaseYear: 2026,
      releaseStatus: titleReleaseStatus("released"),
      runtimeMinutes: 118,
    },
    classifications: {
      genres: [
        { slug: "science-fiction", label: "Science Fiction" },
        { slug: "mystery", label: "Mystery" },
      ],
      countries: [{ slug: "fictional-north-coast", label: "North Coast" }],
      originalLanguages: [{ slug: "english", label: "English" }],
      primaryOriginalLanguage: { slug: "english", label: "English" },
    },
    directors: [{ name: "Mina Calder" }],
    installments: MOCK_INSTALLMENTS.filter(
      (item) => item.titleId === FIXTURE_IDS.titles.lastSignal,
    ),
    importantCharacters: [
      CHARACTER_REFERENCES.maraValeEn,
      CHARACTER_REFERENCES.eliasValeEn,
    ],
    relatedExplanations: [
      EXPLANATION_REFERENCES.lastSignalEndingEn,
      EXPLANATION_REFERENCES.lastSignalMysteryEn,
      EXPLANATION_REFERENCES.lastSignalBookVsScreenEn,
      EXPLANATION_REFERENCES.lastSignalNextEn,
    ],
    relatedTitles: [
      { relationshipType: "shared_story_context", title: TITLE_REFERENCES.harborNineEn },
      { relationshipType: "related_to", title: TITLE_REFERENCES.glassCometEn },
      { relationshipType: "related_to", title: TITLE_REFERENCES.winterVerdictEn },
    ],
    sourceWorks: [
      { relationshipType: "adapted_from", sourceWork: LAST_SIGNAL_SOURCE_WORK },
    ],
    editorialDates: commonEditorDates,
    seo: {
      title: "The Last Signal — ScreenWhy Demo Title",
      metaDescription:
        "Fictional demonstration title used to validate ScreenWhy frontend contracts.",
      canonicalUrl: "https://screenwhy.com/movies/the-last-signal/",
      index: false,
      breadcrumbLabel: "The Last Signal",
    },
  },
  {
    identity: localizedIdentity({
      kind: "title",
      logicalId: FIXTURE_IDS.titles.harborNine,
      requestedLocale: "en-US",
      currentVariant: harborNineEnVariant,
    }),
    displayTitle: "Harbor Nine",
    titleType: "tv_series",
    publicRouteFamily: "tv",
    releaseYear: 2026,
    genres: [{ slug: "mystery", label: "Mystery" }],
    verification: {
      state: "fact_checked",
      sourceIds: [FIXTURE_IDS.sources.harborNineEpisodeEight],
    },
    spoilerFreePremise:
      "Nine night-shift workers maintain an automated harbor where the warning lights begin failing in a deliberate pattern.",
    release: {
      releaseDate: serializedDate("2026-07-03"),
      releaseYear: 2026,
      releaseStatus: titleReleaseStatus("ongoing"),
      seasonCount: 1,
      episodeCount: 8,
    },
    classifications: {
      genres: [{ slug: "mystery", label: "Mystery" }],
      originalLanguages: [{ slug: "english", label: "English" }],
    },
    installments: MOCK_INSTALLMENTS.filter(
      (item) => item.titleId === FIXTURE_IDS.titles.harborNine,
    ),
    relatedExplanations: [EXPLANATION_REFERENCES.harborNineEndingEn],
    relatedTitles: [
      {
        relationshipType: "shared_story_context",
        title: {
          logicalId: FIXTURE_IDS.titles.lastSignal,
          locale: "en-US",
          slug: "the-last-signal",
          displayTitle: "The Last Signal",
          publicRouteFamily: "movies",
        },
      },
    ],
    editorialDates: commonEditorDates,
    seo: {
      canonicalUrl: "https://screenwhy.com/tv/harbor-nine/",
      index: false,
      breadcrumbLabel: "Harbor Nine",
    },
  },
  {
    identity: localizedIdentity({
      kind: "title",
      logicalId: FIXTURE_IDS.titles.glassComet,
      requestedLocale: "en-US",
      currentVariant: glassCometEnVariant,
    }),
    displayTitle: "The Glass Comet",
    titleType: "tv_series",
    publicRouteFamily: "anime",
    releaseYear: 2025,
    verification: { state: "source_checked" },
    spoilerFreePremise:
      "A student astronomy club tracks a translucent comet that seems to alter memories each time it passes.",
    release: {
      releaseYear: 2025,
      releaseStatus: titleReleaseStatus("released"),
      seasonCount: 1,
      episodeCount: 12,
    },
    classifications: {
      originalLanguages: [{ slug: "japanese", label: "Japanese" }],
    },
    editorialDates: commonEditorDates,
    seo: {
      canonicalUrl: "https://screenwhy.com/anime/the-glass-comet/",
      index: false,
      breadcrumbLabel: "The Glass Comet",
    },
  },
  {
    identity: localizedIdentity({
      kind: "title",
      logicalId: FIXTURE_IDS.titles.winterVerdict,
      requestedLocale: "en-US",
      currentVariant: winterVerdictEnVariant,
    }),
    displayTitle: "Winter Verdict",
    titleType: "tv_series",
    publicRouteFamily: "k-drama",
    releaseYear: 2026,
    verification: { state: "source_checked" },
    spoilerFreePremise:
      "A public defender reopens a sealed winter case after receiving evidence written in her own handwriting.",
    release: {
      releaseYear: 2026,
      releaseStatus: titleReleaseStatus("released"),
      seasonCount: 1,
      episodeCount: 10,
    },
    classifications: {
      originalLanguages: [{ slug: "korean", label: "Korean" }],
    },
    editorialDates: commonEditorDates,
    seo: {
      canonicalUrl: "https://screenwhy.com/k-drama/winter-verdict/",
      index: false,
      breadcrumbLabel: "Winter Verdict",
    },
  },
]);
