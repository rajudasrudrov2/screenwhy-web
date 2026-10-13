import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFrame } from "@/components/navigation/SiteFrame";
import { brandConfig } from "@/config/brand";
import { explanationRoute } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { getRepositories } from "@/data";
import { ExplanationDetailPage, loadExplanationDetail } from "@/features/explanation-detail";
import { LiveExplanationArticle } from "@/features/live-explanation/LiveExplanationViews";
import { getLiveExplanation, isLiveApiMode } from "@/lib/live-explanations";

export const dynamic = "force-dynamic";
interface ExplanationRouteProps { readonly params: Promise<{ readonly slug: string }> }

export async function generateMetadata({ params }: ExplanationRouteProps): Promise<Metadata> {
  const { slug } = await params;
  if (isLiveApiMode()) {
    const item = await getLiveExplanation(slug);
    if (!item) return { title: "Explanation not found", robots: { index: false, follow: false } };
    const canonical = `${siteConfig.origin}${item.publicPath}`;
    return {
      title: item.headline,
      description: item.excerpt || item.headline,
      alternates: { canonical },
      robots: { index: siteConfig.allowIndexing, follow: siteConfig.allowIndexing },
      openGraph: { title: item.headline, description: item.excerpt || item.headline, url: canonical, siteName: brandConfig.name, type: "article" },
    };
  }
  const result = await getRepositories().explanations.getBySlug({ locale: "en-US", slug });
  if (result.status !== "available") return { title: "Explanation not found", robots: { index: false, follow: false } };
  const explanation = result.value;
  const seo = explanation.seo;
  const title = seo.title ?? explanation.articleTitle;
  const description = seo.metaDescription ?? explanation.excerpt ?? explanation.quickAnswer;
  const socialImage = seo.openGraph?.image ?? seo.socialImage;
  return {
    title, description,
    alternates: { canonical: seo.canonicalUrl },
    robots: { index: siteConfig.allowIndexing && seo.index, follow: siteConfig.allowIndexing && (seo.follow ?? seo.index) },
    openGraph: {
      title: seo.openGraph?.title ?? title,
      description: seo.openGraph?.description ?? description,
      url: seo.canonicalUrl, siteName: brandConfig.name, type: "article",
      ...(socialImage ? { images: [{ url: socialImage.url, width: socialImage.width, height: socialImage.height, alt: socialImage.alt }] } : {}),
    },
  };
}

export default async function ExplanationRoutePage({ params }: ExplanationRouteProps) {
  const { slug } = await params;
  if (isLiveApiMode()) {
    const item = await getLiveExplanation(slug);
    if (!item) notFound();
    return <SiteFrame locale="en-US" activePath={explanationRoute(slug, "en-US")}>
      <LiveExplanationArticle explanation={item} />
    </SiteFrame>;
  }
  const model = await loadExplanationDetail(slug);
  if (!model) notFound();
  return <SiteFrame locale="en-US" activePath={explanationRoute(slug, "en-US")}><ExplanationDetailPage model={model} /></SiteFrame>;
}
