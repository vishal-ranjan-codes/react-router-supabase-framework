import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router";
import type { Route } from "./+types/admin-layout";
import { supabaseMiddleware } from "~/middleware/supabase";
import { adminMiddleware } from "~/middleware/auth";
import { userContext } from "~/lib/context";
import {
  LayoutDashboard,
  Users,
  ArrowLeft,
  Shield,
  Menu,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

// Middleware chain: Supabase client → Admin auth check
export const middleware: Route.MiddlewareFunction[] = [
  supabaseMiddleware,
  adminMiddleware,
];

export function meta() {
  return [{ title: "Admin Panel" }];
}

export async function loader({ context }: Route.LoaderArgs) {
  const user = context.get(userContext);
  return { user };
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return (
    <div className="flex min-h-screen items-center justify-center theme-bg-color">
      <div className="text-center">
        <h1 className="theme-h2 mb-2">Something went wrong</h1>
        <p className="theme-fc-light mb-4">
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
        <a href="/admin" className="text-primary hover:underline">
          Try again
        </a>
      </div>
    </div>
  );
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
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold theme-fc-heading">Admin Panel</h2>
        </div>
        <p className="text-sm theme-fc-light truncate">{user?.email}</p>
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
                : "theme-fc-light hover:theme-bg-shade-5 hover:theme-fc-heading"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t theme-border-color pt-4 mt-4">
        <Link
          to="/dashboard"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm theme-fc-light hover:theme-bg-shade-5 hover:theme-fc-heading transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to App
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen theme-bg-color theme-fc-heading">
      {/* Mobile sidebar trigger */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild className="lg:hidden fixed top-4 left-4 z-50">
          <Button variant="ghost" size="icon" className="w-9 h-9">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[260px] theme-fg-color p-4 flex flex-col">
          <SheetHeader className="p-0">
            <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
          </SheetHeader>
          {sidebarNav}
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 border-r theme-border-color theme-fg-color p-4 flex-col">
        {sidebarNav}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto theme-bg-color">
        <div className="lg:hidden h-10" />
        <Outlet />
      </main>
    </div>
  );
}
