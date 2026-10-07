import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFrame } from "@/components/navigation/SiteFrame";
import { brandConfig } from "@/config/brand";
import { characterRoute } from "@/config/routes";
import { getRepositories } from "@/data";
import { CharacterDetailPage, loadCharacterDetail } from "@/features/character-detail";

interface CharacterRouteProps {
  readonly params: Promise<{ readonly slug: string }>;
}

export async function generateMetadata({ params }: CharacterRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const repositories = getRepositories();
  const result = await repositories.characters.getBySlug({
    locale: "en-US",
    slug,
  });

  if (result.status !== "available") {
    return {
      title: "Character not found",
      robots: { index: false, follow: false },
    };
  }

  const character = result.value;
  const seo = character.seo;
  const title = seo.title ?? `${character.displayName}, Explained`;
  const description = seo.metaDescription ?? character.spoilerFreeDescription ?? `Understand ${character.displayName} on ScreenWhy.`;
  const socialImage = seo.openGraph?.image ?? seo.socialImage ?? character.portrait;

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
      type: "website",
      ...(socialImage
        ? {
            images: [{
              url: socialImage.url,
              width: socialImage.width,
              height: socialImage.height,
              alt: socialImage.alt,
            }],
          }
        : {}),
    },
  };
}

export default async function CharacterRoutePage({ params }: CharacterRouteProps) {
  const { slug } = await params;
  const model = await loadCharacterDetail(slug);
  if (!model) notFound();

  return (
    <SiteFrame locale="en-US" activePath={characterRoute(slug, "en-US")}>
      <CharacterDetailPage model={model} />
    </SiteFrame>
  );
}
