import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const failures = [];
const passes = [];

async function filesUnder(relativeDir) {
  const absoluteDir = path.join(root, relativeDir);
  const result = [];

  async function walk(dir) {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(full);
      else result.push(full);
    }
  }

  await walk(absoluteDir);
  return result;
}

function record(condition, label) {
  if (condition) passes.push(label);
  else failures.push(label);
}

const applicationFiles = [
  ...(await filesUnder("src/app")),
  ...(await filesUnder("src/components")),
  ...(await filesUnder("src/features")),
].filter((file) => /\.(?:ts|tsx|js|jsx)$/.test(file));

let rawFixtureImport = false;
for (const file of applicationFiles) {
  const text = await readFile(file, "utf8");
  if (/from\s+["']@\/data\/(?:fixtures|mock)(?:\/|["'])/.test(text)) {
    rawFixtureImport = true;
  }
}
record(!rawFixtureImport, "UI/pages do not import fixture or mock internals directly");

const sourceFiles = (await filesUnder("src")).filter((file) => /\.(?:ts|tsx)$/.test(file));
let strayFetch = false;
let accidentalEnRoute = false;
for (const file of sourceFiles) {
  const relative = path.relative(root, file).replaceAll("\\", "/");
  const text = await readFile(file, "utf8");
  if (/\bfetch\s*\(/.test(text) && relative !== "src/services/api/client.ts") {
    strayFetch = true;
  }
  if (/(["'`])\/en\//.test(text)) accidentalEnRoute = true;
}
record(!strayFetch, "Raw fetch() remains isolated to the generic API client boundary");
record(!accidentalEnRoute, "No accidental /en/ public-route prefix was introduced");

const repositoryFiles = [
  ...(await filesUnder("src/data/api")),
  ...(await filesUnder("src/data/repositories")),
].filter((file) => /\.ts$/.test(file));
let hardcodedCmsHost = false;
let anyEscapeHatch = false;
for (const file of repositoryFiles) {
  const text = await readFile(file, "utf8");
  if (/cms\.(?:plotexplainer|screenwhy)\.com/i.test(text)) hardcodedCmsHost = true;
  if (/\bas\s+any\b|:\s*any\b|<any>/.test(text)) anyEscapeHatch = true;
}
record(!hardcodedCmsHost, "Repository/API modules contain no hardcoded CMS hostname");
record(!anyEscapeHatch, "New repository/API modules contain no any escape hatch");

const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
record(packageJson.version === "0.5.3", "Package version is 0.5.3");

const forbiddenComponentNames = [
  "Timeline",
  "Relationship",
];
const componentFiles = await filesUnder("src/components");
record(
  !componentFiles.some((file) =>
    forbiddenComponentNames.some((name) => path.basename(file).startsWith(name)),
  ),
  "No competing shared Relationship/Timeline component family is introduced",
);

const expected02AComponents = [
  "src/components/domain/canon/CanonContext.tsx",
  "src/components/domain/spoiler/SpoilerContext.tsx",
  "src/components/domain/editorial/EditorialMetadata.tsx",
  "src/components/domain/quick-answer/QuickAnswer.tsx",
];
record(
  expected02AComponents.every((file) => componentFiles.includes(path.join(root, file))),
  "PE-FE-02A domain components are present",
);

for (const label of passes) console.log(`PASS: ${label}`);
for (const label of failures) console.error(`FAIL: ${label}`);
if (failures.length > 0) process.exitCode = 1;
