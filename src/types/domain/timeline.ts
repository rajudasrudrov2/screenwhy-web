import type { LocaleCode } from "@/lib/i18n/locales";
import type { CanonContext } from "@/types/domain/canon";
import type {
  SerializedDate,
  VerificationState,
} from "@/types/domain/editorial";
import type {
  InstallmentId,
  SourceId,
  SourceWorkId,
  TimelineEventId,
} from "@/types/domain/identity";
import type {
  CharacterReference,
  ExplanationReference,
  TitleReference,
} from "@/types/domain/references";
import type { SpoilerMetadata } from "@/types/domain/spoiler";

export type TimelineTemporalType =
  | "normal"
  | "flashback"
  | "flash_forward"
  | "parallel"
  | "time_loop"
  | "uncertain";

export interface TimelineLocalizedText {
  readonly locale: LocaleCode;
  readonly label: string;
  readonly description?: string;
}

export interface TimelineEvent {
  readonly timelineEventId: TimelineEventId;
  readonly title: TitleReference;
  readonly localizedText?: TimelineLocalizedText;
  readonly chronologyOrder: number;
  readonly presentationOrder: number;
  readonly temporalType: TimelineTemporalType;
  readonly relativeChronologyLabel?: string;
  readonly fictionalDate?: SerializedDate;
  readonly fictionalDatePrecision?: string;
  readonly installmentId?: InstallmentId;
  readonly sourceWorkId?: SourceWorkId;
  readonly chapterReference?: string;
  readonly characters?: readonly CharacterReference[];
  readonly relatedExplanation?: ExplanationReference;
  readonly locationLabel?: string;
  readonly canon: CanonContext;
  readonly spoiler: SpoilerMetadata;
  readonly evidenceSourceIds?: readonly SourceId[];
  readonly verificationState: VerificationState;
}

export type TimelineEventSummary = Pick<
  TimelineEvent,
  | "timelineEventId"
  | "title"
  | "localizedText"
  | "chronologyOrder"
  | "presentationOrder"
  | "temporalType"
  | "canon"
  | "spoiler"
  | "verificationState"
>;
