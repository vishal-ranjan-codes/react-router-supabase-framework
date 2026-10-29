import { ArrowLeft, LayoutDashboard, Menu, Shield, Users } from "lucide-react";
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
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
import { requireAdmin } from "~/middleware/chains";
import type { Route } from "./+types/admin-layout";

export const middleware: Route.MiddlewareFunction[] = requireAdmin;

export function meta() {
  return [{ title: "Admin Panel" }];
}

export async function loader({ context }: Route.LoaderArgs) {
  const user = context.get(userContext);
  return { user };
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <RouteErrorBoundary error={error} retryHref="/admin" />;
}

export default function AdminLayout({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/users", label: "Users", icon: Users },
  ];

  const sidebarNav = (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-5 w-5 text-link" />
          <h2 className="text-lg font-bold text-foreground">Admin Panel</h2>
        </div>
        <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
              location.pathname === to
                ? "bg-background-subtle text-foreground font-medium"
                : "text-muted-foreground hover:bg-background-subtle hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-border pt-4 mt-4">
        <Link
          to="/dashboard"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-background-subtle hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to App
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Mobile sidebar trigger */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild className="lg:hidden fixed top-4 left-4 z-50">
          <Button variant="ghost" size="icon" className="size-touch-min">
            <Menu className="size-icon-md" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[260px] bg-sidebar text-sidebar-foreground p-4 flex flex-col"
        >
          <SheetHeader className="p-0">
            <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
          </SheetHeader>
          {sidebarNav}
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-border bg-sidebar text-sidebar-foreground p-4 flex-col">
        {sidebarNav}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto bg-background">
        <div className="lg:hidden h-10" />
        <Outlet />
      </main>
    </div>
  );
}
