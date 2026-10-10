"use client";

import type { CSSProperties } from "react";
import Link from "next/link";

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  margin: 0,
  display: "grid",
  placeItems: "center",
  padding: "24px",
  background: "#ffffff",
  color: "#121722",
  fontFamily: "Arial, sans-serif",
};
const panelStyle: CSSProperties = { width: "min(100%, 640px)", textAlign: "center" };
const brandStyle: CSSProperties = { margin: "0 0 28px", fontSize: "20px", fontWeight: 800 };
const titleStyle: CSSProperties = { margin: 0, fontSize: "clamp(30px, 7vw, 44px)", lineHeight: 1.1 };
const copyStyle: CSSProperties = { margin: "16px auto 0", maxWidth: "52ch", lineHeight: 1.6, color: "#515866" };
const actionsStyle: CSSProperties = { marginTop: "28px", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px" };
const primaryStyle: CSSProperties = { minHeight: "44px", padding: "10px 18px", border: 0, borderRadius: "10px", background: "#4F5BD5", color: "#fff", fontWeight: 700, cursor: "pointer" };
const linkStyle: CSSProperties = { minHeight: "44px", display: "inline-flex", alignItems: "center", padding: "10px 18px", border: "1px solid #d9dce4", borderRadius: "10px", color: "#121722", fontWeight: 700, textDecoration: "none" };

export default function GlobalError({ reset }: { readonly error: Error & { digest?: string }; readonly reset: () => void }) {
  return (
    <html lang="en-US">
      <body style={pageStyle}>
        <main style={panelStyle}>
          <p style={brandStyle}>ScreenWhy</p>
          <h1 style={titleStyle}>Something went wrong</h1>
          <p style={copyStyle}>We couldn&apos;t load this page. Try again, or return to ScreenWhy and continue browsing.</p>
          <div style={actionsStyle}>
            <button type="button" style={primaryStyle} onClick={reset}>Try again</button>
            <Link href="/" style={linkStyle}>Go to Home</Link>
          </div>
        </main>
      </body>
    </html>
  );
}
