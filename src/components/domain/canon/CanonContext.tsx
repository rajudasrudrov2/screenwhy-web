import { CheckIcon, InfoIcon } from "@/components/icons/Icons";
import { canonLabels } from "@/components/domain/shared/domain-labels";
import type { LocaleCode } from "@/lib/i18n/locales";
import type { CanonClassification, CanonContext as CanonContextValue, CanonScope } from "@/types/domain/canon";
import styles from "./CanonContext.module.css";

export type CanonPresentation = "compact" | "inline" | "expanded";

export interface CanonContextProps {
  readonly context: CanonContextValue;
  readonly locale?: LocaleCode;
  readonly presentation?: CanonPresentation;
  readonly heading?: string;
}

function toneFor(classification: CanonClassification) {
  if (classification === "adaptation_difference") return "adaptation";
  if (classification === "interpretation") return "interpretation";
  if (classification === "unconfirmed_speculative") return "unconfirmed";
  return "established";
}

function scopeFallback(scope: CanonScope, locale: LocaleCode) {
  if (scope.target.kind === "source_work") {
    return locale === "bn-BD" ? "উৎসকর্মের ক্যানন" : "Source-work canon";
  }
  return locale === "bn-BD" ? "স্ক্রিন ক্যানন" : "Screen canon";
}

function scopeKind(scope: CanonScope, locale: LocaleCode) {
  if (scope.target.kind === "source_work") {
    return locale === "bn-BD" ? "উৎসকর্ম" : "Source material";
  }
  return locale === "bn-BD" ? "স্ক্রিন" : "Screen";
}

function CanonIcon({ classification }: { readonly classification: CanonClassification }) {
  if (classification === "adaptation_difference" || classification === "interpretation" || classification === "unconfirmed_speculative") {
    return <InfoIcon size={18} />;
  }
  return <CheckIcon size={18} />;
}

export function CanonContext({
  context,
  locale = "en-US",
  presentation = "inline",
  heading,
}: CanonContextProps) {
  const label = canonLabels[locale][context.classification];
  const tone = toneFor(context.classification);
  const scopeLabels = context.scopes.map((scope) => scope.label || scopeFallback(scope, locale));
  const isComparison = context.classification === "adaptation_difference";

  if (presentation === "compact") {
    return (
      <span className={`${styles.compact} ${styles[tone]}`} lang={locale} aria-label={`${label}: ${scopeLabels.join("; ")}`}>
        <span className={styles.icon}><CanonIcon classification={context.classification} /></span>
        <span className={styles.compactLabel}>{label}</span>
        {scopeLabels[0] ? <span className={styles.compactScope}>{scopeLabels.join(isComparison ? " ↔ " : ", ")}</span> : null}
      </span>
    );
  }

  if (presentation === "inline") {
    return (
      <div className={`${styles.inline} ${styles[tone]}`} lang={locale} role="group" aria-label={label}>
        <span className={styles.icon}><CanonIcon classification={context.classification} /></span>
        <strong className={styles.inlineLabel}>{label}</strong>
        <span className={styles.inlineDivider} aria-hidden="true">·</span>
        <span className={styles.inlineScopes}>{scopeLabels.join(isComparison ? " ↔ " : ", ")}</span>
      </div>
    );
  }

  const defaultHeading = locale === "bn-BD" ? "ক্যানন প্রসঙ্গ" : "Canon context";
  const comparisonLabel = locale === "bn-BD" ? "তুলনা করা ধারাবাহিকতা" : "Compared continuities";

  return (
    <aside className={`${styles.expanded} ${styles[tone]}`} lang={locale} aria-label={heading || defaultHeading}>
      <div className={styles.expandedHeader}>
        <span className={styles.icon}><CanonIcon classification={context.classification} /></span>
        <div>
          <p className={styles.eyebrow}>{heading || defaultHeading}</p>
          <p className={styles.classification}>{label}</p>
        </div>
      </div>
      {isComparison ? <p className={styles.comparisonLabel}>{comparisonLabel}</p> : null}
      <ul className={styles.scopeList}>
        {context.scopes.map((scope, index) => (
          <li className={styles.scopeItem} key={`${scope.target.kind}-${index}`}>
            <span className={styles.scopeKind}>{scopeKind(scope, locale)}</span>
            <span className={styles.scopeName}>{scope.label || scopeFallback(scope, locale)}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
