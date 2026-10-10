import assert from "node:assert/strict";
import { collectApprovedPublicSitemap } from "../../src/lib/seo/sitemap-public";
import type { PublicReadRepositories } from "../../src/data/repositories/contracts";

type Kind = "title" | "explanation" | "character";
type FakeRecord = Record<string, unknown>;
function record(kind: Kind, slug: string, verification = "approved", published = true): FakeRecord {
  return {
    identity: { kind, localization: {
      currentVariant: { publicationState: published ? "published" : "draft", published, locale: "en-US", slug }
    }},
    verification: { state: verification },
    ...(kind === "title" ? { publicRouteFamily: "movies" } : {})
  };
}
function page(items: readonly FakeRecord[], at = 1, pages = items.length ? 1 : 0, size = 50) {
  return { items, page: at, pageSize: size, totalPages: pages, totalItems: pages * items.length };
}
function repos(
  titles: (p: number) => Promise<ReturnType<typeof page>>,
  explanations: (p: number) => Promise<ReturnType<typeof page>>,
  characters: (p: number) => Promise<ReturnType<typeof page>>,
) {
  return { titles: { list: ({page: p}: {page: number}) => titles(p) },
    explanations: { list: ({page: p}: {page: number}) => explanations(p) },
    characters: { list: ({page: p}: {page: number}) => characters(p) }
  } as unknown as Pick<PublicReadRepositories, "titles" | "explanations" | "characters">;
}
async function main() {
let passed = 0;
async function check(label: string, f: () => Promise<void>) ¶»§q«^