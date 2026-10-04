import type { LocaleCode } from "@/lib/i18n/locales";
import type { ViewerQuestionId } from "@/types/domain/identity";
import type {
  CharacterReference,
  ExplanationReference,
  TitleReference,
} from "@/types/domain/references";

export interface ViewerQuestionSubmission {
  readonly question: string;
  readonly locale: LocaleCode;
  readonly titleLogicalId: TitleReference["logicalId"];
  readonly characterLogicalIds?: readonly CharacterReference["logicalId"][];
}

export interface ViewerQuestionSubmissionResult {
  readonly viewerQuestionId: ViewerQuestionId;
  readonly outcome: "accepted" | "aggregated";
}

export interface PublicViewerQuestion {
  readonly viewerQuestionId: ViewerQuestionId;
  readonly question: string;
  readonly locale: LocaleCode;
  readonly title: TitleReference;
  readonly relatedCharacters?: readonly CharacterReference[];
  readonly answered: boolean;
  readonly answer?: ExplanationReference;
}
