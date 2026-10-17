# SW3-FE-01 — Repository-relative PATCH manifest

**Base `main`: `84ea1ae94e4fa007ccb75268ff8f52d75eb569ed`**. Never apply against newer main without a new diff.

**ADD 15 · MODIFY 3 · DELETE 0.**

| Operation | Exact repository-relative path | SHA-256 |
|---|---|---|
| ADD | `src/features/homepage3/types.ts` | `bfe3588b5508a2c607c4b5f4fc56a0bd52604d7137b207589959f9d73f2e973c` |
| ADD | `src/features/homepage3/live-adapter.ts` | `7d5a66fe6539c105a7a264002aaa4d1c7f3f10f507d62f78f8d3b94d5c5c62b9` |
| ADD | `src/features/homepage3/PremiumHomepage.tsx` | `bf496ef4d3336b53a41da33bb58c10413ecbe1c3513e70d6d62b97623bc61b48` |
| ADD | `src/features/homepage3/PremiumHomepage.module.css` | `a0ad5d0134de180cc70029412ffe93529972024fdb5bc57bf6e05ca4525bf4ac` |
| ADD | `src/features/homepage3/PreviewExperience.tsx` | `7e7ff212d52699bcfd97546414af9973d8c6b67f990cefae7692294d7cb6c27e` |
| ADD | `src/features/homepage3/PreviewExperience.module.css` | `e2061c6e5488eab59071c6e4063f6c242b8c4a36db138a62ed3cf6e724fe4592` |
| ADD | `src/demo/screenwhy3-homepage/movies.ts` | `9bb9e3857fc7afa74465851d649122fe2b7d586b11355eab9300504f6c65fcdc` |
| ADD | `src/demo/screenwhy3-homepage/explanations.ts` | `f24820fe2eb72ff2dd927a314e627c2d525d77581f81bb241b2e7f62e19215d9` |
| ADD | `src/demo/screenwhy3-homepage/collections.ts` | `552f68ba99b0c6fa0b51173f0ff366a5eb8d13630eaffc01f886648324867fdb` |
| ADD | `src/demo/screenwhy3-homepage/index.ts` | `bedc7cde6311f7f748c5527396fe167d697d792c55b7214b9e9aa09cc6441356` |
| ADD | `src/demo/screenwhy3-homepage/manifest.json` | `7dfd800318f0d2898bcadfef025c28bfab8eb404fa00ebd570f88c3f3a190a3d` |
| ADD | `src/app/(en)/__ui/screenwhy3/page.tsx` | `953ec3ce045f0d3c1a4e4bc9369a0c3b4fd827f22678188e296163574f15aebf` |
| ADD | `src/app/(en)/__ui/screenwhy3/actions.ts` | `94949e3f303d159db392a287adc5e3cd184d2f829250d0ba3a2510dfb7617ba9` |
| ADD | `scripts/sw3-demo-manager.mjs` | `9c5176649c09b5c5d149dd151f9af4f5f1ce5411a1aa926c64882183076f75ce` |
| ADD | `scripts/validate-sw3-homepage.mjs` | `fd3f9b373a594e1c1a029fdcdbbe3eff2d2ae542b1c56225cd8af7ef0efcfc3f` |
| MODIFY | `src/app/(en)/page.tsx` | `8a23a1371445ff93368896638c8c3f7820ba89f812e26a390f58451fe0af2e04` |
| MODIFY | `next.config.ts` | `89db737bf18a8f96d69876d150ceb27ee6ea302bda4714af6408d4ce620514f0` |
| MODIFY | `package.json` | `78ac4c22f999588c1acd2ad6a45ac6b95a9302f88d0d1f35e09ffa5e5156dbf5` |

## Scope and application

Copy the listed paths into the EXISTING Next.js repository at exactly their paths, not alongside or inside an extra ZIP directory. `src/demo/screenwhy3-homepage` is the ONLY new demo dataset. `src/app/(en)/__ui/screenwhy3/` is authenticated/local owner-preview only. Shared `src/features/homepage3` rendering and live adapter use no demo imports. No WordPress, GitHub or Vercel changes were made by generating this ZIP.

If `main` differs from the base SHA, perform a three-way merge before applying. `npm ci`, `npm run typecheck`, `npm run lint`, `npm run validate`, `npm run validate:sitemap`, `npm run build`, `npm run validate:sw3-homepage` and `npm run demo:audit:sw3` must pass on a real current checkout before approval for deployment. A Vercel **preview** environment additionally requires `SCREENWHY_SW3_PREVIEW_ENABLED=true`, a strong secret `SCREENWHY_SW3_PREVIEW_PASSWORD` (>=24 characters) and Vercel Deployment Protection. Never set these for public production.
