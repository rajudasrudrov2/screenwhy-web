import { getRepositories, type PaginatedResult, type PublicReadRepositories } from "@/data";
import type { SearchResult } from "@/data";
import type { ExplanationDetail } from "@/types/domain/explanation";
import type {
  AnsweredQuestionResult,
  SearchBestMatch,
  SearchFilter,
  SearchGroup,
  SearchSuggestionGroup,
  SearchSuggestionItem,
  SearchSuggestions,
  SearchViewModel,
} from "@/features/search/search.types";
import {
  buildSearchHref,
  levenshteinDistance,
  normalizeSearchQuery,
  relevanceScore,
  SEARCH_GROUP_PREVIEW_SIZE,
  SEARCH_PAGE_SIZE,
} from "@/features/search/search.utils";
import { characterRoute, explanationRoute, titleRoute } from "@/config/routes";

const SCAN_PAGE_SIZE = 100;
const SUGGESTION_LIMITS = {
  explanation: 3,
  title: 2,
  character: 2,
  question: 2,
} as const;

async function loadExplanationDetails(
  repositories: PublicReadRepositories,
): Promise<readonly ExplanationDetail<"en-US">[]> {
  const page = await repositories.explanations.list({
    locale: "en-US",
    page: 1,
    pageSize: SCAN_PAGE_SIZE,
  });
  const details = await Promise.all(
    page.items.map((item) =>
      repositories.explanations.getBySlug({
        locale: "en-US",
        slug: item.identity.localization.currentVariant.slug,
      }),
    ),
  );
  return details.flatMap((result) => result.status === "available" ? [result.value] : []);
}

function answeredQuestions(
  details: readonly ExplanationDetail<"en-US">[],
): readonly AnsweredQuestionResult[] {
  return details.flatMap((explanation) => explanation.intendedSubjectQuestion
    ? [{ question: explanation.intendedSubjectQuestion, explanation }]
    : []);
}

function matchQuestions(
  query: string,
  questions: readonly AnsweredQuestionResult[],
): readonly AnsweredQuestionResult[] {
  return [...questions]
    .map((item) => ({ item, score: relevanceScore(query, item.question) }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score || left.item.question.localeCompare(right.item.question))
    .map(({ item }) => item);
}

function emptyGroup<TItem>(page = 1): SearchGroup<TItem> {
  return { items: [], totalItems: 0, page, pageSize: SEARCH_PAGE_SIZE, totalPages: 0 };
}

function questionGroup(
  questions: readonly AnsweredQuestionResult[],
  page: number,
  pageSize: number,
): SearchGroup<AnsweredQuestionResult> {
  const totalItems = questions.length;
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize);
  const safePage = totalPages === 0 ? 1 : Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    items: questions.slice(start, start + pageSize),
    page: safePage,
    pageSize,
    totalItems,
    totalPages,
  };
}

function bestFromResults(
  query: string,
  results: readonly SearchResult<"en-US">[],
  questions: readonly AnsweredQuestionResult[],
): SearchBestMatch | undefined {
  const candidates: SearchBestMatch[] = results.map((result) => {
    if (result.kind === "title") {
      return { kind: "title", item: result.item, score: relevanceScore(query, result.item.displayTitle) };
    }
    if (result.kind === "character") {
      return { kind: "character", item: result.item, score: relevanceScore(query, result.item.displayName) };
    }
    return { kind: "explanation", item: result.item, score: relevanceScore(query, result.item.articleTitle) };
  });

  for (const question of questions) {
    candidates.push({ kind: "question", item: question, score: relevanceScore(query, question.question) });
  }

  return candidates
    .filter((candidate) => candidate.score > 0)
    .sort((left, right) => right.score - left.score)[0];
}

async function searchKind(
  repositories: PublicReadRepositories,
  query: string,
  kind: "title" | "explanation" | "character",
  page: number,
  pageSize: number,
): Promise<PaginatedResult<SearchResult<"en-US">>> {
  return repositories.search.search({
    locale: "en-US",
    query,
    kinds: [kind],
    page,
    pageSize,
  });
}

