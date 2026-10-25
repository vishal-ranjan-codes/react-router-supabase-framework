# React Router 8 + Supabase + Cloudflare Workers — starter

A batteries-included starting point for production React Router apps that run as a single
Cloudflare Worker: SSR + streaming, Supabase auth through route middleware, R2 uploads,
webhook signature verification, cron handlers, a shadcn-based design system and a test stack
that actually guards the wiring.

- **React Router 8** in framework mode (routes, loaders, actions, `middleware`)
- **Cloudflare Workers** with `@cloudflare/vite-plugin`, so `npm run dev` executes the real
  workerd runtime — not a Node shim — and `env` comes from `cloudflare:workers`
- **Supabase** via `@supabase/ssr`: exactly one server client per request, one
  `auth.getClaims()` per request, cookies written by middleware
- **Vitest** (unit + component) and **Playwright** (e2e), **Biome** for lint/format
- Works with **npm or pnpm** — both lockfiles are committed and both are tested in CI

`.docs/` explains the decisions: [tooling](.docs/tooling-decisions.md),
[auth methods](.docs/auth-methods.md), [deferred majors](.docs/deferred-major-upgrades.md).

## Requirements

Node `>=22.12` (`.nvmrc` pins 24 — CI reads that file) and either npm 11+ or pnpm 10+.

## Quick start

```bash
npm install                # or: pnpm install
cp .dev.vars.example .dev.vars   # then fill in what you actually have
npm run dev                # or: pnpm dev  → http://localhost:5173
```

`.dev.vars` is gitignored and is what workerd loads as your local secrets. Everything works
without real credentials except auth: `/sign-in` answers `503 Authentication is not
configured`, which is intentional — the app boots, and the failure is explicit.

For type-accurate `env`, regenerate after changing `wrangler.jsonc`:

```bash
npm run cf-typegen    # writes worker-configuration.d.ts (gitignored)
```

## Scripts

| Command                             | What it does                                         |
| ----------------------------------- | ---------------------------------------------------- |
| `npm run dev`                       | dev server inside workerd, HMR included              |
| `npm run build`                     | framework build (`build/client` + `build/server`)    |
| `npm run preview`                   | build, then serve the production bundle              |
| `npm run typecheck`                 | `wrangler types` + `react-router typegen` + `tsc -b` |
| `npm test`                          | Vitest, 113 tests                                    |
| `npm run test:coverage`             | Vitest with v8 coverage                              |
| `npm run test:e2e`                  | Playwright (starts the dev server itself)            |
| `npm run lint` / `format` / `check` | Biome — `check` is lint + format + import order      |
| `npm run deploy`                    | build + `wrangler deploy`                            |

The pre-commit reflex for any change in this repo:

```bash
npm run check && npm run typecheck && npm test && npm run build
```

## Layout

```
app/
  routes.ts              route table (typed; `npm run typecheck` regenerates ./+types/*)
  routes/                pages + api/* endpoints, colocated *.test.ts(x) next to them
  middleware/            supabase · auth · cors · rate-limit · chains (requireAuth/requireAdmin)
  lib/auth/              config.ts = the only place to change the auth surface
  lib/supabase/          server context, admin client, optional browser client
  lib/r2/                S3 client + object-key validation
  lib/webhooks.ts        HMAC-SHA256 `t=,v1=` verification
  components/            ui/ (vendored shadcn) · auth/ · layout/
workers/app.ts           Worker entry: fetch() → createRequestHandler, scheduled() → cron
e2e/                     Playwright specs
tests/helpers/           doubles that let actions and middleware be called directly
```

Request flow: `workers/app.ts` → `createRequestHandler` → root middleware (installs the
Supabase client into `supabaseContext`) → route `middleware` → loader/action → middleware
unwinds and appends `Set-Cookie`. Actions use `throw redirect(...)` precisely so that unwind
happens; returning a redirect early would drop the refreshed session cookies.

## Authentication

