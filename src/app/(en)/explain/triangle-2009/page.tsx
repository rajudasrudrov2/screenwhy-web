import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { SiteFrame } from "@/components/navigation/SiteFrame";
import { siteConfig } from "@/config/site";
import { getLiveExplanation, getLiveExplanations, isLiveApiMode } from "@/lib/live-explanations";
import { LiveExplanationArticle } from "@/features/live-explanation/LiveExplanationViews";
import LegacyTrianglePreview from "../../triangle-2009-preview/page";

export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  if (!isLiveApiMode()) return { title: "Triangle (2009) Explained — Preview", robots: { index: false, follow: false } };
  const entry = await getLiveExplanation("triangle-2009");
  if (entry) return {
    title: entry.headline,
    description: entry.excerpt || entry.headline,
    alternates: { canonical: `${siteConfig.origin}${entry.publicPath}` },
    robots: { index: siteConfig.allowIndexing, follow: siteConfig.allowIndexing },
  };
  return { title: "Triangle (2009) Explained", robots: { index: false, follow: false } };
}
export default async function TriangleLegacyRoute() {
  if (!isLiveApiMode()) return <LegacyTrianglePreview />;
  const exact = await getLiveExplanation("triangle-2009");
  if (exact) return <SiteFrame locale="en-US" activePath="/explain/triangle-2009/"><LiveExplanationArticle explanation={exact} /></SiteFrame>;
  // This old vanity route must not shadow the genuine published Triangle article.
  const result = await getLiveExplanations({ q: "Triangle", perPage: 50 });
  const match = result.items.find((item) => /^Triangle\s*\(2009\)/i.test(item.headline));
  if (match) redirect(match.publicPath);
  notFound();
}
