import type { ReactNode } from "react";
import {
  AdaptationDifferenceNote,
  ArticleBlockquote,
  ArticleCanonNote,
  ArticleDivider,
  ArticleEmphasis,
  ArticleImage,
  ArticleLink,
  ArticleList,
  ArticleParagraph,
  ArticleProse,
  ArticleSection,
  ArticleSpoilerSection,
  ArticleStrong,
  InterpretationNote,
  createArticleSectionId,
  type InterpretationNoteProps,
} from "@/components/domain/article";
import {
  CitationMarker,
  createCitationRegistry,
  type CitationRegistry,
} from "@/components/domain/citation";
import type {
  RenderableArticleBlock,
  RenderableArticleBody,
  RenderableArticleInline,
  RenderableArticleSection,
} from "@/data/article-body";
import type { ExplanationDetail } from "@/types/domain/explanation";
import styles from "./ExplanationDetail.module.css";

interface RenderableArticleProps {
  readonly body: RenderableArticleBody;
  readonly explanation: ExplanationDetail<"en-US">;
}

function InlineContent({
  content,
  registry,
  markerPrefix,
}: {
  readonly content: readonly RenderableArticleInline[];
  readonly registry: CitationRegistry;
  readonly markerPrefix: string;
}) {
  return content.map((item, index) => {
    if (item.kind === "text") return <span key={index}>{item.text}</span>;
    if (item.kind === "code") return <code key={index}>{item.text}</code>;
    if (item.kind === "styled") {
      let content: ReactNode = item.text;
      if(item.code) content = <code>{content}</code>;
      if(item.italic) content = <ArticleEmphasis>{content}</ArticleEmphasis>;
      if(item.bold) content = <ArticleStrong>{content}</ArticleStrong>;
      if(item.href) content = <ArticleLink href={item.href} external={item.external}>{content}</ArticleLink>;
      return <span key={index}>{content}</span>;
    }
    if (item.kind === "strong") return <ArticleStrong key={index}>{item.text}</ArticleStrong>;
    if (item.kind === "emphasis") return <ArticleEmphasis key={index}>{item.text}</ArticleEmphasis>;
    if (item.kind === "link") {
      return (
        <ArticleLink key={index} href={item.href} external={item.external}>
          {item.text}
        </ArticleLink>
      );
    }

    const entry = registry.citations.find(
      (citation) => citation.number === item.citationNumber,
    );
    if (!entry) return null;

    return (
      <CitationMarker
        key={index}
        number={entry.number}
        markerId={`${entry.markerId}-${markerPrefix}-${index}`}
        sourceAnchorId={entry.sourceAnchorId}
        sourceTitle={entry.citation.source.sourceTitle}
        locale="en-US"
      />
    );
  });
}

function CanonNote({
  block,
}: {
  readonly block: Extract<RenderableArticleBlock, { readonly kind: "canon_note" }>;
}) {
  const content = <ArticleParagraph>{block.text}</ArticleParagraph>;

  if (block.context.classification === "adaptation_difference") {
    return (
      <AdaptationDifferenceNote context={block.context} locale="en-US" title={block.title}>
        {content}
      </AdaptationDifferenceNote>
    );
  }

  if (
    block.context.classification === "interpretation" ||
    block.context.classification === "unconfirmed_speculative"
  ) {
    const interpretationContext = block.context as unknown as InterpretationNoteProps["context"];
    return (
      <InterpretationNote context={interpretationContext} locale="en-US" title={block.title}>
        {content}
      </InterpretationNote>
    );
  }

  return (
    <ArticleCanonNote context={block.context} locale="en-US" title={block.title}>
      {content}
    </ArticleCanonNote>
  );
}

function Block({
  block,
  explanation,
  registry,
  markerPrefix,
}: {
  readonly block: RenderableArticleBlock;
  readonly explanation: ExplanationDetail<"en-US">;
  readonly registry: CitationRegistry;
  readonly markerPrefix: string;
}) {
  if (block.kind === "paragraph") {
    return (
      <ArticleParagraph>
        <InlineContent content={block.content} registry={registry} markerPrefix={markerPrefix} />
      </ArticleParagraph>
    );
  }

  if (block.kind === "list") {
    return (
      <ArticleList
        ordered={block.ordered}
        items={block.items.map((item, index) => (
          <InlineContent
            key={index}
            content={item}
            registry={registry}
            markerPrefix={`${markerPrefix}-item-${index}`}
          />
        ))}
      />
    );
  }

  if (block.kind === "blockquote") {
    return (
      <ArticleBlockquote attribution={block.attribution}>
        <InlineContent content={block.content} registry={registry} markerPrefix={markerPrefix} />
      </ArticleBlockquote>
    );
  }

  if (block.kind === "image") return <ArticleImage media={block.media} credit={block.credit} />;
  if (block.kind === "divider") return <ArticleDivider />;
  if (block.kind === "canon_note") return <CanonNote block={block} />;

  return (
    <ArticleSpoilerSection
      metadata={block.metadata}
      articleSpoiler={explanation.spoiler}
      locale="en-US"
      screenScopeLabel={explanation.primaryTitle.displayTitle}
      sourceWorkLabel={explanation.sourceWorks?.[0]?.officialTitle}
    >
      <div className={styles.spoilerBody}>
        {block.blocks.map((nested, index) => (
          <Block
            key={index}
            block={nested}
            explanation={explanation}
            registry={registry}
            markerPrefix={`${markerPrefix}-nested-${index}`}
          />
        ))}
      </div>
    </ArticleSpoilerSection>
  );
}

function Section({
  section,
  explanation,
  registry,
  markerPrefix,
}: {
  readonly section: RenderableArticleSection;
  readonly explanation: ExplanationDetail<"en-US">;
  readonly registry: CitationRegistry;
  readonly markerPrefix: string;
}) {
  const id = createArticleSectionId(section.stableKey);

  return (
    <ArticleSection id={id} heading={section.heading} level={section.level} locale="en-US">
      {section.blocks.map((block, index) => (
        <Block
          key={index}
          block={block}
          explanation={explanation}
          registry={registry}
          markerPrefix={`${markerPrefix}-block-${index}`}
        />
      ))}
      {section.sections?.map((nested, index) => (
        <Section
          key={nested.stableKey}
          section={nested}
          explanation={explanation}
          registry={registry}
          markerPrefix={`${markerPrefix}-section-${index}-${nested.stableKey}`}
        />
      ))}
    </ArticleSection>
  );
}

export function RenderableArticle({ body, explanation }: RenderableArticleProps) {
  const registry = createCitationRegistry(explanation.citations ?? []);

  return (
    <ArticleProse locale="en-US" className={styles.articleProse}>
      {registry.citations.map((entry) => (
        <span className="pe-visually-hidden" id={entry.markerId} key={entry.markerId}>
          Citation {entry.number} reference
        </span>
      ))}
      {body.intro.length > 0 ? (
        <div className={styles.articleIntro}>
          {body.intro.map((block, index) => (
            <Block
              key={index}
              block={block}
              explanation={explanation}
              registry={registry}
              markerPrefix={`intro-${index}`}
            />
          ))}
        </div>
      ) : null}
      {body.sections.map((section, index) => (
        <Section
          key={section.stableKey}
          section={section}
          explanation={explanation}
          registry={registry}
          markerPrefix={`section-${index}-${section.stableKey}`}
        />
      ))}
    </ArticleProse>
  );
}
