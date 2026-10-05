import type { LocaleCode } from "@/lib/i18n/locales";
import type { PublicCitation } from "@/types/domain/source";
import { createCitationRegistry } from "./citation-types";
import { CitationMarker } from "./CitationMarker";
import { SourceItem } from "./SourceItem";
import styles from "./ClaimEvidence.module.css";

export interface ClaimEvidenceProps {
  readonly citations: readonly PublicCitation[];
  readonly locale?: LocaleCode;
  readonly heading?: string;
}

export function ClaimEvidence({
  citations,
  locale = "en-US",
  heading,
}: ClaimEvidenceProps) {
  const registry = createCitationRegistry(citations);
  if (registry.citations.length === 0) return null;

  const resolvedHeading = heading ?? (locale === "bn-BD" ? "প্রমাণ ও উৎস" : "Evidence & sources");

  return (
    <aside className={styles.evidence} lang={locale} aria-label={resolvedHeading}>
      <div className={styles.headingRow}>
        <h3>{resolvedHeading}</h3>
        <div className={styles.markers} aria-label={locale === "bn-BD" ? "উৎস নির্দেশক" : "Source markers"}>
          {registry.citations.map((entry) => (
            <CitationMarker
              key={entry.markerId}
              number={entry.number}
              markerId={entry.markerId}
              sourceAnchorId={entry.sourceAnchorId}
              sourceTitle={entry.citation.source.sourceTitle}
              locale={locale}
            />
          ))}
        </div>
      </div>
      <div className={styles.sources}>
        {registry.sources.map((group) => (
          <SourceItem
            key={group.sourceAnchorId}
            source={group.source}
            sourceAnchorId={group.sourceAnchorId}
            citations={group.citations}
            locale={locale}
          />
        ))}
      </div>
    </aside>
  );
}
