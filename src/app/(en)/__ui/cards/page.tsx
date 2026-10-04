import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CharacterCard, ExplanationCard, TitleCard } from "@/components/domain/cards";
import { PageContainer, Stack } from "@/components/layout/Layout";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { SiteFrame } from "@/components/navigation/SiteFrame";
import { createRepositories } from "@/data";
import type { CharacterSummary } from "@/types/domain/character";
import type { ExplanationSummary } from "@/types/domain/explanation";
import type { TitleSummary } from "@/types/domain/title";
import { previewBanglaCharacter, previewPortrait, previewPoster } from "./preview-data";
import styles from "./cards-preview.module.css";

export const metadata: Metadata = { title: "Card UI Preview", robots: { index: false, follow: false, nocache: true } };

function requireItem<T>(items: readonly T[], index = 0): T {
  const item = items[index];
  if (!item) throw new Error("Required development preview item is unavailable.");
  return item;
}

export default async function CardsPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const repositories = createRepositories({ dataSource: "mock", runtimeEnvironment: "development" });
  const [titlesEn, titlesBn, explanationsEn, explanationsBn, charactersEn] = await Promise.all([
    repositories.titles.list({ locale: "en-US", page: 1, pageSize: 20 }),
    repositories.titles.list({ locale: "bn-BD", page: 1, pageSize: 20 }),
    repositories.explanations.list({ locale: "en-US", page: 1, pageSize: 20 }),
    repositories.explanations.list({ locale: "bn-BD", page: 1, pageSize: 20 }),
    repositories.characters.list({ locale: "en-US", page: 1, pageSize: 20 }),
  ]);

  const movie = requireItem(titlesEn.items.filter((item) => item.publicRouteFamily === "movies"));
  const anime = requireItem(titlesEn.items.filter((item) => item.publicRouteFamily === "anime"));
  const banglaTitle = requireItem(titlesBn.items);
  const explanation = requireItem(explanationsEn.items);
  const majorExplanation = requireItem(explanationsEn.items.filter((item) => item.spoiler.screen.level === "major"));
  const canonExplanation = requireItem(explanationsEn.items.filter((item) => item.canon.classification === "adaptation_difference"));
  const banglaExplanation = requireItem(explanationsBn.items);
  const character = requireItem(charactersEn.items);

  const movieWithMedia: TitleSummary = { ...movie, poster: previewPoster(movie.displayTitle) };
  const animeWithMedia: TitleSummary = { ...anime, poster: previewPoster(anime.displayTitle, "#177E75") };
  const longTitle: TitleSummary = { ...movieWithMedia, displayTitle: "The Last Signal and the Deliberately Long Observatory Transmission Mystery" };
  const bnWithMedia: TitleSummary<"bn-BD"> = { ...banglaTitle, poster: previewPoster(banglaTitle.displayTitle, "#F0B44D") };
  const longExplanation: ExplanationSummary = { ...explanation, articleTitle: "Why the Last Signal Keeps Returning Even After Every Known Transmitter Has Gone Silent" };
  const characterWithMedia: CharacterSummary = { ...character, portrait: previewPortrait(character.displayName) };
  const longCharacter: CharacterSummary = { ...characterWithMedia, displayName: "Mara Vale of the North Coast Signal Observatory" };

  return (
    <SiteFrame locale="en-US" activePath="/__ui/">
      <div className={styles.preview}>
        <PageContainer>
          <header className={styles.hero}>
            <Stack gap="var(--pe-space-4)">
              <p className={styles.eyebrow}>Development only · noindex · production returns 404</p>
              <h1>Discovery cards · PE-FE-02B</h1>
              <p className="pe-lead">Reusable Title, Explanation and Character presentation components. This is a QA board, not a public archive or Homepage.</p>
              <Breadcrumbs items={[{ label: "UI foundation", href: "/__ui/" }, { label: "Card preview" }]} />
            </Stack>
          </header>

          <section className={styles.board} aria-labelledby="title-cards">
            <div className={styles.sectionHeading}><span>01</span><div><h2 id="title-cards">Title Cards</h2><p>Poster-led discovery with restrained route/type context and explanation signal.</p></div></div>
            <div className={styles.cardGrid}>
              <TitleCard title={movieWithMedia} explanationSignal="2 explanations available" />
              <TitleCard title={animeWithMedia} explanationSignal="Anime route · fundamental type remains TV Series" />
              <TitleCard title={{ ...movie, poster: undefined }} explanationSignal="Intentional missing-media state" />
              <TitleCard title={longTitle} explanationSignal="Long-title wrapping check" />
            </div>
            <div className={styles.compactGrid}>
              <TitleCard title={movieWithMedia} variant="compact" explanationSignal="Related title" />
              <TitleCard title={bnWithMedia} variant="compact" explanationSignal="বাংলা ব্যাখ্যা উপলভ্য" />
            </div>
          </section>

          <section className={styles.board} aria-labelledby="explanation-cards">
            <div className={styles.sectionHeading}><span>02</span><div><h2 id="explanation-cards">Explanation Cards</h2><p>The question/headline stays dominant; Spoiler and Canon reuse PE-FE-02A.</p></div></div>
            <div className={styles.cardGridThree}>
              <ExplanationCard explanation={explanation} />
              <ExplanationCard explanation={majorExplanation} />
              <ExplanationCard explanation={canonExplanation} showCanon />
              <ExplanationCard explanation={longExplanation} />
              <ExplanationCard explanation={banglaExplanation} />
            </div>
            <div className={styles.compactGrid}>
              <ExplanationCard explanation={majorExplanation} variant="compact" />
              <ExplanationCard explanation={canonExplanation} variant="compact" showCanon />
            </div>
          </section>

          <section className={styles.board} aria-labelledby="character-cards">
            <div className={styles.sectionHeading}><span>03</span><div><h2 id="character-cards">Character Cards</h2><p>Character-first, spoiler-safe discovery. Contextual alive/dead status is intentionally absent.</p></div></div>
            <div className={styles.cardGridThree}>
              <CharacterCard character={characterWithMedia} discoverySignal="2 related explanations" />
              <CharacterCard character={{ ...character, portrait: undefined }} discoverySignal="Missing portrait" />
              <CharacterCard character={longCharacter} discoverySignal="Long-name wrapping check" />
              <CharacterCard character={previewBanglaCharacter} discoverySignal="স্পয়লার-মুক্ত চরিত্র পরিচিতি" />
            </div>
            <div className={styles.compactGrid}>
              <CharacterCard character={characterWithMedia} variant="compact" discoverySignal="Related character" />
              <CharacterCard character={previewBanglaCharacter} variant="compact" discoverySignal="বাংলা চরিত্র" />
            </div>
          </section>
        </PageContainer>
      </div>
    </SiteFrame>
  );
}