function explanationGroup(
  result: PaginatedResult<SearchResult<"en-US">>,
): SearchGroup<import("@/types/domain/explanation").ExplanationSummary<"en-US">> {
  return {
    ...result,
    items: result.items.flatMap((entry) => entry.kind === "explanation" ? [entry.item] : []),
  };
}

function titleGroup(
  result: PaginatedResult<SearchResult<"en-US">>,
): SearchGroup<import("@/types/domain/title").TitleSummary<"en-US">> {
  return {
    ...result,
    items: result.items.flatMap((entry) => entry.kind === "title" ? [entry.item] : []),
  };
}

function characterGroup(
  result: PaginatedResult<SearchResult<"en-US">>,
): SearchGroup<import("@/types/domain/character").CharacterSummary<"en-US">> {
  return {
    ...result,
    items: result.items.flatMap((entry) => entry.kind === "character" ? [entry.item] : []),
  };
}

async function loadAlternativeTerms(
  repositories: PublicReadRepositories,
  query: string,
  questions: readonly AnsweredQuestionResult[],
): Promise<readonly string[]> {
  const [titles, characters, explanations] = await Promise.all([
    repositories.titles.list({ locale: "en-US", page: 1, pageSize: SCAN_PAGE_SIZE }),
    repositories.characters.list({ locale: "en-US", page: 1, pageSize: SCAN_PAGE_SIZE }),
    repositories.explanations.list({ locale: "en-US", page: 1, pageSize: SCAN_PAGE_SIZE }),
  ]);
  const candidates = new Set<string>([
    ...titles.items.map((item) => item.displayTitle),
    ...characters.items.map((item) => item.displayName),
    ...explanations.items.map((item) => item.articleTitle),
    ...questions.map((item) => item.question),
  ]);
  const normalizedLength = Math.max(normalizeSearchQuery(query).length, 1);
  return [...candidates]
    .map((label) => ({ label, distance: levenshteinDistance(query, label) }))
    .filter(({ distance }) => distance <= Math.max(3, Math.ceil(normalizedLength * 0.55)))
    .sort((left, right) => left.distance - right.distance || left.label.localeCompare(right.label))
    .slice(0, 4)
    .map(({ label }) => label);
}

export async function loadSearchPage(
  rawQuery: string | undefined,
  filter: SearchFilter,
  requestedPage: number,
): Promise<SearchViewModel> {
  const query = normalizeSearchQuery(rawQuery);
  const repositories = getRepositories();
  const explanationDetails = await loadExplanationDetails(repositories);
  const allQuestions = answeredQuestions(explanationDetails);
  const questionsToExplore = allQuestions.slice(0, 5);

  if (!query) {
    return {
      query,
      filter: "all",
      page: 1,
      totalCount: 0,
      explanations: emptyGroup(),
      titles: emptyGroup(),
      characters: emptyGroup(),
      questions: emptyGroup(),
      questionsToExplore,
      alternatives: [],
    };
  }

  const page = Math.max(1, requestedPage);
  const filteredKind = filter === "explanations"
    ? "explanation"
    : filter === "titles"
      ? "title"
      : filter === "characters"
        ? "character"
        : null;

  const allPreview = filter === "all";
  const groupPage = allPreview || filter === "questions" ? 1 : page;
  const groupPageSize = allPreview ? SEARCH_GROUP_PREVIEW_SIZE : SEARCH_PAGE_SIZE;

  const [explanationsResult, titlesResult, charactersResult] = await Promise.all([
    searchKind(repositories, query, "explanation", filteredKind && filteredKind !== "explanation" ? 1 : groupPage, groupPageSize),
    searchKind(repositories, query, "title", filteredKind && filteredKind !== "title" ? 1 : groupPage, groupPageSize),
    searchKind(repositories, query, "character", filteredKind && filteredKind !== "character" ? 1 : groupPage, groupPageSize),
  ]);

  const matchedQuestions = matchQuestions(query, allQuestions);
  const questions = questionGroup(
    matchedQuestions,
    filter === "questions" ? page : 1,
    allPreview ? SEARCH_GROUP_PREVIEW_SIZE : SEARCH_PAGE_SIZE,
  );

  const explanations = explanationGroup(explanationsResult);
  const titles = titleGroup(titlesResult);
  const characters = characterGroup(charactersResult);
  const visibleQuestions = questions;

  const discriminated: SearchResult<"en-US">[] = [
    ...explanationsResult.items,
    ...titlesResult.items,
    ...charactersResult.items,
  ];

  const totalCount = explanationsResult.totalItems
    + titlesResult.totalItems
    + charactersResult.totalItems
    + matchedQuestions.length;
  const alternatives = totalCount === 0
    ? await loadAlternativeTerms(repositories, query, allQuestions)
    : [];

  return {
    query,
    filter,
    page,
    totalCount,
    bestMatch: bestFromResults(query, discriminated, matchedQuestions),
    explanations,
    titles,
    characters,
    questions: visibleQuestions,
    questionsToExplore,
    alternatives,
  };
}

