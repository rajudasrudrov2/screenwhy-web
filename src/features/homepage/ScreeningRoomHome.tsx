import Link from "next/link";
import { ArrowRightIcon, SearchIcon } from "@/components/icons/Icons";
import { PageContainer } from "@/components/layout/Layout";
import { brandConfig } from "@/config/brand";
import type { LiveExplanation, LiveList } from "@/lib/live-explanations";
import { homepageBrowseExplanationsHref, homepageGateways, homepageSearchHref } from "./homepage.config";
import { LiveHomepageCard } from "./LiveHomepageCard";
import { RouteGatewayCard } from "./RouteGatewayCard";
import styles from "./ScreeningRoomHome.module.css";

const SEARCH = homepageSearchHref("en-US");
const BROWSE = homepageBrowseExplanationsHref("en-US");

const H1 = brandConfig.recommendedHomepageH1;
const H1_ACCENT = "Answers.";
const h1Prefix = H1.endsWith(H1_ACCENT) ? H1.slice(0, -H1_ACCENT.length) : H1;
const h1Accent = H1.endsWith(H1_ACCENT) ? H1_ACCENT : "";

const LANES = [
  { key: "ending", num: "Lane 01", accent: "amber", title: "Ending explained", copy: "Understand the last scene, the reveal or the beat that stayed with you after the credits." },
  { key: "characters", num: "Lane 02", accent: "indigo", title: "Characters & mysteries", copy: "Explore motivations, relationships and the clues you might have missed." },
  { key: "next", num: "Lane 03", accent: "teal", title: "What happens next", copy: "Follow story questions, sequels and the plot threads still left open." },
] as const;

function descending(a: LiveExplanation, b: LiveExplanation, field: "publishedAt" | "modifiedAt") {
  const date = (v: string) => { const n = Date.parse(v); return Number.isFinite(n) ? n : 0; };
  return date(b[field]) - date(a[field]);
}

function formatDate(value: string): string {
  const parsed = new Date(value.replace(" ", "T") + "Z");
  return Number.isFinite(parsed.getTime())
    ? parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "";
}

function ReelCell({ entry, index }: { readonly entry: LiveExplanation; readonly index: number }) {
  return (
    <article className={styles.reelCell}>
      <span className={styles.cellNum} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      <div className={styles.cellMeta}>
        <span>{formatDate(entry.publishedAt)}</span>
        <span className={styles.cellKind}>Published</span>
      </div>
      <h3 className={styles.cellTitle}>
        <Link href={entry.publicPath}>{entry.headline}</Link>
      </h3>
      <p className={styles.cellExcerpt}>{entry.excerpt}</p>
      <Link className={styles.cellGo} href={entry.publicPath}>
        Read explanation <ArrowRightIcon size={14} />
      </Link>
    </article>
  );
}

