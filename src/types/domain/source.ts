import type {
  SerializedDate,
  VerificationState,
} from "@/types/domain/editorial";
import type { SourceId } from "@/types/domain/identity";

export type SourceType =
  | "primary_screen_work"
  | "episode"
  | "official_creator_source"
  | "official_studio_network_source"
  | "creator_interview"
  | "cast_interview"
  | "source_material"
  | "official_script_or_transcript"
  | "reputable_secondary"
  | "database_reference"
  | "community_research";

/** Public-safe source representation. Internal research notes are deliberately absent. */
export interface PublicSource {
  readonly sourceId: SourceId;
  readonly sourceType: SourceType;
  readonly sourceTitle: string;
  readonly creatorAuthor?: string;
  readonly publisher?: string;
  readonly url?: string;
  readonly publicationDate?: SerializedDate;
  readonly accessDate?: SerializedDate;
  readonly externalIdentifier?: string;
  readonly verificationState: VerificationState;
}

export interface PublicCitation {
  readonly source: PublicSource;
  readonly claimSummary?: string;
  readonly sectionAnchor?: string;
  readonly publicVisibility: true;
  readonly verificationState: VerificationState;
}
