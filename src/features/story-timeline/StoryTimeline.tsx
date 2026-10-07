import Link from "next/link";
import { CanonContext } from "@/components/domain/canon/CanonContext";
import { ExplanationCard } from "@/components/domain/cards/ExplanationCard";
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
  titleHubRoute,
  titleRoute,
} from "@/config/routes";
import type { InstallmentId } from "@/types/domain/identity";
import type { TimelineEvent } from "@/types/domain/timeline";
import type { TitleDetail } from "@/types/domain/title";
import type {
  StoryTimelineViewModel,
  TimelineEventViewModel,
} from "@/features/story-timeline/timeline.types";
import {
  isProtectedTimelineEvent,
  timelineTemporalLabel,
} from "@/features/story-timeline/timeline.utils";
import styles from "./StoryTimeline.module.css";

function installmentLabel(
  title: TitleDetail<"en-US">,
  installmentId: InstallmentId | undefined,
): string | undefined {
  if (!installmentId) return undefined;
  const installment = title.installments?.find((item) => item.installmentId === installmentId);
  if (!installment) return undefined;
  if (installment.officialTitle) return installment.officialTitle;
  if (installment.kind === "episode" && installment.episodeNumber !== undefined) {
    const season = installment.seasonNumber !== undefined ? `S${installment.seasonNumber} · ` : "";
    return `${season}Episode ${installment.episodeNumber}`;
  }
  if (installment.kind === "season" && installment.seasonNumber !== undefined) return `Season ${installment.seasonNumber}`;
  if (installment.kind === "part" && installment.partNumber !== undefined) return `Part ${installment.partNumber}`;
  if (installment.kind === "special") return "Special";
  return "Story installment";
}

function comparisonNote(event: TimelineEvent, order: StoryTimelineViewModel["order"]): string | null {
  if (event.chronologyOrder === event.presentationOrder) return null;
  return order === "chronology"
    ? `Shown at presentation position ${event.presentationOrder}.`
    : `Story chronology position ${event.chronologyOrder}.`;
}

function EventCharacters({ preview }: { readonly preview: TimelineEventViewModel }) {
  if (preview.characters.length === 0) return null;
  return (
    <div className={styles.characterLinks} aria-label="Characters in this event">
      {preview.characters.map((character) => (
        <Link
          key={String(character.identity.logicalId)}
          href={characterRoute(character.identity.localization.currentVariant.slug, "en-US")}
        >
          {character.displayName}
        </Link>
      ))}
    </div>
  );
}

function RelationshipLinks({ preview }: { readonly preview: TimelineEventViewModel }) {
  if (preview.relationshipLinks.length === 0) return null;
  return (
    <div className={styles.relationshipLinks} aria-label="Relationships connected to this event">
      {preview.relationshipLinks.map((item) => (
        <Link key={String(item.relationship.relationshipId)} href={item.href}>
          {item.label} <ArrowRightIcon size={15} />
        </Link>
      ))}
    </div>
  );
}

function RevealedEventContent({
  model,
  preview,
}: {
  readonly model: StoryTimelineViewModel;
  readonly preview: TimelineEventViewModel;
}) {
  const event = preview.event;
  const installment = installmentLabel(model.title, event.installmentId);
  const comparison = comparisonNote(event, model.order);
  return (
    <div className={styles.eventRevealed}>
      <div className={styles.eventHeadingRow}>
        <div className={styles.eventHeadingCopy}>
          <div className={styles.eventEyebrowRow}>
            <span className={styles.temporalBadge}>{timelineTemporalLabel(event.temporalType)}</span>
            {installment ? <span className={styles.installmentBadge}>{installment}</span> : null}
          </div>
          {event.relativeChronologyLabel ? <p className={styles.relativeLabel}>{event.relativeChronologyLabel}</p> : null}
          <h3>{event.localizedText?.label ?? "Story event"}</h3>
        </div>
        <div className={styles.orderNumbers} aria-label="Timeline order positions">
          <span>Chronology {event.chronologyOrder}</span>
          <span>Shown {event.presentationOrder}</span>
        </div>
      </div>

      {event.localizedText?.description ? <p className={styles.eventDescription}>{event.localizedText.description}</p> : null}
      {comparison ? <p className={styles.comparisonNote}>{comparison}</p> : null}
      {event.temporalType === "uncertain" ? (
        <p className={styles.uncertainNote}>The exact timing is intentionally uncertain in the current story data.</p>
      ) : null}
      {event.locationLabel ? <p className={styles.locationLine}>Location · {event.locationLabel}</p> : null}

      <div className={styles.eventContexts}>
        <CanonContext context={event.canon} locale={model.locale} presentation="compact" />
        <SpoilerMarker metadata={event.spoiler} locale={model.locale} scopeLabel={model.title.displayTitle} />
      </div>

      <EventCharacters preview={preview} />

      <div className={styles.eventLinks}>
        {preview.relatedExplanation ? (
          <Link
            className={styles.editorialLink}
            href={explanationRoute(preview.relatedExplanation.identity.localization.currentVariant.slug, model.locale)}
          >
            Read related explanation <ArrowRightIcon size={16} />
          </Link>
        ) : null}
        <RelationshipLinks preview={preview} />
      </div>
    </div>
  );
}

