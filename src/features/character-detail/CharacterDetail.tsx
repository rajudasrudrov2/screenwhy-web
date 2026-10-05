import Link from "next/link";
import { CanonContext } from "@/components/domain/canon/CanonContext";
import { CardMedia } from "@/components/domain/cards/CardMedia";
import { ExplanationCard } from "@/components/domain/cards/ExplanationCard";
import { SpoilerDisclosure, SpoilerMarker } from "@/components/domain/spoiler/SpoilerContext";
import { ArrowRightIcon, InfoIcon, SearchIcon } from "@/components/icons/Icons";
import { PageContainer } from "@/components/layout/Layout";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { characterRoute, explanationRoute, localizedRoute, searchRoute, titleRoute } from "@/config/routes";
import type { CharacterStatusValue } from "@/types/domain/character";
import type { RelationshipType } from "@/types/domain/relationship";
import type { CharacterDetailViewModel, CharacterRelationshipPreview } from "@/features/character-detail/character-detail.types";
import styles from "./CharacterDetail.module.css";

const RELATIONSHIP_LABELS: Record<RelationshipType, string> = {
  romantic: "Romantic",
  sibling: "Sibling",
  parent_child: "Parent / Child",
  family: "Family",
  friend: "Friend",
  enemy: "Enemy",
  ally: "Ally",
  mentor: "Mentor",
  colleague: "Colleague",
  former_relationship: "Former relationship",
  unknown_complex: "Complex relationship",
};

const STATUS_LABELS: Record<CharacterStatusValue, string> = {
  alive: "Alive",
  deceased: "Deceased",
  missing: "Missing",
  unknown: "Unknown",
  other: "Other",
};

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function RelationshipItem({ model, preview }: { readonly model: CharacterDetailViewModel; readonly preview: CharacterRelationshipPreview }) {
  const safeType = preview.safeState?.relationshipType;
  const roleSummary = preview.currentRole && preview.counterpartRole
    ? `${preview.currentRole} ↔ ${preview.counterpartRole}`
    : safeType
      ? RELATIONSHIP_LABELS[safeType]
      : "Character relationship";

  return (
    <article className={styles.relationshipItem}>
      <div className={styles.relationshipTopline}>
        <Link
          className={styles.counterpartLink}
          href={characterRoute(preview.counterpart.identity.localization.currentVariant.slug, model.locale)}
        >
          <span className={styles.counterpartMedia}>
            <CardMedia
              media={preview.counterpart.portrait}
              ratio="portrait"
              sizes="64px"
              fallbackLabel="Portrait unavailable"
            />
          </span>
          <span className={styles.counterpartCopy}>
            <strong>{preview.counterpart.displayName}</strong>
            <span>{roleSummary}</span>
          </span>
          <ArrowRightIcon size={17} />
        </Link>
      </div>
      {preview.relationship.summary ? <p className={styles.relationshipSummary}>{preview.relationship.summary}</p> : null}
      {preview.safeState ? (
        <div className={styles.relationshipContext}>
          <CanonContext context={preview.safeState.canon} locale={model.locale} presentation="compact" />
          <SpoilerMarker metadata={preview.safeState.spoiler} locale={model.locale} />
        </div>
      ) : null}
      {preview.protectedStates.map((state) => (
        <div className={styles.protectedState} key={String(state.relationshipStateId)}>
          <SpoilerDisclosure metadata={state.spoiler} locale={model.locale} scopeLabel={model.primaryTitle.displayTitle}>
            <div className={styles.protectedCopy}>
              <CanonContext context={state.canon} locale={model.locale} presentation="compact" />
              <p><strong>{RELATIONSHIP_LABELS[state.relationshipType]}</strong>{state.description ? ` — ${state.description}` : ""}</p>
            </div>
          </SpoilerDisclosure>
        </div>
      ))}
    </article>
  );
}

