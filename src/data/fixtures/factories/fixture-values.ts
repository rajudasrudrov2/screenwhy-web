import type { LocaleCode } from "@/lib/i18n/locales";
import type { ArticleBodyDocument } from "@/types/domain/explanation";
import type { LegacyMockArticleBlock, MockArticleDocumentPayload } from "@/data/article-body/mock-schema";
import type {
  SerializedDate,
  SerializedDateTime,
} from "@/types/domain/editorial";
import type {
  CharacterLogicalGroupId,
  ExplanationLogicalGroupId,
  TitleLogicalGroupId,
  InstallmentId,
  LocalizedVariantId,
  LogicalEntityKind,
  LogicalGroupId,
  RelationshipId,
  RelationshipStateId,
  SourceId,
  SourceWorkId,
  TimelineEventId,
  ViewerQuestionId,
  WordPressPostId,
  WordPressUserId,
} from "@/types/domain/identity";
import type { TitleReleaseStatus } from "@/types/domain/title";

/**
 * Fixture-only construction boundary for compile-time opaque/branded domain
 * primitives. Production domain contracts intentionally expose no runtime
 * constructors, so all fixture assertions stay isolated here rather than being
 * scattered through data records.
 */
export function logicalGroupId<TKind extends LogicalEntityKind>(
  _kind: TKind,
  value: string,
): LogicalGroupId<TKind> {
  return value as LogicalGroupId<TKind>;
}

export const titleLogicalId = (value: string): TitleLogicalGroupId =>
  logicalGroupId("title", value);

export const characterLogicalId = (
  value: string,
): CharacterLogicalGroupId => logicalGroupId("character", value);

export const explanationLogicalId = (
  value: string,
): ExplanationLogicalGroupId => logicalGroupId("explanation", value);

export function localizedVariantId<TKind extends LogicalEntityKind>(
  _kind: TKind,
  value: string,
): LocalizedVariantId<TKind> {
  return value as LocalizedVariantId<TKind>;
}

export const wordpressPostId = (value: number): WordPressPostId =>
  value as WordPressPostId;

export const wordpressUserId = (value: number): WordPressUserId =>
  value as WordPressUserId;

export const installmentId = (value: string): InstallmentId =>
  value as InstallmentId;

export const relationshipId = (value: string): RelationshipId =>
  value as RelationshipId;

export const relationshipStateId = (value: string): RelationshipStateId =>
  value as RelationshipStateId;

export const timelineEventId = (value: string): TimelineEventId =>
  value as TimelineEventId;

export const sourceWorkId = (value: string): SourceWorkId =>
  value as SourceWorkId;

export const sourceId = (value: string): SourceId => value as SourceId;

export const viewerQuestionId = (value: string): ViewerQuestionId =>
  value as ViewerQuestionId;

export const serializedDate = (value: string): SerializedDate =>
  value as SerializedDate;

export const serializedDateTime = (value: string): SerializedDateTime =>
  value as SerializedDateTime;

export const titleReleaseStatus = (value: string): TitleReleaseStatus =>
  value as TitleReleaseStatus;

export type MockArticleBlock = LegacyMockArticleBlock;

/**
 * ArticleBodyDocument is intentionally opaque in production contracts. The
 * fixture boundary may wrap either the original minimal block array or the
 * richer ScreenWhy mock-article document used by Explanation Detail QA.
 */
export function articleBodyDocument(
  payload: readonly LegacyMockArticleBlock[] | MockArticleDocumentPayload,
): ArticleBodyDocument {
  const document = Array.isArray(payload) ? { blocks: payload } : payload;
  return Object.freeze(document) as unknown as ArticleBodyDocument;
}

export interface FixtureVariantSeed<TKind extends LogicalEntityKind> {
  readonly kind: TKind;
  readonly locale: LocaleCode;
  readonly variantKey: string;
  readonly wordpressPostId: number;
  readonly slug: string;
}
