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

| File                  | Change                                                                                                                                                                                                                                    | Why                                                                                                                                                                                                                                                   |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dialog.tsx`          | content surface `bg-background` → `bg-card`; content motion `duration-200` → `duration-base`                                                                                                                                              | in this token contract `--background` is the page canvas, not the raised-surface colour; motion comes from the contract's `--transition-duration-*` palette                                                                                           |
| `sheet.tsx`           | content surface `bg-background` → `bg-card`; content motion `ease-in-out` → `ease-standard`, `data-[state=closed]:duration-300` → `duration-base`, `data-[state=open]:duration-500` → `duration-slow`                                     | same; upstream's 300/500ms sit outside the contract palette (fast 120 / base 200 / slow 360), and the open-slower-than-close asymmetry is preserved by mapping open → `slow`                                                                          |
| `alert-dialog.tsx`    | content surface `bg-background` → `bg-card`; content motion `duration-200` → `duration-base`                                                                                                                                              | same                                                                                                                                                                                                                                                  |
| `drawer.tsx`          | content surface `bg-background` → `bg-card`                                                                                                                                                                                               | same                                                                                                                                                                                                                                                  |
| `navigation-menu.tsx` | trigger style: upstream's filled pill (`h-9 bg-background px-4 py-2 text-sm font-medium hover:bg-accent …`) → `nav-menu-item …` plus the focus-visible ring; chevron drops `ml-1`/`top-[1px]` so `gap-1` sets the text-to-chevron spacing | dropdown triggers must be typographically identical to the plain header links (`nav-menu-item px-3`); upstream's fill assumes the bar sits on `--background`, which here is the page canvas, so the pill rendered as a grey box beside unfilled links |
| `table.tsx`           | scroll container gains `role="region" aria-label="Table" tabIndex={0}`                                                                                                                                                                    | upstream's `overflow-x-auto` div is not keyboard-reachable, so a table wider than its container scrolls only with a pointer (WCAG 2.1.1); axe reports it as `scrollable-region-focusable`                                                             |
| `button.tsx`          | focus chain: gains `focus-visible:ring-offset-2 focus-visible:ring-offset-ring-offset`; gains on-dark variants `white`, `white-secondary`, `white-outline` | separates focus ring from solid primary/brand fill; satisfies the >= 3:1 focus chain rule without altering the single brand hue; on-dark variants provide accessible contrast on dark hero and brand-deep surfaces without muddy gray fills |
| `sonner.tsx`          | never vendored; local file                                                                                                                                                                                                                | upstream imports `next-themes`, which this framework does not use. It reads the theme from `~/lib/theme` and every inline style variable points at a Tier-2 token (no literal hex).                                                                   |

## Removed upstream files

| File                                               | Why                                                                    |
| -------------------------------------------------- | ---------------------------------------------------------------------- |
| `toast.tsx`, `toaster.tsx`, `~/hooks/use-toast.ts` | deprecated upstream island, unreferenced; `sonner` is the toast system |

## Mechanical transform applied to every vendored file

`npx biome format --write` — the repo formats vendored components (semicolons, 80 columns), as it
did before the re-vendor. Whitespace only; no behaviour change.

Nothing else may differ from upstream.
