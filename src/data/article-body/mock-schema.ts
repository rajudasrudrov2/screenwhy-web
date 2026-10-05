import type { CanonContext } from "@/types/domain/canon";
import type { MediaAsset } from "@/types/domain/media";
import type { ArticleSectionSpoilerMetadata } from "@/types/domain/spoiler";

export type MockArticleInline =
  | { readonly kind: "text"; readonly text: string }
  | { readonly kind: "strong"; readonly text: string }
  | { readonly kind: "emphasis"; readonly text: string }
  | {
      readonly kind: "link";
      readonly text: string;
      readonly href: string;
      readonly external?: boolean;
    }
  | { readonly kind: "citation"; readonly citationNumber: number };

export type MockArticleContentBlock =
  | {
      readonly kind: "paragraph";
      readonly content: readonly MockArticleInline[];
    }
  | {
      readonly kind: "list";
      readonly ordered?: boolean;
      readonly items: readonly (readonly MockArticleInline[])[];
    }
  | {
      readonly kind: "blockquote";
      readonly content: readonly MockArticleInline[];
      readonly attribution?: string;
    }
  | {
      readonly kind: "image";
      readonly media: MediaAsset;
      readonly credit?: string;
    }
  | { readonly kind: "divider" }
  | {
      readonly kind: "canon_note";
      readonly context: CanonContext;
      readonly text: string;
      readonly title?: string;
    }
  | {
      readonly kind: "spoiler";
      readonly metadata: ArticleSectionSpoilerMetadata;
      readonly blocks: readonly MockArticleContentBlock[];
    };

export interface MockArticleSectionPayload {
  readonly stableKey: string;
  readonly heading: string;
  readonly level: 2 | 3 | 4;
  readonly blocks: readonly MockArticleContentBlock[];
  readonly sections?: readonly MockArticleSectionPayload[];
}

export interface MockArticleDocumentPayload {
  readonly version: "screenwhy_mock_article_v1";
  readonly intro?: readonly MockArticleContentBlock[];
  readonly sections: readonly MockArticleSectionPayload[];
}

export interface LegacyMockArticleBlock {
  readonly kind: "paragraph" | "heading";
  readonly text: string;
  readonly level?: 2 | 3;
}
