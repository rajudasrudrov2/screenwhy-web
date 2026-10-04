import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CanonContext } from "@/components/domain/canon/CanonContext";
import { EditorialMetadata } from "@/components/domain/editorial/EditorialMetadata";
import { QuickAnswer } from "@/components/domain/quick-answer/QuickAnswer";
import {
  SourceMaterialSpoilerWarning,
  SpoilerContext,
  SpoilerDisclosure,
  SpoilerMarker,
  SpoilerWarning,
} from "@/components/domain/spoiler/SpoilerContext";
import { Grid, PageContainer, ReadingColumn, Stack } from "@/components/layout/Layout";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { SiteFrame } from "@/components/navigation/SiteFrame";
import { createRepositories, type ExplanationLookupResult } from "@/data";
import type { CanonContext as CanonContextValue, CanonScope } from "@/types/domain/canon";
import type { ExplanationDetail } from "@/types/domain/explanation";
import type { LocaleCode } from "@/lib/i18n/locales";
import styles from "./domain-preview.module.css";

export const metadata: Metadata = {
  title: "Domain UI Preview",
  robots: { index: false, follow: false, nocache: true },
};

function requireExplanation<TLocale extends LocaleCode>(
  result: ExplanationLookupResult<TLocale>,
): ExplanationDetail<TLocale> {
  if (result.status !== "available") {
    throw new Error(`Development preview fixture is unavailable for ${result.requestedLocale}.`);
  }
  return result.value;
}

function canonWithScope(
  classification: CanonContextValue["classification"],
  scope: CanonScope,
): CanonContextValue {
  if (classification === "adaptation_difference") {
    return { classification, scopes: [scope, scope] };
  }
  return { classification, scopes: [scope] };
}

