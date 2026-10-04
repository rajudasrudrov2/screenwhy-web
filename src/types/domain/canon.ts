import type {
  SourceWorkId,
  TitleLogicalGroupId,
} from "@/types/domain/identity";

export const CANON_CLASSIFICATIONS = [
  "tv_canon",
  "movie_canon",
  "novel_canon",
  "book_canon",
  "manga_canon",
  "game_canon",
  "adaptation_difference",
  "interpretation",
  "unconfirmed_speculative",
] as const;

export type CanonClassification = (typeof CANON_CLASSIFICATIONS)[number];

export const CANON_CLASSIFICATION_LABELS = {
  tv_canon: "TV Canon",
  movie_canon: "Movie Canon",
  novel_canon: "Novel Canon",
  book_canon: "Book Canon",
  manga_canon: "Manga Canon",
  game_canon: "Game Canon",
  adaptation_difference: "Adaptation Difference",
  interpretation: "Interpretation",
  unconfirmed_speculative: "Unconfirmed / Speculative",
} as const satisfies Record<CanonClassification, string>;

export type CanonScopeTarget =
  | {
      readonly kind: "title";
      readonly titleId: TitleLogicalGroupId;
    }
  | {
      readonly kind: "source_work";
      readonly sourceWorkId: SourceWorkId;
    };

export interface CanonScope {
  readonly target: CanonScopeTarget;
  /** Optional public/editorial label; identity remains the structured target. */
  readonly label?: string;
}

type NonComparisonCanonClassification = Exclude<
  CanonClassification,
  "adaptation_difference"
>;

export type CanonContext =
  | {
      readonly classification: NonComparisonCanonClassification;
      readonly scopes: readonly [CanonScope, ...CanonScope[]];
    }
  | {
      readonly classification: "adaptation_difference";
      readonly scopes: readonly [CanonScope, CanonScope, ...CanonScope[]];
    };
