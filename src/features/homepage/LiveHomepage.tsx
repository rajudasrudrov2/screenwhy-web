import Link from "next/link";
import { ArrowRightIcon, SearchIcon } from "@/components/icons/Icons";
import { PageContainer } from "@/components/layout/Layout";
import { brandConfig } from "@/config/brand";
import type { LiveExplanation, LiveList } from "@/lib/live-explanations";
import { homepageBrowseExplanationsHref, homepageGateways, homepageSearchHref } from "./homepage.config";
import { LiveHomepageCard } from "./LiveHomepageCard";
import { RouteGatewayCard } from "./RouteGatewayCard";
// Exact original approved homepage styles, 1440px and 390px breakpoints intact.
import styles from "./Homepage.module.css";

const SEARCH = homepageSearchHref("en-US");
const BROWSE = homepageBrowseExplanationsHref("en-US");

function Heading({ id, eyebrow, title, description, browse = false }: {
  readonly id: string; readonly eyebrow: string; readonly title: string;
  readonly description?: string; readonly browse?: boolean;
}) {
  return <div className={styles.sectionHeading}>
    <div className={styles.sectionHeadingCopy}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 id={id} className={styles.sectionTitle}>{title}</h2>
      {description ? <p className={styles.sectionDescription}>{description}</p> : null}
    </div>
    {browse ? <Link className={styles.sectionAction} href={BROWSE}>Browse explanations <ArrowRightIcon size={16} /></Link> : null}
  </div>;
}

function descending(a: LiveExplanation, b: LiveExplanation, field: "publishedAt" | "modifiedAt") {
  const date = (v: string) => { const n = Date.parse(v); return Number.isFinite(n) ? n : 0; };
  return date(b[field]) - date(a[field]);
}

