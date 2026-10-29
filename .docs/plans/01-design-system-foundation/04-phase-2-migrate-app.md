# Phase 2 — Migrate app code, delete the shim (PR 2)

**Closes:** design-system-audit "parallel vocabulary" finding; pattern-audit P3 (component tints).
**Read first:** `README.md`, `02-token-contract.md` §4–5, this file.
**Depends on:** phase 1. **Blocks:** phase 3.

## 1. Codemod

`scripts/migrate-theme-utilities.mjs` — mechanical string replace over `app/**/*.tsx` with
`--dry-run` and a per-file diff. One input class → one output class, no judgement. Brand-tint
surfaces and blur blobs are **not** in this table; phase 3 owns them.

| Old | New | Note |
| --- | --- | --- |
| `theme-bg-color` | `bg-background` | |
| `theme-bg-color-dark` | `bg-muted` | darker band / hover fill |
| `theme-fg-color`, `theme-fg-color-dark` | `bg-card` | |
| `theme-fc-heading`, `theme-fc-heading-light` | `text-foreground` | |
| `theme-fc-base` | `text-foreground` | |
| `theme-fc-light` | `text-muted-foreground` | ~78 uses |
| `theme-fc-lighter` | `text-foreground-subtle` | decorative only |
| `theme-text-muted` | `text-muted-foreground` | |
| `theme-text-secondary` | `text-secondary-foreground` | |
| `theme-text-accent` | `text-accent-foreground` | |
| `theme-bg-accent` | `bg-accent` | fixes the whole-element opacity bug |
| `theme-bg-secondary` | `bg-secondary` | |
| `theme-bg-muted` | `bg-muted` | |
| `theme-bg-card` | `bg-card` | |
| `theme-bg-popover` | `bg-popover` | |
| `theme-bg-destructive` | `bg-destructive` | |
| `theme-text-destructive` | `text-destructive` | fixes the white-text bug |
| `theme-bg-success` | `bg-success-subtle` | |
| `theme-text-success` | `text-success` | |
| `theme-border-color` | `border-border` | |
| `theme-border-color-light` | `border-border-subtle` | |
| `theme-border-input` | `border-input` | |
| `theme-ring` | `ring-ring` | |
| `theme-rounded` | `rounded-lg` | |
| `theme-rounded-sm` | `rounded-sm` | |
| `theme-rounded-t/b/l/r` | `rounded-t-lg` / … | |
| `theme-h1`…`theme-h6` | `text-h1`…`text-h6` | size only; colour inherited |
| `theme-bg-shade-5`, `theme-bg-shade-10` | `bg-background-subtle` | |
| `box` | keep | now token-based |
| `button-hover-darker` | `hover:bg-primary-hover` | |
| `container` | `container-page` | Header, Footer only |

## 2. Manual review required

- `app/routes/home.tsx:22` — `theme-h1 text-4xl md:text-5xl lg:text-6xl` becomes a font-size
  conflict; intent is a responsive hero, so use `text-4xl md:text-5xl lg:text-6xl` alone here.
  (Phase 3 rewrites the file anyway; keep this minimal.)
- `app/routes/home.tsx:43`, `about.tsx:34` — blur blobs: **leave untouched**; phase 3 deletes them.
- `app/routes/dashboard-layout.tsx:100`, `admin-layout.tsx:95` — sidebar surface →
  `bg-sidebar text-sidebar-foreground` so the sidebar tokens are exercised.
- `app/routes/design-system.tsx` — codemod only; phase 5 rewrites it.
- `app/components/auth/MethodSelector.tsx` — **pre-existing uncommitted user work** (segmented pill
  control with an inline-style thumb). Preserve the mechanics; migrate only its colour classes:
  `bg-black/5 dark:bg-white/10` → `bg-muted`, thumb `bg-white dark:bg-white/15` →
  `bg-card shadow-sm dark:bg-white/25`.
- `app/components/layout/Header.tsx:24` — `bg-opacity-90` is Tailwind v3 syntax (no-op). Replace
  `theme-fg-color … bg-opacity-90` with `bg-card/80 backdrop-blur-md`. (Phase 3 refreshes the rest.)
- `app/components/auth/AuthLayout.tsx:25` — divider label uses page background inside a card →
  `bg-card`.
- Any `bg-primary/<n>` left after the codemod is phase 3's; do not hand-fix here.

## 3. Delete the shim

Remove the entire TEMPORARY block from `globals.css` (including the `theme-h*` shims). The CI check
added in phase 5 fails the build on any `theme-` class in `app/**/*.tsx`, so the vocabulary cannot
return.

## 4. Acceptance (PR 2)

- [ ] `grep -rn "theme-" app --include=*.tsx` → zero hits.
- [ ] Visual diff of `/`, `/about`, `/contact`, `/design-system`, `/sign-in`, `/sign-up` light + dark:
  no layout shift, no white-on-white, no grey patch behind the OAuth divider.
- [ ] `npm run build` CSS shrinks materially (shade rules, radius family, ~45 colour utilities gone).
- [ ] `MethodSelector` still behaves identically (it is uncommitted user work — do not reformat it).
