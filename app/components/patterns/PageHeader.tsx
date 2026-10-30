import type { ReactNode } from "react";
import { Section, type SectionTone } from "./Section";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  /** Extra content under the lede — a status pill, a breadcrumb, an action. */
  aside?: ReactNode;
  tone?: SectionTone;
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  aside,
  tone = "page",
  className,
}: PageHeaderProps) {
  return (
    <Section tone={tone} size="sm" className={className}>
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="text-eyebrow uppercase text-foreground-muted">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-3 text-h1 font-semibold tracking-tight text-balance">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 text-body-lg text-foreground-muted">
            {description}
          </p>
        ) : null}
        {aside ? <div className="mt-6">{aside}</div> : null}
      </div>
    </Section>
  );
}
