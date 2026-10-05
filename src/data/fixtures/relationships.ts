import type { CharacterRelationship } from "@/types/domain/relationship";
import { FIXTURE_IDS } from "@/data/fixtures/ids";
import {
  CHARACTER_REFERENCES,
  TITLE_REFERENCES,
} from "@/data/fixtures/references";

export const MOCK_RELATIONSHIPS: readonly CharacterRelationship[] = Object.freeze([
  {
    relationshipId: FIXTURE_IDS.relationship.maraElias,
    characterA: CHARACTER_REFERENCES.maraValeEn,
    characterB: CHARACTER_REFERENCES.eliasValeEn,
    contextTitle: TITLE_REFERENCES.lastSignalEn,
    summary:
      "Mara is Elias's mother; their relationship is strained by the station incident.",
    verificationState: "fact_checked",
    states: [
      {
        relationshipStateId:
          FIXTURE_IDS.relationship.maraEliasParentChild,
        sequence: 1,
        relationshipType: "parent_child",
        roleA: "Parent",
        roleB: "Child",
        description:
          "Mara acts as Elias's parent and primary protector during the station incident.",
        startInstallmentId: FIXTURE_IDS.installments.lastSignalPartOne,
        canon: {
          classification: "movie_canon",
          scopes: [
            {
              target: {
                kind: "title",
                titleId: FIXTURE_IDS.titles.lastSignal,
              },
              label: "The Last Signal — film continuity",
            },
          ],
        },
        spoiler: {
          level: "minor",
          scope: {
            type: "full_title",
            titleId: FIXTURE_IDS.titles.lastSignal,
          },
        },
        evidenceSourceIds: [FIXTURE_IDS.sources.lastSignalFilm],
        verificationState: "fact_checked",
      },
      {
        relationshipStateId: FIXTURE_IDS.relationship.maraEliasAllies,
        sequence: 2,
        relationshipType: "ally",
        roleA: "Partner",
        roleB: "Partner",
        description:
          "After the station loop is understood, Mara and Elias coordinate the final transmission together.",
        canon: {
          classification: "movie_canon",
          scopes: [
            {
              target: { kind: "title", titleId: FIXTURE_IDS.titles.lastSignal },
              label: "The Last Signal — film continuity",
            },
          ],
        },
        spoiler: {
          level: "major",
          scope: { type: "full_title", titleId: FIXTURE_IDS.titles.lastSignal },
        },
        evidenceSourceIds: [FIXTURE_IDS.sources.lastSignalFilm],
        verificationState: "approved",
      },
    ],
  },
]);
