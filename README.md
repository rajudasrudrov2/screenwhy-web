# ScreenWhy Web 0.4.6

ScreenWhy is the current public brand for the frontend formerly developed under the PlotExplainer project name. Version 0.4.6 is the controlled English-only scope cleanup built directly from the authoritative 0.4.5 frontend; it does not restart or redesign the product architecture.

## Current product scope

- **Public language:** English (`en-US`) only.
- **Public URL architecture:** English pages live at root paths; no `/en/` prefix is introduced.
- **Brand:** ScreenWhy (`screenwhy.com`).
- **Primary tagline:** The Why Behind What You Watch.
- **Brand promise:** Questions After Watching, Answered.
- **Short slogan:** Watch. Wonder. Understand.

The previously implemented secondary-language frontend, route tree, UI switch, fixtures, presentation branches, font wiring, metadata alternates and development examples were removed in this release. Generic logical-identity/localization concepts remain only where they are still structurally useful and do not assume a specific secondary language.

## Preserved frontend

The English Homepage, Explanation Detail, Title Hub, Character Detail, Search, Movies/TV/Anime/K-Drama/Documentaries archives, Character archive, global navigation, cards, Canon, Spoiler, Quick Answer, long-form article system, Citation/Source Evidence system, repository boundary and API fail-closed behavior remain in scope.

Application code continues to consume the typed repository boundary:

```ts
import { getRepositories } from "@/data";
const repositories = getRepositories();
```

API mode still fails closed with `BackendContractNotReadyError` until an authoritative backend transport contract exists.

## Environment configuration

Preferred variables:

```text
SCREENWHY_SITE_URL
SCREENWHY_CMS_API_BASE_URL
SCREENWHY_DATA_SOURCE
SCREENWHY_ALLOW_INDEXING
```

Former `PLOTEXPLAINER_*` environment names remain temporary technical compatibility fallbacks. The legacy internal REST namespace `/plotexplainer/v1` also remains intentionally unchanged; backend migration is outside this frontend-only cleanup.

## Development-only previews

Development QA routes remain available and English-only:

```text
/__ui/
/__ui/domain/
/__ui/cards/
/__ui/article/
/__ui/citations/
```

They are `noindex` and return 404 in production.

## Validation

After dependencies are installed:

```bash
npm run validate:data-foundation
npm run validate:domain-ui-source
npm run validate:card-ui-source
npm run validate:brand-migration
npm run validate:article-ui-source
npm run validate:citation-ui-source
npm run validate:homepage-source
npm run validate:explanation-detail-source
npm run validate:title-hub-source
npm run validate:character-detail-source
npm run validate:search-source
npm run validate:archive-source
npm run validate:english-only
npm run typecheck
npm run lint
npm run build
```

`validate:english-only` rejects reintroduction of the removed locale, route prefix, language-specific UI/data/font references, and deleted switch/localization symbols in active frontend and validation source.

## Release history

- **0.4.0:** Homepage and reusable citation/source foundation.
- **0.4.1:** Explanation Detail.
- **0.4.2:** Title Hub routes.
- **0.4.3:** Character Detail.
- **0.4.4:** Search production build.
- **0.4.5:** Browse & Archive production build.
- **0.4.6:** Controlled English-only frontend cleanup; secondary-language implementation removed while completed English pages and domain contracts are preserved.

## Next task

`SW-FE-03G — RELATIONSHIP & TIMELINE PRODUCTION BUILD`
