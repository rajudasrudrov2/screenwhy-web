import type { LocaleCode } from "@/lib/i18n/locales";
import type {
  CharacterDetail,
  CharacterSummary,
} from "@/types/domain/character";
import type {
  ExplanationDetail,
  ExplanationSummary,
} from "@/types/domain/explanation";
import type { LocalizedLookupResult } from "@/types/domain/localization";
import type { CharacterRelationship } from "@/types/domain/relationship";
import type { TimelineEvent } from "@/types/domain/timeline";
import type { TitleDetail, TitleSummary } from "@/types/domain/title";
import type {
  ViewerQuestionSubmission,
  ViewerQuestionSubmissionResult,
} from "@/types/domain/viewer-question";
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

export type TitleLookupResult<TLocale extends LocaleCode = LocaleCode> =
  LocalizedLookupResult<"title", TLocale, TitleDetail<TLocale>>;

export type ExplanationLookupResult<TLocale extends LocaleCode = LocaleCode> =
  LocalizedLookupResult<"explanation", TLocale, ExplanationDetail<TLocale>>;

export type CharacterLookupResult<TLocale extends LocaleCode = LocaleCode> =
  LocalizedLookupResult<"character", TLocale, CharacterDetail<TLocale>>;

export type SearchResult<TLocale extends LocaleCode = LocaleCode> =
  | {
      readonly kind: "title";
      readonly item: TitleSummary<TLocale>;
    }
  | {
      readonly kind: "explanation";
      readonly item: ExplanationSummary<TLocale>;
    }
  | {
      readonly kind: "character";
      readonly item: CharacterSummary<TLocale>;
    };

export interface TitleRepository {
  getBySlug<TLocale extends LocaleCode>(
    query: TitleLookupQuery<TLocale>,
  ): Promise<TitleLookupResult<TLocale>>;

  list<TLocale extends LocaleCode>(
    query: TitleListQuery<TLocale>,
  ): Promise<PaginatedResult<TitleSummary<TLocale>>>;
}

export interface ExplanationRepository {
  getBySlug<TLocale extends LocaleCode>(
    query: ExplanationLookupQuery<TLocale>,
  ): Promise<ExplanationLookupResult<TLocale>>;

  list<TLocale extends LocaleCode>(
    query: ExplanationListQuery<TLocale>,
  ): Promise<PaginatedResult<ExplanationSummary<TLocale>>>;
}

export interface CharacterRepository {
  getBySlug<TLocale extends LocaleCode>(
    query: CharacterLookupQuery<TLocale>,
  ): Promise<CharacterLookupResult<TLocale>>;

  list<TLocale extends LocaleCode>(
    query: CharacterListQuery<TLocale>,
  ): Promise<PaginatedResult<CharacterSummary<TLocale>>>;
}

export interface SearchRepository {
  search<TLocale extends LocaleCode>(
    query: SearchQuery<TLocale>,
  ): Promise<PaginatedResult<SearchResult<TLocale>>>;
}

export interface StoryRepository {
  getRelationships(
    query: RelationshipQuery,
  ): Promise<readonly CharacterRelationship[]>;

  getTimeline(query: TimelineQuery): Promise<readonly TimelineEvent[]>;
}

/**
 * Future mutation boundary only. PE-FE-01C deliberately provides no
 * network/persistence implementation for viewer questions until the backend
 * mutation contract is authoritative.
 */
export interface ViewerQuestionRepository {
  submit(
    input: ViewerQuestionSubmission,
  ): Promise<ViewerQuestionSubmissionResult>;
}

export interface PublicReadRepositories {
  readonly titles: TitleRepository;
  readonly explanations: ExplanationRepository;
  readonly characters: CharacterRepository;
  readonly search: SearchRepository;
  readonly story: StoryRepository;
}
