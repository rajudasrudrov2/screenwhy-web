import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import styles from "./BrandLogo.module.css";

type BrandLogoProps = {
  kind?: "horizontal" | "mark";
  surface?: "light" | "dark";
  href?: string;
  width?: number;
  preload?: boolean;
  label?: string;
};

const assets = {
  horizontal: {
    light: "/brand/logo/primary-light.svg",
    dark: "/brand/logo/primary-dark.svg",
  },
  mark: {
    light: "/brand/mark/pe-mark-light.svg",
    dark: "/brand/mark/pe-mark-dark.svg",
  },
} as const;

const HORIZONTAL_RATIO = 433.172 / 80;

export function BrandLogo({
  kind = "horizontal",
  surface = "light",
  href = "/",
  width,
  preload = false,
  label = "PlotExplainer home",
}: BrandLogoProps) {
  const resolvedWidth = width ?? (kind === "horizontal" ? 160 : 28);
  const height = kind === "horizontal"
    ? Math.max(1, Math.round(resolvedWidth / HORIZONTAL_RATIO))
    : resolvedWidth;

  return (
    <Link
      href={href}
      className={styles.link}
      aria-label={label}
      data-brand-kind={kind}
      style={{ "--brand-width": `${resolvedWidth}px` } as CSSProperties}
    >
      <Image
        src={assets[kind][surface]}
        alt=""
        width={resolvedWidth}
        height={height}
        className={kind === "horizontal" ? styles.horizontal : styles.mark}
        preload={preload}
        sizes={`${resolvedWidth}px`}
      />
    </Link>
  );
}