export function ScreeningRoomHome({ list }: { readonly list: LiveList }) {
  // The endpoint supplies published-only WordPress records. Do not categorize
  // articles by Title/Canon/Spoiler when optional fields were never provided.
  const all = [...list.items];
  const latest = [...all].sort((a, b) => descending(a, b, "publishedAt"));
  const updated = [...all].filter((a) => {
    const delta = Date.parse(a.modifiedAt) - Date.parse(a.publishedAt);
    return Number.isFinite(delta) && delta > 60000;
  }).sort((a, b) => descending(a, b, "modifiedAt"));
  const triangle = all.find((item) => item.id === 37 && /\btriangle\s*\(2009\)/i.test(item.headline));
  const tickerItems = all.map((item) => item.headline.split(":")[0]);

  return (
    <div className={styles.homepage}>
      <div className={styles.atmosphere} aria-hidden="true" />

      <section className={styles.hero} aria-labelledby="homepage-title">
        <PageContainer className={styles.heroInner}>
          <p className={styles.heroEyebrow}>
            <span className={styles.pulseDot} aria-hidden="true" />
            {brandConfig.tagline}
          </p>
          <h1 id="homepage-title" className={styles.heroTitle}>
            {h1Prefix}{h1Accent ? <em className={styles.heroAccent}>{h1Accent}</em> : null}
          </h1>
          <p className={styles.heroCopy}>
            {brandConfig.brandPromise} Clear answers to endings, characters, mysteries, scenes and story questions—without turning entertainment into a database.
          </p>
          <form className={styles.searchForm} action={SEARCH} method="get" role="search">
            <label className={styles.srOnly} htmlFor="homepage-search">Search ScreenWhy</label>
            <span className={styles.searchIcon} aria-hidden="true"><SearchIcon size={20} /></span>
            <input id="homepage-search" name="q" type="search" placeholder="Search endings, characters, mysteries, scenes…" autoComplete="off" />
            <button type="submit">Search</button>
          </form>
          <p className={styles.searchHint}>Try a title, character, ending, mystery or the question you still have.</p>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{list.total}</span>
              <span className={styles.statLabel}>Published explanations</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>Live</span>
              <span className={styles.statLabel}>From the editorial CMS</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>Post-watch</span>
              <span className={styles.statLabel}>Answers when you finish</span>
            </div>
          </div>
        </PageContainer>
      </section>

      <div className={styles.ticker} aria-hidden="true">
        <div className={styles.tickerTrack}>
          {[...tickerItems, ...tickerItems].map((text, i) => (
            <span className={styles.tickerItem} key={`${text}-${i}`}>
              <i className={styles.tickerDot} />
              {text}
            </span>
          ))}
        </div>
      </div>

      {triangle ? (
        <section className={styles.section} aria-labelledby="triangle-reading-heading">
          <PageContainer>
            <div className={styles.sectionHead}>
              <div>
                <p className={styles.headKick}>Featured this week</p>
                <h2 className={styles.headTitle}>The loop, <em className={styles.headAccent}>explained</em></h2>
              </div>
              <Link className={styles.sectionAction} href={triangle.publicPath}>Open the full breakdown <ArrowRightIcon size={16} /></Link>
            </div>
            <article className={styles.feature}>
              <div className={styles.featureCopy}>
                <p className={styles.featureKicker}>
                  <span className={styles.pulseDot} aria-hidden="true" />
                  Published movie explanation
                </p>
                <h3 id="triangle-reading-heading" className={styles.featureTitle}>{triangle.headline}</h3>
                <p className={styles.featureExcerpt}>{triangle.excerpt || "Read the published explanation from ScreenWhy."}</p>
                <Link className={styles.featureCta} href={triangle.publicPath}>
                  Read the full explanation <ArrowRightIcon size={17} />
                </Link>
              </div>
              <div className={styles.featureArt}>
                <div className={styles.poster}>
                  <span className={styles.posterYear}>2009</span>
                  <span className={styles.posterTitle}>TRIANGLE</span>
                  <span className={styles.posterSlot}>Screening room · reel 01</span>
                  <span className={styles.sprockets}>
                    {Array.from({ length: 8 }, (_, i) => <i className={styles.sprocket} key={i} />)}
                  </span>
                </div>
              </div>
            </article>
          </PageContainer>
        </section>
      ) : null}

      {latest.length ? (
        <section className={`${styles.section} ${styles.sectionPaper}`} aria-labelledby="featured-heading">
          <PageContainer>
            <div className={styles.sectionHead}>
              <div>
                <p className={styles.headKick}>Most asked</p>
                <h2 className={styles.headTitle}>What viewers are trying to <em className={styles.headAccent}>understand</em></h2>
              </div>
              <Link className={styles.sectionAction} href={BROWSE}>Browse explanations <ArrowRightIcon size={16} /></Link>
            </div>
            <div className={styles.primaryGrid}>
              {latest.slice(0, 3).map((item) => <LiveHomepageCard key={item.id} entry={item} />)}
            </div>
          </PageContainer>
        </section>
      ) : null}

      {latest.length ? (
        <section className={styles.section} aria-labelledby="latest-heading">
          <PageContainer>
            <div className={styles.sectionHead}>
              <div>
                <p className={styles.headKick}>On the strip</p>
                <h2 className={styles.headTitle}>Fresh after the <em className={styles.headAccent}>credits</em></h2>
                <p className={styles.headSub}>Newest published explanations first, based on actual WordPress publication dates.</p>
              </div>
              <Link className={styles.sectionAction} href={BROWSE}>Browse explanations <ArrowRightIcon size={16} /></Link>
            </div>
            <div className={styles.stripWrap}>
              <div className={styles.latestGrid}>
                {latest.slice(0, 6).map((item, i) => <ReelCell key={item.id} entry={item} index={i} />)}
              </div>
            </div>
          </PageContainer>
        </section>
      ) : null}

      <section className={styles.section} aria-labelledby="discovery-heading">
        <PageContainer>
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.headKick}>Start with the question</p>
              <h2 className={styles.headTitle}>Explore <em className={styles.headAccent}>explanations</em></h2>
              <p className={styles.headSub}>Explore endings, character motivations and story mysteries without requiring extra editorial metadata.</p>
            </div>
          </div>
          <div className={styles.discoveryGrid}>
            {LANES.map((lane) => (
              <article className={styles.lane} key={lane.key}>
                <span className={styles.laneNum}>{lane.num}</span>
                <h3 className={styles.laneTitle}>{lane.title}</h3>
                <p className={styles.laneCopy}>{lane.copy}</p>
                <Link className={styles.laneGo} href={BROWSE}>
                  Browse published explanations <ArrowRightIcon size={14} />
                </Link>
                <span className={styles.laneRail} data-accent={lane.accent} aria-hidden="true" />
              </article>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* Viewer Questions intentionally omitted until the CMS supplies genuine question records. */}
      <section className={styles.section} aria-labelledby="browse-heading">
        <PageContainer>
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.headKick}>Browse by entertainment</p>
              <h2 className={styles.headTitle}>Find explanations by what you <em className={styles.headAccent}>watched</em></h2>
            </div>
          </div>
          <div className={styles.gatewayGrid}>
            {homepageGateways("en-US").map((gateway) => <RouteGatewayCard key={gateway.routeFamily} gateway={gateway} />)}
          </div>
        </PageContainer>
      </section>

      {updated.length ? (
        <section className={styles.section} aria-labelledby="updated-heading">
          <PageContainer>
            <div className={styles.sectionHead}>
              <div>
                <p className={styles.headKick}>Refreshed</p>
                <h2 className={styles.headTitle}>Clarified or <em className={styles.headAccent}>updated</em></h2>
                <p className={styles.headSub}>Records with genuine WordPress updates after initial publication.</p>
              </div>
              <Link className={styles.sectionAction} href={BROWSE}>Browse explanations <ArrowRightIcon size={16} /></Link>
            </div>
            <div className={styles.stripWrap}>
              <div className={styles.updatedGrid}>
                {updated.slice(0, 4).map((item, i) => <ReelCell key={item.id} entry={item} index={i} />)}
              </div>
            </div>
          </PageContainer>
        </section>
      ) : null}

      <section className={styles.trust} aria-labelledby="trust-heading">
        <PageContainer className={styles.trustInner}>
          <div className={styles.trustIntro}>
            <h2 id="trust-heading" className={styles.trustTitle}>Answers first. <em className={styles.trustAccent}>Context</em> when it matters.</h2>
            <p className={styles.trustPromise}>{brandConfig.brandPromise} ScreenWhy helps readers distinguish story facts, interpretation and source context when that information is available.</p>
          </div>
          <div className={styles.trustGrid}>
            <article className={styles.trustItem}>
              <span className={styles.trustIndex}>01 · Clarity</span>
              <h3>Get to the answer early</h3>
              <p>Question-led explanations prioritize the useful answer before deeper context.</p>
            </article>
            <article className={styles.trustItem}>
              <span className={styles.trustIndex}>02 · Context</span>
              <h3>Explore what you watched</h3>
              <p>Find related explanations by browsing or searching for your movie or series.</p>
            </article>
            <article className={styles.trustItem}>
              <span className={styles.trustIndex}>03 · Spoilers</span>
              <h3>Read with awareness</h3>
              <p>Explanations can discuss major plot developments and endings in depth.</p>
            </article>
          </div>
        </PageContainer>
      </section>
    </div>
  );
}
