import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons/Icons";
import { characterRoute } from "@/config/routes";
import type { CharacterSummary } from "@/types/domain/character";
import { CardMedia } from "./CardMedia";
import styles from "./CharacterCard.module.css";

export type CharacterCardVariant = "standard" | "compact";

export interface CharacterCardProps {
  readonly character: CharacterSummary;
  readonly variant?: CharacterCardVariant;
  readonly discoverySignal?: string;
}

export function CharacterCard({ character, variant = "standard", discoverySignal }: CharacterCardProps) {
  const locale = character.identity.localization.requestedLocale;
  const slug = character.identity.localization.currentVariant.slug;
  const href = characterRoute(slug, locale);
  const missingMediaLabel = locale === "bn-BD" ? "পোর্ট্রেট নেই" : "Portrait unavailable";
  const accessibleName = locale === "bn-BD"
    ? `${character.displayName} চরিত্র সম্পর্কে দেখুন`
    : `Explore ${character.displayName}`;

  return (
    <article className={`${styles.card} ${styles[variant]}`} lang={locale}>
      <Link className={styles.link} href={href} aria-label={accessibleName}>
        <div className={styles.media}>
          <CardMedia
            media={character.portrait}
            ratio="portrait"
            sizes={variant === "compact" ? "84px" : "(max-width: 767px) 40vw, 220px"}
            fallbackLabel={missingMediaLabel}
          />
        </div>
        <div className={styles.body}>
          <h3 className={styles.name}>{character.displayName}</h3>
          <p className={styles.titleContext}>{character.primaryTitleContext.displayTitle}</p>
          {variant === "standard" && character.spoilerFreeDescription ? <p className={styles.description}>{character.spoilerFreeDescription}</p> : null}
          {discoverySignal ? <p className={styles.signal}>{discoverySignal}</p> : null}
          <span className={styles.affordance} aria-hidden="true"><ArrowRightIcon size={17} /></span>
        </div>
      </Link>
    </article>
  );
}
