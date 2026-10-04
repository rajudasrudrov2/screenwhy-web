export interface PaginationQuery {
  readonly page?: number;
  readonly pageSize?: number;
}

export interface PaginatedResult<TItem> {
  readonly items: readonly TItem[];
  readonly page: number;
  readonly pageSize: number;
  readonly totalItems: number;
  readonly totalPages: number;
}
