import type { ReactNode } from "react";
import { CanonContext } from "@/components/domain/canon/CanonContext";
import type { LocaleCode } from "@/lib/i18n/locales";
import type {
  ArticleHeadingLevel,
  ArticleSectionId,
} from "@/components/domain/article/article-types";
import type { CanonContext as CanonContextValue } from "@/types/domain/canon";
import type { ArticleSectionSpoilerMetadata } from "@/types/domain/spoiler";
import styles from "./ArticleSection.module.css";

export interface ArticleSectionProps {
  readonly id: ArticleSectionId;
  readonly heading: string;
  readonly level?: ArticleHeadingLevel;
  readonly locale?: LocaleCode;
  readonly canon?: CanonContextValue;
  readonly spoiler?: ArticleSectionSpoilerMetadata;
  readonly children: ReactNode;
}

function SectionHeading({
  id,
  heading,
  level,
}: {
  readonly id: ArticleSectionId;
  readonly heading: string;
  readonly level: ArticleHeadingLevel;
}) {
  const headingId = `${id}-heading`;
  const className = `${styles.heading} ${styles[`level${level}`]}`;

  if (level === 3) {
    return <h3 id={headingId} className={className}>{heading}</h3>;
  }

  if (level === 4) {
    return <h4 id={headingId} className={className}>{heading}</h4>;
  }

  return <h2 id={headingId} className={className}>{heading}</h2>;
}

export function ArticleSection({
  id,
  heading,
  level = 2,
  locale = "en-US",
  canon,
  spoiler,
  children,
}: ArticleSectionProps) {
  return (
    <section
      id={id}
      className={styles.section}
      lang={locale}
      aria-labelledby={`${id}-heading`}
      data-spoiler-context={spoiler ? "present" : undefined}
    >
      <SectionHeading id={id} heading={heading} level={level} />
      {canon ? (
        <div className={styles.sectionContext}>
          <CanonContext context={canon} locale={locale} presentation="inline" />
        </div>
      ) : null}
      <div className={styles.content}>{children}</div>
    </section>
  );
}
