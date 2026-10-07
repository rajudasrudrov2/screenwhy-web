import {
  createArticleSectionId,
  type ArticleSectionDescriptor,
} from "@/components/domain/article";
import type { MediaAsset } from "@/types/domain/media";

export const articlePreviewImage: MediaAsset = {
  role: "editorial_image",
  url: `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
      <rect width="1200" height="675" fill="#f1f3f6"/>
      <path d="M0 470h1200v205H0z" fill="#e6e9ee"/>
      <circle cx="350" cy="300" r="98" fill="none" stroke="#4f5bd5" stroke-width="10"/>
      <circle cx="350" cy="300" r="52" fill="none" stroke="#121722" stroke-width="5"/>
      <path d="M452 300h260" stroke="#121722" stroke-width="6"/>
      <circle cx="720" cy="300" r="13" fill="#f0b44d"/>
      <rect x="780" y="245" width="120" height="150" rx="20" fill="#687180"/>
      <rect x="940" y="280" width="100" height="115" rx="18" fill="#9aa2ae"/>
      <text x="64" y="620" font-family="Arial, sans-serif" font-size="28" fill="#414957">Fictional signal-path editorial diagram · ScreenWhy development preview</text>
    </svg>
  `)}`,
  alt: "Illustrative diagram showing a fictional signal moving from a circular transmitter toward two receiver structures.",
  width: 1200,
  height: 675,
  caption: "Illustrative editorial diagram for the fictional Last Signal preview; it is not evidence from a real film or show.",
};

export const englishArticleSections = [
  {
    id: createArticleSectionId("opening-pattern"),
    heading: "What the repeating signal actually establishes",
    level: 2,
    sections: [
      {
        id: createArticleSectionId("message-before-loop"),
        heading: "The message appears before the loop closes",
        level: 3,
      },
      {
        id: createArticleSectionId("timing-matters"),
        heading: "Why the timing matters more than the timestamp",
        level: 3,
      },
      {
        id: createArticleSectionId("long-heading-stress"),
        heading: "Why the deliberately long sequence of transmitter clues still needs to wrap cleanly across narrow reading widths",
        level: 3,
      },
    ],
  },
  {
    id: createArticleSectionId("canon-boundaries"),
    heading: "Canon, adaptation changes, and what remains interpretation",
    level: 2,
  },
  {
    id: createArticleSectionId("spoiler-reveal"),
    heading: "A later reveal that changes how the first scene reads",
    level: 2,
  },
] as const satisfies readonly ArticleSectionDescriptor[];
