import Link from "next/link";
import type { CSSProperties } from "react";
import { brandConfig } from "@/config/brand";
import styles from "./BrandLogo.module.css";

type BrandLogoProps = {
  kind?: "horizontal" | "mark";
  surface?: "light" | "dark";
  href?: string;
  width?: number;
  preload?: boolean;
  label?: string;
};

type BrandStyle = CSSProperties & { "--brand-target-width"?: string };

/**
 * Temporary ScreenWhy text identity.
 *
 * The former production logo/monogram must not be reused as ScreenWhy, and no
 * official ScreenWhy logo package exists yet. Keep this compatibility-shaped
 * component so header/footer layout can accept the future asset without a
 * navigation rewrite.
 */
export function BrandLogo({
  kind = "horizontal",
  surface = "light",
  href = "/",
  width,
  preload: _preload = false,
  label = "ScreenWhy home",
}: BrandLogoProps) {
  const targetWidth = width ?? (kind === "horizontal" ? 160 : 96);

  return (
    <Link
      href={href}
      className={styles.link}
      aria-label={label}
      data-brand-kind={kind}
      data-brand-surface={surface}
      style={{ "--brand-target-width": `${targetWidth}px` } as BrandStyle}
    >
      <span className={kind === "horizontal" ? styles.horizontal : styles.compact} aria-hidden="true">
        {brandConfig.name}
      </span>
    </Link>
  );
}
