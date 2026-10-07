import type { Metadata } from "next";
import {
  generateTimelineMetadata,
  renderTimelineRoute,
  type TimelineRouteSearchParams,
} from "@/features/story-timeline";

interface TimelineRouteProps {
  readonly params: Promise<{ readonly slug: string }>;
  readonly searchParams: Promise<TimelineRouteSearchParams>;
}

export async function generateMetadata({ params, searchParams }: TimelineRouteProps): Promise<Metadata> {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  return generateTimelineMetadata("anime", slug, query);
}

export default async function TimelineRoutePage({ params, searchParams }: TimelineRouteProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  return renderTimelineRoute("anime", slug, query);
}
