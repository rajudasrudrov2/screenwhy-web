import { relationshipRoute, timelineRoute } from "@/config/routes";
import type { PublicRouteFamily } from "@/config/routes";
import { getRepositories } from "@/data";
import type { CanonContext } from "@/types/domain/canon";
import type { CharacterDetail } from "@/types/domain/character";
import type { ExplanationDetail, ExplanationSummary } from "@/types/domain/explanation";
import type { CharacterReference } from "@/types/domain/references";
import type { CharacterRelationship } from "@/types/domain/relationship";
import type { TimelineEvent } from "@/types/domain/timeline";
import type {
  StoryTimelineViewModel,
  TimelineEventViewModel,
  TimelineRelationshipLink,
} from "@/features/story-timeline/timeline.types";
import {
  isProtectedTimelineEvent,
  sortTimelineEvents,
  strongestTimelineSpoiler,
  timelineEventAnchor,
  type TimelineOrderMode,
} from "@/features/story-timeline/timeline.utils";

const PAGE_SIZE = 100;
const RELATED_EXPLANATION_TYPES = new Set([
  "timeline_explained",
  "scene_explained",
  "mystery_explained",
  "ending_explained",
]);

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

function uniqueCanonContexts(events: readonly TimelineEvent[]): readonly CanonContext[] {
  const seen = new Set<string>();
  const result: CanonContext[] = [];
  for (const event of events) {
    const key = canonKey(event.canon);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(event.canon);
  }
  return result;
}

async function resolveCharacters(
  events: readonly TimelineEvent[],
): Promise<ReadonlyMap<string, CharacterDetail<"en-US">>> {
  const repositories = getRepositories();
  const references = new Map<string, CharacterReference>();
  for (const event of events) {
    for (const reference of event.characters ?? []) {
      references.set(String(reference.logicalId), reference);
    }
  }

  const resolved = await Promise.all(
    [...references.values()].map(async (reference) => {
      const result = await repositories.characters.getBySlug({
        locale: "en-US",
        slug: reference.slug,
      });
      if (result.status !== "available") return null;
      if (result.value.identity.logicalId !== reference.logicalId) return null;
      return [String(reference.logicalId), result.value] as const;
    }),
  );

  return new Map(resolved.flatMap((entry) => entry ? [entry] : []));
}

async function resolveExplanationDetails(
  summaries: readonly ExplanationSummary<"en-US">[],
): Promise<readonly ExplanationDetail<"en-US">[]> {
  const repositories = getRepositories();
  const results = await Promise.all(
    summaries.map((summary) =>
      repositories.explanations.getBySlug({
        locale: "en-US",
        slug: summary.identity.localization.currentVariant.slug,
      }),
    ),
  );
  return results.flatMap((result) => result.status === "available" ? [result.value] : []);
}

function selectRelatedExplanations(
  events: readonly TimelineEvent[],
  details: readonly ExplanationDetail<"en-US">[],
): readonly ExplanationDetail<"en-US">[] {
  const linkedIds = new Set(
    events
      .filter((event) => !isProtectedTimelineEvent(event))
      .flatMap((event) => event.relatedExplanation ? [String(event.relatedExplanation.logicalId)] : []),
  );
  const seen = new Set<string>();
  const selected: ExplanationDetail<"en-US">[] = [];

  for (const detail of details) {
    const id = String(detail.identity.logicalId);
    const explicitlyLinked = linkedIds.has(id);
    const timelineEditorial = detail.explanationType === "timeline_explained";
    if (!explicitlyLinked && !timelineEditorial) continue;
    if (!RELATED_EXPLANATION_TYPES.has(detail.explanationType)) continue;
    if (seen.has(id)) continue;
    seen.add(id);
    selected.push(detail);
  }

  return selected;
}

