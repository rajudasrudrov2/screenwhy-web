import type { StoryRepository } from "@/data/repositories/contracts";
import { MOCK_RELATIONSHIPS } from "@/data/fixtures/relationships";
import { MOCK_TIMELINE_EVENTS } from "@/data/fixtures/timeline";

export const mockStoryRepository: StoryRepository = {
  async getRelationships(query) {
    return MOCK_RELATIONSHIPS.filter((relationship) => {
      if (
        query.titleLogicalId &&
        relationship.contextTitle.logicalId !== query.titleLogicalId
      ) {
        return false;
      }

      if (
        query.characterLogicalId &&
        relationship.characterA.logicalId !== query.characterLogicalId &&
        relationship.characterB.logicalId !== query.characterLogicalId
      ) {
        return false;
      }

      return true;
    });
  },

  async getTimeline(query) {
    const matching = MOCK_TIMELINE_EVENTS.filter((event) => {
      if (event.title.logicalId !== query.titleLogicalId) return false;

      if (
        query.characterLogicalId &&
        !event.characters?.some(
          (character) => character.logicalId === query.characterLogicalId,
        )
      ) {
        return false;
      }

      return true;
    });

    return [...matching].sort((left, right) =>
      query.orderBy === "chronology"
        ? left.chronologyOrder - right.chronologyOrder
        : left.presentationOrder - right.presentationOrder,
    );
  },
};
