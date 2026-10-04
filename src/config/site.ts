import { env } from "@/config/env";

export const siteConfig = Object.freeze({
  name: "PlotExplainer",
  defaultTitle: "PlotExplainer",
  titleTemplate: "%s | PlotExplainer",
  description: "Movies & Shows, Explained.",
  origin: env.siteUrl,
  allowIndexing: env.allowIndexing,
});
