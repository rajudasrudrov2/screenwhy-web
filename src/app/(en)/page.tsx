import type { Metadata } from "next";
import { connection } from "next/server";
import { env } from "@/config/env";
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
  // In real API mode, never depend on live CMS reachability during build/prerender.
  // Mock-mode static page generation remains unchanged.
  if (env.dataSource === "api") await connection();
  const model = await loadHomepage("en-US");

  return (
    <SiteFrame locale="en-US" activePath="/">
      <Homepage model={model} />
    </SiteFrame>
  );
}
