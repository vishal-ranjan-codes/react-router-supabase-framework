import { ArrowRight, ExternalLink } from "lucide-react";
import { Link, useLocation } from "react-router";
import { Badge } from "~/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
import {
  type NavLinkItem,
  PRIMARY_NAV_CONFIG,
  type PrimaryNavItem,
} from "~/config/navigation";
import { cn } from "~/lib/utils";

function isItemActive(pathname: string, targetTo: string): boolean {
  if (targetTo.startsWith("/#") || targetTo.startsWith("http")) {
    return false;
  }
  if (targetTo === "/") {
    return pathname === "/";
  }
  return pathname === targetTo || pathname.startsWith(`${targetTo}/`);
}

function hasActiveDescendant(pathname: string, item: PrimaryNavItem): boolean {
  if (item.type === "link") {
    return isItemActive(pathname, item.to);
  }
  if (item.type === "simple-dropdown") {
    return item.items.some((sub) => isItemActive(pathname, sub.to));
  }
  if (item.type === "mega-menu") {
    if (isItemActive(pathname, item.featured.to)) return true;
    return item.groups.some((group) =>
      group.items.some((sub) => isItemActive(pathname, sub.to)),
    );
  }
  if (item.type === "grouped-dropdown") {
    return item.groups.some((group) =>
      group.items.some((sub) => isItemActive(pathname, sub.to)),
    );
  }
  return false;
}

