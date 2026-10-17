import Link from "next/link";
import type { ReactNode } from "react";
import { SearchIcon, ArrowRightIcon } from "@/components/icons/Icons";
import { PageContainer } from "@/components/layout/Layout";
import { brandConfig } from "@/config/brand";
import { homepageGateways } from "@/features/homepage/homepage.config";
import { RouteGatewayCard } from "@/features/homepage/RouteGatewayCard";
import type { HomeExplanation, HomeMovie, HomeTheme, PremiumHomeModel } from "./types";
import styles from "./PremiumHomepage.module.css";

const catalog = "/movies/";
const browse = "/explanations/";
const demoLabel = "DEMO / PREVIEW";

function Eyebrow({ children, number }: { readonly children: ReactNode; readonly number?: string }) {
  return <span className={styles.eyebrow}>{number ? <span className={styles.eyebrowNumber}>{number}</span> : null}{children}</span>;
}
function SectionIntro({ number, eyebrow, heading, aside, href }: { readonly number: string; readonly eyebrow: string; readonly heading: string; readonly aside?: string; readonly href?: string }) {
  return <header className={styles.sectionIntro}>
    <div><Eyebrow number={number}>{eyebrow}</Eyebrow><h2>{heading}</h2>{aside ? <p>{aside}</p> : null}</div>
    {href ? <Link className={styles.sectionLink} href={href}>Explore all <ArrowRightIcon size={16}/></Link> : null}
  </header>;
}
function FilmArt({ movie, full = false }: { readonly movie: HomeMovie; readonly full?: boolean }) {
  return <div className={`${styles.filmArt} ${full ? styles.filmArtFull : ""}`} data-art={movie.art % 12} role="img" aria-label={`Original abstract artwork for ${movie.title}`}>
    <div className={styles.artOrbit} aria-hidden="true"/><div className={styles.artArc} aria-hidden="true"/><div className={styles.artGrain} aria-hidden="true"/>
    <span className={styles.filmArtEdition}>{movie.isDemo ? "FICTIONAL CONCEPT" : "SCREENWHY"}</span>
    <strong className={styles.filmArtTitle}>{movie.title}</strong>
    {movie.year ? <span className={styles.filmArtYear}>{movie.year}</span> : null}
  </div>;
}
function MovieTile({ movie, size = "normal" }: { readonly movie: HomeMovie; readonly size?: "normal" | "wide" }) {
  return <article className={`${styles.movieTile} ${size === "wide" ? styles.movieTileWide : ""}`}>
    <div className={styles.movieImage}><FilmArt movie={movie}/></div>
    <div className={styles.movieInfo}>
      <span className={styles.movieGenre}>{movie.genre ?? "Movie"}{movie.isDemo ? " · DEMO / PREVIEW" : ""}</span>
      <h3>{movie.title}</h3>
      <p className={styles.movieDetails}>{[movie.year, movie.duration, movie.mood].filter(Boolean).join("  ·  ")}</p>
      {movie.synopsis ? <p className={styles.movieSynopsis}>{movie.synopsis}</p> : null}
      {movie.href ? <Link className={styles.movieLink} href={movie.href}>Explore movie <ArrowRightIcon size={14}/></Link> : <span className={styles.conceptNote}>Concept card — no live movie page</span>}
    </div>
  </article>;
}
function ExplanationTile({ item, index, small = false }: { readonly item: HomeExplanation; readonly index: number; readonly small?: boolean }) {
  return <article className={`${styles.explanationTile} ${small ? styles.explanationTileSmall : ""}`}>
    <div className={styles.explanationTop}><span>{String(index + 1).padStart(2, "0")}</span><span>{item.isDemo ? demoLabel : "PUBLISHED EXPLANATION"}</span></div>
    <div className={styles.explanationContent}>
      <p className={styles.explanationCategory}>{item.type ?? "ScreenWhy explanation"}</p>
      <h3>{item.href ? <Link href={item.href}>{item.headline}</Link> : item.headline}</h3>
      <p>{item.excerpt}</p>
    </div>
    {item.href ? <Link className={styles.explanationAction} href={item.href}>Read the explanation <ArrowRightIcon size={15}/></Link> : <span className={styles.conceptNote}>Preview only · no published article</span>}
  </article>;
}
function ThemeTile({ theme }: { readonly theme: HomeTheme }) {
  return <article className={styles.themeTile}>
    <span>{theme.kind.toUpperCase()} · {demoLabel}</span><h3>{theme.label}</h3><p>{theme.description}</p>
  </article>;
}

