# SW3-FE-01 BUILD FIX 01 — Exact Patch Manifest

**Base:** `rajudasrudrov2/screenwhy-web` current GitHub `main` commit `140231c1450da8ebe096e13f73e3b3801bc7b61c` (verified in the current audit). Do NOT overwrite if HEAD advances; recompare first.

**MODIFY (1):** `src/features/homepage3/live-adapter.ts`. ADD: none. DELETE: none.

**Existing GitHub blob SHA-1:** `bed89161674e9684b69c4c639114442ed20d0490` (matched exactly to source supplied in the original SW3 patch).  
**New Git blob SHA-1:** `433b058f4858395173b14a1ea502cc1fd9fe1da8`.  
**Original file SHA-256:** `7d5a66fe6539c105a7a264002aaa4d1c7f3f10f507d62f78f8d3b94d5c5c62b9`.  
**Corrected file SHA-256:** `2c45c6bae790b588ce67e9ea3523cae57116e664f82ff75a2317dcd9ccfa3158`.

## Exact one-line diff

```diff
--- a/src/features/homepage3/live-adapter.ts
+++ b/src/features/homepage3/live-adapter.ts
@@ -3,7 +3,7 @@
 const date = (raw: string) => { const ms = Date.parse(raw.replace(" ", "T")); return Number.isFinite(ms) ? ms : 0; };
 /** NO demo fallback. The WordPress feed supplies only Published explanations. */
 export function buildLiveHomepageModel(feed: LiveList): PremiumHomeModel {
-  const explanations: HomeExplanation[] = feed.items.map(item => ({
+  const explanations: HomeExplanation[] = feed.items.map<HomeExplanation>(item => ({
     id: `wp:${item.id}`, source: "live", isDemo: false,
     headline: item.headline, excerpt: item.excerpt, href: item.publicPath,
     publishedAt: item.publishedAt, modifiedAt: item.modifiedAt,
```

The generic return type preserves the `HomeExplanation` literal union `source: "live"` instead of inferring `string`, eliminating the reported TS2322. No runtime behavior change, no demo removals, no CSS/design change, no WordPress changes, no configuration changes.

## Tests, limitations and deployment gate

- PASS — original reproduces TS2322 in an isolated strict TypeScript compiler using the original `live-adapter.ts`/`types.ts` and a structural `LiveList` declaration.
- PASS — corrected pair compiles in the same isolated strict TypeScript test.
- PASS — actual SW3 `validate-sw3-homepage.mjs` standalone suite: 11 source parses, 48 demo movies, 24 explanations, 12 themes, 8 collections, owner preview control contracts, live-only route guards, scratch-copy cleanup dry-run and confirmed cleanup.
- PASS — actual `sw3-demo-manager.mjs audit`: all demo records counted, no demo public-runtime imports.
- BLOCKED — **full authoritative repository** `npm run typecheck`, `npm run lint`, `npm run validate`, `npm run build`. The GitHub connector is read-only and returns individual files; the container cannot access github.com to clone. The available patch-only workspace lacks the complete repository, tsconfig/lockfile, Next.js, React and ESLint dependencies. Commands were attempted there but these are infrastructure failures, not results for the full current main.
- BLOCKED — browser/remote Vercel build; no commit, preview deployment or GitHub Actions trigger authorized.

**Acceptance:** targeted TS2322 fix verified, full production build acceptance PENDING. Run `npm ci && npm run typecheck && npm run lint && npm run validate && npm run build && npm run validate:sw3-homepage && npm run demo:audit:sw3` on a complete checkout at the expected commit **before approval of merge/deployment**. Do not delete demo content in production.
