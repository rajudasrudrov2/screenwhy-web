import type { Metadata } from "next";
import { createTitleArchiveMetadata, renderTitleArchiveRoute, resolveArchiveSearchParams, type ArchiveRouteSearchParams } from "@/features/archive";

interface Props { readonly searchParams: ArchiveRouteSearchParams; }

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  return createTitleArchiveMetadata("movies", await resolveArchiveSearchParams(searchParams));
}

export default async function Page({ searchParams }: Props) {
  return renderTitleArchiveRoute("movies", await resolveArchiveSearchParams(searchParams));
}
