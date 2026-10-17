import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { SiteFrame } from "@/components/navigation/SiteFrame";
import { env } from "@/config/env";
import { getLiveExplanations } from "@/lib/live-explanations";
import { buildLiveHomepageModel } from "@/features/homepage3/live-adapter";
import { PreviewExperience } from "@/features/homepage3/PreviewExperience";
import { buildSw3DemoHomepage } from "@/demo/screenwhy3-homepage";
import { previewAuthorized, unlockSw3Preview } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "ScreenWhy 3.0 — Owner Preview", robots: { index: false, follow: false, noarchive: true, noimageindex: true }, referrer: "no-referrer" };

/** Never available on the production domain, including if an env flag is misconfigured. */
export default async function Sw3OwnerPreview({ searchParams }: {readonly searchParams: Promise<{error?:string}>}) {
  const isLocal=process.env.NODE_ENV !== "production";
  const previewEnvironment=process.env.VERCEL_ENV === "preview" && process.env.SCREENWHY_SW3_PREVIEW_ENABLED === "true";
  if (!isLocal && !previewEnvironment) notFound();
  await connection();
  const authorized=await previewAuthorized();
  if(!authorized){const params=await searchParams;return <main style={{minHeight:"70vh",padding:"10vh 24px",background:"#0e1721",color:"white",display:"grid",placeItems:"center"}}>
    <form action={unlockSw3Preview} style={{maxWidth:380,width:"100%",display:"grid",gap:16}}>
      <h1>ScreenWhy 3.0 private owner preview</h1><p>Enter the private preview password. This is not the public site.</p>
      {params.error ? <p role="alert">Incorrect preview password.</p> : null}
      <label htmlFor="sw3-password">Preview password</label><input id="sw3-password" name="password" type="password" required autoComplete="current-password" minLength={24} style={{padding:14}}/>
      <button type="submit" style={{padding:14,background:"#f0b44d",border:0}}>Unlock private preview</button>
    </form>
  </main>}
  let live;
  let liveError: string | undefined;
  if (env.cmsApiBaseUrl) {
    try { live=buildLiveHomepageModel(await getLiveExplanations({perPage:50})); }
    catch { liveError="WordPress Published feed could not be reached. Live Content Only will not show demos."; }
  } else liveError="CMS API is not configured for this local preview. Live Content Only has no data.";
  return <SiteFrame locale="en-US" activePath="/"><PreviewExperience demo={buildSw3DemoHomepage()} live={live} liveError={liveError}/></SiteFrame>;
}
