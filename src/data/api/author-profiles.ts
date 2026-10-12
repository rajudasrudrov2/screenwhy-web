import { createApiClient } from "@/services/api/client";
import { env } from "@/config/env";

export interface PublicAuthorArticle {
  readonly title: string;
  readonly slug: string;
  readonly excerpt: string;
  readonly publishedAt: string;
}
export interface PublicAuthorProfile {
  readonly userId: number;
  readonly displayName: string;
  readonly slug: string;
  readonly profilePublic: true;
  readonly bio?: string;
  readonly roleTitle?: string;
  readonly website?: string;
  readonly portraitUrl?: string;
}
export interface PublicAuthorPage {
  readonly profile: PublicAuthorProfile;
  readonly articles: readonly PublicAuthorArticle[];
  readonly page: number;
  readonly hasMore: boolean;
}
const SLUG = /^[a-z][a-z0-9-]{2,63}$/;
const ARTICLE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_PAGE = 100;
function record(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

export function parsePublicAuthorPage(payload: unknown, requestedSlug: string, requestedPage: number): PublicAuthorPage | null {
  const envelope=record(payload), meta=record(envelope?.meta), data=record(envelope?.data);
  const profile=record(data?.profile), articles=data?.articles;
  if(meta?.apiVersion!=="1" || meta.locale!=="en-US" || !profile || !Array.isArray(articles) || articles.length>12 ||
      !Number.isSafeInteger(data?.page) || data?.page!==requestedPage || typeof data?.hasMore!=="boolean" ||
      profile.profilePublic!==true || profile.slug!==requestedSlug || !SLUG.test(requestedSlug) ||
      !Number.isSafeInteger(profile.userId) || (profile.userId as number)<=0 ||
      typeof profile.displayName!=="string" || !profile.displayName.trim() || profile.displayName.length>160) return null;
  for (const key of ["bio","roleTitle"] as const) if (profile[key]!==undefined && typeof profile[key]!=="string") return null;
  for (const key of ["portraitUrl","website"] as const) {
    if(profile[key]!==undefined) {
      if(typeof profile[key]!=="string") return null;
      try { if(new URL(profile[key] as string).protocol!=="https:") return null; } catch { return null; }
    }
  }
  const safeArticles: PublicAuthorArticle[]=[];
  for (const item of articles){
    const article=record(item);
    if(!article || typeof article.slug!=="string" || !ARTICLE_SLUG.test(article.slug) ||
      typeof article.title!=="string" || !article.title.trim() || typeof article.excerpt!=="string" ||
      typeof article.publishedAt!=="string") return null;
    safeArticles.push({title:article.title,slug:article.slug,excerpt:article.excerpt,publishedAt:article.publishedAt});
  }
  return {profile:profile as unknown as PublicAuthorProfile,articles:safeArticles,page:requestedPage,hasMore:data?.hasMore as boolean};
}

/** Strictly API mode: do not substitute mock names or article lists if CMS is unavailable. */
export async function getPublicAuthorPage(slug: string, page=1): Promise<PublicAuthorPage | null> {
  if(!SLUG.test(slug) || !Number.isSafeInteger(page) || page<1 || page>MAX_PAGE) return null;
  if(env.dataSource!=="api" || !env.dataSourceExplicitlyConfigured || !env.cmsApiBaseUrl) return null;
  const result=await createApiClient().request<unknown>(`/authors/${slug}?locale=en-US&page=${page}`,{method:"GET",cache:"no-store"});
  return result.ok ? parsePublicAuthorPage(result.data,slug,page) : null;
}
