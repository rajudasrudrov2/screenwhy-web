import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons/Icons";
import type { LiveExplanation } from "@/lib/live-explanations";
// The owner's ORIGINAL explanation-card visual system, no replacement card skin.
import styles from "@/components/domain/cards/ExplanationCard.module.css";

export function LiveHomepageCard({ entry, variant = "standard" }: { readonly entry: LiveExplanation; readonly variant?: "standard" | "compact" }) {
  return (
    <article className={`${styles.card} ${styles[variant]}`} lang="en-US">
      <Link className={styles.link} href={entry.publicPath} aria-label={`Read ${entry.headline}`}>
        <div className={styles.body}>
          <p className={styles.type}>Explanation</p>
          <h3 className={styles.headline}>{entry.headline}</h3>
          {variant === "standard" && entry.excerpt ? <p className={styles.excerpt}>{entry.excerpt}</p> : null}
          <span className={styles.affordance} aria-hidden="true"><ArrowRightIcon size={17} /></span>
        </div>
      </Link>
    </article>
  );
}
