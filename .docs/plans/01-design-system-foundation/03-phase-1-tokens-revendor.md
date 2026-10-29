# Phase 1 — Token contract + re-vendor (PR 1)

**Closes:** design-system-audit token/contrast/component findings; pattern-audit P4 (via neutral
`--accent`); supplies `--surface-brand` for phase 3.
**Read first:** `README.md`, `01-context.md`, `02-token-contract.md`.
**Depends on:** nothing. **Blocks:** phase 2.

## 1. Rewrite `app/globals.css`

Structure, top to bottom:

1. `@import "tailwindcss";` + `@import "tw-animate-css";` + `@custom-variant dark (&:is(.dark *));`
2. `:root { … }` — Tier 1 primitive ramps and Tier 2 light semantics, exactly as
   `02-token-contract.md` §3–§4 and §6. Hex appears **only** here and in `.dark`.
3. `.dark { … }` — Tier 2 dark remapping (same key set).
4. `@theme inline { … }` — Tier 3 mapping (§5 of the contract). No self-references
   (`--color-x: var(--color-x)` is banned); every entry is `var(--<tier-2-name>)` or a literal for
   non-colour scales.
5. `@layer base { … }`:
   ```css
   * { @apply border-border outline-ring/50; }
   html { scroll-behavior: smooth; }
   body { @apply bg-background text-foreground font-sans antialiased; }
   h1,h2,h3,h4,h5,h6 { @apply text-foreground; }
   ::selection { @apply bg-selection text-selection-foreground; }
   @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
   ```
   Headings get colour from the base layer so `text-h1` is a *size* token only.
