import type { ApiRepositoryContext } from "@/data/api/repository-context";
import type { SearchRepository } from "@/data/repositories/contracts";

export function createApiSearchRepository(context: ApiRepositoryContext): SearchRepository {
  return {
    async search(query) {
      context.requests.assertReady("search.list");
      context.mappers.assertReady("search.list");
      const payload = await context.transport.request(
        context.requests.buildSearch(query),
      );
      return context.mappers.mapSearch(payload, query);
    },
  };
}
