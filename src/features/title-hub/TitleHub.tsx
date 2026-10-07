import Link from "next/link";
import { CanonContext } from "@/components/domain/canon/CanonContext";
import { CharacterCard } from "@/components/domain/cards/CharacterCard";
import { ExplanationCard } from "@/components/domain/cards/ExplanationCard";
import { TitleCard } from "@/components/domain/cards/TitleCard";
import { CardMedia } from "@/components/domain/cards/CardMedia";
import { QuickAnswer } from "@/components/domain/quick-answer/QuickAnswer";
import { SpoilerDisclosure, SpoilerMarker } from "@/components/domain/spoiler/SpoilerContext";
import { ArrowRightIcon, InfoIcon, SearchIcon } from "@/components/icons/Icons";
import { PageContainer } from "@/components/layout/Layout";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { routeFamilyLabel, titleTypeLabel } from "@/components/domain/cards/card-labels";
import { explanationRoute, localizedRoute, relationshipRoute, searchRoute, timelineRoute, titleHubRoute } from "@/config/routes";
import type { CharacterRelationship, RelationshipState, RelationshipType } from "@/types/domain/relationship";
import type { TimelineEvent } from "@/types/domain/timeline";
import type { TitleDetail } from "@/types/domain/title";
import type { TitleHubViewModel } from "@/features/title-hub/title-hub.types";
import styles from "./TitleHub.module.css";

const RELATIONSHIP_LABELS: Record<RelationshipType, string> = {
  romantic: "Romantic",
  sibling: "Siblings",
  parent_child: "Parent / Child",
  family: "Family",
  friend: "Friends",
  enemy: "Enemies",
  ally: "Allies",
  mentor: "Mentor",
  colleague: "Colleagues",
  former_relationship: "Former relationship",
  unknown_complex: "Complex relationship",
};

function newestRelationshipState(relationship: CharacterRelationship): RelationshipState | undefined {
  return [...relationship.states].sort((left, right) => right.sequence - left.sequence)[0];
}

function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (hours === 0) return `${minutes} min`;
  return remainder === 0 ? `${hours} hr` : `${hours} hr ${remainder} min`;
}

function titleFacts(title: TitleDetail): readonly { readonly label: string; readonly value: string }[] {
  const facts: { label: string; value: string }[] = [];
  if (title.directors?.length) facts.push({ label: title.directors.length > 1 ? "Directors" : "Director", value: title.directors.map((item) => item.name).join(", ") });
  if (title.creators?.length) facts.push({ label: title.creators.length > 1 ? "Creators" : "Creator", value: title.creators.map((item) => item.name).join(", ") });
  if (title.release.releaseYear) facts.push({ label: "Release", value: String(title.release.releaseYear) });
  if (title.release.runtimeMinutes) facts.push({ label: "Runtime", value: formatMinutes(title.release.runtimeMinutes) });
  if (title.release.seasonCount) facts.push({ label: "Seasons", value: String(title.release.seasonCount) });
  if (title.release.episodeCount) facts.push({ label: "Episodes", value: String(title.release.episodeCount) });
  if (title.classifications.genres?.length) facts.push({ label: "Genres", value: title.classifications.genres.map((item) => item.label).join(", ") });
  if (title.classifications.primaryOriginalLanguage) facts.push({ label: "Language", value: title.classifications.primaryOriginalLanguage.label });
  else if (title.classifications.originalLanguages?.length) facts.push({ label: "Language", value: title.classifications.originalLanguages.map((item) => item.label).join(", ") });
  if (title.classifications.platforms?.length) facts.push({ label: "Platform", value: title.classifications.platforms.map((item) => item.label).join(", ") });
  if (title.studios?.length) facts.push({ label: title.studios.length > 1 ? "Studios" : "Studio", value: title.studios.map((item) => item.name).join(", ") });
  if (title.sourceWorks?.length) facts.push({ label: "Source", value: title.sourceWorks.map((item) => item.sourceWork.officialTitle).join(", ") });
  return facts;
}

function TopicNavigator({ model }: { readonly model: TitleHubViewModel }) {
  if (model.topics.length === 0) return null;
  return (
    <section id="everything-we-explained" className={styles.topicSection} aria-labelledby="everything-heading">
      <div className={styles.sectionIntro}>
        <div>
          <p className={styles.eyebrow}>Explore this story</p>
          <h2 id="everything-heading">Everything we&apos;ve explained</h2>
          <p>Jump directly to the part of the story you still want to understand.</p>
        </div>
      </div>
      <nav className={styles.topicGrid} aria-label={`Topics explained for ${model.title.displayTitle}`}>
        {model.topics.map((topic) => (
          <a className={styles.topicCard} href={`#${topic.id}`} key={topic.id}>
            <span className={styles.topicLabel}>{topic.label}</span>
            <span className={styles.topicCount}>{topic.count} {topic.count === 1 ? topic.unit.replace(/s$/, "") : topic.unit}</span>
            <ArrowRightIcon size={17} />
          </a>
        ))}
      </nav>
    </section>
  );
}

