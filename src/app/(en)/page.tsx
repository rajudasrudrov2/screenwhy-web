import type { Metadata } from "next";
import { connection } from "next/server";
import { env } from "@/config/env";
import { SiteFrame } from "@/components/navigation/SiteFrame";
import { brandConfig } from "@/config/brand";
import { Homepage, loadHomepage } from "@/features/homepage";
import { getLiveExplanations, isLiveApiMode } from "@/lib/live-explanations";
import { PremiumHomepage } from "@/features/homepage3/PremiumHomepage";
import { buildLiveHomepageModel } from "@/features/homepage3/live-adapter";

// Real CMS is fetched on each production visit. No demo module is imported here.
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: brandConfig.recommendedHomepageH1,
  description: `${brandConfig.brandPromise} ${brandConfig.tagline}`,
  alternates: { canonical: "/" },
  openGraph: {
    title: brandConfig.recommendedHomepageH1,
    description: `${brandConfig.brandPromise} ${brandConfig.tagline}`,
    url: "/", siteName: brandConfig.name, type: "website",
  },
};
export default async function ScreenWhyHomepage() {
  if (isLiveApiMode()) {
    await connection();
    const published = await getLiveExplanations({ perPage: 50 });
    return <SiteFrame locale="en-US" activePath="/">
      <PremiumHomepage model={buildLiveHomepageModel(published)} />
    </SiteFrame>;
  }
  if (env.dataSource === "api") await connection();
  const model = await loadHomepage("en-US");
  return <SiteFrame locale="en-US" activePath="/"><Homepage model={model} /></SiteFrame>;
}
