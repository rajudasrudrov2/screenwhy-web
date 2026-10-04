export type ApiQueryScalar = string | number | boolean;
export type ApiQueryValue =
  | ApiQueryScalar
  | readonly ApiQueryScalar[]
  | null
  | undefined;

export type ApiQueryValues = Readonly<Record<string, ApiQueryValue>>;

/**
 * Deterministic query serialization used only at the transport boundary.
 * Undefined/null values are omitted and arrays become repeated keys.
 *
 * Repository adapters remain responsible for mapping frontend query fields to
 * final backend wire keys once the backend request contract is authoritative.
 */
export function serializeApiQuery(values: ApiQueryValues = {}): string {
  const params = new URLSearchParams();

  for (const key of Object.keys(values).sort()) {
    const value = values[key];
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      for (const entry of value) params.append(key, String(entry));
      continue;
    }

    params.append(key, String(value));
  }

  return params.toString();
}

export function appendApiQuery(path: string, values: ApiQueryValues = {}): string {
  const query = serializeApiQuery(values);
  return query ? `${path}?${query}` : path;
}
