import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const checks = [];
const record = (ok, label) => checks.push({ ok: Boolean(ok), label });
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");
function walk(rel, predicate = () => true) {
  const start = path.join(root, rel); const out = [];
  const visit = (dir) => { for (const e of fs.readdirSync(dir,{withFileTypes:true})) { const p=path.join(dir,e.name); if(e.isDirectory()) visit(p); else if(predicate(p)) out.push(p); } };
  visit(start); return out;
}

const pkg = JSON.parse(read("package.json"));
record(pkg.version === "0.3.4", "Package version is 0.3.4");
const required = [
  "src/components/domain/cards/TitleCard.tsx",
  "src/components/domain/cards/ExplanationCard.tsx",
  "src/components/domain/cards/CharacterCard.tsx",
  "src/components/domain/cards/CardMedia.tsx",
  "src/app/(en)/__ui/cards/page.tsx",
];
record(required.every((p)=>fs.existsSync(path.join(root,p))), "Required PE-FE-02B card and preview files exist");

const cardFiles = walk("src/components/domain/cards", (p)=>/\.(ts|tsx)$/.test(p));
const source = cardFiles.map((p)=>fs.readFileSync(p,"utf8")).join("\n");
record(!/\bas any\b|:\s*any\b|<any>/.test(source), "Cards add no any escape hatch");
record(!/\bfetch\s*\(/.test(source), "Cards perform no direct fetch");
record(!/@\/data\/(fixtures|mock)/.test(source), "Cards import no fixture/mock internals");
record(!/process\.env/.test(source), "Cards read no environment variables");
record(source.includes("titleRoute(") && source.includes("characterRoute(") && source.includes("explanationRoute("), "Cards use centralized route helpers");
record(source.includes("SpoilerMarker") && source.includes("CanonContext"), "Explanation Card composes PE-FE-02A Spoiler/Canon components");
record(!/['\"`]\/en\//.test(source), "Cards introduce no /en/ route prefix");

const cssFiles = walk("src/components/domain/cards", (p)=>p.endsWith(".css"));
const css = cssFiles.map((p)=>fs.readFileSync(p,"utf8")).join("\n");
record(!/#[0-9a-fA-F]{3,8}\b/.test(css), "Card CSS uses existing design tokens only");
record(!/scale\s*\(/.test(css), "Cards avoid poster zoom/scale motion");

const preview = read("src/app/(en)/__ui/cards/page.tsx");
record(preview.includes('dataSource: "mock"') && preview.includes("createRepositories"), "Preview uses public repository boundary with explicit mock mode");
record(!/@\/data\/(fixtures|mock)/.test(preview), "Preview does not import raw fixtures/mock internals");
record(preview.includes("robots: { index: false") && preview.includes('process.env.NODE_ENV === "production"') && preview.includes("notFound()"), "Preview is noindex and production-gated");

const deferredNames = ["CitationList","SourceList","RelationshipCard","TimelineCard"];
const allDomain = walk("src/components/domain", (p)=>/\.(ts|tsx)$/.test(p)).map((p)=>fs.readFileSync(p,"utf8")).join("\n");
record(deferredNames.every((n)=>!allDomain.includes(`function ${n}`) && !allDomain.includes(`const ${n}`)), "Citation/relationship/timeline component families remain deferred");

const failed = checks.filter((c)=>!c.ok);
for (const c of checks) console.log(`${c.ok?"PASS":"FAIL"} — ${c.label}`);
console.log(`\n${checks.length-failed.length}/${checks.length} PE-FE-02B source guardrails passed.`);
if(failed.length) process.exitCode=1;
