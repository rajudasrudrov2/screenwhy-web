import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const checks = [];
const record = (ok, label) => checks.push({ ok: Boolean(ok), label });
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");
const exists = (rel) => fs.existsSync(path.join(root, rel));

const routePath = "src/app/(en)/explain/[slug]/page.tsx";
const featureFiles = [
  "src/features/explanation-detail/ExplanationDetail.tsx",
  "src/features/explanation-detail/RenderableArticle.tsx",
  "src/features/explanation-detail/explanation-detail.loader.ts",
  "src/features/explanation-detail/explanation-detail.types.ts",
];
const adapterFiles = [
  "src/data/article-body/index.ts",
  "src/data/article-body/mock-decoder.ts",
  "src/data/article-body/types.ts",
  "src/data/article-body/mock-schema.ts",
];
const route = read(routePath);
const feature = featureFiles.map(read).join("\n");
const adapter = adapterFiles.map(read).join("\n");
const combined = [route, feature, adapter].join("\n");
const pkg = JSON.parse(read("package.json"));

record(pkg.name === "screenwhy-web" && pkg.version === "0.5.3", "Package identity/version is ScreenWhy 0.5.3");
record(exists(routePath), "/explain/[slug]/ App Router route exists");
record(feature.includes("getRepositories") && feature.includes("repositories.explanations.getBySlug"), "Explanation loader uses the public repository lookup boundary");
record(!/@\/data\/(fixtures|mock)/.test(feature), "Explanation page feature imports no raw fixture/mock internals");
record(!/\bfetch\s*\(/.test(feature), "Explanation page performs no direct fetch calls");
record(!/\bas any\b|:\s*any\b|<any>|Array<any>|Promise<any>/.test(combined), "Explanation page and article adapter add no any escape hatch");
record((feature.match(/<h1\b/g) ?? []).length === 1, "Explanation page architecture renders exactly one H1");
record(feature.includes("<QuickAnswer") && feature.includes("explanation.quickAnswer"), "Existing Quick Answer is reused from ExplanationDetail.quickAnswer");
record(feature.includes("<SpoilerWarning") && feature.includes("SourceMaterialSpoilerWarning"), "Existing Spoiler system is reused");
record(feature.includes("<CanonContext"), "Existing Canon system is reused");
record(feature.includes("<EditorialMetadata"), "Existing Editorial Metadata is reused");
record(feature.includes("<ArticleTableOfContents") && feature.includes("buildArticleTocItems"), "Existing TOC system is reused from renderable article sections");
record(feature.includes("CitationMarker") && feature.includes("createCitationRegistry"), "Existing citation registry/markers are reused");
record(feature.includes("<SourcesSection"), "Existing Sources Section is reused");
record(feature.includes("<CharacterCard") && feature.includes('variant="compact"'), "Related Character cards reuse CharacterCard compact");
record(feature.includes("<ExplanationCard") && feature.includes('variant="compact"'), "Related Explanation cards reuse ExplanationCard compact");
record(feature.includes("action={searchRoute(model.locale)}") && feature.includes('name="q"'), "Ask/Search form targets centralized /search/ with q parameter");
record(!/submit\(|viewerQuestions\.submit|success.*stored|saved to/i.test(feature), "No fake Viewer Question persistence is implemented");
record(!/PlotExplainer|Plot Explainer|plotexplainer\.com/.test(feature), "New Explanation UI contains no former public brand");
record(!/["'`]\/en\//.test(combined), "No /en/ route prefix is introduced");
record(!/\.body\.document\s*\.\s*blocks|body\.document\[|document\.blocks/.test(feature), "Opaque ArticleBodyDocument is not inspected by page presentation code");
record(adapter.includes("document as unknown") && adapter.includes("decodeMockArticleBody"), "Mock article decoder receives the opaque document through an unknown validation boundary");
record(adapter.includes("BackendContractNotReadyError") && adapter.includes('env.dataSource === "mock"'), "API article-body mapping remains explicitly contract-not-ready without mock fallback");
record(adapter.includes("malformed_payload") && adapter.includes("unsupported mock article document version"), "Malformed mock article body fails predictably");
record(!/acf_fields|post_meta|Gutenberg|wp-json|WP[A-Z]\w*Response/.test(adapter), "Article adapter invents no WordPress/CMS payload contract");
record(route.includes("generateMetadata") && route.includes("explanation.seo") && route.includes("seo.canonicalUrl"), "Dynamic metadata uses the existing Explanation SEO contract");
record(route.includes("notFound()") && feature.includes("return null"), "Unavailable/invalid slug resolves through Next not-found architecture");
record(feature.includes("relatedCharacters") && feature.includes("relatedExplanations") && feature.includes("Promise.all"), "Optional related entities are resolved through repositories and composed in parallel");
record(feature.includes("intendedSubjectQuestion"), "Viewer Questions derive from Explanation intendedSubjectQuestion data");
record(adapter.includes("assertArticleEvidenceIntegrity") && adapter.includes("publicVisibility === true"), "Inline citation references are checked against public evidence only");
record(adapter.includes("sectionAnchor") && adapter.includes("sectionIds"), "Citation section anchors are validated against renderable article sections");
record(feature.includes("ArticleReadingLayout") && feature.includes("ArticleProse") && feature.includes("ArticleSection"), "Completed article reading primitives are composed rather than recreated");
record(exists("src/app/(en)/movies/[slug]/page.tsx") && exists("src/app/(en)/tv/[slug]/page.tsx"), "Explanation Detail remains compatible after the planned Title Hub stage was added");
record(!feature.includes("SearchPage") && !feature.includes("loadSearchPage"), "Explanation Detail remains isolated from the later Search Results feature");
record(exists("src/app/(en)/characters/[slug]/page.tsx"), "Character Detail route is now available without changing the Explanation Detail architecture");

const failed = checks.filter((check) => !check.ok);
for (const check of checks) console.log(`${check.ok ? "PASS" : "FAIL"} — ${check.label}`);
console.log(`\n${checks.length - failed.length}/${checks.length} SW-FE-03B Explanation Detail guardrails passed.`);
if (failed.length) process.exitCode = 1;
