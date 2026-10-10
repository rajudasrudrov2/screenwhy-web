import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
let passed = 0;
function check(condition, label) {
  if (!condition) throw new Error(`FAIL — ${label}`);
  passed += 1;
  console.log(`PASS — ${label}`);
}
async function text(rel) { return readFile(path.join(root, rel), "utf8"); }
async function allFiles(dir) {
  const absolute = path.join(root, dir);
  const entries = await readdir(absolute);
  const output = [];
  for (const entry of entries) {
    const rel = path.join(dir, entry);
    const info = await stat(path.join(root, rel));
    if (info.isDirectory()) output.push(...await allFiles(rel)); else output.push(rel);
  }
  return output;
}

const page = await text("src/app/(en)/search/page.tsx");
const loading = await text("src/app/(en)/search/loading.tsx");
const featureFiles = (await allFiles("src/features/search")).filter((file) => /\.(ts|tsx)$/.test(file));
const featureText = (await Promise.all(featureFiles.map(text))).join("\n");
const searchContracts = await text("src/data/repositories/contracts.ts");
const searchRepo = await text("src/data/mock/search-repository.ts");
const packageJson = JSON.parse(await text("package.json"));
const appFiles = await allFiles("src/app");

check(appFiles.some((file) => file.split(path.sep).join("/") === "src/app/(en)/search/page.tsx"), "/search/ production page exists");
check(/!model\.query/.test(featureText) && /NoQuery/.test(featureText), "No-query Search state exists");
check(/params\.q/.test(page) && /name="q"/.test(featureText), "q GET parameter is used");
check(/getRepositories\(\)/.test(featureText), "Search feature uses repository boundary");
check(!/data\/fixtures\//.test(featureText + page), "Production Search UI imports no raw fixtures");
check(!/\bfetch\s*\(/.test(featureText + page), "Search UI contains no direct fetch()");
check(!/cms\.|\/wp-json\/|acf_fields|post_meta/.test(featureText), "Search feature invents no CMS transport contract");
check(/kind: "title"/.test(searchContracts) && /kind: "explanation"/.test(searchContracts) && /kind: "character"/.test(searchContracts) && !/kind: "question"/.test(searchContracts), "Core SearchRepository kinds remain title/explanation/character only");
check(/intendedSubjectQuestion/.test(featureText), "Question results derive from intendedSubjectQuestion");
check(/ExplanationCard/.test(featureText), "ExplanationCard is reused");
check(/TitleCard/.test(featureText), "TitleCard is reused");
check(/CharacterCard/.test(featureText), "CharacterCard is reused");
check(/titleRoute\(/.test(featureText), "Title suggestion navigation uses route-family-aware titleRoute");
check(/characterRoute\(/.test(featureText), "Character suggestion navigation uses characterRoute");
check(/explanationRoute\(/.test(featureText), "Explanation/question navigation uses explanationRoute");
check(/type/.test(featureText) && /buildSearchHref/.test(featureText) && /aria-current/.test(featureText), "Filter state is URL-driven navigation");
check(/totalItems/.test(featureText) && !/18 results|All \(18\)|Explanations \(6\)/.test(featureText), "Result counts are derived, not historical hardcoded counts");
check(!/Trending questions|trending score|views|likes|votes/i.test(featureText), "Search UI makes no fake analytics/trending/vote claims");
check(/PaginatedResult/.test(featureText) && /totalPages/.test(featureText) && /Pagination/.test(featureText), "Filtered pagination uses repository/page-level pagination data");
check(/No results for/.test(featureText), "No-results state exists");
check(/Skeleton/.test(loading), "Search loading state uses existing Skeleton primitive");
check(/index: false/.test(page), "Search metadata is noindex");
check(/searchRoute\("en-US"\)/.test(page), "Search canonical is based on stable /search/ route");
check(!/["'`]\/en\//.test(featureText + page), "Search implementation introduces no /en/ route");
check(!/PlotExplainer|Plot Explainer|plotexplainer\.com/.test(featureText + page), "Search implementation contains no former public brand");
check(!(await text("src/features/search/SearchPage.tsx")).includes("@/features/archive"), "Search feature remains isolated from later archive implementation");
check(packageJson.version === "0.5.3", "Package version is 0.5.3");

check(/query\.length < 2/.test(featureText), "Suggestion minimum query threshold is 2 characters");
check(/200/.test(featureText) && /setTimeout/.test(featureText), "Suggestion requests use restrained debounce");
check(/SUGGESTION_LIMITS/.test(featureText) && /explanation: 3/.test(featureText) && /title: 2/.test(featureText) && /character: 2/.test(featureText) && /question: 2/.test(featureText), "Suggestion limits are deterministic");
check(/Explanations/.test(featureText) && /Titles/.test(featureText) && /Characters/.test(featureText) && /Questions/.test(featureText), "Suggestion groups support all approved categories");
check(/ArrowDown/.test(featureText) && /ArrowUp/.test(featureText) && /Escape/.test(featureText) && /Enter/.test(featureText), "Suggestion keyboard architecture covers arrows, Escape and Enter");
check(/aria-expanded/.test(featureText) && /aria-controls/.test(featureText) && /aria-activedescendant/.test(featureText) && /role="combobox"/.test(featureText), "Suggestion combobox exposes expected ARIA state");
check(/Search for “/.test(featureText), "Suggestion overlay provides Search for query action");
check(/"use server"/.test(await text("src/features/search/search.actions.ts")), "Suggestions use feature-local server action boundary");
check(!/api\s*→\s*mock|fallback.*mock/i.test(featureText), "Search feature adds no API-to-mock fallback");

check(/localStorage/.test(featureText) && /screenwhy\.recentSearches\.v1/.test(featureText), "Recent Searches are browser-local with namespaced key");
check(/MAX_RECENT = 5/.test(featureText), "Recent Searches are limited to five");
check(/filter\(\(item\).*toLocaleLowerCase/.test(featureText), "Recent Searches de-duplicate normalized entries");
check(/Clear all/.test(featureText) && /removeItem/.test(featureText), "Recent Searches include Clear all");
check(!/recentSearch.*repository|repository.*recentSearch/i.test(featureText), "Recent Searches have no server repository persistence");
check(/if \(!mounted \|\| items\.length === 0\) return null/.test(featureText), "Recent query values are not rendered during SSR");
check(/method="get"/.test(featureText), "Search remains functional as native GET without JavaScript");

check(/questions remain page-level derived content|Question results derive/.test(featureText + searchContracts) || /intendedSubjectQuestion/.test(featureText), "Questions remain derived page-level content");
check(!/ViewerQuestionRepository/.test(featureText), "Search feature creates no ViewerQuestion repository");
check(/meaningfulTokens/.test(searchRepo) && /matchScore/.test(searchRepo), "Mock SearchRepository uses deterministic token-aware matching");

console.log(`Search source validation: ${passed}/${passed} checks passed.`);
