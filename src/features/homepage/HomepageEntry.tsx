import { Homepage as OriginalHomepage } from "./Homepage";
import { LiveHomepage } from "./LiveHomepage";
import type { HomepageViewModel } from "./homepage.types";
import type { LiveList } from "@/lib/live-explanations";

/** Preserves the original Homepage(model) API while enabling published-only CMS data. */
type HomepageProps =
  | { readonly model: HomepageViewModel; readonly live?: never }
  | { readonly live: LiveList; readonly model?: never };

export function Homepage(props: HomepageProps) {
  if ("model" in props && props.model !== undefined) {
    return <OriginalHomepage model={props.model} />;
  }
  if (props.live !== undefined) return <LiveHomepage list={props.live} />;
  throw new Error("A homepage view model or published CMS list is required.");
}
