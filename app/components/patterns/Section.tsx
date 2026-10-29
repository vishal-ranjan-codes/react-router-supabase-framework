import type { ElementType, ReactNode } from "react";
import { cn } from "~/lib/utils";

export type SectionTone =
  | "page"
  | "raised"
  | "sunken"
  | "inverse"
  | "brand-deep";

export type SectionTheme = "dark" | "light";

export type SectionSize = "sm" | "md" | "lg";

export const SECTION_TONES: Record<SectionTone, string> = {
  page: "bg-background text-foreground",
  raised: "border-y border-border bg-card text-foreground",
  sunken: "bg-background-subtle text-foreground",
  inverse: "bg-surface-inverse text-foreground-inverse",
  "brand-deep":
    "dark bg-surface-brand text-primary-deep-foreground [--secondary:var(--secondary-on-brand)] [--secondary-hover:var(--secondary-on-brand-hover)] [--secondary-foreground:var(--secondary-on-brand-foreground)] [--border:var(--border-on-brand)]",
};

export const SECTION_SIZES: Record<SectionSize, string> = {
  sm: "py-section-sm",
  md: "py-section-md",
  lg: "py-section-lg",
};

/** Secondary text colour that stays legible on each tone. */
export const SECTION_MUTED: Record<SectionTone, string> = {
  page: "text-foreground-muted",
  raised: "text-foreground-muted",
  sunken: "text-foreground-muted",
  inverse: "text-foreground-on-inverse-muted",
  "brand-deep": "text-foreground-on-brand-muted",
};

type SectionProps = {
  tone?: SectionTone;
  theme?: SectionTheme;
  size?: SectionSize;
  as?: ElementType;
  id?: string;
  className?: string;
  children?: ReactNode;
};

/**
 * Full-bleed surface: the tone paints edge to edge, only the inner container
 * is constrained. Boxes stay reserved for cards, grids, forms and modals.
 */
export function Section({
  as: Tag = "section",
  tone = "page",
  theme,
  size = "md",
  id,
  className,
  children,
}: SectionProps) {
  const themeClass =
    theme === "dark" ? "dark" : theme === "light" ? "light" : undefined;

  return (
    <Tag
      id={id}
      className={cn(
        SECTION_TONES[tone],
        SECTION_SIZES[size],
        themeClass,
        className,
      )}
    >
      <div className="container-page">{children}</div>
    </Tag>
  );
}
