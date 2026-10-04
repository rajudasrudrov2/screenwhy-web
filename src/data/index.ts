/**
 * Stable public data-access surface for future PlotExplainer application code.
 * UI/pages should import from here rather than fixtures, mock internals or API
 * implementation internals.
 */
export {
  createRepositories,
  getRepositories,
  type CreateRepositoriesOptions,
} from "@/data/repositories/create-repository";
export type {
  CharacterLookupResult,
  CharacterRepository,
  ExplanationLookupResult,
  ExplanationRepository,
  PublicReadRepositories,
  SearchRepository,
  SearchResult,
  StoryRepository,
  TitleLookupResult,
  TitleRepository,
  ViewerQuestionRepository,
} from "@/data/repositories/contracts";
export type { PaginatedResult, PaginationQuery } from "@/data/repositories/pagination";
export type {
  CharacterListQuery,
  CharacterLookupQuery,
  ExplanationListQuery,
  ExplanationLookupQuery,
  RelationshipQuery,
  SearchEntityKind,
  SearchQuery,
  TimelineOrder,
  TimelineQuery,
  TitleListQuery,
  TitleLookupQuery,
} from "@/data/repositories/queries";
export {
  BackendContractNotReadyError,
  DataAccessError,
  isDataAccessError,
} from "@/data/errors";
