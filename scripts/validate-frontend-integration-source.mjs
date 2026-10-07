import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");
const exists = (rel) => fs.existsSync(path.join(root, rel));
const checks=[]; const check=(ok,label)=>checks.push({ok:Boolean(ok),label});

const routeFamilies=["movies","tv","anime","k-drama","documentaries"];
const staticSlugs=["about","contact","editorial-policy","sourcing-policy","corrections-policy","ai-usage-policy","privacy","terms","copyright-dmca"];
const curated=["ending-explained","character-explained","mystery-explained","book-vs-screen"];
const required=[
  "src/app/(en)/page.tsx","src/app/(en)/search/page.tsx","src/app/(en)/characters/page.tsx","src/app/(en)/characters/[slug]/page.tsx","src/app/(en)/explanations/page.tsx","src/app/(en)/explain/[slug]/page.tsx",
  ...routeFamilies.flatMap((family)=>[`src/app/(en)/${family}/page.tsx`,`src/app/(en)/${family}/[slug]/page.tsx`,`src/app/(en)/${family}/[slug]/relationships/[characterA]/[characterB]/page.tsx`,`src/app/(en)/${family}/[slug]/timeline/page.tsx`]),
  ...curated.map((slug)=>`src/app/(en)/explanations/${slug}/page.tsx`),
  ...staticSlugs.map((slug)=>`src/app/(en)/${slug}/page.tsx`),
  "src/app/(en)/not-found.tsx","src/app/(en)/error.tsx","src/app/(en)/loading.tsx","src/app/global-error.tsx"
];
const header=read("src/components/navigation/SiteHeader.tsx");
const footer=read("src/components/navigation/SiteFooter.tsx");
const frame=read("src/components/navigation/SiteFrame.tsx");
const routes=read("src/config/routes.ts");
const titleHub=read("src/features/title-hub/TitleHub.tsx");
const character=read("src/features/character-detail/CharacterDetail.tsx");
const relationship=read("src/features/relationship-experience/RelationshipExperience.tsx");
const timeline=read("src/features/story-timeline/StoryTimeline.tsx");
const searchRoute=read("src/app/(en)/search/page.tsx");
const archiveRoute=read("src/features/archive/archive.route.tsx");
const discoveryRoute=read("src/features/explanation-discovery/explanation-discovery.route.tsx");
const devPages=["src/app/(en)/__ui/page.tsx","src/app/(en)/__ui/cards/page.tsx","src/app/(en)/__ui/domain/page.tsx","src/app/(en)/__ui/article/page.tsx","src/app/(en)/__ui/citations/page.tsx"].map(read).join("\n");
const sitemap=read("src/app/sitemap.ts");
const robots=read("src/app/robots.ts");

check(required.every(exists),"1. Full required public route matrix and utility routes exist");
const removedGroup="("+["b","n"].join("")+")"; check(!exists(`src/app/${removedGroup}`),"2. Removed secondary-language route group remains absent");
check(footer.includes("EDITORIAL_ROUTES") && footer.includes("PUBLIC_HUB_ROUTES") && staticSlugs.every((slug)=>exists(`src/app/(en)/${slug}/page.tsx`)),"3. Footer static/trust destinations resolve to real route files");
check(header.includes("<form") && header.includes("action={searchRoute(locale)}") && header.includes('method="get"'),"4. Header Search is a real native GET entry point");
check(header.includes('name="q"'),"5. Header Search submits the q parameter");
check(!header.includes("Search shell only"),"6. Development-style Header Search note is removed");
check((frame.match(/<main\b/g)||[]).length===1 && frame.includes('id="main-content"'),"7. SiteFrame owns one main landmark");
const featureMain=[]; for(const dir of ["src/features","src/components"]){ for(const f of fs.readdirSync(path.join(root,dir),{recursive:true})){ if(typeof f!=="string"||!f.endsWith(".tsx")) continue; const rel=path.join(dir,f); if(rel.endsWith("SiteFrame.tsx")) continue; if(read(rel).includes("<main")) featureMain.push(rel); }}
check(featureMain.length===0,"8. Feature compositions introduce no nested main landmarks");
check(frame.includes('href="#main-content"') && frame.includes('id="main-content"'),"9. Skip Link target is preserved");
check(titleHub.includes('id="relationships"') && relationship.includes('#relationships'),"10. Relationship breadcrumb hash resolves to the Title Hub relationship section");
check(titleHub.includes('id="everything-we-explained"') && titleHub.includes('href="#everything-we-explained"') && character.includes('id="timeline"') && timeline.includes("id={preview.anchorId}"),"11. Known in-page hash navigation has matching source targets");
check(routes.includes("relationshipRoute") && routes.includes("timelineRoute") && routes.includes("titleRoute") && routes.includes("characterRoute") && routes.includes("explanationRoute") && routes.includes("searchRoute"),"12. Central public route helpers remain available");
check(!/Return to foundation|technical foundation|Search shell only/.test([read("src/app/(en)/not-found.tsx"),read("src/app/(en)/error.tsx"),header].join("\n")),"13. Foundation/development public utility copy is gone");
check(!/PlotExplainer|plotexplainer\.com|PE logo/.test([header,footer,read("src/features/utility-states/UtilityState.tsx"),read("src/features/editorial-pages/EditorialPage.tsx")].join("\n")),"14. Integrated public shell and new utility surfaces contain no former public brand");
check(devPages.includes('robots: { index: false') && (devPages.match(/process\.env\.NODE_ENV === "production"\) notFound\(\)/g)||[]).length>=5,"15. Development previews stay noindex and production-gated");
check(searchRoute.includes("robots: { index: false"),"16. Search query route remains noindex");
check(archiveRoute.includes("hasFacetOrSearch") && archiveRoute.includes("robots: { index"),"17. Faceted Title/Character archive variants retain noindex logic");
check(discoveryRoute.includes("filteredGeneral") && discoveryRoute.includes("hasExtraCuratedQuery") && discoveryRoute.includes("robots: { index"),"18. Explanation discovery filtered variants retain noindex logic");
check(!sitemap.includes("PUBLIC_HUB_ROUTES.search") && !sitemap.includes('/search/'),"19. Sitemap excludes Search");
check(!sitemap.includes("__ui"),"20. Sitemap excludes development UI");
check(robots.includes("siteConfig.allowIndexing") && robots.includes('disallow: "/"') && robots.includes('disallow: ["/__ui/"]'),"21. Robots respects indexing configuration and protects dev surfaces");
check(!/the-last-signal|mara-vale|\/explain\//.test(sitemap),"22. Production sitemap contains no fictional/mock detail URLs");
check(!routes.includes('titles: "/titles/"'),"23. Unimplemented legacy /titles/ route constant is removed");
check(read("src/features/editorial-pages/EditorialPage.tsx").includes('<div className={styles.body}>'),"24. EditorialPage nested main landmark is corrected");
check(header.includes("aria-expanded") && header.includes("aria-controls") && header.includes('event.key !== "Escape"'),"25. Header interactive panels preserve expanded/control/Escape behavior");
check(read("src/features/search/SearchPage.tsx").includes("NoResults") && read("src/features/search/SearchPage.tsx").includes("alternatives"),"26. Search-specific no-results recovery is preserved");

const failed=checks.filter((x)=>!x.ok); for(const x of checks) console.log(`${x.ok?"PASS":"FAIL"} — ${x.label}`); console.log(`\n${checks.length-failed.length}/${checks.length} SW-FE-03K frontend-integration guardrails passed.`); if(failed.length) process.exitCode=1;
