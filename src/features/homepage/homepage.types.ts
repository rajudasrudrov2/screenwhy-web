import type { PublicRouteFamily } from "@/config/routes";
import type { ExplanationSummary } from "@/types/domain/explanation";

export type HomepageLocale = "en-US";

export interface HomepageQuestionItem {
  readonly question: string;
  readonly explanation: ExplanationSummary<HomepageLocale>;
}

export interface HomepageDiscoveryLane {
  readonly key: "ending" | "characters-mysteries" | "next";
  readonly title: string;
  readonly description: string;
  readonly explanations: readonly ExplanationSummary<HomepageLocale>[];
  readonly browseLabel: string;
  readonly browseHref: string;
}

export interface HomepageGateway {
  readonly routeFamily: Exclude<PublicRouteFamily, "documentaries">;
  readonly title: string;
  readonly description: string;
  readonly href: string;
}

export interface HomepageViewModel {
  readonly locale: HomepageLocale;
  readonly featured: readonly ExplanationSummary<HomepageLocale>[];
  readonly latestLead?: ExplanationSummary<HomepageLocale>;
  readonly latestRelated: readonly ExplanationSummary<HomepageLocale>[];
  readonly discoveryLanes: readonly HomepageDiscoveryLane[];
  readonly viewerQuestions: readonly HomepageQuestionItem[];
  readonly gateways: readonly HomepageGateway[];
  readonly recentlyUpdated: readonly ExplanationSummary<HomepageLocale>[];
}