function RelationshipsPreview({ model }: { readonly model: TitleHubViewModel }) {
  if (model.relationships.length === 0) return null;
  return (
    <section id="relationships" className={styles.previewSection} aria-labelledby="relationships-heading">
      <div className={styles.sectionIntro}>
        <div><p className={styles.eyebrow}>Connections</p><h2 id="relationships-heading">Relationships</h2><p>Key character connections without turning the page into a graph.</p></div>
      </div>
      <div className={styles.relationshipList}>
        {model.relationships.slice(0, 4).map((relationship) => {
          const state = newestRelationshipState(relationship);
          const protectedState = state?.spoiler.level === "major" || state?.spoiler.level === "full";
          return (
            <article className={styles.relationshipRow} key={String(relationship.relationshipId)}>
              <div className={styles.relationshipNames}>
                <strong>{relationship.characterA.displayName}</strong>
                <span aria-hidden="true">↔</span>
                <strong>{relationship.characterB.displayName}</strong>
              </div>
              {relationship.summary ? <p>{relationship.summary}</p> : null}
              {state ? protectedState ? (
                <SpoilerDisclosure metadata={state.spoiler} locale={model.locale} scopeLabel={model.title.displayTitle}>
                  <div className={styles.protectedCopy}>
                    <strong>{RELATIONSHIP_LABELS[state.relationshipType]}</strong>
                    {state.description ? <p>{state.description}</p> : null}
                  </div>
                </SpoilerDisclosure>
              ) : (
                <div className={styles.relationshipState}>
                  <span>{RELATIONSHIP_LABELS[state.relationshipType]}</span>
                  <SpoilerMarker metadata={state.spoiler} locale={model.locale} scopeLabel={model.title.displayTitle} />
                </div>
              ) : null}
              <Link
                className={styles.relationshipCta}
                href={relationshipRoute(
                  model.routeFamily,
                  model.title.identity.localization.currentVariant.slug,
                  relationship.characterA.slug,
                  relationship.characterB.slug,
                  model.locale,
                )}
              >
                View relationship <ArrowRightIcon size={16} />
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function TimelinePreview({ model }: { readonly model: TitleHubViewModel }) {
  if (model.timeline.length === 0) return null;
  return (
    <section id="story-timeline" className={styles.previewSection} aria-labelledby="timeline-heading">
      <div className={styles.sectionIntro}>
        <div><p className={styles.eyebrow}>Story chronology</p><h2 id="timeline-heading">Story Timeline</h2><p>Key events ordered by when they happen in the story.</p></div>
      </div>
      <ol className={styles.timelineList}>
        {model.timeline.slice(0, 6).map((event: TimelineEvent) => {
          const protectedEvent = event.spoiler.level === "major" || event.spoiler.level === "full";
          return (
            <li className={styles.timelineItem} key={String(event.timelineEventId)}>
              <span className={styles.timelineOrder} aria-label={`Chronology order ${event.chronologyOrder}`}>{event.chronologyOrder}</span>
              <div className={styles.timelineCopy}>
                {event.relativeChronologyLabel ? <span className={styles.timelineContext}>{event.relativeChronologyLabel}</span> : null}
                {protectedEvent ? (
                  <>
                    <strong>Spoiler-protected event</strong>
                    <SpoilerDisclosure metadata={event.spoiler} locale={model.locale} scopeLabel={model.title.displayTitle}>
                      <div className={styles.protectedCopy}>
                        <strong>{event.localizedText?.label ?? "Timeline event"}</strong>
                        {event.localizedText?.description ? <p>{event.localizedText.description}</p> : null}
                      </div>
                    </SpoilerDisclosure>
                  </>
                ) : (
                  <>
                    <strong>{event.localizedText?.label ?? "Timeline event"}</strong>
                    {event.localizedText?.description ? <p>{event.localizedText.description}</p> : null}
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      <Link
        className={styles.relationshipCta}
        href={timelineRoute(
          model.routeFamily,
          model.title.identity.localization.currentVariant.slug,
          "chronology",
          model.locale,
        )}
      >
        View full timeline <ArrowRightIcon size={16} />
      </Link>
    </section>
  );
}

function ViewerQuestions({ model }: { readonly model: TitleHubViewModel }) {
  if (model.viewerQuestions.length === 0) return null;
  return (
    <section className={styles.section} aria-labelledby="viewer-questions-heading">
      <div className={styles.sectionIntro}><div><p className={styles.eyebrow}>Answered questions</p><h2 id="viewer-questions-heading">Popular Viewer Questions</h2><p>Questions this fictional demo data already has explanations for.</p></div></div>
      <div className={styles.questionGrid}>
        {model.viewerQuestions.slice(0, 6).map((item) => (
          <Link className={styles.questionCard} key={`${String(item.explanation.identity.logicalId)}-${item.question}`} href={explanationRoute(item.explanation.identity.localization.currentVariant.slug, model.locale)}>
            <span>{item.question}</span>
            <span className={styles.questionState}>Answered</span>
            <ArrowRightIcon size={17} />
          </Link>
        ))}
      </div>
    </section>
  );
}

function AskPanel({ model }: { readonly model: TitleHubViewModel }) {
  return (
    <section className={styles.askPanel} aria-labelledby="ask-screen-heading">
      <div>
        <p className={styles.eyebrow}>Ask the Screen</p>
        <h2 id="ask-screen-heading">Still have a question about {model.title.displayTitle}?</h2>
        <p>Search the ending, a character, a scene, a relationship or another post-watch question.</p>
      </div>
      <form className={styles.askForm} action={searchRoute(model.locale)} method="get" role="search">
        <label className="pe-visually-hidden" htmlFor="title-hub-question">Your question</label>
        <div className={styles.askInputWrap}>
          <SearchIcon size={18} />
          <input id="title-hub-question" name="q" type="search" maxLength={180} placeholder={`Ask about ${model.title.displayTitle}…`} />
        </div>
        <button type="submit">Search your question</button>
      </form>
    </section>
  );
}

export function TitleHubPage({ model }: { readonly model: TitleHubViewModel }) {
  const title = model.title;
  const routeLabel = routeFamilyLabel(title.publicRouteFamily, model.locale);
  const typeLabel = titleTypeLabel(title.titleType, model.locale);
  const facts = titleFacts(title);
  const heroPoster = title.poster && !title.poster.url.startsWith("/mock-media/") ? title.poster : undefined;
  const endings = model.groupedExplanations.ending_explained;
  const mysteries = [...model.groupedExplanations.mystery_explained, ...model.groupedExplanations.question_answer];
  const bookVsScreen = model.groupedExplanations.book_vs_screen;
  const next = model.groupedExplanations.what_happens_next;
  const sourceWork = title.sourceWorks?.[0]?.sourceWork;

  return (
    <PageContainer className={styles.page}>
      <div className={styles.breadcrumbWrap}>
        <Breadcrumbs items={[
          { label: "Home", href: localizedRoute("/", model.locale) },
          { label: routeLabel, href: titleHubRoute(model.routeFamily, model.locale) },
          { label: title.seo.breadcrumbLabel ?? title.displayTitle },
        ]} />
      </div>

      <section className={styles.hero} aria-labelledby="title-hub-heading">
        <div className={styles.poster}>
          <CardMedia media={heroPoster} ratio="poster" sizes="(max-width: 767px) 150px, 230px" fallbackLabel="Poster unavailable" />
        </div>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>{routeLabel} · {title.releaseYear ?? "Release year unavailable"}{routeLabel !== typeLabel ? ` · ${typeLabel}` : ""}</p>
          <h1 id="title-hub-heading">{title.displayTitle}</h1>
          <p className={styles.premise}>{title.spoilerFreePremise}</p>
          <div className={styles.heroActions}>
            <a className={styles.primaryAction} href="#everything-we-explained">
              {model.explanationCount} {model.explanationCount === 1 ? "explanation" : "explanations"} available <ArrowRightIcon size={17} />
            </a>
          </div>
          {model.canonContexts.length > 0 ? (
            <div className={styles.canonPanel} aria-label="Canon contexts represented in ScreenWhy explanations">
              <div className={styles.canonHeading}><InfoIcon size={18} /><strong>Canon context</strong></div>
              <div className={styles.canonList}>
                {model.canonContexts.slice(0, 3).map((context, index) => (
                  <CanonContext key={`${context.classification}-${index}`} context={context} locale={model.locale} presentation="compact" />
                ))}
              </div>
            </div>
          ) : null}
        </div>
        {facts.length > 0 ? (
          <dl className={styles.facts} aria-label={`${title.displayTitle} facts`}>
            {facts.map((fact) => <div className={styles.factRow} key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}
          </dl>
        ) : null}
      </section>

      <TopicNavigator model={model} />

      {endings.length > 0 ? (
        <section id="ending-explained" className={styles.section} aria-labelledby="ending-heading">
          <div className={styles.sectionIntro}><div><p className={styles.eyebrow}>Biggest answer</p><h2 id="ending-heading">Ending Explained</h2><p>The central ending answers, with spoiler context made explicit.</p></div></div>
          <div className={styles.endingLayout}>
            <ExplanationCard explanation={endings[0]} variant="standard" showCanon />
            {model.primaryEndingDetail ? (
              <QuickAnswer answer={model.primaryEndingDetail.quickAnswer} locale={model.locale} canon={model.primaryEndingDetail.canon} spoiler={model.primaryEndingDetail.spoiler} spoilerScopeLabel={title.displayTitle} />
            ) : null}
          </div>
        </section>
      ) : null}

      {model.characters.length > 0 ? (
        <section id="main-characters" className={styles.section} aria-labelledby="characters-heading">
          <div className={styles.sectionIntro}><div><p className={styles.eyebrow}>People in the story</p><h2 id="characters-heading">Main Characters</h2><p>Spoiler-safe character context connected to this title.</p></div></div>
          <div className={styles.characterGrid}>{model.characters.slice(0, 4).map((character) => <CharacterCard key={String(character.identity.logicalId)} character={character} />)}</div>
        </section>
      ) : null}

      {mysteries.length > 0 ? (
        <section id="mysteries-questions" className={styles.section} aria-labelledby="mysteries-heading">
          <div className={styles.sectionIntro}><div><p className={styles.eyebrow}>Unresolved while watching</p><h2 id="mysteries-heading">Mysteries &amp; Questions</h2><p>The questions viewers are most likely to search after the story ends.</p></div></div>
          <div className={styles.explanationGrid}>{mysteries.slice(0, 4).map((item) => <ExplanationCard key={String(item.identity.logicalId)} explanation={item} variant="compact" />)}</div>
        </section>
      ) : null}

      {(model.relationships.length > 0 || model.timeline.length > 0) ? (
        <div className={styles.twoColumnStory}>
          <RelationshipsPreview model={model} />
          <TimelinePreview model={model} />
        </div>
      ) : null}

      {(title.sourceWorks?.length || bookVsScreen.length) ? (
        <section id="book-vs-screen" className={styles.section} aria-labelledby="adaptation-heading">
          <div className={styles.sectionIntro}><div><p className={styles.eyebrow}>Adaptation context</p><h2 id="adaptation-heading">Book vs Screen</h2><p>Where the screen story relates to its source material.</p></div></div>
          <div className={styles.adaptationLayout}>
            {sourceWork ? (
              <article className={styles.sourceWorkCard}>
                <span className={styles.sourceWorkType}>{sourceWork.workType.replaceAll("_", " ")}</span>
                <h3>{sourceWork.officialTitle}</h3>
                {sourceWork.creatorAuthor ? <p>By {sourceWork.creatorAuthor}</p> : null}
                <p>{title.sourceWorks?.[0]?.relationshipType === "adapted_from" ? "Adapted from this source work." : "Based on this source work."}</p>
              </article>
            ) : null}
            {bookVsScreen.map((item) => <ExplanationCard key={String(item.identity.logicalId)} explanation={item} variant="standard" showCanon />)}
          </div>
        </section>
      ) : null}

      {next.length > 0 ? (
        <section id="what-happens-next" className={styles.section} aria-labelledby="next-heading">
          <div className={styles.sectionIntro}><div><p className={styles.eyebrow}>After the ending</p><h2 id="next-heading">What Happens Next?</h2><p>Confirmed setup stays separate from interpretation and speculation.</p></div></div>
          <div className={styles.explanationGrid}>{next.map((item) => <ExplanationCard key={String(item.identity.logicalId)} explanation={item} variant="compact" showCanon />)}</div>
        </section>
      ) : null}

      <ViewerQuestions model={model} />
      <AskPanel model={model} />

      {model.relatedTitles.length > 0 ? (
        <section className={styles.section} aria-labelledby="related-titles-heading">
          <div className={styles.sectionIntro}><div><p className={styles.eyebrow}>Keep exploring</p><h2 id="related-titles-heading">Related Titles</h2><p>Other fictional ScreenWhy titles with related story territory.</p></div></div>
          <div className={styles.relatedTitleGrid}>{model.relatedTitles.slice(0, 4).map((related) => <TitleCard key={String(related.identity.logicalId)} title={related} variant="compact" />)}</div>
        </section>
      ) : null}
    </PageContainer>
  );
}
