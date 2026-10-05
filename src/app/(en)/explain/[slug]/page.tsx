import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFrame } from "@/components/navigation/SiteFrame";
import { brandConfig } from "@/config/brand";
import { explanationRoute } from "@/config/routes";
import { getRepositories } from "@/data";
import {
  ExplanationDetailPage,
  loadExplanationDetail,
} from "@/features/explanation-detail";

interface ExplanationRouteProps {
  readonly params: Promise<{ readonly slug: string }>;
}

export async function generateMetadata({ params }: ExplanationRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const repositories = getRepositories();
  const result = await repositories.explanations.getBySlug({
    locale: "en-US",
    slug,
  });

  if (result.status !== "available") {
    return {
      title: "Explanation not found",
      robots: { index: false, follow: false },
    };
  }

  const explanation = result.value;
  const seo = explanation.seo;
  const title = seo.title ?? explanation.articleTitle;
  const description = seo.metaDescription ?? explanation.excerpt ?? explanation.quickAnswer;
  const socialImage = seo.openGraph?.image ?? seo.socialImage;

  return {
    title,
    description,
    alternates: {
      canonical: seo.canonicalUrl,
    },
    robots: {
      index: seo.index,
      follow: seo.follow ?? seo.index,
    },
    openGraph: {
      title: seo.openGraph?.title ?? title,
      description: seo.openGraph?.description ?? description,
      url: seo.canonicalUrl,
      siteName: brandConfig.name,
      type: "article",
      ...(socialImage
        ? {
            images: [
              {
                url: socialImage.url,
                width: socialImage.width,
                height: socialImage.height,
                alt: socialImage.alt,
              },
            ],
          }
        : {}),
    },
  };
}

export default async function ExplanationRoutePage({ params }: ExplanationRouteProps) {
  const { slug } = await params;
  const model = await loadExplanationDetail(slug);

  if (!model) notFound();

  return (
    <SiteFrame
      locale="en-US"
      activePath={explanationRoute(slug, "en-US")}
    >
      <ExplanationDetailPage model={model} />
    </SiteFrame>
  );
}
