declare const process: { exitCode?: number };

import { runDataFoundationValidation } from "../src/data/validation/foundation";

async function main(): Promise<void> {
  const result = await runDataFoundationValidation();
  for (const check of result.checks) console.log(`PASS: ${check}`);
  for (const failure of result.failures) console.error(`FAIL: ${failure}`);
  if (!result.passed) process.exitCode = 1;
}

void main();
