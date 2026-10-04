import type { ApiRepositoryContext } from "@/data/api/repository-context";
import type { CharacterRepository } from "@/data/repositories/contracts";

export function createApiCharacterRepository(
  context: ApiRepositoryContext,
): CharacterRepository {
  return {
    async getBySlug(query) {
      context.requests.assertReady("character.lookup");
      context.mappers.assertReady("character.lookup");
      const payload = await context.transport.request(
        context.requests.buildCharacterLookup(query),
      );
      return context.mappers.mapCharacterLookup(payload, query);
    },

    async list(query) {
      context.requests.assertReady("character.list");
      context.mappers.assertReady("character.list");
      const payload = await context.transport.request(
        context.requests.buildCharacterList(query),
      );
      return context.mappers.mapCharacterList(payload, query);
    },
  };
}
