import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const checks = [];
const record = (ok, label) => checks.push({ ok: Boolean(ok), label });
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");
const exists = (rel) => fs.existsSync(path.join(root, rel));

const featureDir = "src/features/editorial-pages";
const view = read(`${featureDir}/EditorialPage.tsx`);
const content = read(`${featureDir}/editorial-page.content.ts`);
const metadata = read(`${featureDir}/editorial-page.metadata.ts`);
const routeFeature = read(`${featureDir}/editorial-page.route.tsx`);
const types = read(`${featureDir}/editorial-page.types.ts`);
const css = read(`${featureDir}/EditorialPage.module.css`);
const footer = read("src/components/navigation/SiteFooter.tsx");
const routes = read("src/config/routes.ts");
const recentSearches = read("src/features/search/RecentSearches.tsx");
const pkg = JSON.parse(read("package.json"));
const combined = [view, content, metadata, routeFeature, types].join("\n");

const routeMap = {
  about: "about",
  contact: "contact",
  "editorial-policy": "editorialPolicy",
  "sourcing-policy": "sourcingPolicy",
  "corrections-policy": "correctionsPolicy",
  "ai-usage-policy": "aiUsagePolicy",
  privacy: "privacy",
  terms: "terms",
  "copyright-dmca": "copyrightDmca",
};
const routeFiles = Object.keys(routeMap).map((slug) => `src/app/(en)/${slug}/page.tsx`);
const routeSources = routeFiles.map(read);

record(pkg.name === "screenwhy-web" && pkg.version === "0.5.3", "Package identity/version is ScreenWhy 0.5.3");
record(routeFiles.every(exists), "1. All nine trust/editorial/static routes exist");
record(routeSources.every((source) => source.includes("renderEditorialPageRoute") && source.includes("createEditorialPageMetadata")), "2. All route wrappers use the shared editorial page renderer/metadata boundary");
record(routeSources.every((source) => source.split("\n").length <= 6), "3. Static route files remain thin");
record(view.includes("<Breadcrumbs") && view.includes("PUBLIC_HUB_ROUTES.home"), "4. Existing Breadcrumb component is reused");
record(view.includes("ArticleProse") && view.includes("ArticleParagraph") && view.includes("ArticleList") && view.includes("ArticleSection"), "5. Existing Article typography/section primitives are reused");
record(view.includes("ArticleReadingLayout") && view.includes("ArticleTableOfContents") && view.includes("buildArticleTocItems"), "6. Existing TOC/read-layout system is reused where configured");
record(Object.values(routeMap).every((key) => routes.includes(key)) && footer.includes("EDITORIAL_ROUTES"), "7. Footer editorial/legal route intents resolve through centralized EDITORIAL_ROUTES");
record(!/<form\b|action=|onSubmit=|Message sent|Send message/i.test(combined), "8. No fake Contact submission form or success behavior is implemented");
record(content.includes("generalContactHref: null") && content.includes("publicEmail: null") && content.includes("publicPhone: null") && content.includes("officeAddress: null") && content.includes("legalCompanyName: null"), "9. Public contact slots remain explicitly unpopulated instead of invented");
record(!/[A-Z0-9._%+-]+@(?:screenwhy|plotexplainer)\.[A-Z]{2,}/i.test(content) && !/mailto:/i.test(content), "10. No invented public email address is published");
record(content.includes("dmcaAgent: null") && content.includes("have not been verified for publication"), "11. No fake DMCA agent/contact is published");
record(!/governed by the laws of|binding arbitration|exclusive jurisdiction of/i.test(content), "12. No invented governing law or arbitration clause is introduced");
record(recentSearches.includes("window.localStorage") && content.includes("Recent Searches") && content.includes("server-side ScreenWhy account history"), "13. Privacy copy accurately acknowledges browser-local Recent Searches behavior");
record(content.includes("does not include a ScreenWhy user-account system, comments, newsletter signup or a working Contact submission form") && content.includes("If analytics, advertising, accounts, comments, newsletters, contact submissions or other third-party services are introduced later"), "14. Unavailable/future services are not described as active");
const removedLocale = ["bn", "BD"].join("-");
const removedRoutePrefix = "/" + ["b", "n"].join("") + "/";
record(!combined.includes(removedLocale) && !combined.includes(removedRoutePrefix), "15. Static content remains English-only");
record(!exists("src/app/(bn)") && !exists("public/brand"), "16. Removed secondary-language route tree and former public brand assets remain absent");
record(!/PlotExplainer|Plot Explainer|plotexplainer\.com|PE logo/.test(combined), "17. Former public brand is absent from new static-page source");
record(metadata.includes("alternates: { canonical }") && metadata.includes("siteConfig.origin") && metadata.includes("robots: { index: siteConfig.allowIndexing"), "18. Static pages have clean self-canonical metadata and legitimate indexing behavior");
record(metadata.includes('type: "website"') && metadata.includes('siteName: "ScreenWhy"'), "19. Restrained site-level Open Graph metadata is present");
record(!/\bfetch\s*\(|@\/data\/|repositories\.|WordPress|REST controller|DB table/i.test([view, metadata, routeFeature, types].join("\n")), "20. Static page feature performs no backend/repository work");
record(content.includes('lastUpdated: LAST_UPDATED') && content.includes('const LAST_UPDATED = "October 7, 2026"'), "21. Policy dates are explicit stable content metadata rather than dynamic today values");
record(content.includes("The Why Behind What You Watch.") && content.includes("Questions After Watching, Answered."), "22. About page uses current ScreenWhy positioning and brand promise");
record(content.includes("not a streaming service") && content.includes("not a ratings database") && content.includes("not a piracy or download service"), "23. About page naturally distinguishes ScreenWhy from unrelated entertainment products");
record(content.includes("AI-assisted tools") && content.includes("should not replace factual or source verification") && !/OpenAI|ChatGPT|Claude|Gemini|Anthropic/i.test(content), "24. AI Usage Policy is restrained and vendor-neutral");
record(content.includes("claim or section level") && content.includes("Evidence is not interpretation"), "25. Sourcing Policy aligns with the existing claim-level evidence architecture");
record(view.includes("RelatedPolicies") && content.includes("related:"), "26. Related policy links are restrained and centrally configured");
record(!/#[0-9a-fA-F]{3,8}\b/.test(css) && css.includes("var(--pe-reading-max)"), "27. Static-page CSS uses design tokens and preserves the locked reading measure");
record(!/"use client"|'use client'/.test(combined), "28. Static pages remain server-first");
record(!/\bas any\b|:\s*any\b|<any>|Array<any>|Promise<any>/.test(combined), "29. Static page system adds no any escape hatch");
record(view.includes("<h1>") && !view.includes("<h1 className") && routeSources.every((source) => !source.includes("<h1")), "30. Shared presentation owns the single H1 architecture");
record(content.includes("PUBLIC_CONTACT_CONFIG") && view.includes("ContactNotice"), "31. Contact limitation is represented centrally and truthfully in the shared system");
record(!/Lorem ipsum/i.test(combined), "32. No placeholder/lorem policy content is present");

const failed = checks.filter((check) => !check.ok);
for (const check of checks) console.log(`${check.ok ? "PASS" : "FAIL"} — ${check.label}`);
console.log(`\n${checks.length - failed.length}/${checks.length} SW-FE-03I static-page guardrails passed.`);
if (failed.length) process.exitCode = 1;
