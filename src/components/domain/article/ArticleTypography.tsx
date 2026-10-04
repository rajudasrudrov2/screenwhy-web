import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  LiHTMLAttributes,
  ReactNode,
} from "react";
import type { LocaleCode } from "@/lib/i18n/locales";
import styles from "./ArticleTypography.module.css";

export interface ArticleProseProps extends HTMLAttributes<HTMLDivElement> {
  readonly locale?: LocaleCode;
}

export function ArticleProse({
  locale = "en-US",
  className = "",
  children,
  ...props
}: ArticleProseProps) {
  return (
    <div
      className={`${styles.prose} ${className}`.trim()}
      lang={locale}
      {...props}
    >
      {children}
    </div>
  );
}

export function ArticleLead({ children }: { readonly children: ReactNode }) {
  return <p className={styles.lead}>{children}</p>;
}

export function ArticleParagraph({ children }: { readonly children: ReactNode }) {
  return <p className={styles.paragraph}>{children}</p>;
}

export interface ArticleListProps {
  readonly ordered?: boolean;
  readonly items: readonly ReactNode[];
}

export function ArticleList({ ordered = false, items }: ArticleListProps) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className={styles.list}>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </Tag>
  );
}

export interface ArticleBlockquoteProps {
  readonly children: ReactNode;
  readonly attribution?: ReactNode;
}

export function ArticleBlockquote({
  children,
  attribution,
}: ArticleBlockquoteProps) {
  return (
    <figure className={styles.quoteFigure}>
      <blockquote className={styles.blockquote}>{children}</blockquote>
      {attribution ? (
        <figcaption className={styles.quoteAttribution}>{attribution}</figcaption>
      ) : null}
    </figure>
  );
}

export function ArticleDivider() {
  return <hr className={styles.divider} aria-hidden="true" />;
}

export interface ArticleLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  readonly href: string;
  readonly external?: boolean;
  readonly children: ReactNode;
}

export function ArticleLink({
  href,
  external = false,
  className = "",
  children,
  rel,
  ...props
}: ArticleLinkProps) {
  const combinedClassName = `${styles.link} ${className}`.trim();

  if (external) {
    return (
      <a
        href={href}
        className={combinedClassName}
        rel={rel ?? "noopener noreferrer"}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={combinedClassName} {...props}>
      {children}
    </Link>
  );
}

export function ArticleStrong({ children }: { readonly children: ReactNode }) {
  return <strong className={styles.strong}>{children}</strong>;
}

export function ArticleEmphasis({ children }: { readonly children: ReactNode }) {
  return <em className={styles.emphasis}>{children}</em>;
}

export function ArticleListItem({
  className = "",
  ...props
}: LiHTMLAttributes<HTMLLIElement>) {
  return <li className={`${styles.listItem} ${className}`.trim()} {...props} />;
}
