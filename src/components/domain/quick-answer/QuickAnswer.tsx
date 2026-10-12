import { CanonContext } from "@/components/domain/canon/CanonContext";
import { SpoilerContext, SpoilerDisclosure } from "@/components/domain/spoiler/SpoilerContext";
import type { LocaleCode } from "@/lib/i18n/locales";
import type { CanonContext as CanonContextValue } from "@/types/domain/canon";
import type { ExplanationSpoilerContext } from "@/types/domain/spoiler";
import styles from "./QuickAnswer.module.css";

export interface QuickAnswerProps {
  readonly answer: string;
  readonly locale?: LocaleCode;
  readonly canon?: CanonContextValue;
  readonly spoiler?: ExplanationSpoilerContext;
  readonly spoilerScopeLabel?: string;
  readonly sourceWorkLabel?: string;
  readonly label?: string;
  readonly sectionId?: string;
  readonly prominentHeading?: boolean;
  readonly protectSpoilers?: boolean;
}

export function QuickAnswer({
  answer,
  locale = "en-US",
  canon,
  spoiler,
  spoilerScopeLabel,
  sourceWorkLabel,
  label,
  sectionId,
  prominentHeading = false,
  protectSpoilers = false,
}: QuickAnswerProps) {
  const resolvedLabel = label || "Quick Answer";
  const paragraphs = answer.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);
  // Missing/invalid response never invents public editorial content.
  if (paragraphs.length === 0) return null;
  const headingId = prominentHeading && sectionId ? sectionId + "-heading" : undefined;
  const body = (
    <div className={styles.answer}>
      {paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
    </div>
  );
  const guarded = protectSpoilers && spoiler && (spoiler.screen.level === "major" || spoiler.screen.level === "full");

  return (
    <section
      className={styles.quickAnswer}
      lang={locale}
      id={sectionId}
      aria-label={headingId ? undefined : resolvedLabel}
      aria-labelledby={headingId}
    >
      {prominentHeading ? <h2 id={headingId} className={styles.label}>{resolvedLabel}</h2> : <p className={styles.label}>{resolvedLabel}</p>}
      {canon || spoiler ? (
        <div className={styles.contexts}>
          {canon ? <CanonContext context={canon} locale={locale} presentation="compact" /> : null}
          {spoiler ? (
            <SpoilerContext
              context={spoiler}
              locale={locale}
              screenScopeLabel={spoilerScopeLabel}
              sourceWorkLabel={sourceWorkLabel}
            />
          ) : null}
        </div>
      ) : null}
      {guarded ? (
        <SpoilerDisclosure
          metadata={spoiler.screen}
          locale={locale}
          scopeLabel={spoilerScopeLabel}
          sourceMaterial={spoiler.sourceMaterial}
          sourceWorkLabel={sourceWorkLabel}
        >
          {body}
        </SpoilerDisclosure>
      ) : body}
    </section>
  );
}
