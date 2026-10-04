import type { ReactNode } from "react";
import { explanationTypeLabels } from "@/components/domain/shared/domain-labels";
import type { LocaleCode } from "@/lib/i18n/locales";
import type { EditorialContributorSummary, EditorialDates } from "@/types/domain/editorial";
import type { ExplanationType } from "@/types/domain/explanation";
import type { TitleReference } from "@/types/domain/references";
import styles from "./EditorialMetadata.module.css";

export type EditorialMetadataVariant = "compact" | "article" | "stacked";

export interface EditorialMetadataProps {
  readonly locale?: LocaleCode;
  readonly variant?: EditorialMetadataVariant;
  readonly dates?: EditorialDates;
  readonly author?: EditorialContributorSummary;
  readonly reviewerEditor?: EditorialContributorSummary;
  readonly explanationType?: ExplanationType;
  readonly primaryTitle?: TitleReference;
}

const labels = {
  "en-US": {
    author: "By",
    reviewer: "Reviewed by",
    published: "Published",
    modified: "Modified",
    reviewed: "Last reviewed",
    type: "Explanation",
    title: "Title",
    group: "Editorial metadata",
  },
  "bn-BD": {
    author: "লেখক",
    reviewer: "রিভিউ করেছেন",
    published: "প্রকাশিত",
    modified: "সংশোধিত",
    reviewed: "সর্বশেষ রিভিউ",
    type: "ব্যাখ্যার ধরন",
    title: "শিরোনাম",
    group: "সম্পাদকীয় তথ্য",
  },
} as const;

function formatDate(value: string, locale: LocaleCode) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

interface ItemProps {
  readonly label: string;
  readonly children: ReactNode;
}

function Item({ label, children }: ItemProps) {
  return (
    <div className={styles.item}>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export function EditorialMetadata({
  locale = "en-US",
  variant = "article",
  dates,
  author,
  reviewerEditor,
  explanationType,
  primaryTitle,
}: EditorialMetadataProps) {
  const text = labels[locale];

  return (
    <dl className={`${styles.metadata} ${styles[variant]}`} lang={locale} aria-label={text.group}>
      {explanationType ? <Item label={text.type}>{explanationTypeLabels[locale][explanationType]}</Item> : null}
      {primaryTitle ? <Item label={text.title}>{primaryTitle.displayTitle}</Item> : null}
      {author ? (
        <Item label={text.author}>
          <span className={styles.person}>{author.displayName}{author.roleTitle ? <span className={styles.role}> · {author.roleTitle}</span> : null}</span>
        </Item>
      ) : null}
      {reviewerEditor ? (
        <Item label={text.reviewer}>
          <span className={styles.person}>{reviewerEditor.displayName}{reviewerEditor.roleTitle ? <span className={styles.role}> · {reviewerEditor.roleTitle}</span> : null}</span>
        </Item>
      ) : null}
      {dates?.datePublished ? (
        <Item label={text.published}><time dateTime={dates.datePublished}>{formatDate(dates.datePublished, locale)}</time></Item>
      ) : null}
      {dates?.dateModified ? (
        <Item label={text.modified}><time dateTime={dates.dateModified}>{formatDate(dates.dateModified, locale)}</time></Item>
      ) : null}
      {dates?.lastReviewed ? (
        <Item label={text.reviewed}><time dateTime={dates.lastReviewed}>{formatDate(dates.lastReviewed, locale)}</time></Item>
      ) : null}
    </dl>
  );
}
