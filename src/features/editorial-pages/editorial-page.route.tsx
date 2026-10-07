import { SiteFrame } from "@/components/navigation/SiteFrame";
import { EDITORIAL_PAGE_CONTENT } from "./editorial-page.content";
import { EditorialPage } from "./EditorialPage";
import type { EditorialPageKey } from "./editorial-page.types";

export function renderEditorialPageRoute(pageKey: EditorialPageKey) {
  const page = EDITORIAL_PAGE_CONTENT[pageKey];
  return (
    <SiteFrame locale="en-US" activePath={page.route}>
      <EditorialPage pageKey={pageKey} />
    </SiteFrame>
  );
}
