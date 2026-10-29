# Design System Audit

**Date:** 2026-10-27  
**Scope:** `app/globals.css`, `app/components/ui/` (49 files), layout/auth components, `/design-system`, compiled CSS, rendered light/dark UI  
**Method:** source review, fresh production build, computed-style probes in Chromium, contrast math (WCAG 2.2), light/dark screenshots

---

## Verdict

**The foundation is right; the current shape is not scalable yet.**

The token-in-CSS-variables + `.dark` override strategy is the correct idea, and application code is disciplined — there are **zero hard-coded hex/rgb values outside `globals.css`** and the rendered UI is clean in both themes. The problems are concentrated in three places:

1. The **compatibility layer** (`theme-*` color utilities) duplicates shadcn's semantic tokens, wins/loses the cascade unpredictably, and is invisible to `tailwind-merge`.
2. The **token contract is incomplete** — components reference tokens that do not exist (`primary-100`, `sidebar-*`, `white-opacity-*`). Tailwind silently emits nothing, so half a dozen component states are dead.
3. The **shadcn source is deeply forked** (36 of 49 files), so upstream updates become manual 3-way merges.

| Area | Score | Why |
| --- | :---: | --- |
| Token idea / dark-mode strategy | 6/10 | Correct layering idea; duplicated source of truth |
| Token coverage / consistency | 4/10 | Missing tokens, ad-hoc naming, split radius scale |
| Component theming | 3/10 | Deep fork; several variants silently broken |
| Accessibility | 3/10 | Multiple AA contrast failures; invisible focus ring |
| Upgradeability | 3/10 | 36/49 components forked; no diff workflow |
| Documentation / guardrails | 3/10 | No `DESIGN.md`, partial showcase, no visual/contrast tests |

**Overall: 4/10 for long-term scalability — not for visual polish.** This is fixable in place; a rewrite is not required.

---

## Answers at a glance

**1. Did we customise the shadcn components?**  
Yes — and more than customisation. **36 of 49** UI files reference the custom `theme-*` utilities, and several were rewritten beyond theming: `Button` has 9 variants (upstream has 6), `Card`/`Badge` were re-styled, and comments explicitly say "uses theme utilities instead of default shadcn colors". It is a fork, not a skin.

**2. Is the approach good and scalable?**  
The token concept is good; the current implementation is fragile. See the evidence below. The most dangerous property is that **invalid or conflicting classes fail silently** — Tailwind emits nothing and nothing warns you.

**3. Should we change how the design system works?**  
**Re-layer it, don't rewrite it.** Keep CSS variables + `.dark`, but make `@theme` the single source of truth, map the standard shadcn token contract onto brand tokens, and stop inventing a second colour vocabulary.

**4. Is customising components with utility classes / design tokens the right idea?**  
**Theming via design tokens: yes. Rewriting component class strings to a bespoke utility vocabulary: no.** shadcn is designed so you can keep its classes (`bg-primary`, `text-muted-foreground`, `border-border`) and change only the variables they resolve to. That is what makes updates cheap.

**5. Should the utility classes / tokens have been created the way they were?**  
Composition utilities (`container-*`, typography presets) are fine. The **colour** utilities (`theme-fc-*`, `theme-bg-*`, `theme-text-*`) are not: they duplicate `@theme` tokens, beat normal Tailwind utilities, and `cn()` cannot resolve them.

**6. Will this cause problems later?**  
Yes, predictably: upgrade merges, silent visual regressions when composing components, and accessibility failures. All are cheaper to fix now than after more screens depend on them.

---

## What is already good

- **Token discipline in app code.** No hex/rgb literals outside `globals.css`; layout and pages consistently use `theme-fc-*`, `theme-bg-*`, `theme-border-*`, `theme-rounded*`.
- **Dark-mode plumbing is solid.** Pre-paint bootstrap in `app/root.tsx:38-54` avoids a flash, `localStorage` + system preference in `app/lib/theme.ts`, and a single `.dark` var override block. Rendered dark mode looks coherent.
- **The right building blocks are installed.** Tailwind v4, `class-variance-authority`, `cn()`/`tailwind-merge`, Radix primitives, `components.json` with `cssVariables: true` and correct aliases.
- **`data-slot` attributes are preserved** on vendored components — useful for styling and testing.
- **A live documentation route exists** (`/design-system`) and the theme toggle is accessible (`aria-label`).

