import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons/Icons";
import { Badge } from "@/components/ui/Primitives";
import { titleRoute } from "@/config/routes";
import type { TitleSummary } from "@/types/domain/title";
import { CardMedia } from "./CardMedia";
import { routeFamilyLabel, titleTypeLabel } from "./card-labels";
import styles from "./TitleCard.module.css";

export type TitleCardVariant = "standard" | "compact";

export interface TitleCardProps {
  readonly title: TitleSummary;
  readonly variant?: TitleCardVariant;
  readonly explanationSignal?: string;
}

export function TitleCard({ title, variant = "standard", explanationSignal }: TitleCardProps) {
  const locale = title.identity.localization.requestedLocale;
  const slug = title.identity.localization.currentVariant.slug;
  const href = titleRoute(title.publicRouteFamily, slug, locale);
  const routeLabel = routeFamilyLabel(title.publicRouteFamily, locale);
  const typeLabel = titleTypeLabel(title.titleType, locale);
  const contextLabel = routeLabel === typeLabel ? routeLabel : `${routeLabel} · ${typeLabel}`;
  const missingMediaLabel = "Poster unavailable";
  const accessibleName = `Explore explanations for ${title.displayTitle}`;

  return (
    <article className={`${styles.card} ${styles[variant]}`} lang={locale}>
      <Link className={styles.link} href={href} aria-label={accessibleName}>
        <div className={styles.media}>
          <CardMedia
            media={title.poster}
            ratio="poster"
            sizes={variant === "compact" ? "96px" : "(max-width: 767px) 44vw, 240px"}
            fallbackLabel={missingMediaLabel}
          />
        </div>
        <div className={styles.body}>
          <div className={styles.contextRow}>
            {title.releaseYear ? <span>{title.releaseYear}</span> : null}
            <span>{contextLabel}</span>
          </div>
          <h3 className={styles.title}>{title.displayTitle}</h3>
          {variant === "standard" && title.genres?.length ? (
            <div className={styles.badges} aria-label="Genres">
              {title.genres.slice(0, 2).map((genre) => <Badge key={genre.slug}>{genre.label}</Badge>)}
            </div>
          ) : null}
          {explanationSignal ? <p className={styles.signal}>{explanationSignal}</p> : null}
          <span className={styles.affordance} aria-hidden="true"><ArrowRightIcon size={17} /></span>
        </div>
      </Link>
    </article>
  );
}
