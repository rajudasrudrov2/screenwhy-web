# PlotExplainer Web 0.3.2

PE-FE-02B continues **only** from the authoritative completed PE-FE-02A `0.3.1` source.

## Foundation state

The completed PE-FE-01C data architecture remains unchanged:

```ts
import { getRepositories } from "@/data";

const repositories = getRepositories();
```

Application code receives the same typed repository interfaces from `mock` or `api`; API mode still fails closed with `BackendContractNotReadyError` until the backend transport contract is authoritative.

PE-FE-02A Canon, Spoiler, Editorial Metadata and Quick Answer components are preserved unchanged.

## PE-FE-02B discovery cards

Reusable production presentation cards now live under:

```text
src/components/domain/cards/
```

Implemented in this release:

- `TitleCard` — standard + compact; poster ratio, release/route/type context, explanation signal, graceful missing media;
- `ExplanationCard` — standard + compact; Explanation Type, headline-first hierarchy, Primary Title, PE-FE-02A Spoiler/Canon composition;
- `CharacterCard` — standard + compact; Character-first identity, Title context, spoiler-safe description, portrait/missing-media handling.

Cards consume existing PE-FE-01C Summary contracts, use centralized route helpers, and never fetch repositories, read environment variables, or import fixture internals.

## Development-only card preview

Run the development server and open:

```text
http://localhost:3000/__ui/cards/
```

The route is `noindex` and returns `404` in production. It obtains fixture-backed examples through the public repository boundary with explicit `mock` selection.

The preview demonstrates standard/compact variants, Anime route-family versus fundamental Title Type, missing media, long English content, Bangla content, spoiler-free/major-spoiler explanations, Canon-scoped explanation context and spoiler-safe Character cards.

The existing PE-FE-02A preview remains at:

```text
http://localhost:3000/__ui/domain/
```

## Validation

After dependencies are installed:

```bash
npm run validate:data-foundation
npm run validate:domain-ui-source
npm run validate:card-ui-source
npm run typecheck
npm run lint
npm run build
```

In the PE-FE-02B implementation environment, npm registry DNS remained unavailable (`EAI_AGAIN registry.npmjs.org`), so whole-project runtime/build verification could not be completed there. See the implementation report for source-level QA results.

## Guardrails retained

- English remains the root locale; no `/en/` route is introduced.
- Bangla remains under `/bn/` and never receives silent English editorial fallback.
- Raw fixture arrays remain behind mock repositories.
- No backend endpoint/DTO contract is invented.
- PE-FE-01C data/domain foundation is unchanged.
- PE-FE-02A Canon/Spoiler/Metadata/Quick Answer components are unchanged.
- Header, footer, global tokens/CSS and production brand assets are unchanged.
- No Citation/TOC, Relationship/Timeline UI, or public pages are implemented in PE-FE-02B.

## Next task

`PE-FE-02C — Citation / Source / TOC / Article Primitives`
