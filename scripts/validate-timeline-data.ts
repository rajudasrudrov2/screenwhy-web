import { timelineRoute } from "@/config/routes";
import { createRepositories } from "@/data";
import { loadStoryTimeline } from "@/features/story-timeline/timeline.loader";
import {
  TIMELINE_TEMPORAL_LABELS,
  timelineEventAnchor,
} from "@/features/story-timeline/timeline.utils";

function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
  console.log(`PASS — ${message}`);
}

async function run() {
  createRepositories({ dataSource: "mock", runtimeEnvironment: "development" });

  const chronology = await loadStoryTimeline("movies", "the-last-signal", "chronology");
  invariant(chronology !== null, "The Last Signal chronology Timeline resolves");
  invariant(chronology.title.displayTitle === "The Last Signal", "Timeline remains scoped to The Last Signal");
  invariant(chronology.order === "chronology", "Default Timeline model uses chronology order");
  invariant(
    chronology.chronologicalEvents.every((event, index, items) => index === 0 || items[index - 1]!.chronologyOrder <= event.chronologyOrder),
    "Chronology events are explicitly ordered by chronologyOrder",
  );
  invariant(
    chronology.canonicalPath === "/movies/the-last-signal/timeline/",
    "Canonical Timeline route is title-scoped and clean",
  );
  invariant(
    chronology.presentationPath === "/movies/the-last-signal/timeline/?order=presentation",
    "Presentation-order view uses URL query state",
  );

  const presentation = await loadStoryTimeline("movies", "the-last-signal", "presentation");
  invariant(presentation !== null && presentation.order === "presentation", "Presentation Timeline model resolves");
  invariant(
    presentation.presentationEvents.every((event, index, items) => index === 0 || items[index - 1]!.presentationOrder <= event.presentationOrder),
    "Presentation events are explicitly ordered by presentationOrder",
  );
  invariant(
    chronology.chronologicalEvents.some((event) => event.chronologyOrder !== event.presentationOrder),
    "Timeline preserves distinct chronologyOrder and presentationOrder values",
  );
  invariant(
    new Set(chronology.events.map((item) => String(item.event.timelineEventId))).size === chronology.events.length,
    "Timeline event IDs remain unique",
  );
  invariant(
    chronology.events.every((item) => !item.anchorId.includes(item.event.localizedText?.label ?? "__never__")),
    "Timeline anchors do not derive from spoiler-heavy event labels",
  );
  invariant(
    chronology.events.some((item) => item.characters.some((character) => character.displayName === "Mara Vale")),
    "Timeline Characters resolve through CharacterRepository",
  );
  invariant(
    chronology.events.some((item) => item.relationshipLinks.length > 0),
    "Events containing the known pair can resolve a Relationship cross-link",
  );
  invariant(
    chronology.events.some((item) => item.relatedExplanation?.explanationType === "ending_explained"),
    "Event-linked Explanation discovery resolves through ExplanationRepository",
  );
  invariant(
    chronology.events.some((item) => item.event.spoiler.level === "major" || item.event.spoiler.level === "full"),
    "Timeline data contains protected major/full events for disclosure validation",
  );
  invariant(
    Object.keys(TIMELINE_TEMPORAL_LABELS).sort().join("|") === ["flash_forward", "flashback", "normal", "parallel", "time_loop", "uncertain"].sort().join("|"),
    "All locked Timeline temporal types have human-readable label mappings",
  );
  invariant(
    timelineEventAnchor(chronology.events[0]!.event).startsWith("event-"),
    "Timeline event anchor helper is deterministic and non-title-based",
  );

  const invalid = await loadStoryTimeline("movies", "not-a-real-title", "chronology");
  invariant(invalid === null, "Invalid Title resolves to null for not-found routing");
  invariant(
    timelineRoute("movies", "the-last-signal") === chronology.canonicalPath,
    "Central timelineRoute helper produces the canonical Timeline URL",
  );
}

void run();
