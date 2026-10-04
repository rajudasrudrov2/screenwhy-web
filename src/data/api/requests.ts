import type { LocaleCode } from "@/lib/i18n/locales";
import type { ApiTransportRequest } from "@/data/api/transport";
import type { ApiMappingOperation } from "@/data/api/mappers";
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
import { BackendContractNotReadyError } from "@/data/errors";

/**
 * Request-shape boundary for the future authoritative backend contract.
 *
 * The locked IA gives conceptual resource families, but it does not yet lock
 * exact query parameter names/item URL patterns. Those choices therefore live
 * behind this builder interface instead of being guessed inside repositories.
 */
export interface ApiRequestBuilders {
  assertReady(operation: ApiMappingOperation): void;

  buildTitleLookup<TLocale extends LocaleCode>(
    query: TitleLookupQuery<TLocale>,
  ): ApiTransportRequest;
  buildTitleList<TLocale extends LocaleCode>(
    query: TitleListQuery<TLocale>,
  ): ApiTransportRequest;

  buildExplanationLookup<TLocale extends LocaleCode>(
    query: ExplanationLookupQuery<TLocale>,
  ): ApiTransportRequest;
  buildExplanationList<TLocale extends LocaleCode>(
    query: ExplanationListQuery<TLocale>,
  ): ApiTransportRequest;

  buildCharacterLookup<TLocale extends LocaleCode>(
    query: CharacterLookupQuery<TLocale>,
  ): ApiTransportRequest;
  buildCharacterList<TLocale extends LocaleCode>(
    query: CharacterListQuery<TLocale>,
  ): ApiTransportRequest;

  buildSearch<TLocale extends LocaleCode>(
    query: SearchQuery<TLocale>,
  ): ApiTransportRequest;
  buildRelationships(query: RelationshipQuery): ApiTransportRequest;
  buildTimeline(query: TimelineQuery): ApiTransportRequest;
}

function notReady(operation: ApiMappingOperation): never {
  throw new BackendContractNotReadyError(operation);
}

/**
 * Default B2 request-builder set. It intentionally refuses to invent wire
 * parameter names or item URL patterns until the backend contract is locked.
 */
export const backendContractNotReadyRequests: ApiRequestBuilders = {
  assertReady: notReady,
  buildTitleLookup: () => notReady("title.lookup"),
  buildTitleList: () => notReady("title.list"),
  buildExplanationLookup: () => notReady("explanation.lookup"),
  buildExplanationList: () => notReady("explanation.list"),
  buildCharacterLookup: () => notReady("character.lookup"),
  buildCharacterList: () => notReady("character.list"),
  buildSearch: () => notReady("search.list"),
  buildRelationships: () => notReady("story.relationships"),
  buildTimeline: () => notReady("story.timeline"),
};