6. Composition utilities (layout, not palette):
   ```css
   @utility container-page  { @apply mx-auto w-full max-w-7xl px-4 sm:px-7; }
   @utility container-max-sm   { @apply mx-auto w-full max-w-lg  px-4 sm:px-7; }
   @utility container-max-tab  { @apply mx-auto w-full max-w-3xl px-4 sm:px-7; }
   @utility container-max-md   { @apply mx-auto w-full max-w-4xl px-4 sm:px-7; }
   @utility container-max-lg   { @apply mx-auto w-full max-w-5xl px-4 sm:px-7; }
   @utility container-max-xl   { @apply mx-auto w-full max-w-7xl px-4 sm:px-7; }
   @utility box { @apply rounded-lg border border-border bg-card; }
   @utility nav-menu-item { @apply text-muted-foreground no-underline p-1.5 text-base md:text-sm transition-all duration-300 hover:text-primary; }
   ```
   `container` is renamed to `container-page` (overriding Tailwind's built-in is a footgun); update
   the two call sites (Header, Footer).
7. **Temporary shim** so pages keep rendering until phase 2 deletes it:
   ```css
   /* TEMPORARY — phase 2 deletes this block. */
   @utility theme-bg-color      { background-color: var(--background); }
   @utility theme-bg-color-dark { background-color: var(--muted); }
   @utility theme-fg-color      { background-color: var(--card); }
   @utility theme-fg-color-dark { background-color: var(--card); }
   @utility theme-fc-heading    { color: var(--foreground); }
   @utility theme-fc-heading-light { color: var(--foreground); }
   @utility theme-fc-base       { color: var(--foreground); }
   @utility theme-fc-light      { color: var(--muted-foreground); }
   @utility theme-fc-lighter    { color: var(--muted-foreground); }
   @utility theme-text-muted    { color: var(--muted-foreground); }
   @utility theme-text-secondary{ color: var(--secondary-foreground); }
   @utility theme-text-accent   { color: var(--accent-foreground); }
   @utility theme-bg-accent     { background-color: var(--accent); }   /* fixes the opacity bug */
   @utility theme-bg-secondary  { background-color: var(--secondary); }
   @utility theme-bg-muted      { background-color: var(--muted); }
   @utility theme-bg-card       { background-color: var(--card); }
   @utility theme-bg-popover    { background-color: var(--popover); }
   @utility theme-bg-destructive{ background-color: var(--destructive); }
   @utility theme-text-destructive { color: var(--destructive); }      /* fixes white-text bug */
   @utility theme-bg-success    { background-color: var(--success-subtle); }
   @utility theme-text-success  { color: var(--success); }
   @utility theme-border-color  { border-color: var(--border); }
   @utility theme-border-color-light { border-color: var(--border); }
   @utility theme-border-input  { border-color: var(--input); }
   @utility theme-ring          { --tw-ring-color: var(--ring); }
   @utility theme-rounded     { border-radius: var(--radius-lg); }
   @utility theme-rounded-sm  { border-radius: var(--radius-sm); }
   @utility theme-bg-shade-5  { background-color: rgb(0 0 0 / 5%); }
   @utility theme-bg-shade-10 { background-color: rgb(0 0 0 / 10%); }
   @utility button-hover-darker { &:hover { background-color: var(--primary-hover); } }
   ```
   `theme-h1…h6` shims become size + line-height only (colour/weight dropped).
   Keep `@keyframes accordion-*`.

Everything else in today's file — 26 opacity vars, `theme-bg-shade-*`, `button-hover-*` inset-shadow
hacks, `theme-primary-btn-gradient`, the `opacity: 0.12` utility — is deleted.

## 2. Register the type scale with tailwind-merge

`app/lib/utils.ts`:
```ts
import { extendTailwindMerge } from "tailwind-merge";
const twMerge = extendTailwindMerge({
  extend: { classGroups: { "font-size": [{ text: ["display","h1","h2","h3","h4","h5","h6","body-lg","body","body-sm","body-xs","eyebrow"] }] } },
});
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
```

## 3. Re-vendor all components

```bash
npm i tw-animate-css
npm i -D shadcn@4.23.0          # pinned: upgrades become deliberate
npx shadcn@4.23.0 add accordion alert alert-dialog aspect-ratio avatar badge \
  breadcrumb button button-group calendar card carousel checkbox dialog drawer \
  dropdown-menu empty form hover-card input input-otp label menubar navigation-menu \
  pagination popover radio-group resizable scroll-area select separator sheet sidebar \
  skeleton slider switch table tabs textarea toggle toggle-group tooltip \
  --overwrite --yes
```

Run on a branch; inspect `git status` first. Expected writes: `app/components/ui/*` + lockfile.
**Revert any edit the CLI makes to `app/globals.css`** (it sometimes appends its own `@theme inline`).

Delete the deprecated unused island (verified unreferenced):
`app/components/ui/toast.tsx`, `app/components/ui/toaster.tsx`, `app/hooks/use-toast.ts`.

`sonner.tsx` is **excluded** (upstream imports `next-themes`, which we don't use); keep the local
`~/lib/theme` adaptation and restyle it in phase 4.

## 4. Documented deviations → `app/components/ui/PATCHES.md`

1. `dialog.tsx`, `sheet.tsx`, `alert-dialog.tsx`, `drawer.tsx`: content surface
   `bg-background` → `bg-card` (here `--background` is the page colour, not the surface colour).
2. `sonner.tsx`: kept local for theme integration.
3. `navigation-menu.tsx`: trigger reuses `nav-menu-item` instead of upstream's filled pill so
   dropdown triggers stay typographically identical to the plain header links. Added after
   acceptance: the pre-revendor vendored file carried this normalization locally and
   `add --overwrite` wiped it silently — which is why every deviation must live in `PATCHES.md`.
No other file may differ from upstream.

## 5. Button variant policy

Keep upstream variants. Delete any variant whose only use was the old tint (audit found
ghost/outline/default/destructive in use). Focus is `focus-visible:ring-ring/50
focus-visible:border-ring` — the old `ring-primary-100` referenced a token that never existed and
rendered an invisible ring.

## 6. Acceptance (PR 1)

- [x] `npm run lint && npm run typecheck && npm run build` green. (typecheck + build clean; the one
  remaining `biome lint` error is `useSemanticElements` in `app/components/auth/MethodSelector.tsx`,
  uncommitted work-in-progress that phase 2 migrates — phase 1 must not touch that file.)
- [x] `git diff app/components/ui` shows only the four `bg-card` lines + `sonner.tsx` + the
  `navigation-menu.tsx` trigger line, all listed in `PATCHES.md`.
- [x] Compiled CSS contains `bg-card`, `bg-popover`, `ring-ring`, `border-input`, `bg-success-subtle`,
  `text-h1`, `text-display`, `animate-in`, `rounded-lg`, `shadow-card`.
- [x] No `--color-x: var(--color-x)` in the compiled or source CSS.
- [x] Pages still render correctly in both themes (shim active).
- [x] `tests/design-tokens.test.ts` skeleton added with the pair manifest from `02` §7 green for the
  pairs already verified; remaining pairs flagged for phase 5 completion.
