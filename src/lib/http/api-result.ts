export interface ApiSuccess<T> {
  ok: true;
  status: number;
  data: T;
}

export interface ApiFailure {
  ok: false;
  status: number | null;
  code: "timeout" | "network" | "http" | "invalid-json" | "configuration";
  message: string;
}

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;
