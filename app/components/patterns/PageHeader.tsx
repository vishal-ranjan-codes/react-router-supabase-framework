import type { ReactNode } from "react";
import { Section } from "./Section";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  className,
}: PageHeaderProps) {
  return (
    <Section size="sm" className={className}>
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
      </div>
    </Section>
  );
}