---

## Findings

### BLOCKER — B1. A large set of classes used by components does not exist in the output

Tailwind v4 only generates colour utilities for keys registered in `@theme`. Variables declared in the plain `:root` block are not theme keys, so classes backed by them are silently dropped. Tokens that were never declared at all are also dropped.

Verified against a fresh production build and with computed styles:

| Class used in code | Emitted? | Computed result | References |
| --- | :---: | --- | --- |
| `bg-primary-100` | **No** | transparent | 12 uses: button, checkbox, input, radio, slider, skeleton, navigation-menu |
| `ring-primary-100` | **No** | ring falls back to `currentColor` | `button.tsx:27` |
| `bg-white-opacity-90/100` | **No** | transparent | `button.tsx:53` (`white` variant) |
| `bg-black-opacity-05/10` | **No** | transparent | `button.tsx:45,49` (`secondary`, `ghost` hover) |
| `border-white-opacity-20/40` | **No** | falls back to default border | `button.tsx:41,60` (`outline`, `outline-white`) |
| `text-white-opacity-80/100` | **No** | inherits text colour | `button.tsx:41,60` |
| `dark:bg-layout-foreground--dark/30` | **No** (typo, double dash) | transparent | `input.tsx:28`, `checkbox.tsx:30` |
| `bg-sidebar-*`, `text-sidebar-*`, `ring-sidebar-*` | **No** (no sidebar tokens defined) | transparent/inherited | 60 references in `sidebar.tsx` |

**Impact:** the `secondary`, `ghost` (hover), `white`, `outline-white` and `outline` dark-state variants do not look as documented. Checked/selected states for checkbox, radio, slider and skeleton are invisible. The sidebar component is unusable as shipped. None of this produces a build error.

**Fix:** either (a) register every colour in `@theme` so the utility is generated, or (b) delete these classes and use standard utilities (`bg-white/90`, `bg-black/5`, `border-white/20`) or the shadcn semantic names. Delete `sidebar.tsx` if it is not part of the starter, or define its 8 tokens.

**Prevention:** a token/class contract test (see Guardrails) and/or a build-time check that every `--color-*` referenced exists in `@theme`.

---

### BLOCKER — B2. The primary button has an invisible keyboard focus indicator

`button.tsx:27` uses `focus-visible:ring-primary-100` + `focus-visible:ring-offset-2`. Because `--color-primary-100` does not exist, the ring colour falls back to `currentColor`; on the primary variant that is **white**, and the offset colour is also **white**.

Measured on the sign-in CTA after keyboard focus:

```
box-shadow: … rgb(255,255,255) 0 0 0 2px, rgb(255,255,255) 0 0 0 4px …
```

White ring + white offset on the white card = no visible indicator. In dark mode the same fallback produces a white halo around the button. Inputs are fine (`theme-ring` resolves to `--color-ring`).

**Fix:** `focus-visible:ring-ring focus-visible:ring-offset-background`, and define `--color-ring` (`#1877F2` is fine for a 3:1 non-text contrast check). Do not use a missing token in a focus style.

---

### BLOCKER — B3. Contrast failures in text and buttons (WCAG 2.2 AA)

Measured ratios:

| Pair | Ratio | AA normal text (4.5:1) | Where |
| --- | :---: | :---: | --- |
| White on `#1877F2` | **4.23** | Fail | default button, badge, active states |
| White on `#4A9FFF` (dark primary) | **2.73** | Fail badly | every primary button in dark mode |
| `#1877F2` text on white/page | **4.23 / 3.88** | Fail | links, "Forgot password?", active nav |
| `#8C8C8C` muted text on `#F5F5F5` | **3.08** | Fail | 78 uses of `theme-fc-light` |
| `#10B981` success text on its 15% tint | **2.21** | Fail | success messages in auth/settings |
| `#262626` on primary (accent hover) | **3.57** | Fail | dropdown/calendar hover |
| White on `#DC2626` destructive | 4.83 | Pass | OK |
| `#4D4D4D` body on page | 7.75 | Pass | OK |

**Fix direction (verified):**

