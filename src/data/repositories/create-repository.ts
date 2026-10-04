import { createApiRepositories, type CreateApiRepositoriesOptions } from "@/data/api";
import { DataAccessError } from "@/data/errors";
import { createMockRepositories } from "@/data/mock/create-mock-repositories";
import type { PublicReadRepositories } from "@/data/repositories/contracts";
import {
  env,
  isDataSourceMode,
  type DataSourceMode,
} from "@/config/env";

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

  if (!isDataSourceMode(selected)) {
    throw new DataAccessError(
      "configuration",
      'Invalid ScreenWhy data source. Expected "mock" or "api".',
    );
  }

  const runtimeEnvironment = options.runtimeEnvironment ?? process.env.NODE_ENV;
  const explicitlyConfigured =
    options.dataSource !== undefined
      ? true
      : (options.dataSourceExplicitlyConfigured ??
        env.dataSourceExplicitlyConfigured);

  if (runtimeEnvironment === "production" && !explicitlyConfigured) {
    throw new DataAccessError(
      "configuration",
      "SCREENWHY_DATA_SOURCE must be explicitly configured in production.",
    );
  }

  return selected;
}

/**
 * The one authoritative mock/API repository selection boundary.
 * Application code receives the same PublicReadRepositories interface from
 * either source and never branches on the source itself.
 */
export function createRepositories(
  options: CreateRepositoriesOptions = {},
): PublicReadRepositories {
  const mode = resolveDataSource(options);

  if (mode === "mock") return createMockRepositories();
  return createApiRepositories(options.api);
}

let applicationRepositories: PublicReadRepositories | undefined;

/** Stable application-facing repository accessor for future server components/pages. */
export function getRepositories(): PublicReadRepositories {
  applicationRepositories ??= createRepositories();
  return applicationRepositories;
}
