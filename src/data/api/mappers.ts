import type { LocaleCode } from "@/lib/i18n/locales";
import type {
  CharacterLookupResult,
  ExplanationLookupResult,
  SearchResult,
  TitleLookupResult,
} from "@/data/repositories/contracts";
import type { PaginatedResult } from "@/data/repositories/pagination";
import type {
  CharacterListQuery,
  CharacterLookupQuery,
  ExplanationListQuery,
  ExplanationLookupQuery,
  RelationshipQuery,
  SearchQuery,
  TimelineQuery,
  TitleListQuery,
  TitleLookupQuery,
} from "@/data/repositories/queries";
import type { CharacterSummary } from "@/types/domain/character";
import type { ExplanationSummary } from "@/types/domain/explanation";
import type { CharacterRelationship } from "@/types/domain/relationship";
import type { TimelineEvent } from "@/types/domain/timeline";
import type { TitleSummary } from "@/types/domain/title";
import { BackendContractNotReadyError } from "@/data/errors";

export const API_MAPPING_OPERATIONS = [
  "title.lookup",
  "title.list",
  "explanation.lookup",
  "explanation.list",
  "character.lookup",
  "character.list",
  "search.list",
  "story.relationships",
  "story.timeline",
] as const;

export type ApiMappingOperation = (typeof API_MAPPING_OPERATIONS)[number];

/**
 * Explicit transport -> frontend-domain decoder boundary.
 * No raw API payload may be returned from a repository without passing here.
 */
export interface ApiDomainMappers {
  assertReady(operation: ApiMappingOperation): void;

  mapTitleLookup<TLocale extends LocaleCode>(
    payload: unknown,
    query: TitleLookupQuery<TLocale>,
  ): TitleLookupResult<TLocale>;

  mapTitleList<TLocale extends LocaleCode>(
    payload: unknown,
    query: TitleListQuery<TLocale>,
  ): PaginatedResult<TitleSummary<TLocale>>;

  mapExplanationLookup<TLocale extends LocaleCode>(
    payload: unknown,
    query: ExplanationLookupQuery<TLocale>,
  ): ExplanationLookupResult<TLocale>;

  mapExplanationList<TLocale extends LocaleCode>(
    payload: unknown,
    query: ExplanationListQuery<TLocale>,
  ): PaginatedResult<ExplanationSummary<TLocale>>;

  mapCharacterLookup<TLocale extends LocaleCode>(
    payload: unknown,
    query: CharacterLookupQuery<TLocale>,
  ): CharacterLookupResult<TLocale>;

  mapCharacterList<TLocale extends LocaleCode>(
    payload: unknown,
    query: CharacterListQuery<TLocale>,
  ): PaginatedResult<CharacterSummary<TLocale>>;

  mapSearch<TLocale extends LocaleCode>(
    payload: unknown,
    query: SearchQuery<TLocale>,
  ): PaginatedResult<SearchResult<TLocale>>;

  mapRelationships(
    payload: unknown,
    query: RelationshipQuery,
  ): readonly CharacterRelationship[];

  mapTimeline(payload: unknown, query: TimelineQuery): readonly TimelineEvent[];
}

function notReady(operation: ApiMappingOperation): never {
  throw new BackendContractNotReadyError(operation);
}

/**
 * Default B2 mapper set. Every operation intentionally fails closed before a
 * network request is sent because the backend response contract is not locked.
 */
export const backendContractNotReadyMappers: ApiDomainMappers = {
  assertReady: notReady,
  mapTitleLookup: () => notReady("title.lookup"),
  mapTitleList: () => notReady("title.list"),
  mapExplanationLookup: () => notReady("explanation.lookup"),
  mapExplanationList: () => notReady("explanation.list"),
  mapCharacterLookup: () => notReady("character.lookup"),
  mapCharacterList: () => notReady("character.list"),
  mapSearch: () => notReady("search.list"),
  mapRelationships: () => notReady("story.relationships"),
  mapTimeline: () => notReady("story.timeline"),
};