function eventRelationshipLinks(
  event: TimelineEvent,
  relationships: readonly CharacterRelationship[],
  routeFamily: PublicRouteFamily,
  titleSlug: string,
): readonly TimelineRelationshipLink[] {
  const eventCharacterIds = new Set(
    (event.characters ?? []).map((character) => String(character.logicalId)),
  );
  if (eventCharacterIds.size < 2) return [];

  return relationships.flatMap((relationship) => {
    const includesPair =
      eventCharacterIds.has(String(relationship.characterA.logicalId)) &&
      eventCharacterIds.has(String(relationship.characterB.logicalId));
    if (!includesPair) return [];
    return [{
      relationship,
      href: relationshipRoute(
        routeFamily,
        titleSlug,
        relationship.characterA.slug,
        relationship.characterB.slug,
        "en-US",
      ),
      label: `${relationship.characterA.displayName} & ${relationship.characterB.displayName} relationship`,
    } satisfies TimelineRelationshipLink];
  });
}

function buildEventViewModels(
  events: readonly TimelineEvent[],
  characterMap: ReadonlyMap<string, CharacterDetail<"en-US">>,
  explanationDetails: readonly ExplanationDetail<"en-US">[],
  relationships: readonly CharacterRelationship[],
  routeFamily: PublicRouteFamily,
  titleSlug: string,
): readonly TimelineEventViewModel[] {
  const explanationById = new Map(
    explanationDetails.map((detail) => [String(detail.identity.logicalId), detail] as const),
  );

  return events.map((event) => ({
    event,
    anchorId: timelineEventAnchor(event),
    characters: (event.characters ?? []).flatMap((reference) => {
      const character = characterMap.get(String(reference.logicalId));
      return character ? [character] : [];
    }),
    relatedExplanation: event.relatedExplanation
      ? explanationById.get(String(event.relatedExplanation.logicalId))
      : undefined,
    relationshipLinks: eventRelationshipLinks(event, relationships, routeFamily, titleSlug),
  }));
}

export async function loadStoryTimeline(
  routeFamily: PublicRouteFamily,
  titleSlug: string,
  order: TimelineOrderMode = "chronology",
): Promise<StoryTimelineViewModel | null> {
  const repositories = getRepositories();
  const titleResult = await repositories.titles.getBySlug({
    locale: "en-US",
    routeFamily,
    slug: titleSlug,
  });
  if (titleResult.status !== "available") return null;

  const title = titleResult.value;
  const canonicalTitleSlug = title.identity.localization.currentVariant.slug;
  const [chronologyRaw, presentationRaw, relationships, explanationsPage] = await Promise.all([
    repositories.story.getTimeline({
      titleLogicalId: title.identity.logicalId,
      orderBy: "chronology",
    }),
    repositories.story.getTimeline({
      titleLogicalId: title.identity.logicalId,
      orderBy: "presentation",
    }),
    repositories.story.getRelationships({
      titleLogicalId: title.identity.logicalId,
    }),
    repositories.explanations.list({
      locale: "en-US",
      primaryTitleId: title.identity.logicalId,
      page: 1,
      pageSize: PAGE_SIZE,
    }),
  ]);

  const chronologicalEvents = sortTimelineEvents(chronologyRaw, "chronology");
  const presentationEvents = sortTimelineEvents(presentationRaw, "presentation");
  const allEvents = chronologicalEvents;
  const [characterMap, explanationDetails] = await Promise.all([
    resolveCharacters(allEvents),
    resolveExplanationDetails(explanationsPage.items),
  ]);

  const selectedEvents = order === "presentation" ? presentationEvents : chronologicalEvents;
  const events = buildEventViewModels(
    selectedEvents,
    characterMap,
    explanationDetails,
    relationships,
    routeFamily,
    canonicalTitleSlug,
  );
  const relatedExplanations = selectRelatedExplanations(allEvents, explanationDetails);
  const canonicalPath = timelineRoute(routeFamily, canonicalTitleSlug, "chronology", "en-US");

  return {
    locale: "en-US",
    routeFamily,
    title,
    order,
    chronologicalEvents,
    presentationEvents,
    events,
    canonContexts: uniqueCanonContexts(allEvents),
    strongestSpoiler: strongestTimelineSpoiler(allEvents),
    relatedExplanations,
    canonicalPath,
    chronologyPath: canonicalPath,
    presentationPath: timelineRoute(routeFamily, canonicalTitleSlug, "presentation", "en-US"),
    indexable:
      allEvents.length > 0 &&
      allEvents.some((event) => event.verificationState !== "unverified"),
  };
}
