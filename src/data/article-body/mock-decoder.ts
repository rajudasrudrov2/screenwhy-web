import { DataAccessError } from "@/data/errors";
import type { CanonContext, CanonScope } from "@/types/domain/canon";
import type { MediaAsset, MediaRole } from "@/types/domain/media";
import type { InstallmentId, SourceWorkId, TitleLogicalGroupId } from "@/types/domain/identity";
import type {
  ArticleSectionSpoilerMetadata,
  SourceMaterialSpoilerMetadata,
  SpoilerMetadata,
} from "@/types/domain/spoiler";
import type {
  RenderableArticleBlock,
  RenderableArticleBody,
  RenderableArticleInline,
  RenderableArticleSection,
} from "@/data/article-body/types";

const MEDIA_ROLES = new Set<MediaRole>([
  "poster",
  "character_portrait",
  "editorial_image",
  "social_image",
  "backdrop",
]);

const CANON_CLASSIFICATIONS = new Set([
  "tv_canon",
  "movie_canon",
  "novel_canon",
  "book_canon",
  "manga_canon",
  "game_canon",
  "adaptation_difference",
  "interpretation",
  "unconfirmed_speculative",
]);

function malformed(message: string): never {
  throw new DataAccessError(
    "malformed_payload",
    `The ScreenWhy mock article body is malformed: ${message}`,
    { operation: "decode-article-body", resource: "explanation-body" },
  );
}

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return malformed("expected an object");
  }
  return value as Record<string, unknown>;
}

function text(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    return malformed(`${label} must be a non-empty string`);
  }
  return value;
}

function optionalText(value: unknown, label: string): string | undefined {
  if (value === undefined) return undefined;
  return text(value, label);
}

function positiveInteger(value: unknown, label: string): number {
  if (!Number.isInteger(value) || Number(value) < 1) {
    return malformed(`${label} must be a positive integer`);
  }
  return Number(value);
}

function decodeInline(value: unknown): RenderableArticleInline {
  const item = record(value);
  const kind = item.kind;

  if (kind === "text" || kind === "strong" || kind === "emphasis") {
    return { kind, text: text(item.text, `${kind}.text`) };
  }

  if (kind === "link") {
    const href = text(item.href, "link.href");
    if (!href.startsWith("/") && !/^https?:\/\//.test(href)) {
      return malformed("link.href must be an internal path or http(s) URL");
    }
    return {
      kind,
      text: text(item.text, "link.text"),
      href,
      external: item.external === true || undefined,
    };
  }

  if (kind === "citation") {
    return {
      kind,
      citationNumber: positiveInteger(item.citationNumber, "citation.citationNumber"),
    };
  }

  return malformed("unsupported inline content kind");
}

function decodeInlineArray(value: unknown, label: string): readonly RenderableArticleInline[] {
  if (!Array.isArray(value) || value.length === 0) {
    return malformed(`${label} must be a non-empty array`);
  }
  return value.map(decodeInline);
}

function decodeCanonScope(value: unknown): CanonScope {
  const scope = record(value);
  const target = record(scope.target);
  const label = optionalText(scope.label, "canon scope label");

  if (target.kind === "title" && typeof target.titleId === "string") {
    return {
      target: { kind: "title", titleId: target.titleId as TitleLogicalGroupId },
      ...(label ? { label } : {}),
    } as CanonScope;
  }

  if (target.kind === "source_work" && typeof target.sourceWorkId === "string") {
    return {
      target: {
        kind: "source_work",
        sourceWorkId: target.sourceWorkId as SourceWorkId,
      },
      ...(label ? { label } : {}),
    } as CanonScope;
  }

  return malformed("invalid Canon scope target");
}

function decodeCanonContext(value: unknown): CanonContext {
  const context = record(value);
  if (typeof context.classification !== "string" || !CANON_CLASSIFICATIONS.has(context.classification)) {
    return malformed("unsupported Canon classification");
  }
  if (!Array.isArray(context.scopes) || context.scopes.length === 0) {
    return malformed("Canon context requires at least one scope");
  }
  if (context.classification === "adaptation_difference" && context.scopes.length < 2) {
    return malformed("Adaptation Difference requires at least two scopes");
  }
  return {
    classification: context.classification,
    scopes: context.scopes.map(decodeCanonScope),
  } as unknown as CanonContext;
}