Four methods ship, and each is one boolean away:

```ts
// app/lib/auth/config.ts
methods: { emailPassword: true, emailOtp: true, magicLink: false, google: false }
```

`email-password` and `email-otp` are on by default; `magic-link` and `google` are fully
implemented but off. **Do not delete an unused method** — read
[.docs/auth-methods.md](.docs/auth-methods.md) first. Flags are enforced in the UI _and_ in
each action, and tests cover every panel so nothing can rot into dead code.

Enabling Google needs `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` in both Supabase's OAuth app
and `.dev.vars` (plus `wrangler secret put` in production), and `<origin>/auth/callback` in
Supabase's redirect allow-list.

## Storage (R2)

`POST /api/upload` (auth required) accepts a `file` field, rejects anything over 5 MB and any
mime type not in the allow-list, and generates the stored name — the client's `file.name` is
never trusted. `GET /api/download/:key` streams it back with a safe `Content-Disposition`.

This path uses `@aws-sdk/client-s3` deliberately, so it also works against any S3-compatible
store. Set `CLOUDFLARE_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`,
`R2_BUCKET_NAME`, optional `R2_PUBLIC_DOMAIN`. The native `r2_buckets` binding is the
alternative if you never need to leave Cloudflare.

## Webhooks

`POST /api/webhooks` verifies `x-webhook-signature: t=<unix-seconds>,v1=<hex>` (HMAC-SHA256
over `<t>.<raw body>`, constant-time compare, replay window enforced). Set it with:

```bash
wrangler secret put WEBHOOK_SECRET
```

A configured secret is required: the route answers `503` rather than silently accepting
unsigned payloads.

## Cron

`wrangler.jsonc` registers `0 * * * *` and `0 0 * * *`, dispatched by `scheduled()` in
`workers/app.ts`. `handleCronJob` is where your real work goes; it no-ops without Supabase
credentials.

## Testing

```bash
npm test                        # unit + component, happy-dom, no network
npx playwright install          # once, before the first e2e run
npm run test:e2e                # chromium/firefox/webkit locally, chromium only in CI
```

The suite leans on `tests/helpers/route.ts` and `tests/helpers/middleware.ts`, which call
actions and middleware directly instead of booting a server — that is what makes the auth
matrix cheap to cover. `app/routes/auth-surface.test.tsx` renders the real panels via
`createRoutesStub`.

## Deploy

```bash
npm run deploy          # react-router build && wrangler deploy
```

Runtime secrets go through `wrangler secret put <NAME>` (or the dashboard) — never into
`wrangler.jsonc`, whose text vars are visible in the dashboard. Only `VITE_*` values may live
in `.env`, and only if you genuinely want them inlined into the public bundle.

## npm and pnpm

Both are supported and both are verified in CI. `package.json` has **no** `packageManager`
field so neither tool is forced on a fork. Two dependencies run install scripts (`esbuild`,
`workerd`) and both are allow-listed twice, once per tool: `allowScripts` in `package.json`
(npm) and `onlyBuiltDependencies` in `pnpm-workspace.yaml` (pnpm 10+). See
[.docs/tooling-decisions.md](.docs/tooling-decisions.md#dual-package-manager-support).

## Design system

`app/globals.css` holds the tokens as Tailwind v4 theme variables (`--color-primary`,
`--color-fc-*`, `--color-layout-*`, `--radius`) with a `.dark` override, and exposes them
through `@utility` classes — `theme-bg-color`, `theme-fc-base`, `theme-h1`…`theme-h4`, `box`,
`container-max-md` — so a layout never hard-codes a hex. `ThemeToggle` +
`app/lib/theme.ts` persist `light`/`dark`/`system` in `localStorage`, and a blocking script in
`app/root.tsx` applies the stored choice before first paint. Primitives live in
`app/components/ui/` (shadcn; lint-excluded, still formatted) and `/design-system` documents
them on a live page.

---

Built with React Router 8, Supabase and Cloudflare Workers.
