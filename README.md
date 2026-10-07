# ScreenWhy Web 0.5.3

ScreenWhy is the current public brand for the frontend formerly developed under the PlotExplainer project name. Version 0.5.3 completes the public frontend source-implementation sequence: production utility/error/availability states from v0.5.1 are followed by the first complete cross-page integration, responsive, accessibility, SEO and performance hardening pass. Backend/data contracts remain unchanged and API mode remains fail-closed.

## Current product scope

- **Public language:** English (`en-US`) only.
- **Public URL architecture:** English pages live at root paths; no `/en/` prefix is introduced.
- **Brand:** ScreenWhy (`screenwhy.com`).
- **Primary tagline:** The Why Behind What You Watch.
- **Brand promise:** Questions After Watching, Answered.
- **Short slogan:** Watch. Wonder. Understand.

The concrete secondary-language frontend, route tree, UI switch, fixtures, presentation branches, font wiring, metadata alternates and development examples were removed in v0.4.6. Generic logical-identity/localization concepts remain only where they are still structurally useful and do not assume a specific secondary language.

## Preserved frontend

The English Homepage, Explanation Detail, Explanation Discovery, Title Hub, Character Detail, Search, Movies/TV/Anime/K-Drama/Documentaries archives, Character archive, Relationship, Story Timeline, global navigation, cards, Canon, Spoiler, Quick Answer, long-form article system, Citation/Source Evidence system, repository boundary and API fail-closed behavior remain in scope.

## Relationship experience

Relationship pages are title-scoped under every current Title route family, for example:

```text
/movies/the-last-signal/relationships/mara-vale/elias-vale/
```

One canonical A↔B ordering is used. A valid reverse request redirects to the canonical route; there is no global `/relationships/` archive. Relationship history, current status, related story events and map discovery preserve the existing Canon and Spoiler systems.

## Story Timeline experience

Story Timeline pages are also title-scoped under every current Title route family, for example:

```text
/movies/the-last-signal/timeline/
```

The clean URL defaults to story chronology. Presentation order is an alternate server-rendered view using URL state:

```text
/movies/the-last-signal/timeline/?order=presentation
```

`chronologyOrder` and `presentationOrder` remain separate domain concepts. Major/full events use neutral protected labels before disclosure, and event anchors are deterministic without deriving from spoiler-heavy titles. Timeline Characters, Explanations and Relationship cross-links resolve through repository/public-route boundaries.

## Explanation Discovery

The primary Explanation discovery route is:

```text
/explanations/
```

It supports server-rendered URL filters for local search, Explanation type, Title route family, Canon context, deterministic sort and pagination. Four substantive curated routes are also available:

```text
/explanations/ending-explained/
/explanations/character-explained/
/explanations/mystery-explained/
/explanations/book-vs-screen/
```

The discovery layer uses `ExplanationRepository.list()` rather than raw fixture imports. Mock-mode filtering occurs before sorting and pagination, while API mode remains fail-closed until an authoritative wire contract exists. Filter/search combinations are noindex and canonicalize to the clean archive or curated intent; pagination-only clean pages follow the established archive canonical strategy.

Application code continues to consume the typed repository boundary:

```ts
import { getRepositories } from "@/data";
const repositories = getRepositories();
```

API mode still fails closed with `BackendContractNotReadyError` until an authoritative backend transport contract exists.

## Trust, editorial and static pages

Version 0.5.0 adds nine real public pages using one typed, reusable editorial-page system:

```text
/about/
/contact/
/editorial-policy/
/sourcing-policy/
/corrections-policy/
/ai-usage-policy/
/privacy/
/terms/
/copyright-dmca/
```

Long policy pages reuse the existing Article reading measure and TOC system. Contact and Copyright / DMCA intentionally publish no invented email, phone, address, company identity or agent information; the current frontend has no authoritative public contact destination or submission backend. Privacy copy documents the browser-local Recent Searches behavior without making unsupported claims about infrastructure logging, cookies or future services.

## Environment configuration

Preferred variables:

```text
SCREENWHY_SITE_URL
SCREENWHY_CMS_API_BASE_URL
SCREENWHY_DATA_SOURCE
SCREENWHY_ALLOW_INDEXING
```

Former `PLOTEXPLAINER_*` environment names remain temporary technical compatibility fallbacks. The legacy internal REST namespace `/plotexplainer/v1` also remains intentionally unchanged; backend migration is outside this frontend-only workstream.

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

## Frontend hardening

Version 0.5.3 completes the source-level frontend integration pass. Global Header Search is a real native GET entry point to `/search/`; the shared SiteFrame remains the sole main landmark; known public links and hash targets are source-validated; filtered/search discovery URLs retain noindex behavior; and root `robots.ts` / `sitemap.ts` use centralized `siteConfig` rather than hardcoded production domains. The static sitemap intentionally excludes Search, development UI, query variants, and fictional/mock dynamic detail entities until the real CMS inventory becomes authoritative.

Source-level accessibility hardening preserves keyboard/focus semantics, reduced-motion treatment, labelled forms, touch-target sizing and editorial reading measure. These checks are invariants, not a claim of complete WCAG conformance or visual runtime acceptance.

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
npm run validate:relationship-source
npm run validate:timeline-source
npm run validate:explanation-discovery-source
npm run validate:static-pages-source
npm run validate:utility-states-source
npm run validate:frontend-integration-source
npm run validate:accessibility-source
npm run validate:seo-source
npm run validate:performance-source
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
- **0.4.7:** Character Relationship production experience with title-scoped routes, canonical pair redirect, spoiler-safe state history, relationship-relevant Timeline events, deterministic relationship map and surgical Title Hub/Character Detail navigation.
- **0.4.8:** Story Timeline production experience with five title-scoped route families, chronology/presentation URL views, spoiler-safe event presentation, Character/Explanation/Relationship cross-links and surgical Title Hub/Character Detail/Relationship integration.
- **0.4.9:** Explanation Discovery / Archive with `/explanations/`, four curated editorial routes, repository-backed local filters/search/sort/pagination, archive SEO guardrails, and Footer discovery links.
- **0.5.0:** Reusable Trust, Editorial & Static Page system for About, Contact, editorial standards, Privacy, Terms and Copyright / DMCA, with centralized typed content and conservative accuracy safeguards.
- **0.5.1:** Production utility, error, loading, empty and unavailable-state foundation with real Search/Browse recovery and resilient global error fallback.
- **0.5.3:** Complete public frontend source hardening: functional global Header Search, landmark/copy cleanup, source-level navigation/accessibility/SEO/performance audits, robots and static sitemap foundations, and deployment-readiness validation.

## Next deployment and runtime sequence

- `SW-FE-04A — CLEAN GITHUB SYNC + VERCEL PRODUCTION DEPLOYMENT + BUILD VERIFICATION`
- `SW-FE-04B — FULL LIVE-SITE / RUNTIME ACCEPTANCE QA + RESPONSIVE / INTERACTION / SEO VERIFICATION + TARGETED REMEDIATION`
