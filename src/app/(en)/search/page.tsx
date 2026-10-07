import type { Metadata } from "next";
import { SiteFrame } from "@/components/navigation/SiteFrame";
import { searchRoute } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { loadSearchPage, normalizeSearchQuery, parseSearchFilter, parseSearchPage, SearchPage } from "@/features/search";

interface SearchRouteProps {
  readonly searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({ searchParams }: SearchRouteProps): Promise<Metadata> {
  const params = await searchParams;
  const query = normalizeSearchQuery(first(params.q));
  const title = query ? `Search results for “${query}”` : "Search";
  return {
    title,
    description: "Search ScreenWhy for explanations, titles, characters and answered post-watch questions.",
    alternates: { canonical: `${siteConfig.origin}${searchRoute("en-US")}` },
    robots: { index: false, follow: true },
    openGraph: {
      title: `${title} | ScreenWhy`,
      description: "Search ScreenWhy for clear post-watch answers.",
      url: `${siteConfig.origin}${searchRoute("en-US")}`,
      siteName: "ScreenWhy",
      type: "website",
    },
  };
}

export default async function SearchRoutePage({ searchParams }: SearchRouteProps) {
  const params = await searchParams;
  const query = first(params.q);
  const filter = parseSearchFilter(first(params.type));
  const page = parseSearchPage(first(params.page));
  const model = await loadSearchPage(query, filter, page);
  return (
    <SiteFrame locale="en-US" activePath={searchRoute("en-US")}>
      <SearchPage model={model} />
    </SiteFrame>
  );
}
