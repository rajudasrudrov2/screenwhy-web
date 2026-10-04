import type { PublicRouteFamily } from "@/config/routes";
import type { LocaleCode } from "@/lib/i18n/locales";
import type {
  EditorialDates,
  SerializedDate,
  VerificationMetadata,
} from "@/types/domain/editorial";
import type { InstallmentSummary } from "@/types/domain/installment";
import type { LocalizedEntityIdentity } from "@/types/domain/localization";
import type { MediaAsset } from "@/types/domain/media";
import type {
  CharacterReference,
  ExplanationReference,
  TitleReference,
} from "@/types/domain/references";
import type { SeoMetadata } from "@/types/domain/seo";
import type { SourceWorkRelationship } from "@/types/domain/source-work";

export const TITLE_TYPES = [
  "movie",
  "tv_series",
  "miniseries",
  "documentary",
  "tv_special",
  "web_series",
  "other_screen_story",
] as const;

export type TitleType = (typeof TITLE_TYPES)[number];

export const TITLE_TYPE_LABELS = {
  movie: "Movie",
  tv_series: "TV Series",
  miniseries: "Miniseries",
  documentary: "Documentary",
  tv_special: "TV Special",
  web_series: "Web Series",
  other_screen_story: "Other Screen Story",
} as const satisfies Record<TitleType, string>;

/**
 * v1.0 requires a release-status enum but does not lock its vocabulary.
 * Keep it semantically distinct without inventing unsupported values here.
 */
declare const titleReleaseStatusBrand: unique symbol;
export type TitleReleaseStatus = string & {
  readonly [titleReleaseStatusBrand]: "title-release-status";
};

export interface ClassificationTerm {
  readonly slug: string;
  readonly label: string;
}

export interface NamedCredit {
  readonly name: string;
  readonly note?: string;
}

export type ExternalIdentifierProvider =
  | "imdb"
  | "tmdb"
  | "tvdb"
  | "anilist"
  | "myanimelist";

export interface ExternalIdentifier {
  readonly provider: ExternalIdentifierProvider;
  readonly value: string;
}

export interface TitleReleaseFacts {
  readonly releaseDate?: SerializedDate;
  readonly releaseYear?: number;
  readonly endDate?: SerializedDate;
  readonly releaseStatus: TitleReleaseStatus;
  readonly runtimeMinutes?: number;
  readonly seasonCount?: number;
  readonly episodeCount?: number;
}

export interface TitleClassifications {
  readonly genres?: readonly ClassificationTerm[];
  readonly countries?: readonly ClassificationTerm[];
  readonly originalLanguages?: readonly ClassificationTerm[];
  readonly primaryOriginalLanguage?: ClassificationTerm;
  readonly platforms?: readonly ClassificationTerm[];
}

export type TitleRelationshipType =
  | "sequel_to"
  | "prequel_to"
  | "spin_off_of"
  | "remake_of"
  | "continuation_of"
  | "shared_story_context"
  | "related_to";

export interface RelatedTitle {
  readonly relationshipType: TitleRelationshipType;
  readonly title: TitleReference;
}

export interface TitleSummary<TLocale extends LocaleCode = LocaleCode> {
  readonly identity: LocalizedEntityIdentity<"title", TLocale>;
  readonly displayTitle: string;
  readonly titleType: TitleType;
  readonly publicRouteFamily: PublicRouteFamily;
  readonly releaseYear?: number;
  readonly genres?: readonly ClassificationTerm[];
  readonly poster?: MediaAsset;
  readonly verification: VerificationMetadata;
}

export interface TitleDetail<TLocale extends LocaleCode = LocaleCode>
  extends TitleSummary<TLocale> {
  readonly spoilerFreePremise: string;
  readonly originalTitle?: string;
  readonly alternateOfficialTitles?: readonly string[];
  readonly release: TitleReleaseFacts;
  readonly classifications: TitleClassifications;
  readonly creators?: readonly NamedCredit[];
  readonly directors?: readonly NamedCredit[];
  readonly studios?: readonly NamedCredit[];
  readonly backdrop?: MediaAsset;
  readonly installments?: readonly InstallmentSummary[];
  readonly importantCharacters?: readonly CharacterReference[];
  readonly relatedExplanations?: readonly ExplanationReference[];
  readonly relatedTitles?: readonly RelatedTitle[];
  readonly sourceWorks?: readonly SourceWorkRelationship[];
  readonly externalIdentifiers?: readonly ExternalIdentifier[];
  readonly editorialDates?: EditorialDates;
  readonly seo: SeoMetadata;
}
