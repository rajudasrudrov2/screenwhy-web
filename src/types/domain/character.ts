import type { LocaleCode } from "@/lib/i18n/locales";
import type { CanonContext } from "@/types/domain/canon";
import type {
  EditorialDates,
  VerificationMetadata,
  VerificationState,
} from "@/types/domain/editorial";
import type {
  CharacterLogicalGroupId,
  InstallmentId,
  SourceId,
  TimelineEventId,
} from "@/types/domain/identity";
import type { LocalizedEntityIdentity } from "@/types/domain/localization";
import type { MediaAsset } from "@/types/domain/media";
import type {
  ExplanationReference,
  TitleReference,
} from "@/types/domain/references";
import type { CharacterRelationship } from "@/types/domain/relationship";
import type { SeoMetadata } from "@/types/domain/seo";
import type { SpoilerMetadata } from "@/types/domain/spoiler";
import type { TimelineEventSummary } from "@/types/domain/timeline";

export interface PerformerRecord {
  readonly performerName: string;
  readonly titleContext: TitleReference;
  readonly seasonScope?: number;
  readonly versionScope?: string;
  readonly roleNote?: string;
}

export type CharacterStatusValue =
  | "alive"
  | "deceased"
  | "missing"
  | "unknown"
  | "other";

export interface CharacterStatusRecord {
  readonly characterId: CharacterLogicalGroupId;
  readonly titleContext: TitleReference;
  readonly canon: CanonContext;
  readonly status: CharacterStatusValue;
  readonly effectiveEventId?: TimelineEventId;
  readonly effectiveInstallmentId?: InstallmentId;
  readonly spoiler: SpoilerMetadata;
  readonly evidenceSourceIds?: readonly SourceId[];
  readonly verificationState: VerificationState;
}

export interface CharacterSummary<TLocale extends LocaleCode = LocaleCode> {
  readonly identity: LocalizedEntityIdentity<"character", TLocale>;
  readonly displayName: string;
  readonly primaryTitleContext: TitleReference;
  readonly spoilerFreeDescription?: string;
  readonly portrait?: MediaAsset;
  readonly verification: VerificationMetadata;
}

export interface CharacterDetail<TLocale extends LocaleCode = LocaleCode>
  extends CharacterSummary<TLocale> {
  readonly aliases?: readonly string[];
  readonly fullDescription?: string;
  readonly titleContexts: readonly TitleReference[];
  readonly performers?: readonly PerformerRecord[];
  readonly statuses?: readonly CharacterStatusRecord[];
  readonly relationships?: readonly CharacterRelationship[];
  readonly relatedExplanations?: readonly ExplanationReference[];
  readonly importantTimelineEvents?: readonly TimelineEventSummary[];
  readonly additionalMedia?: readonly MediaAsset[];
  readonly editorialDates?: EditorialDates;
  readonly seo: SeoMetadata;
}
