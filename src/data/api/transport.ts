import type { ApiRequestOptions, ApiClient } from "@/services/api/client";
import { createApiClient } from "@/services/api/client";
import { dataAccessErrorFromApiFailure } from "@/data/errors";
import { appendApiQuery, type ApiQueryValues } from "@/data/api/query";

export interface ApiTransportRequest {
  readonly path: string;
  readonly query?: ApiQueryValues;
  readonly options?: ApiRequestOptions;
}

/** Raw transport data deliberately remains unknown until an authoritative mapper decodes it. */
export interface ApiTransport {
  request(request: ApiTransportRequest): Promise<unknown>;
}

/**
 * Reusable transport wrapper around the PE-FE-01A generic API client.
 * It centralizes query serialization and normalizes low-level failures into
 * the frontend data-access error model.
 */
export function createApiTransport(client: ApiClient = createApiClient()): ApiTransport {
  return {
    async request(request: ApiTransportRequest): Promise<unknown> {
      const result = await client.request<unknown>(
        appendApiQuery(request.path, request.query),
        request.options,
      );

      if (!result.ok) throw dataAccessErrorFromApiFailure(result);
      return result.data;
    },
  };
}
