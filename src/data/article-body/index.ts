import { env } from "@/config/env";
import { DataAccessError } from "@/data/errors";
import { decodeApiArticleBody, type PublicArticleContext } from "@/data/article-body/api-decoder";
import type { ArticleBodyDocument } from "@/types/domain/explanation";
import type { PublicCitation } from "@/types/domain/source";
import { decodeMockArticleBody } from "@/data/article-body/mock-decoder";
import type {
  RenderableArticleBlock,
  RenderableArticleBody,
  RenderableArticleSection,
} from "@/data/article-body/types";

export type {
  RenderableArticleBlock,
  RenderableArticleBody,
  RenderableArticleInline,
  RenderableArticleSection,
} from "@/data/article-body/types";
export { decodeMockArticleBody } from "@/data/article-body/mock-decoder";

/**
 * Data-source-specific article body mapping boundary. The public domain keeps
 * ArticleBodyDocument opaque; only this module inspects the mock payload.
 * The API branch deliberately fails closed until the CMS article contract is locked.
 */
export function getRenderableArticleBody(
  document: ArticleBodyDocument,
  context?: PublicArticleContext,
): RenderableArticleBody {
  if (env.dataSource === "mock") {
    return decodeMockArticleBody(document as unknown);
  }

  if(!context) throw new DataAccessError("malformed_payload","Article ownership context is required for public API rendering.");
  return decodeApiArticleBody(document as unknown, context);
}

function collectCitationNumbersFromBlocks(
  blocks: readonly RenderableArticleBlock[],
  target: number[],
): void {
  for (const block of blocks) {
    if (block.kind === "paragraph" || block.kind === "blockquote") {
      for (const inline of block.content) {
        if (inline.kind === "citation") target.push(inline.citationNumber);
      }
      continue;
    }

    if (block.kind === "list") {
      for (const item of block.items) {
        for (const inline of item) {
          if (inline.kind === "citation") target.push(inline.citationNumber);
        }
      }
      continue;
    }

    if (block.kind === "spoiler") {
      collectCitationNumbersFromBlocks(block.blocks, target);
    }
  }
}

function collectSectionIds(
  sections: readonly RenderableArticleSection[],
  target: Set<string>,
): void {
  for (const section of sections) {
    target.add(`section-${section.stableKey}`);
    if (section.sections) collectSectionIds(section.sections, target);
  }
}

/** Ensures renderable inline evidence can always resolve to public source entries. */
export function assertArticleEvidenceIntegrity(
  body: RenderableArticleBody,
  citations: readonly PublicCitation[],
): void {
  const publicCitations = citations.filter((citation) => citation.publicVisibility === true);
  const citationNumbers: number[] = [];
  collectCitationNumbersFromBlocks(body.intro, citationNumbers);
  for (const section of body.sections) {
    collectCitationNumbersFromBlocks(section.blocks, citationNumbers);
    if (section.sections) {
      const walk = (nested: readonly RenderableArticleSection[]) => {
        for (const child of nested) {
          collectCitationNumbersFromBlocks(child.blocks, citationNumbers);
          if (child.sections) walk(child.sections);
        }
      };
      walk(section.sections);
    }
  }

  for (const number of citationNumbers) {
    if (number < 1 || number > publicCitations.length) {
      throw new DataAccessError(
        "malformed_payload",
        "The ScreenWhy article body references a citation that is not publicly available.",
        { operation: "validate-article-evidence", resource: "explanation-body" },
      );
    }
  }

  const sectionIds = new Set<string>();
  collectSectionIds(body.sections, sectionIds);
  for (const citation of publicCitations) {
    if (citation.sectionAnchor && !sectionIds.has(citation.sectionAnchor)) {
      throw new DataAccessError(
        "malformed_payload",
        "The ScreenWhy citation references an article section that does not exist.",
        { operation: "validate-article-evidence", resource: "explanation-body" },
      );
    }
  }
}
