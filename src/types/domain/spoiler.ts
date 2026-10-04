import type { CanonScope } from "@/types/domain/canon";
import type {
  InstallmentId,
  SourceWorkId,
  TitleLogicalGroupId,
} from "@/types/domain/identity";

export type SpoilerLevel = "spoiler_free" | "minor" | "major" | "full";

export type SpoilerScope =
  | {
      readonly type: "full_title";
      readonly titleId: TitleLogicalGroupId;
    }
  | {
      readonly type: "season";
      readonly titleId: TitleLogicalGroupId;
      readonly seasonNumber: number;
      readonly installmentId?: InstallmentId;
    }
  | {
      readonly type: "installment";
      readonly installmentId: InstallmentId;
    }
  | {
      readonly type: "source_work";
      readonly sourceWorkId: SourceWorkId;
    }
  | {
      readonly type: "chapter";
      readonly sourceWorkId: SourceWorkId;
      readonly volume?: string | number;
      readonly chapter: string | number;
    };

export interface SpoilerMetadata {
  readonly level: SpoilerLevel;
  readonly scope?: SpoilerScope;
}

export type SourceMaterialSpoilerLevel = "none" | "minor" | "major" | "full";

export interface SourceMaterialSpoilerMetadata {
  readonly level: SourceMaterialSpoilerLevel;
  readonly sourceWorkId?: SourceWorkId;
  readonly volume?: string | number;
  readonly chapter?: string | number;
}

export interface ExplanationSpoilerContext {
  readonly screen: SpoilerMetadata;
  readonly sourceMaterial?: SourceMaterialSpoilerMetadata;
}

/** Reserved metadata for future structured article sections; no section UI is implemented here. */
export interface ArticleSectionSpoilerMetadata {
  readonly screen?: SpoilerMetadata;
  readonly sourceMaterial?: SourceMaterialSpoilerMetadata;
  readonly canonScopes?: readonly CanonScope[];
}
