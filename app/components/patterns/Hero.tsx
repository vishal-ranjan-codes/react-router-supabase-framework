import type { ReactNode } from "react";
import { cn } from "~/lib/utils";
import { SECTION_SIZES, SECTION_TONES } from "./Section";

type HeroProps = {
  eyebrow?: string;
  title: string;
  lede?: string;
  primary?: ReactNode;
  secondary?: ReactNode;
  artifact?: ReactNode;
  trust?: ReactNode;
  tone?: "page" | "brand-deep";
  className?: string;
};

/**
 * Split hero: copy left, artifact right on lg, stacked and left-aligned
 * below. No blob; `--hero-glow` ships transparent for themers to opt into.
 */
export function Hero({
  eyebrow,
  title,
  lede,
  primary,
  secondary,
  artifact,
  trust,
  tone = "page",
  className,
}: HeroProps) {
  const onBrand = tone === "brand-deep";
  return (
    <section
      className={cn(
        SECTION_TONES[tone],
        SECTION_SIZES.lg,
        "relative overflow-hidden",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:var(--hero-glow)]"
      />
      <div className="container-page relative">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div>
            {eyebrow ? (
              <span
                className={cn(
                  "inline-block rounded-full border px-3 py-1 text-eyebrow uppercase",
                  onBrand
                    ? "border-primary-deep-foreground/40 text-primary-deep-foreground"
                    : "border-border bg-card text-foreground-muted",
                )}
              >
                {eyebrow}
              </span>
            ) : null}
            <h1 className="mt-6 text-inherit text-h1 font-semibold tracking-tight text-balance md:text-display">
              {title}
            </h1>
            {lede ? (
              <p
                className={cn(
                  "mt-6 max-w-xl text-body-lg",
                  onBrand
                    ? "text-primary-deep-foreground/80"
                    : "text-foreground-muted",
                )}
              >
                {lede}
              </p>
            ) : null}
            {primary || secondary ? (
              <div className="mt-8 flex flex-wrap gap-3">
                {primary}
                {secondary}
              </div>
            ) : null}
            {trust ? <div className="mt-12">{trust}</div> : null}
          </div>
          {artifact ? <div>{artifact}</div> : null}
        </div>
      </div>
    </section>
  );
}
