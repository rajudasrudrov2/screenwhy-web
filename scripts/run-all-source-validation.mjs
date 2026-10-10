/**
 * ScreenWhy CI: execute every source-validation script on the current repository.
 * This complements typecheck/lint/full Next.js build, not a substitute.
 */
import { readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const scripts = readdirSync(join(root, "scripts"))
  .filter((file) => /^validate-.*\.mjs$/.test(file))
  .sort();

let failures = 0;
for (const name of scripts) {
  const result = spawnSync(process.execPath, [join(root, "scripts", name)], {
    cwd: root, encoding: "utf8", maxBuffer: 8 * 1024 * 1024,
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  const code = result.status ?? 1;
  console.log(`[${code === 0 ? "PASS" : "FAIL"}] ${name}`);
  if (code !== 0) failures += 1;
}
console.log(`ScreenWhy source guards: ${scripts.length - failures}/${scripts.length} passed.`);
if (failures) process.exitCode = 1;
