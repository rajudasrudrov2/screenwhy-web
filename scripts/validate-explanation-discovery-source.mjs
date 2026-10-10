import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const checks = [];
const record = (ok, label) => checks.push({ ok: Boolean(ok), label });
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");
const exists = (rel) => fs.existsSync(path.join(root, rel));

const featureDir = "src/features/explanation-discovery";
const view = read(`${featureDir}/ExplanationDiscovery.tsx`);
const loader = read(`${featureDir}/explanation-discovery.loader.ts`);
const routeFeature = read(`${featureDir}/explanation-discovery.route.tsx`);
const utils = read(`${featureDir}/explanation-discovery.utils.ts`);
const config = read(`${featureDir}/explanation-discovery.config.ts`);
const queries = read("src/data/repositories/queries.ts");
const mockRepo = read("src/data/mock/explanation-repository.ts");
const apiRequests = read("src/data/api/requests.ts");
const apiMappers = read("src/data/api/mappers.ts");
const footer = read("src/components/navigation/SiteFooter.tsx");
const routes = read("src/config/routes.ts");
const pkg = JSON.parse(read("package.json"));
const combined = [view, loader, routeFeature, utils, config].join("\n");

const routeFiles = [
  "src/app/(en)/explanations/page.tsx",
  "src/app/(en)/explanations/ending-explained/page.tsx",
  "src/app/(en)/explanations/character-explained/page.tsx",
  "src/app/(en)/explanations/mystery-explained/page.tsx",
  "src/app/(en)/explanations/book-vs-screen/page.tsx",
];
const routeSources = routeFiles.map(read);

