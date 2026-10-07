import { createRepositories } from "@/data/repositories";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`Explanation discovery validation failed: ${message}`);
  console.log(`PASS — ${message}`);
}

async function main() {
  const repositories = createRepositories({
    dataSource: "mock",
    runtimeEnvironment: "test",
  });

  const ending = await repositories.explanations.list({
    locale: "en-US",
    page: 1,
    pageSize: 12,
    explanationType: "ending_explained",
    sort: "updated_newest",
  });
  assert(ending.totalItems === 2, "Ending Explained filter returns the real two-record fixture count");
  assert(ending.items.every((item) => item.explanationType === "ending_explained"), "Type filtering is applied before results are returned");

  const lastSignalFull = await repositories.explanations.list({
    locale: "en-US",
    page: 1,
    pageSize: 50,
    query: "Last Signal",
    sort: "title_asc",
  });
  const lastSignalPaged = await repositories.explanations.list({
    locale: "en-US",
    page: 1,
    pageSize: 1,
    query: "Last Signal",
    sort: "title_asc",
  });
  assert(lastSignalFull.totalItems > 1, "Local Explanation search resolves multiple real records");
  assert(lastSignalPaged.totalItems === lastSignalFull.totalItems, "Filtering happens before pagination and preserves the filtered total");
  assert(lastSignalPaged.items.length === 1, "Pagination is applied after filtering");

  const movies = await repositories.explanations.list({
    locale: "en-US",
    page: 1,
    pageSize: 50,
    routeFamily: "movies",
  });
  assert(movies.items.every((item) => item.primaryTitle.publicRouteFamily === "movies"), "Route-family filtering uses primaryTitle.publicRouteFamily");

  const tv = await repositories.explanations.list({
    locale: "en-US",
    page: 1,
    pageSize: 50,
    routeFamily: "tv",
  });
  assert(tv.items.every((item) => item.primaryTitle.publicRouteFamily === "tv"), "TV route-family filtering remains distinct from Movies");

  const titleAsc = await repositories.explanations.list({
    locale: "en-US",
    page: 1,
    pageSize: 50,
    sort: "title_asc",
  });
  const sortedTitles = [...titleAsc.items].map((item) => item.articleTitle);
  assert(
    sortedTitles.every((title, index) => index === 0 || sortedTitles[index - 1].localeCompare(title) <= 0),
    "Title A–Z sorting is deterministic",
  );

  const updated = await repositories.explanations.list({
    locale: "en-US",
    page: 1,
    pageSize: 50,
    sort: "updated_newest",
  });
  const updatedTimes = updated.items.map((item) => Date.parse(item.dates.dateModified ?? item.dates.datePublished ?? ""));
  assert(
    updatedTimes.every((time, index) => index === 0 || updatedTimes[index - 1] >= time),
    "Recently updated sorting uses actual editorial dates",
  );
}

void main();
