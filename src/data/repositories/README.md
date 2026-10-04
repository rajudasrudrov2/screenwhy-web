# Frontend repository boundary

PE-FE-01C now exposes one application-facing repository contract surface. Future pages/components should import through `@/data` (or repository types from `@/data/repositories`) rather than fixture arrays, raw transport payloads, or direct `fetch()` calls.

`createRepositories()` / `getRepositories()` is the authoritative source-selection boundary:

- `mock` resolves the deterministic PE-FE-01C-B1 repositories;
- `api` resolves API repository implementations with the identical `PublicReadRepositories` interface.

The backend aggregate REST response schema is not yet authoritative. API repositories therefore use an explicit transport-to-domain mapper boundary whose default gate throws `BackendContractNotReadyError` before any request is sent. API mode never silently falls back to mock content.

Viewer Question submission remains a public repository contract only. No persistence, fake moderation workflow, or real mutation endpoint is implemented in PE-FE-01C.
