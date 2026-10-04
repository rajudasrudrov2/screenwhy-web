import type { LocaleCode } from "@/lib/i18n/locales";
import type { CanonContext } from "@/types/domain/canon";
import type {
  EditorialContributorSummary,
  EditorialDates,
  EditorialStage,
  PublicationState,
  VerificationMetadata,
} from "@/types/domain/editorial";
import type { ViewerQuestionId } from "@/types/domain/identity";
import type { LocalizedEntityIdentity } from "@/types/domain/localization";
import type {
  CharacterReference,
  ExplanationReference,
  SourceWorkReference,
  TitleReference,
} from "@/types/domain/references";
import type { SeoMetadata } from "@/types/domain/seo";
import type { PublicCitation } from "@/types/domain/source";
import type { ExplanationSpoilerContext } from "@/types/domain/spoiler";

export const EXPLANATION_TYPES = [
  "ending_explained",
  "character_explained",
  "mystery_explained",
  "scene_explained",
  "relationship_explained",
  "timeline_explained",
  "what_happens_next",
  "book_vs_screen",
  "recap",
  "question_answer",
] as const;

export type ExplanationType = (typeof EXPLANATION_TYPES)[number];

export const EXPLANATION_TYPE_LABELS = {
  ending_explained: "Ending Explained",
  character_explained: "Character Explained",
  mystery_explained: "Mystery Explained",
  scene_explained: "Scene Explained",
  relationship_explained: "Relationship Explained",
  timeline_explained: "Timeline Explained",
  what_happens_next: "What Happens Next",
  book_vs_screen: "Book vs Screen",
  recap: "Recap",
  question_answer: "Question Answer",
} as const satisfies Record<ExplanationType, string>;

/**
 * Opaque structured-content document. PE-FE-01C-B/adapters will define how
 * transport payloads are validated/mapped. The UI must not depend on raw CMS
 * block shapes at this stage.
 */
declare const articleBodyDocumentBrand: unique symbol;
export interface ArticleBodyDocument {
  readonly [articleBodyDocumentBrand]: "article-body-document";
}

export interface ArticleBodyBoundary {
  readonly format: "structured_document";
  readonly document: ArticleBodyDocument;
}

export interface ExplanationSummary<TLocale extends LocaleCode = LocaleCode> {
  readonly identity: LocalizedEntityIdentity<"explanation", TLocale>;
  readonly articleTitle: string;
  readonly excerpt?: string;
  readonly explanationType: ExplanationType;
  readonly primaryTitle: TitleReference;
  readonly spoiler: ExplanationSpoilerContext;
  readonly canon: CanonContext;
  readonly verification: VerificationMetadata;
  readonly dates: EditorialDates;
}

export interface ExplanationDetail<TLocale extends LocaleCode = LocaleCode>
  extends ExplanationSummary<TLocale> {
  readonly quickAnswer: string;
  readonly body: ArticleBodyBoundary;
  readonly secondaryTitles?: readonly TitleReference[];
  readonly relatedCharacters?: readonly CharacterReference[];
  readonly relatedExplanations?: readonly ExplanationReference[];
  readonly sourceWorks?: readonly SourceWorkReference[];
  readonly intendedSubjectQuestion?: string;
  readonly answeredViewerQuestionId?: ViewerQuestionId;
  readonly author: EditorialContributorSummary;
  readonly reviewerEditor?: EditorialContributorSummary;
  readonly publicationState: PublicationState;
  readonly editorialStage: EditorialStage;
  readonly citations?: readonly PublicCitation[];
  readonly seo: SeoMetadata;
}
