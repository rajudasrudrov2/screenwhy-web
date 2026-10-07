import type { LocaleCode } from "@/lib/i18n/locales";
import styles from "./CitationMarker.module.css";

export interface CitationMarkerProps {
  readonly number: number;
  readonly sourceAnchorId: string;
  readonly markerId?: string;
  readonly sourceTitle?: string;
  readonly locale?: LocaleCode;
}

export function CitationMarker({
  number,
  sourceAnchorId,
  markerId = `citation-${number}`,
  sourceTitle,
}: CitationMarkerProps) {
  const accessibleName = `Citation ${number}${sourceTitle ? `: ${sourceTitle}` : ""}`;

  return (
    <sup className={styles.markerWrap} id={markerId}>
      <a className={styles.marker} href={`#${sourceAnchorId}`} aria-label={accessibleName}>
        [{number}]
      </a>
    </sup>
  );
}
