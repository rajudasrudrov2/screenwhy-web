import type { ReactNode } from "react";
import type { LocaleCode } from "@/lib/i18n/locales";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import styles from "./SiteFrame.module.css";

type SiteFrameProps = {
  locale: LocaleCode;
  children: ReactNode;
  activePath?: string;
};

export function SiteFrame({ locale, children, activePath }: SiteFrameProps) {
  return (
    <div className={styles.frame}>
      <a className={styles.skipLink} href="#main-content">Skip to content</a>
      <SiteHeader locale={locale} activePath={activePath} />
      <main id="main-content" className={styles.main}>{children}</main>
      <SiteFooter locale={locale} />
    </div>
  );
}
