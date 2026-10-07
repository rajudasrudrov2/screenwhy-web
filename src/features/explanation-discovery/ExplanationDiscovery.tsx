import Link from "next/link";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { PageContainer } from "@/components/layout/Layout";
import { ExplanationCard } from "@/components/domain/cards/ExplanationCard";
import { canonLabels, explanationTypeLabels } from "@/components/domain/shared/domain-labels";
import {
  EXPLANATION_TYPES,
  type ExplanationType,
} from "@/types/domain/explanation";
import { CANON_CLASSIFICATIONS } from "@/types/domain/canon";
import { PUBLIC_HUB_ROUTES, PUBLIC_ROUTE_FAMILIES } from "@/config/routes";
import { CompactEmptyState } from "@/features/utility-states";
import {
  curatedExplanationHref,
  explanationDiscoveryHasFilters,
  explanationDiscoveryHref,
  explanationTypeDiscoveryHref,
} from "./explanation-discovery.utils";
import type { ExplanationDiscoveryViewModel } from "./explanation-discovery.types";
import styles from "./ExplanationDiscovery.module.css";

const FAMILY_LABELS = {
  movies: "Movies",
  tv: "TV Shows",
  anime: "Anime",
  "k-drama": "K-Drama",
  documentaries: "Documentaries",
} as const;

const SORT_LABELS = {
  updated_newest: "Recently updated",
  published_newest: "Recently published",
  title_asc: "Title A–Z",
  title_desc: "Title Z–A",
} as const;

const TYPE_GUIDANCE: Readonly<Partial<Record<ExplanationType, string>>> = {
  ending_explained: "Make sense of the final scenes and what they confirm.",
  character_explained: "Understand choices, motives and character arcs.",
  mystery_explained: "Trace clues, rules and unresolved questions.",
  scene_explained: "Focus on one scene and why it matters.",
  relationship_explained: "Understand how two characters connect and change.",
  timeline_explained: "Untangle chronology, presentation order and loops.",
  what_happens_next: "Separate confirmed aftermath from speculation.",
  book_vs_screen: "Compare adaptation choices and Canon differences.",
  recap: "Revisit the story context needed for the next answer.",
  question_answer: "Find a focused answer to a specific viewer question.",
};

function Pagination({ model }: { readonly model: ExplanationDiscoveryViewModel }) {
  const { results, definition, filters } = model;
  if (results.totalPages <= 1) return null;
  const pages = Array.from({ length: results.totalPages }, (_, index) => index + 1);
  const hrefForPage = (page: number) =>
    definition.key === "all"
      ? explanationDiscoveryHref(filters, page)
      : curatedExplanationHref(definition.route, page);

  return (
    <nav className={styles.pagination} aria-label={`${definition.heading} pages`}>
      {results.page > 1 ? <Link href={hrefForPage(results.page - 1)}>Previous</Link> : <span aria-disabled="true">Previous</span>}
      {pages.map((page) => (
        <Link key={page} href={hrefForPage(page)} aria-current={page === results.page ? "page" : undefined}>{page}</Link>
      ))}
      {results.page < results.totalPages ? <Link href={hrefForPage(results.page + 1)}>Next</Link> : <span aria-disabled="true">Next</span>}
    </nav>
  );
}