export default async function DomainUiPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const repositories = createRepositories({
    dataSource: "mock",
    runtimeEnvironment: "development",
  });

  const [mysteryResult, adaptationResult, finaleResult, banglaResult] = await Promise.all([
    repositories.explanations.getBySlug({ locale: "en-US", slug: "why-the-final-signal-repeats" }),
    repositories.explanations.getBySlug({ locale: "en-US", slug: "last-signal-book-vs-screen" }),
    repositories.explanations.getBySlug({ locale: "en-US", slug: "harbor-nine-ending-explained" }),
    repositories.explanations.getBySlug({ locale: "bn-BD", slug: "shesh-songket-keno-fire-ase" }),
  ]);

  const mystery = requireExplanation(mysteryResult);
  const adaptation = requireExplanation(adaptationResult);
  const finale = requireExplanation(finaleResult);
  const bangla = requireExplanation(banglaResult);

  const movieScope: CanonScope = {
    ...mystery.canon.scopes[0],
    label: mystery.primaryTitle.displayTitle,
  };
  const tvScope: CanonScope = {
    ...finale.canon.scopes[0],
    label: finale.primaryTitle.displayTitle,
  };
  const sourceScope = adaptation.canon.scopes.find((scope) => scope.target.kind === "source_work") ?? adaptation.canon.scopes[0];

  const movieCanon = canonWithScope("movie_canon", movieScope);
  const tvCanon = canonWithScope("tv_canon", tvScope);
  const mangaCanon = canonWithScope("manga_canon", {
    ...sourceScope,
    label: "Fictional manga continuity · preview",
  });
  const interpretation = canonWithScope("interpretation", {
    ...movieScope,
    label: "The Last Signal · interpretive reading",
  });
  const speculative = canonWithScope("unconfirmed_speculative", {
    ...movieScope,
    label: "The Last Signal · unresolved evidence",
  });

  const longReviewer = adaptation.reviewerEditor
    ? {
        ...adaptation.reviewerEditor,
        displayName: "Noor Hale — Senior Editorial Reviewer for Continuity and Source Comparison",
      }
    : undefined;

  return (
    <SiteFrame locale="en-US" activePath="/__ui/">
      <div className={styles.preview}>
        <PageContainer>
          <header className={styles.hero}>
            <Stack gap="var(--pe-space-4)">
              <p className={styles.eyebrow}>Development only · noindex · production returns 404</p>
              <h1>Core domain UI · PE-FE-02A</h1>
              <p className="pe-lead">Production presentation components for Canon, Spoilers, editorial metadata and Quick Answer. This is a verification surface, not a public page.</p>
              <Breadcrumbs items={[{ label: "UI foundation", href: "/__ui/" }, { label: "Domain UI preview" }]} />
            </Stack>
          </header>

          <section className={styles.board} aria-labelledby="canon-preview">
            <div className={styles.sectionHeading}>
              <p className={styles.sectionIndex}>01</p>
              <div><h2 id="canon-preview">Canon context</h2><p>Compact, inline and expanded credibility context — not generic badges.</p></div>
            </div>
            <Stack gap="var(--pe-space-5)">
              <div className={styles.panel}>
                <h3>Compact + inline</h3>
                <div className={styles.wrapRow}>
                  <CanonContext context={tvCanon} presentation="compact" />
                  <CanonContext context={mangaCanon} presentation="compact" />
                  <CanonContext context={interpretation} presentation="compact" />
                  <CanonContext context={speculative} presentation="compact" />
                </div>
                <CanonContext context={adaptation.canon} presentation="inline" />
              </div>
              <Grid mobile={1} desktop={2} gap="var(--pe-space-5)">
                <CanonContext context={tvCanon} presentation="expanded" />
                <CanonContext context={adaptation.canon} presentation="expanded" heading="Canon comparison" />
              </Grid>
            </Stack>
          </section>

          <section className={styles.board} aria-labelledby="spoiler-preview">
            <div className={styles.sectionHeading}>
              <p className={styles.sectionIndex}>02</p>
              <div><h2 id="spoiler-preview">Spoiler context</h2><p>Screen spoilers and source-material spoilers remain separate semantic states.</p></div>
            </div>
            <Stack gap="var(--pe-space-5)">
              <div className={styles.panel}>
                <div className={styles.wrapRow}>
                  <SpoilerMarker metadata={mystery.spoiler.screen} scopeLabel="The Last Signal" />
                  <SpoilerMarker metadata={adaptation.spoiler.screen} scopeLabel="The Last Signal" />
                  <SpoilerMarker metadata={finale.spoiler.screen} scopeLabel="Harbor Nine · Season 1, Episode 8" />
                  <SpoilerMarker metadata={{ ...finale.spoiler.screen, level: "full" }} scopeLabel="Harbor Nine finale" />
                </div>
              </div>
              <SpoilerWarning metadata={finale.spoiler.screen} scopeLabel="Season 1, Episode 8" />
              {adaptation.spoiler.sourceMaterial ? (
                <SourceMaterialSpoilerWarning metadata={adaptation.spoiler.sourceMaterial} sourceWorkLabel="The Last Signal · novel continuity" />
              ) : null}
              <SpoilerDisclosure
                metadata={finale.spoiler.screen}
                scopeLabel="Season 1, Episode 8"
                sourceMaterial={adaptation.spoiler.sourceMaterial}
                sourceWorkLabel="The Last Signal · novel continuity"
              >
                <p>This reveal area demonstrates keyboard-accessible native disclosure. The component does not use hover-only behavior or theatrical animation.</p>
              </SpoilerDisclosure>
            </Stack>
          </section>

          <section className={styles.board} aria-labelledby="metadata-preview">
            <div className={styles.sectionHeading}>
              <p className={styles.sectionIndex}>03</p>
              <div><h2 id="metadata-preview">Editorial metadata</h2><p>Published, modified and reviewed dates are intentionally distinct.</p></div>
            </div>
            <Stack gap="var(--pe-space-5)">
              <div className={styles.panel}>
                <EditorialMetadata
                  dates={adaptation.dates}
                  author={adaptation.author}
                  reviewerEditor={adaptation.reviewerEditor}
                  explanationType={adaptation.explanationType}
                  primaryTitle={adaptation.primaryTitle}
                  variant="article"
                />
              </div>
              <Grid mobile={1} desktop={2} gap="var(--pe-space-5)">
                <div className={styles.panel}>
                  <h3>Compact</h3>
                  <EditorialMetadata
                    dates={mystery.dates}
                    author={mystery.author}
                    explanationType={mystery.explanationType}
                    variant="compact"
                  />
                </div>
                <div className={styles.panel}>
                  <h3>Long reviewer · stacked</h3>
                  <EditorialMetadata
                    dates={adaptation.dates}
                    author={adaptation.author}
                    reviewerEditor={longReviewer}
                    explanationType={adaptation.explanationType}
                    primaryTitle={{ ...adaptation.primaryTitle, displayTitle: "The Last Signal: A Deliberately Long Fictional Title for Responsive Metadata Validation" }}
                    variant="stacked"
                  />
                </div>
              </Grid>
            </Stack>
          </section>

          <section className={styles.board} aria-labelledby="quick-answer-preview">
            <div className={styles.sectionHeading}>
              <p className={styles.sectionIndex}>04</p>
              <div><h2 id="quick-answer-preview">Quick Answer</h2><p>Answer-first editorial treatment using the same Canon and Spoiler components.</p></div>
            </div>
            <ReadingColumn className={styles.quickAnswerStack}>
              <QuickAnswer answer={mystery.quickAnswer} canon={movieCanon} spoiler={mystery.spoiler} spoilerScopeLabel="The Last Signal" />
              <QuickAnswer answer={finale.quickAnswer} canon={tvCanon} spoiler={finale.spoiler} spoilerScopeLabel="Season 1, Episode 8" />
              <QuickAnswer
                answer={adaptation.quickAnswer}
                canon={adaptation.canon}
                spoiler={adaptation.spoiler}
                spoilerScopeLabel="The Last Signal · screen version"
                sourceWorkLabel="The Last Signal · novel continuity"
              />
              <QuickAnswer
                answer={"This longer demonstration answer checks that a moderate editorial explanation can wrap naturally without becoming a dashboard card or chat bubble. It stays within the compact editorial measure while preserving clear context above the answer.\n\nA second short paragraph verifies the locked 1–3 paragraph Quick Answer rhythm at both mobile and desktop widths."}
                canon={interpretation}
                spoiler={mystery.spoiler}
                spoilerScopeLabel="The Last Signal"
              />
              <div className={styles.banglaBlock} lang="bn-BD">
                <p className={styles.sampleLabel}>বাংলা নমুনা</p>
                <QuickAnswer
                  answer={bangla.quickAnswer}
                  locale="bn-BD"
                  canon={canonWithScope(bangla.canon.classification, {
                    ...bangla.canon.scopes[0],
                    label: bangla.primaryTitle.displayTitle,
                  })}
                  spoiler={bangla.spoiler}
                  spoilerScopeLabel={bangla.primaryTitle.displayTitle}
                />
                <EditorialMetadata
                  locale="bn-BD"
                  dates={bangla.dates}
                  author={bangla.author}
                  reviewerEditor={bangla.reviewerEditor}
                  explanationType={bangla.explanationType}
                  primaryTitle={bangla.primaryTitle}
                  variant="stacked"
                />
              </div>
            </ReadingColumn>
          </section>

          <section className={styles.board} aria-labelledby="combined-preview">
            <div className={styles.sectionHeading}>
              <p className={styles.sectionIndex}>05</p>
              <div><h2 id="combined-preview">Combined context stress test</h2><p>Long labels wrap without changing the underlying structured domain data.</p></div>
            </div>
            <div className={styles.panel}>
              <Stack gap="var(--pe-space-4)">
                <CanonContext
                  context={{
                    classification: "adaptation_difference",
                    scopes: [
                      { ...adaptation.canon.scopes[0], label: "The Last Signal — theatrical screen continuity with an intentionally long scope label" },
                      { ...sourceScope, label: "The Last Signal — original source-work continuity with a second intentionally long label" },
                    ],
                  }}
                  presentation="expanded"
                />
                <SpoilerContext
                  context={adaptation.spoiler}
                  screenScopeLabel="Screen continuity · full title context"
                  sourceWorkLabel="Original source material · Volume 1, Chapter 18"
                />
              </Stack>
            </div>
          </section>
        </PageContainer>
      </div>
    </SiteFrame>
  );
}
