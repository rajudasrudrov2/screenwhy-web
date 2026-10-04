import type { PublicReadRepositories } from "@/data/repositories/contracts";
import { mockCharacterRepository } from "@/data/mock/character-repository";
import { mockExplanationRepository } from "@/data/mock/explanation-repository";
import { mockSearchRepository } from "@/data/mock/search-repository";
import { mockStoryRepository } from "@/data/mock/story-repository";
import { mockTitleRepository } from "@/data/mock/title-repository";

/**
 * Deterministic mock aggregation retained behind the final mock/API resolver.
 * Application UI should obtain repositories from @/data rather than importing
 * this implementation directly.
 */
export function createMockRepositories(): PublicReadRepositories {
  return {
    titles: mockTitleRepository,
    explanations: mockExplanationRepository,
    characters: mockCharacterRepository,
    search: mockSearchRepository,
    story: mockStoryRepository,
  };
}

export const mockRepositories = createMockRepositories();
