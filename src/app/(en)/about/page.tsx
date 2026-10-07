import type { Metadata } from "next";
import { createEditorialPageMetadata, renderEditorialPageRoute } from "@/features/editorial-pages";
export const metadata: Metadata = createEditorialPageMetadata("about");
export default function Page() { return renderEditorialPageRoute("about"); }