export function CharacterDetailPage({ model }: { readonly model: CharacterDetailViewModel }) {
  const character = model.character;
  const primaryTitle = model.primaryTitle;
  const characterExplanation = model.characterExplanation;
  const generalRelated = model.relatedExplanations.filter(
    (explanation) =>
      explanation.explanationType !== "character_explained" &&
      explanation.explanationType !== "mystery_explained" &&
      explanation.explanationType !== "question_answer" &&
      explanation.explanationType !== "book_vs_screen",
  );
  const performer = character.performers?.[0];
  const hasDifferences = model.adaptationExplanations.length > 0 || (character.statuses?.length ?? 0) > 1;
  const navItems = [
    { id: "overview", label: "Overview", show: true },
    { id: "relationships", label: "Relationships", show: model.relationships.length > 0 },
    { id: "timeline", label: "Timeline", show: model.timeline.length > 0 },
    { id: "mysteries-reveals", label: "Mysteries & Reveals", show: model.mysteriesAndReveals.length > 0 },
    { id: "differences", label: "Differences", show: hasDifferences },
    { id: "viewer-questions", label: "Viewer Questions", show: model.viewerQuestions.length > 0 },
    { id: "related-explanations", label: "Related", show: generalRelated.length > 0 },
  ].filter((item) => item.show);

  return (
    <PageContainer className={styles.page}>
      <div className={styles.breadcrumbWrap}>
        <Breadcrumbs items={[
          { label: "Home", href: localizedRoute("/", model.locale) },
          { label: "Characters" },
          { label: character.seo.breadcrumbLabel ?? character.displayName },
        ]} />
      </div>

      <section className={styles.hero} aria-labelledby="character-heading">
        <div className={styles.heroMedia}>
          <CardMedia
            media={character.portrait}
            ratio="portrait"
            sizes="(max-width: 767px) 180px, 260px"
            fallbackLabel="Character portrait unavailable"
          />
        </div>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Character profile</p>
          <h1 id="character-heading">{character.displayName}</h1>
          <p className={styles.titleLine}>
            <Link href={titleRoute(primaryTitle.publicRouteFamily, primaryTitle.identity.localization.currentVariant.slug, model.locale)}>
              {primaryTitle.displayTitle}
            </Link>
            <span aria-hidden="true">·</span>
            <span>{primaryTitle.releaseYear ?? primaryTitle.release.releaseYear ?? "Release year unavailable"}</span>
          </p>
          <p className={styles.heroDescription}>{character.spoilerFreeDescription}</p>
          {character.aliases?.length ? (
            <div className={styles.aliases} aria-label="Also known as">
              {character.aliases.map((alias) => <span key={alias}>{alias}</span>)}
            </div>
          ) : null}
          {characterExplanation ? (
            <Link
              className={styles.overviewCta}
              href={explanationRoute(characterExplanation.identity.localization.currentVariant.slug, model.locale)}
            >
              <span>
                <strong>Read Character Explanation</strong>
                <small>{characterExplanation.excerpt ?? "Understand this character in story context."}</small>
              </span>
              <ArrowRightIcon size={18} />
            </Link>
          ) : null}
        </div>
        <aside className={styles.heroContext} aria-label={`${character.displayName} context`}>
          <div className={styles.titleContextPanel}>
            <p className={styles.contextLabel}>Appears in</p>
            <Link href={titleRoute(primaryTitle.publicRouteFamily, primaryTitle.identity.localization.currentVariant.slug, model.locale)}>
              <strong>{primaryTitle.displayTitle}</strong>
              <span>View Title Hub</span>
              <ArrowRightIcon size={16} />
            </Link>
          </div>
          {model.canonContexts.length > 0 ? (
            <div className={styles.canonStack}>
              <p className={styles.contextLabel}>Canon contexts</p>
              {model.canonContexts.slice(0, 3).map((context, index) => (
                <CanonContext key={`${context.classification}-${index}`} context={context} locale={model.locale} presentation="compact" />
              ))}
            </div>
          ) : null}
        </aside>
      </section>

      <nav className={styles.sectionNav} aria-label="Character page sections">
        {navItems.map((item) => <a key={item.id} href={`#${item.id}`}>{item.label}</a>)}
      </nav>

      <section id="overview" className={styles.section} aria-labelledby="overview-heading">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>Character overview</p>
          <h2 id="overview-heading">Understand {character.displayName} without losing the story context</h2>
        </div>
        <div className={styles.overviewGrid}>
          <article className={styles.overviewPanel}>
            <h3>Who is {character.displayName}?</h3>
            <p>{character.spoilerFreeDescription}</p>
          </article>
          {character.fullDescription ? (
            <article className={styles.overviewPanel}>
              <h3>Role in the Story</h3>
              <p>{character.fullDescription}</p>
            </article>
          ) : null}
          <aside className={`${styles.overviewPanel} ${styles.factsPanel}`} aria-label="Quick facts">
            <h3>Quick Facts</h3>
            <dl>
              <div><dt>Appears in</dt><dd>{primaryTitle.displayTitle}</dd></div>
              {character.aliases?.length ? <div><dt>Also known as</dt><dd>{character.aliases.join(", ")}</dd></div> : null}
              {performer ? <div><dt>Portrayed by</dt><dd>{performer.performerName}{performer.versionScope ? <span> · {performer.versionScope}</span> : null}</dd></div> : null}
              {character.editorialDates?.lastReviewed ? <div><dt>Last reviewed</dt><dd>{formatDate(character.editorialDates.lastReviewed)}</dd></div> : null}
            </dl>
          </aside>
        </div>
      </section>

      {model.relationships.length > 0 || model.timeline.length > 0 ? (
        <div className={styles.storyGrid}>
          {model.relationships.length > 0 ? (
            <section id="relationships" className={styles.section} aria-labelledby="relationships-heading">
              <div className={styles.sectionHeadingCompact}>
                <div>
                  <p className={styles.eyebrow}>Story connections</p>
                  <h2 id="relationships-heading">Key Relationships</h2>
                </div>
              </div>
              <div className={styles.relationshipList}>
                {model.relationships.map((preview) => (
                  <RelationshipItem model={model} preview={preview} key={String(preview.relationship.relationshipId)} />
                ))}
              </div>
            </section>
          ) : null}

          {model.timeline.length > 0 ? (
            <section id="timeline" className={styles.section} aria-labelledby="timeline-heading">
              <div className={styles.sectionHeadingCompact}>
                <div>
                  <p className={styles.eyebrow}>Story chronology</p>
                  <h2 id="timeline-heading">Timeline Highlights</h2>
                </div>
              </div>
              <ol className={styles.timelineList}>
                {model.timeline.map((event) => {
                  const protectedEvent = event.spoiler.level === "major" || event.spoiler.level === "full";
                  return (
                    <li className={styles.timelineItem} key={String(event.timelineEventId)}>
                      <span className={styles.timelineIndex}>{event.chronologyOrder}</span>
                      {protectedEvent ? (
                        <div className={styles.timelineProtected}>
                          <p className={styles.protectedEventLabel}>Protected story event</p>
                          <SpoilerDisclosure metadata={event.spoiler} locale={model.locale} scopeLabel={primaryTitle.displayTitle}>
                            <div className={styles.protectedCopy}>
                              <strong>{event.localizedText?.label ?? "Story event"}</strong>
                              {event.localizedText?.description ? <p>{event.localizedText.description}</p> : null}
                              <CanonContext context={event.canon} locale={model.locale} presentation="compact" />
                            </div>
                          </SpoilerDisclosure>
                        </div>
                      ) : (
                        <div className={styles.timelineCopy}>
                          <p className={styles.timelineMeta}>{event.relativeChronologyLabel ?? `Chronology ${event.chronologyOrder}`}</p>
                          <h3>{event.localizedText?.label ?? "Story event"}</h3>
                          {event.localizedText?.description ? <p>{event.localizedText.description}</p> : null}
                          <div className={styles.timelineContexts}>
                            <SpoilerMarker metadata={event.spoiler} locale={model.locale} />
                            <CanonContext context={event.canon} locale={model.locale} presentation="compact" />
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </section>
          ) : null}
        </div>
      ) : null}

      {model.mysteriesAndReveals.length > 0 ? (
        <section id="mysteries-reveals" className={styles.section} aria-labelledby="mysteries-heading">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Questions around this character</p>
            <h2 id="mysteries-heading">Mysteries &amp; Reveals</h2>
            <p>Character-linked explanations keep spoiler context visible before you open them.</p>
          </div>
          <div className={styles.explanationGrid}>
            {model.mysteriesAndReveals.map((explanation) => (
              <ExplanationCard key={String(explanation.identity.logicalId)} explanation={explanation} variant="standard" showCanon />
            ))}
          </div>
        </section>
      ) : null}

      {hasDifferences ? (
        <section id="differences" className={styles.section} aria-labelledby="differences-heading">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Continuity matters</p>
            <h2 id="differences-heading">Canon &amp; Source Material Differences</h2>
            <p>Screen and source-material contexts stay separate. Character outcomes remain hidden until their spoiler warning is opened.</p>
          </div>
          <div className={styles.differencesLayout}>
            {model.adaptationExplanations.map((explanation) => (
              <ExplanationCard key={String(explanation.identity.logicalId)} explanation={explanation} variant="standard" showCanon />
            ))}
            {character.statuses?.length ? (
              <div className={styles.statusPanel} aria-label="Canon-sensitive character status">
                <div className={styles.statusHeading}>
                  <InfoIcon size={19} />
                  <div><strong>Canon-sensitive status</strong><p>Status differs by continuity and is never flattened into one global label.</p></div>
                </div>
                <div className={styles.statusList}>
                  {character.statuses.map((status, index) => (
                    <SpoilerDisclosure key={`${status.canon.classification}-${index}`} metadata={status.spoiler} locale={model.locale}>
                      <div className={styles.protectedCopy}>
                        <CanonContext context={status.canon} locale={model.locale} presentation="compact" />
                        <p><strong>Status in this continuity:</strong> {STATUS_LABELS[status.status]}</p>
                      </div>
                    </SpoilerDisclosure>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {generalRelated.length > 0 ? (
        <section id="related-explanations" className={styles.section} aria-labelledby="related-heading">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Keep exploring</p>
            <h2 id="related-heading">Related Explanations</h2>
          </div>
          <div className={styles.relatedGrid}>
            {generalRelated.map((explanation) => (
              <ExplanationCard key={String(explanation.identity.logicalId)} explanation={explanation} variant="compact" showCanon />
            ))}
          </div>
        </section>
      ) : null}

      {model.viewerQuestions.length > 0 ? (
        <section id="viewer-questions" className={styles.section} aria-labelledby="questions-heading">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Viewer questions</p>
            <h2 id="questions-heading">Questions people may still have about {character.displayName}</h2>
          </div>
          <div className={styles.questionRows}>
            {model.viewerQuestions.slice(0, 6).map((item) => (
              <Link
                className={styles.questionRow}
                key={`${String(item.explanation.identity.logicalId)}-${item.question}`}
                href={explanationRoute(item.explanation.identity.localization.currentVariant.slug, model.locale)}
              >
                <span>{item.question}</span>
                <span className={styles.questionState}>Answered</span>
                <ArrowRightIcon size={17} />
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className={styles.askPanel} aria-labelledby="ask-character-heading">
        <div>
          <p className={styles.eyebrow}>Ask the Screen</p>
          <h2 id="ask-character-heading">Still have a question about {character.displayName}?</h2>
          <p>Search a scene, relationship, mystery or another post-watch question. Nothing is submitted to a database here.</p>
        </div>
        <form className={styles.askForm} action={searchRoute(model.locale)} method="get" role="search">
          <label className="pe-visually-hidden" htmlFor="character-question">Your question</label>
          <div className={styles.askInputWrap}>
            <SearchIcon size={18} />
            <input id="character-question" name="q" type="search" maxLength={180} placeholder={`Ask about ${character.displayName}…`} />
          </div>
          <button type="submit">Search your question</button>
        </form>
      </section>
    </PageContainer>
  );
}
