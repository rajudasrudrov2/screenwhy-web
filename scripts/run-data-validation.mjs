import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const outputRoot = path.join(root, ".data-validation");
const sourceRoot = path.join(outputRoot, "src");
const aliasRoot = path.join(outputRoot, "node_modules", "@");

async function prepareAliasTree() {
  await mkdir(aliasRoot, { recursive: true });
  for (const name of await readdir(sourceRoot)) {
    await cp(path.join(sourceRoot, name), path.join(aliasRoot, name), { recursive: true });
  }
}

async function run(entry) {
  const child = spawn(process.execPath, [path.join(outputRoot, "scripts", entry)], {
    cwd: root,
    stdio: "inherit",
  });
  return await new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("exit", (code) => resolve(code ?? 1));
  });
}

await prepareAliasTree();
let exitCode = await run("validate-data-foundation.js");
if (exitCode === 0) exitCode = await run("validate-homepage-data.js");
if (exitCode === 0) exitCode = await run("validate-title-hub-data.js");
if (exitCode === 0) exitCode = await run("validate-character-detail-data.js");
if (exitCode === 0) exitCode = await run("validate-search-data.js");
await rm(outputRoot, { recursive: true, force: true });
process.exitCode = exitCode;
