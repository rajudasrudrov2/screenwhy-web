import type { SourceId, WordPressUserId } from "@/types/domain/identity";

/** Serialized ISO-compatible values crossing an API boundary. */
declare const serializedDateBrand: unique symbol;

export type SerializedDate = string & {
  readonly [serializedDateBrand]: "date";
};

export type SerializedDateTime = string & {
  readonly [serializedDateBrand]: "date-time";
};

export type PublicationState = "draft" | "pending" | "published" | "private";

export type EditorialStage =
  | "drafting"
  | "researching"
  | "fact_check"
  | "editorial_review"
  | "ready"
  | "published"
  | "needs_update";

export type VerificationState =
  | "unverified"
  | "source_checked"
  | "fact_checked"
  | "approved";

export interface EditorialDates {
  readonly datePublished?: SerializedDateTime;
  readonly dateModified?: SerializedDateTime;
  readonly lastReviewed?: SerializedDateTime;
}

export interface VerificationMetadata {
  readonly state: VerificationState;
  readonly sourceIds?: readonly SourceId[];
  readonly verifiedAt?: SerializedDateTime;
  readonly verifiedBy?: WordPressUserId;
}

export interface EditorialContributorSummary {
  readonly userId: WordPressUserId;
  readonly displayName: string;
  readonly slug?: string;
  readonly roleTitle?: string;
}
