/**
 * Language-neutral identity types for the PlotExplainer frontend domain.
 *
 * These are compile-time brands only. They intentionally add no runtime
 * wrapper/class overhead while preventing unrelated identifiers from being
 * passed interchangeably by accident.
 */
declare const domainIdBrand: unique symbol;

type DomainId<TValue extends string | number, TBrand extends string> =
  TValue & { readonly [domainIdBrand]: TBrand };

export type LogicalEntityKind = "title" | "character" | "explanation";

export type LogicalGroupId<
  TKind extends LogicalEntityKind = LogicalEntityKind,
> = DomainId<string, `logical-group:${TKind}`>;

export type TitleLogicalGroupId = LogicalGroupId<"title">;
export type CharacterLogicalGroupId = LogicalGroupId<"character">;
export type ExplanationLogicalGroupId = LogicalGroupId<"explanation">;

export type LocalizedVariantId<
  TKind extends LogicalEntityKind = LogicalEntityKind,
> = DomainId<string, `localized-variant:${TKind}`>;

export type WordPressPostId = DomainId<number, "wordpress-post">;
export type WordPressUserId = DomainId<number, "wordpress-user">;

export type InstallmentId = DomainId<string, "installment">;
export type RelationshipId = DomainId<string, "relationship">;
export type RelationshipStateId = DomainId<string, "relationship-state">;
export type TimelineEventId = DomainId<string, "timeline-event">;
export type SourceWorkId = DomainId<string, "source-work">;
export type SourceId = DomainId<string, "source">;
export type ViewerQuestionId = DomainId<string, "viewer-question">;

export interface LogicalEntityIdentity<
  TKind extends LogicalEntityKind = LogicalEntityKind,
> {
  readonly kind: TKind;
  readonly logicalId: LogicalGroupId<TKind>;
}
