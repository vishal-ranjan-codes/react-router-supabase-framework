import { Link } from "react-router";

interface RouteErrorBoundaryProps {
  error: unknown;
  /** Where "Try again" sends the user. */
  retryHref: string;
}

export function RouteErrorBoundary({
  error,
  retryHref,
}: RouteErrorBoundaryProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-h2 mb-2">Something went wrong</h1>
        <p className="text-muted-foreground mb-4">
          {import.meta.env.DEV && error instanceof Error
            ? error.message
            : "Please try again."}
        </p>
        <Link to={retryHref} className="text-link hover:underline">
          Try again
        </Link>
      </div>
    </div>
  );
}
