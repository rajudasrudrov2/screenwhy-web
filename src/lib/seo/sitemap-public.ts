import type { MetadataRoute } from "next";
import type { PublicReadRepositories } from "@/data/repositories/contracts";
import type { PaginatedResult } from "@/data/repositories/pagination";
import { PUBLIC_INDEXABLE_STATIC_ROUTES, PUBLIC_ROUTE_FAMILIES } from "@/config/routes";
import type { VerificationMetadata } from "@/types/domain/editorial";

const PAGE_SIZE = 50;
const MAX_PAGES_PER_COLLECTION = 10;
const MAX_ENTITY_URLS = 1500;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const FAMILY = new Set<string>(PUBLIC_ROUTE_FAMILIES);

type PublicRecord = {
  readonly identity: {
    readonly localization: {
      readonly currentVariant: { readonly publicationState: string; readonly published: boolean; readonly locale: string; readonly slug: string };
    };
  };
  readonly verification: VerificationMetadata;
};

function verifiedSlug(record: PublicRecord): string | null {
  if (record.verification.state !== "approved") return null;
  const variant = record.identity.localization.currentVariant;
  if (variant.publicationState !== "published" || !variant.published || variant.locale !== "en-US") return null;
  if (!SLUG.test(variant.slug)) return null;
  return variant.slug;
}

function verifyEnvelope<T>(result: PaginatedResult<T>, page: number): void {
  if (!result || !Array.isArray(result.items) ||
    result.page !== page || result.pageSize !== PAGE_SIZE ||
    !Number.isSafeInteger(result.totalItems) || result.totalItems < 0 ||
    !Number.isSafeInteger(result.totalPages) || ¶»§q«^