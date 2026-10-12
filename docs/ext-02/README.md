# EXT-02 Author Profile production fix

## Release decision

HOLD: do not merge or deploy to production until a real public author can be verified against the CMS. No WordPress data was changed.

The public story is explanation byline → `/authors/[slug]/` → read-only WordPress Author API → profile and published explanations.

## Source comparison

Baseline main: `175eadcbcca7f4691ded3d3811e3db2d1302a7f0`.

Input: `screenwhy-web-EXT-02-Author-Profile-Complete-GitHub-Project.zip`.

ZIP SHA-256: `60a87107bfc5650569b0f4e4dc834aa811be993aadf833088d75eac2258ec618`.

All 350 paths compared using SHA-256: 327 unchanged, 15 modified, 8 added, zero deletion candidates. See `zip-main-comparison.json` for every path and both hashes.

## Applied feature dependencies

| File | Purpose |
| --- | --- |
| `src/app/(en)/authors/[slug]/page.tsx` | Public profile route, metadata, pagination, structured data and missing-profile response |
| `src/app/(en)/authors/[slug]/AuthorPage.module.css` | Responsive layout and focus states |
| `src/data/api/author-profiles.ts` | GET API integration, strict response parsing and no mock fallback |
| `src/components/domain/editorial/EditorialMetadata.tsx` | Link only explicitly public author identities using Next Link |
| `src/components/domain/editorial/EditorialMetadata.module.css` | Author link and keyboard focus styles |
| `src/data/api/mappers.ts` | Validate public author visibility and approved slug |
| `src/types/domain/editorial.ts` | Add optional profilePublic consent indicator |

The route imports existing SiteFrame, siteConfig and the new API reader. The reader reuses existing env configuration and the API client, which appends `/screenwhy/v1`. CSS uses existing project tokens. `(en)` is a route group: public URLs have no `/en` prefix.

No package or lockfile change is required. Unrelated ZIP changes (sitemap, Cut to the Chase, preview metadata, movie page, homepage gateway and related tests/workflow/dependencies) were not applied. No existing tracked file was deleted.

Added `scripts/validate-author-profile.ts`, included it in the data-validation compilation and existing test runner. It covers successful parsing, private/malformed responses, pagination mismatch and bounds, unsafe URLs/slugs, excessive article counts, read-only request construction, 404/500 and invalid JSON with no fallback. Fixture identities are test-only and were never added to WordPress.

## Live CMS evidence

- `GET https://cms.screenwhy.com/wp-json/screenwhy/v1/` returns HTTP 200 and registers `/authors/(?P<slug>[a-z][a-z0-9-]{2,63})`.
- Read-only inspection of deployed `src/Rest/AuthorProfiles.php` confirms the consent key `_sw_author_profile_public`, separate public slug/name fields and a requirement for eligible public articles.
- Read-only database count of `_sw_author_profile_public = '1'`: **0**.
- `GET /screenwhy/v1/explanations?locale=en-US`: empty data, totalItems 0.
- Synthetic missing-author negative check returns HTTP 404 with code `screenwhy_not_found` and message `The requested ScreenWhy resource was not found.` This is not a real-author success check.
- No existing public author slug is available; positive CMS integration and real-author public URL acceptance remain BLOCKED. No slug was guessed or fabricated for success evidence.

## Existing production evidence

Vercel project `prj_UUct1JIhwEnYYLKJ6AfP9QM4EDSb`, team `team_SR9I3rEkQfA3nbA6Ne06ROfK`.

Existing production deployment `dpl_6PWxPnwFN2UcTTL1PL9tfUDYEB6j`: READY, target production, GitHub main SHA `175eadcbcca7f4691ded3d3811e3db2d1302a7f0`. This is the pre-fix deployment, not proof this change is deployed. Main and production must remain unchanged while the acceptance blocker exists.

## Unblock requirement

The owner must separately arrange an explicitly public author profile with a valid distinct public slug/name and at least one explanation meeting the CMS public visibility requirements. This task does not authorize changing production data. Then verify the actual API response and public profile on preview, require CI success, merge and verify the resulting production deployment and author URL.

## Local validation results

- `npm ci --no-audit --no-fund`: PASS, pinned dependencies unchanged.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS, zero errors and 15 warnings (14 existing warnings, one new native author portrait img advisory).
- `npm run validate`: PASS, Author Profile behavioral tests included and 22/22 source validation suites passed.
- `npm run build` with API data source, real CMS base, screenwhy.com origin and indexing disabled: PASS; `/authors/[slug]` appears as a dynamic server-rendered route.
- Re-running lint after validation initially picked up generated `.data-validation` CommonJS output. Only disposable generated output was removed, then the existing CI order (typecheck, lint, validate, build) passed. No lint rule was weakened.
- The first new negative-locale test used a disallowed language literal; it was replaced with `invalid` to preserve the English-only source rule. Final source guardrails pass.
- Browser rendering and positive live-author integration: BLOCKED by missing production profile/content.
