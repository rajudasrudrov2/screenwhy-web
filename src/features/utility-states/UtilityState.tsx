import Link from "next/link";
import type { ReactNode } from "react";
import { AlertCircleIcon, InfoIcon, SearchIcon } from "@/components/icons/Icons";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Primitives";
import { PUBLIC_HUB_ROUTES, searchRoute } from "@/config/routes";
import styles from "./UtilityState.module.css";

export type UtilityStateTone = "neutral" | "empty" | "error" | "unavailable" | "loading";

type UtilityStateProps = {
  readonly eyebrow?: string;
  readonly title: string;
  readonly description?: ReactNode;
  readonly tone?: UtilityStateTone;
  readonly actions?: ReactNode;
  readonly children?: ReactNode;
  readonly role?: "alert" | "status";
  readonly ariaLive?: "polite" | "assertive" | "off";
  readonly className?: string;
};

export function UtilityState({
  eyebrow,
  title,
  description,
  tone = "neutral",
  actions,
  children,
  role,
  ariaLive,
  className = "",
}: UtilityStateProps) {
  const Icon = tone === "error" ? AlertCircleIcon : tone === "loading" ? InfoIcon : SearchIcon;
  return (
    <section
      className={`${styles.state} ${styles[`tone_${tone}`]} ${className}`.trim()}
      role={role}
      aria-live={ariaLive === "off" ? undefined : ariaLive}
    >
      <span className={styles.icon} aria-hidden="true"><Icon size={28} /></span>
      <div className={styles.copy}>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <h1 className={styles.title}>{title}</h1>
        {description ? <div className={styles.description}>{description}</div> : null}
      </div>
      {children}
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </section>
  );
}

export function CompactEmptyState({
  title,
  description,
  actions,
}: {
  readonly title: string;
  readonly description: ReactNode;
  readonly actions?: ReactNode;
}) {
  return (
    <div className={`${styles.state} ${styles.compact} ${styles.tone_empty}`}>
      <span className={styles.icon} aria-hidden="true"><SearchIcon size={24} /></span>
      <div className={styles.copy}>
        <h3 className={styles.compactTitle}>{title}</h3>
        <div className={styles.description}>{description}</div>
      </div>
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </div>
  );
}

export function RecoverySearch({
  label = "Search ScreenWhy",
  placeholder = "Search endings, characters, mysteries…",
}: {
  readonly label?: string;
  readonly placeholder?: string;
}) {
  return (
    <form className={styles.search} action={searchRoute("en-US")} method="get" role="search">
      <label className="pe-visually-hidden" htmlFor="utility-search">{label}</label>
      <span className={styles.searchField}>
        <SearchIcon size={19} />
        <input id="utility-search" name="q" type="search" placeholder={placeholder} maxLength={180} />
      </span>
      <button type="submit">Search</button>
    </form>
  );
}

export function BrowseRecovery() {
  const items = [
    ["Movies", PUBLIC_HUB_ROUTES.movies],
    ["TV Shows", PUBLIC_HUB_ROUTES.tv],
    ["Anime", PUBLIC_HUB_ROUTES.anime],
    ["K-Drama", PUBLIC_HUB_ROUTES.kDrama],
  ] as const;
  return (
    <nav className={styles.browse} aria-label="Browse ScreenWhy">
      {items.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
    </nav>
  );
}

export function RetryableFailure({
  onRetry,
  title = "We couldn't load this content",
  description = "Something interrupted this request. You can try again or continue browsing ScreenWhy.",
}: {
  readonly onRetry: () => void;
  readonly title?: string;
  readonly description?: string;
}) {
  return (
    <UtilityState
      title={title}
      description={<p>{description}</p>}
      tone="error"
      role="alert"
      actions={
        <>
          <Button onClick={onRetry}>Try again</Button>
          <ButtonLink href={PUBLIC_HUB_ROUTES.home} variant="secondary">Go to Home</ButtonLink>
          <ButtonLink href={searchRoute("en-US")} variant="tertiary">Search ScreenWhy</ButtonLink>
        </>
      }
    />
  );
}

export function ContentUnavailableState() {
  return (
    <UtilityState
      eyebrow="Content unavailable"
      title="This content is no longer available"
      description={<p>This page is not currently available on ScreenWhy. Search for another explanation or continue browsing.</p>}
      tone="unavailable"
      actions={
        <>
          <ButtonLink href={searchRoute("en-US")}>Search ScreenWhy</ButtonLink>
          <ButtonLink href={PUBLIC_HUB_ROUTES.explanations} variant="secondary">Browse Explanations</ButtonLink>
          <ButtonLink href={PUBLIC_HUB_ROUTES.home} variant="tertiary">Go Home</ButtonLink>
        </>
      }
    />
  );
}

export function PageLoadingState() {
  return (
    <UtilityState
      eyebrow="Loading"
      title="Loading ScreenWhy"
      description={<p>Preparing the page for you.</p>}
      tone="loading"
      role="status"
      ariaLive="polite"
    >
      <div className={styles.skeletons} aria-hidden="true">
        <Skeleton width="min(100%, 32rem)" height="18px" />
        <Skeleton width="min(84%, 26rem)" height="14px" />
        <div className={styles.skeletonGrid}>
          <Skeleton height="84px" radius="12px" />
          <Skeleton height="84px" radius="12px" />
        </div>
      </div>
    </UtilityState>
  );
}
