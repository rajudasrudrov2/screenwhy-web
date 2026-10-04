/**
 * Conceptual aggregate-resource paths from the locked IA.
 *
 * These identify frontend resource families only. They do NOT assert a final
 * WordPress controller schema, item URL shape, or transport payload contract.
 */
export const API_RESOURCE_PATHS = {
  titles: "/titles",
  explanations: "/explanations",
  characters: "/characters",
  relationships: "/relationships",
  timeline: "/timeline",
  search: "/search",
  viewerQuestions: "/viewer-questions",
} as const;

export type ApiResourceName = keyof typeof API_RESOURCE_PATHS;
export type ApiResourcePath = (typeof API_RESOURCE_PATHS)[ApiResourceName];
