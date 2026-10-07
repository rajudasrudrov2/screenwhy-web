import type { CharacterDetail } from "@/types/domain/character";
import {
  localizedIdentity,
  publishedVariant,
} from "@/data/fixtures/factories/localization";
import { serializedDateTime } from "@/data/fixtures/factories/fixture-values";
import { FIXTURE_IDS } from "@/data/fixtures/ids";
import {
  EXPLANATION_REFERENCES,
  TITLE_REFERENCES,
} from "@/data/fixtures/references";
import { MOCK_RELATIONSHIPS } from "@/data/fixtures/relationships";
import { MOCK_TIMELINE_EVENTS } from "@/data/fixtures/timeline";

const maraEnVariant = publishedVariant({
  kind: "character",
  locale: "en-US",
  variantKey: "variant:character:mara-vale:en-US",
  postId: 5001,
  slug: "mara-vale",
});

const eliasEnVariant = publishedVariant({
  kind: "character",
  locale: "en-US",
  variantKey: "variant:character:elias-vale:en-US",
  postId: 5002,
  slug: "elias-vale",
});

export const MOCK_CHARACTERS_EN: readonly CharacterDetail<"en-US">[] = Object.freeze([
  {
    identity: localizedIdentity({
      kind: "character",
      logicalId: FIXTURE_IDS.characters.maraVale,
      requestedLocale: "en-US",
      currentVariant: maraEnVariant,
    }),
    displayName: "Mara Vale",
    primaryTitleContext: TITLE_REFERENCES.lastSignalEn,
    spoilerFreeDescription:
      "A radio engineer who returns to the closed station after a new transmission appears.",
    fullDescription:
      "Mara is the senior radio engineer whose return to the abandoned Northline station places her at the center of the repeating-transmission mystery. Her choices are shaped by responsibility for Elias and by what she remembers about the station before it closed.",
    verification: {
      state: "fact_checked",
      sourceIds: [
        FIXTURE_IDS.sources.lastSignalFilm,
        FIXTURE_IDS.sources.lastSignalNovel,
      ],
    },
    aliases: ["M. Vale"],
    titleContexts: [TITLE_REFERENCES.lastSignalEn],
    performers: [
      {
        performerName: "Leona Hart",
        titleContext: TITLE_REFERENCES.lastSignalEn,
        versionScope: "fictional 2026 screen adaptation",
        roleNote: "Illustrative performer record; not a Person entity.",
      },
    ],
    statuses: [
      {
        characterId: FIXTURE_IDS.characters.maraVale,
        titleContext: TITLE_REFERENCES.lastSignalEn,
        canon: {
          classification: "movie_canon",
          scopes: [
            {
              target: {
                kind: "title",
                titleId: FIXTURE_IDS.titles.lastSignal,
              },
            },
          ],
        },
        status: "alive",
        effectiveInstallmentId: FIXTURE_IDS.installments.lastSignalPartTwo,
        spoiler: {
          level: "major",
          scope: {
            type: "installment",
            installmentId: FIXTURE_IDS.installments.lastSignalPartTwo,
          },
        },
        evidenceSourceIds: [FIXTURE_IDS.sources.lastSignalFilm],
        verificationState: "approved",
      },
      {
        characterId: FIXTURE_IDS.characters.maraVale,
        titleContext: TITLE_REFERENCES.lastSignalEn,
        canon: {
          classification: "novel_canon",
          scopes: [
            {
              target: {
                kind: "source_work",
                sourceWorkId: FIXTURE_IDS.sourceWorks.lastSignalNovel,
              },
            },
          ],
        },
        status: "deceased",
        spoiler: {
          level: "full",
          scope: {
            type: "source_work",
            sourceWorkId: FIXTURE_IDS.sourceWorks.lastSignalNovel,
          },
        },
        evidenceSourceIds: [FIXTURE_IDS.sources.lastSignalNovel],
        verificationState: "source_checked",
      },
    ],
    relationships: MOCK_RELATIONSHIPS,
    relatedExplanations: [
      EXPLANATION_REFERENCES.lastSignalCharacterEn,
      EXPLANATION_REFERENCES.lastSignalMysteryEn,
      EXPLANATION_REFERENCES.lastSignalQuestionEn,
      EXPLANATION_REFERENCES.lastSignalBookVsScreenEn,
      EXPLANATION_REFERENCES.lastSignalEndingEn,
      EXPLANATION_REFERENCES.lastSignalNextEn,
    ],
    importantTimelineEvents: MOCK_TIMELINE_EVENTS.filter(
      (event) => event.timelineEventId === FIXTURE_IDS.timeline.hiddenPlatformFlashback,
    ),
    editorialDates: {
      datePublished: serializedDateTime("2026-09-03T10:00:00+00:00"),
      dateModified: serializedDateTime("2026-09-14T10:00:00+00:00"),
      lastReviewed: serializedDateTime("2026-09-22T10:00:00+00:00"),
    },
    seo: {
      canonicalUrl: "https://screenwhy.com/characters/mara-vale/",
      index: false,
      breadcrumbLabel: "Mara Vale",
    },
  },
  {
    identity: localizedIdentity({
      kind: "character",
      logicalId: FIXTURE_IDS.characters.eliasVale,
      requestedLocale: "en-US",
      currentVariant: eliasEnVariant,
    }),
    displayName: "Elias Vale",
    primaryTitleContext: TITLE_REFERENCES.lastSignalEn,
    spoilerFreeDescription:
      "Mara's son, whose earlier visit to the station becomes central to the mystery.",
    verification: {
      state: "fact_checked",
      sourceIds: [FIXTURE_IDS.sources.lastSignalFilm],
    },
    titleContexts: [TITLE_REFERENCES.lastSignalEn],
    relationships: MOCK_RELATIONSHIPS,
    relatedExplanations: [EXPLANATION_REFERENCES.lastSignalBookVsScreenEn],
    editorialDates: {
      datePublished: serializedDateTime("2026-09-03T11:00:00+00:00"),
      dateModified: serializedDateTime("2026-09-14T11:00:00+00:00"),
      lastReviewed: serializedDateTime("2026-09-22T11:00:00+00:00"),
    },
    seo: {
      canonicalUrl: "https://screenwhy.com/characters/elias-vale/",
      index: false,
      breadcrumbLabel: "Elias Vale",
    },
  },
]);
