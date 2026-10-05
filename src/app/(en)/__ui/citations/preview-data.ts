import type { SerializedDate } from "@/types/domain/editorial";
import type { SourceId } from "@/types/domain/identity";
import type { PublicCitation, PublicSource } from "@/types/domain/source";

function sourceId(value: string): SourceId {
  return value as SourceId;
}

function serializedDate(value: string): SerializedDate {
  return value as SerializedDate;
}

export const previewSources = {
  film: {
    sourceId: sourceId("preview:last-signal-film"),
    sourceType: "primary_screen_work",
    sourceTitle: "The Last Signal — fictional demonstration film",
    creatorAuthor: "Northline Pictures",
    publicationDate: serializedDate("2026-03-14"),
    verificationState: "approved",
  },
  studio: {
    sourceId: sourceId("preview:northline-production-notes"),
    sourceType: "official_studio_network_source",
    sourceTitle: "Northline Pictures fictional production notes for the station sequence",
    publisher: "Northline Pictures Editorial Archive",
    url: "https://example.com/screenwhy-preview/studio-notes",
    publicationDate: serializedDate("2026-03-18"),
    accessDate: serializedDate("2026-09-30"),
    verificationState: "source_checked",
  },
  interview: {
    sourceId: sourceId("preview:creator-interview"),
    sourceType: "creator_interview",
    sourceTitle: "Fictional creator interview: designing a warning that arrives before its cause",
    creatorAuthor: "Mara Venn",
    publisher: "Frame & Story Quarterly — Demonstration Edition",
    url: "https://example.com/screenwhy-preview/creator-interview/a-very-long-path-that-tests-link-wrapping-without-rendering-the-raw-url",
    publicationDate: serializedDate("2026-04-02"),
    accessDate: serializedDate("2026-09-30"),
    verificationState: "fact_checked",
  },
  novel: {
    sourceId: sourceId("preview:last-signal-novel"),
    sourceType: "source_material",
    sourceTitle: "The Last Signal — fictional demonstration novel with an intentionally long subtitle for responsive source-title wrapping",
    creatorAuthor: "Iris North",
    publisher: "Lantern House Press and the Fictional Long Publisher Name Cooperative",
    publicationDate: serializedDate("2024-09-05"),
    externalIdentifier: "DEMO-ISBN-978-0-0000-0000-0",
    verificationState: "source_checked",
  },
  secondary: {
    sourceId: sourceId("preview:secondary-analysis"),
    sourceType: "reputable_secondary",
    sourceTitle: "Fictional secondary analysis of chronology, repetition, and signal design",
    publisher: "Screen Studies Review — Demonstration Only",
    url: "https://example.com/screenwhy-preview/secondary-analysis",
    verificationState: "unverified",
  },
  bangla: {
    sourceId: sourceId("preview:bangla-source"),
    sourceType: "official_creator_source",
    sourceTitle: "কাল্পনিক নির্মাতা নোট: সংকেতটি কারণের আগে কেন শোনা যায়",
    creatorAuthor: "মারা ভেন",
    publisher: "নর্থলাইন পিকচার্স — ডেমো আর্কাইভ",
    verificationState: "approved",
  },
} as const satisfies Record<string, PublicSource>;

export const englishCitations = [
  {
    source: previewSources.film,
    claimSummary: "The warning is heard before the final transmitter sequence begins.",
    sectionAnchor: "section-what-the-finale-establishes",
    publicVisibility: true,
    verificationState: "approved",
  },
  {
    source: previewSources.studio,
    claimSummary: "The warning is heard before the final transmitter sequence begins.",
    sectionAnchor: "section-what-the-finale-establishes",
    publicVisibility: true,
    verificationState: "source_checked",
  },
  {
    source: previewSources.interview,
    claimSummary: "The creator frames the repeated message as a chronology clue rather than a timestamp clue.",
    sectionAnchor: "section-why-the-timing-matters",
    publicVisibility: true,
    verificationState: "fact_checked",
  },
  {
    source: previewSources.novel,
    claimSummary: "The fictional source novel uses a different mechanism for the same narrative warning.",
    sectionAnchor: "section-adaptation-difference",
    publicVisibility: true,
    verificationState: "source_checked",
  },
  {
    source: previewSources.film,
    claimSummary: "The closing image repeats a visual motif established earlier in the film.",
    sectionAnchor: "section-what-the-finale-establishes",
    publicVisibility: true,
    verificationState: "approved",
  },
  {
    source: previewSources.secondary,
    claimSummary: "A secondary reading compares the chronology cue with the repeated visual motif.",
    publicVisibility: true,
    verificationState: "unverified",
  },
] as const satisfies readonly PublicCitation[];

export const banglaCitations = [
  {
    source: previewSources.bangla,
    claimSummary: "কাল্পনিক নির্মাতা নোটে বলা হয়েছে যে সংকেতটি ইচ্ছাকৃতভাবে তার দৃশ্যমান কারণের আগে রাখা হয়েছে।",
    sectionAnchor: "section-bn-signal-order",
    publicVisibility: true,
    verificationState: "approved",
  },
  {
    source: previewSources.novel,
    claimSummary: "মূল উৎসকর্মে একই সতর্কবার্তার জন্য ভিন্ন একটি কাল্পনিক ব্যাখ্যা ব্যবহৃত হয়েছে।",
    sectionAnchor: "section-bn-adaptation",
    publicVisibility: true,
    verificationState: "source_checked",
  },
] as const satisfies readonly PublicCitation[];
