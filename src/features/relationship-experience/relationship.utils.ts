import type { CharacterRelationship, RelationshipState, RelationshipType } from "@/types/domain/relationship";
import type { SpoilerMetadata, SpoilerLevel } from "@/types/domain/spoiler";

export const RELATIONSHIP_LABELS: Readonly<Record<RelationshipType, string>> = {
  romantic: "Romantic",
  sibling: "Siblings",
  parent_child: "Parent / Child",
  family: "Family",
  friend: "Friends",
  enemy: "Enemies",
  ally: "Allies",
  mentor: "Mentor",
  colleague: "Colleagues",
  former_relationship: "Former relationship",
  unknown_complex: "Complex relationship",
};

const SPOILER_ORDER: Readonly<Record<SpoilerLevel, number>> = {
  spoiler_free: 0,
  minor: 1,
  major: 2,
  full: 3,
};

export function relationshipTypeLabel(type: RelationshipType): string {
  return RELATIONSHIP_LABELS[type];
}

export function isProtectedRelationshipState(state: RelationshipState): boolean {
  return state.spoiler.level === "major" || state.spoiler.level === "full";
}

export function sortedRelationshipStates(
  relationship: CharacterRelationship,
): readonly RelationshipState[] {
  return [...relationship.states].sort((left, right) => left.sequence - right.sequence);
}

export function latestRelationshipState(
  states: readonly RelationshipState[],
): RelationshipState | undefined {
  return [...states].sort((left, right) => right.sequence - left.sequence)[0];
}

export function latestSafeRelationshipState(
  states: readonly RelationshipState[],
): RelationshipState | undefined {
  return [...states]
    .filter((state) => !isProtectedRelationshipState(state))
    .sort((left, right) => right.sequence - left.sequence)[0];
}

export function strongestRelationshipSpoiler(
  states: readonly RelationshipState[],
): SpoilerMetadata | undefined {
  return [...states]
    .sort((left, right) => SPOILER_ORDER[right.spoiler.level] - SPOILER_ORDER[left.spoiler.level])[0]
    ?.spoiler;
}

export function relationshipMatchesSlugs(
  relationship: CharacterRelationship,
  firstSlug: string,
  secondSlug: string,
): boolean {
  const canonicalA = relationship.characterA.slug;
  const canonicalB = relationship.characterB.slug;
  return (
    (canonicalA === firstSlug && canonicalB === secondSlug) ||
    (canonicalA === secondSlug && canonicalB === firstSlug)
  );
}
