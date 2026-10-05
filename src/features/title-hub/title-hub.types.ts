import type { PublicRouteFamily } from "@/config/routes";
import type { CharacterSummary } from "@/types/domain/character";
import type { CanonContext } from "@/types/domain/canon";
import type { ExplanationDetail, ExplanationSummary, ExplanationType } from "@/types/domain/explanation";
import type { LocaleCode } from "@/lib/i18n/locales";
import type { CharacterRelationship } from "@/types/domain/relationship";
import type { TimelineEvent } from "@/types/domain/timeline";
import type { TitleDetail, TitleSummary } from "@/types/domain/title";

export interface TitleHubTopic {
  readonly id: string;
  readonly label: string;
  readonly count: number;
  readonly unit: "explanations" | "characters" | "relationships" | "events";
}

export interface TitleHubViewerQuestion {
  readonly question: string;
  readonly explanation: ExplanationSummary;
}

export interface TitleHubViewModel {
  readonly locale: LocaleCode;
  readonly routeFamily: PublicRouteFamily;
  readonly title: TitleDetail;
  readonly explanationCount: number;
  readonly explanations: readonly ExplanationSummary[];
  readonly explanationDetails: readonly ExplanationDetail[];
  readonly groupedExplanations: Readonly<Record<ExplanationType, readonly ExplanationSummary[]>>;
  readonly characters: readonly CharacterSummary[];
  readonly relationships: readonly CharacterRelationship[];
  readonly timeline: readonly TimelineEvent[];
  readonly canonContexts: readonly CanonContext[];
  readonly topics: readonly TitleHubTopic[];
  readonly primaryEndingDetail?: ExplanationDetail;
  readonly viewerQuestions: readonly TitleHubViewerQuestion[];
  readonly relatedTitles: readonly TitleSummary[];
}
