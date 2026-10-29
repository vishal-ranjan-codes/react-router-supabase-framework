import { Link } from "react-router";
import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { IconTile } from "./IconTile";
import type { ReactNode } from "react";

type FeatureCardProps = {
  icon?: ReactNode;
  title: string;
  description: string;
  href?: string;
  className?: string;
};

export function FeatureCard({
  icon,
  title,
  description,
  href,
  className,
}: FeatureCardProps) {
  const card = (
    <Card
      className={cn(
        "gap-4 p-6 transition-[border-color,box-shadow] duration-base ease-standard",
        "hover:border-primary/40 hover:shadow-card",
        className,
      )}
    >
      {icon ? <IconTile tone="muted">{icon}</IconTile> : null}
      <h3 className="text-h4 font-semibold">{title}</h3>
      <p className="text-body text-foreground-muted">{description}</p>
    </Card>
  );

  if (!href) return card;
  return (
    <Link
      to={href}
      className="block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring no-underline"
    >
      {card}
    </Link>
  );
}
