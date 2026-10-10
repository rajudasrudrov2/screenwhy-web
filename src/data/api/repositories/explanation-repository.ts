import { DataAccessError } from "@/data/errors";
import type { ApiRepositoryContext } from "@/data/api/repository-context";
import type { ExplanationRepository } from "@/data/repositories/contracts";

export function createApiExplanationRepository(
  context: ApiRepositoryContext,
): ExplanationRepository {
  return {
    async getBySlug(query) {
      context.requests.assertReady("explanation.lookup");
      context.mappers.assertReady("explanation.lookup");
      try {
      const payload = await context.transport.request(
        context.requests.buildExplanationLookup(query),
      );
      return context.mappers.mapExplanationLookup(payload, query);
      } catch(error) {
        if(error instanceof DataAccessError && error.status===404) return {status:"unavailable",requestedLocale:query.locale,value:null,variant:{locale:query.locale,publicationState:"not-created",published:false}};
        throw error;
      }
    },

    async list(query) {
      context.requests.assertReady("explanation.list");
      context.mappers.assertReady("explanation.list");
      const payload = await context.transport.request(
        context.requests.buildExplanationList(query),
      );
      return context.mappers.mapExplanationList(payload, query);
    },
  };
}
