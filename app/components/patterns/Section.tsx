import type { ElementType, ReactNode } from "react";
import { cn } from "~/lib/utils";

export type SectionTone =
  | "page"
  | "raised"
  | "sunken"
  | "inverse"
  | "brand-deep";

export type SectionSize = "sm" | "md" | "lg";

export const SECTION_TONES: Record<SectionTone, string> = {
  page: "bg-background text-foreground",
  raised: "border-y border-border bg-card text-foreground",
  sunken: "bg-background-subtle text-foreground",
  inverse: "bg-surface-inverse text-foreground-inverse",
  "brand-deep": "bg-surface-brand text-primary-deep-foreground",
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
  inverse: "text-foreground-inverse/80",
  "brand-deep": "text-primary-deep-foreground/80",
};

type SectionProps = {
  tone?: SectionTone;
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
  size = "md",
  id,
  className,
  children,
}: SectionProps) {
  return (
    <Tag
      id={id}
      className={cn(SECTION_TONES[tone], SECTION_SIZES[size], className)}
    >
      <div className="container-page">{children}</div>
    </Tag>
  );
}
