import type { Metadata } from "next";
import {
  generateRelationshipMetadata,
  renderRelationshipRoute,
} from "@/features/relationship-experience";

interface RelationshipRouteProps {
  readonly params: Promise<{
    readonly slug: string;
    readonly characterA: string;
    readonly characterB: string;
  }>;
}

export async function generateMetadata({ params }: RelationshipRouteProps): Promise<Metadata> {
  const { slug, characterA, characterB } = await params;
  return generateRelationshipMetadata("k-drama", slug, characterA, characterB);
}

export default async function RelationshipRoutePage({ params }: RelationshipRouteProps) {
  const { slug, characterA, characterB } = await params;
  return renderRelationshipRoute("k-drama", slug, characterA, characterB);
}
