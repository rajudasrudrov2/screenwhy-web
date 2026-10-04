import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { EDITORIAL_ROUTES, PUBLIC_HUB_ROUTES, localizedRoute } from "@/config/routes";
import type { LocaleCode } from "@/lib/i18n/locales";
import styles from "./SiteFooter.module.css";

const groups = [
  {
    title: "Browse",
    links: [
      ["Movies", PUBLIC_HUB_ROUTES.movies],
      ["TV Shows", PUBLIC_HUB_ROUTES.tv],
      ["Anime", PUBLIC_HUB_ROUTES.anime],
      ["K-Drama", PUBLIC_HUB_ROUTES.kDrama],
      ["Characters", PUBLIC_HUB_ROUTES.characters],
    ],
  },
  {
    title: "About",
    links: [
      ["About", EDITORIAL_ROUTES.about],
      ["Contact", EDITORIAL_ROUTES.contact],
    ],
  },
  {
    title: "Standards",
    links: [
      ["Editorial Policy", EDITORIAL_ROUTES.editorialPolicy],
      ["Sourcing Policy", EDITORIAL_ROUTES.sourcingPolicy],
      ["Corrections", EDITORIAL_ROUTES.correctionsPolicy],
      ["AI Usage Policy", EDITORIAL_ROUTES.aiUsagePolicy],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Privacy", EDITORIAL_ROUTES.privacy],
      ["Terms", EDITORIAL_ROUTES.terms],
      ["Copyright / DMCA", EDITORIAL_ROUTES.copyrightDmca],
    ],
  },
] as const;

export function SiteFooter({ locale }: { locale: LocaleCode }) {
  const homeHref = localizedRoute(PUBLIC_HUB_ROUTES.home, locale);

  return (
    <footer className={styles.footer} lang="en-US" data-focus-surface="dark">
      <div className={styles.inner}>
        <div className={styles.brand}>
          <BrandLogo kind="horizontal" surface="dark" href={homeHref} width={160} />
          <p className={styles.tagline}>Movies &amp; Shows, Explained.</p>
        </div>

        <div className={styles.groups}>
          {groups.map((group) => (
            <nav key={group.title} aria-label={`${group.title} footer links`}>
              <h2 className={styles.groupTitle}>{group.title}</h2>
              <ul className={styles.links}>
                {group.links.map(([label, href]) => (
                  <li key={href}>
                    <Link className={styles.link} href={localizedRoute(href, locale)}>{label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className={styles.bottom}>
          <span>© PlotExplainer</span>
          <span>Movies &amp; Shows, Explained.</span>
        </div>
      </div>
    </footer>
  );
}
