import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const outputRoot = path.join(root, ".data-validation");
const sourceRoot = path.join(outputRoot, "src");
const aliasRoot = path.join(outputRoot, "node_modules", "@");
const entry = path.join(outputRoot, "scripts", "validate-data-foundation.js");

async function prepareAliasTree() {
  await mkdir(aliasRoot, { recursive: true });
  for (const name of await readdir(sourceRoot)) {
    await cp(path.join(sourceRoot, name), path.join(aliasRoot, name), {
      recursive: true,
    });
  }
}

await prepareAliasTree();

const child = spawn(process.execPath, [entry], {
  cwd: root,
  stdio: "inherit",
});

const exitCode = await new Promise((resolve, reject) => {
  child.once("error", reject);
  child.once("exit", (code) => resolve(code ?? 1));
});

await rm(outputRoot, { recursive: true, force: true });
process.exitCode = exitCode;
