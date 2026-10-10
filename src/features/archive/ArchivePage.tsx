import Link from "next/link";
import { CharacterCard, TitleCard } from "@/components/domain/cards";
import { PageContainer } from "@/components/layout/Layout";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { PUBLIC_HUB_ROUTES } from "@/config/routes";
import { CompactEmptyState } from "@/features/utility-states";
import { matchesTriangleReadingQuery, TriangleDiscoveryCard } from "@/features/triangle-preview/TriangleDiscoveryCard";
import type { CharacterArchiveViewModel, TitleArchiveViewModel } from "./archive.types";
import {
  archiveBaseRoute,
  characterArchiveHasFilters,
  characterArchiveHref,
  titleArchiveHasFilters,
  titleArchiveHref,
} from "./archive.utils";
import styles from "./ArchivePage.module.css";

function PageNumbers({ page, totalPages, hrefForPage, label }: { readonly page: number; readonly totalPages: number; readonly hrefForPage: (page: number) => string; readonly label: string }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  return (
    <nav className={styles.pagination} aria-label={label}>
      {page > 1 ? <Link href={hrefForPage(page - 1)}>Previous</Link> : <span aria-disabled="true">Previous</span>}
      {pages.map((number) => <Link key={number} href={hrefForPage(number)} aria-current={number === page ? "page" : undefined}>{number}</Link>)}
      {page < totalPages ? <Link href={hrefForPage(page + 1)}>Next</Link> : <span aria-disabled="true">Next</span>}
    </nav>
  );
}

function ArchiveHero({ heading, description }: { readonly heading: string; readonly description: string }) {
  return (
    <header className={styles.hero}>
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>Browse ScreenWhy</p>
        <h1>{heading}</h1>
        <p>{description}</p>
      </div>
    </header>
  );
}

function TitleFilterFields({ model }: { readonly model: TitleArchiveViewModel }) {
  const { definition, filters } = model;
  return (
    <>
      {definition.genreOptions.length ? (
        <label><span>Genre</span><select name="genre" defaultValue={filters.genreSlug ?? ""}><option value="">All genres</option>{definition.genreOptions.map((genre) => <option key={genre.slug} value={genre.slug}>{genre.label}</option>)}</select></label>
      ) : null}
      {definition.yearOptions.length ? (
        <label><span>Year</span><select name="year" defaultValue={filters.releaseYear ? String(filters.releaseYear) : ""}><option value="">All years</option>{definition.yearOptions.map((year) => <option key={year} value={year}>{year}</option>)}</select></label>
      ) : null}
      <label><span>Sort</span><select name="sort" defaultValue={filters.sort}><option value="title_asc">Title A–Z</option><option value="title_desc">Title Z–A</option><option value="release_newest">Newest release</option><option value="release_oldest">Oldest release</option></select></label>
    </>
  );
}

function TitleControls({ model }: { readonly model: TitleArchiveViewModel }) {
  const { definition, filters } = model;
  const route = archiveBaseRoute(definition.routeFamily);
  return (
    <div className={styles.controls}>
      <form className={styles.searchForm} action={route} method="get" role="search">
        <label className={styles.srOnly} htmlFor={`${definition.routeFamily}-archive-search`}>{definition.searchLabel}</label>
        <input id={`${definition.routeFamily}-archive-search`} type="search" name="q" defaultValue={filters.query} placeholder={definition.searchPlaceholder} maxLength={120} />
        {filters.genreSlug ? <input type="hidden" name="genre" value={filters.genreSlug} /> : null}
        {filters.releaseYear ? <input type="hidden" name="year" value={filters.releaseYear} /> : null}
        {filters.sort !== "title_asc" ? <input type="hidden" name="sort" value={filters.sort} /> : null}
        <button type="submit">Search</button>
      </form>
      <form className={styles.desktopFilterForm} action={route} method="get">
        {filters.query ? <input type="hidden" name="q" value={filters.query} /> : null}
        <TitleFilterFields model={model} />
        <button type="submit">Apply</button>
      </form>
      <details className={styles.mobileFilters}>
        <summary>Filters &amp; sort</summary>
        <form action={route} method="get">
          {filters.query ? <input type="hidden" name="q" value={filters.query} /> : null}
          <TitleFilterFields model={model} />
          <button type="submit">Apply filters</button>
        </form>
      </details>
      {titleArchiveHasFilters(filters) ? <Link className={styles.clearLink} href={route}>Clear filters</Link> : null}
    </div>
  );
}

