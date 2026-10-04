# PlotExplainer Web 0.3.1

PE-FE-02A continues **only** from the authoritative completed PE-FE-01C `0.3.0` source (the package produced from the authoritative `0.2.2` lineage).

## Foundation state

The completed PE-FE-01C data architecture remains unchanged:

```ts
import { getRepositories } from "@/data";

const repositories = getRepositories();
```

Application code receives the same typed repository interfaces from `mock` or `api`; API mode still fails closed with `BackendContractNotReadyError` until the backend transport contract is authoritative.

## PE-FE-02A domain UI

Reusable production presentation components now live under:

```text
src/components/domain/
```

Implemented in this release:

- Canon context — compact, inline and expanded presentations;
- Spoiler context — compact marker, article/scoped warning, source-material warning and native disclosure;
- Editorial metadata — compact, article and stacked variants with distinct published/modified/reviewed semantics;
- Quick Answer — answer-first editorial presentation composed with Canon/Spoiler context.

These components consume the existing PE-FE-01C domain contracts. They do not fetch repositories themselves.

## Development-only domain preview

Run the development server and open:

```text
http://localhost:3000/__ui/domain/
```

The route is `noindex` and returns `404` in production. It uses the public repository boundary with explicit `mock` selection rather than importing raw fixture arrays.

The preview demonstrates English and Bangla examples, long-label stress cases, Canon comparisons, separate screen/source-material spoilers, distinct editorial dates and several Quick Answer contexts.

## Validation

After dependencies are installed:

```bash
npm run validate:data-foundation
npm run typecheck
npm run lint
npm run build
```

In the PE-FE-02A implementation environment, npm registry DNS remained unavailable (`EAI_AGAIN registry.npmjs.org`), so whole-project runtime/build verification could not be completed there. See the implementation report for the separate source-level QA results.

## Guardrails retained

- English remains the root locale; no `/en/` route is introduced.
- Bangla remains under `/bn/` and never receives silent English editorial fallback.
- Raw fixture arrays remain behind mock repositories.
- No backend endpoint/DTO contract is invented.
- Header, footer, global visual foundation and production brand assets are unchanged.
- No Title/Explanation/Character cards, Citation/TOC, Relationship/Timeline UI, or public pages are implemented in PE-FE-02A.

## Next task

`PE-FE-02B — CORE DOMAIN CARDS`
