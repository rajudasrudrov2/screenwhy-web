# SW-LIVE-02 — Frontend Changed-Files PATCH Manifest

Base repository: `rajudasrudrov2/screenwhy-web`
Locked `main` commit: `292a1ca08793eab37a93708547bbaf2879f09cfb`
Target: **separate owner-reviewed feature branch only after authorization.**

Do not bulk replace the repository or assume uploading a ZIP to GitHub extracts it. Do not delete demo fixtures until itemized owner approval.

| Action | Repo-relative exact path | SHA-256 in patch |
|---|---|---|
| ADD | `scripts/validate-live-integration.mjs` | `ff01120e8d8cdc1dcb1c18abd73dd6c7784295e602cd48651b52f2154d750ff3` |
| ADD | `src/lib/live-explanations.ts` | `bd3ef84c3f8257585d46c45ab71d7c4299bf6729bd388bad6478d9c55cec886f` |
| ADD | `src/features/live-explanation/LiveExplanationViews.tsx` | `7f9b1629d86af13a771df2519cd12ee7d5bf201a927b8413046bfad6e0882e7f` |
| ADD | `src/features/live-explanation/LiveExplanationViews.module.css` | `6193d1badf054b4ee169ee89ac7b3e1bc13718a0260761f18d74e2b7b3389e57` |
| ADD | `src/app/api/screenwhy/revalidate/route.ts` | `74d3392db16c3a772de4dc181716fc942d11bba07dbacfc6143f01964e108278` |
| MODIFY | `src/app/(en)/explain/[slug]/page.tsx` | `5d158a99020556f49060e643a8b26d6e8e6a8549339c3ca31f0f55bdf655fa2b` |
| MODIFY | `src/app/(en)/explain/triangle-2009/page.tsx` | `962475765cab14ffbf023aa5af89f67b340e6b8c8e804e0bf951b37d42ba10aa` |
| MODIFY | `src/app/(en)/explanations/page.tsx` | `daa44544ee83d42900866343f8e679b31b88bfebbc4a94716dabf550f0a53417` |
| MODIFY | `src/app/(en)/page.tsx` | `9774354b90f0d47f14c9293aa470951a3510797181106131a7808f2d2ca69bd3` |
| MODIFY | `src/app/(en)/search/page.tsx` | `d67a36ee4ff8154fdefe24fddd3eec1e2545f6945ea96bf6336ec847caee9c02` |
| MODIFY | `src/app/sitemap.ts` | `98187b87daad16c8069fa4475ff82bde9a96300ae7e51107a23e7d904bd56d1d` |
| MODIFY | `src/data/repositories/create-repository.ts` | `e9c941fe1c980f0a946f2a84a8b7f9e4ea8f14c59c974de933df9a234567f857` |

**DELETE: NONE.** The patch does not contain unmodified repository files.

Key dependencies: Next.js 16.3.8, React 19.3.0, Node >=20.19; Node 24.x on current Vercel project. New webhook is server-only and needs `SCREENWHY_REVALIDATION_SECRET` in Vercel production, matching WordPress config.

Before deployment: configure **production** `SCREENWHY_DATA_SOURCE=api`, `SCREENWHY_CMS_API_BASE_URL=https://cms.screenwhy.com/wp-json`, `SCREENWHY_SITE_URL=https://screenwhy.com`, and review `SCREENWHY_ALLOW_INDEXING`; old `PLOTEXPLAINER_DATA_SOURCE` value was not decrypted or changed. WordPress requires matching `SCREENWHY_REVALIDATION_SECRET` and `SCREENWHY_REVALIDATION_ENDPOINT` constants.

Rollback: revert the exact new commit/PR and restore env values; WordPress plugin and SQL/media rollback are separate. If live is in mock mode, activating production enforcement **without configuring API** produces a configuration error by design.

**FULL npm build/lint/tsc NOT RUN**: no full GitHub checkout in local working directory; isolated parser and webhook tests do not certify the deployment.
