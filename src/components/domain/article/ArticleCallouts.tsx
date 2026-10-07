import type { ReactNode } from "react";
import { CanonContext } from "@/components/domain/canon/CanonContext";
import {
  SourceMaterialSpoilerWarning,
  SpoilerDisclosure,
} from "@/components/domain/spoiler/SpoilerContext";
import type { LocaleCode } from "@/lib/i18n/locales";
import type {
  CanonContext as CanonContextValue,
} from "@/types/domain/canon";
import type {
  ArticleSectionSpoilerMetadata,
  ExplanationSpoilerContext,
  SourceMaterialSpoilerLevel,
  SourceMaterialSpoilerMetadata,
  SpoilerLevel,
  SpoilerMetadata,
} from "@/types/domain/spoiler";
import styles from "./ArticleCallouts.module.css";

type AdaptationDifferenceContext = Extract<
  CanonContextValue,
  { readonly classification: "adaptation_difference" }
>;

type NonComparisonCanonContext = Exclude<
  CanonContextValue,
  { readonly classification: "adaptation_difference" }
>;

type InterpretationContext = Omit<
  NonComparisonCanonContext,
  "classification"
> & {
  readonly classification: "interpretation" | "unconfirmed_speculative";
};

export interface ArticleCanonNoteProps {
  readonly context: CanonContextValue;
  readonly locale?: LocaleCode;
  readonly title?: string;
  readonly children: ReactNode;
}

export interface AdaptationDifferenceNoteProps {
  readonly context: AdaptationDifferenceContext;
  readonly locale?: LocaleCode;
  readonly title?: string;
  readonly children: ReactNode;
}

export interface InterpretationNoteProps {
  readonly context: InterpretationContext;
  readonly locale?: LocaleCode;
  readonly title?: string;
  readonly children: ReactNode;
}

export interface ArticleSpoilerSectionProps {
  readonly metadata: ArticleSectionSpoilerMetadata;
  readonly articleSpoiler?: ExplanationSpoilerContext;
  readonly locale?: LocaleCode;
  readonly screenScopeLabel?: string;
  readonly sourceWorkLabel?: string;
  readonly defaultOpen?: boolean;
  readonly children: ReactNode;
}

function noteTitle(_locale: LocaleCode, kind: "canon" | "adaptation" | "interpretation") {
  if (kind === "adaptation") return "Adaptation difference";
  if (kind === "interpretation") return "Interpretation context";
  return "Canon note";
}

function spoilerRank(level: SpoilerLevel) {
  const ranks: Record<SpoilerLevel, number> = {
    spoiler_free: 0,
    minor: 1,
    major: 2,
    full: 3,
  };
  return ranks[level];
}

function sourceRank(level: SourceMaterialSpoilerLevel) {
  const ranks: Record<SourceMaterialSpoilerLevel, number> = {
    none: 0,
    minor: 1,
    major: 2,
    full: 3,
  };
  return ranks[level];
}

function strengthenScreenSpoiler(
  section: SpoilerMetadata | undefined,
  article: SpoilerMetadata | undefined,
): SpoilerMetadata | undefined {
  if (!section) return article;
  if (!article) return section;
  if (spoilerRank(section.level) >= spoilerRank(article.level)) return section;

  return {
    ...section,
    level: article.level,
  };
}

function strengthenSourceSpoiler(
  section: SourceMaterialSpoilerMetadata | undefined,
  article: SourceMaterialSpoilerMetadata | undefined,
): SourceMaterialSpoilerMetadata | undefined {
  if (!section) return article;
  if (!article) return section;
  if (sourceRank(section.level) >= sourceRank(article.level)) return section;

  return {
    ...section,
    level: article.level,
  };
}

function NoteShell({
  context,
  locale,
  title,
  children,
}: ArticleCanonNoteProps) {
  return (
    <aside className={styles.note} lang={locale} aria-label={title}>
      <p className={styles.noteTitle}>{title}</p>
      <CanonContext context={context} locale={locale} presentation="inline" />
      <div className={styles.noteBody}>{children}</div>
    </aside>
  );
}

export function ArticleCanonNote({
  context,
  locale = "en-US",
  title = noteTitle(locale, "canon"),
  children,
}: ArticleCanonNoteProps) {
  return (
    <NoteShell context={context} locale={locale} title={title}>
      {children}
    </NoteShell>
  );
}

export function AdaptationDifferenceNote({
  context,
  locale = "en-US",
  title = noteTitle(locale, "adaptation"),
  children,
}: AdaptationDifferenceNoteProps) {
  return (
    <NoteShell context={context} locale={locale} title={title}>
      {children}
    </NoteShell>
  );
}

export function InterpretationNote({
  context,
  locale = "en-US",
  title = noteTitle(locale, "interpretation"),
  children,
}: InterpretationNoteProps) {
  return (
    <NoteShell context={context} locale={locale} title={title}>
      {children}
    </NoteShell>
  );
}

export function ArticleSpoilerSection({
  metadata,
  articleSpoiler,
  locale = "en-US",
  screenScopeLabel,
  sourceWorkLabel,
  defaultOpen = false,
  children,
}: ArticleSpoilerSectionProps) {
  const screen = strengthenScreenSpoiler(metadata.screen, articleSpoiler?.screen);
  const sourceMaterial = strengthenSourceSpoiler(
    metadata.sourceMaterial,
    articleSpoiler?.sourceMaterial,
  );

  if (screen) {
    return (
      <div className={styles.spoilerSection}>
        <SpoilerDisclosure
          metadata={screen}
          locale={locale}
          scopeLabel={screenScopeLabel}
          sourceMaterial={sourceMaterial}
          sourceWorkLabel={sourceWorkLabel}
          defaultOpen={defaultOpen}
        >
          {children}
        </SpoilerDisclosure>
      </div>
    );
  }

  if (sourceMaterial) {
    return (
      <div className={styles.spoilerSection}>
        <SourceMaterialSpoilerWarning
          metadata={sourceMaterial}
          locale={locale}
          sourceWorkLabel={sourceWorkLabel}
        />
        <div className={styles.sourceOnlyBody}>{children}</div>
      </div>
    );
  }

  return <div className={styles.spoilerSection}>{children}</div>;
}
