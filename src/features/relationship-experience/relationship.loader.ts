import type { PublicRouteFamily } from "@/config/routes";
import { relationshipRoute } from "@/config/routes";
import { getRepositories } from "@/data";
import type { CanonContext } from "@/types/domain/canon";
import type { CharacterDetail } from "@/types/domain/character";
import type { ExplanationDetail, ExplanationType } from "@/types/domain/explanation";
import type { CharacterReference } from "@/types/domain/references";
import type { CharacterRelationship, RelationshipState } from "@/types/domain/relationship";
import type { TimelineEvent } from "@/types/domain/timeline";
import type {
  RelationshipEventPreview,
  RelationshipExperienceViewModel,
  RelationshipMapConnection,
} from "@/features/relationship-experience/relationship.types";
import {
  isProtectedRelationshipState,
  latestRelationshipState,
  latestSafeRelationshipState,
  relationshipMatchesSlugs,
  sortedRelationshipStates,
  strongestRelationshipSpoiler,
} from "@/features/relationship-experience/relationship.utils";

const PAGE_SIZE = 100;

const EXPLANATION_PRIORITY: Readonly<Record<ExplanationType, number>> = {
  relationship_explained: 0,
  scene_explained: 1,
  mystery_explained: 2,
  character_explained: 3,
  ending_explained: 4,
  question_answer: 5,
  book_vs_screen: 6,
  timeline_explained: 7,
  what_happens_next: 8,
  recap: 9,
};

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

function uniqueCanonContexts(states: readonly RelationshipState[]): readonly CanonContext[] {
  const seen = new Set<string>();
  const contexts: CanonContext[] = [];
  for (const state of states) {
    const key = canonKey(state.canon);
    if (seen.has(key)) continue;
    seen.add(key);
    contexts.push(state.canon);
  }
  return contexts;
}

function includesCharacter(
  detail: ExplanationDetail<"en-US">,
  logicalId: CharacterDetail<"en-US">["identity"]["logicalId"],
): boolean {
  return detail.relatedCharacters?.some((character) => character.logicalId === logicalId) ?? false;
}

function eventHasCharacter(event: TimelineEvent, character: CharacterReference): boolean {
  return event.characters?.some((item) => item.logicalId === character.logicalId) ?? false;
}

function relevantRelationshipEvents(
  timeline: readonly TimelineEvent[],
  relationship: CharacterRelationship,
  states: readonly RelationshipState[],
): readonly TimelineEvent[] {
  const explicitlyLinked = new Set(
    states.flatMap((state) => [state.startEventId, state.endEventId].filter(Boolean).map(String)),
  );

  return timeline.filter((event) => {
    const bothCharacters =
      eventHasCharacter(event, relationship.characterA) &&
      eventHasCharacter(event, relationship.characterB);
    return bothCharacters || explicitlyLinked.has(String(event.timelineEventId));
  });
}

async function resolveCharacter(slug: string): Promise<CharacterDetail<"en-US"> | null> {
  const result = await getRepositories().characters.getBySlug({ locale: "en-US", slug });
  return result.status === "available" ? result.value : null;
}

async function resolveTitleExplanations(
  titleLogicalId: RelationshipExperienceViewModel["title"]["identity"]["logicalId"],
): Promise<readonly ExplanationDetail<"en-US">[]> {
  const repositories = getRepositories();
  const page = await repositories.explanations.list({
    locale: "en-US",
    primaryTitleId: titleLogicalId,
    page: 1,
    pageSize: PAGE_SIZE,
  });
  const details = await Promise.all(
    page.items.map((summary) =>
      repositories.explanations.getBySlug({
        locale: "en-US",
        slug: summary.identity.localization.currentVariant.slug,
      }),
    ),
  );
  return details.flatMap((result) => result.status === "available" ? [result.value] : []);
}

function relatedExplanations(
  details: readonly ExplanationDetail<"en-US">[],
  characterA: CharacterDetail<"en-US">,
  characterB: CharacterDetail<"en-US">,
): readonly ExplanationDetail<"en-US">[] {
  return [...details]
    .filter((detail) =>
      includesCharacter(detail, characterA.identity.logicalId) ||
      includesCharacter(detail, characterB.identity.logicalId),
    )
    .sort((left, right) =>
      EXPLANATION_PRIORITY[left.explanationType] - EXPLANATION_PRIORITY[right.explanationType],
    );
}

async function resolveEventPreviews(
  events: readonly TimelineEvent[],
  explanationDetails: readonly ExplanationDetail<"en-US">[],
): Promise<readonly RelationshipEventPreview[]> {
  const repositories = getRepositories();
  const previews = await Promise.all(events.map(async (event) => {
    if (!event.relatedExplanation) return { event } satisfies RelationshipEventPreview;

    const alreadyResolved = explanationDetails.find(
      (detail) => detail.identity.logicalId === event.relatedExplanation?.logicalId,
    );
    if (alreadyResolved) return { event, relatedExplanation: alreadyResolved } satisfies RelationshipEventPreview;

    const result = await repositories.explanations.getBySlug({
      locale: "en-US",
      slug: event.relatedExplanation.slug,
    });
    return result.status === "available"
      ? { event, relatedExplanation: result.value } satisfies RelationshipEventPreview
      : { event } satisfies RelationshipEventPreview;
  }));
  return previews;
}

