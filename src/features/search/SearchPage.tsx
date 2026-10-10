import Link from "next/link";
import { CharacterCard, ExplanationCard, TitleCard } from "@/components/domain/cards";
import { ArrowRightIcon, SearchIcon } from "@/components/icons/Icons";
import { PageContainer } from "@/components/layout/Layout";
import { brandConfig } from "@/config/brand";
import { explanationRoute } from "@/config/routes";
import { RecentSearches } from "@/features/search/RecentSearches";
import { SearchField } from "@/features/search/SearchField";
import type {
  AnsweredQuestionResult,
  SearchBestMatch,
  SearchFilter,
  SearchViewModel,
} from "@/features/search/search.types";
import { buildSearchHref } from "@/features/search/search.utils";
import { matchesTriangleReadingQuery, TriangleDiscoveryCard } from "@/features/triangle-preview/TriangleDiscoveryCard";
import styles from "./SearchPage.module.css";

const FILTER_LABELS: Record<SearchFilter, string> = {
  all: "All",
  explanations: "Explanations",
  titles: "Titles",
  characters: "Characters",
  questions: "Questions",
};

function QuestionRow({ item, emphasized = false }: { readonly item: AnsweredQuestionResult; readonly emphasized?: boolean }) {
  const href = explanationRoute(item.explanation.identity.localization.currentVariant.slug, "en-US");
  return (
    <article className={`${styles.questionResult} ${emphasized ? styles.questionResultEmphasized : ""}`.trim()}>
      <Link href={href}>
        <span className={styles.questionIcon} aria-hidden="true">?</span>
        <span className={styles.questionCopy}>
          <strong>{item.question}</strong>
          <small>{item.explanation.primaryTitle.displayTitle} · Answered</small>
          {emphasized ? <span>{item.explanation.excerpt ?? item.explanation.quickAnswer}</span> : null}
        </span>
        <ArrowRightIcon size={16} />
      </Link>
    </article>
  );
}

function BestMatch({ match }: { readonly match: SearchBestMatch }) {
  return (
    <section className={styles.bestMatch} aria-labelledby="best-match-heading">
      <div className={styles.sectionHeading}>
        <p className={styles.eyebrow}>Best match</p>
        <h2 id="best-match-heading">Direct answer to your search</h2>
      </div>
      {match.kind === "explanation" ? <ExplanationCard explanation={match.item} variant="standard" showCanon /> : null}
      {match.kind === "title" ? <TitleCard title={match.item} variant="standard" /> : null}
      {match.kind === "character" ? <CharacterCard character={match.item} variant="standard" /> : null}
      {match.kind === "question" ? <QuestionRow item={match.item} emphasized /> : null}
    </section>
  );
}

function FilterNav({ model }: { readonly model: SearchViewModel }) {
  const counts: Record<SearchFilter, number> = {
    all: model.totalCount,
    explanations: model.explanations.totalItems,
    titles: model.titles.totalItems,
    characters: model.characters.totalItems,
    questions: model.questions.totalItems,
  };
  return (
    <nav className={styles.filters} aria-label="Search result types">
      {(["all", "explanations", "titles", "characters", "questions"] as const).map((filter) => (
        <Link
          key={filter}
          href={buildSearchHref(model.query, filter)}
          aria-current={model.filter === filter ? "page" : undefined}
        >
          {FILTER_LABELS[filter]} <span>({counts[filter]})</span>
        </Link>
      ))}
    </nav>
  );
}

function Pagination({ model, totalPages }: { readonly model: SearchViewModel; readonly totalPages: number }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  return (
    <nav className={styles.pagination} aria-label="Search result pages">
      {model.page > 1 ? <Link href={buildSearchHref(model.query, model.filter, model.page - 1)}>Previous</Link> : <span aria-disabled="true">Previous</span>}
      {pages.map((page) => (
        <Link key={page} href={buildSearchHref(model.query, model.filter, page)} aria-current={page === model.page ? "page" : undefined}>{page}</Link>
      ))}
      {model.page < totalPages ? <Link href={buildSearchHref(model.query, model.filter, model.page + 1)}>Next</Link> : <span aria-disabled="true">Next</span>}
    </nav>
  );
}

function GroupHeading({ title, count, href }: { readonly title: string; readonly count: number; readonly href?: string }) {
  return (
    <div className={styles.groupHeading}>
      <h2>{title} <span>({count})</span></h2>
      {href ? <Link href={href}>See all <ArrowRightIcon size={15} /></Link> : null}
    </div>
  );
}

