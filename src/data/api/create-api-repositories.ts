import { screenWhyApiMappers, type ApiDomainMappers } from "@/data/api/mappers";
import {
  screenWhyApiRequests,
  type ApiRequestBuilders,
} from "@/data/api/requests";
import { createApiTransport, type ApiTransport } from "@/data/api/transport";
import { createApiCharacterRepository } from "@/data/api/repositories/character-repository";
import { createApiExplanationRepository } from "@/data/api/repositories/explanation-repository";
import { createApiSearchRepository } from "@/data/api/repositories/search-repository";
import { createApiStoryRepository } from "@/data/api/repositories/story-repository";
import { createApiTitleRepository } from "@/data/api/repositories/title-repository";
import type { PublicReadRepositories } from "@/data/repositories/contracts";

export interface CreateApiRepositoriesOptions {
  readonly transport?: ApiTransport;
  readonly requests?: ApiRequestBuilders;
  readonly mappers?: ApiDomainMappers;
}

/**
 * API repository implementation matching the B1 public interfaces.
 * Default request/mapping gates deliberately fail before network access until
 * the authoritative backend wire contract exists.
 */
export function createApiRepositories(
  options: CreateApiRepositoriesOptions = {},
): PublicReadRepositories {
  const context = {
    transport: options.transport ?? createApiTransport(),
    requests: options.requests ?? screenWhyApiRequests,
    mappers: options.mappers ?? screenWhyApiMappers,
  };

  return {
    titles: createApiTitleRepository(context),
    explanations: createApiExplanationRepository(context),
    characters: createApiCharacterRepository(context),
    search: createApiSearchRepository(context),
    story: createApiStoryRepository(context),
  };
}
