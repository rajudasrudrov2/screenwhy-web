import { getRepositories } from "@/data";
import type { ExplanationDetail, ExplanationSummary, ExplanationType } from "@/types/domain/explanation";
import {
  DISCOVERY_LANE_TYPES,
  FEATURED_EXPLANATION_TYPE_ORDER,
  homepageBrowseExplanationsHref,
  homepageGateways,
} from "./homepage.config";
import type {
  HomepageDiscoveryLane,
  HomepageLocale,
  HomepageQuestionItem,
  HomepageViewModel,
} from "./homepage.types";

const MAX_HOME_EXPLANATIONS = 50;

function timestamp(value?: string): number {
  if (!value) return 0;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function byPublishedDesc(
  a: ExplanationSummary<HomepageLocale>,
  b: ExplanationSummary<HomepageLocale>,
): number {
  return timestamp(b.dates.datePublished) - timestamp(a.dates.datePublished);
}

function byUpdatedDesc(
  a: ExplanationSummary<HomepageLocale>,
  b: ExplanationSummary<HomepageLocale>,
): number {
  const aValue = a.dates.lastReviewed ?? a.dates.dateModified ?? a.dates.datePublished;
  const bValue = b.dates.lastReviewed ?? b.dates.dateModified ?? b.dates.datePublished;
  return timestamp(bValue) - timestamp(aValue);
}

function curatedFeatured(
  items: readonly ExplanationSummary<HomepageLocale>[],
): readonly ExplanationSummary<HomepageLocale>[] {
  const selected: ExplanationSummary<HomepageLocale>[] = [];
  const used = new Set<string>();

  for (const type of FEATURED_EXPLANATION_TYPE_ORDER) {
    const match = items.find(
      (item) =>
        item.explanationType === type &&
        !used.has(String(item.identity.logicalId)),
    );
    if (!match) continue;
    selected.push(match);
    used.add(String(match.identity.logicalId));
  }

  for (const item of items) {
    if (selected.length >= 3) break;
    const id = String(item.identity.logicalId);
    if (used.has(id)) continue;
    selected.push(item);
    used.add(id);
  }

  return selected.slice(0, 3);
}

function selectTypes(
  items: readonly ExplanationSummary<HomepageLocale>[],
  types: readonly ExplanationType[],
  limit = 3,
): readonly ExplanationSummary<HomepageLocale>[] {
  const accepted = new Set<ExplanationType>(types);
  return items.filter((item) => accepted.has(item.explanationType)).slice(0, limit);
}

function buildDiscoveryLanes(
  items: readonly ExplanationSummary<HomepageLocale>[],
  locale: HomepageLocale,
): readonly HomepageDiscoveryLane[] {
  const browseHref = homepageBrowseExplanationsHref(locale);

  return [
    {
      key: "ending",
      title: "Ending Explained",
      description: "Understand the final scene, reveal or unresolved beat without rereading a full recap.",
      explanations: selectTypes(items, DISCOVERY_LANE_TYPES.ending),
      browseLabel: "Browse ending explanations",
      browseHref,
    },
    {
      key: "characters-mysteries",
      title: "Characters & Mysteries",
      description: "Follow motivations, identities, relationships and clues while keeping fact separate from interpretation.",
      explanations: selectTypes(items, DISCOVERY_LANE_TYPES.charactersMysteries),
      browseLabel: "Browse character and mystery guides",
      browseHref,
    },
    {
      key: "next",
      title: "What Happens Next?",
      description: "See what the story sets up next, with confirmed canon separated from reasonable interpretation.",
      explanations: selectTypes(items, DISCOVERY_LANE_TYPES.next),
      browseLabel: "Browse what happens next",
      browseHref,
    },
  ];
}

async function loadViewerQuestions(
  summaries: readonly ExplanationSummary<HomepageLocale>[],
): Promise<readonly HomepageQuestionItem[]> {
  const repositories = getRepositories();
  const results = await Promise.all(
    summaries.map((summary) =>
      repositories.explanations.getBySlug({
        locale: "en-US",
        slug: summary.identity.localization.currentVariant.slug,
      }),
    ),
  );

  const questions: HomepageQuestionItem[] = [];
  for (const result of results) {
    if (result.status !== "available") continue;
    const detail: ExplanationDetail<HomepageLocale> = result.value;
    if (!detail.intendedSubjectQuestion) continue;
    questions.push({
      question: detail.intendedSubjectQuestion,
      explanation: detail,
    });
  }

  return questions.slice(0, 4);
}

export async function loadHomepage(
  locale: HomepageLocale = "en-US",
): Promise<HomepageViewModel> {
  const repositories = getRepositories();
  const result = await repositories.explanations.list({
    locale,
    page: 1,
    pageSize: MAX_HOME_EXPLANATIONS,
  });

  const publishedOrder = [...result.items].sort(byPublishedDesc);
  const viewerQuestions = await loadViewerQuestions(result.items);

  return {
    locale,
    featured: curatedFeatured(result.items),
    latestLead: publishedOrder[0],
    latestRelated: publishedOrder.slice(1, 4),
    discoveryLanes: buildDiscoveryLanes(result.items, locale),
    viewerQuestions,
    gateways: homepageGateways(locale),
    recentlyUpdated: [...result.items].sort(byUpdatedDesc).slice(0, 3),
  };
}
