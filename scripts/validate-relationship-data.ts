import { relationshipRoute } from "@/config/routes";
import { createRepositories } from "@/data";
import { FIXTURE_IDS } from "@/data/fixtures/ids";
import { loadRelationshipExperience } from "@/features/relationship-experience/relationship.loader";

function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
  console.log(`PASS — ${message}`);
}

async function run() {
  createRepositories({ dataSource: "mock", runtimeEnvironment: "development" });

  const model = await loadRelationshipExperience("movies", "the-last-signal", "mara-vale", "elias-vale");
  invariant(model !== null, "Canonical Mara Vale / Elias Vale Relationship resolves");
  invariant(model.title.displayTitle === "The Last Signal", "Relationship remains scoped to The Last Signal");
  invariant(model.characterA.displayName === "Mara Vale" && model.characterB.displayName === "Elias Vale", "Canonical Character A/B order is Mara Vale then Elias Vale");
  invariant(model.safeState?.roleA === "Parent" && model.safeState?.roleB === "Child", "Directional Parent/Child roles remain correct");
  invariant(model.states.every((state, index, items) => index === 0 || items[index - 1]!.sequence <= state.sequence), "Relationship States are sequence-sorted");
  invariant(model.latestState?.spoiler.level === "major" && model.currentStateProtected, "Latest major state is marked protected");
  invariant(model.canonicalPath === "/movies/the-last-signal/relationships/mara-vale/elias-vale/", "Canonical Relationship route uses canonical A/B slugs");
  invariant(model.relevantEvents.every((preview) => {
    const ids = preview.event.characters?.map((character) => character.logicalId) ?? [];
    const stateLinked = model.states.some((state) => state.startEventId === preview.event.timelineEventId || state.endEventId === preview.event.timelineEventId);
    return (ids.includes(FIXTURE_IDS.characters.maraVale) && ids.includes(FIXTURE_IDS.characters.eliasVale)) || stateLinked;
  }), "Relationship events are limited to both-Character or explicitly state-linked Timeline events");
  invariant(model.mapConnections.some((connection) => connection.selected), "Relationship map includes the selected canonical pair");
  invariant(model.relatedExplanations.every((explanation, index, items) => items.findIndex((item) => item.identity.logicalId === explanation.identity.logicalId) === index), "Related Explanation logical IDs remain unique");

  const reverse = await loadRelationshipExperience("movies", "the-last-signal", "elias-vale", "mara-vale");
  invariant(reverse !== null && reverse.isReverseRequest, "Reverse valid pair is recognized as a reverse request");
  invariant(reverse?.canonicalPath === model.canonicalPath, "Reverse valid pair resolves the same canonical path");

  const invalid = await loadRelationshipExperience("movies", "the-last-signal", "mara-vale", "not-a-real-character");
  invariant(invalid === null, "Invalid Character pair resolves to null for not-found routing");

  invariant(
    relationshipRoute("movies", "the-last-signal", "mara-vale", "elias-vale") === model.canonicalPath,
    "Centralized relationshipRoute helper produces the canonical URL",
  );
}

void run();
