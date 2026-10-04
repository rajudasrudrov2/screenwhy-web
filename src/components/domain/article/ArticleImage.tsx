import Image from "next/image";
import type { MediaAsset } from "@/types/domain/media";
import styles from "./ArticleImage.module.css";

export interface ArticleImageProps {
  readonly media: MediaAsset;
  readonly credit?: string;
  readonly sizes?: string;
}

export function ArticleImage({
  media,
  credit,
  sizes = "(max-width: 767px) calc(100vw - 32px), 720px",
}: ArticleImageProps) {
  return (
    <figure className={styles.figure}>
      <div className={styles.media}>
        <Image
          src={media.url}
          alt={media.alt}
          width={media.width}
          height={media.height}
          sizes={sizes}
          className={styles.image}
        />
      </div>
      {media.caption || credit ? (
        <figcaption className={styles.caption}>
          {media.caption ? <span>{media.caption}</span> : null}
          {media.caption && credit ? <span aria-hidden="true">·</span> : null}
          {credit ? <span>{credit}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
