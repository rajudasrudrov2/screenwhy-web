import type { CharacterSummary } from "@/types/domain/character";
import type { ExplanationDetail, ExplanationSummary } from "@/types/domain/explanation";
import type { TitleSummary } from "@/types/domain/title";

export const SEARCH_FILTERS = [
  "all",
  "explanations",
  "titles",
  "characters",
  "questions",
] as const;

export type SearchFilter = (typeof SEARCH_FILTERS)[number];

export interface AnsweredQuestionResult {
  readonly question: string;
  readonly explanation: ExplanationDetail<"en-US">;
}

export type SearchBestMatch =
  | { readonly kind: "explanation"; readonly item: ExplanationSummary<"en-US">; readonly score: number }
  | { readonly kind: "title"; readonly item: TitleSummary<"en-US">; readonly score: number }
  | { readonly kind: "character"; readonly item: CharacterSummary<"en-US">; readonly score: number }
  | { readonly kind: "question"; readonly item: AnsweredQuestionResult; readonly score: number };

export interface SearchGroup<TItem> {
  readonly items: readonly TItem[];
  readonly totalItems: number;
  readonly page: number;
  readonly pageSize: number;
  readonly totalPages: number;
}

export interface SearchViewModel {
  readonly query: string;
  readonly filter: SearchFilter;
  readonly page: number;
  readonly totalCount: number;
  readonly bestMatch?: SearchBestMatch;
  readonly explanations: SearchGroup<ExplanationSummary<"en-US">>;
  readonly titles: SearchGroup<TitleSummary<"en-US">>;
  readonly characters: SearchGroup<CharacterSummary<"en-US">>;
  readonly questions: SearchGroup<AnsweredQuestionResult>;
  readonly questionsToExplore: readonly AnsweredQuestionResult[];
  readonly alternatives: readonly string[];
}

export type SearchSuggestionKind = "explanation" | "title" | "character" | "question";

export interface SearchSuggestionItem {
  readonly id: string;
  readonly kind: SearchSuggestionKind;
  readonly label: string;
  readonly context?: string;
  readonly href: string;
}

export interface SearchSuggestionGroup {
  readonly kind: SearchSuggestionKind;
  readonly label: string;
  readonly items: readonly SearchSuggestionItem[];
}

export interface SearchSuggestions {
  readonly query: string;
  readonly groups: readonly SearchSuggestionGroup[];
  readonly searchHref: string;
}
