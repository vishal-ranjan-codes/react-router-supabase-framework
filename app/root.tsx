import { useEffect } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";
import Footer from "~/components/layout/Footer";
import Header from "~/components/layout/Header";
import { Toaster } from "~/components/ui/sonner";
import { authClaimsContext } from "~/lib/supabase/context";
import { initTheme } from "~/lib/theme";
import { supabaseMiddleware } from "~/middleware/supabase";
import type { Route } from "./+types/root";
import stylesheet from "./globals.css?url";

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

// Every render route gets a Supabase client and verified claims, so public pages can show real
// auth state (Header) without requiring a session.
export const middleware: Route.MiddlewareFunction[] = [supabaseMiddleware];

export function loader({ context }: Route.LoaderArgs) {
  const claims = context.get(authClaimsContext);

  return {
    user: claims ? { id: claims.sub, email: claims.email ?? null } : null,
  };
}

// Runs before the first paint, so the stored preference wins over the server HTML. This mirrors
// applyTheme() in ~/lib/theme; keep the two in step.
const themeBootstrap = `
  try {
    var stored = localStorage.getItem("theme") || "system";
    var dark = stored === "dark" ||
      (stored === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
  } catch {}
`;

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static string above, no interpolation */}
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
        <Meta />
        <Links />
      </head>
      <body className="theme-bg-color theme-fc-base font-inter antialiased min-h-screen flex flex-col">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// Auth screens render without the marketing header/footer.
const AUTH_PATH_PREFIXES = ["/sign-in", "/sign-up", "/auth/"];

export default function App() {
  const location = useLocation();

  useEffect(() => initTheme(), []);

  const isAuthPage = AUTH_PATH_PREFIXES.some((prefix) =>
    location.pathname.startsWith(prefix),
  );
  const isAdminPage = location.pathname.startsWith("/admin");

  if (isAdminPage) return <Outlet />;

  return (
    <>
      {!isAuthPage && <Header />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isAuthPage && <Footer />}
      <Toaster />
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container-page mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
