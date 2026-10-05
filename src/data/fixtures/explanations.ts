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

const lastSignalCharacterEnVariant = publishedVariant({
  kind: "explanation",
  locale: "en-US",
  variantKey: "variant:explanation:last-signal-character:en-US",
  postId: 3004,
  slug: "why-mara-vale-keeps-the-station-key",
});

const lastSignalCharacterBnUnavailable = unavailableVariant({
  kind: "explanation",
  locale: "bn-BD",
  publicationState: "not-created",
});

const lastSignalEndingEnVariant = publishedVariant({
  kind: "explanation",
  locale: "en-US",
  variantKey: "variant:explanation:last-signal-ending:en-US",
  postId: 3006,
  slug: "the-last-signal-ending-explained",
});

const lastSignalEndingBnUnavailable = unavailableVariant({
  kind: "explanation",
  locale: "bn-BD",
  publicationState: "not-created",
});

const lastSignalNextEnVariant = publishedVariant({
  kind: "explanation",
  locale: "en-US",
  variantKey: "variant:explanation:last-signal-next:en-US",
  postId: 3007,
  slug: "what-happens-after-the-last-signal",
});

const lastSignalNextBnUnavailable = unavailableVariant({
  kind: "explanation",
  locale: "bn-BD",
  publicationState: "not-created",
});

const lastSignalQuestionEnVariant = publishedVariant({
  kind: "explanation",
  locale: "en-US",
  variantKey: "variant:explanation:last-signal-question:en-US",
  postId: 3008,
  slug: "why-did-mara-hide-the-key",
});

const lastSignalQuestionBnUnavailable = unavailableVariant({
  kind: "explanation",
  locale: "bn-BD",
  publicationState: "not-created",
});

const harborNineNextEnVariant = publishedVariant({
  kind: "explanation",
  locale: "en-US",
  variantKey: "variant:explanation:harbor-nine-next:en-US",
  postId: 3005,
  slug: "what-harbor-nine-sets-up-after-the-blackout",
});

