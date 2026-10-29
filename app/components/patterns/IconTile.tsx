import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

type IconTileProps = {
  size?: "sm" | "md" | "lg";
  tone?: "muted" | "brand";
  className?: string;
  children?: ReactNode;
};

const SIZES = {
  sm: "h-9 w-9 [&>svg]:h-4 [&>svg]:w-4",
  md: "h-12 w-12 [&>svg]:h-6 [&>svg]:w-6",
  lg: "h-16 w-16 [&>svg]:h-8 [&>svg]:w-8",
} as const;

const TONES = {
  muted: "bg-background-subtle text-foreground",
  brand: "bg-primary text-primary-foreground",
} as const;

export function IconTile({
  size = "md",
  tone = "muted",
  className,
  children,
}: IconTileProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg",
        SIZES[size],
        TONES[tone],
        className,
      )}
    >
      {children}
    </div>
  );
}