function suggestionFromResult(result: SearchResult<"en-US">): SearchSuggestionItem {
  if (result.kind === "title") {
    const item = result.item;
    return {
      id: `title:${String(item.identity.logicalId)}`,
      kind: "title",
      label: item.displayTitle,
      context: item.releaseYear ? `${item.releaseYear} · ${item.publicRouteFamily}` : item.publicRouteFamily,
      href: titleRoute(item.publicRouteFamily, item.identity.localization.currentVariant.slug, "en-US"),
    };
  }
  if (result.kind === "character") {
    const item = result.item;
    return {
      id: `character:${String(item.identity.logicalId)}`,
      kind: "character",
      label: item.displayName,
      context: item.primaryTitleContext.displayTitle,
      href: characterRoute(item.identity.localization.currentVariant.slug, "en-US"),
    };
  }
  const item = result.item;
  return {
    id: `explanation:${String(item.identity.logicalId)}`,
    kind: "explanation",
    label: item.articleTitle,
    context: item.primaryTitle.displayTitle,
    href: explanationRoute(item.identity.localization.currentVariant.slug, "en-US"),
  };
}

function group(label: string, kind: SearchSuggestionGroup["kind"], items: readonly SearchSuggestionItem[]): SearchSuggestionGroup | null {
  return items.length ? { label, kind, items } : null;
}

export async function loadSearchSuggestions(rawQuery: string): Promise<SearchSuggestions> {
  const query = normalizeSearchQuery(rawQuery);
  if (query.length < 2) return { query, groups: [], searchHref: buildSearchHref(query) };

  const repositories = getRepositories();
  const [entityResults, explanationDetails] = await Promise.all([
    repositories.search.search({ locale: "en-US", query, page: 1, pageSize: 20 }),
    loadExplanationDetails(repositories),
  ]);
  const questionMatches = matchQuestions(query, answeredQuestions(explanationDetails));
  const byKind = {
    explanation: entityResults.items.filter((item) => item.kind === "explanation").slice(0, SUGGESTION_LIMITS.explanation),
    title: entityResults.items.filter((item) => item.kind === "title").slice(0, SUGGESTION_LIMITS.title),
    character: entityResults.items.filter((item) => item.kind === "character").slice(0, SUGGESTION_LIMITS.character),
  };

  const groups = [
    group("Explanations", "explanation", byKind.explanation.map(suggestionFromResult)),
    group("Titles", "title", byKind.title.map(suggestionFromResult)),
    group("Characters", "character", byKind.character.map(suggestionFromResult)),
    group(
      "Questions",
      "question",
      questionMatches.slice(0, SUGGESTION_LIMITS.question).map((item) => ({
        id: `question:${String(item.explanation.identity.logicalId)}`,
        kind: "question" as const,
        label: item.question,
        context: item.explanation.primaryTitle.displayTitle,
        href: explanationRoute(item.explanation.identity.localization.currentVariant.slug, "en-US"),
      })),
    ),
  ].filter((item): item is SearchSuggestionGroup => item !== null);

  return { query, groups, searchHref: buildSearchHref(query) };
}
