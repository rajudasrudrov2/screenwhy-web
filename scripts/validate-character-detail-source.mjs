import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const checks = [];
const record = (ok, label) => checks.push({ ok: Boolean(ok), label });
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");
const exists = (rel) => fs.existsSync(path.join(root, rel));

const routeFile = "src/app/(en)/characters/[slug]/page.tsx";
const featureFiles = [
  "src/features/character-detail/CharacterDetail.tsx",
  "src/features/character-detail/character-detail.loader.ts",
  "src/features/character-detail/character-detail.types.ts",
  "src/features/character-detail/CharacterDetail.module.css",
];
const route = read(routeFile);
const feature = featureFiles.map(read).join("\n");
const loader = read("src/features/character-detail/character-detail.loader.ts");
const view = read("src/features/character-detail/CharacterDetail.tsx");
const combined = `${route}\n${feature}`;
const pkg = JSON.parse(read("package.json"));

record(pkg.name === "screenwhy-web" && pkg.version === "0.5.0", "Package identity/version is ScreenWhy 0.5.0");
record(exists(routeFile), "1. /characters/[slug]/ route exists");
record(loader.includes("repositories.characters.getBySlug"), "2. CharacterRepository getBySlug() is used");
record(route.includes("notFound()") && loader.includes('if (characterResult.status !== "available") return null'), "3. Invalid Character slug reaches not-found architecture");
record(!/@\/data\/(fixtures|mock)/.test(feature), "4. Production Character Detail imports no raw fixtures/mock internals");
record(!/\bfetch\s*\(/.test(combined), "5. Character Detail performs no direct fetch calls");
record(!/\bas any\b|:\s*any\b|<any>|Array<any>|Promise<any>/.test(combined), "6. Character Detail adds no any escape hatch");
record(loader.includes("repositories.titles.getBySlug") && loader.includes("titleReference.publicRouteFamily"), "7. Primary Title resolves through TitleRepository with Route Family");
record(loader.includes("repositories.story.getRelationships"), "8. Relationships use StoryRepository");
record(loader.includes("repositories.story.getTimeline"), "9. Timeline uses StoryRepository");
record(loader.includes('orderBy: "chronology"'), "10. Timeline explicitly requests chronology order");
record(loader.includes("characterLogicalId: character.identity.logicalId"), "11. Character logical ID filters relationships");
record((loader.match(/characterLogicalId: character\.identity\.logicalId/g) ?? []).length >= 2, "12. Character logical ID filters Timeline as well");
record(loader.includes("repositories.explanations.getBySlug"), "13. Related Explanations resolve through ExplanationRepository");
record(loader.includes('explanation.explanationType === "character_explained"') && view.includes("Read Character Explanation") && view.includes("explanationRoute(characterExplanation"), "14. Character Explained CTA links to a real Explanation route");
const factsStart = view.indexOf('aria-label="Quick facts"');
const factsEnd = view.indexOf("</aside>", factsStart);
const factsSlice = factsStart >= 0 && factsEnd > factsStart ? view.slice(factsStart, factsEnd) : "";
record(!/STATUS_LABELS|\.status\b|Alive|Deceased/.test(factsSlice), "15. Contextual Character status is not flattened into hero/Quick Facts");
record(view.includes("character.statuses.map") && view.includes("<SpoilerDisclosure") && view.includes("STATUS_LABELS[status.status]"), "16. Contextual status outcomes render only inside SpoilerDisclosure");
record(loader.includes("stateRoles") && loader.includes("relationship.characterA.logicalId === characterId") && loader.includes("roleA") && loader.includes("roleB"), "17. Relationship direction respects Character A/B roles");
record(loader.includes('state.spoiler.level === "major" || state.spoiler.level === "full"') && view.includes("preview.protectedStates.map") && view.includes("<SpoilerDisclosure"), "18. Major/full relationship states remain protected");
record(view.includes("protectedEvent") && view.includes("Protected story event") && view.includes("<SpoilerDisclosure metadata={event.spoiler}"), "19. Major/full Timeline labels remain protected before reveal");
record(loader.includes("intendedSubjectQuestion") && view.includes("model.viewerQuestions"), "20. Viewer Questions derive from intendedSubjectQuestion");
record(view.includes("action={searchRoute(model.locale)}"), "21. Ask the Screen form targets centralized /search/");
record(view.includes('name="q"'), "22. Ask the Screen query parameter is q");
record(!/viewerQuestions\.submit|success.*stored|saved to|persist/i.test(feature), "23. No fake Viewer Question persistence is implemented");
record(!/href={[^}]*\/characters\/|href=["']\/characters\//.test(view) && !view.includes('localizedRoute("/characters/"'), "24. No dead /characters/ archive link is introduced");
record(!/PlotExplainer|Plot Explainer|plotexplainer\.com/.test(feature), "25. No former public brand appears in new Character Detail files");
record(!/["'`]\/en\//.test(combined), "26. No /en/ route prefix is introduced");
record(route.includes("generateMetadata") && route.includes("character.seo"), "27. Dynamic metadata uses the Character SEO contract");
record(!/PersonSchema|Celebrity|ActorProfile|actor filmography/i.test(feature), "28. No celebrity/person architecture is introduced");
record(!/Jon Snow|Game of Thrones|Kit Harington|Night's Watch|Targaryen|Stark Family/.test(feature), "29. Historical Character mockup content is absent from production feature code");
record(!exists("src/app/(en)/relationships/page.tsx") && !exists("src/app/(en)/timeline/page.tsx"), "30. No global Relationship or Timeline archive is built");
record((view.match(/<h1\b/g) ?? []).length === 1, "Character Detail renders exactly one H1");
record(view.includes("<Breadcrumbs"), "Existing Breadcrumb component is reused");
record(view.includes("<ExplanationCard"), "Existing ExplanationCard is reused");
record(view.includes("<CanonContext"), "Existing Canon UI is reused");
record(view.includes("<SpoilerDisclosure") && view.includes("<SpoilerMarker"), "Existing Spoiler UI is reused");
record(exists("src/app/(en)/characters/page.tsx"), "Character archive is supplied by the later SW-FE-03F milestone");
record(!feature.includes("SearchPage") && !feature.includes("loadSearchPage"), "Character Detail remains isolated from the later Search Results feature");
record(!/wp-json|acf_fields|post_meta|REST controller|WP[A-Z]\w*Response/.test(combined), "Character Detail introduces no backend/CMS payload assumptions");

const failed = checks.filter((check) => !check.ok);
for (const check of checks) console.log(`${check.ok ? "PASS" : "FAIL"} — ${check.label}`);
console.log(`\n${checks.length - failed.length}/${checks.length} SW-FE-03D Character Detail guardrails passed.`);
if (failed.length) process.exitCode = 1;
