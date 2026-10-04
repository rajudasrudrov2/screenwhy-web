import type { InstallmentDetail } from "@/types/domain/installment";
import { FIXTURE_IDS } from "@/data/fixtures/ids";
import { serializedDate } from "@/data/fixtures/factories/fixture-values";

export const MOCK_INSTALLMENTS: readonly InstallmentDetail[] = Object.freeze([
  {
    installmentId: FIXTURE_IDS.installments.lastSignalPartOne,
    titleId: FIXTURE_IDS.titles.lastSignal,
    kind: "part",
    partNumber: 1,
    officialTitle: "Part One: Static",
    releaseDate: serializedDate("2026-03-14"),
    productionOrder: 1,
    verificationState: "approved",
  },
  {
    installmentId: FIXTURE_IDS.installments.lastSignalPartTwo,
    titleId: FIXTURE_IDS.titles.lastSignal,
    kind: "part",
    partNumber: 2,
    officialTitle: "Part Two: Return",
    releaseDate: serializedDate("2026-03-14"),
    productionOrder: 2,
    verificationState: "approved",
  },
  {
    installmentId: FIXTURE_IDS.installments.harborNineSeasonOne,
    titleId: FIXTURE_IDS.titles.harborNine,
    kind: "season",
    seasonNumber: 1,
    officialTitle: "Season One",
    productionOrder: 1,
    verificationState: "fact_checked",
  },
  {
    installmentId: FIXTURE_IDS.installments.harborNineEpisodeEight,
    titleId: FIXTURE_IDS.titles.harborNine,
    parentInstallmentId: FIXTURE_IDS.installments.harborNineSeasonOne,
    kind: "episode",
    seasonNumber: 1,
    episodeNumber: 8,
    officialTitle: "The Blackout",
    releaseDate: serializedDate("2026-08-21"),
    productionOrder: 8,
    verificationState: "fact_checked",
  },
]);
