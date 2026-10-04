import type { ApiFailure } from "@/lib/http/api-result";

export const DATA_ACCESS_ERROR_CODES = [
  "configuration",
  "network",
  "timeout",
  "http",
  "malformed_payload",
  "backend_contract_not_ready",
] as const;

export type DataAccessErrorCode = (typeof DATA_ACCESS_ERROR_CODES)[number];

export interface DataAccessErrorOptions {
  readonly status?: number | null;
  readonly operation?: string;
  readonly resource?: string;
}

/**
 * Small application-facing data error. Messages intentionally avoid leaking
 * request URLs, server response bodies, credentials, or stack details.
 */
export class DataAccessError extends Error {
  readonly code: DataAccessErrorCode;
  readonly status: number | null;
  readonly operation?: string;
  readonly resource?: string;

  constructor(
    code: DataAccessErrorCode,
    message: string,
    options: DataAccessErrorOptions = {},
  ) {
    super(message);
    this.name = "DataAccessError";
    this.code = code;
    this.status = options.status ?? null;
    this.operation = options.operation;
    this.resource = options.resource;
  }
}

export class BackendContractNotReadyError extends DataAccessError {
  constructor(operation: string, resource?: string) {
    super(
      "backend_contract_not_ready",
      "The ScreenWhy backend contract for this data operation is not ready yet.",
      { operation, resource },
    );
    this.name = "BackendContractNotReadyError";
  }
}

export function dataAccessErrorFromApiFailure(failure: ApiFailure): DataAccessError {
  switch (failure.code) {
    case "configuration":
      return new DataAccessError(
        "configuration",
        "The ScreenWhy API is not configured for this environment.",
        { status: failure.status },
      );
    case "timeout":
      return new DataAccessError(
        "timeout",
        "The ScreenWhy API request timed out.",
        { status: failure.status },
      );
    case "network":
      return new DataAccessError(
        "network",
        "The ScreenWhy API could not be reached.",
        { status: failure.status },
      );
    case "http":
      return new DataAccessError(
        "http",
        "The ScreenWhy API returned an unsuccessful response.",
        { status: failure.status },
      );
    case "invalid-json":
      return new DataAccessError(
        "malformed_payload",
        "The ScreenWhy API returned an unsupported response payload.",
        { status: failure.status },
      );
  }
}

export function isDataAccessError(value: unknown): value is DataAccessError {
  return value instanceof DataAccessError;
}
