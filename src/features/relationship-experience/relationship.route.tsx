import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { SiteFrame } from "@/components/navigation/SiteFrame";
import { brandConfig } from "@/config/brand";
import type { PublicRouteFamily } from "@/config/routes";
import { absoluteSiteUrl } from "@/lib/seo/urls";
import { siteConfig } from "@/config/site";
import { RelationshipExperiencePage } from "@/features/relationship-experience/RelationshipExperience";
import { loadRelationshipExperience } from "@/features/relationship-experience/relationship.loader";

export async function generateRelationshipMetadata(
  routeFamily: PublicRouteFamily,
  titleSlug: string,
  characterASlug: string,
  characterBSlug: string,
): Promise<Metadata> {
  const model = await loadRelationshipExperience(routeFamily, titleSlug, characterASlug, characterBSlug);
  if (!model) {
    return {
      title: "Relationship not found",
      robots: { index: false, follow: false },
    };
  }

  const metadataTitle = `${model.characterA.displayName} & ${model.characterB.displayName} Relationship Explained`;
  const description = model.relationship.summary ??
    `Understand the relationship between ${model.characterA.displayName} and ${model.characterB.displayName} in ${model.title.displayTitle}.`;
  const canonical = absoluteSiteUrl(model.canonicalPath);
  const index = siteConfig.allowIndexing && model.indexable && !model.isReverseRequest;

  return {
    title: metadataTitle,
    description,
    alternates: { canonical },
    robots: { index, follow: index },
    openGraph: {
      title: `${metadataTitle} | ${brandConfig.name}`,
      description,
      url: canonical,
      siteName: brandConfig.name,
      type: "article",
    },
  };
}

export async function renderRelationshipRoute(
  routeFamily: PublicRouteFamily,
  titleSlug: string,
  characterASlug: string,
  characterBSlug: string,
) {
  const model = await loadRelationshipExperience(routeFamily, titleSlug, characterASlug, characterBSlug);
  if (!model) return notFound();
  if (model.isReverseRequest) return permanentRedirect(model.canonicalPath);

  return (
    <SiteFrame locale="en-US" activePath={model.canonicalPath}>
      <RelationshipExperiencePage model={model} />
    </SiteFrame>
  );
}