export function LiveHomepage({ list }: { readonly list: LiveList }) {
  // The endpoint supplies published-only WordPress records. Do not categorize
  // articles by Title/Canon/Spoiler when optional fields were never provided.
  const all = [...list.items];
  const latest = [...all].sort((a, b) => descending(a, b, "publishedAt"));
  const updated = [...all].filter((a) => {
    const delta = Date.parse(a.modifiedAt) - Date.parse(a.publishedAt);
    return Number.isFinite(delta) && delta > 60000;
  }).sort((a, b) => descending(a, b, "modifiedAt"));
  const triangle = all.find((item) => item.id === 37 && /\btriangle\s*\(2009\)/i.test(item.headline));

  return <div className={styles.homepage}>
    <section className={styles.hero} aria-labelledby="homepage-title">
      <PageContainer className={styles.heroInner}>
        <p className={styles.heroEyebrow}>{brandConfig.tagline}</p>
        <h1 id="homepage-title">{brandConfig.recommendedHomepageH1}</h1>
        <p className={styles.heroCopy}>Clear answers to endings, characters, mysteries, scenes and story questions—without turning entertainment into a database.</p>
        <form className={styles.searchForm} action={SEARCH} method="get" role="search">
          <label className={styles.visuallyHidden} htmlFor="homepage-search">Search ScreenWhy</label>
          <span className={styles.searchIcon} aria-hidden="true"><SearchIcon size={20} /></span>
          <input id="homepage-search" name="q" type="search" placeholder="Search endings, characters, mysteries, scenes…" autoComplete="off" />
          <button type="submit">Search</button>
        </form>
        <p className={styles.searchHint}>Try a title, character, ending, mystery or the question you still have.</p>
      </PageContainer>
    </section>

    {triangle ? <section className={`${styles.section} ${styles.trianglePreviewSection}`} aria-labelledby="triangle-reading-heading">
      <PageContainer><article className={styles.trianglePreviewCard}>
        <div className={styles.trianglePreviewContent}>
          <p className={styles.trianglePreviewLabel}>Published movie explanation</p>
          <h2 id="triangle-reading-heading">{triangle.headline}</h2>
          <p className={styles.trianglePreviewDescription}>{triangle.excerpt || "Read the published explanation from ScreenWhy."}</p>
          <Link className={styles.trianglePreviewLink} href={triangle.publicPath}>Read the full explanation <ArrowRightIcon size={17} /></Link>
        </div>
        <div className={styles.trianglePreviewAside} aria-hidden="true"><span>TRIANGLE</span><strong>2009</strong><small>Published explanation</small></div>
      </article></PageContainer>
    </section> : null}

    {latest.length ? <section className={styles.section} aria-labelledby="featured-heading">
      <PageContainer>
        <Heading id="featured-heading" eyebrow="Featured explanations" title="What viewers are trying to understand" description="Published explanations from the ScreenWhy editorial CMS." browse />
        <div className={styles.primaryGrid}>{latest.slice(0, 3).map((item) => <LiveHomepageCard key={item.id} entry={item} />)}</div>
      </PageContainer>
    </section> : null}

    {latest.length ? <section className={`${styles.section} ${styles.subtleSection}`} aria-labelledby="latest-heading">
      <PageContainer>
        <Heading id="latest-heading" eyebrow="Latest explained" title="Fresh answers after the credits" description="Newest published explanations first, based on actual WordPress publication dates." browse />
        <div className={styles.latestGrid}>
          <LiveHomepageCard entry={latest[0]} />
          {latest.length > 1 ? <div className={styles.latestList}>{latest.slice(1, 4).map((item) => <LiveHomepageCard key={item.id} entry={item} variant="compact" />)}</div> : null}
        </div>
      </PageContainer>
    </section> : null}

    <section className={styles.section} aria-labelledby="discovery-heading">
      <PageContainer>
        <Heading id="discovery-heading" eyebrow="Explore explanations" title="Start with the question you still have" description="Explore endings, character motivations and story mysteries without requiring extra editorial metadata." />
        <div className={styles.discoveryGrid}>
          {[
            { title: "Ending Explained", description: "Understand the last scene, reveal or unresolved beat." },
            { title: "Characters & Mysteries", description: "Explore motivations, relationships and clues." },
            { title: "What Happens Next?", description: "Follow story questions, sequels and future plot developments." },
          ].map((lane) => <article className={styles.discoveryLane} key={lane.title}>
            <h3>{lane.title}</h3><p className={styles.laneDescription}>{lane.description}</p>
            <Link className={styles.laneBrowse} href={BROWSE}>Browse published explanations <ArrowRightIcon size={15} /></Link>
          </article>)}
        </div>
      </PageContainer>
    </section>

    {/* Viewer Questions intentionally omitted until the CMS supplies genuine question records. */}
    <section className={styles.section} aria-labelledby="browse-heading"><PageContainer>
      <Heading id="browse-heading" eyebrow="Browse by entertainment" title="Find explanations by what you watched" description="The same explanation-first approach across movies, TV, anime and K-drama." />
      <div className={styles.gatewayGrid}>{homepageGateways("en-US").map((gateway) => <RouteGatewayCard key={gateway.routeFamily} gateway={gateway} />)}</div>
    </PageContainer></section>

    {updated.length ? <section className={`${styles.section} ${styles.subtleSection}`} aria-labelledby="updated-heading"><PageContainer>
      <Heading id="updated-heading" eyebrow="Recently updated" title="Explanations we’ve clarified or refreshed" description="Records with genuine WordPress updates after initial publication." browse />
      <div className={styles.updatedGrid}>{updated.slice(0, 3).map((item) => <LiveHomepageCard key={item.id} entry={item} variant="compact" />)}</div>
    </PageContainer></section> : null}

    <section className={styles.trust} aria-labelledby="trust-heading"><PageContainer className={styles.trustInner}>
      <div className={styles.trustIntro}>
        <h2 id="trust-heading">Answers first. Context when it matters.</h2>
        <p>{brandConfig.brandPromise} ScreenWhy helps readers distinguish story facts, interpretation and source context when that information is available.</p>
      </div>
      <div className={styles.trustGrid}>
        <article><span>01 · Clarity</span><h3>Get to the answer early</h3><p>Question-led explanations prioritize the useful answer before deeper context.</p></article>
        <article><span>02 · Context</span><h3>Explore what you watched</h3><p>Find related explanations by browsing or searching for your movie or series.</p></article>
        <article><span>03 · Spoilers</span><h3>Read with awareness</h3><p>Explanations can discuss major plot developments and endings in depth.</p></article>
      </div>
    </PageContainer></section>
  </div>;
}
