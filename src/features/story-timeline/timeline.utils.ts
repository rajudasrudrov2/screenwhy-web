import type { TimelineEvent, TimelineTemporalType } from "@/types/domain/timeline";
import type { SpoilerLevel, SpoilerMetadata } from "@/types/domain/spoiler";

export type TimelineOrderMode = "chronology" | "presentation";

export const TIMELINE_TEMPORAL_LABELS: Readonly<Record<TimelineTemporalType, string>> = {
  normal: "Story event",
  flashback: "Flashback",
  flash_forward: "Flash-forward",
  parallel: "Parallel event",
  time_loop: "Time loop",
  uncertain: "Uncertain chronology",
};

const SPOILER_ORDER: Readonly<Record<SpoilerLevel, number>> = {
  spoiler_free: 0,
  minor: 1,
  major: 2,
  full: 3,
};

export function normalizeTimelineOrder(value: string | readonly string[] | undefined): TimelineOrderMode {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === "presentation" ? "presentation" : "chronology";
}

export function timelineTemporalLabel(type: TimelineTemporalType): string {
  return TIMELINE_TEMPORAL_LABELS[type];
}

export function isProtectedTimelineEvent(event: TimelineEvent): boolean {
  return event.spoiler.level === "major" || event.spoiler.level === "full";
}

export function sortTimelineEvents(
  events: readonly TimelineEvent[],
  order: TimelineOrderMode,
): readonly TimelineEvent[] {
  return [...events].sort((left, right) =>
    order === "chronology"
      ? left.chronologyOrder - right.chronologyOrder
      : left.presentationOrder - right.presentationOrder,
  );
}

export function timelineEventAnchor(event: TimelineEvent): string {
  return `event-${event.chronologyOrder}-${event.presentationOrder}`;
}

export function strongestTimelineSpoiler(
  events: readonly TimelineEvent[],
): SpoilerMetadata | undefined {
  return [...events]
    .sort((left, right) => SPOILER_ORDER[right.spoiler.level] - SPOILER_ORDER[left.spoiler.level])[0]
    ?.spoiler;
}