function decodeSpoiler(value: unknown): SpoilerMetadata {
  const spoiler = record(value);
  const level = spoiler.level;
  if (level !== "spoiler_free" && level !== "minor" && level !== "major" && level !== "full") {
    return malformed("unsupported screen spoiler level");
  }
  if (spoiler.scope === undefined) return { level };
  const scope = record(spoiler.scope);
  if (scope.type === "full_title" && typeof scope.titleId === "string") {
    return { level, scope: { type: "full_title", titleId: scope.titleId as TitleLogicalGroupId } };
  }
  if (scope.type === "installment" && typeof scope.installmentId === "string") {
    return { level, scope: { type: "installment", installmentId: scope.installmentId as InstallmentId } };
  }
  if (scope.type === "season" && typeof scope.titleId === "string" && Number.isInteger(scope.seasonNumber)) {
    return {
      level,
      scope: {
        type: "season",
        titleId: scope.titleId as TitleLogicalGroupId,
        seasonNumber: Number(scope.seasonNumber),
        ...(typeof scope.installmentId === "string" ? { installmentId: scope.installmentId as InstallmentId } : {}),
      },
    };
  }
  if (scope.type === "source_work" && typeof scope.sourceWorkId === "string") {
    return { level, scope: { type: "source_work", sourceWorkId: scope.sourceWorkId as SourceWorkId } };
  }
  if (
    scope.type === "chapter" &&
    typeof scope.sourceWorkId === "string" &&
    (typeof scope.chapter === "string" || typeof scope.chapter === "number")
  ) {
    return {
      level,
      scope: {
        type: "chapter",
        sourceWorkId: scope.sourceWorkId as SourceWorkId,
        chapter: scope.chapter,
        ...(typeof scope.volume === "string" || typeof scope.volume === "number" ? { volume: scope.volume } : {}),
      },
    };
  }
  return malformed("invalid spoiler scope");
}

function decodeSourceSpoiler(value: unknown): SourceMaterialSpoilerMetadata {
  const spoiler = record(value);
  const level = spoiler.level;
  if (level !== "none" && level !== "minor" && level !== "major" && level !== "full") {
    return malformed("unsupported source-material spoiler level");
  }
  return {
    level,
    ...(typeof spoiler.sourceWorkId === "string" ? { sourceWorkId: spoiler.sourceWorkId as SourceWorkId } : {}),
    ...(typeof spoiler.volume === "string" || typeof spoiler.volume === "number" ? { volume: spoiler.volume } : {}),
    ...(typeof spoiler.chapter === "string" || typeof spoiler.chapter === "number" ? { chapter: spoiler.chapter } : {}),
  };
}

function decodeSectionSpoiler(value: unknown): ArticleSectionSpoilerMetadata {
  const item = record(value);
  return {
    ...(item.screen !== undefined ? { screen: decodeSpoiler(item.screen) } : {}),
    ...(item.sourceMaterial !== undefined ? { sourceMaterial: decodeSourceSpoiler(item.sourceMaterial) } : {}),
    ...(Array.isArray(item.canonScopes)
      ? { canonScopes: item.canonScopes.map(decodeCanonScope) }
      : {}),
  };
}

function decodeMedia(value: unknown): MediaAsset {
  const media = record(value);
  if (typeof media.role !== "string" || !MEDIA_ROLES.has(media.role as MediaRole)) {
    return malformed("unsupported media role");
  }
  const width = positiveInteger(media.width, "media.width");
  const height = positiveInteger(media.height, "media.height");
  return {
    role: media.role as MediaRole,
    url: text(media.url, "media.url"),
    alt: typeof media.alt === "string" ? media.alt : malformed("media.alt must be a string"),
    width,
    height,
    ...(typeof media.caption === "string" ? { caption: media.caption } : {}),
  };
}

