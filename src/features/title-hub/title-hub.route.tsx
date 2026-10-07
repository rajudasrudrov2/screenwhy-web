import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFrame } from "@/components/navigation/SiteFrame";
import { brandConfig } from "@/config/brand";
import { titleRoute, type PublicRouteFamily } from "@/config/routes";
import { getRepositories } from "@/data";
import { TitleHubPage } from "@/features/title-hub/TitleHub";
import { loadTitleHub } from "@/features/title-hub/title-hub.loader";

export async function generateTitleHubMetadata(
  routeFamily: PublicRouteFamily,
  slug: string,
): Promise<Metadata> {
  const repositories = getRepositories();
  const result = await repositories.titles.getBySlug({ locale: "en-US", routeFamily, slug });

  if (result.status !== "available") {
    return { title: "Title not found", robots: { index: false, follow: false } };
  }

  const title = result.value;
  const seo = title.seo;
  const metadataTitle = seo.title ?? `${title.displayTitle}, Explained`;
  const description = seo.metaDescription ?? title.spoilerFreePremise;
  const socialImage = seo.openGraph?.image ?? seo.socialImage;

  return {
    title: metadataTitle,
    description,
    alternates: {
      canonical: seo.canonicalUrl,
    },
    robots: { index: seo.index, follow: seo.follow ?? seo.index },
    openGraph: {
      title: seo.openGraph?.title ?? metadataTitle,
      description: seo.openGraph?.description ?? description,
      url: seo.canonicalUrl,
      siteName: brandConfig.name,
      type: "website",
      ...(socialImage
        ? { images: [{ url: socialImage.url, width: socialImage.width, height: socialImage.height, alt: socialImage.alt }] }
        : {}),
    },
  };
}

export async function renderTitleHubRoute(routeFamily: PublicRouteFamily, slug: string) {
  const model = await loadTitleHub(routeFamily, slug, "en-US");
  if (!model) return notFound();

  return (
    <SiteFrame locale="en-US" activePath={titleRoute(routeFamily, slug, "en-US")}>
      <TitleHubPage model={model} />
    </SiteFrame>
  );
}
