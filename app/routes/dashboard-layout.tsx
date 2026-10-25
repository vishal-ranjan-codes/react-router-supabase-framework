import { LayoutDashboard, LogOut, Menu, Settings, User } from "lucide-react";
import { useState } from "react";
import { Form, Link, Outlet, useLocation } from "react-router";
import { RouteErrorBoundary } from "~/components/error/RouteErrorBoundary";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { userContext } from "~/lib/context";
import { requireAuth } from "~/middleware/chains";
import type { Route } from "./+types/dashboard-layout";

export const middleware: Route.MiddlewareFunction[] = requireAuth;

export function meta() {
  return [{ title: "Dashboard" }];
}

export async function loader({ context }: Route.LoaderArgs) {
  const user = context.get(userContext);
  return { user };
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <RouteErrorBoundary error={error} retryHref="/dashboard" />;
}

export default function DashboardLayout({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  const sidebarNav = (
    <>
      <div className="mb-6">
        <h2 className="theme-h4">Dashboard</h2>
        <div className="flex items-center gap-2 mt-2">
          <User className="h-4 w-4 theme-fc-light" />
          <p className="text-sm theme-fc-light truncate">{user?.email}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
              location.pathname === to
                ? "theme-bg-shade-10 theme-fc-heading font-medium"
                : "theme-fc-base hover:theme-bg-shade-5"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t theme-border-color pt-4 mt-4">
        <Form
          method="post"
          action="/sign-out"
          onSubmit={() => setSidebarOpen(false)}
        >
          <button
            type="submit"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm theme-fc-light hover:theme-bg-shade-5 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </Form>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen theme-bg-color">
      {/* Mobile sidebar trigger */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild className="lg:hidden fixed top-4 left-4 z-50">
          <Button variant="ghost" size="icon" className="w-9 h-9">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[260px] theme-fg-color p-4 flex flex-col"
        >
          <SheetHeader className="p-0">
            <SheetTitle className="sr-only">Dashboard Navigation</SheetTitle>
          </SheetHeader>
          {sidebarNav}
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 theme-border-color border-r theme-fg-color p-4 flex-col">
        {sidebarNav}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="lg:hidden h-10" />
        <Outlet />
      </main>
    </div>
  );
}
