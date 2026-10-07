import type { PublicSource } from "@/types/domain/source";
import type { SourceWorkDetail } from "@/types/domain/source-work";
import {
  serializedDate,
} from "@/data/fixtures/factories/fixture-values";
import { FIXTURE_IDS } from "@/data/fixtures/ids";
import { TITLE_REFERENCES } from "@/data/fixtures/references";

export const MOCK_SOURCES: readonly PublicSource[] = Object.freeze([
  {
    sourceId: FIXTURE_IDS.sources.lastSignalFilm,
    sourceType: "primary_screen_work",
    sourceTitle: "The Last Signal — fictional sample film",
    creatorAuthor: "Northline Pictures",
    publicationDate: serializedDate("2026-03-14"),
    verificationState: "approved",
  },
  {
    sourceId: FIXTURE_IDS.sources.lastSignalNovel,
    sourceType: "source_material",
    sourceTitle: "The Last Signal — fictional sample novel",
    creatorAuthor: "Iris North",
    publisher: "Lantern House",
    publicationDate: serializedDate("2024-09-05"),
    verificationState: "source_checked",
  },
  {
    sourceId: FIXTURE_IDS.sources.harborNineEpisodeEight,
    sourceType: "episode",
    sourceTitle: "Harbor Nine — Episode 8: The Blackout",
    creatorAuthor: "Tideglass Television",
    publicationDate: serializedDate("2026-08-21"),
    verificationState: "fact_checked",
  },
]);

export const LAST_SIGNAL_SOURCE_WORK = {
  sourceWorkId: FIXTURE_IDS.sourceWorks.lastSignalNovel,
  officialTitle: "The Last Signal",
  workType: "novel",
  creatorAuthor: "Iris North",
  verificationState: "source_checked",
  originalLanguage: "English",
  publisher: "Lantern House",
  initialPublicationDate: serializedDate("2024-09-05"),
  initialPublicationYear: 2024,
  editionNotes: "Fictional sample source work used for content-model validation.",
  relatedScreenTitles: [TITLE_REFERENCES.lastSignalEn],
} as const satisfies SourceWorkDetail;
