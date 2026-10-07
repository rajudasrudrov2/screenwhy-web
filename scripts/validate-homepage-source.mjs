import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const checks = [];
const record = (ok, label) => checks.push({ ok: Boolean(ok), label });
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");

const page = read("src/app/(en)/page.tsx");
const homepage = read("src/features/homepage/Homepage.tsx");
const loader = read("src/features/homepage/homepage.loader.ts");
const config = read("src/features/homepage/homepage.config.ts");
const gateway = read("src/features/homepage/RouteGatewayCard.tsx");
const combined = [page, homepage, loader, config, gateway].join("\n");
const pkg = JSON.parse(read("package.json"));

record(pkg.name === "screenwhy-web" && pkg.version === "0.5.0", "Package identity/version is ScreenWhy 0.5.0");
record(!page.includes("FrontendFoundationPage") && page.includes("ScreenWhyHomepage"), "Root foundation/status page is replaced by the production Homepage");
record(homepage.includes("brandConfig.recommendedHomepageH1"), "Homepage H1 uses centralized ScreenWhy brand configuration");
record(!combined.includes("Finished Watching?") && !combined.includes("Let’s Make Sense of It."), "Superseded PlotExplainer hero copy is absent");
record(homepage.includes("action={searchHref}") && config.includes("searchRoute(locale)"), "Homepage search form uses centralized /search/ route helper");
record(homepage.includes('name="q"'), "Homepage search query input uses q");
record(!/@\/data\/fixtures|@\/data\/mock/.test(combined), "Homepage production code imports no raw fixture/mock internals");
record(!/\bfetch\s*\(/.test(combined), "Homepage performs no direct fetch calls");
record(!/["'`]\/en\//.test(combined), "Homepage introduces no /en/ route prefix");
record(!/PlotExplainer|Plot Explainer|plotexplainer\.com/.test(combined), "Homepage production files contain no former public brand");
record(homepage.includes("<ExplanationCard") && homepage.includes('variant="standard"') && homepage.includes('variant="compact"'), "Homepage reuses existing ExplanationCard variants");
record(config.includes("titleHubRoute") && homepage.includes("explanationRoute"), "Homepage reuses centralized route helpers");
record(["movies", "tv", "anime", "k-drama"].every((route) => config.includes(`routeFamily: "${route}"`)), "RouteGatewayCard data links the four approved Homepage route families");
record(!/\bviews\b|\blikes\b|\bratings\b|trending score/i.test(combined), "Homepage does not invent analytics/popularity metrics");
record(!/carousel|swiper|slick|autoplay/i.test(combined), "Homepage adds no poster-wall/carousel/autoplay dependency");
record((homepage.match(/<h1\b/g) ?? []).length === 1, "Homepage renders exactly one H1");
record(!combined.includes("SearchPage") && !combined.includes("loadSearchPage"), "Homepage remains compositionally isolated from the later Search Results feature");
record(!/REST controller|wp-json|acf_fields|post_meta|WP[A-Z]\w*Response/.test(combined), "Homepage introduces no backend/CMS payload contract");
record(homepage.includes("<RouteGatewayCard") && fs.existsSync(path.join(root, "src/features/homepage/RouteGatewayCard.tsx")), "Approved Homepage-only RouteGatewayCard is implemented");
record(loader.includes("getRepositories") && !loader.includes("createMockRepositories"), "Homepage loader consumes the public repository boundary without source branching");
record(loader.includes("datePublished") && loader.includes("lastReviewed") && loader.includes("dateModified"), "Latest and Recently Updated ordering uses real editorial date semantics");
record(loader.includes("intendedSubjectQuestion"), "Viewer Questions derive from answered Explanation detail data");
record(page.includes('canonical: "/"'), "Homepage metadata keeps the root canonical URL");

const failed = checks.filter((check) => !check.ok);
for (const check of checks) console.log(`${check.ok ? "PASS" : "FAIL"} — ${check.label}`);
console.log(`\n${checks.length - failed.length}/${checks.length} SW-FE-03A Homepage guardrails passed.`);
if (failed.length) process.exitCode = 1;
