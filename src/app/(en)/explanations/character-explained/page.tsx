import type { Metadata } from "next";
import {
  createExplanationDiscoveryMetadata,
  renderExplanationDiscoveryRoute,
  resolveExplanationDiscoverySearchParams,
  type ExplanationDiscoveryRouteSearchParams,
} from "@/features/explanation-discovery";

interface Props { readonly searchParams: ExplanationDiscoveryRouteSearchParams; }

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  return createExplanationDiscoveryMetadata(await resolveExplanationDiscoverySearchParams(searchParams), "character");
}

export default async function Page({ searchParams }: Props) {
  return renderExplanationDiscoveryRoute(await resolveExplanationDiscoverySearchParams(searchParams), "character");
}
