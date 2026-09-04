import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useLoaderData,
} from "react-router";

import type { Route } from "./+types/root";
import stylesheet from "./globals.css?url";
import Header from "~/components/layout/Header";
import Footer from "~/components/layout/Footer";
import { Toaster } from "~/components/ui/sonner";
import { initTheme } from "~/lib/theme";
import { useEffect } from "react";

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export function loader() {
  return {
    env: {
      SUPABASE_URL: process.env.SUPABASE_URL || "",
      SUPABASE_PUBLISHABLE_KEY: process.env.SUPABASE_PUBLISHABLE_KEY || "",
    },
  };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { env } = useLoaderData<typeof loader>();

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.env = ${JSON.stringify(env)}`,
          }}
        />
      </head>
      <body className="theme-bg-color theme-fc-base font-inter antialiased min-h-screen flex flex-col">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const location = useLocation();

  useEffect(() => {
    initTheme();
  }, []);

  const isAuthPage = location.pathname.startsWith("/sign-in") ||
                     location.pathname.startsWith("/sign-up") ||
                     location.pathname.startsWith("/auth/verify-otp");
  const isAdminPage = location.pathname.startsWith("/admin");

  if (isAdminPage) return <Outlet />;

  return (
    <>
      {!isAuthPage && <Header />}
      <main className="flex-1"><Outlet /></main>
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
    <main className="pt-16 p-4 container mx-auto">
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
