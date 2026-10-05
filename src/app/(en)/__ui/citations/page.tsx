import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArticleParagraph,
  ArticleProse,
  ArticleSection,
  createArticleSectionId,
} from "@/components/domain/article";
import {
  CitationMarker,
  ClaimEvidence,
  SourcesSection,
  createCitationRegistry,
} from "@/components/domain/citation";
import { PageContainer, Stack } from "@/components/layout/Layout";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { SiteFrame } from "@/components/navigation/SiteFrame";
import { banglaCitations, englishCitations } from "./preview-data";
import styles from "./citations-preview.module.css";

export const metadata: Metadata = {
  title: "Citation UI Preview",
  robots: { index: false, follow: false, nocache: true },
};

export default function CitationPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const registry = createCitationRegistry(englishCitations);
  const banglaRegistry = createCitationRegistry(banglaCitations);
  const finaleId = createArticleSectionId("what-the-finale-establishes");
  const timingId = createArticleSectionId("why-the-timing-matters");
  const adaptationId = createArticleSectionId("adaptation-difference");

  return (
    <SiteFrame locale="en-US" activePath="/__ui/">
      <div className={styles.preview}>
        <PageContainer>
          <header className={styles.hero}>
            <Stack gap="var(--pe-space-4)">
              <p className={styles.eyebrow}>Development only · noindex · production returns 404</p>
              <h1>Citation + source evidence system · SW-FE-02C-B</h1>
              <p className="pe-lead">
                ScreenWhy editorial evidence primitives using public-safe domain contracts. Examples are fictional and exist only to validate sourcing UX.
              </p>
              <Breadcrumbs items={[{ label: "UI foundation", href: "/__ui/" }, { label: "Citation preview" }]} />
            </Stack>
          </header>

          <section className={styles.board} aria-labelledby="inline-citation-heading">
            <div className={styles.sectionHeading}>
              <span>01</span>
              <div>
                <h2 id="inline-citation-heading">Inline citations + article integration</h2>
                <p>Deterministic markers link to deduplicated source entries without exposing internal SourceId values.</p>
              </div>
            </div>

            <ArticleProse>
              <ArticleSection id={finaleId} heading="What the finale establishes">
                <ArticleParagraph>
                  In this fictional demonstration, the warning is heard before the final transmitter sequence begins
                  <CitationMarker
                    number={registry.citations[0].number}
                    markerId={registry.citations[0].markerId}
                    sourceAnchorId={registry.citations[0].sourceAnchorId}
                    sourceTitle={registry.citations[0].citation.source.sourceTitle}
                  />
                  and the production notes describe that ordering as intentional
                  <CitationMarker
                    number={registry.citations[1].number}
                    markerId={registry.citations[1].markerId}
                    sourceAnchorId={registry.citations[1].sourceAnchorId}
                    sourceTitle={registry.citations[1].citation.source.sourceTitle}
                  />.
                </ArticleParagraph>
              </ArticleSection>

              <ArticleSection id={timingId} heading="Why the timing matters">
                <ArticleParagraph>
                  One fictional interview calls the repeated message a chronology clue
                  <CitationMarker
                    number={registry.citations[2].number}
                    markerId={registry.citations[2].markerId}
                    sourceAnchorId={registry.citations[2].sourceAnchorId}
                    sourceTitle={registry.citations[2].citation.source.sourceTitle}
                  />.
                  The same screen-work source can be cited again later without duplicating its full source metadata
                  <CitationMarker
                    number={registry.citations[4].number}
                    markerId={registry.citations[4].markerId}
                    sourceAnchorId={registry.citations[4].sourceAnchorId}
                    sourceTitle={registry.citations[4].citation.source.sourceTitle}
                  />.
                </ArticleParagraph>
              </ArticleSection>

              <ArticleSection id={adaptationId} heading="Adaptation difference">
                <ArticleParagraph>
                  The source-work comparison uses a separate fictional source and preserves its own claim relationship
                  <CitationMarker
                    number={registry.citations[3].number}
                    markerId={registry.citations[3].markerId}
                    sourceAnchorId={registry.citations[3].sourceAnchorId}
                    sourceTitle={registry.citations[3].citation.source.sourceTitle}
                  />.
                </ArticleParagraph>
              </ArticleSection>
            </ArticleProse>

            <div className={styles.readingColumn}>
              <ClaimEvidence citations={[englishCitations[0], englishCitations[1]]} />
              <SourcesSection citations={englishCitations} showVerification id="english-sources" />
            </div>
          </section>

          <section className={styles.board} aria-labelledby="bangla-citation-heading" lang="bn-BD">
            <div className={styles.sectionHeading}>
              <span>02</span>
              <div>
                <h2 id="bangla-citation-heading">বাংলা উদ্ধৃতি ও উৎস</h2>
                <p>Hind Siliguri, বাংলা উৎস-ধরন, দীর্ঘ লেখা ও স্থিতিশীল citation numbering যাচাইয়ের নমুনা।</p>
              </div>
            </div>

            <ArticleProse locale="bn-BD">
              <ArticleSection id={createArticleSectionId("bn-signal-order")} heading="সংকেতের ক্রম" locale="bn-BD">
                <ArticleParagraph>
                  এই কাল্পনিক উদাহরণে নির্মাতা নোট সংকেতটির ক্রম সম্পর্কে একটি নির্দিষ্ট ব্যাখ্যা দেয়
                  <CitationMarker
                    number={banglaRegistry.citations[0].number}
                    markerId={banglaRegistry.citations[0].markerId}
                    sourceAnchorId={banglaRegistry.citations[0].sourceAnchorId}
                    sourceTitle={banglaRegistry.citations[0].citation.source.sourceTitle}
                    locale="bn-BD"
                  />।
                </ArticleParagraph>
              </ArticleSection>
              <ArticleSection id={createArticleSectionId("bn-adaptation")} heading="রূপান্তরের পার্থক্য" locale="bn-BD">
                <ArticleParagraph>
                  মূল উৎসকর্মের কাল্পনিক সংস্করণটি একই সতর্কবার্তার জন্য ভিন্ন প্রক্রিয়া ব্যবহার করে
                  <CitationMarker
                    number={banglaRegistry.citations[1].number}
                    markerId={banglaRegistry.citations[1].markerId}
                    sourceAnchorId={banglaRegistry.citations[1].sourceAnchorId}
                    sourceTitle={banglaRegistry.citations[1].citation.source.sourceTitle}
                    locale="bn-BD"
                  />।
                </ArticleParagraph>
              </ArticleSection>
            </ArticleProse>
            <div className={styles.readingColumn}>
              <SourcesSection citations={banglaCitations} locale="bn-BD" id="bangla-sources" />
            </div>
          </section>

          <p className={styles.statusNote}>
            <strong>Scope note:</strong> final Explanation Detail assembly, backend source payload mapping and private research tooling remain outside this component task.
          </p>
        </PageContainer>
      </div>
    </SiteFrame>
  );
}