- Keep `#1877F2` for fills/graphics; use a darker blue for **text**, e.g. `#0F5BBE` → 6.44:1 on white.
- For filled buttons on light backgrounds, either darken the fill (`#1160C9` → 5.93:1 with white) or use large/bold text (not the current 14px).
- In dark mode use **dark text** on the light-blue fill: `#0A0A0A` on `#4A9FFF` = 7.25:1.
- Muted text: `#6B6B6B` → 4.89:1 on `#F5F5F5`.
- Success text: `#047857` → 4.77:1 on the tint.

This is the single highest-impact visual change for accessibility, and it can be done entirely in tokens.

---

### BLOCKER — B4. Theme utilities defeat normal Tailwind overrides, and `cn()` cannot resolve them

Custom `@utility` colour classes are emitted **after** core colour utilities in this build, so a component's own theme class wins regardless of the order passed to `cn()`:

```tsx
// design-system.tsx:315 — renders white, not tinted
<Card className="bg-primary/5">
```

Computed background for all three cards: `rgb(255, 255, 255)`. The design-system page's own "Highlighted Card" is not highlighted.

The same happens with typography: `theme-h1` sets `font-size: 2rem` and is emitted after `text-4xl`, so `home.tsx:22`'s `text-4xl` is ignored (32px instead of 36px; the `md:` size wins only because media rules come later).

`tailwind-merge` only knows standard class names, so `cn("theme-fc-heading", "theme-fc-light")` keeps both and CSS order decides. There is no `extendTailwindMerge` configuration in `app/lib/utils.ts`.

**Impact:** composition and page-level overrides are unreliable — the exact thing a design system exists to make predictable. Bugs look like "Tailwind doesn't work".

**Fix:** remove colour utilities from the design system and rely on `bg-primary`, `text-foreground`, `text-muted-foreground`, `border-border`, etc. If any custom utilities remain, configure `extendTailwindMerge` with their groups, and keep colour out of composite utilities like `theme-h1`.

---

### BLOCKER — B5. `accent`, `destructive` and `success` semantics are wrong or missing

In `globals.css`:

```css
--color-accent: var(--color-primary);        /* line 146 */
--color-accent-foreground: var(--color-fc-heading);
```

shadcn's `accent` is a **subtle hover surface**, not the brand colour. Consequences if the components that use it are enabled:

- `focus:bg-accent` on dropdown/menubar items → solid blue highlight (`bg-accent` compiles to `#1877F2`), with `#262626` text at 3.57:1.
- Calendar range start/middle → solid blue blocks.
- `dialog.tsx:66` uses `data-[state=open]:theme-bg-accent`, and `theme-bg-accent` is implemented as `background-color: primary; opacity: .12` (`globals.css:275-278`) — that fades the **whole element**, including text and icon, to 12% opacity.
- `theme-text-accent` (`globals.css:281-283`) sets `accent-foreground` (heading colour), not the accent colour.
- `theme-text-destructive` (`globals.css:289-291`) sets `destructive-foreground` → **white** text. It is used for destructive dropdown items.
- Success has no token at all: `theme-bg-success`/`theme-text-success` hard-code `rgb(16 185 129)` (2.21:1).

**Fix:** define `accent` as a neutral/brand-tinted surface and `accent-foreground` as a readable text colour; delete `theme-bg-accent`/`theme-text-accent`; define `--color-success-*` in `@theme`; fix `theme-text-destructive` to `var(--color-destructive)`.

---

### MAJOR — M1. `@theme` is not the source of truth; the primitives are self-referential

Every primitive token is declared as an alias to itself:

```css
:root { --color-primary: #1877F2; }          /* line 25 */
@theme { --color-primary: var(--color-primary); }  /* line 117 */
```

Tailwind emits `:root,:host{--color-primary:var(--color-primary)}`. It works **only because** the later `:root` literal wins the cascade (verified in the built CSS: theme block at offset 1,743, literal at 77,426). If the block order changes, if the theme is imported differently, or if someone switches to `@theme inline`, the primitive becomes a cyclic reference and resolves to nothing.

It also means tooling (Tailwind IntelliSense, Figma/token sync, CSS inspectors) sees an alias, not the brand value. `--color-primary` is also declared twice inside `@theme` (lines 117 and 140).

