import type { LocaleCode } from "@/lib/i18n/locales";
import type { PublicSource } from "@/types/domain/source";
import type { VerificationState } from "@/types/domain/editorial";
import type { CitationRegistryEntry } from "./citation-types";
import { citationLabels, sourceTypeLabels } from "./source-labels";
import styles from "./SourceItem.module.css";

function formatDate(value: string, locale: LocaleCode): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function verificationLabel(
  state: VerificationState,
  locale: LocaleCode,
): string | null {
  const labels = citationLabels[locale];
  if (state === "source_checked") return labels.sourceChecked;
  if (state === "fact_checked") return labels.factChecked;
  if (state === "approved") return labels.approved;
  return null;
}

function safeExternalUrl(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export interface SourceItemProps {
  readonly source: PublicSource;
  readonly sourceAnchorId: string;
  readonly citations?: readonly CitationRegistryEntry[];
  readonly locale?: LocaleCode;
  readonly showVerification?: boolean;
}

export function SourceItem({
  source,
  sourceAnchorId,
  citations = [],
  locale = "en-US",
  showVerification = false,
}: SourceItemProps) {
  const labels = citationLabels[locale];
  const verified = showVerification
    ? verificationLabel(source.verificationState, locale)
    : null;
  const externalUrl = safeExternalUrl(source.url);

  return (
    <article
      className={styles.source}
      id={sourceAnchorId}
      lang={locale}
      tabIndex={0}
      aria-labelledby={`${sourceAnchorId}-title`}
    >
      <div className={styles.numberColumn} aria-hidden="true">
        {citations.length > 0 ? citations.map((citation) => citation.number).join(", ") : "—"}
      </div>

      <div className={styles.body}>
        <div className={styles.headingRow}>
          <div>
            <p className={styles.type}>{sourceTypeLabels[locale][source.sourceType]}</p>
            <h3 className={styles.title} id={`${sourceAnchorId}-title`}>
              {source.sourceTitle}
            </h3>
          </div>
          {externalUrl ? (
            <a
              className={styles.externalLink}
              href={externalUrl}
              rel="external noopener noreferrer"
              aria-label={`${labels.openSource}: ${source.sourceTitle}`}
            >
              {labels.openSource}
              <span aria-hidden="true">↗</span>
            </a>
          ) : null}
        </div>

        <div className={styles.metadata}>
          {source.creatorAuthor ? <span>{source.creatorAuthor}</span> : null}
          {source.publisher ? <span>{source.publisher}</span> : null}
          {source.publicationDate ? (
            <span>{labels.published} <time dateTime={source.publicationDate}>{formatDate(source.publicationDate, locale)}</time></span>
          ) : null}
          {source.accessDate ? (
            <span>{labels.accessed} <time dateTime={source.accessDate}>{formatDate(source.accessDate, locale)}</time></span>
          ) : null}
          {source.externalIdentifier ? <span>{labels.reference}: {source.externalIdentifier}</span> : null}
          {verified ? <span className={styles.verification}>{verified}</span> : null}
        </div>

        {citations.some((citation) => citation.citation.claimSummary) ? (
          <ol className={styles.claims} aria-label={labels.citations}>
            {citations.map((citation) => (
              citation.citation.claimSummary ? (
                <li key={citation.markerId}>
                  <a className={styles.backlink} href={`#${citation.markerId}`} aria-label={`${labels.citation} ${citation.number}`}>
                    [{citation.number}]
                  </a>
                  <span><strong>{labels.claim}:</strong> {citation.citation.claimSummary}</span>
                  {citation.citation.sectionAnchor ? (
                    <a className={styles.sectionLink} href={`#${citation.citation.sectionAnchor}`}>
                      {locale === "bn-BD" ? "প্রাসঙ্গিক অংশ" : "Relevant section"}
                    </a>
                  ) : null}
                </li>
              ) : null
            ))}
          </ol>
        ) : null}
      </div>
    </article>
  );
}
