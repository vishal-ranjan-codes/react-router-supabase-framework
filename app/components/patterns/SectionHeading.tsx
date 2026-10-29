import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  align?: "left" | "center";
  aside?: ReactNode;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  aside,
  className,
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div
      className={cn(
        "mb-10 flex flex-wrap items-end justify-between gap-6",
        centered && "flex-col items-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", centered && "mx-auto text-center")}>
        {eyebrow ? (
          <p className="text-eyebrow uppercase text-foreground-muted">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-2 text-h2 font-semibold tracking-tight text-balance">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 text-body-lg text-foreground-muted">
            {description}
          </p>
        ) : null}
      </div>
      {aside}
    </div>
  );
}
