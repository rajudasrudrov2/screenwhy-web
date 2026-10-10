import Link from "next/link";
import { ExplanationCard } from "@/components/domain/cards";
import { ArrowRightIcon, SearchIcon } from "@/components/icons/Icons";
import { PageContainer } from "@/components/layout/Layout";
import { brandConfig } from "@/config/brand";
import { explanationRoute } from "@/config/routes";
import { homepageBrowseExplanationsHref, homepageSearchHref } from "./homepage.config";
import type {
  HomepageDiscoveryLane,
  HomepageQuestionItem,
  HomepageViewModel,
} from "./homepage.types";
import { RouteGatewayCard } from "./RouteGatewayCard";
import styles from "./Homepage.module.css";

function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  action,
}: {
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly description?: string;
  readonly action?: { readonly label: string; readonly href: string };
}) {
  return (
    <div className={styles.sectionHeading}>
      <div className={styles.sectionHeadingCopy}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2 id={id} className={styles.sectionTitle}>{title}</h2>
        {description ? <p className={styles.sectionDescription}>{description}</p> : null}
      </div>
      {action ? (
        <Link className={styles.sectionAction} href={action.href}>
          {action.label}<ArrowRightIcon size={16} />
        </Link>
      ) : null}
    </div>
  );
}

function DiscoveryLane({ lane }: { readonly lane: HomepageDiscoveryLane }) {
  return (
    <article className={styles.discoveryLane}>
      <h3>{lane.title}</h3>
      <p className={styles.laneDescription}>{lane.description}</p>
      {lane.explanations.length ? (
        <ul className={styles.laneList}>
          {lane.explanations.map((explanation) => {
            const href = explanationRoute(
              explanation.identity.localization.currentVariant.slug,
              explanation.identity.localization.requestedLocale,
            );
            return (
              <li key={String(explanation.identity.logicalId)}>
                <Link className={styles.laneLink} href={href}>
                  <span className={styles.laneType}>{explanation.primaryTitle.displayTitle}</span>
                  <span>{explanation.articleTitle}</span>
                  <ArrowRightIcon size={15} />
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
      <Link className={styles.laneBrowse} href={lane.browseHref}>
        {lane.browseLabel}<ArrowRightIcon size={15} />
      </Link>
    </article>
  );
}

function ViewerQuestionRow({ item }: { readonly item: HomepageQuestionItem }) {
  const href = explanationRoute(
    item.explanation.identity.localization.currentVariant.slug,
    item.explanation.identity.localization.requestedLocale,
  );

  return (
    <li>
      <Link className={styles.questionRow} href={href}>
        <span className={styles.questionMark} aria-hidden="true">?</span>
        <span className={styles.questionCopy}>
          <strong>{item.question}</strong>
          <small>{item.explanation.primaryTitle.displayTitle} · {item.explanation.articleTitle}</small>
        </span>
        <span className={styles.answered}>Answered</span>
        <ArrowRightIcon size={16} />
      </Link>
    </li>
  );
}

export function Homepage({ model }: { readonly model: HomepageViewModel }) {
  const searchHref = homepageSearchHref(model.locale);
  const explanationBrowseHref = homepageBrowseExplanationsHref(model.locale);

  return (
    <div className={styles.homepage}>
      <section className={styles.hero} aria-labelledby="homepage-title">
        <PageContainer className={styles.heroInner}>
          <p className={styles.heroEyebrow}>{brandConfig.tagline}</p>
          <h1 id="homepage-title">{brandConfig.recommendedHomepageH1}</h1>
          <p className={styles.heroCopy}>
            Clear answers to endings, characters, mysteries, scenes and story questions—without turning entertainment into a database.
          </p>
          <form className={styles.searchForm} action={searchHref} method="get" role="search">
            <label className={styles.visuallyHidden} htmlFor="homepage-search">Search ScreenWhy</label>
            <span className={styles.searchIcon} aria-hidden="true"><SearchIcon size={20} /></span>
            <input
              id="homepage-search"
              name="q"
              type="search"
              placeholder="Search endings, characters, mysteries, scenes…"
              autoComplete="off"
            />
            <button type="submit">Search</button>
          </form>
          <p className={styles.searchHint}>Try a title, character, ending, mystery or the question you still have.</p>
        </PageContainer>
      </section>

      {/* Reading-preview feature, deliberately outside CMS-published collections. */}
      <section className={`${styles.section} ${styles.trianglePreviewSection}`} aria-labelledby="triangle-reading-heading">
        <PageContainer>
          <article className={styles.trianglePreviewCard}>
            <div className={styles.trianglePreviewContent}>
              <p className={styles.trianglePreviewLabel}>First movie explanation · Reading preview · Full spoilers</p>
              <h2 id="triangle-reading-heading">Triangle (2009) Explained</h2>
              <p className={styles.trianglePreviewDescription}>
                Untangle the Aeolus time loop, the different versions of Jess, and the film’s mysterious ending.
                The complete article is available to read while its CMS fact-check and source review are in progress.
              </p>
              <Link className={styles.trianglePreviewLink} href="/explain/triangle-2009/">
                Read the full explanation <ArrowRightIcon size={17} />
              </Link>
            </div>
            <div className={styles.trianglePreviewAside} aria-hidden="true">
              <span>TRIANGLE</span>
              <strong>2009</strong>
              <small>Time loop / Ending explained</small>
            </div>
          </article>
        </PageContainer>
      </section>

      {model.featured.length ? (
        <section className={styles.section} aria-labelledby="featured-heading">
          <PageContainer>
            <SectionHeading
              id="featured-heading"
              eyebrow="Featured explanations"
              title="What viewers are trying to understand"
              description="Selected explanations that surface the kinds of questions ScreenWhy helps answer."
              action={{ label: "Browse explanations", href: explanationBrowseHref }}
            />
            <div className={styles.primaryGrid}>
              {model.featured.map((explanation) => (
                <ExplanationCard key={String(explanation.identity.logicalId)} explanation={explanation} variant="standard" />
              ))}
            </div>
          </PageContainer>
        </section>
      ) : null}

      {model.latestLead ? (
        <section className={`${styles.section} ${styles.subtleSection}`} aria-labelledby="latest-heading">
          <PageContainer>
            <SectionHeading
              id="latest-heading"
              eyebrow="Latest explained"
              title="Fresh answers after the credits"
              description="Newest published explanations first, based on editorial publication dates."
              action={{ label: "Browse latest", href: explanationBrowseHref }}
            />
            <div className={styles.latestGrid}>
              <ExplanationCard explanation={model.latestLead} variant="standard" showCanon />
              {model.latestRelated.length ? (
                <div className={styles.latestList}>
                  {model.latestRelated.map((explanation) => (
                    <ExplanationCard key={String(explanation.identity.logicalId)} explanation={explanation} variant="compact" />
                  ))}
                </div>
              ) : null}
            </div>
          </PageContainer>
        </section>
      ) : null}

      <section className={styles.section} aria-labelledby="discovery-heading">
        <PageContainer>
          <SectionHeading
            id="discovery-heading"
            eyebrow="Explore explanations"
            title="Start with the question you still have"
            description="Three useful paths into the same ScreenWhy editorial system—answers first, context when it matters."
          />
          <div className={styles.discoveryGrid}>
            {model.discoveryLanes.map((lane) => <DiscoveryLane key={lane.key} lane={lane} />)}
          </div>
        </PageContainer>
      </section>

      {model.viewerQuestions.length ? (
        <section className={`${styles.section} ${styles.subtleSection}`} aria-labelledby="questions-heading">
          <PageContainer>
            <SectionHeading
              id="questions-heading"
              eyebrow="Viewer questions"
              title="Short questions. Clear destinations."
              description="Question-led discovery points to an existing explanation when ScreenWhy already has the answer."
            />
            <div className={styles.questionsLayout}>
              <ul className={styles.questionList}>
                {model.viewerQuestions.map((item) => (
                  <ViewerQuestionRow key={`${String(item.explanation.identity.logicalId)}:${item.question}`} item={item} />
                ))}
              </ul>
              <aside className={styles.questionCta} aria-label="Ask the Screen search prompt">
                <p className={styles.questionCtaLabel}>Ask the Screen</p>
                <h3>Still looking for one specific answer?</h3>
                <p>Search naturally by title, character or question. If we already have an explanation, we’ll take you there.</p>
                <Link className={styles.questionCtaLink} href={searchHref}>Search your question</Link>
              </aside>
            </div>
          </PageContainer>
        </section>
      ) : null}

      <section className={styles.section} aria-labelledby="browse-heading">
        <PageContainer>
          <SectionHeading
            id="browse-heading"
            eyebrow="Browse by entertainment"
            title="Find explanations by what you watched"
            description="The same explanation-first editorial language across movies, TV, anime and K-drama."
          />
          <div className={styles.gatewayGrid}>
            {model.gateways.map((gateway) => <RouteGatewayCard key={gateway.routeFamily} gateway={gateway} />)}
          </div>
        </PageContainer>
      </section>

      {model.recentlyUpdated.length ? (
        <section className={`${styles.section} ${styles.subtleSection}`} aria-labelledby="updated-heading">
          <PageContainer>
            <SectionHeading
              id="updated-heading"
              eyebrow="Recently updated"
              title="Explanations we’ve clarified or refreshed"
              description="Ordered by the latest review date, with modification date used only when review data is unavailable."
            />
            <div className={styles.updatedGrid}>
              {model.recentlyUpdated.map((explanation) => (
                <ExplanationCard key={String(explanation.identity.logicalId)} explanation={explanation} variant="compact" showCanon />
              ))}
            </div>
          </PageContainer>
        </section>
      ) : null}

      <section className={styles.trust} aria-labelledby="trust-heading">
        <PageContainer className={styles.trustInner}>
          <div className={styles.trustIntro}>
            <h2 id="trust-heading">Answers first. Context when it matters.</h2>
            <p>{brandConfig.brandPromise} ScreenWhy is designed to keep story facts, interpretation and source context visibly distinct.</p>
          </div>
          <div className={styles.trustGrid}>
            <article><span>01 · Clarity</span><h3>Get to the answer early</h3><p>Question-led explanations prioritize the useful answer before deeper recap or context.</p></article>
            <article><span>02 · Canon</span><h3>Know what is confirmed</h3><p>Canon, adaptation differences and interpretation remain explicitly separated.</p></article>
            <article><span>03 · Spoilers</span><h3>Know before a reveal</h3><p>Spoiler scope is labeled deliberately so readers understand what may be revealed.</p></article>
          </div>
        </PageContainer>
      </section>
    </div>
  );
}
