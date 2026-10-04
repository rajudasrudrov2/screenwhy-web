export type MediaRole =
  | "poster"
  | "character_portrait"
  | "editorial_image"
  | "social_image"
  | "backdrop";

export interface MediaFocalPoint {
  /** Normalized 0..1 horizontal focal position. */
  readonly x: number;
  /** Normalized 0..1 vertical focal position. */
  readonly y: number;
}

export interface MediaAsset {
  readonly role: MediaRole;
  readonly url: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
  readonly caption?: string;
  readonly focalPoint?: MediaFocalPoint;
}
