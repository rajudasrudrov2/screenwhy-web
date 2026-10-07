import type { PublicRouteFamily } from "@/config/routes";
import type { LocaleCode } from "@/lib/i18n/locales";
import { TITLE_TYPE_LABELS, type TitleType } from "@/types/domain/title";

const routeFamilyLabels: Record<LocaleCode, Record<PublicRouteFamily, string>> = {
  "en-US": {
    movies: "Movies",
    tv: "TV",
    anime: "Anime",
    "k-drama": "K-Drama",
    documentaries: "Documentaries",
  },
};

export function routeFamilyLabel(routeFamily: PublicRouteFamily, locale: LocaleCode) {
  return routeFamilyLabels[locale][routeFamily];
}

export function titleTypeLabel(titleType: TitleType, _locale: LocaleCode) {
  return TITLE_TYPE_LABELS[titleType];
}
