import assert from "node:assert/strict";
import { collectApprovedPublicSitemap } from "../../src/lib/seo/sitemap-public";
import type { PublicReadRepositories } from "../../src/data/repositories/contracts";

type Kind = "title" | "explanation" | "character";
type FakeRecord = Record<string, unknown>;
function record(kind: Kind, slug: string, verification = "approved", published = true): FakeRecord {
  return {
    identity: { kind, localization: {
      currentVariant: { publicationState: published ? "published" : "draft", published, locale: "en-US", slug }
    }},
    verification: { state: verification },
    ...(kind === "title" ? { publicRouteFamily: "movies" } : {})
  };
}
function page(items: readonly FakeRecord[], at = 1, pages = items.length ? 1 : 0, size = 50) {
  return { items, page: at, pageSize: size, totalPages: pages, totalItems: pages * items.length };
}
function repos(
  titles: (p: number) => Promise<ReturnType<typeof page>>,
  explanations: (p: number) => Promise<ReturnType<typeof page>>,
  characters: (p: number) => Promise<ReturnType<typeof page>>,
) {
  return { titles: { list: ({page: p}: {page: number}) => titles(p) },
    explanations: { list: ({page: p}: {page: number}) => explanations(p) },
    characters: { list: ({page: p}: {page: number}) => characters(p) }
  } as unknown as Pick<PublicReadRepositories, "titles" | "explanations" | "characters">;
}
async function main() {
let passed = 0;
async function check(label: string, f: () => Promise<void>) {
  await f(); console.log("PASS " + label); passed++;
}
const empty = async (p: number) => page([],p);
await check("approved English published Title/Explanation/Character all included", async () => {
  const sitemap = await collectApprovedPublicSitemap(repos(
    async p => page([record("title","triangle")],p),
    async p => page([record("explanation","triangle-2009")],p),
    async p => page([record("character","jess")],p)
  ),"https://screenwhy.com");
  const urls = sitemap.map(i=>i.url);
  assert.ok(urls.includes("https://screenwhy.com/movies/triangle/"));
  assert.ok(urls.includes("https://screenwhy.com/explain/triangle-2009/"));
  assert.ok(urls.includes("https://screenwhy.com/characters/jess/"));
  assert.equal(urls.length,new Set(urls).size);
  assert.deepEqual(urls,[...urls].sort());
});
await check("unverified, draft, source_checked, fact_checked, unsafe slug all excluded",async()=>{
  const data = [record("title","private-film","unverified"),record("title","draft-film","approved",false),record("title","checked-film","source_checked"),record("title","partly-film","fact_checked"),record("title","../escape"),record("title","one?secret"),record("title","verified")];
  const sitemap=await collectApprovedPublicSitemap(repos(async p=>page(data,p),empty,empty),"https://screenwhy.com");
  const dynamic=sitemap.map(x=>x.url).filter(u=>u.includes("/movies/")&&u.endsWith("/verified/"));
  assert.equal(dynamic.length,1);
  assert.ok(!sitemap.some(i=>/private-film|draft-film|checked-film|partly-film|escape|secret/.test(i.url)));
});
await check("unsupported route families cannot index",async()=>{
  const item={...record("title","triangle"),publicRouteFamily:"secret"};
  const sitemap=await collectApprovedPublicSitemap(repos(async p=>page([item],p),empty,empty),"https://screenwhy.com");
  assert.ok(!sitemap.some(x=>x.url.endsWith("/secret/triangle/")));
});
await check("CMS unavailable fails closed instead of partial/empty fallback",async()=>{
  await assert.rejects(()=>collectApprovedPublicSitemap(repos(
    async p=>page([record("title","triangle")],p),
    async()=>{throw new Error("CMS network unavailable");},empty),"https://screenwhy.com"),/network unavailable/);
});
await check("malformed pagination fails closed",async()=>{
  await assert.rejects(()=>collectApprovedPublicSitemap(repos(
    async p=>page([record("title","triangle")],p,11),empty,empty),"https://screenwhy.com"),/cap/);
});
await check("inconsistent pagination across pages fails closed",async()=>{
  await assert.rejects(()=>collectApprovedPublicSitemap(repos(
    async p=>page([record("title","triangle")],p,p===1?2:1),empty,empty),"https://screenwhy.com"),/changed/);
});
await check("pagination traverses both approved pages",async()=>{
  const sitemap=await collectApprovedPublicSitemap(repos(
    async p=>page([record("title",p===1?"first":"second")],p,2),empty,empty),"https://screenwhy.com");
  assert.ok(sitemap.some(i=>i.url.endsWith("/movies/first/")));
  assert.ok(sitemap.some(i=>i.url.endsWith("/movies/second/")));
});
await check("unsafe base origin rejected",async()=>{
  await assert.rejects(()=>collectApprovedPublicSitemap(repos(empty,empty,empty),"http://untrusted.example"),/Unsafe/);
});
await check("empty approved API collections emit static-only safe URLs",async()=>{
  const sitemap=await collectApprovedPublicSitemap(repos(empty,empty,empty),"https://screenwhy.com");
  assert.ok(sitemap.length>1);
  assert.ok(!sitemap.some(i=>/\/bn\/|plotexplainer/i.test(i.url)));
});
console.log("SITEMAP_CONTRACT_ASSERTIONS_PASS=" + passed);


}
main().catch(error => {console.error(error); process.exitCode = 1;});
