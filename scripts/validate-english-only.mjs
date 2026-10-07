import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const scanRoots = ["src", "scripts"];
const banned = [
  ["removed locale code", ["bn", "BD"].join("-")],
  ["removed public route prefix", "/" + ["b", "n"].join("") + "/"],
  ["removed language name", ["Bang", "la"].join("")],
  ["removed language adjective", ["Beng", "ali"].join("")],
  ["removed native language label", "\u09ac\u09be\u0982\u09b2\u09be"],
  ["removed font family", ["Hind", "Siliguri"].join(" ")],
  ["removed locale switch prop", ["alternate", "Locale", "Href"].join("")],
];
const forbiddenPathParts = ["(" + ["b", "n"].join("") + ")"];
const forbiddenSymbols = [
  ["MOCK", "BN"].join("_"),
  ["Search", "Localization", "Unavailable"].join(""),
  ["font", "bangla"].join("-"),
];

async function walk(rel) {
  const absolute = path.join(root, rel);
  const entries = await readdir(absolute);
  const out = [];
  for (const entry of entries) {
    const child = path.join(rel, entry);
    const info = await stat(path.join(root, child));
    if (info.isDirectory()) out.push(...await walk(child));
    else if (/\.(?:ts|tsx|js|mjs|css)$/.test(entry)) out.push(child);
  }
  return out;
}

const files = (await Promise.all(scanRoots.map(walk))).flat();
const failures = [];
for (const rel of files) {
  for (const part of forbiddenPathParts) {
    if (rel.includes(part)) failures.push(`${rel}: forbidden route group`);
  }
  const source = await readFile(path.join(root, rel), "utf8");
  for (const [label, value] of banned) {
    if (source.includes(value)) failures.push(`${rel}: ${label}`);
  }
  for (const symbol of forbiddenSymbols) {
    if (source.includes(symbol)) failures.push(`${rel}: removed symbol ${symbol}`);
  }
}

if (failures.length) {
  console.error("English-only guardrail failed:\n" + failures.map((x) => `- ${x}`).join("\n"));
  process.exit(1);
}
console.log(`PASS — English-only guardrail scanned ${files.length} active source/validation files with zero removed-language runtime references.`);
