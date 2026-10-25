import { Form, Link, useLocation, useRouteLoaderData } from "react-router";
import { Button } from "~/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
import type { SessionUser } from "~/lib/context";
import { cn } from "~/lib/utils";
import Logo from "./Logo";
import MobileNav from "./MobileNav";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const location = useLocation();
  // root's loader runs supabaseMiddleware, so even these public pages know the signed-in user.
  const rootData = useRouteLoaderData<{ user: SessionUser | null }>("root");
  const user = rootData?.user ?? null;

  return (
    <header className="sticky top-0 z-50 theme-fg-color theme-border-color border-b backdrop-blur-sm bg-opacity-90">
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Site Title */}
          <div className="flex items-center gap-3">
            <Logo />
            <Link
              to="/"
              className="theme-fc-heading hover:text-primary transition-colors"
            >
              <span className="font-semibold text-lg hidden sm:inline">
                Framework
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      <ListItem href="/" title="Introduction">
                        Quick overview of the framework and its features
                      </ListItem>
                      <ListItem href="/design-system" title="Design System">
                        Comprehensive design tokens and components
                      </ListItem>
                      <ListItem href="/" title="Installation">
                        Step-by-step setup instructions
                      </ListItem>
                      <ListItem href="/" title="Configuration">
                        Environment variables and project setup
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[600px] md:grid-cols-2">
                      <ListItem
                        href="/design-system#components"
                        title="Form Elements"
                      >
                        Inputs, selects, checkboxes, and more
                      </ListItem>
                      <ListItem
                        href="/design-system#components"
                        title="Navigation"
                      >
                        Menus, breadcrumbs, and tabs
                      </ListItem>
                      <ListItem
                        href="/design-system#components"
                        title="Feedback"
                      >
                        Alerts, toasts, and dialogs
                      </ListItem>
                      <ListItem
                        href="/design-system#components"
                        title="Data Display"
                      >
                        Tables, cards, and badges
                      </ListItem>
                      <ListItem href="/design-system#colors" title="Colors">
                        Full color palette and usage
                      </ListItem>
                      <ListItem
                        href="/design-system#typography"
                        title="Typography"
                      >
                        Text styles and hierarchy
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Examples</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4">
                      <ListItem href="/about" title="About Page">
                        Example page with hero and content sections
                      </ListItem>
                      <ListItem href="/contact" title="Contact Page">
                        Form layout and validation patterns
                      </ListItem>
                      <ListItem href="/design-system" title="Design System">
                        Complete design system documentation
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link
              to="/about"
              className={cn(
                "nav-menu-item px-3",
                location.pathname === "/about" && "text-primary",
              )}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={cn(
                "nav-menu-item px-3",
                location.pathname === "/contact" && "text-primary",
              )}
            >
              Contact
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <>
                <Button
                  variant="default"
                  size="sm"
                  asChild
                  className="hidden sm:inline-flex"
                >
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                <Form method="post" action="/sign-out">
                  <Button
                    variant="ghost"
                    size="sm"
                    type="submit"
                    className="hidden sm:inline-flex"
                  >
                    Sign Out
                  </Button>
                </Form>
              </>
            ) : (
              <>
                <Button
                  variant="default"
                  size="sm"
                  asChild
                  className="hidden sm:inline-flex"
                >
                  <Link to="/sign-in">Sign In</Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="hidden sm:inline-flex"
                >
                  <Link to="/sign-up">Sign Up</Link>
                </Button>
              </>
            )}
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}

const ListItem = ({
  className,
  title,
  children,
  href,
  ...props
}: {
  className?: string;
  title: string;
  children: React.ReactNode;
  href: string;
}) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={href}
          className={cn(
            "block select-none space-y-1 theme-rounded p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/8 hover:text-accent-foreground focus:bg-primary/8",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium theme-fc-heading leading-none mb-1">
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug theme-fc-light">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};
