import type { RenderableArticleBody } from "@/data/article-body";
import type { CharacterDetail } from "@/types/domain/character";
import type { ExplanationDetail } from "@/types/domain/explanation";
import type { TitleDetail } from "@/types/domain/title";

export interface ExplanationViewerQuestion {
  readonly question: string;
  readonly explanation: ExplanationDetail<"en-US">;
}

export interface ExplanationDetailViewModel {
  readonly locale: "en-US";
  readonly explanation: ExplanationDetail<"en-US">;
  readonly primaryTitle?: TitleDetail<"en-US">;
  readonly article: RenderableArticleBody;
  readonly relatedCharacters: readonly CharacterDetail<"en-US">[];
  readonly relatedExplanations: readonly ExplanationDetail<"en-US">[];
  readonly viewerQuestions: readonly ExplanationViewerQuestion[];
}
