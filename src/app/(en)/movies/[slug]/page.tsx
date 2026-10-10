import type { Metadata } from "next";
import { generateTitleHubMetadata, loadTitleHub, renderTitleHubRoute } from "@/features/title-hub";
import { TriangleMovieHub } from "@/features/triangle-preview/TriangleMovieHub";

interface TitleRouteProps {
  readonly params: Promise<{ readonly slug: string }>;
}

/**
 * Once the verified WordPress Title is available through the normal repository,
 * render its real Title Hub. Until then, keep this reading preview separate
 * from CMS-published content and permanently unindexed.
 */
async function needsTrianglePreview(slug: string): Promise<boolean> {
  if (slug !== "triangle") return false;
  const model = await loadTitleHub("movies", slug, "en-US");
  return model === null;
}

export async function generateMetadata({ params }: TitleRouteProps): Promise<Metadata> {
  const { slug } = await params;
  if (await needsTrianglePreview(slug)) {
    return {
      title: "Triangle (2009) — Movie Guide and Ending Explained | ScreenWhy",
      description: "Explore the time loop and multiple versions of Jess in Triangle (2009). Read the complete, full-spoiler explanation.",
      robots: { index: false, follow: false, noarchive: true },
      alternates: { canonical: "/movies/triangle/" },
    };
  }
  return generateTitleHubMetadata("movies", slug);
}

export default async function TitleRoutePage({ params }: TitleRouteProps) {
  const { slug } = await params;
  if (await needsTrianglePreview(slug)) return <TriangleMovieHub />;
  return renderTitleHubRoute("movies", slug);
}
