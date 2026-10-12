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
    !Number.isSafeInteger(result.totalPages) || result.totalPages < 0 ||
    result.totalPages > MAX_PAGES_PER_COLLECTION ||
    result.items.length > PAGE_SIZE ||
    (result.totalItems > 0 && result.totalPages === 0) ||
    (page < result.totalPages && result.items.length === 0)) {
    throw new Error("Malformed sitemap pagination or safe cap exceeded.");
  }
}

async function collectPages<T>(
  load: (page: number) => Promise<PaginatedResult<T>>,
  pathname: (item: T) => string | null,
): Promise<string[]> {
  const routes: string[] = [];
  let totalPages: number | null = null;
  for (let page = 1; page <= MAX_PAGES_PER_COLLECTION; page++) {
    const result = await load(page);
    verifyEnvelope(result, page);
    if (totalPages !== null && result.totalPages !== totalPages) {
      throw new Error("Pagination changed during sitemap collection.");
    }
    totalPages = result.totalPages;
    for (const item of result.items) {
      const path = pathname(item);
      if (path) routes.push(path);
    }
    if (page >= result.totalPages) return routes;
  }
  throw new Error("Sitemap pagination cap reached.");
}

/** Public CMS approval required; no mock fallback, no partial results on REST errors. */
export async function collectApprovedPublicSitemap(
  repositories: Pick<PublicReadRepositories, "titles" | "explanations" | "characters">,
  origin: string,
): Promise<MetadataRoute.Sitemap> {
  const base = new URL(origin);
  if (base.protocol !== "https:" && base.hostname !== "localhost") throw new Error("Unsafe sitemap origin.");
  const titles = await collectPages(
    page => repositories.titles.list({ locale: "en-US", page, pageSize: PAGE_SIZE }),
    item => {
      const slug = verifiedSlug(item);
      return slug && FAMILY.has(item.publicRouteFamily) ? "/" + item.publicRouteFamily + "/" + slug + "/" : null;
    },
  );
  const explanations = await collectPages(
    page => repositories.explanations.list({ locale: "en-US", page, pageSize: PAGE_SIZE }),
    item => {
      const slug = verifiedSlug(item);
      return slug ? "/explain/" + slug + "/" : null;
    },
  );
  const characters = await collectPages(
    page => repositories.characters.list({ locale: "en-US", page, pageSize: PAGE_SIZE }),
    item => {
      const slug = verifiedSlug(item);
      return slug ? "/characters/" + slug + "/" : null;
    },
  );
  const dynamicPaths = [...titles, ...explanations, ...characters];
  if (dynamicPaths.length > MAX_ENTITY_URLS) throw new Error("Sitemap exceeds safe cap.");
  return [...new Set([...PUBLIC_INDEXABLE_STATIC_ROUTES, ...dynamicPaths])].sort().map(path => ({
    url: new URL(path, base.origin + "/").toString(),
  }));
}

