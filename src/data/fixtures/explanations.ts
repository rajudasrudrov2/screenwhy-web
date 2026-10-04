import type { ExplanationDetail } from "@/types/domain/explanation";
import type { UnavailableLocalizedVariant } from "@/types/domain/localization";
import {
  localizedIdentity,
  publishedVariant,
  unavailableVariant,
} from "@/data/fixtures/factories/localization";
import {
  articleBodyDocument,
  serializedDateTime,
} from "@/data/fixtures/factories/fixture-values";
import { FIXTURE_IDS } from "@/data/fixtures/ids";
import {
  CHARACTER_REFERENCES,
  EXPLANATION_REFERENCES,
  TITLE_REFERENCES,
} from "@/data/fixtures/references";
import { LAST_SIGNAL_SOURCE_WORK, MOCK_SOURCES } from "@/data/fixtures/sources";

const sourceById = (sourceId: (typeof MOCK_SOURCES)[number]["sourceId"]) => {
  const source = MOCK_SOURCES.find((item) => item.sourceId === sourceId);
  if (!source) {
    throw new Error(`Missing fixture source: ${sourceId}`);
  }
  return source;
};

const lastSignalMysteryEnVariant = publishedVariant({
  kind: "explanation",
  locale: "en-US",
  variantKey: "variant:explanation:last-signal-mystery:en-US",
  postId: 3001,
  slug: "why-the-final-signal-repeats",
});

const lastSignalMysteryBnVariant = publishedVariant({
  kind: "explanation",
  locale: "bn-BD",
  variantKey: "variant:explanation:last-signal-mystery:bn-BD",
  postId: 4001,
  slug: "shesh-songket-keno-fire-ase",
});

const lastSignalBookEnVariant = publishedVariant({
  kind: "explanation",
  locale: "en-US",
  variantKey: "variant:explanation:last-signal-book-vs-screen:en-US",
  postId: 3002,
  slug: "last-signal-book-vs-screen",
});

const lastSignalBookBnUnavailable = unavailableVariant({
  kind: "explanation",
  locale: "bn-BD",
  publicationState: "not-created",
});

const harborEndingEnVariant = publishedVariant({
  kind: "explanation",
  locale: "en-US",
  variantKey: "variant:explanation:harbor-nine-ending:en-US",
  postId: 3003,
  slug: "harbor-nine-ending-explained",
});

export const HARBOR_ENDING_BN_UNAVAILABLE = unavailableVariant({
  kind: "explanation",
  locale: "bn-BD",
  publicationState: "draft",
  variantKey: "variant:explanation:harbor-nine-ending:bn-BD",
  postId: 4003,
  slug: "harbor-nine-ending-bn-draft",
});

const author = {
  userId: FIXTURE_IDS.users.editorAvery,
  displayName: "Avery Quinn",
  roleTitle: "Demo Editor",
} as const;

const reviewer = {
  userId: FIXTURE_IDS.users.reviewerNoor,
  displayName: "Noor Hale",
  roleTitle: "Demo Reviewer",
} as const;

