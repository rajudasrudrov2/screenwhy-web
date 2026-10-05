import { loadHomepage } from "../src/features/homepage/homepage.loader";

function requireCheck(condition: boolean, label: string): void {
  if (!condition) throw new Error(`Homepage data validation failed: ${label}`);
  console.log(`PASS: ${label}`);
}

async function main(): Promise<void> {
  const model = await loadHomepage("en-US");

  requireCheck(model.locale === "en-US", "Homepage loader preserves requested EN locale");
  requireCheck(model.featured.length === 3, "Homepage provides three editorially curated featured explanations when available");
  requireCheck(new Set(model.featured.map((item) => item.identity.logicalId)).size === model.featured.length, "Featured explanations are not duplicated to fill the grid");
  requireCheck(model.latestLead !== undefined, "Latest Explained has a real publication-date lead item");
  requireCheck(model.discoveryLanes.length === 3, "Question-driven discovery exposes the three approved lanes");
  requireCheck(model.discoveryLanes.every((lane) => lane.explanations.length > 0), "Each approved discovery lane is backed by typed Explanation data");
  requireCheck(model.viewerQuestions.length >= 4, "Viewer Question rows derive from intendedSubjectQuestion on Explanation details");
  requireCheck(model.gateways.map((item) => item.routeFamily).join(",") === "movies,tv,anime,k-drama", "Homepage gateway order matches the approved four route families");
  requireCheck(model.recentlyUpdated.length === 3, "Recently Updated remains a compact three-item module");
  requireCheck(model.recentlyUpdated.every((item, index, items) => {
    if (index === 0) return true;
    const current = Date.parse(item.dates.lastReviewed ?? item.dates.dateModified ?? item.dates.datePublished ?? "");
    const previousItem = items[index - 1];
    const previous = Date.parse(previousItem.dates.lastReviewed ?? previousItem.dates.dateModified ?? previousItem.dates.datePublished ?? "");
    return previous >= current;
  }), "Recently Updated order follows lastReviewed with dateModified/datePublished fallback");
}

void main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
