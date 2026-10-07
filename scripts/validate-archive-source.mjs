import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));
let pass = 0;
let fail = 0;
function check(condition, label) {
  if (condition) { pass += 1; console.log(`PASS ${String(pass + fail).padStart(2, "0")}: ${label}`); }
  else { fail += 1; console.error(`FAIL ${String(pass + fail).padStart(2, "0")}: ${label}`); }
}

const families = ["movies", "tv", "anime", "k-drama", "documentaries"];
const routeFiles = families.map((family) => `src/app/(en)/${family}/page.tsx`);
const archivePage = read("src/features/archive/ArchivePage.tsx");
const loader = read("src/features/archive/archive.loader.ts");
const route = read("src/features/archive/archive.route.tsx");
const utils = read("src/features/archive/archive.utils.ts");
const queries = read("src/data/repositories/queries.ts");
const titleRepo = read("src/data/mock/title-repository.ts");
const characterRepo = read("src/data/mock/character-repository.ts");
const packageJson = JSON.parse(read("package.json"));

check(routeFiles.every(exists), "All five Title archive index routes exist");
check(exists("src/app/(en)/characters/page.tsx"), "Character archive index route exists");
check(routeFiles.every((file) => read(file).includes("renderTitleArchiveRoute")), "All Title archives delegate to shared feature");
check(routeFiles.every((file, index) => read(file).includes(`\"${families[index]}\"`)), "Each Title wrapper supplies its correct routeFamily");
check(loader.includes("repositories.titles.list"), "TitleRepository.list drives Title archives");
check(loader.includes("repositories.characters.list"), "CharacterRepository.list drives Character archive");
check(!archivePage.includes("@/data/fixtures/"), "Production archive UI imports no raw fixtures");
check(!archivePage.includes("fetch(") && !loader.includes("fetch("), "Archive feature performs no direct fetch");
check(!archivePage.includes("PlotExplainer") && !archivePage.includes("plotexplainer.com"), "Archive UI introduces no old public brand");
check(!archivePage.includes("/en/") && !route.includes("/en/"), "Archive routes introduce no /en/ prefix");
check(archivePage.includes("<TitleCard") && archivePage.includes('variant="standard"'), "TitleCard is reused");
check(archivePage.includes("<CharacterCard") && archivePage.includes('variant="standard"'), "CharacterCard is reused");
check(titleRepo.indexOf(".filter(") < titleRepo.indexOf("paginate("), "Title filtering occurs before pagination");
check(characterRepo.indexOf(".filter(") < characterRepo.indexOf("paginate("), "Character filtering occurs before pagination");
check(archivePage.includes("results.totalItems"), "Archive counts derive from repository pagination");
check(!archivePage.includes("312") && !archivePage.includes("56 characters"), "Historical fake counts are absent");
check(!archivePage.includes("Popular") && !queries.includes('"popular"'), "Fake Popular sorting is absent");
check(!archivePage.match(/Alive|Dead|Deceased/), "Character archive exposes no global status");
check(routeFiles.some((file) => file.includes("documentaries")), "Documentaries archive route is handled");
check(archivePage.includes("No titles found") && archivePage.includes("No characters found"), "Intentional empty states are implemented");
check(route.includes("robots: { index, follow: true }") && route.includes("hasFacetOrSearch"), "Filtered/search archive SEO is noindex-capable");
check(route.includes("paginationCanonical") && route.includes("?page=${page}"), "Pagination-only canonical strategy is implemented");
check(!exists("src/app/(en)/genres") && !exists("src/app/(en)/platforms") && !exists("src/app/(en)/countries"), "No raw taxonomy archive routes are added");
check(exists("src/app/(en)/page.tsx") && exists("src/app/(en)/explain/[slug]/page.tsx") && exists("src/app/(en)/characters/[slug]/page.tsx"), "Completed public pages remain present");
check(queries.includes("readonly query?: string") && queries.includes("readonly genreSlug?: string") && queries.includes("readonly releaseYear?: number"), "TitleListQuery discovery extension is optional");
check(queries.includes("readonly countrySlug?: string") && queries.includes("readonly platformSlug?: string") && queries.includes("readonly sort?: TitleArchiveSort"), "Optional future Title facet/sort fields are declared without changing return contracts");
check(queries.includes("readonly sort?: CharacterArchiveSort") && queries.includes("readonly query?: string"), "CharacterListQuery search/sort extension is optional");
check(titleRepo.includes("matchesDiscovery") && titleRepo.includes("sortTitles"), "Mock Title repository implements deterministic discovery");
check(characterRepo.includes("character.aliases?.some") && characterRepo.includes("sortCharacters"), "Character search includes names/aliases with deterministic sort");
check(read("src/data/api/requests.ts").includes('notReady("title.list")') && read("src/data/api/requests.ts").includes('notReady("character.list")'), "API list contracts remain fail-closed");
check(archivePage.includes('name="q"') && archivePage.includes('method="get"'), "Local archive search is native GET using q");
check(archivePage.includes('name="genre"') && archivePage.includes('name="year"'), "Supported Title filters use URL parameters");
check(!archivePage.includes('name="country"') && !archivePage.includes('name="platform"'), "Country/Platform controls are omitted without trustworthy facet vocabulary");
check(archivePage.includes("Clear filters") && archivePage.includes("archiveBaseRoute"), "Clear Filters returns to clean archive route");
check(!archivePage.includes('name="page"'), "Search/filter forms reset pagination to page 1");
check(utils.includes('params.set("page"') && utils.includes('params.set("q"'), "Pagination links preserve URL-driven archive state");
check(route.includes("availability.totalItems > 0") && route.includes("siteConfig.allowIndexing"), "Base archive indexing requires public content and site indexing permission");
check(route.includes("filtered ? `${siteConfig.origin}${baseRoute}`") && route.includes("filtered ? `${siteConfig.origin}${PUBLIC_HUB_ROUTES.characters}`"), "Filtered variants canonicalize to clean base archives");
check(!archivePage.match(/IMDb|rating|stars|Watch Now|Stream on/), "Ratings and watch-provider CTAs are absent");
check(packageJson.name === "screenwhy-web" && packageJson.version === "0.4.6", "Package identity/version is ScreenWhy 0.4.6");
check(exists("src/app/(en)/movies/[slug]/page.tsx") && exists("src/app/(en)/characters/[slug]/page.tsx"), "Existing dynamic Title/Character routes remain intact");

console.log(`\nArchive source guardrails: ${pass}/${pass + fail} PASS`);
if (fail) process.exit(1);