**Fix:** put literal values in `@theme`, override the same names under `.dark`. If you want a primitive → semantic split, use `@theme inline` aliases with different names (see Recommended architecture). Never alias a variable to itself.

---

### MAJOR — M2. The shadcn fork is deep, so "update to latest" is expensive

Facts:

- 36 of 49 UI files use the custom `theme-*` utilities.
- `Button` has 9 variants; only 4 are used in the app (`default`, `destructive`, `ghost`, `outline`). `white`, `outline-white`, `primary-dark-white`, `secondary` are unused, and most of the unused ones are broken by B1.
- `Card`, `Badge`, `Input` were re-styled beyond what token remapping would require.
- shadcn has **no npm version to bump**; an "update" means diffing local files against the registry (`npx shadcn@latest diff`) and merging. Every rewritten class is a conflict.
- New registry components assume the standard contract (`bg-accent`, `bg-sidebar`, `text-muted-foreground`, `--radius` scale). With the current gaps, adding components later will introduce more invisible breakage.

**Fix:** treat `app/components/ui` as vendored, theme via tokens, and put only genuinely product-specific variants in a thin wrapper layer. See "Updating shadcn" below.

---

### MAJOR — M3. Naming and scale are internally inconsistent (the code proves it)

- The docs page calls the solid brand colour **"Primary 100"** (`design-system.tsx:43-46`) but the working utility is `bg-primary`. Components then use `bg-primary-100`, which does not exist. The authors were misled by their own naming.
- `fc-*` (font colour), `layout-*` (surface), and a `theme-*` prefix on utilities are three vocabularies for the same semantic space.
- `-dark` means "darker than the base" in light mode and "lighter" in dark mode (`layout-foreground-dark` is `#FAFAFA` then `#242424`); `fc-lighter` gets darker in dark mode.
- Duplicate paths for the same result: `theme-text-muted` and `text-muted-foreground`, `theme-bg-card` and `bg-card`, `theme-ring` and `ring-ring`.
- Radiuses: `--radius: 0.6rem` is never consumed; `--theme-rounded: 10px` is only usable through custom utilities; Tailwind's `rounded-sm/md/lg` still use the stock scale.

**Fix:** one semantic vocabulary, one scale per property. Use the shadcn/Tailwind names as the public API.

---

### MAJOR — M4. Radius is visibly inconsistent

Measured in the running app: Card, Input and Dialog = **10px**, Button and dropdown items = **4px**, Badge = **6px**. On the sign-in screen the button's sharp corners next to 10px inputs and card are noticeable.

The system defines a radius token (`--theme-rounded`) but half the components use Tailwind's stock `rounded-*`, so the token is only partially adopted.

**Fix:** define `--radius-sm/md/lg/xl` in `@theme` and use `rounded-md` etc. everywhere; delete the `theme-rounded*` family (or make it an alias). Decide one scale: e.g. 6 / 10 / 14.

---

### MAJOR — M5. Dead surface: most of the component library is unused, and unused parts are broken

- **29 of 48** component files are never imported: `sidebar`, `calendar`, `dialog`, `dropdown-menu`, `select`, `checkbox`, `radio-group`, `slider`, `switch`, `tabs`, `table`, `textarea`, `popover`, `alert`, `alert-dialog`, `avatar`, `breadcrumb`, `carousel`, `menubar`, `pagination`, `resizable`, `scroll-area`, `hover-card`, `toggle-group`, `toaster`, `form`, `aspect-ratio`, `button-group`, `drawer`, `empty`.
- Several unused custom utilities: `theme-bg-shade-20…100` (9), `theme-rounded-t/b/l/r`, `theme-border-color-light`, `theme-text-secondary`, `theme-primary-btn-gradient`. The `Button` comment promises a gradient that is never applied.
- Unused components still contribute CSS because Tailwind scans them (compiled CSS is ~83 KB uncompressed).

**Impact:** every unused component is a latent trap — the next person adds a Sidebar or Dialog and inherits invisible states.

**Fix:** either remove components the starter does not demonstrate, or keep them and make their tokens real. Don't ship broken defaults. Add an `npm run ui:prune`/documented add-on policy.

---

### MAJOR — M6. No token contract, no state/variant documentation, no visual tests

