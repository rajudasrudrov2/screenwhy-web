import type { PublicCitation, PublicSource } from "@/types/domain/source";
import type { SourceId } from "@/types/domain/identity";

export interface CitationRegistryEntry {
  readonly number: number;
  readonly markerId: string;
  readonly sourceAnchorId: string;
  readonly citation: PublicCitation;
}

export interface SourceEvidenceGroup {
  readonly source: PublicSource;
  readonly sourceAnchorId: string;
  readonly citations: readonly CitationRegistryEntry[];
}

export interface CitationRegistry {
  readonly citations: readonly CitationRegistryEntry[];
  readonly sources: readonly SourceEvidenceGroup[];
}

function hashString(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

/**
 * Stable public fragment for a source without exposing the raw internal SourceId
 * or deriving identity from a mutable display title.
 */
export function createSourceAnchorId(sourceId: SourceId): string {
  return `source-${hashString(String(sourceId))}`;
}

export function createCitationMarkerId(number: number): string {
  if (!Number.isInteger(number) || number < 1) {
    throw new Error("Citation numbers must be positive integers.");
  }
  return `citation-${number}`;
}

/**
 * Citation order is owned by the composition layer. This helper preserves input
 * order, assigns deterministic numbering, and deduplicates source presentation
 * by SourceId while retaining every claim relationship.
 */
export function createCitationRegistry(
  citations: readonly PublicCitation[],
): CitationRegistry {
  const publicCitations = citations.filter(
    (citation) => citation.publicVisibility === true,
  );

  const registryEntries = publicCitations.map((citation, index) => ({
    number: index + 1,
    markerId: createCitationMarkerId(index + 1),
    sourceAnchorId: createSourceAnchorId(citation.source.sourceId),
    citation,
  }));

  const groups = new Map<string, SourceEvidenceGroup>();
  for (const entry of registryEntries) {
    const key = String(entry.citation.source.sourceId);
    const existing = groups.get(key);
    if (existing) {
      groups.set(key, {
        ...existing,
        citations: [...existing.citations, entry],
      });
      continue;
    }

    groups.set(key, {
      source: entry.citation.source,
      sourceAnchorId: entry.sourceAnchorId,
      citations: [entry],
    });
  }

  return {
    citations: registryEntries,
    sources: [...groups.values()],
  };
}
