# Deferred major upgrades

Measured with `npm outdated` on 2026-10-25. Every minor and patch that was available at
that date is already installed; the nine entries below are **majors**, deliberately not
applied as part of the maintenance sweep because each one needs a decision or a second
change elsewhere, not just a version bump.

Nothing here is urgent. The current pins are supported, and the framework's gates
(`npm run check`, `typecheck`, `test`, `build`) are green on them.

| Package                  | Installed | Latest | Why it waits                                                                                                                                                                                              |
| ------------------------ | --------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `typescript`             | 5.9.3     | 7.0.2  | TS 7 is the native compiler port. `tsc -b` over three solution-style projects plus `react-router typegen` output has to be re-verified before switching; expect config fallout, not code fallout.         |
| `vitest`                 | 4.1.12    | 5.0.5  | Must move **together** with `@vitest/coverage-v8` — they declare each other as peers, and mixing majors is what produced the peer warning this repo just removed.                                         |
| `@vitest/coverage-v8`    | 4.1.12    | 5.0.5  | Same as above: bump in the same commit as `vitest`.                                                                                                                                                       |
| `happy-dom`              | 20.14.6   | 21.0.4 | The test environment. `tests/setup.ts` shims `localStorage` and `matchMedia` around the current version's gaps; re-check whether those shims are still needed after the bump.                             |
| `lucide-react`           | 0.474.0   | 1.61.0 | Imported by 24 first-party files. v1 dropped/renamed a batch of icons, so this is a find-and-replace pass over real call sites, not a version bump.                                                       |
| `react-day-picker`       | 9.14.0    | 10.0.2 | Only reachable through the vendored `app/components/ui/calendar.tsx`. Take it by re-adding the calendar from shadcn so the component and the library move together.                                       |
| `react-resizable-panels` | 3.0.6     | 4.15.0 | Same shape: only used by the vendored `app/components/ui/resizable.tsx`. Refresh that component in the same change.                                                                                       |
| `zod`                    | 3.25.76   | 4.6.7  | v4 renamed the error surface (`error.errors` / `flatten()` → `z.treeifyError()` etc.). Cheap to take **because nothing in `app/` imports it yet** — see "Unwired dependencies" in `tooling-decisions.md`. |
| `@types/node`            | 22.20.5   | 26.6.5 | Should track the runtime, not the registry. `.nvmrc` says Node 24, so the honest next step is `^24`, not `^26`.                                                                                           |

## How to take one

One package (or one coupled pair) per branch, so a bisect can point at it:

```bash
npm i -D typescript@7 && npm run check && npm run typecheck && npm test && npm run build
```

`npm run check` catches the formatting/type-shape drift, and the build catches the
Cloudflare-side regressions that unit tests cannot see.

## Version pairs that must not drift

- `vitest` ↔ `@vitest/coverage-v8` ↔ `@vitest/ui` if added — keep identical ranges.
- `.nvmrc` ↔ `@types/node` ↔ `engines.node` in `package.json`.
- `wrangler` ↔ `@cloudflare/vite-plugin` — the plugin shells out to wrangler for the
  workerd runtime, and `wrangler types` regenerates `worker-configuration.d.ts`. After
  either changes, re-run `npm run cf-typegen`.
- Vendored shadcn components ↔ the Radix/`react-day-picker`/`react-resizable-panels`
  versions they wrap — update with `npx shadcn@latest add <component>` rather than by
  bumping the library alone.
