import type { ApiDomainMappers } from "@/data/api/mappers";
import type { ApiRequestBuilders } from "@/data/api/requests";
import type { ApiTransport } from "@/data/api/transport";

export interface ApiRepositoryContext {
  readonly transport: ApiTransport;
  readonly requests: ApiRequestBuilders;
  readonly mappers: ApiDomainMappers;
}
