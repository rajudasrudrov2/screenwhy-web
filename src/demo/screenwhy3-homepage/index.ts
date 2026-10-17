import type { PremiumHomeModel } from "@/features/homepage3/types";
import { DEMO_MOVIES } from "./movies";
import { DEMO_EXPLANATIONS } from "./explanations";
import { DEMO_THEMES, DEMO_COLLECTIONS } from "./collections";
export function buildSw3DemoHomepage(): PremiumHomeModel {
  return { mode: "screenwhy3_demo", movies: DEMO_MOVIES, explanations: DEMO_EXPLANATIONS, themes: DEMO_THEMES, collections: DEMO_COLLECTIONS };
}
