import { createRepositories } from "@/data";
import { loadSearchPage, loadSearchSuggestions } from "@/features/search/search.loader";

function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
  console.log(`PASS — ${message}`);
}

async function run() {
  const repositories = createRepositories({ dataSource: "mock", runtimeEnvironment: "development" });

  const natural = await repositories.search.search({
    locale: "en-US",
    query: "Who is Mara Vale?",
    page: 1,
    pageSize: 20,
  });
  invariant(natural.items.some((result) => result.kind === "character" && result.item.displayName === "Mara Vale"), "Token-aware mock search resolves natural Mara Vale question");

  const noQuery = await loadSearchPage(undefined, "all", 1);
  invariant(noQuery.query === "" && noQuery.totalCount === 0, "No-query state does not report zero-result search semantics");
  invariant(noQuery.questionsToExplore.length > 0, "No-query state derives Questions to Explore from Explanation details");

  const results = await loadSearchPage("Mara Vale", "all", 1);
  invariant(results.totalCount > 0, "Mara Vale query returns real derived results");
  invariant(results.characters.items.some((item) => item.displayName === "Mara Vale"), "Character results include Mara Vale");
  invariant(results.questions.totalItems > 0, "Answered Question matches are derived for Mara Vale");
  invariant(results.bestMatch !== undefined, "Deterministic Best Match is produced");

  const titleFilter = await loadSearchPage("The Last Signal", "titles", 1);
  invariant(titleFilter.titles.totalItems > 0 && titleFilter.titles.items.every((item) => item.displayTitle.includes("Last Signal")), "Title filtered view uses SearchRepository results");

  const questionFilter = await loadSearchPage("Mara", "questions", 1);
  invariant(questionFilter.questions.totalItems > 0, "Question filtered view has derived question results");
  invariant(questionFilter.questions.items.every((item) => Boolean(item.explanation.intendedSubjectQuestion)), "Every question result maps to an Explanation intendedSubjectQuestion");

  const none = await loadSearchPage("zzzzzz-no-match", "all", 1);
  invariant(none.totalCount === 0, "No-result query produces zero real matches");

  const suggestions = await loadSearchSuggestions("Mara");
  invariant(suggestions.groups.length > 0, "Suggestion server boundary returns grouped suggestions");
  invariant(suggestions.groups.every((group) => group.items.length <= (group.kind === "explanation" ? 3 : 2)), "Suggestion group limits remain bounded");
  invariant(suggestions.groups.flatMap((group) => group.items).every((item) => item.href.startsWith("/")), "Suggestion destinations are centralized internal routes");

  const shortSuggestions = await loadSearchSuggestions("M");
  invariant(shortSuggestions.groups.length === 0, "Suggestions are suppressed below two characters");

  const kinds = new Set(natural.items.map((item) => item.kind));
  invariant([...kinds].every((kind) => kind === "title" || kind === "explanation" || kind === "character"), "Core SearchRepository exposes no question result kind");
}

void run();
