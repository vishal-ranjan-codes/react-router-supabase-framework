import { Form, Link, useRouteLoaderData } from "react-router";
import { Button } from "~/components/ui/button";
import type { SessionUser } from "~/lib/context";
import { HeaderNav } from "./HeaderNav";
import Logo from "./Logo";
import MobileNav from "./MobileNav";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  // root's loader runs supabaseMiddleware, so even these public pages know the signed-in user.
  const rootData = useRouteLoaderData<{ user: SessionUser | null }>("root");
  const user = rootData?.user ?? null;

  return (
    <header className="sticky top-0 z-sticky border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container-page">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
            {/* The breakpoint lives on the link, not the span: a zero-size link
                would stay in the tab order with no visible focus indicator. */}
            <Link
              to="/"
              aria-label="Framework"
              className="hidden text-foreground transition-colors hover:text-link sm:inline"
            >
              <span className="text-lg font-semibold">Framework</span>
            </Link>
          </div>

          <HeaderNav />

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
