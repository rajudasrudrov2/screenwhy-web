import { CanonContext } from "@/components/domain/canon/CanonContext";
import { SpoilerContext } from "@/components/domain/spoiler/SpoilerContext";
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
}

export function QuickAnswer({
  answer,
  locale = "en-US",
  canon,
  spoiler,
  spoilerScopeLabel,
  sourceWorkLabel,
  label,
}: QuickAnswerProps) {
  const resolvedLabel = label || (locale === "bn-BD" ? "সংক্ষিপ্ত উত্তর" : "Quick Answer");
  const paragraphs = answer.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);

  return (
    <section className={styles.quickAnswer} lang={locale} aria-label={resolvedLabel}>
      <p className={styles.label}>{resolvedLabel}</p>
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
      <div className={styles.answer}>
        {paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </div>
    </section>
  );
}