function TimelineEventCard({
  model,
  preview,
  index,
}: {
  readonly model: StoryTimelineViewModel;
  readonly preview: TimelineEventViewModel;
  readonly index: number;
}) {
  const event = preview.event;
  const protectedEvent = isProtectedTimelineEvent(event);
  return (
    <li id={preview.anchorId} className={styles.timelineItem}>
      <span className={styles.timelineIndex} aria-label={`Timeline event ${index + 1}`}>{index + 1}</span>
      <article className={`${styles.eventCard} ${protectedEvent ? styles.protectedCard : ""}`}>
        {protectedEvent ? (
          <>
            <div className={styles.protectedIntro}>
              <p className={styles.protectedMeta}>Timeline event {index + 1}</p>
              <h3>Protected story event</h3>
              <p>Details, Characters and temporal context stay hidden until you choose to reveal this major story event.</p>
            </div>
            <SpoilerDisclosure metadata={event.spoiler} locale={model.locale} scopeLabel={model.title.displayTitle}>
              <RevealedEventContent model={model} preview={preview} />
            </SpoilerDisclosure>
          </>
        ) : (
          <RevealedEventContent model={model} preview={preview} />
        )}
      </article>
    </li>
  );
}

function OrderSwitch({ model }: { readonly model: StoryTimelineViewModel }) {
  return (
    <nav className={styles.orderSwitch} aria-label="Timeline order">
      <Link
        className={`${styles.orderOption} ${model.order === "chronology" ? styles.orderActive : ""}`}
        href={model.chronologyPath}
        aria-current={model.order === "chronology" ? "page" : undefined}
      >
        <strong>Story Chronology</strong>
        <span>When events happen in the story world</span>
      </Link>
      <Link
        className={`${styles.orderOption} ${model.order === "presentation" ? styles.orderActive : ""}`}
        href={model.presentationPath}
        aria-current={model.order === "presentation" ? "page" : undefined}
      >
        <strong>As Shown / Presentation Order</strong>
        <span>When viewers are shown each event</span>
      </Link>
    </nav>
  );
}

function safeJumpLabel(preview: TimelineEventViewModel, index: number): string {
  return isProtectedTimelineEvent(preview.event)
    ? `Protected event ${index + 1}`
    : preview.event.localizedText?.label ?? `Story event ${index + 1}`;
}

function TimelineRail({ model }: { readonly model: StoryTimelineViewModel }) {
  const safeTemporalTypes = [...new Set(
    model.events
      .filter((preview) => !isProtectedTimelineEvent(preview.event))
      .map((preview) => preview.event.temporalType),
  )];

  return (
    <aside className={styles.sideRail} aria-label="Timeline guidance">
      <section className={styles.railCard}>
        <h2>How to read this timeline</h2>
        <ol className={styles.guideList}>
          <li><strong>Story order first</strong><span>Chronology shows when events happen in the story world.</span></li>
          <li><strong>Presentation stays separate</strong><span>The switch above shows when viewers encounter those events.</span></li>
          <li><strong>Spoilers stay scoped</strong><span>Major and full event details remain behind the existing disclosure system.</span></li>
        </ol>
      </section>

      <section className={styles.railCard}>
        <h2>Jump to</h2>
        <nav className={styles.jumpList} aria-label="Timeline events">
          {model.events.map((preview, index) => (
            <a href={`#${preview.anchorId}`} key={preview.anchorId}>
              <span>{safeJumpLabel(preview, index)}</span>
              <span aria-hidden="true">→</span>
            </a>
          ))}
        </nav>
      </section>

      {safeTemporalTypes.length > 0 ? (
        <section className={styles.railCard}>
          <h2>Temporal labels</h2>
          <div className={styles.temporalLegend}>
            {safeTemporalTypes.map((type) => <span key={type}>{timelineTemporalLabel(type)}</span>)}
          </div>
        </section>
      ) : null}

      {model.canonContexts.length > 0 ? (
        <section className={styles.railCard}>
          <h2>Canon context</h2>
          <div className={styles.canonStack}>
            {model.canonContexts.map((context, index) => (
              <CanonContext key={`${context.classification}-${index}`} context={context} locale={model.locale} presentation="expanded" />
            ))}
          </div>
        </section>
      ) : null}
    </aside>
  );
}