record(pkg.name === "screenwhy-web" && pkg.version === "0.5.3", "Package identity/version is ScreenWhy 0.5.3");
record(routeFiles.every(exists), "1. General Explanation Discovery and four curated routes exist");
record(routeSources.every((source) => source.includes("renderExplanationDiscoveryRoute") && source.includes("createExplanationDiscoveryMetadata")), "2. All discovery route wrappers delegate to one shared feature");
record(exists(featureDir) && exists(`${featureDir}/explanation-discovery.loader.ts`) && exists(`${featureDir}/ExplanationDiscovery.tsx`), "3. One reusable Explanation Discovery feature owns composition");
record(loader.includes("repositories.explanations.list"), "4. ExplanationRepository.list is the archive data boundary");
record(!/@\/data\/(fixtures|mock)/.test(combined), "5. Production discovery feature imports no raw fixture/mock internals");
record(!/\bfetch\s*\(/.test(combined), "6. Discovery feature performs no direct fetch calls");
record(queries.includes("query?: string") && queries.includes("routeFamily?: PublicRouteFamily") && queries.includes("sort?: ExplanationArchiveSort"), "7. ExplanationListQuery extension is optional/backward-compatible");
record(mockRepo.indexOf(".filter(") < mockRepo.indexOf("sortExplanations") && mockRepo.includes("return paginate(sortExplanations(filtered, query.sort), query)"), "8. Mock repository filters first, sorts second and paginates last");
record(mockRepo.includes("explanation.primaryTitle.publicRouteFamily !== query.routeFamily"), "9. Route-family filtering uses primaryTitle.publicRouteFamily");
record(mockRepo.includes("explanation.intendedSubjectQuestion") && mockRepo.includes("explanation.articleTitle") && mockRepo.includes("explanation.excerpt"), "10. Local archive search uses appropriate Explanation fields");
record(view.includes("explanationTypeLabels") && view.includes("canonLabels") && !/replace\([^)]*_/m.test(view), "11. Public type/Canon labels are human-readable rather than raw enums");
record(view.includes("<ExplanationCard") && !view.includes("ArchiveExplanationCard"), "12. Existing ExplanationCard is reused");
record(view.includes("results.totalItems") && !/Trending|Most Popular|most_viewed|popular/i.test(combined), "13. Result counts are real and no fake popularity claims exist");
record(view.includes('name="q"') && view.includes('name="type"') && view.includes('name="family"') && view.includes('name="canon"') && view.includes('name="sort"'), "14. General archive discovery state is URL-driven via GET fields");
record(view.includes("Pagination") && utils.includes("explanationDiscoveryHref") && utils.includes("curatedExplanationHref"), "15. Server pagination preserves archive route state");
record(routeFeature.includes("curatedRouteForType") && routeFeature.includes("generalCanonical") && routeFeature.includes("alternates: { canonical }"), "16. Curated type intent canonicalizes to substantive curated routes");
record(routeFeature.includes("robots: { index") && routeFeature.includes("filteredGeneral") && routeFeature.includes("hasExtraCuratedQuery"), "17. Filtered/ad-hoc URLs are noindex while clean routes can index");
record(!exists("src/app/(en)/explanations/question-answer") && !exists("src/app/(en)/explanations/scene-explained") && !exists("src/app/(en)/explanations/relationship-explained") && !exists("src/app/(en)/explanations/timeline-explained"), "18. No raw Explanation taxonomy route generation was introduced");
record(footer.includes('["Explanations", PUBLIC_HUB_ROUTES.explanations]') && footer.includes('["Documentaries", PUBLIC_HUB_ROUTES.documentaries]'), "19. Footer discovery adds Explanations and preserves the public Documentaries archive");
record(routes.includes("EXPLANATION_DISCOVERY_ROUTES") && routes.includes('endingExplained: "/explanations/ending-explained/"'), "20. Curated discovery route strings are centralized");
record(config.includes('lockedType: "ending_explained"') && config.includes('lockedType: "character_explained"') && config.includes('lockedType: "mystery_explained"') && config.includes('lockedType: "book_vs_screen"'), "21. Four curated pages lock to their substantive Explanation types");
record(loader.includes("pageSize: EXPLANATION_DISCOVERY_PAGE_SIZE") && read(`${featureDir}/explanation-discovery.loader.ts`).includes("EXPLANATION_DISCOVERY_PAGE_SIZE = 12"), "22. Stable server page size is 12");
record(view.includes("No explanations found") && view.includes("Clear filters"), "23. Intentional empty state replaces broken/empty grids");
record(view.includes("Recently updated explanation") && loader.includes('sort: "updated_newest"'), "24. Start Here selection is deterministic and uses actual data");
record(apiRequests.includes("screenWhyApiRequests") && apiRequests.includes("optionalSearch(q.query)") && apiMappers.includes("malformed") && !apiRequests.includes('params.set("query"'), "25. API discovery uses approved q wire parameter, strict DTO validation and fail-closed errors");
record(!/"use client"|'use client'/.test(combined), "26. Explanation Discovery remains server-first");
record(!/PlotExplainer|Plot Explainer|plotexplainer\.com|PE logo/.test(combined), "27. Former public brand is absent from new discovery source");
const removedLocale = ["bn", "BD"].join("-");
const removedRoutePrefix = "/" + ["b", "n"].join("") + "/";
record(!combined.includes(removedLocale) && !combined.includes(removedRoutePrefix), "28. Explanation Discovery remains English-only");
record(!/#[0-9a-fA-F]{3,8}\b/.test(read(`${featureDir}/ExplanationDiscovery.module.css`)), "29. Discovery CSS uses centralized design tokens instead of hardcoded colors");
record(!/\bas any\b|:\s*any\b|<any>|Array<any>|Promise<any>/.test(combined + queries + mockRepo), "30. Discovery/repository changes add no any escape hatch");

const failed = checks.filter((check) => !check.ok);
for (const check of checks) console.log(`${check.ok ? "PASS" : "FAIL"} — ${check.label}`);
console.log(`\n${checks.length - failed.length}/${checks.length} SW-FE-03H Explanation Discovery guardrails passed.`);
if (failed.length) process.exitCode = 1;