function TypeNavigator() {
  return (
    <section className={styles.topics} aria-labelledby="explanation-topics-heading">
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.eyebrow}>Find the kind of answer you need</p>
          <h2 id="explanation-topics-heading">Browse by explanation type</h2>
        </div>
      </div>
      <div className={styles.topicGrid}>
        {EXPLANATION_TYPES.map((type) => (
          <Link className={styles.topicLink} href={explanationTypeDiscoveryHref(type)} key={type}>
            <strong>{explanationTypeLabels["en-US"][type]}</strong>
            <span>{TYPE_GUIDANCE[type]}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function FilterFields({ model }: { readonly model: ExplanationDiscoveryViewModel }) {
  const { filters } = model;
  return (
    <>
      <label>
        <span>Type</span>
        <select name="type" defaultValue={filters.explanationType ?? ""}>
          <option value="">All explanation types</option>
          {EXPLANATION_TYPES.map((type) => <option key={type} value={type}>{explanationTypeLabels["en-US"][type]}</option>)}
        </select>
      </label>
      <label>
        <span>Story format</span>
        <select name="family" defaultValue={filters.routeFamily ?? ""}>
          <option value="">All formats</option>
          {PUBLIC_ROUTE_FAMILIES.map((family) => <option key={family} value={family}>{FAMILY_LABELS[family]}</option>)}
        </select>
      </label>
      <label>
        <span>Canon</span>
        <select name="canon" defaultValue={filters.canonClassification ?? ""}>
          <option value="">All Canon contexts</option>
          {CANON_CLASSIFICATIONS.map((classification) => <option key={classification} value={classification}>{canonLabels["en-US"][classification]}</option>)}
        </select>
      </label>
      <label>
        <span>Sort</span>
        <select name="sort" defaultValue={filters.sort}>
          {Object.entries(SORT_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
    </>
  );
}

function DiscoveryControls({ model }: { readonly model: ExplanationDiscoveryViewModel }) {
  const { filters } = model;
  return (
    <div className={styles.controls}>
      <form className={styles.searchForm} action={PUBLIC_HUB_ROUTES.explanations} method="get" role="search">
        <label className={styles.srOnly} htmlFor="explanation-archive-search">Search explanations</label>
        <input id="explanation-archive-search" type="search" name="q" defaultValue={filters.query} placeholder="Search explanations or questions…" maxLength={120} />
        {filters.explanationType ? <input type="hidden" name="type" value={filters.explanationType} /> : null}
        {filters.routeFamily ? <input type="hidden" name="family" value={filters.routeFamily} /> : null}
        {filters.canonClassification ? <input type="hidden" name="canon" value={filters.canonClassification} /> : null}
        {filters.sort !== "updated_newest" ? <input type="hidden" name="sort" value={filters.sort} /> : null}
        <button type="submit">Search</button>
      </form>
      <form className={styles.desktopFilters} action={PUBLIC_HUB_ROUTES.explanations} method="get">
        {filters.query ? <input type="hidden" name="q" value={filters.query} /> : null}
        <FilterFields model={model} />
        <button type="submit">Apply</button>
      </form>
      <details className={styles.mobileFilters}>
        <summary>Filters &amp; sort</summary>
        <form action={PUBLIC_HUB_ROUTES.explanations} method="get">
          {filters.query ? <input type="hidden" name="q" value={filters.query} /> : null}
          <FilterFields model={model} />
          <button type="submit">Apply filters</button>
        </form>
      </details>
      {explanationDiscoveryHasFilters(filters) ? <Link className={styles.clearLink} href={PUBLIC_HUB_ROUTES.explanations}>Clear filters</Link> : null}
    </div>
  );
}

export function ExplanationDiscovery({ model }: { readonly model: ExplanationDiscoveryViewModel }) {
  const { definition, filters, results, featured } = model;
  const resultLabel = `${results.totalItems} ${results.totalItems === 1 ? "explanation" : "explanations"}`;
  const title = filters.query ? `Results for “${filters.query}”` : definition.resultsHeading;

  return (
    <PageContainer className={styles.page}>
      <Breadcrumbs items={[
        { label: "Home", href: PUBLIC_HUB_ROUTES.home },
        ...(definition.key === "all" ? [] : [{ label: "Explanations", href: PUBLIC_HUB_ROUTES.explanations }]),
        { label: definition.heading },
      ]} />

      <header className={styles.hero}>
        <p className={styles.eyebrow}>Questions after watching, answered</p>
        <h1>{definition.heading}</h1>
        <p>{definition.description}</p>
        {definition.key !== "all" ? <Link className={styles.backLink} href={PUBLIC_HUB_ROUTES.explanations}>Browse all Explanations</Link> : null}
      </header>

      {definition.key === "all" && featured ? (
        <section className={styles.featured} aria-labelledby="featured-explanation-heading">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>Start here</p>
              <h2 id="featured-explanation-heading">Recently updated explanation</h2>
            </div>
          </div>
          <ExplanationCard explanation={featured} showCanon />
        </section>
      ) : null}

      <TypeNavigator />

      {definition.key === "all" ? <DiscoveryControls model={model} /> : null}

      <section className={styles.results} aria-labelledby="explanation-results-heading">
        <div className={styles.resultsHeading}>
          <h2 id="explanation-results-heading">{title}</h2>
          <span>{resultLabel}</span>
        </div>
        {results.items.length ? (
          <div className={styles.grid}>
            {results.items.map((explanation) => (
              <ExplanationCard key={String(explanation.identity.logicalId)} explanation={explanation} showCanon />
            ))}
          </div>
        ) : (
          <CompactEmptyState
            title="No explanations found"
            description={<p>Try a broader question or adjust the current filters.</p>}
            actions={definition.key === "all" && explanationDiscoveryHasFilters(filters) ? <Link className={styles.emptyAction} href={PUBLIC_HUB_ROUTES.explanations}>Clear filters</Link> : <Link className={styles.emptyAction} href={PUBLIC_HUB_ROUTES.explanations}>Browse all Explanations</Link>}
          />
        )}
        <Pagination model={model} />
      </section>
    </PageContainer>
  );
}
