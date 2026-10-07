import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const failures = [];
const passes = [];
const record = (condition, label) => (condition ? passes : failures).push(label);

function walk(relativeDir) {
  const start = path.join(root, relativeDir);
  const output = [];
  if (!fs.existsSync(start)) return output;
  const visit = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const absolute = path.join(dir, entry.name);
      if (entry.isDirectory()) visit(absolute);
      else output.push(absolute);
    }
  };
  visit(start);
  return output;
}

function relative(file) {
  return path.relative(root, file).replaceAll("\\", "/");
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
record(packageJson.name === "screenwhy-web", "Package identity is screenwhy-web");
record(packageJson.version === "0.5.3", "Package version is 0.5.3");

const brandConfig = fs.readFileSync(path.join(root, "src/config/brand.ts"), "utf8");
record(
  [
    'name: "ScreenWhy"',
    'domain: "screenwhy.com"',
    'tagline: "The Why Behind What You Watch."',
    'brandPromise: "Questions After Watching, Answered."',
    'shortSlogan: "Watch. Wonder. Understand."',
    'recommendedHomepageH1: "Questions After Watching? Find the Answers."',
  ].every((needle) => brandConfig.includes(needle)),
  "Owner-locked ScreenWhy brand copy is centralized",
);

const siteConfig = fs.readFileSync(path.join(root, "src/config/site.ts"), "utf8");
record(siteConfig.includes("...brandConfig") && siteConfig.includes("titleTemplate"), "Site configuration exposes centralized ScreenWhy brand data");

const metadata = fs.readFileSync(path.join(root, "src/config/metadata.ts"), "utf8");
record(metadata.includes("applicationName: siteConfig.name") && metadata.includes("siteName: siteConfig.name"), "Metadata foundation uses ScreenWhy site naming");
record(!metadata.includes("/brand/favicon/"), "Former brand favicon is no longer referenced by metadata");

const brandLogo = fs.readFileSync(path.join(root, "src/components/brand/BrandLogo.tsx"), "utf8");
record(brandLogo.includes("brandConfig.name") && !brandLogo.includes("next/image") && !brandLogo.includes("/brand/logo/") && !brandLogo.includes("/brand/mark/"), "Current brand identity is temporary ScreenWhy text, not former assets");

record(!fs.existsSync(path.join(root, "public/brand")), "Former public logo/favicon assets are removed from runtime output");

const publicTextFiles = [
  ...walk("src/app"),
  ...walk("src/components"),
  ...walk("src/data/fixtures"),
  path.join(root, "src/config/site.ts"),
  path.join(root, "src/config/metadata.ts"),
].filter((file) => fs.existsSync(file) && /\.(?:ts|tsx|js|jsx|json|md|css)$/.test(file));

const publicOldBrandHits = [];
const publicOldDomainHits = [];
for (const file of publicTextFiles) {
  const text = read(file);
  if (/Plot\s*Explainer|PlotExplainer/i.test(text)) publicOldBrandHits.push(relative(file));
  if (/https?:\/\/(?:www\.)?plotexplainer\.com/i.test(text)) publicOldDomainHits.push(relative(file));
}
record(publicOldBrandHits.length === 0, `Active public/UI/fixture source has no former brand copy${publicOldBrandHits.length ? `: ${publicOldBrandHits.join(", ")}` : ""}`);
record(publicOldDomainHits.length === 0, `Active public/demo URLs contain no plotexplainer.com${publicOldDomainHits.length ? `: ${publicOldDomainHits.join(", ")}` : ""}`);

const env = fs.readFileSync(path.join(root, "src/config/env.ts"), "utf8");
record(
  env.includes("SCREENWHY_CMS_API_BASE_URL") && env.includes("PLOTEXPLAINER_CMS_API_BASE_URL"),
  "Preferred ScreenWhy env configuration retains documented legacy compatibility fallback",
);

const apiConfig = fs.readFileSync(path.join(root, "src/config/api.ts"), "utf8");
record(
  apiConfig.includes('PLOTEXPLAINER_API_NAMESPACE = "/plotexplainer/v1"'),
  "Legacy internal REST namespace is intentionally preserved",
);

const fixtureFiles = walk("src/data/fixtures").filter((file) => file.endsWith(".ts"));
const fixtureText = fixtureFiles.map(read).join("\n");
record(!fixtureText.includes("plotexplainer.com") && fixtureText.includes("screenwhy.com"), "Mock canonical/localization URLs use screenwhy.com");
record(!fixtureText.includes("PlotExplainer") && fixtureText.includes("ScreenWhy"), "Fixture brand copy uses ScreenWhy");

const routes = fs.readFileSync(path.join(root, "src/config/routes.ts"), "utf8");
record(!routes.includes('"/en/"') && routes.includes('"k-drama"'), "Existing route architecture is preserved without /en/");

const sourceFiles = walk("src").filter((file) => /\.(?:ts|tsx)$/.test(file));
let accidentalEn = false;
for (const file of sourceFiles) {
  if (/["'`]\/en\//.test(read(file))) accidentalEn = true;
}
record(!accidentalEn, "No accidental /en/ route prefix exists in source");

const allowedLegacyLocations = new Map([
  ["src/config/api.ts", ["PLOTEXPLAINER_API_NAMESPACE", "/plotexplainer/v1"]],
  ["src/config/env.ts", ["PLOTEXPLAINER_SITE_URL", "PLOTEXPLAINER_CMS_API_BASE_URL", "PLOTEXPLAINER_DATA_SOURCE", "PLOTEXPLAINER_ALLOW_INDEXING"]],
  ["src/services/api/client.ts", ["PLOTEXPLAINER_API_NAMESPACE"]],
  ["src/data/validation/foundation.ts", ["PLOTEXPLAINER_API_NAMESPACE", "/plotexplainer/v1"]],
]);

const legacyPatterns = /PlotExplainer|plotexplainer|PLOTEXPLAINER_/;
const unexpectedLegacy = [];
for (const file of sourceFiles) {
  const rel = relative(file);
  const text = read(file);
  if (!legacyPatterns.test(text)) continue;
  const allowed = allowedLegacyLocations.get(rel);
  if (!allowed || allowed.some((needle) => !text.includes(needle))) unexpectedLegacy.push(rel);
}
record(unexpectedLegacy.length === 0, `Former-brand technical references are confined to the explicit allowlist${unexpectedLegacy.length ? `: ${unexpectedLegacy.join(", ")}` : ""}`);

for (const label of passes) console.log(`PASS: ${label}`);
for (const label of failures) console.error(`FAIL: ${label}`);
console.log(`\n${passes.length}/${passes.length + failures.length} ScreenWhy brand-migration guardrails passed.`);
if (failures.length) process.exitCode = 1;
