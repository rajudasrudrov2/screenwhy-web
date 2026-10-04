import type { PublicRouteFamily } from "@/config/routes";
import type { LocaleCode } from "@/lib/i18n/locales";
import type {
  CharacterLogicalGroupId,
  ExplanationLogicalGroupId,
  SourceWorkId,
  TitleLogicalGroupId,
} from "@/types/domain/identity";

export interface TitleReference {
  readonly logicalId: TitleLogicalGroupId;
  readonly locale: LocaleCode;
  readonly slug: string;
  readonly displayTitle: string;
  readonly publicRouteFamily: PublicRouteFamily;
}

export interface CharacterReference {
  readonly logicalId: CharacterLogicalGroupId;
  readonly locale: LocaleCode;
  readonly slug: string;
  readonly displayName: string;
}

export interface ExplanationReference {
  readonly logicalId: ExplanationLogicalGroupId;
  readonly locale: LocaleCode;
  readonly slug: string;
  readonly articleTitle: string;
}

export interface SourceWorkReference {
  readonly sourceWorkId: SourceWorkId;
  readonly officialTitle: string;
}