- No `DESIGN.md`; README's design section is six lines (`README.md:161-169`).
- `/design-system` shows colours, type, cards and two buttons — not the 9 button variants, inputs, focus/disabled/invalid states, badges, dialogs, or dark-mode comparisons.
- The only component test is `button.test.tsx`; there is no visual regression or contrast check.
- The design-system page itself contains a broken example (B4), so the documentation is already out of sync with reality.

**Impact:** the system cannot be trusted as a contract; AI agents and new contributors will copy the broken examples.

---

### MINOR — M7. Typography scale is incomplete

`--text-h1…h6` exist but have no line-height pairs, no body/lead/caption/overline tokens, no responsive/fluid sizing, and `theme-h1…h6` bundle colour and weight into the type utility (coupling typography to surface colour). At mobile width, headings fall back to body line-height (1.5). `theme-h1` also blocks `text-4xl` (B4).

**Fix:** add `--text-h1--line-height` pairs, body/lead/caption tokens, use `clamp()` for display sizes, and keep colour out of type utilities.

---

### MINOR — M8. No spacing, shadow, motion or z-index tokens

Application code uses Tailwind's default spacing, `shadow-xs/sm/lg`, and repeats `transition-all duration-300`/`transition-colors` ad hoc. `prefers-reduced-motion` is handled only for `scroll-behavior` (`globals.css:175-179`), not for transitions. Dark-mode elevation is not specified.

Not urgent for a starter, but if "long term" means multiple apps, these are the next drift points. Add a small token set and a motion rule.

---

### MINOR — M9. Font loading is heavier than it needs to be

`public/fonts/Inter-Variable.ttf` is **855 KB**, loaded with `font-display: swap`, no preload, and `--font-sans` is still the system stack; `font-inter` is a separate class on `<body>`. Recommend WOFF2 (+ subset), a `<link rel="preload">`, and `--font-sans: 'Inter', …` in `@theme` so everything (including portals) inherits it.

---

### MINOR — M10. Small, concrete code bugs worth fixing in the same pass

- `Header.tsx:24` uses `bg-opacity-90`, a Tailwind v3 utility that no longer exists in v4 — the header is not translucent despite `backdrop-blur-sm`.
- `AuthLayout.tsx:25` (`AuthDivider`) uses `theme-bg-color` (page surface) for the label background inside a card (`theme-fg-color`) — when Google/OAuth is enabled, "or continue with" gets a grey patch on white. It should use the card surface.
- `dialog.tsx:58` uses `theme-bg-color` (page surface) for the modal panel, so a light-mode dialog is grey while cards and popovers are white. Popovers/modals should use `bg-popover`/`bg-card`.
- `PasswordForm.tsx:82-99`: the show/hide password icon button has no accessible name and `tabIndex={-1}`, so keyboard users cannot toggle it.
- `Logo.tsx:5`: the link's only child is an `aria-hidden` SVG, so the logo link has no accessible name.
- `MethodSelector.tsx` uses inline styles for the thumb geometry — acceptable — but in dark mode the active thumb (`dark:bg-white/15`) on a `dark:bg-white/10` tray has almost no separation.
- Five UI files use raw Tailwind palette colours (`bg-red-700`, `ring-red-400`, `text-gray-900`, …) instead of tokens.
- `@utility container` (`globals.css:335`) overrides Tailwind's built-in `container`, removing its responsive behaviour for anyone who expects upstream semantics. Rename it (`app-container`) or use `max-w-*` directly.
- `.dark` does not set `color-scheme: dark`, so native scrollbars, form controls and autofill remain light.

---

## Recommended architecture

Keep what works (Tailwind v4, CSS variables, `.dark`, cva, `cn`), and rebuild the contract in three explicit layers.

### 1. Primitives — values only, no aliases

