import { getRepositories } from "@/data";
import type { CanonContext } from "@/types/domain/canon";
import type { CharacterDetail } from "@/types/domain/character";
import type { ExplanationDetail } from "@/types/domain/explanation";
import type { CharacterReference } from "@/types/domain/references";
import type { CharacterRelationship, RelationshipState } from "@/types/domain/relationship";
import type {
  CharacterDetailViewModel,
  CharacterRelationshipPreview,
} from "@/features/character-detail/character-detail.types";

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

function uniqueCanonContexts(contexts: readonly CanonContext[]): readonly CanonContext[] {
  const seen = new Set<string>();
  const result: CanonContext[] = [];
  for (const context of contexts) {
    const key = canonKey(context);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(context);
  }
  return result;
}

function counterpartReference(
  relationship: CharacterRelationship,
  characterId: CharacterDetail<"en-US">["identity"]["logicalId"],
): CharacterReference | null {
  if (relationship.characterA.logicalId === characterId) return relationship.characterB;
  if (relationship.characterB.logicalId === characterId) return relationship.characterA;
  return null;
}

function stateRoles(
  relationship: CharacterRelationship,
  state: RelationshipState | undefined,
  characterId: CharacterDetail<"en-US">["identity"]["logicalId"],
) {
  if (!state) return {};
  if (relationship.characterA.logicalId === characterId) {
    return { currentRole: state.roleA, counterpartRole: state.roleB };
  }
  return { currentRole: state.roleB, counterpartRole: state.roleA };
}

function selectSafeState(states: readonly RelationshipState[]): RelationshipState | undefined {
  return [...states]
    .filter((state) => state.spoiler.level === "spoiler_free" || state.spoiler.level === "minor")
    .sort((left, right) => right.sequence - left.sequence)[0];
}

async function resolveRelatedExplanations(
  character: CharacterDetail<"en-US">,
): Promise<readonly ExplanationDetail<"en-US">[]> {
  const repositories = getRepositories();
  const results = await Promise.all(
    (character.relatedExplanations ?? []).map((reference) =>
      repositories.explanations.getBySlug({
        locale: "en-US",
        slug: reference.slug,
      }),
    ),
  );
  return results.flatMap((result) => result.status === "available" ? [result.value] : []);
}

async function resolveRelationships(
  character: CharacterDetail<"en-US">,
  relationships: readonly CharacterRelationship[],
): Promise<readonly CharacterRelationshipPreview[]> {
  const repositories = getRepositories();
  const previews = await Promise.all(
    relationships.map(async (relationship) => {
      const counterpart = counterpartReference(relationship, character.identity.logicalId);
      if (!counterpart) return null;
      const counterpartResult = await repositories.characters.getBySlug({
        locale: "en-US",
        slug: counterpart.slug,
      });
      if (counterpartResult.status !== "available") return null;

      const safeState = selectSafeState(relationship.states);
      const roles = stateRoles(
        relationship,
        safeState ?? relationship.states[0],
        character.identity.logicalId,
      );
      const protectedStates = relationship.states.filter(
        (state) => state.spoiler.level === "major" || state.spoiler.level === "full",
      );

      return {
        relationship,
        counterpart: counterpartResult.value,
        safeState,
        protectedStates,
        ...roles,
      } satisfies CharacterRelationshipPreview;
    }),
  );

  return previews.flatMap((preview) => preview ? [preview] : []);
}

export async function loadCharacterDetail(
  slug: string,
): Promise<CharacterDetailViewModel | null> {
  const repositories = getRepositories();
  const characterResult = await repositories.characters.getBySlug({
    locale: "en-US",
    slug,
  });
  if (characterResult.status !== "available") return null;

  const character = characterResult.value;
  const titleReference = character.primaryTitleContext;
  const primaryTitleResult = await repositories.titles.getBySlug({
    locale: "en-US",
    routeFamily: titleReference.publicRouteFamily,
    slug: titleReference.slug,
  });
  if (primaryTitleResult.status !== "available") return null;

  const primaryTitle = primaryTitleResult.value;
  const [relationshipsRaw, timeline, relatedExplanations] = await Promise.all([
    repositories.story.getRelationships({
      characterLogicalId: character.identity.logicalId,
    }),
    repositories.story.getTimeline({
      titleLogicalId: primaryTitle.identity.logicalId,
      characterLogicalId: character.identity.logicalId,
      orderBy: "chronology",
    }),
    resolveRelatedExplanations(character),
  ]);

  const relationships = await resolveRelationships(character, relationshipsRaw);
  const characterExplanation = relatedExplanations.find(
    (explanation) => explanation.explanationType === "character_explained",
  );
  const mysteriesAndReveals = relatedExplanations.filter(
    (explanation) =>
      explanation.explanationType === "mystery_explained" ||
      explanation.explanationType === "question_answer",
  );
  const adaptationExplanations = relatedExplanations.filter(
    (explanation) => explanation.explanationType === "book_vs_screen",
  );
  const viewerQuestions = relatedExplanations.flatMap((explanation) =>
    explanation.intendedSubjectQuestion
      ? [{ question: explanation.intendedSubjectQuestion, explanation }]
      : [],
  );
  const canonContexts = uniqueCanonContexts([
    ...(character.statuses ?? []).map((status) => status.canon),
    ...relatedExplanations.map((explanation) => explanation.canon),
  ]);

  return {
    locale: "en-US",
    character,
    primaryTitle,
    characterExplanation,
    relatedExplanations,
    mysteriesAndReveals,
    adaptationExplanations,
    relationships,
    timeline,
    viewerQuestions,
    canonContexts,
  };
}
