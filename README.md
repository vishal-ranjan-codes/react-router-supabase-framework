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
| `npm test`                          | Vitest, 236 tests incl. 55 contrast pairs            |
| `npm run test:coverage`             | Vitest with v8 coverage                              |
| `npm run test:e2e`                  | Playwright (starts the dev server itself)            |
| `npm run lint` / `format` / `check` | Biome — `check` is lint + format + import order      |
| `npm run check:ds`                  | 9 design-system guardrails; needs `npm run build`    |
| `npm run ds:drift`                  | which vendored components upstream has changed       |
| `npm run ds:add`                    | re-vendor a component, overwriting local edits       |
| `npm run deploy`                    | build + `wrangler deploy`                            |

The pre-commit reflex for any change in this repo:

```bash
npm run check && npm run typecheck && npm test && npm run build && npm run check:ds
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
  lib/design-system.ts   the machine-readable token contract (see DESIGN.md)
  components/            ui/ (vendored shadcn) · patterns/ (9 recipes) · layout/ · auth/ · error/
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
npm run test:e2e                # every project; add -- --project=chromium|visual for one
```

The browser suite is three files: `e2e/theme.spec.ts` (the toggle and the choice it stores),
`e2e/a11y.spec.ts` (axe on every public route in both themes, failing on `serious`/`critical`)
and `e2e/visual.spec.ts` (20 screenshots plus the structural claims the contract makes). The
baselines live under `e2e/__screenshots__/{platform}/` and were rendered on `windows-latest`,
so that is the only runner allowed to compare against them — font rasterisation differs per OS,
and the Ubuntu job therefore runs `--project=chromium` and never looks at pixels.

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

**[`DESIGN.md`](DESIGN.md) is the contract.** [`AGENTS.md`](AGENTS.md) is the seven-rule excerpt an AI
tool reads first. This section is only the map.

Three tiers, one direction, all in `app/globals.css`:

```
Tier 1  --p-neutral-*, --p-brand-*, …   primitives — the only hex in the repo, theme-invariant
Tier 2  --background, --card, --link    semantics — :root and .dark remap the same name
Tier 3  @theme inline                   utilities — bg-card, text-h2, shadow-card: what you write
```

`@theme inline` (not `@theme`) is what makes dark mode work without a token ever referencing itself:
`.bg-card` emits `background-color: var(--card)`, so `.dark` wins. The deleted pre-v2 `theme-*` shim
(`theme-bg-color`, `theme-fc-base`, `theme-h1`) is gone, and guardrail rule 4 fails CI if it returns.

Pick a surface by role, never by eye — the full table is `DESIGN.md` §2:

| You mean                | Write                                                                  |
| ----------------------- | ---------------------------------------------------------------------- |
| the page itself         | `bg-background` (or `Section tone="page"`)                             |
| slightly darker, static | `bg-background-subtle`                                                 |
| raised panel            | `bg-card border border-border shadow-card`                             |
| menu / dialog / toast   | `bg-popover`, with `bg-scrim` behind it                                |
| hovered or selected     | `bg-accent` + `text-accent-foreground` — neutral, not an accent colour |
| the one emphasis band   | `Section tone="brand-deep"`, once per page                             |

There is exactly one chromatic hue. Brand is punctuation; the only large brand surface is one
full-bleed `Section tone="brand-deep"` per page. Build pages from the nine recipes in
`app/components/patterns/` and wrap `app/components/ui/` rather than editing it.

`ThemeToggle` + `app/lib/theme.ts` persist `light`/`dark`/`system` in `localStorage`, and a blocking
script in `app/root.tsx` applies the stored choice before first paint. `:root` is mirrored onto
`.light` so a subtree can opt out of an ancestor `.dark` — that is how the style guide paints both
themes side by side.

Everything above is machine-checked. `app/lib/design-system.ts` describes the contract once, and
`npm test` (55 WCAG pairs × 2 themes), `npm run check:ds` (9 rules) and the `/design-system` route all
read that same file — so the page cannot teach a usage the tests disagree with.

---

Built with React Router 8, Supabase and Cloudflare Workers.
