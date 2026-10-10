import Link from "next/link";
import styles from "./TriangleDiscoveryCard.module.css";

/** Matches reader questions without pretending the private CMS Draft is published. */
export function matchesTriangleReadingQuery(value: string): boolean {
  const query = value.trim().toLowerCase();
  if (!query || query.length > 160) return false;
  return /\b(?:triangle|aeolus|jess)\b|\btime[\s-]+loop\b/.test(query);
}

interface Props {
  readonly kind?: "explanation" | "movie";
}

export function TriangleDiscoveryCard({ kind = "explanation" }: Props) {
  const isMovie = kind === "movie";
  const href = isMovie ? "/movies/triangle/" : "/explain/triangle-2009/";
  return (
    <aside className={styles.card} aria-label="Triangle reading preview">
      <div>
        <p className={styles.eyebrow}>ScreenWhy reading preview · Full spoilers</p>
        <h2>{isMovie ? "Triangle (2009) — Movie Guide" : "Triangle (2009) Explained"}</h2>
        <p>
          Understand the Aeolus time loop, overlapping versions of Jess,
          and the meaning of the ending. This reading preview is available
          while formal CMS verification is still pending.
        </p>
        <Link href={href} className={styles.link}>
          {isMovie ? "Explore the movie guide" : "Read the full explanation"} <span aria-hidden="true">→</span>
        </Link>
      </div>
      <span className={styles.year} aria-hidden="true">2009</span>
    </aside>
  );
}