```css
@theme {
  --color-brand-500: #1877f2;   /* fills, graphics */
  --color-brand-600: #1160c9;   /* text / filled button with white text (5.9:1) */
  --color-brand-300: #4a9fff;   /* dark-mode fill */
  --color-ink-900: #262626;
  --color-ink-500: #6b6b6b;     /* 4.9:1 on #f5f5f5 */
  --color-surface-0: #ffffff;
  --color-surface-1: #f5f5f5;
  --color-line: #dfdfdf;
  --color-success-700: #047857;
  --color-danger-600: #dc2626;

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;

  --text-h1: 2rem;
  --text-h1--line-height: 1.15;
  /* h2…h6 + body/lead/caption */
}

:root { --primary-foreground: #ffffff; }

.dark {
  --color-surface-0: #1a1a1a;
  --color-surface-1: #0a0a0a;
  --color-ink-900: #fafafa;
  --color-ink-500: #a0a0a0;
  --color-line: #333333;
  --color-brand-500: #4a9fff;
  --primary-foreground: #0a0a0a; /* dark text on light-blue fill (7.25:1) */
  color-scheme: dark;
}
```

### 2. shadcn contract — aliases only, never new values

```css
@theme inline {
  --color-background: var(--color-surface-1);
  --color-foreground: var(--color-ink-900);
  --color-card: var(--color-surface-0);
  --color-card-foreground: var(--color-ink-900);
  --color-popover: var(--color-surface-0);
  --color-popover-foreground: var(--color-ink-900);
  --color-primary: var(--color-brand-500);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--color-surface-1);
  --color-secondary-foreground: var(--color-ink-900);
  --color-muted: var(--color-surface-1);
  --color-muted-foreground: var(--color-ink-500);
  --color-accent: var(--color-surface-1);        /* subtle hover surface */
  --color-accent-foreground: var(--color-ink-900);
  --color-destructive: var(--color-danger-600);
  --color-border: var(--color-line);
  --color-input: var(--color-line);
  --color-ring: var(--color-brand-500);

  --color-sidebar: var(--color-surface-0);
  --color-sidebar-foreground: var(--color-ink-900);
  --color-sidebar-primary: var(--color-brand-500);
  --color-sidebar-accent: var(--color-surface-1);
  --color-sidebar-border: var(--color-line);
  --color-sidebar-ring: var(--color-brand-500);

  --radius-lg: var(--radius-md);
  --radius-md: var(--radius-sm);
}
```

This is the shadcn v4 pattern: `@theme inline` so utilities resolve to runtime variables, primitives in `@theme`, dark mode re-points primitives only. With this in place, **upstream shadcn classes work untouched**: `bg-card`, `bg-accent`, `text-muted-foreground`, `border-input`, `ring-ring`, `bg-sidebar`.

### 3. Application utilities — composition only

Keep a small, documented set: `container-*`, maybe `text-h1` style presets. **Do not** add colour utilities — they are already available as `bg-*`/`text-*`/`border-*` and are understood by `tailwind-merge`. If you keep any custom utility that can conflict with a core one, extend `tailwind-merge` in `app/lib/utils.ts`.

### Component rule of thumb

| Need | Where it goes |
| --- | --- |
| Brand colour, radius, type | Tokens in `@theme` / `.dark` |
| Standard component look | Upstream shadcn classes, untouched |
| App-wide variation (e.g. CTA gradient) | A token or a thin wrapper |
| One-off product variant | A named variant in a local wrapper, documented + tested |
| One screen's tweak | `className` with standard utilities (and it must win) |

---

## Updating shadcn with this model

1. **Treat `app/components/ui/` as vendored.** No edits; it stays formatted and lint-excluded as it is now.
2. **Theme through variables.** Because the standard classes resolve to your tokens, an upstream component update is a file replace, not a merge.
3. **Put brand-only variants in a wrapper**, e.g. `app/components/brand/button.tsx`:
   ```tsx
   import { Button, buttonVariants } from "~/components/ui/button";
   // extend variants here; leave the vendored file pristine
   ```
4. **Record the baseline** (registry date / component list) in `.docs/shadcn.md`, and run `npx shadcn@latest diff <component>` before updating. Add new components with `add`; they will pick up the brand automatically.
5. **If a vendored file must change**, keep the diff to the smallest possible hunk and record why in the same doc. That is what makes future updates tractable.
6. **Add the tokens new components expect** (`sidebar-*`, `chart-*`, radius scale) before adding those components.

With the current fork, an update means re-porting dozens of class changes across 36 files. With the model above, most files never change.

---

## Migration plan

