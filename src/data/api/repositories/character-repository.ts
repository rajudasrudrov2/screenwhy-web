import { DataAccessError } from "@/data/errors";
import type { ApiRepositoryContext } from "@/data/api/repository-context";
import type { CharacterRepository } from "@/data/repositories/contracts";

export function createApiCharacterRepository(
  context: ApiRepositoryContext,
): CharacterRepository {
  return {
    async getBySlug(query) {
      context.requests.assertReady("character.lookup");
      context.mappers.assertReady("character.lookup");
      try {
      const payload = await context.transport.request(
        context.requests.buildCharacterLookup(query),
      );
      return context.mappers.mapCharacterLookup(payload, query);
      } catch(error) {
        if(error instanceof DataAccessError && error.status===404) return {status:"unavailable",requestedLocale:query.locale,value:null,variant:{locale:query.locale,publicationState:"not-created",published:false}};
        throw error;
      }
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