const harborNineNextBnUnavailable = unavailableVariant({
  kind: "explanation",
  locale: "bn-BD",
  publicationState: "not-created",
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
    intendedSubjectQuestion: "Why does the final signal repeat at the end?",
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
        "https://screenwhy.com/explain/why-the-final-signal-repeats/",
      index: false,
      breadcrumbLabel: "Why the Final Signal Repeats",
      publishedLocaleAlternates: [
        {
          locale: "bn-BD",
          url: "https://screenwhy.com/bn/explain/shesh-songket-keno-fire-ase/",
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
      "The fictional screen version changes the transmitter's origin and keeps Mara's final status different from the novel continuity. The core mystery stays recognizable, but the two versions reach it through different cause-and-effect rules.",
    intendedSubjectQuestion: "What changes between The Last Signal film and the novel?",
    body: {
      format: "structured_document",
      document: articleBodyDocument({
        version: "screenwhy_mock_article_v1",
        intro: [
          {
            kind: "paragraph",
            content: [
              { kind: "text", text: "The film and novel share the same fictional station mystery, but they do not use the same mechanism to explain it. The safest way to compare them is to separate confirmed screen events from source-material details instead of treating the two continuities as interchangeable." },
            ],
          },
        ],
        sections: [
          {
            stableKey: "screen-version-change",
            heading: "What the screen version changes",
            level: 2,
            blocks: [
              {
                kind: "paragraph",
                content: [
                  { kind: "text", text: "In the fictional film, the repeating transmission is tied to the station system itself. The sequence establishes that Mara is responding to a controlled loop rather than a literal reset of time." },
                  { kind: "citation", citationNumber: 1 },
                ],
              },
              {
                kind: "image",
                media: {
                  role: "editorial_image",
                  url: "/demo/last-signal-platform.svg",
                  alt: "Illustrative diagram of the fictional Last Signal station platform and repeating transmitter pulse",
                  width: 1280,
                  height: 720,
                  caption: "Illustrative ScreenWhy demo image for the fictional station sequence.",
                },
                credit: "ScreenWhy fictional demo artwork",
              },
              {
                kind: "canon_note",
                context: {
                  classification: "movie_canon",
                  scopes: [
                    { target: { kind: "title", titleId: FIXTURE_IDS.titles.lastSignal }, label: "Film continuity" },
                  ],
                },
                text: "The station-system loop is established within the fictional film continuity. It should not be generalized to the novel without separate source evidence.",
              },
            ],
          },
          {
            stableKey: "transmitter-origin",
            heading: "Why the transmitter origin matters",
            level: 2,
            blocks: [
              {
                kind: "paragraph",
                content: [
                  { kind: "text", text: "The novel moves the transmitter's origin away from the station. That change sounds small, but it shifts the story from a closed technical loop toward a broader chain of events outside Mara's direct control." },
                  { kind: "citation", citationNumber: 2 },
                ],
              },
              {
                kind: "list",
                items: [
                  [{ kind: "text", text: "Film: the loop is contained within the station system." }],
                  [{ kind: "text", text: "Novel: the signal depends on a source beyond the station." }],
                  [{ kind: "text", text: "Result: the same mystery points toward different causal explanations." }],
                ],
              },
              {
                kind: "canon_note",
                context: {
                  classification: "adaptation_difference",
                  scopes: [
                    { target: { kind: "title", titleId: FIXTURE_IDS.titles.lastSignal }, label: "Film continuity" },
                    { target: { kind: "source_work", sourceWorkId: FIXTURE_IDS.sourceWorks.lastSignalNovel }, label: "Novel continuity" },
                  ],
                },
                text: "This is an adaptation difference, not evidence that one continuity silently overrides the other.",
              },
            ],
            sections: [
              {
                stableKey: "wording-clue",
                heading: "The wording is the clue",
                level: 3,
                blocks: [
                  {
                    kind: "blockquote",
                    content: [
                      { kind: "text", text: "The important distinction is not whether a signal repeats, but what system is capable of producing the repetition." },
                    ],
                    attribution: "ScreenWhy fictional editorial summary",
                  },
                ],
              },
            ],
          },
          {
            stableKey: "novel-difference",
            heading: "What the novel keeps different",
            level: 2,
            blocks: [
              {
                kind: "spoiler",
                metadata: {
                  sourceMaterial: {
                    level: "major",
                    sourceWorkId: FIXTURE_IDS.sourceWorks.lastSignalNovel,
                    volume: 1,
                    chapter: 18,
                  },
                },
                blocks: [
                  {
                    kind: "paragraph",
                    content: [
                      { kind: "text", text: "The fictional novel carries Mara's final outcome in a different direction. That difference changes the emotional meaning of the last transmission even though the broad station mystery remains recognizable." },
                      { kind: "citation", citationNumber: 2 },
                    ],
                  },
                ],
              },
            ],
          },
          {
            stableKey: "canon-vs-interpretation",
            heading: "Canon vs. interpretation",
            level: 2,
            blocks: [
              {
                kind: "paragraph",
                content: [
                  { kind: "text", text: "Both sources confirm their own continuity-specific events. What they do not confirm is that every visual or textual parallel has the same cause in both versions." },
                  { kind: "citation", citationNumber: 1 },
                  { kind: "citation", citationNumber: 2 },
                ],
              },
              {
                kind: "canon_note",
                context: {
                  classification: "interpretation",
                  scopes: [
                    { target: { kind: "title", titleId: FIXTURE_IDS.titles.lastSignal }, label: "Film analysis" },
                  ],
                },
                text: "Reading the two endings as thematic mirrors is a reasonable interpretation, but it remains interpretation rather than confirmed shared canon.",
              },
            ],
          },
          {
            stableKey: "bottom-line",
            heading: "The bottom line",
            level: 2,
            blocks: [
              {
                kind: "paragraph",
                content: [
                  { kind: "strong", text: "The film simplifies the mechanism; the novel broadens it." },
                  { kind: "text", text: " ScreenWhy should therefore treat the two as related but distinct continuities when answering post-watch questions." },
                ],
              },
              { kind: "divider" },
            ],
          },
        ],
      }),
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
    relatedExplanations: [
      EXPLANATION_REFERENCES.lastSignalMysteryEn,
      EXPLANATION_REFERENCES.lastSignalCharacterEn,
    ],
    author,
    reviewerEditor: reviewer,
    publicationState: "published",
    editorialStage: "published",
    citations: [
      {
        source: sourceById(FIXTURE_IDS.sources.lastSignalFilm),
        claimSummary: "Film-continuity evidence for the adaptation comparison.",
        sectionAnchor: "section-screen-version-change",
        publicVisibility: true,
        verificationState: "approved",
      },
      {
        source: sourceById(FIXTURE_IDS.sources.lastSignalNovel),
        claimSummary: "Novel-continuity evidence for the adaptation comparison.",
        sectionAnchor: "section-novel-difference",
        publicVisibility: true,
        verificationState: "source_checked",
      },
    ],
    seo: {
      canonicalUrl:
        "https://screenwhy.com/explain/last-signal-book-vs-screen/",
      index: false,
      breadcrumbLabel: "The Last Signal: Book vs Screen",
    },
  },
  {
    identity: localizedIdentity({
      kind: "explanation",
      logicalId: FIXTURE_IDS.explanations.lastSignalEnding,
      requestedLocale: "en-US",
      currentVariant: lastSignalEndingEnVariant,
      counterpart: lastSignalEndingBnUnavailable,
    }),
    articleTitle: "The Last Signal Ending Explained: What the Final Transmission Means",
    excerpt:
      "A fictional ending explanation that separates the confirmed station-system loop from the choices Mara makes in the final transmission.",
    explanationType: "ending_explained",
    primaryTitle: TITLE_REFERENCES.lastSignalEn,
    spoiler: {
      screen: {
        level: "major",
        scope: { type: "full_title", titleId: FIXTURE_IDS.titles.lastSignal },
      },
    },
    canon: {
      classification: "movie_canon",
      scopes: [
        {
          target: { kind: "title", titleId: FIXTURE_IDS.titles.lastSignal },
          label: "The Last Signal — film continuity",
        },
      ],
    },
    verification: {
      state: "approved",
      sourceIds: [FIXTURE_IDS.sources.lastSignalFilm],
    },
    dates: {
      datePublished: serializedDateTime("2026-09-25T10:00:00+00:00"),
      dateModified: serializedDateTime("2026-09-26T08:30:00+00:00"),
      lastReviewed: serializedDateTime("2026-09-27T11:00:00+00:00"),
    },
    quickAnswer:
      "The final transmission closes the station-system loop: Mara deliberately sends the signal that first brought her back, turning the ending into a completed causal circle rather than proof that the whole universe is resetting.",
    intendedSubjectQuestion: "What does the final transmission mean at the end?",
    body: {
      format: "structured_document",
      document: articleBodyDocument([
        { kind: "paragraph", text: "This fictional ending explanation exists to support ScreenWhy Title Hub demonstration data." },
      ]),
    },
    relatedCharacters: [CHARACTER_REFERENCES.maraValeEn, CHARACTER_REFERENCES.eliasValeEn],
    relatedExplanations: [
      EXPLANATION_REFERENCES.lastSignalMysteryEn,
      EXPLANATION_REFERENCES.lastSignalBookVsScreenEn,
    ],
    author,
    reviewerEditor: reviewer,
    publicationState: "published",
    editorialStage: "published",
    citations: [
      {
        source: sourceById(FIXTURE_IDS.sources.lastSignalFilm),
        claimSummary: "Fictional screen-work evidence for the final-transmission causal loop.",
        publicVisibility: true,
        verificationState: "approved",
      },
    ],
    seo: {
      canonicalUrl: "https://screenwhy.com/explain/the-last-signal-ending-explained/",
      index: false,
      breadcrumbLabel: "The Last Signal Ending Explained",
    },
  },
  {
    identity: localizedIdentity({
      kind: "explanation",
      logicalId: FIXTURE_IDS.explanations.lastSignalNext,
      requestedLocale: "en-US",
      currentVariant: lastSignalNextEnVariant,
      counterpart: lastSignalNextBnUnavailable,
    }),
    articleTitle: "What Happens After The Last Signal?",
    excerpt:
      "A fictional next-step analysis that separates what the ending confirms from what remains interpretation.",
    explanationType: "what_happens_next",
    primaryTitle: TITLE_REFERENCES.lastSignalEn,
    spoiler: {
      screen: {
        level: "major",
        scope: { type: "full_title", titleId: FIXTURE_IDS.titles.lastSignal },
      },
    },
    canon: {
      classification: "interpretation",
      scopes: [
        {
          target: { kind: "title", titleId: FIXTURE_IDS.titles.lastSignal },
          label: "The Last Signal — film continuity",
        },
      ],
    },
    verification: {
      state: "source_checked",
      sourceIds: [FIXTURE_IDS.sources.lastSignalFilm],
    },
    dates: {
      datePublished: serializedDateTime("2026-09-26T12:00:00+00:00"),
      dateModified: serializedDateTime("2026-09-27T08:00:00+00:00"),
      lastReviewed: serializedDateTime("2026-09-28T09:45:00+00:00"),
    },
    quickAnswer:
      "The film confirms that Mara has completed the transmission loop, but it does not confirm another cycle or sequel. Any theory about a second station remains interpretation rather than movie canon.",
    intendedSubjectQuestion: "Does The Last Signal set up another cycle?",
    body: {
      format: "structured_document",
      document: articleBodyDocument([
        { kind: "paragraph", text: "This fictional future-story analysis is demonstration content only." },
      ]),
    },
    relatedCharacters: [CHARACTER_REFERENCES.maraValeEn],
    relatedExplanations: [EXPLANATION_REFERENCES.lastSignalEndingEn],
    author,
    reviewerEditor: reviewer,
    publicationState: "published",
    editorialStage: "published",
    citations: [
      {
        source: sourceById(FIXTURE_IDS.sources.lastSignalFilm),
        claimSummary: "The fictional ending leaves no confirmed second station or sequel event.",
        publicVisibility: true,
        verificationState: "source_checked",
      },
    ],
    seo: {
      canonicalUrl: "https://screenwhy.com/explain/what-happens-after-the-last-signal/",
      index: false,
      breadcrumbLabel: "What Happens After The Last Signal?",
    },
  },
  {
    identity: localizedIdentity({
      kind: "explanation",
      logicalId: FIXTURE_IDS.explanations.lastSignalQuestion,
      requestedLocale: "en-US",
      currentVariant: lastSignalQuestionEnVariant,
      counterpart: lastSignalQuestionBnUnavailable,
    }),
    articleTitle: "Why Did Mara Hide the Station Key?",
    excerpt:
      "A fictional question-and-answer explanation about the key Mara conceals before returning to the station.",
    explanationType: "question_answer",
    primaryTitle: TITLE_REFERENCES.lastSignalEn,
    spoiler: {
      screen: {
        level: "minor",
        scope: { type: "full_title", titleId: FIXTURE_IDS.titles.lastSignal },
      },
    },
    canon: {
      classification: "movie_canon",
      scopes: [
        {
          target: { kind: "title", titleId: FIXTURE_IDS.titles.lastSignal },
          label: "The Last Signal — film continuity",
        },
      ],
    },
    verification: {
      state: "fact_checked",
      sourceIds: [FIXTURE_IDS.sources.lastSignalFilm],
    },
    dates: {
      datePublished: serializedDateTime("2026-09-24T13:00:00+00:00"),
      dateModified: serializedDateTime("2026-09-25T07:30:00+00:00"),
      lastReviewed: serializedDateTime("2026-09-27T10:10:00+00:00"),
    },
    quickAnswer:
      "Mara hides the key because she wants Elias to have a way back into the station without making him part of her plan before she knows what the repeating signal means.",
    intendedSubjectQuestion: "Why did Mara hide the station key?",
    body: {
      format: "structured_document",
      document: articleBodyDocument([
        { kind: "paragraph", text: "This fictional viewer-question explanation is demonstration content only." },
      ]),
    },
    relatedCharacters: [CHARACTER_REFERENCES.maraValeEn, CHARACTER_REFERENCES.eliasValeEn],
    author,
    reviewerEditor: reviewer,
    publicationState: "published",
    editorialStage: "published",
    citations: [
      {
        source: sourceById(FIXTURE_IDS.sources.lastSignalFilm),
        claimSummary: "Fictional screen-work evidence for Mara's decision to conceal the key.",
        publicVisibility: true,
        verificationState: "fact_checked",
      },
    ],
    seo: {
      canonicalUrl: "https://screenwhy.com/explain/why-did-mara-hide-the-key/",
      index: false,
      breadcrumbLabel: "Why Did Mara Hide the Station Key?",
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
    intendedSubjectQuestion: "What actually caused the Harbor Nine blackout?",
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
        "https://screenwhy.com/explain/harbor-nine-ending-explained/",
      index: false,
      breadcrumbLabel: "Harbor Nine Ending Explained",
    },
  },
  {
    identity: localizedIdentity({
      kind: "explanation",
      logicalId: FIXTURE_IDS.explanations.lastSignalCharacter,
      requestedLocale: "en-US",
      currentVariant: lastSignalCharacterEnVariant,
      counterpart: lastSignalCharacterBnUnavailable,
    }),
    articleTitle: "Why Mara Vale Keeps the Station Key",
    excerpt:
      "A fictional character explanation about why Mara keeps one small object after leaving the station.",
    explanationType: "character_explained",
    primaryTitle: TITLE_REFERENCES.lastSignalEn,
    spoiler: {
      screen: {
        level: "minor",
        scope: {
          type: "full_title",
          titleId: FIXTURE_IDS.titles.lastSignal,
        },
      },
    },
    canon: {
      classification: "movie_canon",
      scopes: [
        { target: { kind: "title", titleId: FIXTURE_IDS.titles.lastSignal } },
      ],
    },
    verification: {
      state: "source_checked",
      sourceIds: [FIXTURE_IDS.sources.lastSignalFilm],
    },
    dates: {
      datePublished: serializedDateTime("2026-09-15T09:30:00+00:00"),
      dateModified: serializedDateTime("2026-09-17T15:00:00+00:00"),
      lastReviewed: serializedDateTime("2026-09-23T10:15:00+00:00"),
    },
    quickAnswer:
      "Mara keeps the station key because it is the one object that connects her choice to return with the promise she made before the signal loop began.",
    intendedSubjectQuestion: "Why does Mara keep the station key?",
    body: {
      format: "structured_document",
      document: articleBodyDocument([
        { kind: "paragraph", text: "This fictional character explanation is fixture content only." },
      ]),
    },
    relatedCharacters: [CHARACTER_REFERENCES.maraValeEn],
    author,
    reviewerEditor: reviewer,
    publicationState: "published",
    editorialStage: "published",
    citations: [
      {
        source: sourceById(FIXTURE_IDS.sources.lastSignalFilm),
        claimSummary: "Fictional screen-work evidence for Mara's station-key choice.",
        publicVisibility: true,
        verificationState: "source_checked",
      },
    ],
    seo: {
      canonicalUrl: "https://screenwhy.com/explain/why-mara-vale-keeps-the-station-key/",
      index: false,
      breadcrumbLabel: "Why Mara Vale Keeps the Station Key",
    },
  },
  {
    identity: localizedIdentity({
      kind: "explanation",
      logicalId: FIXTURE_IDS.explanations.harborNineNext,
      requestedLocale: "en-US",
      currentVariant: harborNineNextEnVariant,
      counterpart: harborNineNextBnUnavailable,
    }),
    articleTitle: "What Harbor Nine Sets Up After the Blackout",
    excerpt:
      "A fictional what-happens-next explanation that separates confirmed setup from interpretation after the finale blackout.",
    explanationType: "what_happens_next",
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
      classification: "interpretation",
      scopes: [
        { target: { kind: "title", titleId: FIXTURE_IDS.titles.harborNine } },
      ],
    },
    verification: {
      state: "source_checked",
      sourceIds: [FIXTURE_IDS.sources.harborNineEpisodeEight],
    },
    dates: {
      datePublished: serializedDateTime("2026-09-18T14:00:00+00:00"),
      dateModified: serializedDateTime("2026-09-22T09:10:00+00:00"),
      lastReviewed: serializedDateTime("2026-09-24T08:45:00+00:00"),
    },
    quickAnswer:
      "The finale confirms that the warning network still has an active node, while the identity of the next operator remains interpretation rather than established TV canon.",
    intendedSubjectQuestion: "What happens after the Harbor Nine blackout?",
    body: {
      format: "structured_document",
      document: articleBodyDocument([
        { kind: "paragraph", text: "This fictional what-happens-next explanation is fixture content only." },
      ]),
    },
    author,
    reviewerEditor: reviewer,
    publicationState: "published",
    editorialStage: "published",
    citations: [
      {
        source: sourceById(FIXTURE_IDS.sources.harborNineEpisodeEight),
        claimSummary: "Fictional finale evidence for what the blackout leaves unresolved.",
        publicVisibility: true,
        verificationState: "source_checked",
      },
    ],
    seo: {
      canonicalUrl: "https://screenwhy.com/explain/what-harbor-nine-sets-up-after-the-blackout/",
      index: false,
      breadcrumbLabel: "What Harbor Nine Sets Up After the Blackout",
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
        "https://screenwhy.com/bn/explain/shesh-songket-keno-fire-ase/",
      index: false,
      breadcrumbLabel: "শেষ সংকেতটি কেন আবার ফিরে আসে",
      publishedLocaleAlternates: [
        {
          locale: "en-US",
          url: "https://screenwhy.com/explain/why-the-final-signal-repeats/",
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
  {
    locale: "bn-BD",
    slug: "why-mara-vale-keeps-the-station-key",
    variant: lastSignalCharacterBnUnavailable,
  },
  {
    locale: "bn-BD",
    slug: "what-harbor-nine-sets-up-after-the-blackout",
    variant: harborNineNextBnUnavailable,
  },
  {
    locale: "bn-BD",
    slug: "the-last-signal-ending-explained",
    variant: lastSignalEndingBnUnavailable,
  },
  {
    locale: "bn-BD",
    slug: "what-happens-after-the-last-signal",
    variant: lastSignalNextBnUnavailable,
  },
  {
    locale: "bn-BD",
    slug: "why-did-mara-hide-the-key",
    variant: lastSignalQuestionBnUnavailable,
  },
] as const satisfies readonly {
  readonly locale: "bn-BD";
  readonly slug: string;
  readonly variant: UnavailableLocalizedVariant<"explanation", "bn-BD">;
}[]);
