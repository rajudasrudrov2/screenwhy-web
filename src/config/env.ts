export const DATA_SOURCE_MODES = ["mock", "api"] as const;
export type DataSourceMode = (typeof DATA_SOURCE_MODES)[number];

export function isDataSourceMode(value: unknown): value is DataSourceMode {
  return value === "mock" || value === "api";
}

/**
 * The absent-value default is intentionally mock for deterministic local and
 * preview development. Production repository access separately requires the
 * source selection to have been explicitly configured.
 */
export function parseDataSourceMode(value: string | undefined): DataSourceMode {
  if (!value) return "mock";
  if (isDataSourceMode(value)) return value;

  throw new Error(
    `Invalid SCREENWHY_DATA_SOURCE value: ${value}. Expected "mock" or "api".`,
  );
}

function readBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === "") return fallback;
  if (value === "true") return true;
  if (value === "false") return false;

  throw new Error(`Expected boolean environment value, received: ${value}`);
}

function readAbsoluteUrl(
  value: string | undefined,
  fallback?: string,
): string | undefined {
  const candidate = value || fallback;
  if (!candidate) return undefined;

  const parsed = new URL(candidate);
  if (!/^https?:$/.test(parsed.protocol)) {
    throw new Error(`Only http/https URLs are allowed: ${candidate}`);
  }

  return parsed.toString().replace(/\/$/, "");
}

/** Preferred ScreenWhy variables take precedence; former-brand variables are
 * temporary compatibility fallbacks for existing local/deployment configs. */
const configuredDataSource =
  process.env.SCREENWHY_DATA_SOURCE ?? process.env.PLOTEXPLAINER_DATA_SOURCE;

const configuredSiteUrl =
  process.env.SCREENWHY_SITE_URL ?? process.env.PLOTEXPLAINER_SITE_URL;

const configuredCmsApiBaseUrl =
  process.env.SCREENWHY_CMS_API_BASE_URL ??
  process.env.PLOTEXPLAINER_CMS_API_BASE_URL;

const configuredAllowIndexing =
  process.env.SCREENWHY_ALLOW_INDEXING ??
  process.env.PLOTEXPLAINER_ALLOW_INDEXING;

export const env = Object.freeze({
  siteUrl: readAbsoluteUrl(configuredSiteUrl, "http://localhost:3000")!,
  cmsApiBaseUrl: readAbsoluteUrl(configuredCmsApiBaseUrl),
  dataSource: parseDataSourceMode(configuredDataSource),
  dataSourceExplicitlyConfigured: Boolean(configuredDataSource),
  allowIndexing: readBoolean(configuredAllowIndexing, false),
});
