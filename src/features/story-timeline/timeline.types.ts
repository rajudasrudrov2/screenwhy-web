import type { PublicRouteFamily } from "@/config/routes";
import type { CanonContext } from "@/types/domain/canon";
import type { CharacterDetail } from "@/types/domain/character";
import type { ExplanationDetail } from "@/types/domain/explanation";
import type { CharacterRelationship } from "@/types/domain/relationship";
import type { TimelineEvent } from "@/types/domain/timeline";
import type { TitleDetail } from "@/types/domain/title";
import type { TimelineOrderMode } from "@/features/story-timeline/timeline.utils";

export interface TimelineRelationshipLink {
  readonly relationship: CharacterRelationship;
  readonly href: string;
  readonly label: string;
}

export interface TimelineEventViewModel {
  readonly event: TimelineEvent;
  readonly anchorId: string;
  readonly characters: readonly CharacterDetail<"en-US">[];
  readonly relatedExplanation?: ExplanationDetail<"en-US">;
  readonly relationshipLinks: readonly TimelineRelationshipLink[];
}

export interface StoryTimelineViewModel {
  readonly locale: "en-US";
  readonly routeFamily: PublicRouteFamily;
  readonly title: TitleDetail<"en-US">;
  readonly order: TimelineOrderMode;
  readonly chronologicalEvents: readonly TimelineEvent[];
  readonly presentationEvents: readonly TimelineEvent[];
  readonly events: readonly TimelineEventViewModel[];
  readonly canonContexts: readonly CanonContext[];
  readonly strongestSpoiler?: TimelineEvent["spoiler"];
  readonly relatedExplanations: readonly ExplanationDetail<"en-US">[];
  readonly canonicalPath: string;
  readonly chronologyPath: string;
  readonly presentationPath: string;
  readonly indexable: boolean;
}