function relationshipTouchesSelectedPair(
  relationship: CharacterRelationship,
  selected: CharacterRelationship,
): boolean {
  const selectedIds = new Set([
    String(selected.characterA.logicalId),
    String(selected.characterB.logicalId),
  ]);
  return (
    selectedIds.has(String(relationship.characterA.logicalId)) ||
    selectedIds.has(String(relationship.characterB.logicalId))
  );
}

async function resolveMapConnections(
  relationships: readonly CharacterRelationship[],
  selectedRelationship: CharacterRelationship,
  selectedA: CharacterDetail<"en-US">,
  selectedB: CharacterDetail<"en-US">,
): Promise<readonly RelationshipMapConnection[]> {
  const direct = relationships.filter((relationship) =>
    relationshipTouchesSelectedPair(relationship, selectedRelationship),
  );

  const connections = await Promise.all(direct.map(async (relationship) => {
    const characterA = relationship.characterA.logicalId === selectedA.identity.logicalId
      ? selectedA
      : relationship.characterA.logicalId === selectedB.identity.logicalId
        ? selectedB
        : await resolveCharacter(relationship.characterA.slug);
    const characterB = relationship.characterB.logicalId === selectedA.identity.logicalId
      ? selectedA
      : relationship.characterB.logicalId === selectedB.identity.logicalId
        ? selectedB
        : await resolveCharacter(relationship.characterB.slug);
    if (!characterA || !characterB) return null;

    return {
      relationship,
      characterA,
      characterB,
      safeState: latestSafeRelationshipState(sortedRelationshipStates(relationship)),
      selected: relationship.relationshipId === selectedRelationship.relationshipId,
    } satisfies RelationshipMapConnection;
  }));

  return connections
    .flatMap((connection) => connection ? [connection] : [])
    .sort((left, right) => Number(right.selected) - Number(left.selected));
}

export async function loadRelationshipExperience(
  routeFamily: PublicRouteFamily,
  titleSlug: string,
  requestedCharacterASlug: string,
  requestedCharacterBSlug: string,
): Promise<RelationshipExperienceViewModel | null> {
  const repositories = getRepositories();
  const titleResult = await repositories.titles.getBySlug({
    locale: "en-US",
    routeFamily,
    slug: titleSlug,
  });
  if (titleResult.status !== "available") return null;

  const title = titleResult.value;
  const titleRelationships = await repositories.story.getRelationships({
    titleLogicalId: title.identity.logicalId,
  });
  const relationship = titleRelationships.find((candidate) =>
    relationshipMatchesSlugs(candidate, requestedCharacterASlug, requestedCharacterBSlug),
  );
  if (!relationship) return null;

  const states = sortedRelationshipStates(relationship);
  const canonicalCharacterASlug = relationship.characterA.slug;
  const canonicalCharacterBSlug = relationship.characterB.slug;
  const isReverseRequest =
    requestedCharacterASlug === canonicalCharacterBSlug &&
    requestedCharacterBSlug === canonicalCharacterASlug;

  const [characterA, characterB, timeline, allExplanationDetails] = await Promise.all([
    resolveCharacter(canonicalCharacterASlug),
    resolveCharacter(canonicalCharacterBSlug),
    repositories.story.getTimeline({
      titleLogicalId: title.identity.logicalId,
      orderBy: "chronology",
    }),
    resolveTitleExplanations(title.identity.logicalId),
  ]);
  if (!characterA || !characterB) return null;

  const related = relatedExplanations(allExplanationDetails, characterA, characterB);
  const relationshipExplanation = related.find(
    (detail) =>
      detail.explanationType === "relationship_explained" &&
      includesCharacter(detail, characterA.identity.logicalId) &&
      includesCharacter(detail, characterB.identity.logicalId),
  );
  const events = relevantRelationshipEvents(timeline, relationship, states);
  const [relevantEvents, mapConnections] = await Promise.all([
    resolveEventPreviews(events, allExplanationDetails),
    resolveMapConnections(titleRelationships, relationship, characterA, characterB),
  ]);
  const latestState = latestRelationshipState(states);
  const safeState = latestSafeRelationshipState(states);

  return {
    locale: "en-US",
    routeFamily,
    title,
    relationship,
    characterA,
    characterB,
    states,
    latestState,
    safeState,
    currentStateProtected: latestState ? isProtectedRelationshipState(latestState) : false,
    canonContexts: uniqueCanonContexts(states),
    strongestSpoiler: strongestRelationshipSpoiler(states),
    relationshipExplanation,
    relatedExplanations: related,
    relevantEvents,
    mapConnections,
    canonicalPath: relationshipRoute(
      routeFamily,
      title.identity.localization.currentVariant.slug,
      canonicalCharacterASlug,
      canonicalCharacterBSlug,
      "en-US",
    ),
    isReverseRequest,
    indexable:
      relationship.verificationState !== "unverified" &&
      states.length > 0 &&
      Boolean(relationship.summary?.trim()),
  };
}
