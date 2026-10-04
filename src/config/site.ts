import { brandConfig } from "@/config/brand";
import { env } from "@/config/env";

export const siteConfig = Object.freeze({
  ...brandConfig,
  defaultTitle: brandConfig.name,
  titleTemplate: `%s | ${brandConfig.name}`,
  description: brandConfig.brandPromise,
  origin: env.siteUrl,
  allowIndexing: env.allowIndexing,
});
