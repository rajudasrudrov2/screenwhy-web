import Link from "next/link";
import { CanonContext } from "@/components/domain/canon/CanonContext";
import { CardMedia } from "@/components/domain/cards/CardMedia";
import { ExplanationCard } from "@/components/domain/cards/ExplanationCard";
import { QuickAnswer } from "@/components/domain/quick-answer/QuickAnswer";
import {
  SpoilerDisclosure,
  SpoilerMarker,
  SpoilerWarning,
} from "@/components/domain/spoiler/SpoilerContext";
import { ArrowRightIcon } from "@/components/icons/Icons";
import { PageContainer } from "@/components/layout/Layout";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { routeFamilyLabel } from "@/components/domain/cards/card-labels";
import {
  characterRoute,
  explanationRoute,
  timelineRoute,
  titleHubRoute,
  titleRoute,
} from "@/config/routes";
import type { InstallmentId } from "@/types/domain/identity";
import type { RelationshipState } from "@/types/domain/relationship";
import type { TimelineEvent } from "@/types/domain/timeline";
import type { TitleDetail } from "@/types/domain/title";
import type {
  RelationshipExperienceViewModel,
  RelationshipMapConnection,
} from "@/features/relationship-experience/relationship.types";
import {
  isProtectedRelationshipState,
  relationshipTypeLabel,
} from "@/features/relationship-experience/relationship.utils";
import styles from "./RelationshipExperience.module.css";

function installmentLabel(
  title: TitleDetail<"en-US">,
  installmentId: InstallmentId | undefined,
): string | undefined {
  if (!installmentId) return undefined;
  const installment = title.installments?.find((item) => item.installmentId === installmentId);
  if (!installment) return undefined;
  if (installment.officialTitle) return installment.officialTitle;
  if (installment.kind === "episode" && installment.episodeNumber !== undefined) return `Episode ${installment.episodeNumber}`;
  if (installment.kind === "season" && installment.seasonNumber !== undefined) return `Season ${installment.seasonNumber}`;
  if (installment.kind === "part" && installment.partNumber !== undefined) return `Part ${installment.partNumber}`;
  return "Story installment";
}

function eventInstallmentLabel(
  title: TitleDetail<"en-US">,
  event: TimelineEvent,
): string | undefined {
  return installmentLabel(title, event.installmentId);
}

function stateContextLabel(
  title: TitleDetail<"en-US">,
  state: RelationshipState,
): string | undefined {
  const start = installmentLabel(title, state.startInstallmentId);
  const end = installmentLabel(title, state.endInstallmentId);
  if (start && end) return `${start} → ${end}`;
  if (start) return `Begins in ${start}`;
  if (end) return `Through ${end}`;
  return undefined;
}

function IdentityBlock({
  character,
  role,
}: {
  readonly character: RelationshipExperienceViewModel["characterA"];
  readonly role?: string;
}) {
  const slug = character.identity.localization.currentVariant.slug;
  return (
    <Link className={styles.identityCard} href={characterRoute(slug, "en-US")}>
      <span className={styles.identityMedia}>
        <CardMedia
          media={character.portrait}
          ratio="portrait"
          sizes="(max-width: 767px) 72px, 84px"
          fallbackLabel="Portrait unavailable"
        />
      </span>
      <span className={styles.identityCopy}>
        <strong>{character.displayName}</strong>
        <span>{role ?? "Character"}</span>
      </span>
    </Link>
  );
}

function RelationshipStateCard({
  model,
  state,
}: {
  readonly model: RelationshipExperienceViewModel;
  readonly state: RelationshipState;
}) {
  const protectedState = isProtectedRelationshipState(state);
  const context = stateContextLabel(model.title, state);
  const revealed = (
    <div className={styles.stateRevealed}>
      <div className={styles.stateTitleRow}>
        <h3>{relationshipTypeLabel(state.relationshipType)}</h3>
        {context ? <span className={styles.contextPill}>{context}</span> : null}
      </div>
      {(state.roleA || state.roleB) ? (
        <dl className={styles.roleGrid}>
          <div><dt>{model.characterA.displayName}</dt><dd>{state.roleA ?? "Role not specified"}</dd></div>
          <div><dt>{model.characterB.displayName}</dt><dd>{state.roleB ?? "Role not specified"}</dd></div>
        </dl>
      ) : null}
      {state.description ? <p className={styles.stateDescription}>{state.description}</p> : null}
      <div className={styles.contextRow}>
        <CanonContext context={state.canon} locale={model.locale} presentation="compact" />
        <SpoilerMarker metadata={state.spoiler} locale={model.locale} scopeLabel={model.title.displayTitle} />
      </div>
    </div>
  );

  return (
    <li className={`${styles.stateCard} ${protectedState ? styles.stateProtected : ""}`}>
      <div className={styles.stateSequence} aria-label={`Relationship state ${state.sequence}`}>{state.sequence}</div>
      <div className={styles.stateBody}>
        {protectedState ? (
          <>
            <div className={styles.protectedHeading}>
              <h3>Protected relationship state</h3>
              <p>This part of the relationship changes through a major story reveal.</p>
            </div>
            <SpoilerDisclosure metadata={state.spoiler} locale={model.locale} scopeLabel={model.title.displayTitle}>
              {revealed}
            </SpoilerDisclosure>
          </>
        ) : revealed}
      </div>
    </li>
  );
}

