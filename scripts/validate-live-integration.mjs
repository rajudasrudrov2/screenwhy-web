/* Isolated source/handler contract checks. Does not claim real Next.js/Vercel or CMS acceptance. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import { createHmac } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
const ts = require("typescript");
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const get = (p) => readFileSync(path.join(repoRoot, p), "utf8");
const files = [
  "src/lib/live-explanations.ts",
  "src/features/live-explanation/LiveExplanationViews.tsx",
  "src/app/api/screenwhy/revalidate/route.ts",
  "src/app/(en)/explain/[slug]/page.tsx",
  "src/app/(en)/explanations/page.tsx",
  "src/app/(en)/search/page.tsx",
  "src/app/(en)/page.tsx",
  "src/app/sitemap.ts",
  "src/data/repositories/create-repository.ts",
];
for (const name of files) {
  const source = ts.createSourceFile(name, get(name), ts.ScriptTarget.Latest, true, name.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  assert.equal(source.parseDiagnostics.length, 0, `Syntax: ${name}`);
}
assert.match(get("src/data/repositories/create-repository.ts"), /production.*mock data/);
assert.match(get("src/lib/live-explanations.ts"), /cache:\s*"no-store"/);
assert.match(get("src/app/(en)/explain/[slug]/page.tsx"), /force-dynamic/);
assert.doesNotMatch(get("src/features/live-explanation/LiveExplanationViews.tsx"), /dangerouslySetInnerHTML/);

const source = get("src/app/api/screenwhy/revalidate/route.ts");
const transpiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const paths = [];
const fakeNext = { NextResponse: { json: (body, options = {}) => ({ body, status: options.status ?? 200 }) } };
const context = {
  exports: {},
  require: (name) => {
    if (name === "node:crypto") return require("node:crypto");
    if (name === "next/cache") return { revalidatePath: (p) => paths.push(p) };
    if (name === "next/server") return fakeNext;
    throw Error(`Unexpected import: ${name}`);
  },
  process: { env: { SCREENWHY_REVALIDATION_SECRET: "integration-fixture-secret-32bytes-minimum" } },
  Buffer,
  Date,
  Map,
  Set,
  Number,
  JSON,
  console,
};
vm.runInNewContext(transpiled, context, { filename: "revalidate/route.ts" });
const handler = context.exports.POST;
assert.equal(typeof handler, "function");
const payload = JSON.stringify({ eventId: "11111111-2222-4333-8444-555555555555", event: "update", postId: 123, slug: "new-slug", oldSlug: "old-slug" });
const stamp = String(Math.floor(Date.now()/1000));
const signature = `sha256=${createHmac("sha256", context.process.env.SCREENWHY_REVALIDATION_SECRET).update(`${stamp}.${payload}`).digest("hex")}`;
const request = (sig, time=stamp) => ({
  headers: { get: (key) => ({ "content-length": String(Buffer.byteLength(payload)), "x-screenwhy-timestamp": time, "x-screenwhy-signature": sig }[key] ?? null) },
  text: async () => payload,
});
assert.equal((await handler(request("sha256=" + "0".repeat(64)))).status, 401, "Forged signature denied");
assert.equal((await handler(request(signature, "1000000000"))).status, 401, "Expired event denied");
assert.equal((await handler(request(signature))).status, 200, "Authenticated event accepted");
assert.ok(paths.includes("/explain/new-slug/") && paths.includes("/explain/old-slug/") && paths.includes("/sitemap.xml"), "Necessary paths revalidated");
const before = paths.length;
assert.equal((await handler(request(signature))).body.duplicate, true, "Immediate replay deduplicated");
assert.equal(paths.length, before, "Replay caused no second invalidation in same process");
console.log(`SW-LIVE-02 source syntax ${files.length}/9 PASS; signed webhook cases PASS (isolated, process-local).`);
