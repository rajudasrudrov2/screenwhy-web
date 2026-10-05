import type { PublicRouteFamily } from "@/config/routes";
import { getRepositories } from "@/data";
import type { LocaleCode } from "@/lib/i18n/locales";
import type { ExplanationDetail, ExplanationSummary, ExplanationType } from "@/types/domain/explanation";
import type { CanonContext } from "@/types/domain/canon";
import type { TitleHubTopic, TitleHubViewModel } from "@/features/title-hub/title-hub.types";

const PAGE_SIZE = 100;

function canonKey(context: CanonContext): string {
  return [
    context.classification,
    ...context.scopes.map((scope) =>
      scope.target.kind === "title"
        ? `title:${String(scope.target.titleId)}:${scope.label ?? ""}`
        : `source:${String(scope.target.sourceWorkId)}:${scope.label ?? ""}`,
    ),
  ].join("|");
}

function uniqueCanonContexts(explanations: readonly ExplanationSummary[]): readonly CanonContext[] {
  const seen = new Set<string>();
  const contexts: CanonContext[] = [];
  for (const explanation of explanations) {
    const key = canonKey(explanation.canon);
    if (seen.has(key)) continue;
    seen.add(key);
    contexts.push(explanation.canon);
  }
  return contexts;
}

function groupExplanations(items: readonly ExplanationSummary[]): Readonly<Record<ExplanationType, readonly ExplanationSummary[]>> {
  const grouped: Record<ExplanationType, ExplanationSummary[]> = {
    ending_explained: [],
    character_explained: [],
    mystery_explained: [],
    scene_explained: [],
    relationship_explained: [],
    timeline_explained: [],
    what_happens_next: [],
    book_vs_screen: [],
    recap: [],
    question_answer: [],
  };
  for (const item of items) grouped[item.explanationType].push(item);
  return grouped;
}

function topic(label: string, id: string, count: number, unit: TitleHubTopic["unit"]): TitleHubTopic {
  return { id, label, count, unit };
}

async function resolveExplanationDetails(
  locale: LocaleCode,
  explanations: readonly ExplanationSummary[],
): Promise<readonly ExplanationDetail[]> {
  const repositories = getRepositories();
  const results = await Promise.all(
    explanations.map((item) =>
      repositories.explanations.getBySlug({
        locale,
        slug: item.identity.localization.currentVariant.slug,
      }),
    ),
  );
  return results.flatMap((result) => result.status === "available" ? [result.value] : []);
}

export async function loadTitleHub(
  routeFamily: PublicRouteFamily,
  slug: string,
  locale: LocaleCode = "en-US",
): Promise<TitleHubViewModel | null> {
  const repositories = getRepositories();
  const titleResult = await repositories.titles.getBySlug({ locale, routeFamily, slug });
  if (titleResult.status !== "available") return null;

  const title = titleResult.value;
  const [explanationsPage, charactersPage, relationships, timeline] = await Promise.all([
    repositories.explanations.list({
      locale,
      primaryTitleId: title.identity.logicalId,
      page: 1,
      pageSize: PAGE_SIZE,
    }),
    repositories.characters.list({
      locale,
      titleLogicalId: title.identity.logicalId,
      page: 1,
      pageSize: PAGE_SIZE,
    }),
    repositories.story.getRelationships({ titleLogicalId: title.identity.logicalId }),
    repositories.story.getTimeline({ titleLogicalId: title.identity.logicalId, orderBy: "chronology" }),
  ]);

  const explanations = explanationsPage.items;
  const explanationDetails = await resolveExplanationDetails(locale, explanations);
  const groupedExplanations = groupExplanations(explanations);

  const relatedTitleResults = await Promise.all(
    (title.relatedTitles ?? []).map((relation) =>
      repositories.titles.getBySlug({
        locale,
        routeFamily: relation.title.publicRouteFamily,
        slug: relation.title.slug,
      }),
    ),
  );
  const relatedTitles = relatedTitleResults.flatMap((result) =>
    result.status === "available" ? [result.value] : [],
  );

  const mysteryCount = groupedExplanations.mystery_explained.length + groupedExplanations.question_answer.length;
  const topics = [
    topic("Ending Explained", "ending-explained", groupedExplanations.ending_explained.length, "explanations"),
    topic("Characters", "main-characters", charactersPage.totalItems, "characters"),
    topic("Mysteries & Questions", "mysteries-questions", mysteryCount, "explanations"),
    topic("Relationships", "relationships", relationships.length, "relationships"),
    topic("Timeline", "story-timeline", timeline.length, "events"),
    topic("Book vs Screen", "book-vs-screen", groupedExplanations.book_vs_screen.length, "explanations"),
    topic("What Happens Next?", "what-happens-next", groupedExplanations.what_happens_next.length, "explanations"),
  ].filter((item) => item.count > 0);

  const viewerQuestions = explanationDetails.flatMap((detail) =>
    detail.intendedSubjectQuestion
      ? [{
          question: detail.intendedSubjectQuestion,
          explanation: detail,
        }]
      : [],
  );

  return {
    locale,
    routeFamily,
    title,
    explanationCount: explanationsPage.totalItems,
    explanations,
    explanationDetails,
    groupedExplanations,
    characters: charactersPage.items,
    relationships,
    timeline,
    canonContexts: uniqueCanonContexts(explanations),
    topics,
    primaryEndingDetail: explanationDetails.find((item) => item.explanationType === "ending_explained"),
    viewerQuestions,
    relatedTitles,
  };
}
