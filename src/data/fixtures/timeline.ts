import type { TimelineEvent } from "@/types/domain/timeline";
import { FIXTURE_IDS } from "@/data/fixtures/ids";
import {
  CHARACTER_REFERENCES,
  TITLE_REFERENCES,
} from "@/data/fixtures/references";

export const MOCK_TIMELINE_EVENTS: readonly TimelineEvent[] = Object.freeze([
  {
    timelineEventId: FIXTURE_IDS.timeline.hiddenPlatformFlashback,
    title: TITLE_REFERENCES.lastSignalEn,
    localizedText: {
      locale: "en-US",
      label: "Mara hides the transmitter beneath the platform",
      description:
        "The event happens early in the story chronology but is revealed much later as a flashback.",
    },
    chronologyOrder: 2,
    presentationOrder: 7,
    temporalType: "flashback",
    relativeChronologyLabel: "Before the station closes",
    installmentId: FIXTURE_IDS.installments.lastSignalPartOne,
    characters: [CHARACTER_REFERENCES.maraValeEn],
    locationLabel: "North platform service tunnel",
    canon: {
      classification: "movie_canon",
      scopes: [
        {
          target: {
            kind: "title",
            titleId: FIXTURE_IDS.titles.lastSignal,
          },
        },
      ],
    },
    spoiler: {
      level: "major",
      scope: {
        type: "installment",
        installmentId: FIXTURE_IDS.installments.lastSignalPartOne,
      },
    },
    evidenceSourceIds: [FIXTURE_IDS.sources.lastSignalFilm],
    verificationState: "approved",
  },
  {
    timelineEventId: FIXTURE_IDS.timeline.harborBlackout,
    title: TITLE_REFERENCES.harborNineEn,
    localizedText: {
      locale: "en-US",
      label: "Harbor Nine loses all navigation lights",
      description:
        "The blackout is shown in presentation order immediately before the final control-room reveal.",
    },
    chronologyOrder: 8,
    presentationOrder: 8,
    temporalType: "normal",
    installmentId: FIXTURE_IDS.installments.harborNineEpisodeEight,
    canon: {
      classification: "tv_canon",
      scopes: [
        {
          target: {
            kind: "title",
            titleId: FIXTURE_IDS.titles.harborNine,
          },
        },
      ],
    },
    spoiler: {
      level: "major",
      scope: {
        type: "installment",
        installmentId: FIXTURE_IDS.installments.harborNineEpisodeEight,
      },
    },
    evidenceSourceIds: [FIXTURE_IDS.sources.harborNineEpisodeEight],
    verificationState: "fact_checked",
  },
]);
