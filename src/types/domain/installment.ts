import type {
  InstallmentId,
  TitleLogicalGroupId,
} from "@/types/domain/identity";
import type {
  SerializedDate,
  VerificationState,
} from "@/types/domain/editorial";

export type InstallmentKind = "season" | "episode" | "special" | "part";

export interface InstallmentSummary {
  readonly installmentId: InstallmentId;
  readonly titleId: TitleLogicalGroupId;
  readonly parentInstallmentId?: InstallmentId;
  readonly kind: InstallmentKind;
  readonly seasonNumber?: number;
  readonly episodeNumber?: number;
  readonly partNumber?: number;
  readonly officialTitle?: string;
  readonly releaseDate?: SerializedDate;
  readonly productionOrder?: number;
  readonly verificationState: VerificationState;
}

export interface InstallmentDetail extends InstallmentSummary {
  readonly originalTitle?: string;
  readonly chronologicalLabel?: string;
}
