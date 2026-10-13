import type { Metadata } from "next";
import { SiteFrame } from "@/components/navigation/SiteFrame";
import { LiveExplanationListing } from "@/features/live-explanation/LiveExplanationViews";
import { getLiveExplanations, isLiveApiMode } from "@/lib/live-explanations";
import {
  createExplanationDiscoveryMetadata,
  renderExplanationDiscoveryRoute,
  resolveExplanationDiscoverySearchParams,
  type ExplanationDiscoveryRouteSearchParams,
} from "@/features/explanation-discovery";

export const dynamic = "force-dynamic";
interface Props { readonly searchParams: ExplanationDiscoveryRouteSearchParams }
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  if (isLiveApiMode()) return {
    title: "Explanations | ScreenWhy",
    description: "Published movie, TV, series and episode explanations from ScreenWhy.",
    alternates: { canonical: "/explanations/" },
  };
  return createExplanationDiscoveryMetadata(await resolveExplanationDiscoverySearchParams(searchParams));
}
export default async function Page({ searchParams }: Props) {
  if (!isLiveApiMode()) return renderExplanationDiscoveryRoute(await resolveExplanationDiscoverySearchParams(searchParams));
  // This is deliberately independent of historical Title/Canon/Source DTO requirements.
  const params = (await Promise.resolve(searchParams)) as Record<string, string | string[] | undefined>;
  const rawPage = Array.isArray(params.page) ? params.page[0] : params.page;
  const page = /^\d+$/.test(rawPage ?? "") ? Math.max(1, Number(rawPage)) : 1;
  const list = await getLiveExplanations({ page, perPage: 20 });
  return <SiteFrame locale="en-US" activePath="/explanations/">
    <LiveExplanationListing list={list} title="Explanations" />
  </SiteFrame>;
}
