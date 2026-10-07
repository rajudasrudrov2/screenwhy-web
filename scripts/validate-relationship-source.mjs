import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const checks = [];
const record = (ok, label) => checks.push({ ok: Boolean(ok), label });
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");
const exists = (rel) => fs.existsSync(path.join(root, rel));

const featureDir = "src/features/relationship-experience";
const loader = read(`${featureDir}/relationship.loader.ts`);
const view = read(`${featureDir}/RelationshipExperience.tsx`);
const utils = read(`${featureDir}/relationship.utils.ts`);
const routeFeature = read(`${featureDir}/relationship.route.tsx`);
const types = read(`${featureDir}/relationship.types.ts`);
const css = read(`${featureDir}/RelationshipExperience.module.css`);
const routes = read("src/config/routes.ts");
const titleHub = read("src/features/title-hub/TitleHub.tsx");
const characterDetail = read("src/features/character-detail/CharacterDetail.tsx");
const pkg = JSON.parse(read("package.json"));
const combined = [loader, view, utils, routeFeature, types, routes].join("\n");

const families = ["movies", "tv", "anime", "k-drama", "documentaries"];
const routeFiles = families.map((family) => `src/app/(en)/${family}/[slug]/relationships/[characterA]/[characterB]/page.tsx`);
const routeSources = routeFiles.map(read);

