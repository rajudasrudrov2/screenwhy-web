import { PLOTEXPLAINER_API_NAMESPACE } from "@/config/api";
import { parseDataSourceMode } from "@/config/env";
import { API_RESOURCE_PATHS } from "@/data/api/paths";
import { createApiTransport } from "@/data/api/transport";
import { serializeApiQuery } from "@/data/api/query";
import type { ApiTransport } from "@/data/api/transport";
import { BackendContractNotReadyError, DataAccessError } from "@/data/errors";
import { runMockDataValidation } from "@/data/mock/validation";
import { createRepositories } from "@/data/repositories/create-repository";

export interface DataFoundationValidationResult {
  readonly passed: boolean;
  readonly checks: readonly string[];
  readonly failures: readonly string[];
}

function requireCheck(
  condition: boolean,
  label: string,
  checks: string[],
  failures: string[],
): void {
  if (condition) checks.push(label);
  else failures.push(label);
}

async function expectBackendNotReady(action: () => Promise<unknown>): Promise<boolean> {
  try {
    await action();
    return false;
  } catch (error) {
    return error instanceof BackendContractNotReadyError;
  }
}

export async function runDataFoundationValidation(): Promise<DataFoundationValidationResult> {
  const checks: string[] = [];
  const failures: string[] = [];

  const b1 = await runMockDataValidation();
  requireCheck(
    b1.passed,
    "B1 mock behavior remains intact for the current English-only frontend scope",
    checks,
    failures,
  );
  if (b1.passed) {
    checks.push(...b1.checks.map((item) => `B1 invariant: ${item}`));
  } else {
    failures.push(...b1.failures.map((item) => `B1: ${item}`));
  }

  const mock = createRepositories({
    dataSource: "mock",
    runtimeEnvironment: "development",
  });
  const en = await mock.titles.getBySlug({
    locale: "en-US",
    routeFamily: "movies",
    slug: "the-last-signal",
  });
  requireCheck(
    en.status === "available" && en.requestedLocale === "en-US",
    "Mock resolver returns current English repository behavior",
    checks,
    failures,
  );

  let invalidRejected = false;
  try {
    parseDataSourceMode("unexpected-source");
  } catch {
    invalidRejected = true;
  }
  requireCheck(
    invalidRejected,
    "Invalid data-source configuration is rejected",
    checks,
    failures,
  );

  let transportCalls = 0;
  const transportDouble: ApiTransport = {
    async request() {
      transportCalls += 1;
      return { deliberately: "not a content mock" };
    },
  };
  const api = createRepositories({
    dataSource: "api",
    runtimeEnvironment: "development",
    api: { transport: transportDouble },
  });

  requireCheck(
    Object.keys(api).sort().join("|") === Object.keys(mock).sort().join("|"),
    "Mock and API sources expose the same public repository surface",
    checks,
    failures,
  );

  const apiNotReady = await expectBackendNotReady(() =>
    api.titles.getBySlug({
      locale: "en-US",
      routeFamily: "movies",
      slug: "the-last-signal",
    }),
  );
  requireCheck(
    apiNotReady && transportCalls === 0,
    "API mode fails closed before network and never falls back to mock",
    checks,
    failures,
  );

  const serialized = serializeApiQuery({
    locale: "en-US",
    page: 2,
    pageSize: undefined,
    kinds: ["title", "character"],
  });
  requireCheck(
    serialized === "kinds=title&kinds=character&locale=en-US&page=2" &&
      !serialized.includes("undefined"),
    "Central query serialization is deterministic and omits undefined values",
    checks,
    failures,
  );

  requireCheck(
    PLOTEXPLAINER_API_NAMESPACE === "/plotexplainer/v1" &&
      API_RESOURCE_PATHS.titles === "/titles" &&
      API_RESOURCE_PATHS.timeline === "/timeline",
    "API namespace and conceptual resource paths are centralized",
    checks,
    failures,
  );

  let normalizedNetworkError = false;
  const safeTransport = createApiTransport({
    async request() {
      return {
        ok: false,
        status: null,
        code: "network",
        message: "low-level socket detail that must not escape",
      };
    },
  });
  try {
    await safeTransport.request({ path: API_RESOURCE_PATHS.search });
  } catch (error) {
    normalizedNetworkError =
      error instanceof DataAccessError &&
      error.code === "network" &&
      !error.message.includes("socket detail");
  }
  requireCheck(
    normalizedNetworkError,
    "Transport normalizes low-level failures into safe data-access errors",
    checks,
    failures,
  );

  let productionRequiresExplicitSource = false;
  try {
    createRepositories({
      runtimeEnvironment: "production",
      dataSourceExplicitlyConfigured: false,
    });
  } catch (error) {
    productionRequiresExplicitSource =
      error instanceof DataAccessError && error.code === "configuration";
  }
  requireCheck(
    productionRequiresExplicitSource,
    "Production repository access requires explicit data-source selection",
    checks,
    failures,
  );

  return {
    passed: failures.length === 0,
    checks,
    failures,
  };
}
