import type { ReactNode } from "react";
import { cn } from "~/lib/utils";
import { SECTION_MUTED, Section, type SectionTheme } from "./Section";

type CtaBandProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  tone?: "brand-deep" | "inverse";
  theme?: SectionTheme;
  className?: string;
};

/** Full-bleed closing band: copy left, actions right, stacked on mobile. */
export function CtaBand({
  title,
  description,
  actions,
  tone = "brand-deep",
  theme,
  className,
}: CtaBandProps) {
  return (
    <Section tone={tone} theme={theme} size="md" className={className}>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-inherit text-h2 font-semibold tracking-tight text-balance">
            {title}
          </h2>
          {description ? (
            <p className={cn("mt-3 text-body-lg", SECTION_MUTED[tone])}>
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex flex-wrap items-center gap-3">{actions}</div>
        ) : null}
      </div>
    </Section>
  );
}