export const MOCK_EXPLANATIONS_EN: readonly ExplanationDetail<"en-US">[] = Object.freeze([
  {
    identity: localizedIdentity({
      kind: "explanation",
      logicalId: FIXTURE_IDS.explanations.lastSignalMystery,
      requestedLocale: "en-US",
      currentVariant: lastSignalMysteryEnVariant,
      counterpart: lastSignalMysteryBnVariant,
    }),
    articleTitle: "Why the Final Signal Repeats",
    excerpt:
      "A spoiler-free explanation of the repeating transmission pattern in the fictional film The Last Signal.",
    explanationType: "mystery_explained",
    primaryTitle: TITLE_REFERENCES.lastSignalEn,
    spoiler: {
      screen: {
        level: "spoiler_free",
        scope: {
          type: "full_title",
          titleId: FIXTURE_IDS.titles.lastSignal,
        },
      },
    },
    canon: {
      classification: "movie_canon",
      scopes: [
        {
          target: { kind: "title", titleId: FIXTURE_IDS.titles.lastSignal },
        },
      ],
    },
    verification: {
      state: "approved",
      sourceIds: [FIXTURE_IDS.sources.lastSignalFilm],
    },
    dates: {
      datePublished: serializedDateTime("2026-09-05T10:00:00+00:00"),
      dateModified: serializedDateTime("2026-09-12T08:30:00+00:00"),
      lastReviewed: serializedDateTime("2026-09-20T11:00:00+00:00"),
    },
    quickAnswer:
      "The repeated signal is a deliberate loop in the station system, not evidence that time itself is repeating.",
    body: {
      format: "structured_document",
      document: articleBodyDocument([
        {
          kind: "paragraph",
          text: "This fictional demo body exists only to exercise the opaque article boundary.",
        },
        {
          kind: "heading",
          level: 2,
          text: "What the signal pattern establishes",
        },
      ]),
    },
    relatedCharacters: [CHARACTER_REFERENCES.maraValeEn],
    relatedExplanations: [EXPLANATION_REFERENCES.lastSignalBookVsScreenEn],
    author,
    reviewerEditor: reviewer,
    publicationState: "published",
    editorialStage: "published",
    citations: [
      {
        source: sourceById(FIXTURE_IDS.sources.lastSignalFilm),
        claimSummary:
          "The fictional film establishes the signal loop as a station-system behavior.",
        sectionAnchor: "signal-loop",
        publicVisibility: true,
        verificationState: "approved",
      },
    ],
    seo: {
      canonicalUrl:
        "https://plotexplainer.com/explain/why-the-final-signal-repeats/",
      index: false,
      breadcrumbLabel: "Why the Final Signal Repeats",
      publishedLocaleAlternates: [
        {
          locale: "bn-BD",
          url: "https://plotexplainer.com/bn/explain/shesh-songket-keno-fire-ase/",
          published: true,
        },
      ],
    },
  },
  {
    identity: localizedIdentity({
      kind: "explanation",
      logicalId: FIXTURE_IDS.explanations.lastSignalBookVsScreen,
      requestedLocale: "en-US",
      currentVariant: lastSignalBookEnVariant,
      counterpart: lastSignalBookBnUnavailable,
    }),
    articleTitle: "The Last Signal: Book vs Screen Differences",
    excerpt:
      "A fictional adaptation comparison that exercises structured Canon Scope and source-material spoiler contracts.",
    explanationType: "book_vs_screen",
    primaryTitle: TITLE_REFERENCES.lastSignalEn,
    spoiler: {
      screen: {
        level: "minor",
        scope: {
          type: "full_title",
          titleId: FIXTURE_IDS.titles.lastSignal,
        },
      },
      sourceMaterial: {
        level: "major",
        sourceWorkId: FIXTURE_IDS.sourceWorks.lastSignalNovel,
        volume: 1,
        chapter: 18,
      },
    },
    canon: {
      classification: "adaptation_difference",
      scopes: [
        {
          target: { kind: "title", titleId: FIXTURE_IDS.titles.lastSignal },
          label: "Film continuity",
        },
        {
          target: {
            kind: "source_work",
            sourceWorkId: FIXTURE_IDS.sourceWorks.lastSignalNovel,
          },
          label: "Novel continuity",
        },
      ],
    },
    verification: {
      state: "fact_checked",
      sourceIds: [
        FIXTURE_IDS.sources.lastSignalFilm,
        FIXTURE_IDS.sources.lastSignalNovel,
      ],
    },
    dates: {
      datePublished: serializedDateTime("2026-09-08T09:00:00+00:00"),
      dateModified: serializedDateTime("2026-09-15T09:45:00+00:00"),
      lastReviewed: serializedDateTime("2026-09-21T13:20:00+00:00"),
    },
    quickAnswer:
      "The fictional screen version changes the transmitter's origin and keeps Mara's final status different from the novel continuity.",
    body: {
      format: "structured_document",
      document: articleBodyDocument([
        {
          kind: "paragraph",
          text: "This demonstration article compares two fictional continuity scopes without exposing a CMS block format.",
        },
      ]),
    },
    sourceWorks: [
      {
        sourceWorkId: LAST_SIGNAL_SOURCE_WORK.sourceWorkId,
        officialTitle: LAST_SIGNAL_SOURCE_WORK.officialTitle,
      },
    ],
    relatedCharacters: [
      CHARACTER_REFERENCES.maraValeEn,
      CHARACTER_REFERENCES.eliasValeEn,
    ],
    relatedExplanations: [EXPLANATION_REFERENCES.lastSignalMysteryEn],
    author,
    reviewerEditor: reviewer,
    publicationState: "published",
    editorialStage: "published",
    citations: [
      {
        source: sourceById(FIXTURE_IDS.sources.lastSignalFilm),
        claimSummary: "Film-continuity evidence for the adaptation comparison.",
        publicVisibility: true,
        verificationState: "approved",
      },
      {
        source: sourceById(FIXTURE_IDS.sources.lastSignalNovel),
        claimSummary: "Novel-continuity evidence for the adaptation comparison.",
        publicVisibility: true,
        verificationState: "source_checked",
      },
    ],
    seo: {
      canonicalUrl:
        "https://plotexplainer.com/explain/last-signal-book-vs-screen/",
      index: false,
      breadcrumbLabel: "The Last Signal: Book vs Screen",
    },
  },
  {
    identity: localizedIdentity({
      kind: "explanation",
      logicalId: FIXTURE_IDS.explanations.harborNineEnding,
      requestedLocale: "en-US",
      currentVariant: harborEndingEnVariant,
      counterpart: HARBOR_ENDING_BN_UNAVAILABLE,
    }),
    articleTitle: "Harbor Nine Ending Explained",
    excerpt:
      "A fictional major-spoiler explanation scoped to the season-one finale installment.",
    explanationType: "ending_explained",
    primaryTitle: TITLE_REFERENCES.harborNineEn,
    spoiler: {
      screen: {
        level: "major",
        scope: {
          type: "installment",
          installmentId: FIXTURE_IDS.installments.harborNineEpisodeEight,
        },
      },
    },
    canon: {
      classification: "tv_canon",
      scopes: [
        {
          target: { kind: "title", titleId: FIXTURE_IDS.titles.harborNine },
        },
      ],
    },
    verification: {
      state: "fact_checked",
      sourceIds: [FIXTURE_IDS.sources.harborNineEpisodeEight],
    },
    dates: {
      datePublished: serializedDateTime("2026-09-10T12:00:00+00:00"),
      dateModified: serializedDateTime("2026-09-11T08:00:00+00:00"),
      lastReviewed: serializedDateTime("2026-09-19T16:30:00+00:00"),
    },
    quickAnswer:
      "The blackout is triggered from inside the harbor control network, and the finale reveals why the warning pattern was staged.",
    body: {
      format: "structured_document",
      document: articleBodyDocument([
        {
          kind: "paragraph",
          text: "This fictional finale explanation is fixture content only.",
        },
      ]),
    },
    author,
    reviewerEditor: reviewer,
    publicationState: "published",
    editorialStage: "published",
    citations: [
      {
        source: sourceById(FIXTURE_IDS.sources.harborNineEpisodeEight),
        claimSummary: "Finale evidence for the fictional blackout explanation.",
        publicVisibility: true,
        verificationState: "fact_checked",
      },
    ],
    seo: {
      canonicalUrl:
        "https://plotexplainer.com/explain/harbor-nine-ending-explained/",
      index: false,
      breadcrumbLabel: "Harbor Nine Ending Explained",
    },
  },
]);

