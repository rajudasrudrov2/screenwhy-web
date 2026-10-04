import type {
  PaginatedResult,
  PaginationQuery,
} from "@/data/repositories/pagination";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 50;

function positiveInteger(value: number | undefined, fallback: number): number {
  if (!Number.isInteger(value) || !value || value < 1) return fallback;
  return value;
}

export function paginate<TItem>(
  items: readonly TItem[],
  query: PaginationQuery,
): PaginatedResult<TItem> {
  const page = positiveInteger(query.page, DEFAULT_PAGE);
  const pageSize = Math.min(
    positiveInteger(query.pageSize, DEFAULT_PAGE_SIZE),
    MAX_PAGE_SIZE,
  );
  const totalItems = items.length;
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize);
  const start = (page - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    page,
    pageSize,
    totalItems,
    totalPages,
  };
}
