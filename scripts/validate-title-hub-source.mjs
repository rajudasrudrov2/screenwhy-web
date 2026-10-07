import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const checks = [];
const record = (ok, label) => checks.push({ ok: Boolean(ok), label });
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");
const exists = (rel) => fs.existsSync(path.join(root, rel));

const families = ["movies", "tv", "anime", "k-drama", "documentaries"];
const routeFiles = families.map((family) => `src/app/(en)/${family}/[slug]/page.tsx`);
const routes = routeFiles.map(read).join("\n");
const featureFiles = [
  "src/features/title-hub/TitleHub.tsx",
  "src/features/title-hub/title-hub.loader.ts",
  "src/features/title-hub/title-hub.route.tsx",
  "src/features/title-hub/title-hub.types.ts",
];
const feature = featureFiles.map(read).join("\n");
const combined = `${routes}\n${feature}`;
const pkg = JSON.parse(read("package.json"));

record(pkg.name === "screenwhy-web" && pkg.version === "0.5.2", "Package identity/version is ScreenWhy 0.5.2");
record(routeFiles.every(exists), "1. All five dynamic Title routes exist");
record(routeFiles.every((file) => read(file).includes("renderTitleHubRoute")), "2. All Title routes delegate to the shared Title Hub implementation");
record(feature.includes("repositories.titles.getBySlug"), "3. Repository Title lookup is used");
record(feature.includes("routeFamily") && feature.includes("getBySlug({ locale, routeFamily, slug })"), "4. Route Family participates in the Title lookup");
record(feature.includes("if (titleResult.status !== \"available\") return null") && feature.includes("if (!model) return notFound()"), "5. Route-family mismatch/unavailable Title fails through not-found architecture");
record(!/@\/data\/(fixtures|mock)/.test(feature), "6. Production Title Hub imports no raw fixture/mock internals");
record(!/\bfetch\s*\(/.test(feature), "7. Title Hub performs no direct fetch calls");
record(feature.includes("primaryTitleId: title.identity.logicalId"), "8. Explanations load by primaryTitleId");
record(feature.includes("titleLogicalId: title.identity.logicalId"), "9. Characters load by titleLogicalId");
record(feature.includes("repositories.story.getRelationships"), "10. Relationships load from StoryRepository");
record(feature.includes('orderBy: "chronology"'), "11. Timeline explicitly requests chronology order");
record(feature.includes("title.relatedTitles") && feature.includes("repositories.titles.getBySlug"), "12. Related Titles resolve through TitleRepository");
record(feature.includes("model.topics") && feature.includes("topic.count"), "13. Topic counts are derived from the composed view model");
record(!/12 explanations published|\b12 explanations\b/.test(feature), "14. No design-mockup explanation count is hardcoded");
record(!/The Last Station|TV Show/.test(feature), "15. Old Title Hub placeholder facts are absent from production feature code");
record(feature.includes("<CanonContext"), "16. Existing Canon UI is reused");
record(feature.includes("<SpoilerDisclosure") && feature.includes("<SpoilerMarker"), "17. Existing Spoiler UI is reused");
record(feature.includes("<ExplanationCard"), "18. Existing ExplanationCard is reused");
record(feature.includes("<CharacterCard"), "19. Existing CharacterCard is reused");
record(feature.includes("<TitleCard") && feature.includes('variant="compact"'), "20. Existing TitleCard compact is reused for Related Titles");
record(feature.includes("action={searchRoute(model.locale)}"), "21. Ask the Screen form targets centralized /search/");
record(feature.includes('name="q"'), "22. Ask the Screen query parameter is q");
record(!/viewerQuestions\.submit|success.*stored|saved to|persist/i.test(feature), "23. No fake Viewer Question persistence is implemented");
record(!/PlotExplainer|Plot Explainer|plotexplainer\.com/.test(feature), "24. No former public brand appears in new Title Hub files");
record(!/["'`]\/en\//.test(combined), "25. No /en/ route prefix is introduced");
record(routes.includes("generateMetadata") && feature.includes("generateTitleHubMetadata") && feature.includes("title.seo"), "26. Dynamic metadata uses the Title SEO contract");
record(feature.includes("return notFound()") && feature.includes("return null"), "27. Invalid slug reaches not-found architecture");
record(families.every((family) => exists(`src/app/(en)/${family}/page.tsx`)), "28. Later SW-FE-03F archive/index routes coexist with Title Hub dynamic routes");
record(exists("src/app/(en)/characters/[slug]/page.tsx"), "29. Character Detail is now implemented as the next public-page milestone");
record(!exists("src/app/(en)/relationships/page.tsx") && !exists("src/app/(en)/timeline/page.tsx"), "30. No global Relationship or Timeline archive is implemented");
record((read("src/features/title-hub/TitleHub.tsx").match(/<h1\b/g) ?? []).length === 1, "Title Hub renders exactly one H1");
record(!/\bas any\b|:\s*any\b|<any>|Array<any>|Promise<any>/.test(combined), "Title Hub adds no any escape hatch");
record(!feature.includes("SearchPage") && !feature.includes("loadSearchPage"), "Title Hub remains isolated from the later Search Results feature");
record(!/REST controller|wp-json|acf_fields|post_meta|WP[A-Z]\w*Response/.test(combined), "Title Hub introduces no backend/CMS payload contract");

const failed = checks.filter((check) => !check.ok);
for (const check of checks) console.log(`${check.ok ? "PASS" : "FAIL"} — ${check.label}`);
console.log(`\n${checks.length - failed.length}/${checks.length} SW-FE-03C Title Hub guardrails passed.`);
if (failed.length) process.exitCode = 1;