**Phase 0 — stop the bleeding (1–2 days)**
1. Define or replace missing classes: `primary-100`, `white-opacity-*`, `black-opacity-*`, `layout-foreground--dark`, sidebar tokens.
2. Fix the focus ring (`ring-ring` + `ring-offset-background`).
3. Fix `accent`, `accent-foreground`, `theme-bg-accent`, `theme-text-accent`, `theme-text-destructive`, success tokens.
4. Contrast pass: brand text token, dark-mode primary foreground, muted text, success.
5. Fix the `/design-system` highlighted card and the false gradient claim.
6. Remove or repair unused broken variants/components.

**Phase 1 — remove the parallel vocabulary (3–5 days)**
1. Add the shadcn contract in `@theme inline`; move literals into `@theme`; delete self-references.
2. Delete colour `theme-*` utilities; migrate app code to `bg-primary`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-card`.
3. Revert untouched vendored components to upstream; keep brand variants in wrappers.
4. Unify the radius scale; standardise on `rounded-*`.
5. Configure `tailwind-merge` only if any conflicting custom utility remains.

**Phase 2 — make it enforceable (1–2 weeks)**
1. Author `DESIGN.md`: token tables, usage rules, variant matrix, do/don't.
2. Expand `/design-system` to render every variant and state (default/hover/focus/disabled/invalid/loading) in both themes.
3. Add Playwright screenshot tests for `/design-system` and `/sign-in` (light/dark).
4. Add a contrast test over token pairs (4.5:1 text, 3:1 UI/focus).
5. Add a token contract test: fail if a class references an undeclared `--color-*`, or if the compiled CSS is missing a manifest of design-system classes.
6. Add typography line-heights, spacing/shadow/motion tokens, and reduced-motion handling.

Estimated effort: **Phase 0: 1–2 days; Phase 1: 3–5 days; Phase 2: 1–2 weeks** for one developer familiar with the code.

---

## Guardrails worth adding

- **`DESIGN.md`** as the contract (the design-review skills expect it; it also gives AI agents a source of truth).
- **Token contract test** (Vitest): compile the CSS and assert a manifest such as `bg-primary`, `text-muted-foreground`, `bg-accent`, `ring-ring`, `bg-sidebar` are present; assert no `--color-*` reference is undefined.
- **Contrast test** (Vitest or axe): compute token pairs from the CSS variables; fail under 4.5:1.
- **Visual regression** (Playwright): `/design-system` + `/sign-in` in light/dark, 1–2 viewports.
- **Upgrade check** (CI or manual pre-release): `npx shadcn@latest diff` on touched components.
- **Lint for classes**: `app/components/ui` being lint-excluded is fine for upstream code, but app code should not introduce arbitrary colour classes; a small custom Biome/regex rule or review checklist can catch `*-opacity-#####` / undefined-token patterns.
- **Document the baseline**: shadcn version/date + intentional local divergences.

---

## Acceptable exceptions (not debt)

- Raw values inside `globals.css` are correct — that is the token file.
- `bg-black/5`, `bg-white/10` for neutral overlays are fine; they are core Tailwind and theme-aware with `dark:`.
- Inline geometry in `MethodSelector.tsx` is reasonable for a dynamic segmented control; it is documented with a comment.
- Keeping extra shadcn components in a starter can be intentional. If so, they must compile to working states, or be behind a documented "add when needed" policy.
- Upstream hard-coded reds/grays in a few vendored files are inherited; fix them only when you touch those files.

---

## Coverage limits

- No `DESIGN.md`, Figma, Storybook, or `design.qa.yaml` existed, so the audit is based on source, compiled CSS and rendered UI.
- The design-debt automation script could not run (missing `fast-glob` dependency); findings are manual and computed-style based.
- Screenshots covered `/design-system` and `/sign-in` at 1440px, light and dark; mobile/responsive and unused components were assessed statically.
- Contrast values are sRGB calculations; no full axe run was performed.
- I did not modify the design system — this report is diagnostic.

---

## References

- [shadcn/ui — Theming](https://ui.shadcn.com/docs/theming)
- [shadcn/ui — components.json](https://ui.shadcn.com/docs/components-json)
- [Tailwind CSS v4 — Theme variables](https://tailwindcss.com/docs/theme)
- [WCAG 2.2 — Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
