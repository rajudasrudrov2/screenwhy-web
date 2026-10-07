import { createRepositories } from "@/data";
import { loadCharacterDetail } from "@/features/character-detail/character-detail.loader";
import { FIXTURE_IDS } from "@/data/fixtures/ids";

function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
  console.log(`PASS — ${message}`);
}

async function run() {
  const repositories = createRepositories({ dataSource: "mock", runtimeEnvironment: "development" });
  const model = await loadCharacterDetail("mara-vale");
  invariant(model !== null, "Mara Vale Character Detail view model resolves");
  invariant(model.character.displayName === "Mara Vale", "Primary Character remains Mara Vale");
  invariant(model.primaryTitle.displayTitle === "The Last Signal", "Primary Title resolves through repository data");
  invariant(model.characterExplanation?.explanationType === "character_explained", "Character Explained CTA source resolves");
  invariant(model.relationships.length >= 1, "Character relationships resolve through StoryRepository");
  invariant(model.relationships[0]?.counterpart.displayName === "Elias Vale", "Relationship counterpart resolves as Elias Vale");
  invariant(model.relationships[0]?.currentRole === "Parent" && model.relationships[0]?.counterpartRole === "Child", "Parent/Child directional roles remain correct from Mara's perspective");
  invariant(model.relationships[0]?.protectedStates.some((state) => state.spoiler.level === "major"), "Major relationship evolution remains identifiable for disclosure");
  invariant(model.timeline.length >= 4, "Character Timeline has representative events");
  invariant(model.timeline.every((event, index, items) => index === 0 || items[index - 1]!.chronologyOrder <= event.chronologyOrder), "Character Timeline remains chronologically ordered");
  invariant(model.timeline.every((event) => event.characters?.some((character) => character.logicalId === model.character.identity.logicalId)), "Timeline is filtered by Character logical ID");
  invariant(model.timeline.some((event) => event.spoiler.level === "major"), "Character Timeline includes protected major-spoiler events");
  invariant(model.mysteriesAndReveals.length >= 2, "Mysteries & Reveals has Character-relevant Explanation data");
  invariant(model.adaptationExplanations.some((item) => item.canon.classification === "adaptation_difference"), "Book vs Screen adaptation context remains available");
  invariant(model.relatedExplanations.every((explanation, index, items) => items.findIndex((item) => item.identity.logicalId === explanation.identity.logicalId) === index), "Related Explanation logical IDs are unique");
  invariant(model.viewerQuestions.length >= 3, "Viewer Questions derive from related Explanation details");
  invariant(model.viewerQuestions.every((item) => model.relatedExplanations.some((explanation) => explanation.identity.logicalId === item.explanation.identity.logicalId)), "Every Viewer Question maps to an actual related Explanation");

  const statuses = model.character.statuses ?? [];
  invariant(statuses.some((status) => status.canon.classification === "movie_canon" && status.status === "alive"), "Mara Movie Canon status remains distinct");
  invariant(statuses.some((status) => status.canon.classification === "novel_canon" && status.status === "deceased"), "Mara Novel Canon status remains distinct");
  invariant(statuses.every((status) => status.spoiler.level === "major" || status.spoiler.level === "full"), "Mara contextual status outcomes remain spoiler-sensitive");

  const relationships = await repositories.story.getRelationships({ characterLogicalId: FIXTURE_IDS.characters.maraVale });
  const reverseDuplicate = relationships.some((left, index) => relationships.some((right, otherIndex) =>
    index !== otherIndex && left.characterA.logicalId === right.characterB.logicalId && left.characterB.logicalId === right.characterA.logicalId,
  ));
  invariant(!reverseDuplicate, "No reverse-duplicate Character relationship edge exists");

  const invalid = await loadCharacterDetail("not-a-real-character");
  invariant(invalid === null, "Invalid Character slug resolves to null for not-found routing");
}

void run();
