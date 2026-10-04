import { FIXTURE_IDS } from "@/data/fixtures/ids";
import { MOCK_CHARACTERS_EN } from "@/data/fixtures/characters";
import { MOCK_EXPLANATIONS_EN } from "@/data/fixtures/explanations";
import { MOCK_INSTALLMENTS } from "@/data/fixtures/installments";
import { MOCK_RELATIONSHIPS } from "@/data/fixtures/relationships";
import { MOCK_SOURCES, LAST_SIGNAL_SOURCE_WORK } from "@/data/fixtures/sources";
import { MOCK_TIMELINE_EVENTS } from "@/data/fixtures/timeline";
import { MOCK_TITLES_BN, MOCK_TITLES_EN } from "@/data/fixtures/titles";
import { mockRepositories } from "@/data/mock/create-mock-repositories";

export interface MockValidationResult {
  readonly passed: boolean;
  readonly checks: readonly string[];
  readonly failures: readonly string[];
}

function requireCheck(
  condition: boolean,
  label: string,
  checks: string[],
  failures: string[],
): void {
  if (condition) checks.push(label);
  else failures.push(label);
}

function validateReferentialIntegrity(): string[] {
  const failures: string[] = [];
  const titleIds = new Set(MOCK_TITLES_EN.map((item) => item.identity.logicalId));
  const characterIds = new Set(
    MOCK_CHARACTERS_EN.map((item) => item.identity.logicalId),
  );
  const explanationIds = new Set(
    MOCK_EXPLANATIONS_EN.map((item) => item.identity.logicalId),
  );
  const installmentIds = new Set(MOCK_INSTALLMENTS.map((item) => item.installmentId));
  const relationshipIds = new Set(
    MOCK_RELATIONSHIPS.map((item) => item.relationshipId),
  );
  const timelineIds = new Set(
    MOCK_TIMELINE_EVENTS.map((item) => item.timelineEventId),
  );
  const sourceIds = new Set(MOCK_SOURCES.map((item) => item.sourceId));
  const sourceWorkIds = new Set([LAST_SIGNAL_SOURCE_WORK.sourceWorkId]);

  for (const title of MOCK_TITLES_EN) {
    for (const character of title.importantCharacters ?? []) {
      if (!characterIds.has(character.logicalId)) {
        failures.push(`Title references missing Character: ${character.logicalId}`);
      }
    }
    for (const explanation of title.relatedExplanations ?? []) {
      if (!explanationIds.has(explanation.logicalId)) {
        failures.push(`Title references missing Explanation: ${explanation.logicalId}`);
      }
    }
    for (const installment of title.installments ?? []) {
      if (!installmentIds.has(installment.installmentId)) {
        failures.push(`Title references missing Installment: ${installment.installmentId}`);
      }
    }
    for (const sourceWork of title.sourceWorks ?? []) {
      if (!sourceWorkIds.has(sourceWork.sourceWork.sourceWorkId)) {
        failures.push(`Title references missing Source Work: ${sourceWork.sourceWork.sourceWorkId}`);
      }
    }
    for (const relatedTitle of title.relatedTitles ?? []) {
      if (!titleIds.has(relatedTitle.title.logicalId)) {
        failures.push(`Title references missing related Title: ${relatedTitle.title.logicalId}`);
      }
    }
  }

  for (const character of MOCK_CHARACTERS_EN) {
    for (const title of character.titleContexts) {
      if (!titleIds.has(title.logicalId)) {
        failures.push(`Character references missing Title: ${title.logicalId}`);
      }
    }
    for (const relationship of character.relationships ?? []) {
      if (!relationshipIds.has(relationship.relationshipId)) {
        failures.push(`Character references missing Relationship: ${relationship.relationshipId}`);
      }
    }
    for (const explanation of character.relatedExplanations ?? []) {
      if (!explanationIds.has(explanation.logicalId)) {
        failures.push(`Character references missing Explanation: ${explanation.logicalId}`);
      }
    }
    for (const event of character.importantTimelineEvents ?? []) {
      if (!timelineIds.has(event.timelineEventId)) {
        failures.push(`Character references missing Timeline Event: ${event.timelineEventId}`);
      }
    }
  }

  for (const relationship of MOCK_RELATIONSHIPS) {
    if (!characterIds.has(relationship.characterA.logicalId)) {
      failures.push(`Relationship A missing: ${relationship.characterA.logicalId}`);
    }
    if (!characterIds.has(relationship.characterB.logicalId)) {
      failures.push(`Relationship B missing: ${relationship.characterB.logicalId}`);
    }
    if (!titleIds.has(relationship.contextTitle.logicalId)) {
      failures.push(`Relationship Title missing: ${relationship.contextTitle.logicalId}`);
    }
    for (const state of relationship.states) {
      for (const sourceId of state.evidenceSourceIds ?? []) {
        if (!sourceIds.has(sourceId)) failures.push(`Relationship Source missing: ${sourceId}`);
      }
      for (const id of [state.startInstallmentId, state.endInstallmentId]) {
        if (id && !installmentIds.has(id)) failures.push(`Relationship Installment missing: ${id}`);
      }
      for (const id of [state.startEventId, state.endEventId]) {
        if (id && !timelineIds.has(id)) failures.push(`Relationship Timeline Event missing: ${id}`);
      }
    }
  }

  for (const event of MOCK_TIMELINE_EVENTS) {
    if (!titleIds.has(event.title.logicalId)) {
      failures.push(`Timeline references missing Title: ${event.title.logicalId}`);
    }
    if (event.installmentId && !installmentIds.has(event.installmentId)) {
      failures.push(`Timeline references missing Installment: ${event.installmentId}`);
    }
    if (event.sourceWorkId && !sourceWorkIds.has(event.sourceWorkId)) {
      failures.push(`Timeline references missing Source Work: ${event.sourceWorkId}`);
    }
    for (const character of event.characters ?? []) {
      if (!characterIds.has(character.logicalId)) {
        failures.push(`Timeline references missing Character: ${character.logicalId}`);
      }
    }
    for (const sourceId of event.evidenceSourceIds ?? []) {
      if (!sourceIds.has(sourceId)) failures.push(`Timeline Source missing: ${sourceId}`);
    }
  }

  for (const explanation of MOCK_EXPLANATIONS_EN) {
    if (!titleIds.has(explanation.primaryTitle.logicalId)) {
      failures.push(`Explanation references missing Primary Title: ${explanation.primaryTitle.logicalId}`);
    }
    for (const character of explanation.relatedCharacters ?? []) {
      if (!characterIds.has(character.logicalId)) {
        failures.push(`Explanation references missing Character: ${character.logicalId}`);
      }
    }
    for (const related of explanation.relatedExplanations ?? []) {
      if (!explanationIds.has(related.logicalId)) {
        failures.push(`Explanation references missing Explanation: ${related.logicalId}`);
      }
    }
    for (const sourceWork of explanation.sourceWorks ?? []) {
      if (!sourceWorkIds.has(sourceWork.sourceWorkId)) {
        failures.push(`Explanation references missing Source Work: ${sourceWork.sourceWorkId}`);
      }
    }
    for (const citation of explanation.citations ?? []) {
      if (!sourceIds.has(citation.source.sourceId)) {
        failures.push(`Citation references missing Source: ${citation.source.sourceId}`);
      }
    }
  }

  for (const installment of MOCK_INSTALLMENTS) {
    if (!titleIds.has(installment.titleId)) {
      failures.push(`Installment references missing Title: ${installment.titleId}`);
    }
    if (
      installment.parentInstallmentId &&
      !installmentIds.has(installment.parentInstallmentId)
    ) {
      failures.push(
        `Installment references missing parent: ${installment.parentInstallmentId}`,
      );
    }
  }

  return failures;
}

