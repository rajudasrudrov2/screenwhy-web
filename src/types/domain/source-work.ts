import type {
  SerializedDate,
  VerificationState,
} from "@/types/domain/editorial";
import type { SourceWorkId } from "@/types/domain/identity";
import type { MediaAsset } from "@/types/domain/media";
import type { TitleReference } from "@/types/domain/references";

export type SourceWorkType =
  | "novel"
  | "book"
  | "manga"
  | "comic"
  | "light_novel"
  | "game"
  | "other_source_work";

export type SourceWorkRelationshipType = "adapted_from" | "based_on";

export interface SourceWorkSummary {
  readonly sourceWorkId: SourceWorkId;
  readonly officialTitle: string;
  readonly workType: SourceWorkType;
  readonly creatorAuthor?: string;
  readonly verificationState: VerificationState;
}

export interface SourceWorkDetail extends SourceWorkSummary {
  readonly originalTitle?: string;
  readonly alternateTitles?: readonly string[];
  readonly originalLanguage?: string;
  readonly publisher?: string;
  readonly initialPublicationDate?: SerializedDate;
  readonly initialPublicationYear?: number;
  readonly editionNotes?: string;
  readonly coverMedia?: MediaAsset;
  readonly externalIdentifiers?: Readonly<Record<string, string>>;
  readonly relatedScreenTitles?: readonly TitleReference[];
}

export interface SourceWorkRelationship {
  readonly relationshipType: SourceWorkRelationshipType;
  readonly sourceWork: SourceWorkSummary;
}