export function StoryTimelinePage({ model }: { readonly model: StoryTimelineViewModel }) {
  const titleSlug = model.title.identity.localization.currentVariant.slug;
  const nonLinearCount = model.chronologicalEvents.filter(
    (event) => event.chronologyOrder !== event.presentationOrder,
  ).length;
  const orderHeading = model.order === "chronology" ? "Story Chronology" : "Presentation Order";

  return (
    <>
      <PageContainer className={styles.page}>
        <div className={styles.breadcrumbWrap}>
          <Breadcrumbs items={[
            { label: "Home", href: "/" },
            { label: routeFamilyLabel(model.routeFamily, model.locale), href: titleHubRoute(model.routeFamily, model.locale) },
            { label: model.title.displayTitle, href: titleRoute(model.routeFamily, titleSlug, model.locale) },
            { label: "Story Timeline" },
          ]} />
        </div>

        <section className={styles.hero} aria-labelledby="timeline-heading">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Story Timeline</p>
            <h1 id="timeline-heading">{model.title.displayTitle} Story Timeline</h1>
            <p className={styles.heroIntro}>Key events ordered by when they happen in the story world, with presentation order kept separate when the storytelling moves through time.</p>
            <div className={styles.heroContexts}>
              {model.canonContexts[0] ? <CanonContext context={model.canonContexts[0]} locale={model.locale} presentation="compact" /> : null}
              {model.strongestSpoiler ? <SpoilerMarker metadata={model.strongestSpoiler} locale={model.locale} scopeLabel={model.title.displayTitle} /> : null}
            </div>
          </div>
          <aside className={styles.currentTimeline} aria-label="Current timeline view">
            <span>Current timeline</span>
            <strong>{orderHeading}</strong>
            <p>{model.events.length} {model.events.length === 1 ? "event" : "events"}{nonLinearCount > 0 ? ` · ${nonLinearCount} nonlinear ${nonLinearCount === 1 ? "position" : "positions"}` : ""}</p>
          </aside>
        </section>

        {model.strongestSpoiler && (model.strongestSpoiler.level === "major" || model.strongestSpoiler.level === "full") ? (
          <div className={styles.heroWarning}>
            <SpoilerWarning
              metadata={model.strongestSpoiler}
              locale={model.locale}
              scopeLabel={model.title.displayTitle}
              variant="scoped"
              description="Major story events stay protected until you choose to reveal them."
            />
          </div>
        ) : null}

        <OrderSwitch model={model} />

        <section className={styles.orderNote} aria-labelledby="order-note-heading">
          <h2 id="order-note-heading">{orderHeading}</h2>
          <p>
            <strong>Chronology</strong> means when events happen in the story world. <strong>Presentation</strong> means the order viewers are shown those events.
          </p>
        </section>

        <div className={styles.timelineLayout}>
          <section className={styles.timelineColumn} aria-labelledby="timeline-list-heading">
            <div className={styles.sectionHeading}>
              <p className={styles.eyebrow}>{model.order === "chronology" ? "What actually happened first" : "How the story was shown"}</p>
              <h2 id="timeline-list-heading">{orderHeading}</h2>
            </div>
            <ol className={styles.timelineList}>
              {model.events.map((preview, index) => (
                <TimelineEventCard key={String(preview.event.timelineEventId)} model={model} preview={preview} index={index} />
              ))}
            </ol>
          </section>
          <TimelineRail model={model} />
        </div>
      </PageContainer>

      {model.relatedExplanations.length > 0 ? (
        <section className={styles.relatedBand} aria-labelledby="timeline-related-heading">
          <PageContainer className={styles.relatedInner}>
            <div className={styles.relatedHeading}>
              <p className={styles.eyebrow}>Keep understanding the sequence</p>
              <h2 id="timeline-related-heading">Explanations connected to the timeline</h2>
              <p>Editorial explanations directly connected to Timeline events or the Title&apos;s Timeline explanation layer.</p>
            </div>
            <div className={styles.relatedGrid}>
              {model.relatedExplanations.slice(0, 4).map((explanation) => (
                <ExplanationCard key={String(explanation.identity.logicalId)} explanation={explanation} variant="standard" showCanon />
              ))}
            </div>
          </PageContainer>
        </section>
      ) : null}
    </>
  );
}
