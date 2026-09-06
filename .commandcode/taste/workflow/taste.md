# Workflow Preferences

## Project Setup Pattern
- Maintains template/framework projects that serve as starting points for new projects. Has a Next.js Supabase framework, now creating a React Router Supabase framework. Confidence: 0.95
- Keeps reference projects available during development for cross-referencing design systems and patterns. Confidence: 0.9
- Copies design systems and component libraries between projects rather than creating new ones, adapting only framework-specific imports. Confidence: 0.9

## Planning Approach
- Creates detailed markdown plan files (PLAN.md, PHASE-X.md) before implementation begins. Confidence: 0.95
- Prefers phased implementation with verification checklists per phase. Each phase file includes a verification checklist. Confidence: 0.9
- Documents key architectural decisions in plan files. Confidence: 0.85
- Creates comparison tables showing differences between source and target frameworks. Confidence: 0.8

## File Organization
- Uses PHASE-N-NAME.md naming convention for phase-specific plan documents. Confidence: 0.9
- Maintains separate plan files per phase rather than one monolithic document. Confidence: 0.85
- Uses standard project structure: app/ for application code, lib/ for utilities, components/ for UI, middleware/ for auth logic. Confidence: 0.85
- Unit tests are co-located with source files (e.g., `app/lib/utils.test.ts` next to `app/lib/utils.ts`). Confidence: 0.9
- E2E tests live in a separate top-level `e2e/` directory, not co-located with source. Confidence: 0.9
- Test setup files go in a top-level `tests/` directory (e.g., `tests/setup.ts`). Confidence: 0.85
- Wants plan files stored in the project root's `plans/` directory (e.g., `project-root/plans/`), NOT in tool-managed directories like `.commandcode/plans/`. Expects files to be in the project's own directory structure. Confidence: 0.95
- Expects explicit file location instructions to be followed precisely. Expressed frustration when told twice to put files in the root folder but they were placed elsewhere. Confidence: 0.95
- Excludes planning/scratch folders (`plans/`) from version control via .gitignore — internal planning docs are project-local, not for the repo. Confidence: 0.9
- Prefers GitHub for hosting project repos, creating them via `gh repo create` with `--public` flag for framework/starter projects. Confidence: 0.85

## Framework Architecture
- For framework/starter projects, clearly separates implementation phases (what the framework builds) from reference documentation (guides for downstream users). Deployment and testing phases are reference docs, not framework build steps. Confidence: 0.9
- Frameworks should include deployment and testing documentation to help future developers/AI agents, but not implement those steps during framework development itself. Confidence: 0.9
- Starter frameworks must work as functional websites without any API credentials connected. Auth-dependent features (sign-in, dashboards) gracefully degrade when credentials are missing—showing "not configured" messages instead of crashing. Confidence: 0.95
- Dashboard boilerplate in starter frameworks should be minimal—just enough structure (sidebar, overview, settings) to serve as a starting point, since the downstream project is unknown. Confidence: 0.85
- Uses user roles (e.g., `user`, `admin`) stored in a profiles table with RLS policies. New sign-ups get default `user` role via database trigger; admin roles are manually assigned only (no sign-up flow for admins). Confidence: 0.9

## Phase Transition Workflow
- Before implementing the next phase, audits ALL previously completed phases against the latest documentation and deprecation notices of every dependency. Searches the web and reads official docs to find breaking changes, then updates plan files with corrections before implementation begins. Confidence: 0.9
- When auditing completed phases, wants a structured implementation plan with prioritized issues (critical/medium/low) written out before any fixes are applied. Expects the plan to include specific file paths, what to change, and verification steps. Confidence: 0.9
- After code changes are implemented (especially during audit fixes), explicitly requests that all corresponding plan files be updated to reflect the actual implementation. Plans and code must stay in sync — outdated plan documentation is unacceptable. Confidence: 0.95

## Development Style
- Prefers to scaffold and configure all tooling (Tailwind, TypeScript, Vite, Wrangler) before writing application code. Confidence: 0.85
- Installs all needed dependencies early in the process rather than adding them incrementally. Confidence: 0.8
- Uses verification checklists to confirm each phase is complete before proceeding. Confidence: 0.85
- Expects agent to autonomously read all plan files and codebase context, then implement an entire phase without seeking intermediate approval. Confidence: 0.9
- Verification workflow: runs `pnpm typecheck` during implementation to catch errors, then `pnpm build` as final confirmation that the phase compiles correctly. Confidence: 0.85
- Expects post-implementation verification that goes beyond typecheck/build — wants the agent to read all implementation files, cross-check against the plan document, verify naming consistency across related files (env.ts, .env.example, wrangler.jsonc, middleware interfaces), and fix issues autonomously rather than just reporting them. Confidence: 0.9
- Uses todo/task tracking to progress through multi-file implementations, updating status as each sub-task completes. Confidence: 0.8
- Comfortable delegating file cleanup and restructuring decisions to the assistant—explicitly authorizes deleting, rearranging, and trimming unnecessary files (e.g., downloaded font bundles with extras). Confidence: 0.85

## Testing Workflow
- Prefers to run all tests that don't require external service connections first (unit tests, typecheck, static analysis), deferring integration/E2E tests that need third-party services (Supabase, auth) until those services are available. Tests the maximum possible surface area offline before integration testing. Confidence: 0.9

## CI/CD
- Uses GitHub Actions for CI/CD workflows. Confidence: 0.9
- CI workflow runs typecheck, unit tests with coverage, and E2E tests. Uploads Playwright report as artifact. Confidence: 0.85
- Standard test script naming: `test` (vitest), `test:ui` (vitest --ui), `test:coverage` (vitest --coverage), `test:e2e` (playwright test), `test:e2e:ui` (playwright test --ui), `lint` (eslint). Confidence: 0.85

## Debugging & Issue Investigation
- When encountering issues, asks for root cause analysis (WHY it's happening) before jumping to fixes. Prefers to understand the problem fully before seeking solutions. Confidence: 0.9
- Wants to know the environment scope of an issue — whether it's dev-only (localhost) or will also affect production (deployed site) — before deciding how to prioritize and fix it. Confidence: 0.9

## UI Implementation
- Dashboard/admin sidebars must be mobile-responsive using Sheet/drawer components (shadcn/ui Sheet), hidden on `lg:` breakpoint with a hamburger toggle. Confidence: 0.9
