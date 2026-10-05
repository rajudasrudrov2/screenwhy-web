import Link from "next/link";
import {
  ArticleReadingLayout,
  ArticleTableOfContents,
  buildArticleTocItems,
  createArticleSectionId,
  type ArticleSectionDescriptor,
} from "@/components/domain/article";
import { CanonContext } from "@/components/domain/canon/CanonContext";
import { CharacterCard } from "@/components/domain/cards/CharacterCard";
import { ExplanationCard } from "@/components/domain/cards/ExplanationCard";
import { SourcesSection } from "@/components/domain/citation";
import { EditorialMetadata } from "@/components/domain/editorial/EditorialMetadata";
import { QuickAnswer } from "@/components/domain/quick-answer/QuickAnswer";
import {
  SourceMaterialSpoilerWarning,
  SpoilerWarning,
} from "@/components/domain/spoiler/SpoilerContext";
import { explanationTypeLabels } from "@/components/domain/shared/domain-labels";
import { ArrowRightIcon, InfoIcon, SearchIcon } from "@/components/icons/Icons";
import { PageContainer, ReadingColumn, WideContainer } from "@/components/layout/Layout";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import {
  explanationRoute,
  localizedRoute,
  PUBLIC_HUB_ROUTES,
  searchRoute,
  titleRoute,
} from "@/config/routes";
import type { RenderableArticleSection } from "@/data/article-body";
import type { ExplanationDetailViewModel } from "@/features/explanation-detail/explanation-detail.types";
import { TITLE_TYPE_LABELS } from "@/types/domain/title";
import { RenderableArticle } from "@/features/explanation-detail/RenderableArticle";
import styles from "./ExplanationDetail.module.css";

export interface ExplanationDetailPageProps {
  readonly model: ExplanationDetailViewModel;
}

function sectionDescriptor(section: RenderableArticleSection): ArticleSectionDescriptor {
  return {
    id: createArticleSectionId(section.stableKey),
    heading: section.heading,
    level: section.level,
    ...(section.sections
      ? { sections: section.sections.map(sectionDescriptor) }
      : {}),
  };
}

function PrimaryTitleContext({ model }: ExplanationDetailPageProps) {
  const reference = model.explanation.primaryTitle;
  const title = model.primaryTitle;
  const href = titleRoute(reference.publicRouteFamily, reference.slug, model.locale);
  const year = title?.releaseYear;

  return (
    <Link className={styles.titleContext} href={href} aria-label={`Explore ${reference.displayTitle}`}>
      <div className={styles.titleContextMark} aria-hidden="true"><InfoIcon size={18} /></div>
      <div className={styles.titleContextCopy}>
        <span className={styles.titleContextLabel}>Primary title</span>
        <strong>{reference.displayTitle}</strong>
        <span>
          {year ? `${year} · ` : ""}
          {title?.titleType ? TITLE_TYPE_LABELS[title.titleType] : "Screen story"}
        </span>
      </div>
      <ArrowRightIcon size={18} />
    </Link>
  );
}

