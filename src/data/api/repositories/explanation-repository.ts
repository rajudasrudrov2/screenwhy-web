import type { ApiRepositoryContext } from "@/data/api/repository-context";
import type { ExplanationRepository } from "@/data/repositories/contracts";

export function createApiExplanationRepository(
  context: ApiRepositoryContext,
): ExplanationRepository {
  return {
    async getBySlug(query) {
      context.requests.assertReady("explanation.lookup");
      context.mappers.assertReady("explanation.lookup");
      const payload = await context.transport.request(
        context.requests.buildExplanationLookup(query),
      );
      return context.mappers.mapExplanationLookup(payload, query);
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
