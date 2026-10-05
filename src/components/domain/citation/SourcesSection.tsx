import type { LocaleCode } from "@/lib/i18n/locales";
import type { PublicCitation } from "@/types/domain/source";
import { createCitationRegistry } from "./citation-types";
import { SourceItem } from "./SourceItem";
import { citationLabels } from "./source-labels";
import styles from "./SourcesSection.module.css";

export interface SourcesSectionProps {
  readonly citations: readonly PublicCitation[];
  readonly locale?: LocaleCode;
  readonly heading?: string;
  readonly showVerification?: boolean;
  readonly id?: string;
}

export function SourcesSection({
  citations,
  locale = "en-US",
  heading,
  showVerification = false,
  id = "article-sources",
}: SourcesSectionProps) {
  const registry = createCitationRegistry(citations);
  if (registry.sources.length === 0) return null;

  const resolvedHeading = heading ?? citationLabels[locale].sources;

  return (
    <section className={styles.section} lang={locale} aria-labelledby={`${id}-heading`}>
      <div className={styles.headingRow}>
        <h2 id={`${id}-heading`}>{resolvedHeading}</h2>
        <span>{registry.citations.length} {registry.citations.length === 1 ? citationLabels[locale].citation : citationLabels[locale].citations}</span>
      </div>
      <ol className={styles.list}>
        {registry.sources.map((group) => (
          <li key={group.sourceAnchorId}>
            <SourceItem
              source={group.source}
              sourceAnchorId={group.sourceAnchorId}
              citations={group.citations}
              locale={locale}
              showVerification={showVerification}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}
