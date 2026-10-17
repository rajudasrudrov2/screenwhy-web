"use client";

import { useEffect, useState } from "react";
import type { PremiumHomeModel } from "./types";
import { PremiumHomepage } from "./PremiumHomepage";
import styles from "./PreviewExperience.module.css";

const KEY = "screenwhy3:owner-preview:show-demo:v1";

/** Preview-only browser preference. NOT a CMS mutation or global kill switch. */
export function PreviewExperience({ demo, live, liveError }: {
  readonly demo: PremiumHomeModel;
  readonly live?: PremiumHomeModel;
  readonly liveError?: string;
}) {
  const [showDemo, setShowDemo] = useState<boolean | null>(null);
  useEffect(() => {
    try { setShowDemo(window.localStorage.getItem(KEY) !== "false"); }
    catch { setShowDemo(true); }
  }, []);
  function choose(value: boolean) {
    try { window.localStorage.setItem(KEY, String(value)); } catch { /* ephemeral private browsers */ }
    setShowDemo(value);
  }
  return <div className={styles.previewShell}>
    <div className={styles.previewControls} role="region" aria-label="Owner preview demo controls">
      <div><strong>SCREENWHY 3.0 · OWNER PREVIEW</strong><p>Fictional demos are never published to WordPress, real search or the sitemap.</p></div>
      <div className={styles.controls}>
        <span className={styles.mode}>{showDemo === null ? "Loading preference" : showDemo ? "DEMO / PREVIEW" : "LIVE CONTENT ONLY"}</span>
        <button type="button" onClick={() => choose(false)} disabled={showDemo === false} aria-pressed={showDemo === false}>Hide All Demo Content</button>
        <button type="button" onClick={() => choose(true)} disabled={showDemo === true} aria-pressed={showDemo === true}>Show Demo Content</button>
      </div>
    </div>
    {showDemo === null ? <div className={styles.loading} role="status">Loading preview preferences…</div> :
      showDemo ? <PremiumHomepage model={demo}/> : live ? <PremiumHomepage model={live}/> :
      <div className={styles.empty} role="status"><h1>Live Content Only</h1><p>{liveError ?? "No WordPress Published feed is available in this preview. No demo content will be substituted."}</p><a href="/">Open the public homepage</a></div>}
  </div>;
}
