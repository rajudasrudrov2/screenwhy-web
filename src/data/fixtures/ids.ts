import {
  characterLogicalId,
  explanationLogicalId,
  installmentId,
  relationshipId,
  relationshipStateId,
  sourceId,
  sourceWorkId,
  timelineEventId,
  titleLogicalId,
  wordpressUserId,
} from "@/data/fixtures/factories/fixture-values";

export const FIXTURE_IDS = Object.freeze({
  titles: {
    lastSignal: titleLogicalId("title:last-signal"),
    harborNine: titleLogicalId("title:harbor-nine"),
    glassComet: titleLogicalId("title:glass-comet"),
    winterVerdict: titleLogicalId("title:winter-verdict"),
  },
  characters: {
    maraVale: characterLogicalId("character:mara-vale"),
    eliasVale: characterLogicalId("character:elias-vale"),
  },
  explanations: {
    lastSignalMystery: explanationLogicalId("explanation:last-signal-mystery"),
    lastSignalBookVsScreen: explanationLogicalId(
      "explanation:last-signal-book-vs-screen",
    ),
    harborNineEnding: explanationLogicalId("explanation:harbor-nine-ending"),
    lastSignalCharacter: explanationLogicalId("explanation:last-signal-character"),
    lastSignalEnding: explanationLogicalId("explanation:last-signal-ending"),
    lastSignalNext: explanationLogicalId("explanation:last-signal-next"),
    lastSignalQuestion: explanationLogicalId("explanation:last-signal-question"),
    harborNineNext: explanationLogicalId("explanation:harbor-nine-next"),
  },
  installments: {
    lastSignalPartOne: installmentId("installment:last-signal:part-1"),
    lastSignalPartTwo: installmentId("installment:last-signal:part-2"),
    harborNineSeasonOne: installmentId("installment:harbor-nine:season-1"),
    harborNineEpisodeEight: installmentId(
      "installment:harbor-nine:season-1:episode-8",
    ),
  },
  relationship: {
    maraElias: relationshipId("relationship:mara-elias"),
    maraEliasParentChild: relationshipStateId(
      "relationship-state:mara-elias:parent-child",
    ),
    maraEliasAllies: relationshipStateId(
      "relationship-state:mara-elias:allies",
    ),
  },
  timeline: {
    stationReopens: timelineEventId("timeline:last-signal:station-reopens"),
    firstSignalReceived: timelineEventId("timeline:last-signal:first-signal-received"),
    hiddenPlatformFlashback: timelineEventId(
      "timeline:last-signal:hidden-platform-flashback",
    ),
    finalTransmission: timelineEventId("timeline:last-signal:final-transmission"),
    harborBlackout: timelineEventId("timeline:harbor-nine:blackout"),
  },
  sourceWorks: {
    lastSignalNovel: sourceWorkId("source-work:last-signal-novel"),
  },
  sources: {
    lastSignalFilm: sourceId("source:last-signal-film"),
    lastSignalNovel: sourceId("source:last-signal-novel"),
    harborNineEpisodeEight: sourceId("source:harbor-nine-episode-8"),
  },
  users: {
    editorAvery: wordpressUserId(101),
    reviewerNoor: wordpressUserId(102),
  },
});