export const MOCK_EXPLANATIONS_BN: readonly ExplanationDetail<"bn-BD">[] = Object.freeze([
  {
    identity: localizedIdentity({
      kind: "explanation",
      logicalId: FIXTURE_IDS.explanations.lastSignalMystery,
      requestedLocale: "bn-BD",
      currentVariant: lastSignalMysteryBnVariant,
      counterpart: lastSignalMysteryEnVariant,
    }),
    articleTitle: "শেষ সংকেতটি কেন আবার ফিরে আসে",
    excerpt:
      "কাল্পনিক ছবি ‘শেষ সংকেত’-এর পুনরাবৃত্ত ট্রান্সমিশন নিয়ে স্পয়লার-মুক্ত ডেমো ব্যাখ্যা।",
    explanationType: "mystery_explained",
    primaryTitle: TITLE_REFERENCES.lastSignalBn,
    spoiler: {
      screen: {
        level: "spoiler_free",
        scope: {
          type: "full_title",
          titleId: FIXTURE_IDS.titles.lastSignal,
        },
      },
    },
    canon: {
      classification: "movie_canon",
      scopes: [
        {
          target: { kind: "title", titleId: FIXTURE_IDS.titles.lastSignal },
        },
      ],
    },
    verification: {
      state: "approved",
      sourceIds: [FIXTURE_IDS.sources.lastSignalFilm],
    },
    dates: {
      datePublished: serializedDateTime("2026-09-06T10:00:00+00:00"),
      dateModified: serializedDateTime("2026-09-13T08:30:00+00:00"),
      lastReviewed: serializedDateTime("2026-09-20T11:00:00+00:00"),
    },
    quickAnswer:
      "পুনরাবৃত্ত সংকেতটি স্টেশন সিস্টেমের ইচ্ছাকৃত লুপ; সময় নিজে পুনরাবৃত্ত হচ্ছে—এমন প্রমাণ নয়।",
    body: {
      format: "structured_document",
      document: articleBodyDocument([
        {
          kind: "paragraph",
          text: "এটি কেবল opaque article boundary যাচাইয়ের জন্য কাল্পনিক ডেমো কনটেন্ট।",
        },
      ]),
    },
    author,
    reviewerEditor: reviewer,
    publicationState: "published",
    editorialStage: "published",
    citations: [
      {
        source: sourceById(FIXTURE_IDS.sources.lastSignalFilm),
        claimSummary: "কাল্পনিক ছবির signal-loop সম্পর্কিত ডেমো evidence।",
        publicVisibility: true,
        verificationState: "approved",
      },
    ],
    seo: {
      canonicalUrl:
        "https://plotexplainer.com/bn/explain/shesh-songket-keno-fire-ase/",
      index: false,
      breadcrumbLabel: "শেষ সংকেতটি কেন আবার ফিরে আসে",
      publishedLocaleAlternates: [
        {
          locale: "en-US",
          url: "https://plotexplainer.com/explain/why-the-final-signal-repeats/",
          published: true,
        },
      ],
    },
  },
]);

export const MOCK_EXPLANATION_UNAVAILABLE_LOOKUPS = Object.freeze([
  {
    locale: "bn-BD",
    slug: "last-signal-book-vs-screen",
    variant: lastSignalBookBnUnavailable,
  },
  {
    locale: "bn-BD",
    slug: "harbor-nine-ending-explained",
    variant: HARBOR_ENDING_BN_UNAVAILABLE,
  },
] as const satisfies readonly {
  readonly locale: "bn-BD";
  readonly slug: string;
  readonly variant: UnavailableLocalizedVariant<"explanation", "bn-BD">;
}[]);
