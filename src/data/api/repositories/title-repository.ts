import { DataAccessError } from "@/data/errors";
import type { ApiRepositoryContext } from "@/data/api/repository-context";
import type { TitleRepository } from "@/data/repositories/contracts";

export function createApiTitleRepository(context: ApiRepositoryContext): TitleRepository {
  return {
    async getBySlug(query) {
      context.requests.assertReady("title.lookup");
      context.mappers.assertReady("title.lookup");
      try {
      const payload = await context.transport.request(
        context.requests.buildTitleLookup(query),
      );
      return context.mappers.mapTitleLookup(payload, query);
      } catch(error) {
        if(error instanceof DataAccessError && error.status===404) return {status:"unavailable",requestedLocale:query.locale,value:null,variant:{locale:query.locale,publicationState:"not-created",published:false}};
        throw error;
      }
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