function NavItemLink({ item, active }: { item: NavLinkItem; active: boolean }) {
  const Icon = item.icon;
  const content = (
    <>
      {Icon && (
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background-subtle text-muted-foreground group-hover/nav-item:bg-accent group-hover/nav-item:text-foreground">
          <Icon className="size-4" />
        </span>
      )}
      <div className="flex-1 space-y-0.5">
        <div className="flex items-center gap-1.5 text-sm font-medium leading-tight text-foreground group-hover/nav-item:text-primary">
          <span>{item.label}</span>
          {item.badge && (
            <Badge
              variant={item.badge.variant ?? "secondary"}
              className="px-1.5 py-0 text-[10px]"
            >
              {item.badge.text}
            </Badge>
          )}
          {item.external && (
            <ExternalLink className="size-3 text-muted-foreground" />
          )}
        </div>
        {item.description && (
          <p className="line-clamp-1 text-xs text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </>
  );

  const baseClassName = cn(
    "group/nav-item flex items-start gap-2.5 rounded-md p-2 text-left transition-colors duration-base ease-standard hover:bg-accent focus:bg-accent outline-none",
    active && "bg-accent/60",
  );

  if (item.external) {
    return (
      <a
        href={item.to}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClassName}
      >
        {content}
      </a>
    );
  }

  return (
    <Link to={item.to} className={baseClassName}>
      {content}
    </Link>
  );
}

export function HeaderNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="hidden items-center md:flex" aria-label="Main navigation">
      <NavigationMenu>
        <NavigationMenuList>
          {PRIMARY_NAV_CONFIG.map((item) => {
            const isDescendantActive = hasActiveDescendant(currentPath, item);

            // 1. Direct Flat Link
            if (item.type === "link") {
              const active = isItemActive(currentPath, item.to);
              return (
                <NavigationMenuItem key={item.label}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={item.to}
                      className={cn(
                        "nav-menu-item",
                        active && "text-link font-medium",
                      )}
                    >
                      {item.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            }

            // 2. Mega Menu (Features)
            if (item.type === "mega-menu") {
              const FeaturedIcon = item.featured.icon;
              return (
                <NavigationMenuItem key={item.label}>
                  <NavigationMenuTrigger
                    className={cn(
                      isDescendantActive && "text-link font-medium",
                    )}
                  >
                    {item.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[720px] grid-cols-12 gap-4 p-4">
                      {/* Left: Spotlight Featured Card (4 columns) */}
                      <div className="col-span-4 flex flex-col justify-between rounded-lg border border-border bg-background-subtle p-4 transition-colors duration-base ease-standard hover:border-border-strong">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            {FeaturedIcon && (
                              <div className="flex size-9 items-center justify-center rounded-md border border-border bg-card text-primary shadow-xs">
                                <FeaturedIcon className="size-4" />
                              </div>
                            )}
                            {item.featured.badge && (
                              <Badge variant="outline" className="text-[10px]">
                                {item.featured.badge}
                              </Badge>
                            )}
                          </div>
                          <div>
                            {item.featured.tagline && (
                              <div className="text-[11px] font-medium tracking-wide uppercase text-muted-foreground">
                                {item.featured.tagline}
                              </div>
                            )}
                            <div className="text-sm font-semibold text-foreground">
                              {item.featured.title}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground line-clamp-3">
                              {item.featured.description}
                            </p>
                          </div>
                        </div>
                        <NavigationMenuLink asChild>
                          <Link
                            to={item.featured.to}
                            className="mt-4 flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                          >
                            <span>{item.featured.ctaText ?? "Learn more"}</span>
                            <ArrowRight className="size-3.5" />
                          </Link>
                        </NavigationMenuLink>
                      </div>

                      {/* Right: Categorized Grid (8 columns) */}
                      <div className="col-span-8 grid grid-cols-2 gap-4">
                        {item.groups.map((group) => (
                          <div key={group.title} className="space-y-2">
                            <h4 className="px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                              {group.title}
                            </h4>
                            <ul className="space-y-1">
                              {group.items.map((subItem) => (
                                <li key={subItem.label}>
                                  <NavigationMenuLink asChild>
                                    <NavItemLink
                                      item={subItem}
                                      active={isItemActive(
                                        currentPath,
                                        subItem.to,
                                      )}
                                    />
                                  </NavigationMenuLink>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              );
            }

            // 3. Grouped 2-Column Menu (Resources)
            if (item.type === "grouped-dropdown") {
              return (
                <NavigationMenuItem key={item.label}>
                  <NavigationMenuTrigger
                    className={cn(
                      isDescendantActive && "text-link font-medium",
                    )}
                  >
                    {item.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[520px]">
                      <div className="grid grid-cols-2 gap-4 p-4">
                        {item.groups.map((group) => (
                          <div key={group.title} className="space-y-2">
                            <h4 className="px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                              {group.title}
                            </h4>
                            <ul className="space-y-1">
                              {group.items.map((subItem) => (
                                <li key={subItem.label}>
                                  <NavigationMenuLink asChild>
                                    <NavItemLink
                                      item={subItem}
                                      active={isItemActive(
                                        currentPath,
                                        subItem.to,
                                      )}
                                    />
                                  </NavigationMenuLink>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      {item.footerAction && (
                        <div className="border-t border-border bg-background-subtle px-4 py-2.5">
                          <NavigationMenuLink asChild>
                            <Link
                              to={item.footerAction.to}
                              className="group flex items-center justify-between rounded-sm text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                            >
                              <div>
                                <span className="font-semibold text-foreground">
                                  {item.footerAction.label}:
                                </span>{" "}
                                <span>{item.footerAction.description}</span>
                              </div>
                              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                          </NavigationMenuLink>
                        </div>
                      )}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              );
            }

            // 4. Simple Stacked Dropdown (Company)
            if (item.type === "simple-dropdown") {
              return (
                <NavigationMenuItem key={item.label}>
                  <NavigationMenuTrigger
                    className={cn(
                      isDescendantActive && "text-link font-medium",
                    )}
                  >
                    {item.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="flex w-[260px] flex-col gap-0.5 p-2">
                      {item.items.map((subItem) => (
                        <li key={subItem.label}>
                          <NavigationMenuLink asChild>
                            <NavItemLink
                              item={subItem}
                              active={isItemActive(currentPath, subItem.to)}
                            />
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              );
            }

            return null;
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}
