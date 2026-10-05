import type { CanonContext } from "@/types/domain/canon";
import type { CharacterDetail } from "@/types/domain/character";
import type { ExplanationDetail } from "@/types/domain/explanation";
import type { CharacterRelationship, RelationshipState } from "@/types/domain/relationship";
import type { TimelineEvent } from "@/types/domain/timeline";
import type { TitleDetail } from "@/types/domain/title";

export interface CharacterRelationshipPreview {
  readonly relationship: CharacterRelationship;
  readonly counterpart: CharacterDetail<"en-US">;
  readonly currentRole?: string;
  readonly counterpartRole?: string;
  readonly safeState?: RelationshipState;
  readonly protectedStates: readonly RelationshipState[];
}

export interface CharacterViewerQuestion {
  readonly question: string;
  readonly explanation: ExplanationDetail<"en-US">;
}

export interface CharacterDetailViewModel {
  readonly locale: "en-US";
  readonly character: CharacterDetail<"en-US">;
  readonly primaryTitle: TitleDetail<"en-US">;
  readonly characterExplanation?: ExplanationDetail<"en-US">;
  readonly relatedExplanations: readonly ExplanationDetail<"en-US">[];
  readonly mysteriesAndReveals: readonly ExplanationDetail<"en-US">[];
  readonly adaptationExplanations: readonly ExplanationDetail<"en-US">[];
  readonly relationships: readonly CharacterRelationshipPreview[];
  readonly timeline: readonly TimelineEvent[];
  readonly viewerQuestions: readonly CharacterViewerQuestion[];
  readonly canonContexts: readonly CanonContext[];
}
