import type { CSSProperties, ReactNode } from "react";
import { AlertCircleIcon, CheckIcon, InfoIcon } from "@/components/icons/Icons";
import styles from "./Primitives.module.css";

export function Divider() {
  return <hr className={styles.divider} />;
}

type BadgeTone = "neutral" | "info" | "success" | "warning" | "error" | "spoiler" | "accent";

type BadgeProps = {
  children: ReactNode;
  tone?: BadgeTone;
};

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  return <span className={`${styles.badge} ${tone !== "neutral" ? styles[tone] : ""}`.trim()}>{children}</span>;
}

type DisclosureProps = {
  summary: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
};

export function Disclosure({ summary, children, defaultOpen = false }: DisclosureProps) {
  return (
    <details className={styles.disclosure} open={defaultOpen || undefined}>
      <summary className={styles.summary}>{summary}</summary>
      <div className={styles.disclosureBody}>{children}</div>
    </details>
  );
}

type SkeletonProps = {
  width?: string;
  height?: string;
  radius?: string;
  label?: string;
};

type SkeletonStyle = CSSProperties & Record<`--${string}`, string>;

export function Skeleton({ width = "100%", height = "16px", radius, label = "Loading" }: SkeletonProps) {
  const style: SkeletonStyle = {
    "--skeleton-width": width,
    "--skeleton-height": height,
  };
  if (radius) style["--skeleton-radius"] = radius;
  return <span className={styles.skeleton} style={style} role="status" aria-label={label} />;
}

type StateTone = "loading" | "empty" | "error" | "success";

type StateShellProps = {
  title: string;
  children: ReactNode;
  tone?: StateTone;
  action?: ReactNode;
};

export function StateShell({ title, children, tone = "empty", action }: StateShellProps) {
  const Icon = tone === "error" ? AlertCircleIcon : tone === "success" ? CheckIcon : InfoIcon;
  const role = tone === "error" ? "alert" : "status";
  const toneClass = tone === "empty" ? "" : styles[`state_${tone}`];
  return (
    <div className={`${styles.state} ${toneClass}`.trim()} role={role} aria-live={tone === "loading" ? "polite" : undefined}>
      <span className={styles.stateIcon}><Icon /></span>
      <div className={styles.stateTitle}>{title}</div>
      <div className={styles.stateBody}>{children}</div>
      {action}
    </div>
  );
}