export function PremiumHomepage({ model }: { readonly model: PremiumHomeModel }) {
  const demo = model.mode === "screenwhy3_demo";
  const spotlightMovie = model.movies[0];
  const spotlightArticle = model.explanations[0];
  const recent = [...model.explanations].filter(item => {
    if (!item.publishedAt || !item.modifiedAt) return false;
    const modified = Date.parse(item.modifiedAt.replace(" ", "T"));
    const published = Date.parse(item.publishedAt.replace(" ", "T"));
    return Number.isFinite(modified) && Number.isFinite(published) && modified - published > 60000;
  }).sort((a,b) => Date.parse(b.modifiedAt ?? "") - Date.parse(a.modifiedAt ?? ""));
  const leading = model.explanations.slice(0, 3);
  const endingConcepts = model.explanations.filter(x => x.type?.toLowerCase().includes("ending") || x.type?.toLowerCase().includes("final"));

  return <div className={styles.root} data-home-mode={demo ? "preview-demo" : "live"}>
    <section className={styles.hero} aria-labelledby="screenwhy3-hero-title">
      <div className={styles.heroAtmosphere} aria-hidden="true"/>
      <PageContainer className={styles.heroGrid}>
        <div className={styles.heroCopy}>
          <Eyebrow number="001">THE SCREENING ROOM · {demo ? demoLabel : "EDITORIAL EDITION"}</Eyebrow>
          <h1 id="screenwhy3-hero-title">Every story leaves <em>a question.</em></h1>
          <p className={styles.heroSubtitle}>We go looking for the answer.</p>
          <p className={styles.heroDescription}>{brandConfig.brandPromise} Discover films, unravel endings and find the details worth watching twice.</p>
          <form className={styles.heroSearch} action="/search/" method="get" role="search">
            <label htmlFor="sw3-movie-search" className={styles.srOnly}>Search published explanations</label>
            <SearchIcon size={19}/><input id="sw3-movie-search" type="search" name="q" placeholder="Search movies, endings, questions…" maxLength={160}/>
            <button type="submit">Search <ArrowRightIcon size={16}/></button>
          </form>
          <div className={styles.heroButtons}><Link className={styles.actionAmber} href={browse}>Explore explanations <ArrowRightIcon size={16}/></Link><Link className={styles.actionOutline} href={catalog}>Browse movies</Link></div>
          <p className={styles.heroFineprint}>{demo ? "Fictional creative concepts, visible only in the owner preview." : `Published explanations from the ScreenWhy CMS${typeof model.publishedCount === "number" ? ` · ${model.publishedCount} available` : ""}.`}</p>
        </div>
        <div className={styles.heroStage}>
          <div className={styles.heroHalo} aria-hidden="true"/>
          <div className={styles.stageFrame}>
            {spotlightMovie ? <FilmArt movie={spotlightMovie} full/> : <div className={styles.emptyFilm} aria-label="Cinematic illustration without fictional film data"><span>SCREENWHY</span><strong>WATCH.<br/>WONDER.<br/>UNDERSTAND.</strong><small>The why behind what you watch</small></div>}
          </div>
          <span className={styles.stageTag}>{demo ? demoLabel : "THE SCREENWHY SCREENING ROOM"}</span>
          <span className={styles.stageIndex} aria-hidden="true">SW / 03</span>
        </div>
      </PageContainer>
    </section>

    <div className={styles.ticker} aria-label="ScreenWhy discovery topics"><div><span>ENDINGS EXPLAINED</span><i/> <span>HIDDEN CLUES</span><i/> <span>CHARACTERS</span><i/><span>STORY WORLDS</span><i/><span>THE FINAL SCENE</span><i/><span>QUESTIONS ANSWERED</span></div></div>

    <section className={`${styles.section} ${styles.paperSection}`} aria-labelledby="featured-movie-heading">
      <PageContainer>
        <SectionIntro number="01" eyebrow={demo ? `FEATURED MOVIE · ${demoLabel}` : "EDITORIAL SPOTLIGHT"} heading="A closer look, frame by frame." aside="A place for stories that invite another viewing." href={browse}/>
        {spotlightMovie ? <div className={styles.spotlight}>
          <div className={styles.spotlightVisual}><FilmArt movie={spotlightMovie} full/></div>
          <div className={styles.spotlightText}><Eyebrow>ON THE SCREEN</Eyebrow><h3 id="featured-movie-heading">{spotlightMovie.title}</h3><p>{spotlightMovie.synopsis}</p><div className={styles.spotlightMeta}>{[spotlightMovie.year,spotlightMovie.genre,spotlightMovie.duration].filter(Boolean).join(" / ")}</div><span className={styles.conceptNote}>{demoLabel} — fictional movie concept, not a published listing</span></div>
        </div> : spotlightArticle ? <div className={styles.liveSpotlight}><Eyebrow>WORDPRESS PUBLISHED</Eyebrow><h3 id="featured-movie-heading">{spotlightArticle.headline}</h3><p>{spotlightArticle.excerpt}</p><Link className={styles.actionAmber} href={spotlightArticle.href!}>Read published explanation <ArrowRightIcon size={16}/></Link></div>
        : <div className={styles.liveSpotlight}><h3 id="featured-movie-heading">The reel is ready.</h3><p>No published explanations yet. Once your first article is published in WordPress, it will appear here automatically.</p></div>}
      </PageContainer>
    </section>

    <section className={styles.section} aria-labelledby="trending-heading"><PageContainer>
      <SectionIntro number="02" eyebrow={demo ? `FICTIONAL EDITORIAL PICKS · ${demoLabel}` : "LATEST FROM THE CMS"} heading="Stories worth a second look." aside={demo ? "A concept showcase for the future movie library, not a popularity ranking." : "Recently published explanations — no invented trending scores."} href={browse}/>
      {demo ? <div className={styles.movieGrid}>{model.movies.slice(1,7).map(m=><MovieTile key={m.id} movie={m}/>)}</div> : leading.length ? <div className={styles.explanationGrid}>{leading.map((ex,i)=><ExplanationTile key={ex.id} item={ex} index={i}/>)}</div> : <p className={styles.sectionEmpty}>No published explanation cards yet. Saved Drafts remain private.</p>}
    </PageContainer></section>

    <section className={`${styles.section} ${styles.paperSection}`} aria-labelledby="latest-explanation-heading"><PageContainer>
      <SectionIntro number="03" eyebrow={`LATEST EXPLAINED${demo ? ` · ${demoLabel}` : ""}`} heading="After the credits, the answers." aside={demo ? "Fictional article teasers for layout testing only." : "Real published WordPress articles, ordered by publication date."} href={browse}/>
      {model.explanations.length ? <div className={styles.latestComposition}><ExplanationTile item={model.explanations[0]} index={0}/><div className={styles.latestAside}>{model.explanations.slice(1,5).map((ex,i)=><ExplanationTile key={ex.id} item={ex} index={i+1} small/>)}</div></div> : <p className={styles.sectionEmpty}>The latest published stories will appear here after you publish in WordPress.</p>}
    </PageContainer></section>

    <section className={styles.section} aria-labelledby="ending-heading"><PageContainer>
      <SectionIntro number="04" eyebrow={`ENDING EXPLAINED${demo ? ` · ${demoLabel}` : ""}`} heading="The final scene is only the beginning." aside={demo ? "Concept previews, not available as published articles." : "Find actual endings and explanations through the public search."} href={browse}/>
      {demo && endingConcepts.length ? <div className={styles.horizontalReel}>{endingConcepts.slice(0,6).map((ex,i)=><ExplanationTile key={ex.id} item={ex} index={i} small/>)}</div> : <div className={styles.editorialLane}><span className={styles.editorialSigil}>?</span><p>Looking for an ending? Search the exact movie or the question it left you with.</p><Link href="/search/" className={styles.sectionLink}>Search explanations <ArrowRightIcon size={15}/></Link></div>}
    </PageContainer></section>

    <section className={`${styles.section} ${styles.paperSection}`} aria-labelledby="browse-heading"><PageContainer>
      <SectionIntro number="05" eyebrow="BROWSE BY ENTERTAINMENT" heading="What did you watch?" aside="Follow an existing ScreenWhy destination. The Movies directory will expand with published CMS content."/>
      <div className={styles.gatewayGrid}>{homepageGateways("en-US").map(g=><RouteGatewayCard key={g.routeFamily} gateway={g}/>)}</div>
    </PageContainer></section>

    {demo ? <>
      <section className={styles.section} aria-labelledby="themes-heading"><PageContainer><SectionIntro number="06" eyebrow={`GENRES & THEMES · ${demoLabel}`} heading="Choose the feeling. Follow the story." aside="Twelve fictional discovery labels for design review; these are not live filters."/><div className={styles.themeGrid}>{model.themes.map(theme=><ThemeTile theme={theme} key={theme.id}/>)}</div></PageContainer></section>
      <section className={`${styles.section} ${styles.paperSection}`} aria-labelledby="collections-heading"><PageContainer><SectionIntro number="07" eyebrow={`CURATED COLLECTIONS · ${demoLabel}`} heading="Made for the next movie night." aside="Eight fictional editorial shelves showing future collection designs."/><div className={styles.collectionGrid}>{model.collections.map((coll,i)=><article className={styles.collectionCard} data-art={i%12} key={coll.id}><span>COLLECTION {String(i+1).padStart(2,"0")} · {demoLabel}</span><h3>{coll.title}</h3><p>{coll.note}</p><small>{coll.movieIds.length} fictional movie concepts</small></article>)}</div></PageContainer></section>
      <section className={styles.section} aria-labelledby="all-movies-heading"><PageContainer><SectionIntro number="08" eyebrow={`THE MOVIE LIBRARY · ${demoLabel}`} heading="More stories beyond the spotlight." aside="A complete 48-film concept pack. These cards intentionally have no live URLs." href={catalog}/><div className={styles.movieGrid}>{model.movies.slice(7).map(m=><MovieTile key={m.id} movie={m}/>)}</div></PageContainer></section>
      <section className={`${styles.section} ${styles.paperSection}`} aria-labelledby="demo-explanation-archive"><PageContainer>
        <SectionIntro number="09" eyebrow={`MORE QUESTIONS · ${demoLabel}`} heading="A world of stories to explain." aside="Additional fictional concept previews. No item links to a nonexistent published article."/>
        <div className={styles.explanationGrid}>{model.explanations.slice(5).map((ex,i)=><ExplanationTile key={ex.id} item={ex} index={i+5}/>)}</div>
      </PageContainer></section>
    </> : <section className={styles.section} aria-labelledby="movie-directory-heading"><PageContainer><SectionIntro number="06" eyebrow="BROWSE MOVIES" heading="Find the next story to explore." aside="Movie discovery is being connected to the published catalogue. No fictional films are displayed here." href={catalog}/><div className={styles.editorialLane}><span className={styles.editorialSigil}>✦</span><p>Looking for a movie? Explore the current movies area and return here for new additions.</p><Link className={styles.sectionLink} href={catalog}>Browse movies <ArrowRightIcon size={15}/></Link></div></PageContainer></section>}

    <section className={`${styles.section} ${styles.paperSection}`} aria-labelledby="updated-heading"><PageContainer>
      <SectionIntro number={demo ? "09" : "07"} eyebrow={`RECENTLY UPDATED${demo ? ` · ${demoLabel}` : ""}`} heading="New details. A fresh perspective." aside={demo ? "More concept articles to stress-test the editorial layout." : "Shown only for articles genuinely updated after publication."}/>
      {demo ? <div className={styles.explanationGrid}>{model.explanations.slice(8,14).map((ex,i)=><ExplanationTile key={ex.id} item={ex} index={i+8}/>)}</div> : recent.length ? <div className={styles.explanationGrid}>{recent.slice(0,6).map((ex,i)=><ExplanationTile key={ex.id} item={ex} index={i}/>)}</div> : <p className={styles.sectionEmpty}>No published explanations have been updated yet.</p>}
    </PageContainer></section>

    <section className={styles.closing} aria-labelledby="sw3-closing-heading"><PageContainer className={styles.closingInner}><div><Eyebrow>OUR APPROACH</Eyebrow><h2 id="sw3-closing-heading">Watch. Wonder. <em>Understand.</em></h2></div><div><p>Because the best stories don't end when the screen goes dark. We connect the clues, the characters and the questions that stay with you.</p><Link href={browse} className={styles.actionAmber}>Explore ScreenWhy <ArrowRightIcon size={16}/></Link></div></PageContainer></section>
  </div>;
}
