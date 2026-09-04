# Coding Style Preferences

## Path Aliases
- Uses `~/` path alias mapping to `./app/` directory (React Router convention), equivalent to `@/` in Next.js. Confidence: 0.9

## TypeScript Style
- Uses strict TypeScript configuration with explicit type definitions. Confidence: 0.85
- Prefers explicit type annotations over inference for key structures (e.g., `type Env`, `interface Database`). Confidence: 0.8
- Uses `satisfies` operator for type-safe route configuration. Confidence: 0.8
- Uses React Router 8's generated route types (`Route.ActionArgs`, `Route.LoaderArgs`, `Route.ComponentProps`) instead of generic types (`ActionFunctionArgs`, `LoaderFunctionArgs`) from "react-router". This preserves context type safety for middleware-injected values. Confidence: 0.9

## Component Patterns
- Follows shadcn/ui component patterns with CVA variants and forwardRef (or React 19 equivalents). Confidence: 0.85
- Uses React Router's `createContext` API for type-safe context passing instead of prop drilling. Confidence: 0.85
- Prefers request-scoped clients (one per request) for server-side operations, but singleton/cached instances for browser-side clients. Confidence: 0.85

## Architecture Patterns
- Prefers middleware-based auth patterns where middleware runs before route loaders/actions. Confidence: 0.85
- Uses layout-level middleware for route protection with nested middleware chains. Confidence: 0.85
- Separates concerns: context.ts for type definitions, middleware files for auth logic, route files for UI/data. Confidence: 0.8
- Middleware should gracefully degrade when external service credentials are missing—store `null` in context and continue rather than throwing errors. Downstream routes check for null and show appropriate messages. Confidence: 0.9
- Non-admin users visiting admin routes should be redirected to the user dashboard, not shown a 403 error—this hides the existence of admin routes. Confidence: 0.85
- Prefers defensive null guards (`if (!supabase)`) over TypeScript non-null assertions (`supabase!`) in route loaders and actions. Standardized across all route files. Confidence: 0.9

## Environment & Configuration
- Uses .dev.vars for Cloudflare Workers local development environment variables. Confidence: 0.85
- Exposes only public env vars (SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY) to client via script tag in root layout. Uses a root loader to fetch env vars server-side, then accesses them via `useLoaderData()` in Layout (never accesses `process.env` directly in components that render on the client). Never exposes secret/service-role keys. Confidence: 0.9
- Defines environment type interfaces in dedicated files (e.g., `app/lib/env.ts`) with explicit string types for each variable, including optional fields for future phases. Confidence: 0.8
- Creates placeholder database type files (e.g., `database.types.ts`) with a scaffolded Supabase Database type including Row/Insert/Update shapes, even before the schema is finalized. Confidence: 0.8
