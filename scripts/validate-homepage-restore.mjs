/** SW-FE-RESTORE-01 isolated source-contract checks (not browser acceptance). */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const ts = require("typescript");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const get = (name) => readFileSync(path.join(root, name), "utf8");
const files = [
  "src/app/(en)/page.tsx",
  "src/features/homepage/index.ts",
  "src/features/homepage/HomepageEntry.tsx",
  "src/features/homepage/LiveHomepage.tsx",
  "src/features/homepage/LiveHomepageCard.tsx",
];
for (const name of files) {
  const source = ts.createSourceFile(name, get(name), ts.ScriptTarget.Latest, true,
    name.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  assert.equal(source.parseDiagnostics.length, 0, `Invalid TS/TSX: ${name}`);
}
const home = get("src/app/(en)/page.tsx");
const layout = get("src/features/homepage/LiveHomepage.tsx");
const entry = get("src/features/homepage/HomepageEntry.tsx");
const card = get("src/features/homepage/LiveHomepageCard.tsx");
assert.match(home, /<Homepage live=\{published\}/);
assert.match(home, /getLiveExplanations\(\{ perPage: 50 \}\)/);
assert.match(home, /await connection\(\)/);
assert.doesNotMatch(home, /LiveExplanationListing|createMockRepositories/);
assert.match(entry, /<OriginalHomepage model=\{props\.model\}/);
assert.match(layout, /\.\/Homepage\.module\.css/);
assert.match(card, /ExplanationCard\.module\.css/);
for (const name of ["hero", "heroEyebrow", "searchForm", "primaryGrid", "latestGrid", "discoveryGrid", "gatewayGrid", "updatedGrid", "trust"]) {
  assert.match(layout, new RegExp(`styles\\.${name}\\b`), `Missing original premium section ${name}`);
}
assert.match(layout, /item\.id === 37/);
assert.match(layout, /Published movie explanation/);
assert.doesNotMatch(layout, /CMS fact-check and source review are in progress|Reading preview · Full spoilers/);
assert.match(layout, /Viewer Questions intentionally omitted until/);
assert.match(layout, /Date\.parse\(a\.modifiedAt\)/);
assert.match(card, /entry\.publicPath/);
assert.doesNotMatch(layout + card, /mock\/|fixtures\/|primaryTitle\.displayTitle|editorialStage|spoiler\.screen/);
console.log(`SW-FE-RESTORE-01: 5 TS/TSX parses PASS; premium layout + live-data contract assertions PASS (isolated).`);
