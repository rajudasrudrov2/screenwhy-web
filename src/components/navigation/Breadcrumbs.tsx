import Link from "next/link";
import styles from "./Breadcrumbs.module.css";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className={styles.nav} aria-label="Breadcrumb">
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const current = isLast || !item.href;
          return (
            <li className={styles.item} key={`${item.label}-${index}`}>
              {current ? (
                <span className={styles.current} aria-current={isLast ? "page" : undefined} title={isLast ? item.label : undefined}>
                  {item.label}
                </span>
              ) : (
                <Link href={item.href!} className={styles.link}>{item.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
