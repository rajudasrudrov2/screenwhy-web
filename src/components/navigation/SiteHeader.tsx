"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { CloseIcon, MenuIcon, SearchIcon } from "@/components/icons/Icons";
import { SearchInput } from "@/components/ui/FormControls";
import { PUBLIC_HUB_ROUTES, localizedRoute } from "@/config/routes";
import type { LocaleCode } from "@/lib/i18n/locales";
import styles from "./SiteHeader.module.css";

type SiteHeaderProps = {
  locale: LocaleCode;
  activePath?: string;
};

type OpenPanel = "search" | "menu" | null;

const navItems = [
  ["Movies", PUBLIC_HUB_ROUTES.movies],
  ["TV Shows", PUBLIC_HUB_ROUTES.tv],
  ["Anime", PUBLIC_HUB_ROUTES.anime],
  ["K-Drama", PUBLIC_HUB_ROUTES.kDrama],
  ["Characters", PUBLIC_HUB_ROUTES.characters],
] as const;

function isNavActive(activePath: string | undefined, href: string) {
  if (!activePath) return false;
  return activePath === href || activePath.startsWith(href);
}

export function SiteHeader({ locale, activePath }: SiteHeaderProps) {
  const homeHref = localizedRoute(PUBLIC_HUB_ROUTES.home, locale);
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null);
  const headerRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuPanelRef = useRef<HTMLElement>(null);
  const triggerRefs = {
    search: useRef<HTMLButtonElement>(null),
    menu: useRef<HTMLButtonElement>(null),
  };

  function toggle(panel: Exclude<OpenPanel, null>) {
    setOpenPanel((current) => current === panel ? null : panel);
  }

  function close(panel?: Exclude<OpenPanel, null>) {
    setOpenPanel((current) => (!panel || current === panel ? null : current));
  }

  useEffect(() => {
    if (!openPanel) return;
    if (openPanel === "search") searchInputRef.current?.focus();
    else menuPanelRef.current?.focus();
  }, [openPanel]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape" || !openPanel) return;
      event.preventDefault();
      const closingPanel = openPanel;
      setOpenPanel(null);
      requestAnimationFrame(() => triggerRefs[closingPanel].current?.focus());
    }

    function onPointerDown(event: PointerEvent) {
      if (!openPanel) return;
      const target = event.target;
      if (target instanceof Node && !headerRef.current?.contains(target)) setOpenPanel(null);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [openPanel]);

  return (
    <header ref={headerRef} className={styles.header} lang="en-US">
      <div className={styles.inner}>
        <div className={styles.mobileBrand}>
          <BrandLogo kind="mark" surface="light" href={homeHref} width={28} preload />
        </div>
        <div className={styles.desktopBrand}>
          <BrandLogo kind="horizontal" surface="light" href={homeHref} width={160} preload />
        </div>

        <nav className={styles.desktopNav} aria-label="Primary navigation">
          <ul className={styles.desktopNavList}>
            {navItems.map(([label, href]) => {
              const localizedHref = localizedRoute(href, locale);
              const active = isNavActive(activePath, localizedHref);
              return (
                <li key={href}>
                  <Link className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`.trim()} href={localizedHref} aria-current={active ? "page" : undefined}>
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.actions}>
          <div className={styles.actionWrap}>
            <button
              ref={triggerRefs.search}
              type="button"
              className={styles.actionButton}
              aria-label="Open search"
              aria-expanded={openPanel === "search"}
              aria-controls="site-search-panel"
              onClick={() => toggle("search")}
            >
              {openPanel === "search" ? <CloseIcon size={19} /> : <SearchIcon size={19} />}
              <span className={styles.actionLabel}>Search</span>
            </button>
            {openPanel === "search" ? (
              <div id="site-search-panel" className={`${styles.panel} ${styles.searchPanel}`} role="dialog" aria-label="Search ScreenWhy">
                <SearchInput
                  id="header-search-en"
                  inputRef={searchInputRef}
                  label="Search ScreenWhy"
                  placeholder="Ending, character, mystery, scene…"
                  autoComplete="off"
                />
                <p className={styles.panelNote}>Search shell only. Results and discovery behavior are implemented in the dedicated search experience.</p>
              </div>
            ) : null}
          </div>

          <div className={`${styles.actionWrap} ${styles.mobileMenuWrap}`}>
            <button
              ref={triggerRefs.menu}
              type="button"
              className={styles.actionButton}
              aria-label={openPanel === "menu" ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={openPanel === "menu"}
              aria-controls="site-mobile-menu"
              onClick={() => toggle("menu")}
            >
              {openPanel === "menu" ? <CloseIcon size={21} /> : <MenuIcon size={21} />}
            </button>
            {openPanel === "menu" ? (
              <nav id="site-mobile-menu" ref={menuPanelRef} className={`${styles.panel} ${styles.menuPanel}`} aria-label="Mobile navigation" tabIndex={-1}>
                <ul className={styles.panelList}>
                  {navItems.map(([label, href]) => {
                    const localizedHref = localizedRoute(href, locale);
                    const active = isNavActive(activePath, localizedHref);
                    return (
                      <li key={href}>
                        <Link
                          className={`${styles.panelLink} ${active ? styles.activeMobileLink : ""}`.trim()}
                          href={localizedHref}
                          aria-current={active ? "page" : undefined}
                          onClick={() => close("menu")}
                        >
                          {label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
