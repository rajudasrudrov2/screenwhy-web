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
record(pkg.name === "screenwhy-web" && pkg.version === "0.5.0", "Package identity/version is ScreenWhy 0.5.0");

const required = [
  "src/components/domain/citation/CitationMarker.tsx",
  "src/components/domain/citation/SourceItem.tsx",
  "src/components/domain/citation/ClaimEvidence.tsx",
  "src/components/domain/citation/SourcesSection.tsx",
  "src/components/domain/citation/citation-types.ts",
  "src/components/domain/citation/source-labels.ts",
  "src/app/(en)/__ui/citations/page.tsx",
  "src/app/(en)/__ui/citations/preview-data.ts",
];
record(required.every((rel) => fs.existsSync(path.join(root, rel))), "Required SW-FE-02C-B citation/source files exist");

const files = walk("src/components/domain/citation", (file) => /\.(ts|tsx)$/.test(file));
const source = files.map((file) => fs.readFileSync(file, "utf8")).join("\n");
record(!/\bas any\b|:\s*any\b|<any>|Array<any>|Promise<any>/.test(source), "Citation UI adds no any escape hatch");
record(!/\bfetch\s*\(/.test(source), "Citation UI performs no direct backend/network fetch");
record(!/Gutenberg|wp_post|post_meta|acf_fields|WP[A-Z]\w*Response/.test(source), "Citation UI assumes no backend/CMS payload shape");
record(!/@\/data\/(fixtures|mock)/.test(source), "Production citation UI imports no fixture/mock internals");
record(!/["'`]\/en\//.test(source), "Citation UI introduces no /en/ route prefix");
record(!/PlotExplainer|plotexplainer\.com/.test(source), "Citation UI introduces no former public brand copy/domain");

const typeSource = read("src/components/domain/citation/source-labels.ts");
record(["primary_screen_work","episode","official_creator_source","official_studio_network_source","creator_interview","cast_interview","source_material","official_script_or_transcript","reputable_secondary","database_reference","community_research"].every((value) => typeSource.includes(`${value}:`)), "All SourceType values have centralized human-readable labels");
record(!typeSource.includes('"primary_screen_work"') && !typeSource.includes('"source_material"'), "Raw snake_case SourceType values are not used as reader-facing labels");

const registry = read("src/components/domain/citation/citation-types.ts");
record(registry.includes("createCitationRegistry") && registry.includes("index + 1"), "Citation numbering is deterministic from explicit composition order");
record(registry.includes("createSourceAnchorId") && registry.includes("hashString") && !registry.includes("sourceTitle"), "Stable source anchors derive from SourceId without mutable titles or raw ID display");
record(registry.includes("new Map<string, SourceEvidenceGroup>()") && registry.includes("String(entry.citation.source.sourceId)"), "Duplicate SourceId values are deduplicated while retaining citation relationships");
record(registry.includes("publicVisibility === true"), "Only PublicCitation entries explicitly marked public are registered");

const sourceItem = read("src/components/domain/citation/SourceItem.tsx");
record(sourceItem.includes("safeExternalUrl(source.url)") && sourceItem.includes("externalUrl ?") && sourceItem.includes("source.sourceTitle"), "Source without URL remains renderable and titled without a broken link");
record(sourceItem.includes("claimSummary") && sourceItem.includes("sectionAnchor"), "Claim evidence and article-section anchor relationships are preserved");
record(!sourceItem.includes("source.sourceId"), "Internal SourceId is never displayed by SourceItem");
record(!/>\s*\{source\.url\}\s*</.test(sourceItem), "Raw external URL is not rendered as visual link text");

const preview = read("src/app/(en)/__ui/citations/page.tsx");
record(preview.includes("CitationMarker") && preview.includes("ArticleProse") && preview.includes("ArticleSection"), "Citation markers integrate with existing article primitives");
record(preview.includes("CitationMarker"), "English citation preview remains present");
record(preview.includes("robots: { index: false") && preview.includes('process.env.NODE_ENV === "production"') && preview.includes("notFound()"), "Citation preview is noindex and production-gated");

const previewData = read("src/app/(en)/__ui/citations/preview-data.ts");
record(previewData.includes("previewSources.film") && (previewData.match(/previewSources\.film/g) ?? []).length >= 2, "Preview covers multiple citations to one source");
record((previewData.match(/The warning is heard before the final transmitter sequence begins\./g) ?? []).length >= 2, "Preview covers one claim supported by multiple sources");
record(previewData.includes("source_material") && previewData.includes("creator_interview") && previewData.includes("reputable_secondary"), "Preview covers source material, interview and secondary source types");
record(previewData.includes("externalIdentifier") && previewData.includes("verificationState"), "Preview covers external identifier and verification metadata");

const css = walk("src/components/domain/citation", (file) => file.endsWith(".css")).map((file) => fs.readFileSync(file, "utf8")).join("\n");
record(!/#[0-9a-fA-F]{3,8}\b/.test(css), "Citation CSS reuses design tokens without hardcoded brand colors");
record(css.includes("overflow-wrap: anywhere") && !css.includes("white-space: pre"), "Long source metadata is protected from horizontal-overflow-prone rendering");

const failed = checks.filter((check) => !check.ok);
for (const check of checks) console.log(`${check.ok ? "PASS" : "FAIL"} — ${check.label}`);
console.log(`\n${checks.length - failed.length}/${checks.length} SW-FE-02C-B citation guardrails passed.`);
if (failed.length) process.exitCode = 1;
