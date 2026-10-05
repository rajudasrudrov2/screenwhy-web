import type { Metadata } from "next";
import { SiteFrame } from "@/components/navigation/SiteFrame";
import { brandConfig } from "@/config/brand";
import { Homepage, loadHomepage } from "@/features/homepage";

export const metadata: Metadata = {
  title: brandConfig.recommendedHomepageH1,
  description: `${brandConfig.brandPromise} ${brandConfig.tagline}`,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: brandConfig.recommendedHomepageH1,
    description: `${brandConfig.brandPromise} ${brandConfig.tagline}`,
    url: "/",
    siteName: brandConfig.name,
    type: "website",
  },
};

export default async function ScreenWhyHomepage() {
  const model = await loadHomepage("en-US");

  return (
    <SiteFrame locale="en-US" activePath="/">
      <Homepage model={model} />
    </SiteFrame>
  );
}
