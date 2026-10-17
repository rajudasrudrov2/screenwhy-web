import assert from "node:assert/strict";
import { readFileSync, existsSync, mkdtempSync, cpSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import vm from "node:vm";
const require=createRequire(import.meta.url);
let ts;try{ts=require("typescript");}catch{ts=require("/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript");}
const root=resolve(import.meta.dirname,"..");
const read=p=>readFileSync(join(root,p),"utf8");
if(!existsSync(join(root,"src/demo/screenwhy3-homepage/movies.ts"))){
  assert(!read("src/app/(en)/page.tsx").includes("@/demo/"));
  assert(!existsSync(join(root,"src/app/(en)/__ui/screenwhy3/page.tsx")));
  console.log("SW3-FE-01 PASS: demo pack absent after cleanup; live homepage and public-only imports intact.");
  process.exit(0);
}
const src=["src/app/(en)/page.tsx","src/features/homepage3/PremiumHomepage.tsx","src/features/homepage3/live-adapter.ts","src/features/homepage3/PreviewExperience.tsx","src/app/(en)/__ui/screenwhy3/page.tsx","src/app/(en)/__ui/screenwhy3/actions.ts","src/features/homepage3/types.ts","src/demo/screenwhy3-homepage/movies.ts","src/demo/screenwhy3-homepage/explanations.ts","src/demo/screenwhy3-homepage/collections.ts","src/demo/screenwhy3-homepage/index.ts"];
for(const p of src){const f=ts.createSourceFile(p,read(p),ts.ScriptTarget.Latest,true,p.endsWith(".tsx")?ts.ScriptKind.TSX:ts.ScriptKind.TS);assert.equal(f.parseDiagnostics.length,0,`Invalid TS syntax in ${p}`);}
const evalRecords=(path,name)=>{
  const js=ts.transpileModule(read(path),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  const ctx={exports:{},require:(id)=>{throw new Error("Unexpected runtime import "+id)}};
  vm.runInNewContext(js,ctx,{filename:path});return ctx.exports[name];
};
const movies=evalRecords("src/demo/screenwhy3-homepage/movies.ts","DEMO_MOVIES");
const explanations=evalRecords("src/demo/screenwhy3-homepage/explanations.ts","DEMO_EXPLANATIONS");
const themes=evalRecords("src/demo/screenwhy3-homepage/collections.ts","DEMO_THEMES");
const collections=evalRecords("src/demo/screenwhy3-homepage/collections.ts","DEMO_COLLECTIONS");
for(const [items,expected,label] of [[movies,48,"movies"],[explanations,24,"explanations"],[themes,12,"themes"],[collections,8,"collections"]]){
  assert.equal(items.length,expected,label);assert.equal(new Set(items.map(x=>x.id)).size,expected,`Duplicate ${label}`);
  assert(items.every(x=>x.isDemo===true&&x.source==="screenwhy3_demo"&&x.id.startsWith("demo:")),`Wrong provenance: ${label}`);
}
const adapterTs = ts.transpileModule(read("src/features/homepage3/live-adapter.ts"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const adapterCtx={exports:{}};vm.runInNewContext(adapterTs,adapterCtx,{filename:"live-adapter.ts"});
const pureLive=adapterCtx.exports.buildLiveHomepageModel({items:[
  {id:37,slug:"triangle-2009",headline:"Triangle explained",excerpt:"Saved copy",publicPath:"/explain/triangle-2009/",publishedAt:"2026-10-10T00:00:00Z",modifiedAt:"2026-10-12T00:00:00Z"},
  {id:72,slug:"carrie-episode-1",headline:"Carrie explained",excerpt:"Saved copy",publicPath:"/explain/carrie-episode-1/",publishedAt:"2026-10-11T00:00:00Z",modifiedAt:"2026-10-11T00:00:00Z"}
],page:1,perPage:50,total:2});
assert.equal(pureLive.mode,"live");assert.equal(pureLive.explanations.length,2);assert.equal(pureLive.explanations[0].id,"wp:72");assert(pureLive.explanations.every(x=>x.isDemo===false&&x.source==="live"&&x.href?.startsWith("/explain/")));
assert.equal(pureLive.movies.length,0,"No fabricated live Movie metadata");
const ids=new Set(movies.map(x=>x.id));assert(explanations.every(x=>ids.has(x.movieId)&&!x.href));assert(collections.every(x=>x.movieIds.every(id=>ids.has(id))));
const homepage=read("src/app/(en)/page.tsx");assert(!homepage.includes("@/demo/")&&!homepage.includes("screenwhy3_demo"));assert(homepage.includes("getLiveExplanations")&&homepage.includes("PremiumHomepage"));
const live=read("src/features/homepage3/live-adapter.ts");assert(!live.includes("@/demo/")&&live.includes('source: "live"'));
const preview=read("src/features/homepage3/PreviewExperience.tsx");assert(preview.includes("Hide All Demo Content")&&preview.includes("Show Demo Content")&&preview.includes("localStorage")&&preview.includes("setShowDemo(false)")===false);assert(preview.includes("choose(false)")&&preview.includes("choose(true)"));
const config=read("next.config.ts");assert(config.includes("/__ui/screenwhy3/:path*")&&config.includes("private, no-store")&&config.includes("noimageindex"),"Private preview response headers");
const page=read("src/app/(en)/__ui/screenwhy3/page.tsx");assert(page.includes("notFound()")&&page.includes("previewAuthorized")&&page.includes("robots: { index: false"));
const access=read("src/app/(en)/__ui/screenwhy3/actions.ts");assert(access.includes("timingSafeEqual")&&access.includes('httpOnly:true')&&access.includes("SCREENWHY_SW3_PREVIEW_PASSWORD"));
const visual=read("src/features/homepage3/PremiumHomepage.tsx");assert(visual.includes("model.explanations.slice(5)"),"Remaining demo previews visible");for(const heading of ["Every story leaves", "FEATURED MOVIE", "ENDING EXPLAINED", "BROWSE BY ENTERTAINMENT", "RECENTLY UPDATED"]){assert(visual.includes(heading),`Missing ${heading}`);}
assert(!visual.includes('href={`/explain/')&&!visual.includes('href="/explain/demo'));
const audit=execFileSync("node",["scripts/sw3-demo-manager.mjs","audit"],{cwd:root,encoding:"utf8"});const obj=JSON.parse(audit);assert.equal(obj.status,"DEMO ISOLATED");assert.equal(obj.publicRuntimeImports.length,0);
const scratch=mkdtempSync(join(tmpdir(),"sw3-demo-cleanup-test-"));
try{
  for(const p of ["src/demo/screenwhy3-homepage","src/app/(en)/__ui/screenwhy3","src/features/homepage3/PreviewExperience.tsx","src/features/homepage3/PreviewExperience.module.css", "src/app/(en)/page.tsx", "src/lib/live-explanations.ts", "src/app/(en)/search/page.tsx", "src/app/sitemap.ts", "src/app/(en)/explanations/page.tsx", "src/data/repositories/create-repository.ts", "scripts/sw3-demo-manager.mjs", "scripts/validate-sw3-homepage.mjs"]){if(existsSync(join(root,p)))cpSync(join(root,p),join(scratch,p),{recursive:true,force:true});}
  // cpSync does not create ancestors on some Node distributions; scratch builder handles it externally in tests if needed.
} catch(e){ // keep independent cleanup copy test robust using exec runner's own directory copying
  rmSync(scratch,{recursive:true,force:true});throw e;
}
const dry=execFileSync("node",["scripts/sw3-demo-manager.mjs","remove"],{cwd:scratch,encoding:"utf8"});assert(dry.includes("DRY RUN"));assert(existsSync(join(scratch,"src/demo/screenwhy3-homepage/movies.ts")));
const cleanup=execFileSync("node",["scripts/sw3-demo-manager.mjs","remove","--confirm-remove-sw3"],{cwd:scratch,encoding:"utf8"});assert(cleanup.includes("nine explicitly owned"));assert(!existsSync(join(scratch,"src/demo/screenwhy3-homepage/movies.ts")));assert(existsSync(join(scratch,"src/app/(en)/page.tsx")));
const audited=JSON.parse(execFileSync("node",["scripts/sw3-demo-manager.mjs","audit"],{cwd:scratch,encoding:"utf8"}));assert.equal(audited.status,"DEMO PACK REMOVED");
const postCleanupTest=execFileSync("node",["scripts/validate-sw3-homepage.mjs"],{cwd:scratch,encoding:"utf8"});assert(postCleanupTest.includes("live homepage"));
rmSync(scratch,{recursive:true,force:true});
console.log(`SW3-FE-01 PASS: ${src.length} TS/TSX AST parses, 48 movies, 24 explanations, 12 themes, 8 collections, owner preview gates, real-only routes, cleanup dry-run/confirmed scratch test.`);
