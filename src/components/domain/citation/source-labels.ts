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
  "bn-BD": {
    primary_screen_work: "প্রাথমিক পর্দার কাজ",
    episode: "এপিসোড",
    official_creator_source: "অফিশিয়াল নির্মাতা উৎস",
    official_studio_network_source: "অফিশিয়াল স্টুডিও / নেটওয়ার্ক উৎস",
    creator_interview: "নির্মাতার সাক্ষাৎকার",
    cast_interview: "অভিনয়শিল্পীর সাক্ষাৎকার",
    source_material: "মূল উৎসকর্ম",
    official_script_or_transcript: "অফিশিয়াল স্ক্রিপ্ট / ট্রান্সক্রিপ্ট",
    reputable_secondary: "বিশ্বস্ত দ্বিতীয়িক উৎস",
    database_reference: "রেফারেন্স ডেটাবেস",
    community_research: "কমিউনিটি গবেষণা",
  },
};

export const citationLabels = {
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
  "bn-BD": {
    sources: "উৎসসমূহ",
    source: "উৎস",
    claim: "যে দাবিটি সমর্থন করে",
    openSource: "উৎস খুলুন",
    published: "প্রকাশিত",
    accessed: "দেখা হয়েছে",
    reference: "রেফারেন্স",
    citation: "উদ্ধৃতি",
    citations: "উদ্ধৃতিসমূহ",
    sourceChecked: "উৎস যাচাই করা হয়েছে",
    factChecked: "তথ্য যাচাই করা হয়েছে",
    approved: "সম্পাদকীয়ভাবে অনুমোদিত",
  },
} as const;
