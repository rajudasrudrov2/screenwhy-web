import { PLOTEXPLAINER_API_NAMESPACE } from "@/config/api";
import { env } from "@/config/env";
import type { ApiFailure, ApiResult } from "@/lib/http/api-result";

const DEFAULT_TIMEOUT_MS = 10_000;

function configurationFailure(message: string): ApiFailure {
  return {
    ok: false,
    status: null,
    code: "configuration",
    message,
  };
}

function normalizePath(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    throw new Error("API client accepts namespace-relative paths only.");
  }

  return path.startsWith("/") ? path : `/${path}`;
}

export interface ApiRequestOptions extends Omit<RequestInit, "signal"> {
  signal?: AbortSignal;
  timeoutMs?: number;
}

export interface ApiClient {
  request<T>(path: string, options?: ApiRequestOptions): Promise<ApiResult<T>>;
}

export function createApiClient(): ApiClient {
  return {
    async request<T>(path: string, options: ApiRequestOptions = {}): Promise<ApiResult<T>> {
      if (!env.cmsApiBaseUrl) {
        return configurationFailure(
          "ScreenWhy CMS API base URL is required when API requests are enabled.",
        );
      }

      const controller = new AbortController();
      const { timeoutMs = DEFAULT_TIMEOUT_MS, signal, ...requestInit } = options;
      const timeout = setTimeout(() => controller.abort("timeout"), timeoutMs);
      const onAbort = () => controller.abort(signal?.reason);

      signal?.addEventListener("abort", onAbort, { once: true });

      try {
        const response = await fetch(
          `${env.cmsApiBaseUrl}${PLOTEXPLAINER_API_NAMESPACE}${normalizePath(path)}`,
          {
            ...requestInit,
            signal: controller.signal,
            headers: {
              Accept: "application/json",
              ...requestInit.headers,
            },
          },
        );

        if (!response.ok) {
          return {
            ok: false,
            status: response.status,
            code: "http",
            message: `API request failed with HTTP ${response.status}.`,
          };
        }

        try {
          return {
            ok: true,
            status: response.status,
            data: (await response.json()) as T,
          };
        } catch {
          return {
            ok: false,
            status: response.status,
            code: "invalid-json",
            message: "API returned a non-JSON response.",
          };
        }
      } catch (error) {
        if (controller.signal.aborted) {
          return {
            ok: false,
            status: null,
            code: "timeout",
            message: "API request timed out or was aborted.",
          };
        }

        return {
          ok: false,
          status: null,
          code: "network",
          message:
            error instanceof Error ? error.message : "Unknown network error.",
        };
      } finally {
        clearTimeout(timeout);
        signal?.removeEventListener("abort", onAbort);
      }
    },
  };
}
