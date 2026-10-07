import type { PublicRouteFamily } from "@/config/routes";
import type { CanonContext } from "@/types/domain/canon";
import type { CharacterDetail } from "@/types/domain/character";
import type { ExplanationDetail } from "@/types/domain/explanation";
import type { CharacterRelationship, RelationshipState } from "@/types/domain/relationship";
import type { TimelineEvent } from "@/types/domain/timeline";
import type { TitleDetail } from "@/types/domain/title";

export interface RelationshipEventPreview {
  readonly event: TimelineEvent;
  readonly relatedExplanation?: ExplanationDetail<"en-US">;
}

export interface RelationshipMapConnection {
  readonly relationship: CharacterRelationship;
  readonly characterA: CharacterDetail<"en-US">;
  readonly characterB: CharacterDetail<"en-US">;
  readonly safeState?: RelationshipState;
  readonly selected: boolean;
}

export interface RelationshipExperienceViewModel {
  readonly locale: "en-US";
  readonly routeFamily: PublicRouteFamily;
  readonly title: TitleDetail<"en-US">;
  readonly relationship: CharacterRelationship;
  readonly characterA: CharacterDetail<"en-US">;
  readonly characterB: CharacterDetail<"en-US">;
  readonly states: readonly RelationshipState[];
  readonly latestState?: RelationshipState;
  readonly safeState?: RelationshipState;
  readonly currentStateProtected: boolean;
  readonly canonContexts: readonly CanonContext[];
  readonly strongestSpoiler?: RelationshipState["spoiler"];
  readonly relationshipExplanation?: ExplanationDetail<"en-US">;
  readonly relatedExplanations: readonly ExplanationDetail<"en-US">[];
  readonly relevantEvents: readonly RelationshipEventPreview[];
  readonly mapConnections: readonly RelationshipMapConnection[];
  readonly canonicalPath: string;
  readonly isReverseRequest: boolean;
  readonly indexable: boolean;
}
