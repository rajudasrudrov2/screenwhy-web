import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFrame } from "@/components/navigation/SiteFrame";
import { brandConfig } from "@/config/brand";
import type { PublicRouteFamily } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { StoryTimelinePage } from "@/features/story-timeline/StoryTimeline";
import { loadStoryTimeline } from "@/features/story-timeline/timeline.loader";
import { normalizeTimelineOrder } from "@/features/story-timeline/timeline.utils";
import { absoluteSiteUrl } from "@/lib/seo/urls";

export interface TimelineRouteSearchParams {
  readonly order?: string | readonly string[];
}

export async function generateTimelineMetadata(
  routeFamily: PublicRouteFamily,
  titleSlug: string,
  searchParams: TimelineRouteSearchParams = {},
): Promise<Metadata> {
  const order = normalizeTimelineOrder(searchParams.order);
  const model = await loadStoryTimeline(routeFamily, titleSlug, order);
  if (!model) {
    return {
      title: "Story timeline not found",
      robots: { index: false, follow: false },
    };
  }

  const metadataTitle = `${model.title.displayTitle} Story Timeline Explained`;
  const description = `Understand the story chronology of ${model.title.displayTitle}, including when events happen and how that differs from the order viewers are shown them.`;
  const canonical = absoluteSiteUrl(model.canonicalPath);
  const hasOrderQuery = searchParams.order !== undefined;
  const index = siteConfig.allowIndexing && model.indexable && !hasOrderQuery;

  return {
    title: metadataTitle,
    description,
    alternates: { canonical },
    robots: { index, follow: index || model.indexable },
    openGraph: {
      title: `${metadataTitle} | ${brandConfig.name}`,
      description,
      url: canonical,
      siteName: brandConfig.name,
      type: "article",
    },
  };
}

export async function renderTimelineRoute(
  routeFamily: PublicRouteFamily,
  titleSlug: string,
  searchParams: TimelineRouteSearchParams = {},
) {
  const order = normalizeTimelineOrder(searchParams.order);
  const model = await loadStoryTimeline(routeFamily, titleSlug, order);
  if (!model) return notFound();

  return (
    <SiteFrame locale="en-US" activePath={model.canonicalPath}>
      <StoryTimelinePage model={model} />
    </SiteFrame>
  );
}
