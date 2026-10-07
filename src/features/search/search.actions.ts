"use server";

import { loadSearchSuggestions } from "@/features/search/search.loader";
import type { SearchSuggestions } from "@/features/search/search.types";

export async function getSearchSuggestions(query: string): Promise<SearchSuggestions> {
  return loadSearchSuggestions(query);
}
