import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons/Icons";
import { CanonContext } from "@/components/domain/canon/CanonContext";
import { explanationTypeLabels } from "@/components/domain/shared/domain-labels";
import { SpoilerMarker } from "@/components/domain/spoiler/SpoilerContext";
import { explanationRoute } from "@/config/routes";
import type { ExplanationSummary } from "@/types/domain/explanation";
import styles from "./ExplanationCard.module.css";

export type ExplanationCardVariant = "standard" | "compact";

export interface ExplanationCardProps {
  readonly explanation: ExplanationSummary;
  readonly variant?: ExplanationCardVariant;
  readonly showCanon?: boolean;
}

function reviewedLabel(explanation: ExplanationSummary, locale: ExplanationSummary["identity"]["localization"]["requestedLocale"]) {
  if (!explanation.dates.lastReviewed) return null;
  const date = new Date(explanation.dates.lastReviewed);
  if (Number.isNaN(date.valueOf())) return null;
  return new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", year: "numeric" }).format(date);
}

export function ExplanationCard({ explanation, variant = "standard", showCanon = false }: ExplanationCardProps) {
  const locale = explanation.identity.localization.requestedLocale;
  const slug = explanation.identity.localization.currentVariant.slug;
  const href = explanationRoute(slug, locale);
  const typeLabel = explanationTypeLabels[locale][explanation.explanationType];
  const reviewed = reviewedLabel(explanation, locale);
  const accessibleName = `Read ${explanation.articleTitle}`;

  return (
    <article className={`${styles.card} ${styles[variant]}`} lang={locale}>
      <Link className={styles.link} href={href} aria-label={accessibleName}>
        <div className={styles.body}>
          <p className={styles.type}>{typeLabel}</p>
          <h3 className={styles.headline}>{explanation.articleTitle}</h3>
          <p className={styles.primaryTitle}>{explanation.primaryTitle.displayTitle}</p>
          {variant === "standard" && explanation.excerpt ? <p className={styles.excerpt}>{explanation.excerpt}</p> : null}
          <div className={styles.contexts}>
            <SpoilerMarker metadata={explanation.spoiler.screen} locale={locale} scopeLabel={explanation.primaryTitle.displayTitle} />
            {showCanon ? <CanonContext context={explanation.canon} locale={locale} presentation="compact" /> : null}
          </div>
          {reviewed ? (
            <p className={styles.reviewed}>Reviewed · {reviewed}</p>
          ) : null}
          <span className={styles.affordance} aria-hidden="true"><ArrowRightIcon size={17} /></span>
        </div>
      </Link>
    </article>
  );
}
