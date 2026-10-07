import fs from "node:fs";
import path from "node:path";
import process from "node:process";
const root=process.cwd(); const read=(r)=>fs.readFileSync(path.join(root,r),"utf8"); const checks=[]; const check=(o,l)=>checks.push({ok:Boolean(o),label:l});
const frame=read("src/components/navigation/SiteFrame.tsx"), globals=read("src/styles/globals.css"), header=read("src/components/navigation/SiteHeader.tsx"), headerCss=read("src/components/navigation/SiteHeader.module.css");
const search=read("src/features/search/SearchField.tsx"), home=read("src/features/homepage/Homepage.tsx"), archive=read("src/features/archive/ArchivePage.tsx"), discovery=read("src/features/explanation-discovery/ExplanationDiscovery.tsx"), utility=read("src/features/utility-states/UtilityState.tsx"), utilityCss=read("src/features/utility-states/UtilityState.module.css"), spoiler=read("src/components/domain/spoiler/SpoilerContext.tsx"), toc=read("src/components/domain/article/ArticleTableOfContents.tsx"), cardMedia=read("src/components/domain/cards/CardMedia.tsx"), articleImage=read("src/components/domain/article/ArticleImage.tsx"), buttons=read("src/components/ui/Button.module.css"), tokens=read("src/styles/tokens.css");

function hexToRgb(hex) { const value=hex.replace("#",""); return [0,2,4].map((i)=>Number.parseInt(value.slice(i,i+2),16)/255); }
function relativeLuminance(hex) { const [r,g,b]=hexToRgb(hex).map((c)=>c<=0.04045?c/12.92:((c+0.055)/1.055)**2.4); return 0.2126*r+0.7152*g+0.0722*b; }
function contrastRatio(a,b) { const [high,low]=[relativeLuminance(a),relativeLuminance(b)].sort((x,y)=>y-x); return (high+0.05)/(low+0.05); }
function tokenHex(name) { const match=tokens.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`)); if(!match) throw new Error(`Missing hex token --${name}`); return match[1]; }
check(frame.includes('href="#main-content"')&&frame.includes('id="main-content"'),"1. Skip link points to the one SiteFrame main landmark");
check(header.includes("aria-expanded")&&header.includes("aria-controls")&&header.includes("aria-label"),"2. Header panel controls expose accessible state and labels");
check(header.includes('label="Search ScreenWhy"')&&header.includes('name="q"')&&header.includes('type="submit"'),"3. Header Search has a real label, named query field and submit control");
check(search.includes('role="combobox"')&&search.includes("aria-autocomplete")&&search.includes("aria-activedescendant")&&search.includes('aria-label="Clear search"'),"4. Search suggestion input exposes combobox state and labelled clear control");
check(home.includes('htmlFor="homepage-search"')&&archive.includes("htmlFor=")&&discovery.includes("htmlFor="),"5. Major native Search/filter controls use labels rather than placeholder-only semantics");
check(spoiler.includes("<details")&&spoiler.includes("<summary")&&toc.includes("<details")&&toc.includes("<summary"),"6. Spoiler and mobile TOC disclosure controls use native accessible details/summary");
check(cardMedia.includes("alt={media.alt}")&&cardMedia.includes('role="img"')&&cardMedia.includes("fallbackLabel"),"7. Card media has meaningful alt or semantic missing-media fallback");
check(articleImage.includes("alt={media.alt}")&&articleImage.includes("width={media.width}")&&articleImage.includes("height={media.height}"),"8. Article images preserve alt and intrinsic dimensions");
check(globals.includes(":focus-visible")&&!/outline:\s*none/.test(globals),"9. Global visible focus treatment is preserved");
check(globals.includes("prefers-reduced-motion")&&utilityCss.includes("prefers-reduced-motion")&&read("src/components/ui/Button.module.css").includes("prefers-reduced-motion"),"10. Reduced-motion handling covers global, utility and button animation primitives");
check(tokens.includes("--pe-control-md: 44px")&&headerCss.includes("min-height: 44px")&&buttons.includes("min-height: var(--pe-control-md)"),"11. Core navigation/button targets retain practical 44px sizing");
check(utility.includes('role="status"')&&utility.includes('ariaLive="polite"'),"12. Loading utility uses status and polite announcement semantics");
check(read("src/app/(en)/error.tsx").includes("RetryableFailure")&&utility.includes('role="alert"'),"13. Retryable error presentation supports alert semantics");
check(!read("src/features/editorial-pages/EditorialPage.tsx").includes("<main"),"14. Editorial content no longer nests a main landmark");
check(globals.includes("overflow-x: clip")&&read("src/components/navigation/Breadcrumbs.module.css").includes("overflow: hidden"),"15. Global shell and breadcrumbs include mobile overflow safeguards");
check(read("src/components/domain/article/ArticleReadingLayout.module.css").includes("var(--pe-reading-max)"),"16. Long-form reading measure remains constrained");
check(utilityCss.includes("@media (max-width: 767px)")&&!utilityCss.includes("max-width: 520px"),"17. New utility styles follow the established responsive transition rather than a device-specific breakpoint");
check(!/aria-hidden="true"[^>]*>\s*[^<]*<button/.test([header,search,utility].join("\n")),"18. No obvious interactive control is hidden from assistive technology in audited interactive surfaces");
const contrastPairs=[
  ["body primary",tokenHex("pe-text-primary"),tokenHex("pe-surface-canvas"),4.5],
  ["body secondary",tokenHex("pe-text-secondary"),tokenHex("pe-surface-canvas"),4.5],
  ["body muted",tokenHex("pe-text-muted"),tokenHex("pe-surface-canvas"),4.5],
  ["link",tokenHex("pe-text-link"),tokenHex("pe-surface-canvas"),4.5],
  ["error",tokenHex("pe-error-fg"),tokenHex("pe-error-bg"),4.5],
  ["warning",tokenHex("pe-warning-fg"),tokenHex("pe-warning-bg"),4.5],
  ["spoiler",tokenHex("pe-spoiler-fg"),tokenHex("pe-spoiler-bg"),4.5],
  ["footer inverse",tokenHex("pe-text-inverse"),tokenHex("pe-surface-dark"),4.5],
  ["focus on light",tokenHex("pe-focus"),tokenHex("pe-surface-canvas"),3],
  ["focus on dark",tokenHex("pe-focus"),tokenHex("pe-surface-dark"),3],
];
check(contrastPairs.every(([,fg,bg,min])=>contrastRatio(fg,bg)>=min),"19. Core audited semantic text/focus token pairs meet the applicable WCAG AA contrast threshold");
check(tokens.includes("--pe-canon-adaptation-fg: var(--pe-success-fg)")&&contrastRatio(tokenHex("pe-success-fg"),tokenHex("pe-surface-teal-soft"))>=4.5,"20. Adaptation Canon text uses the accessible semantic teal on its soft teal surface");
const failed=checks.filter(x=>!x.ok); for(const x of checks) console.log(`${x.ok?"PASS":"FAIL"} — ${x.label}`); console.log(`\n${checks.length-failed.length}/${checks.length} accessibility source invariants passed. This is not a complete WCAG conformance claim.`); if(failed.length) process.exitCode=1;
