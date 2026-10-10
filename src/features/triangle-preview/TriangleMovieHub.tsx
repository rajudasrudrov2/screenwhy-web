import Link from "next/link";
import { SiteFrame } from "@/components/navigation/SiteFrame";
import { PageContainer } from "@/components/layout/Layout";
import styles from "./TriangleMovieHub.module.css";

/**
 * Temporary discovery-only title page. It does not claim the underlying
 * WordPress Title/Explanation has passed publication verification.
 */
export function TriangleMovieHub() {
  return (
    <SiteFrame locale="en-US" activePath="/movies/triangle/">
      <PageContainer className={styles.page}>
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <Link href="/">Home</Link><span aria-hidden="true">/</span>
          <Link href="/movies/">Movies</Link><span aria-hidden="true">/</span>
          <span aria-current="page">Triangle (2009)</span>
        </nav>
        <article className={styles.hero}>
          <p className={styles.eyebrow}>Movie guide · Reading preview</p>
          <h1>Triangle (2009)</h1>
          <p className={styles.meta}>Film · 2009 · Directed by Christopher Smith</p>
          <p className={styles.intro}>
            A storm, an abandoned ocean liner, and repeated encounters with Jess reveal
            a twisting story of time loops, identity, memory, and impossible choices.
          </p>
          <div className={styles.notice} role="note">
            <strong>Editorial status:</strong> This guide links to an owner-reviewed reading preview.
            The corresponding WordPress Explanation remains a private draft awaiting its formal
            verification process. Full spoilers are clearly marked in the article.
          </div>
          <Link href="/explain/triangle-2009/" className={styles.cta}>
            Read the complete Triangle explanation <span aria-hidden="true">→</span>
          </Link>
        </article>
        <section className={styles.details} aria-labelledby="triangle-questions-heading">
          <h2 id="triangle-questions-heading">Questions answered in the full explanation</h2>
          <ul>
            <li>Why does Jess keep encountering other versions of herself?</li>
            <li>How do the events aboard Aeolus overlap?</li>
            <li>What do the taxi driver, the accident, and the ending suggest?</li>
            <li>Which details are shown directly, and which remain interpretations?</li>
          </ul>
          <Link href="/search/?q=triangle" className={styles.search}>Search ScreenWhy for Triangle</Link>
        </section>
      </PageContainer>
    </SiteFrame>
  );
}
