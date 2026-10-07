import type { Metadata } from "next";
import { createCharacterArchiveMetadata, renderCharacterArchiveRoute, resolveArchiveSearchParams, type ArchiveRouteSearchParams } from "@/features/archive";

interface Props { readonly searchParams: ArchiveRouteSearchParams; }

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  return createCharacterArchiveMetadata(await resolveArchiveSearchParams(searchParams));
}

export default async function Page({ searchParams }: Props) {
  return renderCharacterArchiveRoute(await resolveArchiveSearchParams(searchParams));
}
