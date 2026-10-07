import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  AdaptationDifferenceNote,
  ArticleBlockquote,
  ArticleCanonNote,
  ArticleDivider,
  ArticleEmphasis,
  ArticleImage,
  ArticleLead,
  ArticleLink,
  ArticleList,
  ArticleParagraph,
  ArticleProse,
  ArticleReadingLayout,
  ArticleSection,
  ArticleSpoilerSection,
  ArticleStrong,
  ArticleTableOfContents,
  InterpretationNote,
  buildArticleTocItems,
  type InterpretationNoteProps,
} from "@/components/domain/article";
import { EditorialMetadata } from "@/components/domain/editorial/EditorialMetadata";
import { QuickAnswer } from "@/components/domain/quick-answer/QuickAnswer";
import { PageContainer, Stack } from "@/components/layout/Layout";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { SiteFrame } from "@/components/navigation/SiteFrame";
import { createRepositories, type ExplanationLookupResult } from "@/data";
import type { CanonContext } from "@/types/domain/canon";
import type { ExplanationDetail } from "@/types/domain/explanation";
import type { LocaleCode } from "@/lib/i18n/locales";
import {
  articlePreviewImage,
  englishArticleSections,
} from "./preview-data";
import styles from "./article-preview.module.css";

export const metadata: Metadata = {
  title: "Article UI Preview",
  robots: { index: false, follow: false, nocache: true },
};

function requireExplanation<TLocale extends LocaleCode>(
  result: ExplanationLookupResult<TLocale>,
): ExplanationDetail<TLocale> {
  if (result.status !== "available") {
    throw new Error(`Development article preview is unavailable for ${result.requestedLocale}.`);
  }
  return result.value;
}

function asInterpretationContext(
  context: CanonContext,
): InterpretationNoteProps["context"] {
  return {
    classification: "interpretation",
    scopes: context.scopes,
  };
}

