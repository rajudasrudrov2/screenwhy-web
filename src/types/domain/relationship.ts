import type { CanonContext } from "@/types/domain/canon";
import type { VerificationState } from "@/types/domain/editorial";
import type {
  InstallmentId,
  RelationshipId,
  RelationshipStateId,
  SourceId,
  TimelineEventId,
} from "@/types/domain/identity";
import type {
  CharacterReference,
  TitleReference,
} from "@/types/domain/references";
import type { SpoilerMetadata } from "@/types/domain/spoiler";

export type RelationshipType =
  | "romantic"
  | "sibling"
  | "parent_child"
  | "family"
  | "friend"
  | "enemy"
  | "ally"
  | "mentor"
  | "colleague"
  | "former_relationship"
  | "unknown_complex";

export interface RelationshipState {
  readonly relationshipStateId: RelationshipStateId;
  readonly sequence: number;
  readonly relationshipType: RelationshipType;
  readonly roleA?: string;
  readonly roleB?: string;
  readonly description?: string;
  readonly startEventId?: TimelineEventId;
  readonly startInstallmentId?: InstallmentId;
  readonly endEventId?: TimelineEventId;
  readonly endInstallmentId?: InstallmentId;
  readonly canon: CanonContext;
  readonly spoiler: SpoilerMetadata;
  readonly evidenceSourceIds?: readonly SourceId[];
  readonly verificationState: VerificationState;
}

/** One canonical A↔B graph edge. Directional meaning belongs in state roles, not row duplication. */
export interface CharacterRelationship {
  readonly relationshipId: RelationshipId;
  readonly characterA: CharacterReference;
  readonly characterB: CharacterReference;
  readonly contextTitle: TitleReference;
  readonly summary?: string;
  readonly verificationState: VerificationState;
  readonly states: readonly RelationshipState[];
}
