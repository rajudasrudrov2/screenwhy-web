import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const checks = [];
const record = (ok, label) => checks.push({ ok: Boolean(ok), label });
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");

function walk(rel, predicate = () => true) {
  const start = path.join(root, rel);
  const out = [];
  if (!fs.existsSync(start)) return out;
  const visit = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const absolute = path.join(dir, entry.name);
      if (entry.isDirectory()) visit(absolute);
      else if (predicate(absolute)) out.push(absolute);
    }
  };
  visit(start);
  return out;
}

const pkg = JSON.parse(read("package.json"));
record(pkg.name === "screenwhy-web" && pkg.version === "0.3.4", "Package identity/version is ScreenWhy 0.3.4");

const required = [
  "src/components/domain/article/article-types.ts",
  "src/components/domain/article/ArticleTypography.tsx",
  "src/components/domain/article/ArticleSection.tsx",
  "src/components/domain/article/ArticleImage.tsx",
  "src/components/domain/article/ArticleCallouts.tsx",
  "src/components/domain/article/ArticleTableOfContents.tsx",
  "src/components/domain/article/ArticleReadingLayout.tsx",
  "src/app/(en)/__ui/article/page.tsx",
  "src/app/(en)/__ui/article/preview-data.ts",
];
record(required.every((rel) => fs.existsSync(path.join(root, rel))), "Required SW-FE-02C-A article/preview files exist");

const articleTs = walk("src/components/domain/article", (file) => /\.(ts|tsx)$/.test(file));
const articleSource = articleTs.map((file) => fs.readFileSync(file, "utf8")).join("\n");
record(!/\bas any\b|:\s*any\b|<any>|Array<any>|Promise<any>/.test(articleSource), "Article components add no any escape hatch");
record(!/\bfetch\s*\(/.test(articleSource), "Article components perform no backend/network fetch");
record(!/@\/data\/(fixtures|mock)/.test(articleSource), "Production article components import no fixture/mock internals");
record(!/Gutenberg|wp_post|post_meta|acf_fields|WP[A-Z]\w*Response/.test(articleSource), "Article presentation layer assumes no backend/CMS payload shape");
record(!/["'`]\/en\//.test(articleSource), "Article components introduce no /en/ route prefix");
record(!/PlotExplainer|plotexplainer\.com/.test(articleSource), "Article components introduce no former public brand copy/domain");

const articleCss = walk("src/components/domain/article", (file) => file.endsWith(".css"));
const cssSource = articleCss.map((file) => fs.readFileSync(file, "utf8")).join("\n");
record(!/#[0-9a-fA-F]{3,8}\b/.test(cssSource), "Article CSS reuses centralized design tokens without hardcoded hex colors");
record(cssSource.includes("var(--pe-reading-max)") && cssSource.includes("var(--pe-toc-rail)"), "Reading measure and TOC rail use locked layout tokens");

const toc = read("src/components/domain/article/ArticleTableOfContents.tsx");
record(toc.includes("<nav") && toc.includes("<details") && toc.includes('aria-current={active ? "location" : undefined}'), "TOC provides semantic desktop nav, native mobile disclosure and active-state semantics");

const types = read("src/components/domain/article/article-types.ts");
record(types.includes("assertUniqueArticleSectionIds") && types.includes("createArticleSectionId") && types.includes("buildArticleTocItems"), "Section IDs are centralized, duplicate-checked and TOC-derived from one boundary");

const callouts = read("src/components/domain/article/ArticleCallouts.tsx");
record(callouts.includes("CanonContext") && callouts.includes("SpoilerDisclosure") && callouts.includes("strengthenScreenSpoiler"), "Article callouts compose existing Canon/Spoiler systems and prevent weaker section warnings");

const preview = read("src/app/(en)/__ui/article/page.tsx");
record(preview.includes('dataSource: "mock"') && preview.includes("createRepositories"), "Article preview uses the public repository boundary for existing domain context");
record(!/@\/data\/(fixtures|mock)/.test(preview), "Article preview imports no raw fixture/mock internals");
record(preview.includes("robots: { index: false") && preview.includes('process.env.NODE_ENV === "production"') && preview.includes("notFound()"), "Article preview is noindex and production-gated");
record(preview.includes("ScreenWhy") && !preview.includes("PlotExplainer"), "New preview branding is ScreenWhy-only");

const domainFiles = walk("src/components/domain", (file) => /\.(ts|tsx)$/.test(file));
const domainSource = domainFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n");
record(!domainSource.includes("function CitationList") && !domainSource.includes("function SourceList") && !domainSource.includes("function ClaimEvidence"), "Final citation/source UI remains deferred to SW-FE-02C-B");

const failed = checks.filter((check) => !check.ok);
for (const check of checks) console.log(`${check.ok ? "PASS" : "FAIL"} — ${check.label}`);
console.log(`\n${checks.length - failed.length}/${checks.length} SW-FE-02C-A source guardrails passed.`);
if (failed.length) process.exitCode = 1;
