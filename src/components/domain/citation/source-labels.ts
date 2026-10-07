import type { LocaleCode } from "@/lib/i18n/locales";
import type { SourceType } from "@/types/domain/source";

export const sourceTypeLabels: Record<LocaleCode, Record<SourceType, string>> = {
  "en-US": {
    primary_screen_work: "Primary screen work",
    episode: "Episode",
    official_creator_source: "Official creator source",
    official_studio_network_source: "Official studio / network source",
    creator_interview: "Creator interview",
    cast_interview: "Cast interview",
    source_material: "Source material",
    official_script_or_transcript: "Official script / transcript",
    reputable_secondary: "Reputable secondary source",
    database_reference: "Reference database",
    community_research: "Community research",
  },
};

export const citationLabels: Record<LocaleCode, {
  readonly sources: string; readonly source: string; readonly claim: string; readonly openSource: string;
  readonly published: string; readonly accessed: string; readonly reference: string; readonly citation: string;
  readonly citations: string; readonly sourceChecked: string; readonly factChecked: string; readonly approved: string;
}> = {
  "en-US": {
    sources: "Sources",
    source: "Source",
    claim: "Supports",
    openSource: "Open source",
    published: "Published",
    accessed: "Accessed",
    reference: "Reference",
    citation: "Citation",
    citations: "Citations",
    sourceChecked: "Source checked",
    factChecked: "Fact checked",
    approved: "Editorially approved",
  },
};
