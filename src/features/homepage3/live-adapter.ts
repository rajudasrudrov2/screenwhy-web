import type { LiveList } from "@/lib/live-explanations";
import type { PremiumHomeModel, HomeExplanation } from "./types";
const date = (raw: string) => { const ms = Date.parse(raw.replace(" ", "T")); return Number.isFinite(ms) ? ms : 0; };
/** NO demo fallback. The WordPress feed supplies only Published explanations. */
export function buildLiveHomepageModel(feed: LiveList): PremiumHomeModel {
  const explanations: HomeExplanation[] = feed.items.map(item => ({
    id: `wp:${item.id}`, source: "live", isDemo: false,
    headline: item.headline, excerpt: item.excerpt, href: item.publicPath,
    publishedAt: item.publishedAt, modifiedAt: item.modifiedAt,
  })).sort((a, b) => date(b.publishedAt ?? "") - date(a.publishedAt ?? ""));
  return { mode: "live", movies: [], explanations, themes: [], collections: [], publishedCount: feed.total };
}
