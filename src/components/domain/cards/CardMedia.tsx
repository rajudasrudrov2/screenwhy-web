import Image from "next/image";
import { MediaFrame } from "@/components/layout/MediaFrame";
import type { MediaAsset } from "@/types/domain/media";
import styles from "./CardMedia.module.css";

export type CardMediaRatio = "poster" | "portrait" | "landscape";

interface CardMediaProps {
  readonly media?: MediaAsset;
  readonly ratio: CardMediaRatio;
  readonly sizes: string;
  readonly fallbackLabel: string;
  readonly className?: string;
}

function focalPosition(media: MediaAsset) {
  if (!media.focalPoint) return undefined;
  return `${Math.round(media.focalPoint.x * 100)}% ${Math.round(media.focalPoint.y * 100)}%`;
}

export function CardMedia({ media, ratio, sizes, fallbackLabel, className = "" }: CardMediaProps) {
  return (
    <MediaFrame ratio={ratio} objectPosition={media ? focalPosition(media) : undefined} className={`${styles.frame} ${className}`.trim()}>
      {media ? (
        <Image
          src={media.url}
          alt={media.alt}
          fill
          sizes={sizes}
          className={styles.image}
        />
      ) : (
        <div className={styles.fallback} aria-label={fallbackLabel} role="img">
          <span className={styles.fallbackMark} aria-hidden="true" />
          <span>{fallbackLabel}</span>
        </div>
      )}
    </MediaFrame>
  );
}