export function TitleArchivePage({ model }: { readonly model: TitleArchiveViewModel }) {
  const { definition, filters, results } = model;
  const resultLabel = `${results.totalItems} ${results.totalItems === 1 ? "title" : "titles"}`;
  const showTriangleReadingPreview = definition.routeFamily === "movies"
    && results.page === 1
    && !filters.genreSlug
    && (!filters.releaseYear || filters.releaseYear === 2009)
    && (!filters.query || matchesTriangleReadingQuery(filters.query));
  return (
    <PageContainer className={styles.page}>
      <Breadcrumbs items={[{ label: "Home", href: PUBLIC_HUB_ROUTES.home }, { label: definition.heading }]} />
      <ArchiveHero heading={definition.heading} description={definition.description} />
      <TitleControls model={model} />
      {showTriangleReadingPreview ? <TriangleDiscoveryCard kind="movie" /> : null}
      <section className={styles.results} aria-labelledby={`${definition.routeFamily}-results-heading`}>
        <div className={styles.resultsHeading}>
          <h2 id={`${definition.routeFamily}-results-heading`}>{filters.query ? `Results for “${filters.query}”` : `All ${definition.heading}`}</h2>
          <span>{resultLabel}</span>
        </div>
        {results.items.length ? (
          <div className={styles.titleGrid}>{results.items.map((title) => <TitleCard key={String(title.identity.logicalId)} title={title} variant="standard" />)}</div>
        ) : (
          <CompactEmptyState
            title="No titles found"
            description={<p>Try a broader search or adjust the current filters.</p>}
            actions={titleArchiveHasFilters(filters) ? <Link className={styles.emptyAction} href={archiveBaseRoute(definition.routeFamily)}>Clear filters</Link> : <Link className={styles.emptyAction} href={PUBLIC_HUB_ROUTES.explanations}>Browse Explanations</Link>}
          />
        )}
        <PageNumbers page={results.page} totalPages={results.totalPages} hrefForPage={(page) => titleArchiveHref(definition.routeFamily, filters, page)} label={`${definition.heading} pages`} />
      </section>
    </PageContainer>
  );
}

export function CharacterArchivePage({ model }: { readonly model: CharacterArchiveViewModel }) {
  const { filters, results } = model;
  return (
    <PageContainer className={styles.page}>
      <Breadcrumbs items={[{ label: "Home", href: PUBLIC_HUB_ROUTES.home }, { label: "Characters" }]} />
      <ArchiveHero heading="Characters" description="Explore spoiler-safe character understanding across movies, TV shows, anime and K-drama—focused on story role, relationships and the questions viewers ask." />
      <div className={styles.controls}>
        <form className={styles.searchForm} action={PUBLIC_HUB_ROUTES.characters} method="get" role="search">
          <label className={styles.srOnly} htmlFor="character-archive-search">Search characters</label>
          <input id="character-archive-search" type="search" name="q" defaultValue={filters.query} placeholder="Search characters…" maxLength={120} />
          {filters.sort !== "name_asc" ? <input type="hidden" name="sort" value={filters.sort} /> : null}
          <button type="submit">Search</button>
        </form>
        <form className={styles.characterSort} action={PUBLIC_HUB_ROUTES.characters} method="get">
          {filters.query ? <input type="hidden" name="q" value={filters.query} /> : null}
          <label><span>Sort</span><select name="sort" defaultValue={filters.sort}><option value="name_asc">A–Z</option><option value="name_desc">Z–A</option></select></label>
          <button type="submit">Apply</button>
        </form>
        {characterArchiveHasFilters(filters) ? <Link className={styles.clearLink} href={PUBLIC_HUB_ROUTES.characters}>Clear filters</Link> : null}
      </div>
      <section className={styles.results} aria-labelledby="character-results-heading">
        <div className={styles.resultsHeading}><h2 id="character-results-heading">{filters.query ? `Results for “${filters.query}”` : "All Characters"}</h2><span>{results.totalItems} {results.totalItems === 1 ? "character" : "characters"}</span></div>
        {results.items.length ? <div className={styles.characterGrid}>{results.items.map((character) => <CharacterCard key={String(character.identity.logicalId)} character={character} variant="standard" />)}</div> : (
          <CompactEmptyState
            title="No characters found"
            description={<p>Try another name or alias, or adjust the current search.</p>}
            actions={characterArchiveHasFilters(filters) ? <Link className={styles.emptyAction} href={PUBLIC_HUB_ROUTES.characters}>Clear filters</Link> : <Link className={styles.emptyAction} href={PUBLIC_HUB_ROUTES.explanations}>Browse Explanations</Link>}
          />
        )}
        <PageNumbers page={results.page} totalPages={results.totalPages} hrefForPage={(page) => characterArchiveHref(filters, page)} label="Character pages" />
      </section>
    </PageContainer>
  );
}
