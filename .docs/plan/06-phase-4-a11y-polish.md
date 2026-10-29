# Phase 4 — Accessibility, font and polish (PR 4)

**Closes:** design-system-audit a11y findings; public-pages-audit L10 (type scale in use).
**Read first:** `README.md`, `02-token-contract.md` §6–7.
**Depends on:** phase 3. **Blocks:** phase 8.

1. **Password visibility toggle** (`PasswordForm.tsx:84`) — remove `tabIndex={-1}`; add
   `aria-label={showPassword ? "Hide password" : "Show password"}` and
   `aria-pressed={showPassword}`.
2. **Logo** (`Logo.tsx`) — the link contains only an `aria-hidden` SVG; add
   `<span className="sr-only">Home</span>`.
3. **Icon-only controls** — audit `ThemeToggle` (labelled), `MobileNav` trigger, dialog/sheet close
   (upstream ships `sr-only Close`); add names where missing.
4. **Focus visibility** — after re-vendor, controls use `focus-visible:ring-ring/50
   focus-visible:border-ring`. Verify on primary, ghost, outline, destructive, link and
   `MethodSelector`.
5. **Touch targets** — icon controls use `size-icon-*` tokens; primary mobile actions ≥
   `--size-touch-min` (2.75rem); WCAG 2.2 floor is 24px.
6. **Font** — replace `public/fonts/Inter-Variable.ttf` (855 KB) with `InterVariable.woff2`
   (official rsms/inter release) and preload it in `app/root.tsx` links:
   `{ rel: "preload", href: "/fonts/InterVariable.woff2", as: "font", type: "font/woff2",
   crossOrigin: "anonymous" }`. `@font-face` switches to `format("woff2")`; `--font-sans` comes from
   the contract, so `font-inter` can be deleted.
7. **Sonner** — token-driven: `--normal-bg: var(--popover)`, `--normal-text:
   var(--popover-foreground)`, `--success-bg: var(--success)`, `--success-text:
   var(--success-foreground)`, `--error-bg: var(--destructive)`, `--error-text:
   var(--destructive-foreground)`, etc. No literal hex (removes the hardcoded `#ffffff` / `#f59e0b`).
8. **Motion** — dialogs/sheet/mobile-nav transitions use `--duration-*` / `--ease-*` tokens; confirm
   `prefers-reduced-motion` disables them (base-layer block from phase 1 + tw-animate-css).
9. **Vestibular** — the 600×800 blur blobs are gone (phase 3); confirm `Hero` renders no decorative
   layer when `--hero-glow` is `transparent`.

**Acceptance:** keyboard-only pass through sign-in, sign-up, dashboard settings, theme toggle;
`@axe-core/playwright` reports zero serious/critical on `/`, `/design-system`, `/sign-in` in both
themes (the spec itself lands in phase 5; run it manually here if the spec is not yet merged).
