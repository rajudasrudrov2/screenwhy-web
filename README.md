# ScreenWhy Web 0.4.1

ScreenWhy is the current public brand for the frontend formerly developed under the PlotExplainer project name. This release continues the authoritative ScreenWhy frontend lineage through SW-FE-02C-B. The controlled rebrand originated from the 0.3.2 foundation; the current release does not restart or redesign the product architecture.

## Current brand

- **Name:** ScreenWhy
- **Domain:** `screenwhy.com`
- **Primary tagline:** The Why Behind What You Watch.
- **Brand promise:** Questions After Watching, Answered.
- **Short slogan:** Watch. Wonder. Understand.
- **Recommended Homepage H1:** Questions After Watching? Find the Answers.

The former PlotExplainer logo/monogram/favicon assets are not used by the current UI. Until an official ScreenWhy Brand Kit is supplied, the header/footer use a restrained textual `ScreenWhy` identity fallback.

## Foundation state

The completed frontend architecture through historical tasks PE-FE-01C, PE-FE-02A and PE-FE-02B is preserved:

```ts
import { getRepositories } from "@/data";

const repositories = getRepositories();
```

Application code receives the same typed repository interfaces from `mock` or `api`; API mode still fails closed with `BackendContractNotReadyError` until the backend transport contract is authoritative.

Existing Canon, Spoiler, Editorial Metadata, Quick Answer, Title Card, Explanation Card and Character Card systems remain unchanged except for brand-dependent copy/URLs.

## Environment configuration

Preferred variables are now ScreenWhy-named:

```text
SCREENWHY_SITE_URL
SCREENWHY_CMS_API_BASE_URL
SCREENWHY_DATA_SOURCE
SCREENWHY_ALLOW_INDEXING
```

The former `PLOTEXPLAINER_*` environment names are temporarily accepted as compatibility fallbacks and are intentionally treated as legacy technical identifiers.

The expected future CMS convention is `cms.screenwhy.com`, but this repository does not verify DNS or a live CMS.

### Legacy REST namespace

`/plotexplainer/v1` remains intentionally unchanged as a legacy internal API namespace. It is not public brand copy. A backend migration decision must determine whether that namespace is retained or version-migrated later.

## Development-only previews

Run the development server and open:

```text
http://localhost:3000/__ui/
http://localhost:3000/__ui/domain/
http://localhost:3000/__ui/cards/
http://localhost:3000/__ui/article/
http://localhost:3000/__ui/citations/
```

These routes are `noindex` and return `404` in production.

## Validation

After dependencies are installed:

```bash
npm run validate:data-foundation
npm run validate:domain-ui-source
npm run validate:card-ui-source
npm run validate:brand-migration
npm run validate:article-ui-source
npm run validate:citation-ui-source
npm run typecheck
npm run lint
npm run build
```

The brand-migration guardrail rejects unintended active former-brand references while allowing only the explicitly documented technical compatibility identifiers.

## Guardrails retained

- English remains the root locale; no `/en/` route is introduced.
- Bangla remains under `/bn/` and never receives silent English editorial fallback.
- Raw fixture arrays remain behind mock repositories.
- No backend endpoint/DTO contract is invented.
- The data/domain foundation is unchanged.
- Existing domain/card UI architecture is unchanged.
- SW-FE-02C-A adds reusable article-reading and TOC primitives without assembling a public Explanation page.
- SW-FE-02C-B adds public-safe Citation / Source Evidence UI without changing domain/data contracts.

## Next task

`SW-FE-03E — Search Results Production Build`

## SW-FE-02C-B — Core component system finalization

Version 0.4.0 adds the reusable public-safe citation and source-evidence presentation layer. It consumes the existing `PublicSource` / `PublicCitation` contracts, deduplicates repeated sources by `SourceId`, uses deterministic composition-order numbering, and keeps raw backend/private research data outside the UI boundary. The development preview is `/__ui/citations/` and returns 404 in production. Final public Explanation pages remain deferred.


## SW-FE-03A — Homepage production build

Version 0.4.0 replaces the English root foundation/status screen with the first production public ScreenWhy page. The Homepage is server-first, repository-driven, composes the existing SW-FE-02 component system, and keeps `/bn/` on the existing safe localization foundation until a real Bangla Homepage is implemented.

Until the backend API contract is ready, production deployments that intentionally use the deterministic frontend fixtures must explicitly set `SCREENWHY_DATA_SOURCE=mock`. API mode remains fail-closed and never silently falls back to demo data.


## SW-FE-03B — Explanation Detail production route

Version 0.4.1 adds the server-first `/explain/[slug]/` public Explanation Detail route. It composes the existing Canon, Spoiler, Editorial Metadata, Quick Answer, article/TOC, citation/source, Character Card and Explanation Card systems through the repository boundary. The opaque `ArticleBodyDocument` is decoded only by the data-source-specific article-body adapter; API article-body mapping remains fail-closed until the backend contract is authoritative.

## SW-FE-03C — Title Hub production routes

Version 0.4.2 adds one shared server-first Title Hub feature for `/movies/[slug]/`, `/tv/[slug]/`, `/anime/[slug]/`, `/k-drama/[slug]/`, and `/documentaries/[slug]/`. Title lookup is route-family-aware, title-specific Explanation/Character/Relationship/Timeline data comes through the public repository boundary, and the current fixture data—not historical design placeholder facts—drives counts, Canon context, adaptation context, viewer questions and related Titles. Archive indexes, Character Detail, Search Results, full Relationship/Timeline experiences and backend work remain deferred.


## SW-FE-03D — Character Detail production route

Version 0.4.3 adds the server-first `/characters/[slug]/` public Character Detail route. It resolves the Character, Primary Title, relationships, chronology-filtered Timeline and related Explanations through the public repository boundary. Contextual Character status remains Canon-sensitive and spoiler-protected instead of being flattened into a global Alive/Dead field. The current Mara Vale fixture provides the fictional validation target; Character Archive, Search Results and full Relationship/Timeline experiences remain deferred.
