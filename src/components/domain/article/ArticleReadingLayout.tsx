import type { ReactNode } from "react";
import styles from "./ArticleReadingLayout.module.css";

export interface ArticleReadingLayoutProps {
  readonly toc: ReactNode;
  readonly children: ReactNode;
}

export function ArticleReadingLayout({
  toc,
  children,
}: ArticleReadingLayoutProps) {
  return (
    <div className={styles.layout}>
      <aside className={styles.tocRail}>{toc}</aside>
      <div className={styles.reading}>{children}</div>
    </div>
  );
}
