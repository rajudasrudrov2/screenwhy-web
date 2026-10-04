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
  "bn-BD": {
    movies: "মুভি",
    tv: "টিভি",
    anime: "অ্যানিমে",
    "k-drama": "কে-ড্রামা",
    documentaries: "ডকুমেন্টারি",
  },
};

const bnTitleTypeLabels: Record<TitleType, string> = {
  movie: "মুভি",
  tv_series: "টিভি সিরিজ",
  miniseries: "মিনিসিরিজ",
  documentary: "ডকুমেন্টারি",
  tv_special: "টিভি স্পেশাল",
  web_series: "ওয়েব সিরিজ",
  other_screen_story: "অন্যান্য স্ক্রিন গল্প",
};

export function routeFamilyLabel(routeFamily: PublicRouteFamily, locale: LocaleCode) {
  return routeFamilyLabels[locale][routeFamily];
}

export function titleTypeLabel(titleType: TitleType, locale: LocaleCode) {
  return locale === "bn-BD" ? bnTitleTypeLabels[titleType] : TITLE_TYPE_LABELS[titleType];
}