export default async function ArticleUiPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const repositories = createRepositories({
    dataSource: "mock",
    runtimeEnvironment: "development",
  });

  const englishResult = await repositories.explanations.getBySlug({
    locale: "en-US",
    slug: "last-signal-book-vs-screen",
  });

  const explanation = requireExplanation(englishResult);
  const englishToc = buildArticleTocItems(englishArticleSections);

  if (explanation.canon.classification !== "adaptation_difference") {
    throw new Error("The development article preview requires its adaptation-difference fixture.");
  }

  const interpretation = asInterpretationContext(explanation.canon);

  const spoilerMetadata = {
    screen: explanation.spoiler.screen
      ? { ...explanation.spoiler.screen, level: "full" as const }
      : undefined,
    sourceMaterial: explanation.spoiler.sourceMaterial,
  };

  return (
    <SiteFrame locale="en-US" activePath="/__ui/">
      <div className={styles.preview}>
        <PageContainer>
          <header className={styles.hero}>
            <Stack gap="var(--pe-space-4)">
              <p className={styles.eyebrow}>Development only · noindex · production returns 404</p>
              <h1>Article content + TOC foundation · SW-FE-02C-A</h1>
              <p className="pe-lead">
                Reusable ScreenWhy long-form reading primitives. This surface validates article rhythm, anchors, TOC behavior and Canon/Spoiler composition without assembling a public Explanation page.
              </p>
              <Breadcrumbs
                items={[
                  { label: "UI foundation", href: "/__ui/" },
                  { label: "Article preview" },
                ]}
              />
            </Stack>
          </header>

          <section className={styles.board} aria-labelledby="english-article-preview">
            <div className={styles.sectionHeading}>
              <span>01</span>
              <div>
                <h2 id="english-article-preview">English long-form reading system</h2>
                <p>720px reading measure with desktop TOC rail and compact mobile disclosure.</p>
              </div>
            </div>

            <div className={styles.preArticleContext}>
              <EditorialMetadata
                dates={explanation.dates}
                author={explanation.author}
                reviewerEditor={explanation.reviewerEditor}
                explanationType={explanation.explanationType}
                primaryTitle={explanation.primaryTitle}
                variant="article"
              />
              <QuickAnswer
                answer={explanation.quickAnswer}
                canon={explanation.canon}
                spoiler={explanation.spoiler}
                spoilerScopeLabel="The Last Signal · screen continuity"
                sourceWorkLabel="The Last Signal · fictional source novel"
              />
            </div>

            <ArticleReadingLayout
              toc={(
                <ArticleTableOfContents
                  items={englishToc}
                  activeId={englishArticleSections[0].sections?.[1]?.id}
                />
              )}
            >
              <ArticleProse>
                <ArticleLead>
                  This illustrative article uses a fictional story world to demonstrate how ScreenWhy can move from an immediate answer into supporting evidence, context, and deeper interpretation without turning every paragraph into a card.
                </ArticleLead>
                <ArticleParagraph>
                  The central reading rule is simple: the answer should become clearer as the reader moves down the page. Paragraphs stay within a controlled measure, headings create obvious wayfinding, and contextual systems such as Canon and Spoilers remain explicit without overpowering the analysis.
                </ArticleParagraph>

                <ArticleSection
                  id={englishArticleSections[0].id}
                  heading={englishArticleSections[0].heading}
                >
                  <ArticleParagraph>
                    In this fictional example, the station hears the same warning before the mechanism that causes the loop is fully active. That ordering matters because it separates <ArticleStrong>what the story actually establishes</ArticleStrong> from what a viewer might reasonably infer later.
                  </ArticleParagraph>
                  <ArticleList
                    items={[
                      <>The warning is received before the final sequence begins.</>,
                      <>The wording remains stable while the surrounding context changes.</>,
                      <>A later scene gives the earlier clue a new meaning without erasing its first meaning.</>,
                    ]}
                  />
                  <ArticleBlockquote attribution="Fictional in-world maintenance log · development sample">
                    “The message repeats before the transmitter wakes. Record the order, not just the time.”
                  </ArticleBlockquote>
                  <ArticleImage
                    media={articlePreviewImage}
                    credit="ScreenWhy development preview"
                  />
                </ArticleSection>

                <ArticleSection
                  id={englishArticleSections[0].sections?.[0]?.id ?? englishArticleSections[0].id}
                  heading={englishArticleSections[0].sections?.[0]?.heading ?? "The message appears before the loop closes"}
                  level={3}
                >
                  <ArticleParagraph>
                    A deep link can point directly to this subsection because the anchor comes from a stable editorial key rather than a display heading. That keeps links predictable even if the visible copy is later refined or translated.
                  </ArticleParagraph>
                  <ArticleParagraph>
                    Internal reading links also remain ordinary, recognizable links. For example, the <ArticleLink href="/__ui/cards/">card preview</ArticleLink> is a separate development surface rather than a hidden interaction embedded in prose.
                  </ArticleParagraph>
                </ArticleSection>

                <ArticleSection
                  id={englishArticleSections[0].sections?.[1]?.id ?? englishArticleSections[0].id}
                  heading={englishArticleSections[0].sections?.[1]?.heading ?? "Why the timing matters more than the timestamp"}
                  level={3}
                >
                  <ArticleParagraph>
                    A timestamp can be ambiguous inside a story with unstable chronology. The sequence of cause and effect is more useful here: first the warning, then the activation, then the response. ScreenWhy should label that distinction directly instead of presenting an uncertain fictional date as if it were verified fact.
                  </ArticleParagraph>
                  <ArticleParagraph>
                    This is also where restrained <ArticleEmphasis>interpretation</ArticleEmphasis> becomes useful. Interpretation can explain a plausible reading while remaining visually and semantically separate from established Canon.
                  </ArticleParagraph>
                </ArticleSection>

                <ArticleDivider />

                <ArticleSection
                  id={englishArticleSections[1].id}
                  heading={englishArticleSections[1].heading}
                >
                  <ArticleCanonNote context={explanation.canon}>
                    <p>The article can surface structured Canon context without reducing it to an arbitrary text badge.</p>
                  </ArticleCanonNote>
                  <AdaptationDifferenceNote context={explanation.canon}>
                    <p>The fictional screen continuity and source-work continuity use different mechanisms. The note keeps both compared scopes visible rather than implying that the difference belongs to only one version.</p>
                  </AdaptationDifferenceNote>
                  <InterpretationNote context={interpretation}>
                    <p>A possible reading may explain why the warning seems personal, but the preview deliberately labels that reasoning as interpretation rather than confirmed story fact.</p>
                  </InterpretationNote>
                </ArticleSection>

                <ArticleSection
                  id={englishArticleSections[2].id}
                  heading={englishArticleSections[2].heading}
                  spoiler={spoilerMetadata}
                >
                  <ArticleParagraph>
                    The section heading remains readable before any reveal. The sensitive content itself uses the existing Spoiler system and can strengthen the section warning without ever weakening the article-level spoiler context.
                  </ArticleParagraph>
                  <ArticleSpoilerSection
                    metadata={spoilerMetadata}
                    articleSpoiler={explanation.spoiler}
                    screenScopeLabel="Fictional final sequence"
                    sourceWorkLabel="The Last Signal · fictional source novel"
                  >
                    <ArticleParagraph>
                      This revealed paragraph is still illustrative. It demonstrates the composition boundary only; it is not a claim about a real film, series, novel, or production.
                    </ArticleParagraph>
                  </ArticleSpoilerSection>
                </ArticleSection>
              </ArticleProse>
            </ArticleReadingLayout>
          </section>

          <aside className={styles.statusNote}>
            <strong>Deferred by design:</strong> final citation/source UI and the full Explanation Detail page are not part of this preview.
          </aside>
        </PageContainer>
      </div>
    </SiteFrame>
  );
}
