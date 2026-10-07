import { Inter, Manrope } from "next/font/google";

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["Arial", "sans-serif"],
});

export const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["Arial", "sans-serif"],
});

export const fontVariableClassName = [inter.variable, manrope.variable].join(" ");
