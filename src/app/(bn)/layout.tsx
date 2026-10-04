import type { Metadata } from "next";
import { fontVariableClassName } from "@/app/fonts";
import { createRootMetadata } from "@/config/metadata";
import "@/styles/globals.css";

export const metadata: Metadata = createRootMetadata(
  "PlotExplainer বাংলা ফ্রন্টএন্ড ফাউন্ডেশন।",
);

export default function BanglaRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn-BD" className={fontVariableClassName}>
      <body>{children}</body>
    </html>
  );
}
