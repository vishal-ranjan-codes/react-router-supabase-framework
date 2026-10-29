# Phase 8 — Verification & release

**Read first:** `README.md`, this file, `11-risks-dod.md`.
**Depends on:** phases 4, 6 and 7. Not a PR — a checklist run on the merged branch.

## Original scope (phases 1–5)

- [ ] `npm run lint && npm run format:check && npm run typecheck && npm test && npm run build`
- [ ] `npm run check:ds` passes; `tests/design-tokens.test.ts` green in both themes (full manifest).
- [ ] Playwright: navigation + theme + visual + a11y specs pass; baselines reviewed.
- [ ] Manual matrix: `/`, `/about`, `/contact`, `/design-system`, `/sign-in`, `/sign-up`,
  `/auth/reset`, `/auth/verify-otp`, `/dashboard/*`, `/admin/*` × light/dark × 390/1280.
- [ ] Keyboard-only pass: Tab order, focus ring visibility, password toggle, dialog escape.
- [ ] Compiled CSS: no `theme-` utilities, no `--color-x: var(--color-x)`, `animate-in` present,
  `shadow-card` present.
- [ ] `grep -rn "bg-primary/" app/routes app/components/layout app/components/patterns` → only
  `ds-allow` lines (expected: none).
- [ ] Every dropdown/menu/sidebar hover is neutral in both themes (pattern-audit P4).
- [ ] All nine recipes render on `/design-system` and each is used by ≥2 pages.
- [ ] Public pages pass `05` §5: no boxed hero/CTA, one `brand-deep` band each, no dead links, no
  placeholder copy, header 64px translucent, footer inverse.
- [ ] Before/after screenshots of `/`, `/about`, `/contact` (light + dark) attached and reviewed
  against public-pages-audit L1–L12.
- [ ] `.docs/design-system-audit.md`, `.docs/design-pattern-audit.md`,
  `.docs/public-pages-audit.md` each get a closing section marking every finding resolved or
  explicitly accepted.
- [ ] `DESIGN.md`, `AGENTS.md`, `PATCHES.md` exist and are accurate; README no longer documents
  `theme-*`.
- [ ] **Retheme drill:** change `--p-brand-*` (ramp) and `--radius-lg` in `:root`/`.dark` only;
  confirm the whole app follows, including the brand band and charts; revert. Record the result in
  the PR — this is the proof the framework is rethemeable without touching components or pages.

## Added by phase 6 (completeness)

- [ ] Hover/selected feedback is visible in **light** mode on a card and on the page background — the
      defect-1 regression test. Check at 100% zoom, not in devtools.
- [ ] `variant="secondary"` legible on `Section tone="brand-deep"` in both themes (defect 2), on
      `home.tsx` and `/design-system` both.
- [ ] `grep -rn "foreground/80\|inverse/80" app/components/patterns` → empty.
- [ ] Native controls follow the theme in dark mode: `<select>` popup, `<input type=date>` picker,
      scrollbars, checkbox fill. This is the `color-scheme` assertion; it cannot be screenshotted by
      Playwright on Linux CI, so run it in a real browser on Windows and macOS.
- [ ] **Forced Colors Mode manual pass** (Windows Settings → Visual effects → Contrast themes, plus
      Edge/Chrome "Force Dark"/high-contrast emulation): focus indicators still visible on the primary
      button, the text input, and a `brand-deep` band. `ring-*` is `box-shadow` and is not painted
      here, so this is the one check the automated manifest cannot make for you.
- [ ] Focus chain holds: `--ring` vs `--ring-offset` and `--ring-offset` vs surrounding surface both
      ≥ 3:1, and the ring is visibly separated from the fill of the control it surrounds.
- [ ] `check:ds` rule 11's dead-token report is empty.

## Added by phase 7 (palettes)

- [ ] `tests/ramp-uniformity.test.ts` green; the six ramps print their per-step L in
      `/design-system`'s palette panel so the invariant is visible, not just tested.
- [ ] `--primary` is still recognisably `#1160c9` — decision D2 is not silently amended by the
      generator.
- [ ] 12 chart series legible on both `--card` and `--background`, both themes; colorblind-simulation
      screenshots reviewed; a 5-series chart looks unchanged from phase 6.
- [ ] No status hue appears in any `--chart-*`, and no `--label-*` hue appears in any status or chart
      token (rules 15–16, with a failing fixture proving they bite).
- [ ] Every one of the 40 `--label-*` semantic tokens is rendered on `/design-system` — this is the
      docs-honesty gate for the largest token addition in the plan.
- [ ] Zero hex outside `:root`/`.dark` ramp blocks; `--p-chart-4-light`/`-dark` gone.
- [ ] Gated backlog (`09` §5) rows are still ungated: nothing was promoted to tokens without a named
      consumer.
