#!/usr/bin/env node
/** Scope-limited, source-only ScreenWhy 3 preview manager. Never touches WordPress or historical fixtures. */
import { readFileSync, existsSync, lstatSync, rmSync, rmdirSync } from "node:fs";
import { resolve, relative, dirname, sep } from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = "src/demo/screenwhy3-homepage/manifest.json";
const OWNED = Object.freeze([
  "src/demo/screenwhy3-homepage/movies.ts",
  "src/demo/screenwhy3-homepage/explanations.ts",
  "src/demo/screenwhy3-homepage/collections.ts",
  "src/demo/screenwhy3-homepage/index.ts",
  "src/demo/screenwhy3-homepage/manifest.json",
  "src/app/(en)/__ui/screenwhy3/page.tsx",
  "src/features/homepage3/PreviewExperience.tsx",
  "src/features/homepage3/PreviewExperience.module.css",
  "src/app/(en)/__ui/screenwhy3/actions.ts",
]);
const CRITICAL = [
  "src/app/(en)/page.tsx", "src/lib/live-explanations.ts", "src/app/(en)/search/page.tsx",
  "src/app/sitemap.ts", "src/app/(en)/explanations/page.tsx", "src/data/repositories/create-repository.ts",
];
function safe(p) { const abs=resolve(root,p);if(p.startsWith("/")||!p||abs===root||!abs.startsWith(root+sep)||relative(root,abs).startsWith(".."))throw Error(`Unsafe deletion path: ${p}`);return abs; }
function text(p){const full=safe(p);return existsSync(full)?readFileSync(full,"utf8"):"";}
function manifest(){if(!existsSync(safe(manifestPath)))return null;const m=JSON.parse(text(manifestPath));if(m.pack!=="screenwhy3_demo"||m.revision!==1||JSON.stringify([...m.ownedFiles].sort())!==JSON.stringify([...OWNED].sort()))throw Error("Manifest scope mismatch — refuse to delete");return m;}
function counts(){const files=["movies.ts","explanations.ts","collections.ts"].map(x=>text(`src/demo/screenwhy3-homepage/${x}`));return {movies:(files[0].match(/"id": "demo:movie:/g)||[]).length,explanations:(files[1].match(/"id": "demo:explanation:/g)||[]).length,themes:(files[2].match(/"id": "demo:theme:/g)||[]).length,collections:(files[2].match(/"id": "demo:collection:/g)||[]).length};}
function leakage(){return CRITICAL.filter(p=>/@\/demo\/screenwhy3-homepage|screenwhy3_demo/.test(text(p)));}
const [mode,...rest]=process.argv.slice(2);
if(!["audit","remove"].includes(mode))throw Error("Usage: node scripts/sw3-demo-manager.mjs audit | remove [--confirm-remove-sw3]");
const m=manifest();const actual=counts();const leaks=leakage();
if(leaks.length)throw Error(`SW3 DEMO leakage into public runtime: ${leaks.join(", ")}`);
if(mode==="audit"){
  if(m&&JSON.stringify(actual)!==JSON.stringify(m.counts))throw Error("Demo record count mismatch");
  console.log(JSON.stringify({pack:"screenwhy3_demo",installed:Boolean(m),counts:actual,previewEnabledOnProduction:false,publicRuntimeImports:leaks,previewRoute:"/__ui/screenwhy3/",ownerPreviewFiles:m?OWNED:[],status:m?"DEMO ISOLATED":"DEMO PACK REMOVED"},null,2));
  process.exit(0);
}
if(rest.some(x=>x!=="--confirm-remove-sw3"))throw Error("Unrecognized cleanup flag");
if(!m){console.log("Demo pack already removed — no files changed.");process.exit(0);}
const entries=OWNED.map(p=>({path:p,full:safe(p)}));
for(const e of entries){if(existsSync(e.full)&&lstatSync(e.full).isSymbolicLink())throw Error(`Symlink in demo pack: ${e.path}`);}
// Explicit immutable path scope, dry-run hash inventory by default. A confirmed run operates on these paths ONLY.
const report=entries.filter(e=>existsSync(e.full)).map(e=>({path:e.path,sha256:createHash("sha256").update(readFileSync(e.full)).digest("hex")}));
console.log(JSON.stringify({action:rest.includes("--confirm-remove-sw3")?"CONFIRMED REMOVE":"DRY RUN (nothing deleted)",files:report,protectedWordPressAndFixtures:"untouched"},null,2));
if(!rest.includes("--confirm-remove-sw3"))process.exit(0);
for(const e of entries){if(existsSync(e.full))rmSync(e.full,{force:false});}
for(const p of ["src/demo/screenwhy3-homepage","src/app/(en)/__ui/screenwhy3"]){const dir=safe(p);if(existsSync(dir)){try{rmdirSync(dir);}catch{ /* preserve directories containing user-created files */ }} }
console.log("Only nine explicitly owned preview/demo files removed. Shared live homepage and previous fixtures preserved.");