function decodeBlock(value: unknown): RenderableArticleBlock {
  const block = record(value);

  if (block.kind === "paragraph") {
    return { kind: "paragraph", content: decodeInlineArray(block.content, "paragraph.content") };
  }

  if (block.kind === "list") {
    if (!Array.isArray(block.items) || block.items.length === 0) {
      return malformed("list.items must be a non-empty array");
    }
    return {
      kind: "list",
      ordered: block.ordered === true,
      items: block.items.map((item) => decodeInlineArray(item, "list item")),
    };
  }

  if (block.kind === "blockquote") {
    return {
      kind: "blockquote",
      content: decodeInlineArray(block.content, "blockquote.content"),
      ...(block.attribution !== undefined ? { attribution: text(block.attribution, "blockquote.attribution") } : {}),
    };
  }

  if (block.kind === "image") {
    return {
      kind: "image",
      media: decodeMedia(block.media),
      ...(block.credit !== undefined ? { credit: text(block.credit, "image.credit") } : {}),
    };
  }

  if (block.kind === "divider") return { kind: "divider" };

  if (block.kind === "canon_note") {
    return {
      kind: "canon_note",
      context: decodeCanonContext(block.context),
      text: text(block.text, "canon_note.text"),
      ...(block.title !== undefined ? { title: text(block.title, "canon_note.title") } : {}),
    };
  }

  if (block.kind === "spoiler") {
    if (!Array.isArray(block.blocks) || block.blocks.length === 0) {
      return malformed("spoiler.blocks must be a non-empty array");
    }
    return {
      kind: "spoiler",
      metadata: decodeSectionSpoiler(block.metadata),
      blocks: block.blocks.map(decodeBlock),
    };
  }

  return malformed("unsupported article block kind");
}

function decodeSection(value: unknown): RenderableArticleSection {
  const section = record(value);
  const level = section.level;
  if (level !== 2 && level !== 3 && level !== 4) {
    return malformed("section.level must be 2, 3 or 4");
  }
  if (!Array.isArray(section.blocks)) return malformed("section.blocks must be an array");
  const stableKey = text(section.stableKey, "section.stableKey");
  if (!/^[a-z0-9][a-z0-9-]*$/i.test(stableKey)) {
    return malformed("section.stableKey must be fragment-safe");
  }
  return {
    stableKey,
    heading: text(section.heading, "section.heading"),
    level,
    blocks: section.blocks.map(decodeBlock),
    ...(Array.isArray(section.sections)
      ? { sections: section.sections.map(decodeSection) }
      : {}),
  };
}

function decodeLegacyDocument(value: Record<string, unknown>): RenderableArticleBody {
  if (!Array.isArray(value.blocks)) return malformed("legacy body requires blocks");
  const intro: RenderableArticleBlock[] = [];
  const sections: RenderableArticleSection[] = [];
  let current: { stableKey: string; heading: string; level: 2 | 3; blocks: RenderableArticleBlock[] } | null = null;

  for (const raw of value.blocks) {
    const block = record(raw);
    if (block.kind === "paragraph") {
      const paragraph: RenderableArticleBlock = {
        kind: "paragraph",
        content: [{ kind: "text", text: text(block.text, "legacy paragraph.text") }],
      };
      if (current) current.blocks.push(paragraph);
      else intro.push(paragraph);
      continue;
    }
    if (block.kind === "heading") {
      if (current) sections.push(current);
      const heading = text(block.text, "legacy heading.text");
      const level = block.level === 3 ? 3 : 2;
      const stableKey = heading
        .normalize("NFKD")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || `section-${sections.length + 1}`;
      current = { stableKey, heading, level, blocks: [] };
      continue;
    }
    return malformed("unsupported legacy block kind");
  }
  if (current) sections.push(current);
  return { intro, sections };
}

export function decodeMockArticleBody(value: unknown): RenderableArticleBody {
  const document = record(value);

  if (document.version === "screenwhy_mock_article_v1") {
    if (!Array.isArray(document.sections)) return malformed("sections must be an array");
    return {
      intro: document.intro === undefined
        ? []
        : Array.isArray(document.intro)
          ? document.intro.map(decodeBlock)
          : malformed("intro must be an array"),
      sections: document.sections.map(decodeSection),
    };
  }

  if (Array.isArray(document.blocks)) return decodeLegacyDocument(document);

  return malformed("unsupported mock article document version");
}