function Results({ model }: { readonly model: SearchViewModel }) {
  const all = model.filter === "all";
  const filteredTotalPages = model.filter === "explanations" ? model.explanations.totalPages
    : model.filter === "titles" ? model.titles.totalPages
      : model.filter === "characters" ? model.characters.totalPages
        : model.filter === "questions" ? model.questions.totalPages
          : 0;

  return (
    <>
      <div className={styles.resultSummary}>{(() => {
        const count = model.filter === "explanations" ? model.explanations.totalItems
          : model.filter === "titles" ? model.titles.totalItems
            : model.filter === "characters" ? model.characters.totalItems
              : model.filter === "questions" ? model.questions.totalItems
                : model.totalCount;
        return `${count} ${count === 1 ? "result" : "results"} for “${model.query}”`;
      })()}</div>
      <FilterNav model={model} />
      {model.filter === "all" && model.bestMatch ? <BestMatch match={model.bestMatch} /> : null}

      {(all || model.filter === "explanations") && model.explanations.items.length ? (
        <section className={styles.resultGroup} aria-labelledby="explanation-results-heading">
          <GroupHeading title="Explanations" count={model.explanations.totalItems} href={all ? buildSearchHref(model.query, "explanations") : undefined} />
          <div className={styles.resultGrid}>
            {model.explanations.items.map((item) => <ExplanationCard key={String(item.identity.logicalId)} explanation={item} variant="compact" />)}
          </div>
        </section>
      ) : null}

      {(all || model.filter === "titles") && model.titles.items.length ? (
        <section className={styles.resultGroup} aria-labelledby="title-results-heading">
          <GroupHeading title="Titles" count={model.titles.totalItems} href={all ? buildSearchHref(model.query, "titles") : undefined} />
          <div className={styles.resultGrid}>
            {model.titles.items.map((item) => <TitleCard key={String(item.identity.logicalId)} title={item} variant="compact" />)}
          </div>
        </section>
      ) : null}

      {(all || model.filter === "characters") && model.characters.items.length ? (
        <section className={styles.resultGroup} aria-labelledby="character-results-heading">
          <GroupHeading title="Characters" count={model.characters.totalItems} href={all ? buildSearchHref(model.query, "characters") : undefined} />
          <div className={styles.resultGrid}>
            {model.characters.items.map((item) => <CharacterCard key={String(item.identity.logicalId)} character={item} variant="compact" />)}
          </div>
        </section>
      ) : null}

      {(all || model.filter === "questions") && model.questions.items.length ? (
        <section className={styles.resultGroup} aria-labelledby="question-results-heading">
          <GroupHeading title="Questions" count={model.questions.totalItems} href={all ? buildSearchHref(model.query, "questions") : undefined} />
          <div className={styles.questionGrid}>
            {model.questions.items.map((item) => <QuestionRow key={`${String(item.explanation.identity.logicalId)}:${item.question}`} item={item} />)}
          </div>
        </section>
      ) : null}

      {!all ? <Pagination model={model} totalPages={filteredTotalPages} /> : null}
    </>
  );
}

function NoResults({ model }: { readonly model: SearchViewModel }) {
  return (
    <section className={styles.noResults} aria-labelledby="no-results-heading">
      <span className={styles.noResultsIcon} aria-hidden="true"><SearchIcon size={28} /></span>
      <h2 id="no-results-heading">No results for “{model.query}”</h2>
      <p>We couldn’t find anything matching that term. Try a different spelling or a related story question.</p>
      {model.alternatives.length ? (
        <div className={styles.alternatives}>
          <h3>Try searching for:</h3>
          <div>
            {model.alternatives.map((alternative) => <Link key={alternative} href={buildSearchHref(alternative)}>{alternative}</Link>)}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function NoQuery({ model }: { readonly model: SearchViewModel }) {
  return (
    <div className={styles.noQueryLayout}>
      <div>
        <RecentSearches />
        {model.questionsToExplore.length ? (
          <section className={styles.explore} aria-labelledby="questions-to-explore-heading">
            <h2 id="questions-to-explore-heading">Questions to explore</h2>
            <ul>
              {model.questionsToExplore.map((item) => (
                <li key={`${String(item.explanation.identity.logicalId)}:${item.question}`}>
                  <Link href={explanationRoute(item.explanation.identity.localization.currentVariant.slug, "en-US")}>
                    <SearchIcon size={16} />
                    <span>{item.question}</span>
                    <ArrowRightIcon size={14} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
      <aside className={styles.valuePanel} aria-label="About ScreenWhy search">
        <p className={styles.eyebrow}>{brandConfig.shortSlogan}</p>
        <h2>Get clear answers to the stories you love.</h2>
        <p>Search explanations, characters, titles and answered post-watch questions—without database clutter.</p>
      </aside>
    </div>
  );
}

export function SearchPage({ model }: { readonly model: SearchViewModel }) {
  const hasResults = model.totalCount > 0;
  const showReadingPreview = Boolean(model.query)
    && matchesTriangleReadingQuery(model.query)
    && (model.filter === "all" || model.filter === "explanations"
      || model.filter === "titles" || model.filter === "questions");
  return (
    <PageContainer className={styles.page}>
      <header className={styles.header}>
        <h1>{model.query ? "Search results" : "Search ScreenWhy"}</h1>
        <SearchField initialQuery={model.query} filter={model.filter} autofocus={!model.query} />
      </header>
      {showReadingPreview ? <TriangleDiscoveryCard kind={model.filter === "titles" ? "movie" : "explanation"} /> : null}
      {!model.query ? <NoQuery model={model} />
        : hasResults ? <Results model={model} />
          : showReadingPreview
            ? <p className={styles.previewNoPublishedResults}>No additional CMS-published matches for this query. The reading preview above is shown separately until its editorial review is complete.</p>
            : <NoResults model={model} />}
    </PageContainer>
  );
}
