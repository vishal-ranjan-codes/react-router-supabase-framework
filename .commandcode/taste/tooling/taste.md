# Tooling Preferences

## Package Manager
- Prefers pnpm across projects. Both the Next.js framework and the React Router project use pnpm. Confidence: 0.9

## Frontend Stack
- Uses shadcn/ui component library with new-york style variant. Has 45 components in the Next.js framework being ported. Confidence: 0.95
- Uses Tailwind CSS v4 with custom CSS variables and @utility definitions for design tokens. Confidence: 0.95
- Uses TypeScript across all projects. Confidence: 0.95
- Uses lucide-react for icons. Confidence: 0.85
- Uses class-variance-authority for component variants. Confidence: 0.8

## Backend & Services
- Uses Supabase for backend services (auth, database, storage). Consistent across both Next.js and React Router projects. Uses new publishable/secret key format (not legacy anon/service_role JWTs). Confidence: 0.95
- Uses @supabase/ssr package for server-side Supabase integration. Confidence: 0.9
- Uses Supabase magic link authentication as the primary auth flow. Confidence: 0.85

## Testing
- Uses Vitest for unit/integration testing. Confidence: 0.9
- Uses Playwright for E2E testing. Confidence: 0.9
- Uses happy-dom (not jsdom) as the Vitest test environment. Chosen for React 19 compatibility. Confidence: 0.85
- Uses @testing-library/react and @testing-library/jest-dom for component testing. Confidence: 0.9
- Uses v8 coverage provider with text, json, and html reporters. Confidence: 0.8
- Playwright configured for multi-browser testing (chromium, firefox, webkit). Confidence: 0.85
- Playwright uses `pnpm dev` as the web server command for E2E tests. Confidence: 0.8
- React 19 requires `NODE_ENV=development` in Vitest config for testing (production build doesn't export `act` from `react-dom/test-utils`). Confidence: 0.9

## Deployment
- Targets Cloudflare Workers/Pages for deployment. Excludes `.wrangler/` state directories from version control. Confidence: 0.9
- Uses Vite as the build tool. Confidence: 0.9

## Design System Pattern
- Uses CSS custom properties in :root and .dark blocks for theme tokens. Confidence: 0.9
- Maps design tokens via @theme block for shadcn/ui compatibility. Confidence: 0.85
- Creates custom @utility definitions for project-specific utilities (theme-bg-color, theme-fc-base, etc.). Confidence: 0.85
- All colors in route components MUST use theme tokens (theme-bg-color, theme-fc-base, theme-fc-light, theme-fc-heading, theme-border-color, theme-bg-shade-*, etc.) — never hardcoded Tailwind color classes (e.g., `bg-neutral-950`, `text-neutral-400`). Even admin pages must respect the theme system. Confidence: 0.95
- Uses a Facebook blue color palette with light/dark theme support. Confidence: 0.85
- Inter font family preferred. Confidence: 0.85