record(pkg.name === "screenwhy-web" && pkg.version === "0.5.0", "Package identity/version is ScreenWhy 0.5.0");
record(routeFiles.every(exists), "1. Five title-scoped Relationship route-family wrappers exist");
record(routeSources.every((source) => source.includes("renderRelationshipRoute") && source.includes("generateRelationshipMetadata")), "2. All route wrappers delegate to one shared Relationship feature");
record(loader.includes("repositories.titles.getBySlug") && loader.includes("routeFamily") && loader.includes("slug: titleSlug"), "3. Title lookup uses routeFamily + Title slug");
record(loader.includes("repositories.story.getRelationships") && loader.includes("titleLogicalId: title.identity.logicalId"), "4. StoryRepository supplies Title relationships");
record(loader.includes("relationshipMatchesSlugs") && utils.includes("canonicalA === firstSlug") && utils.includes("canonicalA === secondSlug"), "5. Pair lookup accepts the canonical pair and its reverse request");
record(loader.includes("relationship.characterA.slug") && loader.includes("relationship.characterB.slug") && loader.includes("canonicalCharacterASlug") && loader.includes("canonicalCharacterBSlug"), "6. Canonical A/B order comes from the CharacterRelationship edge");
record(loader.includes("isReverseRequest") && routeFeature.includes("permanentRedirect(model.canonicalPath)"), "7. Reverse valid pair redirects to the canonical URL");
record(loader.includes("if (!relationship) return null") && routeFeature.includes("if (!model) return notFound()"), "8. Invalid pair reaches normal not-found behavior");
record(loader.includes("resolveCharacter(canonicalCharacterASlug)") && loader.includes("getRepositories().characters.getBySlug"), "9. Character A resolves through CharacterRepository");
record(loader.includes("resolveCharacter(canonicalCharacterBSlug)"), "10. Character B resolves through CharacterRepository");
record(view.includes("safeState?.roleA") && view.includes("safeState?.roleB") && view.includes("state.roleA") && view.includes("state.roleB"), "11. roleA/roleB remain tied to canonical Character A/B identity");
record(utils.includes("left.sequence - right.sequence") && loader.includes("sortedRelationshipStates(relationship)"), "12. Relationship States are explicitly sorted by sequence");
record(view.includes("Protected relationship state") && view.includes("isProtectedRelationshipState(state)") && view.includes("<SpoilerDisclosure metadata={state.spoiler}"), "13. Major/full state labels and content stay protected before reveal");
record(view.includes('model.currentStateProtected ? "Spoiler-protected"'), "14. Latest protected state is not leaked as the current status");
record(view.includes("<CanonContext") && !view.includes("canon.classification.replace"), "15. Existing Canon component is reused");
record(view.includes("<SpoilerDisclosure") && view.includes("<SpoilerMarker") && view.includes("<SpoilerWarning"), "16. Existing Spoiler component family is reused");
record(loader.includes("repositories.story.getTimeline") && loader.includes('orderBy: "chronology"') && loader.includes("relevantRelationshipEvents"), "17. Relationship events derive from StoryRepository Timeline data");
record(view.includes("Protected story event") && view.includes("protectedEvent") && view.includes("<SpoilerDisclosure metadata={event.spoiler}"), "18. Major/full event titles remain protected before reveal");
record(loader.includes("resolveMapConnections") && loader.includes("titleRelationships") && view.includes("model.mapConnections"), "19. Relationship map uses StoryRepository relationship data");
record(!/\bd3\b|force-directed|cytoscape|vis-network|react-flow|canvas/i.test(combined + read("package.json")), "20. No graph library or canvas graph engine is added");
record(!/@\/data\/(fixtures|mock)/.test([loader, view, routeFeature].join("\n")), "21. Production Relationship feature imports no raw fixture/mock internals");
record(!/\bfetch\s*\(/.test(combined), "22. Relationship implementation performs no direct fetch calls");
record(routes.includes("relationshipRoute(") && routes.includes("characterASlug") && routes.includes("characterBSlug") && !routes.includes("RelationshipId"), "23. Public URL uses slugs and exposes no internal RelationshipId");
record(!exists("src/app/(en)/relationships/page.tsx") && !exists("src/app/(en)/relationships"), "24. No global /relationships/ archive exists");
record(titleHub.includes("relationshipRoute(") && titleHub.includes("View relationship"), "25. Title Hub has the surgical full-Relationship navigation integration");
record(characterDetail.includes("relationshipRoute(") && characterDetail.includes("View full relationship"), "26. Character Detail has the surgical full-Relationship navigation integration");
const removedLocale = ["bn", "BD"].join("-");
const removedRoutePrefix = "/" + ["b", "n"].join("") + "/";
const removedRouteGroup = "(" + ["b", "n"].join("") + ")";
const removedNativeLabel = "\u09ac\u09be\u0982\u09b2\u09be";
const removedFont = ["Hind", "Siliguri"].join(" ");
record(
  exists("scripts/validate-english-only.mjs") &&
  ![removedLocale, removedRoutePrefix, removedNativeLabel, removedFont].some((value) => combined.includes(value)),
  "27. New Relationship source remains English-only",
);
record(!exists(`src/app/${removedRouteGroup}`) && !routeSources.some((source) => source.includes(removedRoutePrefix)), "28. No removed secondary-language route is introduced");
record(!exists("public/brand") && !/PlotExplainer|Plot Explainer|plotexplainer\.com|PE logo/.test(combined), "29. Old public brand assets/references are not reintroduced");
record(exists("src/features/story-timeline") && !exists("src/app/(en)/timeline"), "30. Phase-B Timeline coexists without a global Timeline archive");
record(view.includes("<Breadcrumbs") && view.includes("<QuickAnswer") && view.includes("<ExplanationCard"), "Existing Breadcrumb, Quick Answer and ExplanationCard systems are reused");
record(routeFeature.includes("alternates: { canonical }") && routeFeature.includes("!model.isReverseRequest"), "Canonical metadata is emitted and reverse variants are non-indexable");
record(view.includes('label: "Relationships"') && view.includes('#relationships` }'), "Relationships breadcrumb returns to the Title Hub relationship section");
record(view.includes("Relationship connections") && view.includes("MapConnectionRow"), "Map provides a text-readable semantic fallback/list");
record(!/#[0-9a-fA-F]{3,8}\b/.test(css), "Relationship CSS uses centralized design tokens rather than hardcoded colors");
record(!/"use client"|'use client'/.test(combined), "Relationship page remains server-first without a full-page Client Component");
record(!/\bas any\b|:\s*any\b|<any>|Array<any>|Promise<any>/.test(combined), "Relationship implementation adds no any escape hatch");
record(!/Nora Vale|Eli Ward|The Last Station/.test(combined), "Historical Relationship design placeholder facts are absent from production source");

const failed = checks.filter((check) => !check.ok);
for (const check of checks) console.log(`${check.ok ? "PASS" : "FAIL"} — ${check.label}`);
console.log(`\n${checks.length - failed.length}/${checks.length} SW-FE-03G-A Relationship guardrails passed.`);
if (failed.length) process.exitCode = 1;
