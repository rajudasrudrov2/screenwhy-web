import { createApiRepositories, type CreateApiRepositoriesOptions } from "@/data/api";
import { DataAccessError } from "@/data/errors";
import { createMockRepositories } from "@/data/mock/create-mock-repositories";
import type { PublicReadRepositories } from "@/data/repositories/contracts";
import { env, isDataSourceMode, type DataSourceMode } from "@/config/env";

export interface CreateRepositoriesOptions {
  readonly dataSource?: DataSourceMode;
  readonly api?: CreateApiRepositoriesOptions;
  /** Test/SSR override only; application code normally uses process.env.NODE_ENV. */
  readonly runtimeEnvironment?: string;
  /** Test override for the production explicit-selection guard. */
  readonly dataSourceExplicitlyConfigured?: boolean;
}
function resolveDataSource(options: CreateRepositoriesOptions): DataSourceMode {
  const selected = options.dataSource ?? env.dataSource;
  if (!isDataSourceMode(selected)) throw new DataAccessError("configuration", 'Invalid ScreenWhy data source. Expected "mock" or "api".');
  const runtimeEnvironment = options.runtimeEnvironment ?? process.env.NODE_ENV;
  const explicitlyConfigured = options.dataSource !== undefined ? true : (options.dataSourceExplicitlyConfigured ?? env.dataSourceExplicitlyConfigured);
  if (runtimeEnvironment === "production" && !explicitlyConfigured) {
    throw new DataAccessError("configuration", "SCREENWHY_DATA_SOURCE must be explicitly configured in production.");
  }
  if (runtimeEnvironment === "production" && selected !== "api") {
    throw new DataAccessError("configuration", "ScreenWhy production never serves demo/mock data. Set SCREENWHY_DATA_SOURCE=api.");
  }
  return selected;
}
/** The authoritative mock/API boundary: production is fail-closed on CMS API failures. */
export function createRepositories(options: CreateRepositoriesOptions = {}): PublicReadRepositories {
  const mode = resolveDataSource(options);
  if (mode === "mock") return createMockRepositories();
  return createApiRepositories(options.api);
}
let applicationRepositories: PublicReadRepositories | undefined;
export function getRepositories(): PublicReadRepositories {
  applicationRepositories ??= createRepositories();
  return applicationRepositories;
}
