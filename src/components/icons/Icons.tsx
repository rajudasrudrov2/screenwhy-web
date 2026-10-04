import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function baseIconProps(size: number, props: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
    ...props,
  };
}

export function SearchIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg {...baseIconProps(size, props)}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

export function MenuIcon({ size = 22, ...props }: IconProps) {
  return (
    <svg {...baseIconProps(size, props)}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon({ size = 22, ...props }: IconProps) {
  return (
    <svg {...baseIconProps(size, props)}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function ChevronDownIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg {...baseIconProps(size, props)}>
      <path d="m7 10 5 5 5-5" />
    </svg>
  );
}

export function ChevronRightIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg {...baseIconProps(size, props)}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function ArrowRightIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg {...baseIconProps(size, props)}>
      <path d="M5 12h14M14 7l5 5-5 5" />
    </svg>
  );
}

export function AlertCircleIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg {...baseIconProps(size, props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5M12 16.25h.01" />
    </svg>
  );
}

export function InfoIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg {...baseIconProps(size, props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  );
}

export function CheckIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg {...baseIconProps(size, props)}>
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}