export async function runMockDataValidation(): Promise<MockValidationResult> {
  const checks: string[] = [];
  const failures: string[] = [];

  const enTitle = await mockRepositories.titles.getBySlug({
    locale: "en-US",
    routeFamily: "movies",
    slug: "the-last-signal",
  });
  requireCheck(
    enTitle.status === "available" &&
      enTitle.value.identity.localization.requestedLocale === "en-US" &&
      enTitle.value.displayTitle === "The Last Signal",
    "1. EN Title lookup returns EN content",
    checks,
    failures,
  );

  const bnTitle = await mockRepositories.titles.getBySlug({
    locale: "bn-BD",
    routeFamily: "movies",
    slug: "shesh-songket",
  });
  requireCheck(
    bnTitle.status === "available" &&
      bnTitle.value.identity.localization.requestedLocale === "bn-BD" &&
      bnTitle.value.displayTitle === "শেষ সংকেত",
    "2. Published BN lookup returns BN content",
    checks,
    failures,
  );

  const unavailableBn = await mockRepositories.titles.getBySlug({
    locale: "bn-BD",
    routeFamily: "tv",
    slug: "harbor-nine",
  });
  requireCheck(
    unavailableBn.status === "unavailable" && unavailableBn.value === null,
    "3. Missing BN returns explicit unavailable result",
    checks,
    failures,
  );
  requireCheck(
    unavailableBn.status === "unavailable" &&
      unavailableBn.requestedLocale === "bn-BD" &&
      !("displayTitle" in (unavailableBn.value ?? {})),
    "4. Missing BN does not fall back to EN editorial content",
    checks,
    failures,
  );

  const anime = await mockRepositories.titles.getBySlug({
    locale: "en-US",
    routeFamily: "anime",
    slug: "the-glass-comet",
  });
  requireCheck(
    anime.status === "available" &&
      anime.value.publicRouteFamily === "anime" &&
      anime.value.titleType === "tv_series",
    "5. Anime route family stays independent from fundamental Title Type",
    checks,
    failures,
  );

  const adaptation = MOCK_EXPLANATIONS_EN.find(
    (item) => item.identity.logicalId === FIXTURE_IDS.explanations.lastSignalBookVsScreen,
  );
  requireCheck(
    adaptation?.canon.classification === "adaptation_difference" &&
      adaptation.canon.scopes.length >= 2,
    "6. Adaptation Difference preserves at least two Canon scopes",
    checks,
    failures,
  );

  const relationship = MOCK_RELATIONSHIPS[0];
  requireCheck(
    relationship.states[0]?.relationshipType === "parent_child" &&
      relationship.states[0].roleA === "Parent" &&
      relationship.states[0].roleB === "Child",
    "7. Parent/Child directional roles survive retrieval",
    checks,
    failures,
  );
  const reverseDuplicate = MOCK_RELATIONSHIPS.some(
    (candidate) =>
      candidate.relationshipId !== relationship.relationshipId &&
      candidate.characterA.logicalId === relationship.characterB.logicalId &&
      candidate.characterB.logicalId === relationship.characterA.logicalId,
  );
  requireCheck(
    !reverseDuplicate,
    "8. Canonical relationship has no duplicated reverse edge",
    checks,
    failures,
  );

  const nonlinear = MOCK_TIMELINE_EVENTS.find(
    (event) => event.timelineEventId === FIXTURE_IDS.timeline.hiddenPlatformFlashback,
  );
  requireCheck(
    !!nonlinear && nonlinear.chronologyOrder !== nonlinear.presentationOrder,
    "9. Chronology and presentation ordering remain independent",
    checks,
    failures,
  );

  requireCheck(
    !!adaptation?.spoiler.sourceMaterial &&
      adaptation.spoiler.sourceMaterial.level === "major" &&
      adaptation.spoiler.screen.level === "minor",
    "10. Source-material spoiler remains separate from screen spoiler",
    checks,
    failures,
  );

  const search = await mockRepositories.search.search({
    locale: "en-US",
    query: "signal",
    pageSize: 20,
  });
  const resultKinds = new Set(search.items.map((item) => item.kind));
  requireCheck(
    resultKinds.has("title") && resultKinds.has("explanation"),
    "11. Search results are discriminated by entity kind",
    checks,
    failures,
  );

  const referenceFailures = validateReferentialIntegrity();
  requireCheck(
    referenceFailures.length === 0,
    "12. Fixture references resolve to declared fixture records",
    checks,
    failures,
  );
  failures.push(...referenceFailures);

  requireCheck(
    MOCK_TITLES_BN.length === 1 &&
      MOCK_TITLES_BN[0].identity.logicalId === FIXTURE_IDS.titles.lastSignal,
    "13. BN fixture inventory contains only explicitly published BN data",
    checks,
    failures,
  );

  const logicalIdStrings = [
    ...MOCK_TITLES_EN.map((item) => `title:${item.identity.logicalId}`),
    ...MOCK_CHARACTERS_EN.map((item) => `character:${item.identity.logicalId}`),
    ...MOCK_EXPLANATIONS_EN.map((item) => `explanation:${item.identity.logicalId}`),
  ];
  requireCheck(
    new Set(logicalIdStrings).size === logicalIdStrings.length,
    "14. Fixture logical IDs are unique within their entity namespaces",
    checks,
    failures,
  );

  return {
    passed: failures.length === 0,
    checks,
    failures,
  };
}