function EventCard({
  model,
  preview,
}: {
  readonly model: RelationshipExperienceViewModel;
  readonly preview: RelationshipExperienceViewModel["relevantEvents"][number];
}) {
  const event = preview.event;
  const protectedEvent = event.spoiler.level === "major" || event.spoiler.level === "full";
  const installment = eventInstallmentLabel(model.title, event);
  const eventContent = (
    <div className={styles.eventRevealed}>
      <div className={styles.eventHeading}>
        <div>
          <p className={styles.eventMeta}>
            {event.relativeChronologyLabel ?? `Chronology ${event.chronologyOrder}`}
            {installment ? ` · ${installment}` : ""}
          </p>
          <h3>{event.localizedText?.label ?? "Story event"}</h3>
        </div>
        <span className={styles.eventOrder}>#{event.chronologyOrder}</span>
      </div>
      {event.localizedText?.description ? <p className={styles.eventDescription}>{event.localizedText.description}</p> : null}
      <div className={styles.contextRow}>
        <CanonContext context={event.canon} locale={model.locale} presentation="compact" />
        <SpoilerMarker metadata={event.spoiler} locale={model.locale} scopeLabel={model.title.displayTitle} />
      </div>
      {preview.relatedExplanation ? (
        <Link className={styles.inlineExplanationLink} href={explanationRoute(preview.relatedExplanation.identity.localization.currentVariant.slug, model.locale)}>
          <span>Read related explanation</span>
          <ArrowRightIcon size={16} />
        </Link>
      ) : null}
    </div>
  );

  return (
    <article className={styles.eventCard}>
      {protectedEvent ? (
        <>
          <div className={styles.protectedEventIntro}>
            <div>
              <p className={styles.eventMeta}>Chronology {event.chronologyOrder}</p>
              <h3>Protected story event</h3>
            </div>
          </div>
          <SpoilerDisclosure metadata={event.spoiler} locale={model.locale} scopeLabel={model.title.displayTitle}>
            {eventContent}
          </SpoilerDisclosure>
        </>
      ) : eventContent}
    </article>
  );
}

function MapConnectionRow({ connection }: { readonly connection: RelationshipMapConnection }) {
  const label = connection.safeState
    ? relationshipTypeLabel(connection.safeState.relationshipType)
    : "Character relationship";
  return (
    <li>
      <span>{connection.characterA.displayName}</span>
      <span className={styles.mapSemanticConnector} aria-hidden="true">↔</span>
      <span>{connection.characterB.displayName}</span>
      <strong>{connection.selected ? `Selected · ${label}` : label}</strong>
    </li>
  );
}

function RelationshipMap({ model }: { readonly model: RelationshipExperienceViewModel }) {
  const selected = model.mapConnections.find((connection) => connection.selected);
  if (!selected) return null;
  const additional = model.mapConnections.filter((connection) => !connection.selected);
  const selectedLabel = selected.safeState
    ? relationshipTypeLabel(selected.safeState.relationshipType)
    : "Relationship";

  return (
    <section id="relationship-map" className={`${styles.section} ${styles.mapSection}`} aria-labelledby="relationship-map-heading">
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.eyebrow}>Discovery aid</p>
          <h2 id="relationship-map-heading">Character relationship map</h2>
          <p>Direct story connections around the selected pair. Relationship history above remains the primary explanation.</p>
        </div>
        <span className={styles.focusBadge}>Focus: {model.characterA.displayName} + {model.characterB.displayName}</span>
      </div>
      <div className={styles.mapPanel}>
        <div className={styles.selectedMapPair} aria-label={`${model.characterA.displayName} and ${model.characterB.displayName}: ${selectedLabel}`}>
          <IdentityBlock character={model.characterA} role={selected.safeState?.roleA} />
          <div className={styles.mapBridge}>
            <span aria-hidden="true">↔</span>
            <strong>{selectedLabel}</strong>
          </div>
          <IdentityBlock character={model.characterB} role={selected.safeState?.roleB} />
        </div>
        {additional.length > 0 ? (
          <div className={styles.additionalConnections}>
            <h3>Directly connected characters</h3>
            <ul>{additional.map((connection) => <MapConnectionRow key={String(connection.relationship.relationshipId)} connection={connection} />)}</ul>
          </div>
        ) : (
          <p className={styles.twoNodeNote}>Only the selected relationship is available in the current Title data.</p>
        )}
        <div className={styles.semanticFallback}>
          <h3>Relationship connections</h3>
          <ul>{model.mapConnections.map((connection) => <MapConnectionRow key={`semantic-${String(connection.relationship.relationshipId)}`} connection={connection} />)}</ul>
        </div>
      </div>
    </section>
  );
}

