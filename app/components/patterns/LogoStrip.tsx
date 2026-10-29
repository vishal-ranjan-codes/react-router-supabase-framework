import { cn } from "~/lib/utils";

type LogoStripProps = {
  items: { label: string }[];
  className?: string;
};

export function LogoStrip({ items, className }: LogoStripProps) {
  return (
    <ul
      className={cn("flex flex-wrap items-center gap-x-10 gap-y-3", className)}
    >
      {items.map((item) => (
        <li
          key={item.label}
          className="text-body-sm font-semibold uppercase tracking-wide text-foreground-muted"
        >
          {item.label}
        </li>
      ))}
    </ul>
  );
}
