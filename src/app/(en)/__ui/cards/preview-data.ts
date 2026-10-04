import type { CharacterSummary } from "@/types/domain/character";
import type { CharacterLogicalGroupId, LocalizedVariantId } from "@/types/domain/identity";
import type { MediaAsset } from "@/types/domain/media";
import type { TitleReference } from "@/types/domain/references";

function svgData(label: string, accent: string, portrait = false) {
  const w = portrait ? 800 : 1200;
  const h = portrait ? 1000 : 1800;
  const safe = label.replace(/[<>&"]/g, "");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="#121722"/><rect x="8%" y="10%" width="72%" height="42%" rx="28" fill="none" stroke="${accent}" stroke-width="10"/><circle cx="78%" cy="24%" r="24" fill="#F0B44D"/><text x="8%" y="88%" fill="#FFFFFF" font-family="Arial,sans-serif" font-size="42">${safe}</text><text x="8%" y="93%" fill="#AEB6C3" font-family="Arial,sans-serif" font-size="24">FICTIONAL PREVIEW MEDIA</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function previewPoster(label: string, accent = "#4F5BD5"): MediaAsset {
  return { role: "poster", url: svgData(label, accent), alt: `Fictional preview poster for ${label}`, width: 1200, height: 1800 };
}

export function previewPortrait(label: string, accent = "#177E75"): MediaAsset {
  return { role: "character_portrait", url: svgData(label, accent, true), alt: `Fictional preview portrait for ${label}`, width: 800, height: 1000 };
}

const bnTitle: TitleReference = {
  logicalId: "preview:title:neel-dorja" as CharacterSummary<"bn-BD">["primaryTitleContext"]["logicalId"],
  locale: "bn-BD",
  slug: "neel-dorja",
  displayTitle: "নীল দরজা",
  publicRouteFamily: "movies",
};

export const previewBanglaCharacter: CharacterSummary<"bn-BD"> = {
  identity: {
    kind: "character",
    logicalId: "preview:character:nila-sen" as CharacterLogicalGroupId,
    localization: {
      requestedLocale: "bn-BD",
      primaryLocale: "en-US",
      currentVariant: {
        locale: "bn-BD",
        publicationState: "published",
        published: true,
        variantId: "preview:variant:character:nila-sen:bn" as LocalizedVariantId<"character">,
        slug: "nila-sen",
      },
      counterpart: { locale: "en-US", publicationState: "not-created", published: false },
    },
  },
  displayName: "নীলা সেন",
  primaryTitleContext: bnTitle,
  spoilerFreeDescription: "একটি রহস্যময় সংকেত অনুসরণ করতে গিয়ে নিজের অতীতের সঙ্গে নতুনভাবে মুখোমুখি হওয়া এক কাল্পনিক চরিত্র।",
  portrait: previewPortrait("নীলা সেন"),
  verification: { state: "approved" },
};
