import type { ReactNode } from "react";
import type { CanonContext } from "@/types/domain/canon";
import type { ArticleSectionSpoilerMetadata } from "@/types/domain/spoiler";

const articleSectionIdBrand: unique symbol = Symbol("article-section-id");

export type ArticleSectionId = string & {
  readonly [articleSectionIdBrand]: "article-section-id";
};

export type ArticleHeadingLevel = 2 | 3 | 4;

export interface ArticleSectionDescriptor {
  readonly id: ArticleSectionId;
  readonly heading: string;
  readonly level: ArticleHeadingLevel;
  readonly canon?: CanonContext;
  readonly spoiler?: ArticleSectionSpoilerMetadata;
  readonly sections?: readonly ArticleSectionDescriptor[];
}

export interface ArticleSectionPresentation extends ArticleSectionDescriptor {
  readonly content: ReactNode;
}

export interface ArticleTocItem {
  readonly id: ArticleSectionId;
  readonly label: string;
  readonly level: 2 | 3;
  readonly children?: readonly ArticleTocItem[];
}

/**
 * Create a deterministic, fragment-safe section ID from a stable editorial key.
 * Callers should pass a durable key rather than a display heading so copy edits
 * do not silently change deep links.
 */
export function createArticleSectionId(stableKey: string): ArticleSectionId {
  const normalized = stableKey
    .normalize("NFKD")
    .toLowerCase()
    .trim()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");

  if (!normalized) {
    throw new Error("Article section IDs require a non-empty stable editorial key.");
  }

  return `section-${normalized}` as ArticleSectionId;
}

function flattenSections(
  sections: readonly ArticleSectionDescriptor[],
): readonly ArticleSectionDescriptor[] {
  return sections.flatMap((section) => [
    section,
    ...(section.sections ? flattenSections(section.sections) : []),
  ]);
}

export function assertUniqueArticleSectionIds(
  sections: readonly ArticleSectionDescriptor[],
): void {
  const seen = new Set<string>();

  for (const section of flattenSections(sections)) {
    if (seen.has(section.id)) {
      throw new Error(`Duplicate article section ID: ${section.id}`);
    }
    seen.add(section.id);
  }
}

function toTocItem(section: ArticleSectionDescriptor): ArticleTocItem | null {
  if (section.level !== 2 && section.level !== 3) return null;

  const nested = (section.sections ?? [])
    .map(toTocItem)
    .filter((item): item is ArticleTocItem => item !== null);

  return {
    id: section.id,
    label: section.heading,
    level: section.level,
    children: nested.length > 0 ? nested : undefined,
  };
}

export function buildArticleTocItems(
  sections: readonly ArticleSectionDescriptor[],
): readonly ArticleTocItem[] {
  assertUniqueArticleSectionIds(sections);
  return sections
    .map(toTocItem)
    .filter((item): item is ArticleTocItem => item !== null);
}
