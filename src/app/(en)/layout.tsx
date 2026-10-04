import type { Metadata } from "next";
import { fontVariableClassName } from "@/app/fonts";
import { createRootMetadata } from "@/config/metadata";
import { siteConfig } from "@/config/site";
import "@/styles/globals.css";

export const metadata: Metadata = createRootMetadata(siteConfig.description);

export default function EnglishRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-US" className={fontVariableClassName}>
      <body>{children}</body>
    </html>
  );
}
