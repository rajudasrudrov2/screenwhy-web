import type { ApiRepositoryContext } from "@/data/api/repository-context";
import type { TitleRepository } from "@/data/repositories/contracts";

export function createApiTitleRepository(context: ApiRepositoryContext): TitleRepository {
  return {
    async getBySlug(query) {
      context.requests.assertReady("title.lookup");
      context.mappers.assertReady("title.lookup");
      const payload = await context.transport.request(
        context.requests.buildTitleLookup(query),
      );
      return context.mappers.mapTitleLookup(payload, query);
    },

    async list(query) {
      context.requests.assertReady("title.list");
      context.mappers.assertReady("title.list");
      const payload = await context.transport.request(
        context.requests.buildTitleList(query),
      );
      return context.mappers.mapTitleList(payload, query);
    },
  };
}
