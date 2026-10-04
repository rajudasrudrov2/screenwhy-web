declare const process: { exitCode?: number };

import { runMockDataValidation } from "../src/data/mock/validation";

async function main(): Promise<void> {
  const result = await runMockDataValidation();
  for (const check of result.checks) console.log(`PASS: ${check}`);
  for (const failure of result.failures) console.error(`FAIL: ${failure}`);
  if (!result.passed) process.exitCode = 1;
}

void main();
