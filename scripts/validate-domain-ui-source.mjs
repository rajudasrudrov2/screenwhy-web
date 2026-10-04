import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const checks = [];

function record(ok, label) {
  checks.push({ ok: Boolean(ok), label });
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function walk(relativePath, predicate = () => true) {
  const start = path.join(root, relativePath);
  const output = [];
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(absolute);
      else if (predicate(absolute)) output.push(absolute);
    }
  };
  visit(start);
  return output;
}

const packageJson = JSON.parse(read("package.json"));
record(packageJson.version === "0.3.3", "Package version is 0.3.3");

const required = [
  "src/components/domain/canon/CanonContext.tsx",
  "src/components/domain/spoiler/SpoilerContext.tsx",
  "src/components/domain/editorial/EditorialMetadata.tsx",
  "src/components/domain/quick-answer/QuickAnswer.tsx",
  "src/components/domain/index.ts",
  "src/app/(en)/__ui/domain/page.tsx",
];
record(required.every((file) => fs.existsSync(path.join(root, file))), "Required PE-FE-02A component/preview files exist");

const componentFiles = walk("src/components/domain", (file) => /\.(ts|tsx)$/.test(file));
const componentSource = componentFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n");
record(!componentSource.includes('"use client"') && !componentSource.includes("'use client'"), "Domain presentation components remain server-compatible by default");
record(!/\bfetch\s*\(/.test(componentSource), "Domain components contain no data fetch calls");
record(!/@\/data\/(fixtures|mock)/.test(componentSource), "Domain components do not import fixture/mock internals");
record(!/\bas any\b|:\s*any\b|<any>|Array<any>|Promise<any>/.test(componentSource), "Domain components add no any escape hatch");

const cssFiles = walk("src/components/domain", (file) => file.endsWith(".css"));
const cssSource = cssFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n");
record(!/#[0-9a-fA-F]{3,8}\b/.test(cssSource), "Domain CSS uses centralized tokens instead of hardcoded hex colors");

const preview = read("src/app/(en)/__ui/domain/page.tsx");
record(!/@\/data\/(fixtures|mock)/.test(preview), "Dev preview does not import raw fixture/mock internals");
record(preview.includes('dataSource: "mock"') && preview.includes("createRepositories"), "Dev preview uses the public repository boundary with explicit mock selection");
record(preview.includes("robots: { index: false") && preview.includes('process.env.NODE_ENV === "production"') && preview.includes("notFound()"), "Dev preview is noindex and production-gated");
record(!/['"`]\/en\//.test(componentSource + preview), "PE-FE-02A introduces no /en/ route prefix");

const forbiddenNames = [
  "CitationList",
  "TableOfContents",
  "RelationshipCard",
  "TimelineCard",
];
record(forbiddenNames.every((name) => !componentSource.includes(`function ${name}`) && !componentSource.includes(`const ${name}`)), "Deferred PE-FE-02C/later component families remain unimplemented");

const failed = checks.filter((check) => !check.ok);
for (const check of checks) {
  console.log(`${check.ok ? "PASS" : "FAIL"} — ${check.label}`);
}
console.log(`\n${checks.length - failed.length}/${checks.length} source guardrails passed.`);
if (failed.length > 0) process.exitCode = 1;
