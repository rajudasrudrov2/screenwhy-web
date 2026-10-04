import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import styles from "./MediaFrame.module.css";

export type MediaRatio = "poster" | "portrait" | "landscape" | "social" | "square";

type MediaFrameProps = HTMLAttributes<HTMLDivElement> & {
  ratio?: MediaRatio;
  children: ReactNode;
  objectPosition?: string;
};

type MediaStyle = CSSProperties & { "--pe-media-position"?: string };

export function MediaFrame({
  ratio = "landscape",
  children,
  objectPosition,
  className = "",
  style,
  ...props
}: MediaFrameProps) {
  const mediaStyle: MediaStyle = { ...style };
  if (objectPosition) mediaStyle["--pe-media-position"] = objectPosition;

  return (
    <div className={`${styles.frame} ${styles[ratio]} ${className}`.trim()} style={mediaStyle} {...props}>
      {children}
    </div>
  );
}
