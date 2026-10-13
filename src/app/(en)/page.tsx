import type { Metadata } from "next";
import { connection } from "next/server";
import { env } from "@/config/env";
import { SiteFrame } from "@/components/navigation/SiteFrame";
import { brandConfig } from "@/config/brand";
import { Homepage, loadHomepage } from "@/features/homepage";
import { getLiveExplanations, isLiveApiMode } from "@/lib/live-explanations";
import { LiveExplanationListing } from "@/features/live-explanation/LiveExplanationViews";

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
    const latest = await getLiveExplanations({ perPage: 9 });
    return <SiteFrame locale="en-US" activePath="/">
      <LiveExplanationListing list={latest} title="The Why Behind What You Watch." pagination={false} />
    </SiteFrame>;
  }
  if (env.dataSource === "api") await connection();
  const model = await loadHomepage("en-US");
  return <SiteFrame locale="en-US" activePath="/"><Homepage model={model} /></SiteFrame>;
}
