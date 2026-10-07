export type EditorialPageKey =
  | "about"
  | "contact"
  | "editorialPolicy"
  | "sourcingPolicy"
  | "correctionsPolicy"
  | "aiUsagePolicy"
  | "privacy"
  | "terms"
  | "copyrightDmca";

export interface EditorialContentLink {
  readonly label: string;
  readonly href: string;
  readonly description?: string;
}

export interface EditorialCallout {
  readonly title: string;
  readonly body: string;
}

export interface EditorialSubsection {
  readonly key: string;
  readonly heading: string;
  readonly paragraphs?: readonly string[];
  readonly list?: readonly string[];
  readonly links?: readonly EditorialContentLink[];
  readonly callout?: EditorialCallout;
}

export interface EditorialSection extends EditorialSubsection {
  readonly subsections?: readonly EditorialSubsection[];
}

export interface EditorialPageDefinition {
  readonly key: EditorialPageKey;
  readonly route: string;
  readonly title: string;
  readonly eyebrow: string;
  readonly intro: string;
  readonly metaDescription: string;
  readonly lastUpdated?: string;
  readonly useToc?: boolean;
  readonly variant: "standard" | "about" | "contact";
  readonly sections: readonly EditorialSection[];
  readonly related?: readonly EditorialPageKey[];
}
