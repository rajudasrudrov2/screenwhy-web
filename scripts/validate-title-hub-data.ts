declare const process: { exitCode?: number };

import { loadTitleHub } from "../src/features/title-hub/title-hub.loader";

function requireCheck(condition: boolean, label: string): void {
  if (!condition) throw new Error(`Title Hub data validation failed: ${label}`);
  console.log(`PASS: ${label}`);
}

async function main(): Promise<void> {
  const movie = await loadTitleHub("movies", "the-last-signal", "en-US");
  requireCheck(movie !== null, "The Last Signal resolves under its authoritative Movies route family");
  if (!movie) return;

  requireCheck(movie.title.displayTitle === "The Last Signal" && movie.title.titleType === "movie", "Current title data overrides historical design placeholder facts");
  requireCheck(movie.explanationCount === movie.explanations.length && movie.explanationCount >= 6, "Explanation count is derived from the title-specific repository result");
  requireCheck(movie.groupedExplanations.ending_explained.length >= 1, "Ending Explained coverage is available");
  requireCheck(movie.characters.length >= 2, "Character coverage resolves through CharacterRepository");
  requireCheck(movie.groupedExplanations.mystery_explained.length >= 1, "Mystery coverage is available");
  requireCheck(movie.relationships.length >= 1, "Relationship preview data resolves through StoryRepository");
  requireCheck(movie.timeline.length >= 4 && movie.timeline.every((event, index, items) => index === 0 || items[index - 1].chronologyOrder <= event.chronologyOrder), "Timeline is returned in chronology order");
  requireCheck(movie.groupedExplanations.book_vs_screen.length >= 1 && (movie.title.sourceWorks?.length ?? 0) >= 1, "Book vs Screen coverage is grounded in Source Work relationships and Explanation data");
  requireCheck(movie.groupedExplanations.what_happens_next.length >= 1, "What Happens Next coverage is available");
  requireCheck(movie.viewerQuestions.length >= 5, "Viewer questions derive from real intendedSubjectQuestion values");
  requireCheck(movie.relatedTitles.length >= 3 && movie.relatedTitles.every((item) => item.identity.logicalId !== movie.title.identity.logicalId), "Related Titles resolve through TitleRepository without duplicating the current Title");
  requireCheck(movie.canonContexts.some((context) => context.classification === "adaptation_difference" && context.scopes.length >= 2), "Adaptation Difference preserves at least two Canon scopes");
  requireCheck(movie.topics.every((topic) => topic.count > 0), "Topic navigator contains only derived non-empty topics");

  const mismatch = await loadTitleHub("tv", "the-last-signal", "en-US");
  requireCheck(mismatch === null, "Route-family mismatch fails safely instead of cross-family fallback");

  const tv = await loadTitleHub("tv", "harbor-nine", "en-US");
  requireCheck(tv?.title.titleType === "tv_series", "TV route resolves its actual fundamental Title Type");

  const anime = await loadTitleHub("anime", "the-glass-comet", "en-US");
  requireCheck(anime?.title.publicRouteFamily === "anime" && anime.title.titleType === "tv_series", "Anime route family remains distinct from fundamental TV Series Title Type");

  const drama = await loadTitleHub("k-drama", "winter-verdict", "en-US");
  requireCheck(drama?.title.publicRouteFamily === "k-drama" && drama.title.titleType === "tv_series", "K-Drama route family remains distinct from fundamental TV Series Title Type");
}

void main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
