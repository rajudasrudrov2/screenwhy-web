export type HomeSource = "live" | "screenwhy3_demo";
export type EntertainmentKind = "movie" | "series" | "episode";
export interface HomeMovie {
  readonly id: string;
  readonly source: HomeSource;
  readonly isDemo: boolean;
  readonly title: string;
  readonly slug?: string; // demo-only stable slug; never treated as a live route
  readonly year?: number;
  readonly duration?: string;
  readonly synopsis?: string;
  readonly genre?: string;
  readonly mood?: string;
  readonly art: number;
  readonly kind: EntertainmentKind;
  readonly href?: string;
}
export interface HomeExplanation {
  readonly id: string;
  readonly source: HomeSource;
  readonly isDemo: boolean;
  readonly movieId?: string;
  readonly headline: string;
  readonly excerpt: string;
  readonly type?: string;
  readonly href?: string;
  readonly publishedAt?: string;
  readonly modifiedAt?: string;
}
export interface HomeTheme { readonly id: string; readonly source: HomeSource; readonly isDemo: boolean; readonly label: string; readonly kind: "genre"|"mood"|"theme"; readonly description: string; }
export interface HomeCollection { readonly id: string; readonly source: HomeSource; readonly isDemo: boolean; readonly title: string; readonly note: string; readonly movieIds: readonly string[]; }
export interface PremiumHomeModel {
  readonly mode: HomeSource;
  readonly movies: readonly HomeMovie[];
  readonly explanations: readonly HomeExplanation[];
  readonly themes: readonly HomeTheme[];
  readonly collections: readonly HomeCollection[];
  readonly publishedCount?: number;
}
