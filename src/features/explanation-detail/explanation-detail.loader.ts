import { assertArticleEvidenceIntegrity, getRenderableArticleBody } from "@/data/article-body";
import { getRepositories } from "@/data";
import type { CharacterDetail } from "@/types/domain/character";
import type { ExplanationDetail } from "@/types/domain/explanation";
import type { TitleDetail } from "@/types/domain/title";
import type {
  ExplanationDetailViewModel,
  ExplanationViewerQuestion,
} from "@/features/explanation-detail/explanation-detail.types";

async function resolvePrimaryTitle(
  explanation: ExplanationDetail<"en-US">,
): Promise<TitleDetail<"en-US"> | undefined> {
  const repositories = getRepositories();
  const reference = explanation.primaryTitle;
  const result = await repositories.titles.getBySlug({
    locale: "en-US",
    routeFamily: reference.publicRouteFamily,
    slug: reference.slug,
  });

  return result.status === "available" ? result.value : undefined;
}

async function resolveRelatedCharacters(
  explanation: ExplanationDetail<"en-US">,
): Promise<readonly CharacterDetail<"en-US">[]> {
  const repositories = getRepositories();
  const results = await Promise.all(
    (explanation.relatedCharacters ?? []).map((reference) =>
      repositories.characters.getBySlug({
        locale: "en-US",
        slug: reference.slug,
      }),
    ),
  );

  return results.flatMap((result) =>
    result.status === "available" ? [result.value] : [],
  );
}

async function resolveRelatedExplanations(
  explanation: ExplanationDetail<"en-US">,
): Promise<readonly ExplanationDetail<"en-US">[]> {
  const repositories = getRepositories();
  const currentId = String(explanation.identity.logicalId);
  const references = (explanation.relatedExplanations ?? []).filter(
    (reference) => String(reference.logicalId) !== currentId,
  );
  const results = await Promise.all(
    references.map((reference) =>
      repositories.explanations.getBySlug({
        locale: "en-US",
        slug: reference.slug,
      }),
    ),
  );

  return results.flatMap((result) =>
    result.status === "available" ? [result.value] : [],
  );
}

function buildViewerQuestions(
  explanation: ExplanationDetail<"en-US">,
  related: readonly ExplanationDetail<"en-US">[],
): readonly ExplanationViewerQuestion[] {
  const candidates = [explanation, ...related];
  const seen = new Set<string>();
  const questions: ExplanationViewerQuestion[] = [];

  for (const item of candidates) {
    const question = item.intendedSubjectQuestion?.trim();
    if (!question) continue;
    const key = question.toLocaleLowerCase("en-US");
    if (seen.has(key)) continue;
    seen.add(key);
    questions.push({ question, explanation: item });
  }

  return questions.slice(0, 6);
}

export async function loadExplanationDetail(
  slug: string,
): Promise<ExplanationDetailViewModel | null> {
  const repositories = getRepositories();
  const result = await repositories.explanations.getBySlug({
    locale: "en-US",
    slug,
  });

  if (result.status !== "available") return null;

  const explanation: ExplanationDetail<"en-US"> = result.value;
  const article = getRenderableArticleBody(explanation.body.document, { primaryTitleId: explanation.primaryTitle.logicalId, canon: explanation.canon });
  assertArticleEvidenceIntegrity(article, explanation.citations ?? []);

  const [primaryTitle, relatedCharacters, relatedExplanations] =
    await Promise.all([
      resolvePrimaryTitle(explanation),
      resolveRelatedCharacters(explanation),
      resolveRelatedExplanations(explanation),
    ]);

  return {
    locale: "en-US",
    explanation,
    primaryTitle,
    article,
    relatedCharacters,
    relatedExplanations,
    viewerQuestions: buildViewerQuestions(explanation, relatedExplanations),
  };
}
