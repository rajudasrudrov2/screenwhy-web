import type { CanonContext } from "@/types/domain/canon";
import type { MediaAsset } from "@/types/domain/media";
import type { ArticleSectionSpoilerMetadata } from "@/types/domain/spoiler";

export type RenderableArticleInline =
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

export type RenderableArticleBlock =
  | {
      readonly kind: "paragraph";
      readonly content: readonly RenderableArticleInline[];
    }
  | {
      readonly kind: "list";
      readonly ordered: boolean;
      readonly items: readonly (readonly RenderableArticleInline[])[];
    }
  | {
      readonly kind: "blockquote";
      readonly content: readonly RenderableArticleInline[];
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
      readonly blocks: readonly RenderableArticleBlock[];
    };

export interface RenderableArticleSection {
  readonly stableKey: string;
  readonly heading: string;
  readonly level: 2 | 3 | 4;
  readonly blocks: readonly RenderableArticleBlock[];
  readonly sections?: readonly RenderableArticleSection[];
}

export interface RenderableArticleBody {
  readonly intro: readonly RenderableArticleBlock[];
  readonly sections: readonly RenderableArticleSection[];
}
