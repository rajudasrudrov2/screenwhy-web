import type { Metadata } from "next";
import { generateTitleHubMetadata, renderTitleHubRoute } from "@/features/title-hub";

interface TitleRouteProps {
  readonly params: Promise<{ readonly slug: string }>;
}

export async function generateMetadata({ params }: TitleRouteProps): Promise<Metadata> {
  const { slug } = await params;
  return generateTitleHubMetadata("tv", slug);
}

export default async function TitleRoutePage({ params }: TitleRouteProps) {
  const { slug } = await params;
  return renderTitleHubRoute("tv", slug);
}
