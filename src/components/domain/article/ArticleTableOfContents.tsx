import type { LocaleCode } from "@/lib/i18n/locales";
import type {
  ArticleSectionId,
  ArticleTocItem,
} from "@/components/domain/article/article-types";
import styles from "./ArticleTableOfContents.module.css";

export interface ArticleTableOfContentsProps {
  readonly items: readonly ArticleTocItem[];
  readonly activeId?: ArticleSectionId;
  readonly locale?: LocaleCode;
  readonly label?: string;
  readonly mobileDefaultOpen?: boolean;
}

function TocList({
  items,
  activeId,
}: {
  readonly items: readonly ArticleTocItem[];
  readonly activeId?: ArticleSectionId;
}) {
  return (
    <ol className={styles.list}>
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <li
            className={`${styles.item} ${item.level === 3 ? styles.nested : ""}`.trim()}
            key={item.id}
          >
            <a
              href={`#${item.id}`}
              className={`${styles.link} ${active ? styles.active : ""}`.trim()}
              aria-current={active ? "location" : undefined}
            >
              <span>{item.label}</span>
            </a>
            {item.children && item.children.length > 0 ? (
              <TocList items={item.children} activeId={activeId} />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

export function ArticleTableOfContents({
  items,
  activeId,
  locale = "en-US",
  label,
  mobileDefaultOpen = false,
}: ArticleTableOfContentsProps) {
  const resolvedLabel = label ?? "In this explanation";

  return (
    <div className={styles.wrapper} lang={locale}>
      <nav className={styles.desktop} aria-label={resolvedLabel}>
        <p className={styles.heading}>{resolvedLabel}</p>
        <TocList items={items} activeId={activeId} />
      </nav>

      <details className={styles.mobile} open={mobileDefaultOpen || undefined}>
        <summary className={styles.mobileSummary}>{resolvedLabel}</summary>
        <nav className={styles.mobileNav} aria-label={resolvedLabel}>
          <TocList items={items} activeId={activeId} />
        </nav>
      </details>
    </div>
  );
}
