/** SW-GATE-04B: prevent repeated site title suffix on unindexed reading previews. */
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
const pairs = [
  ["src/app/(en)/movies/[slug]/page.tsx", "Triangle (2009) — Movie Guide and Ending Explained"],
  ["src/app/(en)/triangle-2009-preview/page.tsx", "Triangle (2009) Explained — Reading Preview"],
];
const site = readFileSync("src/config/site.ts", "utf8");
assert.match(site, /titleTemplate: `%s \| \$\{brandConfig\.name\}`/);
for (const [file, title] of pairs) {
  const content = readFileSync(file, "utf8");
  assert.ok(content.includes(`title: "${title}"`), `${file}: plain title needed`);
  assert.ok(!content.includes(`title: "${title} | ScreenWhy"`), `${file}: duplicate brand`);
  assert.match(content, /robots:\s*\{\s*index:\s*false,\s*follow:\s*false/, `${file}: preserve noindex`);
  console.log(`PASS ${file}: single brand suffix at root, noindex preserved`);
}
const homeCard=readFileSync("src/features/homepage/RouteGatewayCard.tsx", "utf8");
assert.ok(homeCard.includes("<h3 className={styles.title}>{gateway.title}</h3>"));
assert.ok(homeCard.includes("<p className={styles.description}>{gateway.description}</p>"));
assert.ok(!homeCard.includes("aria-label={`Browse ${gateway.title} explanations`}"));
console.log("PASS home gateway link: visible title/description retained in accessible name");
