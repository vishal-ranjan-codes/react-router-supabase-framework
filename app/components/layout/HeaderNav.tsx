import { Link, useLocation } from "react-router";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
import { cn } from "~/lib/utils";

export type NavEntry = { label: string; to: string; description: string };
export type NavItem = { label: string; to?: string; entries?: NavEntry[] };

/** Single source of truth for public navigation; MobileNav consumes it too. */
export const NAV_ITEMS: NavItem[] = [
  { label: "Docs", to: "/design-system" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export function HeaderNav() {
  const location = useLocation();
  const dropdowns = NAV_ITEMS.filter((item) => item.entries?.length);
  const links = NAV_ITEMS.filter((item) => item.to);

  return (
    <nav className="hidden items-center gap-1 md:flex">
      <NavigationMenu>
        <NavigationMenuList>
          {dropdowns.map((item) => (
            <NavigationMenuItem key={item.label}>
              <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px]">
                  {item.entries?.map((entry) => (
                    <li key={`${entry.to}${entry.label}`}>
                      <NavigationMenuLink asChild>
                        <Link
                          to={entry.to}
                          className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent"
                        >
                          <div className="mb-1 text-sm font-medium leading-none text-foreground">
                            {entry.label}
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {entry.description}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      {links.map((item) => (
        <Link
          key={item.label}
          to={item.to as string}
          className={cn(
            "nav-menu-item",
            location.pathname === item.to && "text-link",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
