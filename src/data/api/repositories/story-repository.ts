import type { ApiRepositoryContext } from "@/data/api/repository-context";
import type { StoryRepository } from "@/data/repositories/contracts";

export function createApiStoryRepository(context: ApiRepositoryContext): StoryRepository {
  return {
    async getRelationships(query) {
      context.requests.assertReady("story.relationships");
      context.mappers.assertReady("story.relationships");
      const payload = await context.transport.request(
        context.requests.buildRelationships(query),
      );
      return context.mappers.mapRelationships(payload, query);
    },

    async getTimeline(query) {
      context.requests.assertReady("story.timeline");
      context.mappers.assertReady("story.timeline");
      const payload = await context.transport.request(
        context.requests.buildTimeline(query),
      );
      return context.mappers.mapTimeline(payload, query);
    },
  };
}
