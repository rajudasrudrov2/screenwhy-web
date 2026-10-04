# ScreenWhy Web 0.3.3

ScreenWhy is the current public brand for the frontend formerly developed under the PlotExplainer project name. This release is a controlled brand migration from the authoritative frontend `0.3.2` lineage; it does not restart or redesign the product architecture.

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
```

These routes are `noindex` and return `404` in production.

## Validation

After dependencies are installed:

```bash
npm run validate:data-foundation
npm run validate:domain-ui-source
npm run validate:card-ui-source
npm run validate:brand-migration
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
- No public page implementation is added by this migration.

## Next task

`SW-FE-02C — Citation / Source / TOC / Article Primitives`