export function RelationshipExperiencePage({ model }: { readonly model: RelationshipExperienceViewModel }) {
  const titleSlug = model.title.identity.localization.currentVariant.slug;
  const safeState = model.safeState;
  const quickExplanation = model.relationshipExplanation;
  const quickProtected = quickExplanation
    ? quickExplanation.spoiler.screen.level === "major" || quickExplanation.spoiler.screen.level === "full"
    : false;
  const quickAnswer = quickExplanation?.quickAnswer ?? model.relationship.summary ?? "This relationship is documented through the Title's canonical story data.";
  const adaptationExplanation = model.relatedExplanations.find((item) => item.explanationType === "book_vs_screen");
  const navItems = [
    { id: "overview", label: "Overview", show: true },
    { id: "history", label: "History", show: model.states.length > 0 },
    { id: "scenes-events", label: "Scenes & Events", show: model.relevantEvents.length > 0 },
    { id: "relationship-map", label: "Relationship Map", show: model.mapConnections.length > 0 },
    { id: "related", label: "Related", show: model.relatedExplanations.length > 0 },
  ].filter((item) => item.show);

  return (
    <>
      <PageContainer className={styles.page}>
        <div className={styles.breadcrumbWrap}>
          <Breadcrumbs items={[
            { label: "Home", href: "/" },
            { label: routeFamilyLabel(model.routeFamily, model.locale), href: titleHubRoute(model.routeFamily, model.locale) },
            { label: model.title.displayTitle, href: titleRoute(model.routeFamily, titleSlug, model.locale) },
            { label: "Relationships", href: `${titleRoute(model.routeFamily, titleSlug, model.locale)}#relationships` },
            { label: `${model.characterA.displayName} & ${model.characterB.displayName}` },
          ]} />
        </div>

        <section className={styles.hero} aria-labelledby="relationship-heading">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Relationship Explained</p>
            <h1 id="relationship-heading">{model.characterA.displayName} ↔ {model.characterB.displayName}</h1>
            <p className={styles.heroIntro}>{model.relationship.summary ?? `Understand how ${model.characterA.displayName} and ${model.characterB.displayName} connect through ${model.title.displayTitle}.`}</p>
            <div className={styles.heroContexts}>
              <Link className={styles.titleContextLink} href={titleRoute(model.routeFamily, titleSlug, model.locale)}>{model.title.displayTitle}</Link>
              {model.canonContexts[0] ? <CanonContext context={model.canonContexts[0]} locale={model.locale} presentation="compact" /> : null}
              {model.strongestSpoiler ? <SpoilerMarker metadata={model.strongestSpoiler} locale={model.locale} scopeLabel={model.title.displayTitle} /> : null}
            </div>
          </div>
          <div className={styles.heroPair} aria-label="Relationship characters">
            <IdentityBlock character={model.characterA} role={safeState?.roleA} />
            <div className={styles.heroPairBridge}><span aria-hidden="true">↔</span><small>relationship</small></div>
            <IdentityBlock character={model.characterB} role={safeState?.roleB} />
          </div>
        </section>

        {model.strongestSpoiler && (model.strongestSpoiler.level === "major" || model.strongestSpoiler.level === "full") ? (
          <div className={styles.heroWarning}>
            <SpoilerWarning
              metadata={model.strongestSpoiler}
              locale={model.locale}
              scopeLabel={model.title.displayTitle}
              variant="scoped"
              description="Later relationship states are hidden until you choose to reveal them."
            />
          </div>
        ) : null}

        <nav className={styles.sectionNav} aria-label="Relationship page sections">
          {navItems.map((item) => <a key={item.id} href={`#${item.id}`}>{item.label}</a>)}
        </nav>

        <section id="overview" className={`${styles.section} ${styles.overviewSection}`} aria-labelledby="overview-heading">
          <div className={styles.primaryColumn}>
            <h2 id="overview-heading" className={styles.visuallyHidden}>Relationship overview</h2>
            {quickProtected && quickExplanation ? (
              <div className={styles.protectedQuickAnswer}>
                <p className={styles.eyebrow}>Quick Relationship Answer</p>
                <SpoilerDisclosure metadata={quickExplanation.spoiler.screen} locale={model.locale} scopeLabel={model.title.displayTitle}>
                  <QuickAnswer
                    answer={quickAnswer}
                    locale={model.locale}
                    canon={quickExplanation.canon}
                    spoiler={quickExplanation.spoiler}
                    spoilerScopeLabel={model.title.displayTitle}
                    label="Quick Relationship Answer"
                  />
                </SpoilerDisclosure>
              </div>
            ) : (
              <QuickAnswer
                answer={quickAnswer}
                locale={model.locale}
                canon={quickExplanation?.canon ?? safeState?.canon}
                spoiler={quickExplanation?.spoiler ?? (safeState ? { screen: safeState.spoiler } : undefined)}
                spoilerScopeLabel={model.title.displayTitle}
                label="Quick Relationship Answer"
              />
            )}

            {model.states.length > 0 ? (
              <section id="history" className={styles.historySection} aria-labelledby="history-heading">
                <div className={styles.sectionHeadingCompact}>
                  <p className={styles.eyebrow}>Story progression</p>
                  <h2 id="history-heading">Relationship history</h2>
                  <p>Each state is ordered by its canonical sequence and keeps major or full spoilers protected.</p>
                </div>
                <ol className={styles.stateList}>
                  {model.states.map((state) => <RelationshipStateCard key={String(state.relationshipStateId)} model={model} state={state} />)}
                </ol>
              </section>
            ) : null}
          </div>

          <aside className={styles.sideRail} aria-label="Relationship context">
            <section className={styles.railCard}>
              <h2>At a glance</h2>
              <dl className={styles.factList}>
                <div><dt>Relationship type</dt><dd>{safeState ? relationshipTypeLabel(safeState.relationshipType) : "Not safely established"}</dd></div>
                <div><dt>Current state</dt><dd>{model.currentStateProtected ? "Spoiler-protected" : model.latestState ? relationshipTypeLabel(model.latestState.relationshipType) : "Not specified"}</dd></div>
                <div><dt>Title</dt><dd>{model.title.displayTitle}</dd></div>
                <div><dt>Spoiler scope</dt><dd>{model.strongestSpoiler ? <SpoilerMarker metadata={model.strongestSpoiler} locale={model.locale} scopeLabel={model.title.displayTitle} /> : "No spoiler metadata"}</dd></div>
              </dl>
            </section>
            {model.canonContexts.length > 0 ? (
              <section className={styles.railCard}>
                <h2>Canon context</h2>
                <div className={styles.canonStack}>{model.canonContexts.map((context, index) => <CanonContext key={`${context.classification}-${index}`} context={context} locale={model.locale} presentation="expanded" />)}</div>
              </section>
            ) : null}
            {adaptationExplanation ? (
              <section className={styles.railCard}>
                <p className={styles.eyebrow}>Adaptation context</p>
                <h2>Related source-version difference</h2>
                <p className={styles.railCopy}>{adaptationExplanation.excerpt}</p>
                <Link className={styles.railLink} href={explanationRoute(adaptationExplanation.identity.localization.currentVariant.slug, model.locale)}>
                  Compare versions <ArrowRightIcon size={16} />
                </Link>
              </section>
            ) : null}
          </aside>
        </section>

        {model.relevantEvents.length > 0 ? (
          <section id="scenes-events" className={styles.section} aria-labelledby="events-heading">
            <div className={styles.sectionHeading}>
              <div>
                <p className={styles.eyebrow}>Story moments</p>
                <h2 id="events-heading">Scenes &amp; events that change the relationship</h2>
                <p>Only events connected to both Characters or explicitly linked to Relationship States are included.</p>
              </div>
              <Link
                className={styles.sectionAction}
                href={timelineRoute(model.routeFamily, titleSlug, "chronology", model.locale)}
              >
                View full story timeline <ArrowRightIcon size={16} />
              </Link>
            </div>
            <div className={styles.eventList}>{model.relevantEvents.map((preview) => <EventCard key={String(preview.event.timelineEventId)} model={model} preview={preview} />)}</div>
          </section>
        ) : null}

        <RelationshipMap model={model} />

        {model.relatedExplanations.length > 0 ? (
          <section id="related" className={styles.section} aria-labelledby="related-heading">
            <div className={styles.sectionHeading}>
              <div>
                <p className={styles.eyebrow}>Continue understanding</p>
                <h2 id="related-heading">Continue understanding their story</h2>
                <p>Editorial explanations connected to one or both Characters in {model.title.displayTitle}.</p>
              </div>
            </div>
            <div className={styles.relatedGrid}>{model.relatedExplanations.slice(0, 4).map((explanation) => <ExplanationCard key={String(explanation.identity.logicalId)} explanation={explanation} variant="standard" showCanon />)}</div>
          </section>
        ) : null}
      </PageContainer>
    </>
  );
}
