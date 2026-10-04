import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import styles from "./Layout.module.css";

type ContainerProps = HTMLAttributes<HTMLDivElement> & { children: ReactNode };

export function PageContainer({ children, className = "", ...props }: ContainerProps) {
  return <div className={`${styles.page} ${className}`.trim()} {...props}>{children}</div>;
}

export function WideContainer({ children, className = "", ...props }: ContainerProps) {
  return <div className={`${styles.wide} ${className}`.trim()} {...props}>{children}</div>;
}

export function ContentContainer({ children, className = "", ...props }: ContainerProps) {
  return <WideContainer className={className} {...props}>{children}</WideContainer>;
}

export function ReadingColumn({ children, className = "", ...props }: ContainerProps) {
  return <div className={`${styles.reading} ${className}`.trim()} {...props}>{children}</div>;
}

type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  as?: "section" | "div";
};

export function Section({ children, className = "", as: Tag = "section", ...props }: SectionProps) {
  return <Tag className={`${styles.section} ${className}`.trim()} {...props}>{children}</Tag>;
}

type CustomStyle = CSSProperties & Record<`--${string}`, string | number>;

type StackProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  gap?: string;
};

export function Stack({ children, gap, className = "", style, ...props }: StackProps) {
  const mergedStyle: CustomStyle = { ...style };
  if (gap) mergedStyle["--stack-gap"] = gap;
  return <div className={`${styles.stack} ${className}`.trim()} style={mergedStyle} {...props}>{children}</div>;
}

type ClusterProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  gap?: string;
};

export function Cluster({ children, gap, className = "", style, ...props }: ClusterProps) {
  const mergedStyle: CustomStyle = { ...style };
  if (gap) mergedStyle["--cluster-gap"] = gap;
  return <div className={`${styles.cluster} ${className}`.trim()} style={mergedStyle} {...props}>{children}</div>;
}

type GridProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  mobile?: number;
  tablet?: number;
  desktop?: number;
  gap?: string;
};

export function Grid({
  children,
  mobile = 1,
  tablet,
  desktop,
  gap,
  className = "",
  style,
  ...props
}: GridProps) {
  const mergedStyle: CustomStyle = {
    ...style,
    "--grid-columns-mobile": mobile,
    "--grid-columns-tablet": tablet ?? mobile,
    "--grid-columns-desktop": desktop ?? tablet ?? mobile,
  };
  if (gap) mergedStyle["--grid-gap"] = gap;

  return <div className={`${styles.grid} ${className}`.trim()} style={mergedStyle} {...props}>{children}</div>;
}
