# Deviations from upstream shadcn/ui

`app/components/ui/**` is upstream-owned. Do not hand-edit these files except to add or update an
entry below.

Re-vendor with the pinned CLI, then re-apply every deviation and re-format:

```bash
npx shadcn@4.23.0 add <component> --overwrite --yes
npx biome format --write app/components/ui app/hooks
```

The CLI resolves the `~` alias from `compilerOptions.paths` in the root `tsconfig.json`. If that
mapping is missing it silently writes to a literal `~/components/ui/` folder in the project root.

Components import `cn` from the `cn` package and primitives from the unified `radix-ui` package;
both are direct dependencies. App code keeps using `cn` from `~/lib/utils`, which additionally
registers the contract's type scale with tailwind-merge.

## Deviations

| File               | Change                                      | Why                                                                                                                                                                                                  |
| ------------------ | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dialog.tsx`       | content surface `bg-background` → `bg-card` | in this token contract `--background` is the page canvas, not the raised-surface colour                                                                                                              |
| `sheet.tsx`        | content surface `bg-background` → `bg-card` | same                                                                                                                                                                                                 |
| `alert-dialog.tsx` | content surface `bg-background` → `bg-card` | same                                                                                                                                                                                                 |
| `drawer.tsx`       | content surface `bg-background` → `bg-card` | same                                                                                                                                                                                                 |
| `sonner.tsx`       | never vendored; local file                  | upstream imports `next-themes`, which this framework does not use. It reads the theme from `~/lib/theme` and its inline style variables point at Tier-2 tokens. Phase 4 completes the token restyle. |

## Removed upstream files

| File                                               | Why                                                                    |
| -------------------------------------------------- | ---------------------------------------------------------------------- |
| `toast.tsx`, `toaster.tsx`, `~/hooks/use-toast.ts` | deprecated upstream island, unreferenced; `sonner` is the toast system |

## Mechanical transform applied to every vendored file

`npx biome format --write` — the repo formats vendored components (semicolons, 80 columns), as it
did before the re-vendor. Whitespace only; no behaviour change.

Nothing else may differ from upstream.