function ViewerQuestions({ model }: ExplanationDetailPageProps) {
  if (model.viewerQuestions.length === 0) return null;

  return (
    <section className={styles.relatedSection} aria-labelledby="viewer-questions-heading">
      <div className={styles.sectionHeadingRow}>
        <h2 id="viewer-questions-heading">Viewer questions</h2>
      </div>
      <div className={styles.questionRows}>
        {model.viewerQuestions.map((item) => {
          const slug = item.explanation.identity.localization.currentVariant.slug;
          return (
            <Link
              key={`${String(item.explanation.identity.logicalId)}-${item.question}`}
              className={styles.questionRow}
              href={explanationRoute(slug, model.locale)}
            >
              <span>{item.question}</span>
              <span className={styles.questionState}>Answered</span>
              <ArrowRightIcon size={17} />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function AskPanel({ model }: ExplanationDetailPageProps) {
  return (
    <section className={styles.askPanel} aria-labelledby="ask-screen-heading">
      <div>
        <p className={styles.askEyebrow}>Ask the Screen</p>
        <h2 id="ask-screen-heading">Didn&apos;t understand something?</h2>
        <p>
          Search the question you still have after watching. ScreenWhy will take you to the
          closest available explanation or search result.
        </p>
      </div>
      <form className={styles.askForm} action={searchRoute(model.locale)} method="get" role="search">
        <label className="pe-visually-hidden" htmlFor="explanation-question">
          Your post-watch question
        </label>
        <div className={styles.askInputWrap}>
          <SearchIcon size={18} />
          <input
            id="explanation-question"
            name="q"
            type="search"
            maxLength={180}
            placeholder="Ask about the ending, a character, scene or mystery…"
          />
        </div>
        <button type="submit">Search your question</button>
      </form>
    </section>
  );
}

export function ExplanationDetailPage({ model }: ExplanationDetailPageProps) {
  const { explanation } = model;
  const typeLabel = explanationTypeLabels[model.locale][explanation.explanationType];
  const toc = buildArticleTocItems(model.article.sections.map(sectionDescriptor));
  const sourceWorkLabel = explanation.sourceWorks?.[0]?.officialTitle;
  const publicCitations = (explanation.citations ?? []).filter(
    (citation) => citation.publicVisibility === true,
  );

  const breadcrumbs = [
    { label: "Home", href: localizedRoute("/", model.locale) },
    { label: "Explanations", href: localizedRoute(PUBLIC_HUB_ROUTES.explanations, model.locale) },
    { label: typeLabel, href: localizedRoute(PUBLIC_HUB_ROUTES.explanations, model.locale) },
    { label: explanation.seo.breadcrumbLabel ?? explanation.articleTitle },
  ];

  return (
    <>
      <PageContainer className={styles.page}>
        <div className={styles.breadcrumbWrap}>
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <ReadingColumn className={styles.articleHeader}>
          <div className={styles.eyebrows}>
            <span>{typeLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{explanation.primaryTitle.displayTitle}</span>
          </div>
          <h1>{explanation.articleTitle}</h1>
          {explanation.excerpt ? <p className={styles.dek}>{explanation.excerpt}</p> : null}

          <PrimaryTitleContext model={model} />

          <div className={styles.metadataWrap}>
            <EditorialMetadata
              locale={model.locale}
              variant="article"
              dates={explanation.dates}
              author={explanation.author}
              reviewerEditor={explanation.reviewerEditor}
              explanationType={explanation.explanationType}
              primaryTitle={explanation.primaryTitle}
            />
          </div>

          <div className={styles.contextStack}>
            <SpoilerWarning
              metadata={explanation.spoiler.screen}
              locale={model.locale}
              scopeLabel={explanation.primaryTitle.displayTitle}
            />
            {explanation.spoiler.sourceMaterial ? (
              <SourceMaterialSpoilerWarning
                metadata={explanation.spoiler.sourceMaterial}
                locale={model.locale}
                sourceWorkLabel={sourceWorkLabel}
              />
            ) : null}
            <CanonContext context={explanation.canon} locale={model.locale} presentation="expanded" />
          </div>

          <QuickAnswer
            answer={explanation.quickAnswer}
            locale={model.locale}
            canon={explanation.canon}
            spoiler={explanation.spoiler}
            spoilerScopeLabel={explanation.primaryTitle.displayTitle}
            sourceWorkLabel={sourceWorkLabel}
          />
        </ReadingColumn>

        <WideContainer className={styles.readingArea}>
          <ArticleReadingLayout
            toc={<ArticleTableOfContents items={toc} locale={model.locale} />}
          >
            <RenderableArticle body={model.article} explanation={explanation} />
            {publicCitations.length > 0 ? (
              <div className={styles.sourcesWrap}>
                <SourcesSection citations={publicCitations} locale={model.locale} />
              </div>
            ) : null}
          </ArticleReadingLayout>
        </WideContainer>

        <WideContainer className={styles.afterArticle}>
          {model.relatedCharacters.length > 0 ? (
            <section className={styles.relatedSection} aria-labelledby="related-characters-heading">
              <div className={styles.sectionHeadingRow}>
                <h2 id="related-characters-heading">Related characters</h2>
              </div>
              <div className={styles.characterGrid}>
                {model.relatedCharacters.map((character) => (
                  <CharacterCard key={String(character.identity.logicalId)} character={character} variant="compact" />
                ))}
              </div>
            </section>
          ) : null}

          {model.relatedExplanations.length > 0 ? (
            <section className={styles.relatedSection} aria-labelledby="related-explanations-heading">
              <div className={styles.sectionHeadingRow}>
                <h2 id="related-explanations-heading">Related explanations</h2>
              </div>
              <div className={styles.explanationGrid}>
                {model.relatedExplanations.map((item) => (
                  <ExplanationCard
                    key={String(item.identity.logicalId)}
                    explanation={item}
                    variant="compact"
                    showCanon={item.canon.classification === "adaptation_difference"}
                  />
                ))}
              </div>
            </section>
          ) : null}

          <ViewerQuestions model={model} />
          <AskPanel model={model} />
        </WideContainer>

      </PageContainer>
    </>
  );
}
