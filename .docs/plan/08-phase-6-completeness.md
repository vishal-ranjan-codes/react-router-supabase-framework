# Phase 6 — Completeness pass (PR 6)

**Closes:** the two open defects in `README.md` §Status (moved here from phase 5 — see §0), plus the
corrective half of the 2026-10 token audit (the half that fixes wrong or missing *values* and the
roles every enterprise system ships that we do not).
**Read first:** `README.md`, `01-context.md` §4 (D1–D14), `02-token-contract.md` §4.6–4.7.
**Depends on:** phase 5 (the checker and the pair manifest must exist to prove each fix).
**Blocks:** phase 7, phase 8.

No new **hues** land here. New hues are phase 7. If you find yourself adding a color family in this
PR, it belongs in `09-phase-7-palettes.md`.

---

## 0. Why the two defects moved here

Phase 5 was written to close `README.md` §Status defects 1 and 2 *and* to ship the guardrail that
detects them. One PR cannot introduce a check and pass it in the same commit without either leaving
CI red or shipping the check pre-waived — which is the exact `ds-allow` abuse `07` §4 already
documents once. So the value fixes live here, arriving in the same commit as the check that proves
them, and phase 5 ships only checks for invariants that already hold.

Consequence for `07` §4: the duplicate-step check is **not** in phase 5. It is `check:ds` rule 10
below. Phase 5's contrast-manifest `it.todo` list splits: `--foreground-subtle` stays in phase 5
(it is a single-step value fix); `--surface-brand` on-* tokens move to §2 here; `--chart-3` moves to
phase 7.

## 1. Split the light-mode neutral ladder

**Defect 1.** In `:root`, `--background-subtle`, `--muted`, `--accent` and `--secondary` all resolve
to `--p-neutral-150` (`globals.css:113-145`). Four distinct roles, one value: `bg-accent` measures
**1.18:1** on `--card` and **1.07:1** on `--background`, so the hover/selected feedback that 27
vendored `bg-accent` / `text-accent-foreground` utilities depend on does not exist in light mode.
Dark already splits 900/800 and works (1.20:1).

New light values (dark is already correct and does not change):

| Token | Was | Now | On `--card` | On `--background` | Role |
| --- | --- | --- | --- | --- | --- |
| `--background-subtle` | n-150 | **n-150** | 1.18 | — | static sunken |
| `--muted` | n-150 | **n-150** (deliberate alias) | 1.18 | — | shadcn compatibility |
| `--accent` | n-150 | **n-200** `#e0e0e0` | 1.32 | 1.20 | hover |
| `--accent-selected` | — | **n-300** `#c4c4c4` (new) | 1.74 | 1.59 | selected / active row |
| `--secondary` | n-150 | **n-200** | 1.32 | — | neutral button fill |
| `--secondary-hover` | n-200 | **n-300** | 1.74 | — | hover of the above |

`--muted` and `--background-subtle` stay equal on purpose — the contract already says so
(`02` §4.3) — and are allowlisted in §7. `--accent` and `--secondary` do not move to the same step as
each other by accident: hover and a resting button fill are different jobs, but both need to read
against a card, so they share n-200 and each gets its own hover step.

Dark gains the matching `--accent-selected` (n-750 `#333333`) so key parity holds.

## 2. Context tokens — the third tier we describe but never built

`01-context.md` §5 and `02` §1 promise primitive → semantic → **component**. What actually shipped is
primitive → semantic → utility *aliases*. The only genuine component family is `--sidebar-*`
(`globals.css:192-200`), and the sidebar is the one surface that adapts correctly. Everything else is
generic, which is why **defect 2** exists: `variant="secondary"` on a `Section tone="brand-deep"`
band is `--secondary` n-800 `#262626` against `--surface-brand` brand-900 `#0d2c50` = **1.08:1**.

Fix in the token layer, not in per-page class strings. `--sidebar-*` is the template; `02` §4.6 is
the normative list:

| Token | Light | Dark | Rationale |
| --- | --- | --- | --- |
| `--secondary-on-brand` | n-150 | n-150 | 8.99:1 on the light band, 11.90:1 on the dark band. Theme-invariant **because the band is dark in both themes** — that is the whole point of a context token |
| `--secondary-on-brand-hover` | n-200 | n-200 | one step, same direction as `--secondary-hover` |
| `--secondary-on-brand-foreground` | n-850 | n-850 | 13.95:1 on the fill |
| `--foreground-on-brand-muted` | b-200 | b-200 | 7.01:1 light band / 9.28:1 dark band |
| `--border-on-brand` | b-600 | b-700 | outlines for ghost/outline controls sitting on brand |
| `--foreground-on-inverse-muted` | n-300 | n-600 | the `--surface-inverse` twin of the row above |

`--foreground-on-brand-muted` **replaces an opacity hack**: `Section.tsx:33` currently writes
`text-primary-deep-foreground/80`, and `:32` writes `text-foreground-inverse/80`. Composited, white
at 80% over brand-800 is 7.38:1; b-200 is 7.01:1 — visually identical, and it removes the only two
`opacity`-as-text tokens in the patterns layer. `AGENTS.md` rule 1 bans exactly this.

`CtaBand`/`Section`/`Hero` consume the new tokens through `SECTION_TONES`/`SECTION_MUTED` maps only;
routes never name them.

## 3. State cross-product

Enterprise systems give every fill × hover/active/selected/disabled. We stop at hover, and there is
**no `-selected` and no disabled fill or border anywhere in the contract** — which is why upstream
shadcn falls back to `disabled:opacity-50` on 30+ vendored lines.

Add `02` §4.7: `--surface-disabled` (n-100 / n-850), `--border-disabled` (n-150 / n-800),
`--accent-selected` (§1), and `--primary-selected` (b-100 / b-800) for the brand-relevant selection
that `--primary-subtle` already serves on rows and soft badges.

On `disabled:opacity-50`: **not a WCAG failure** — 1.4.3 exempts inactive controls. It is a
violation of `AGENTS.md` rule 1 and a legibility cost (white label drops to 2.24:1). Do not bulk-patch
vendored files for it. Add the solid tokens, document both options on `/design-system`, and record a
`PATCHES.md` entry only for the one place it actually hurts: form fields, where a 50%-opacity input
border falls below the 3:1 boundary rule.

## 4. Wire or delete the dead alpha constants

`--alpha-hover` .06 and `--alpha-pressed` .10 (`globals.css:100-101`) are consumed by nothing. They
encode the opacity-overlay model that decision **D6** rejected. **Delete both** and update `02` §6.
`--alpha-scrim` .50 and `--alpha-scrim-strong` .64 stay, and finally get wired: `--scrim` becomes
`rgb(0 0 0 / var(--alpha-scrim))` in `:root` and `…var(--alpha-scrim-strong)` in `.dark`, which
composites to the same `#00000080` / `#000000a3` it ships today — a value-preserving refactor that
makes the scrim the single source it pretends to be.

## 5. Platform signals

- **`color-scheme` is never declared.** `:root { color-scheme: light }` / `.dark { color-scheme: dark }`.
  Without it, native `<select>` popups, `<input type=date>` pickers, scrollbars and `accent-color`
  control fills keep light-mode chrome on a dark page. Theme is a bare class toggle
  (`app/lib/theme.ts:23`), so the CSS declaration is the only mechanism available. This changes
  painted native controls, so it is part of the §8 rebaseline.
- **`@media (forced-colors: active)` has zero hits.** In Forced Colors Mode, `ring-*` is a
  `box-shadow` and is not painted, and borders are forced to system colors — so the focus indicator
  from §6 disappears entirely. Add a base-layer block that restores
  `outline: 2px solid CanvasText` on `:focus-visible`. Playwright cannot test this; it is a manual
  item in phase 8.
- **`prefers-contrast`** is a gated backlog row in `09` §5, not this phase.

## 6. The focus chain

`--ring` and `--primary` are both `--p-brand-600`. Measured: the focus ring against the primary
button it surrounds is **1.00:1**. The ring is invisible on the most important control in the app,
and alpha is not the cause — solid brand on brand is still 1.00:1. Against the page it is 5.39:1, so
`ring-ring/50` (2.24:1, failing WCAG 1.4.11's 3:1) was masking the real defect.

One color can never contrast with itself, so the contract gains a **chain rule** instead of a value
(`02` §7): `--ring` ≥ 3:1 against `--ring-offset`, **and** `--ring-offset` ≥ 3:1 against the surface
the control sits on. Both links already pass on today's tokens (5.93:1 and 5.93:1) — the gap between
them simply is not being painted, because upstream's button is `focus-visible:ring-[3px]` with no
offset while `dialog.tsx:71` and `sheet.tsx:77` use `ring-offset-2`. `--ring-offset` is defined in
both themes and consumed nowhere.

Implementation: add `focus-visible:ring-offset-2` plus `--color-ring-offset` as the offset color to
the base-layer focus pattern, and record the vendored deviations in `PATCHES.md`. Do **not** change
`--ring` itself; a two-tone ring plus gap is the same mechanism Material and Primer use, and it keeps
brand as the focus color everywhere else.

## 7. Guardrails added in this phase

Appended to `scripts/check-design-system.mjs` as rules 10–13:

10. **Duplicate step** — no two Tier-2 tokens that are not deliberately aliased may resolve to the
    same primitive step in the same theme. Allowlist, each with a reason string:
    `muted↔background-subtle` (contract §4.3) and `primary-deep↔surface-brand` (contract §4.3 alias).
    This is the check that makes defect 1 impossible to reintroduce.
11. **No unreferenced Tier-2 token** — every semantic token must be consumed by `@theme inline`, by
    another Tier-2 token, or by app/pattern code. Prints the dead list. (Today it would report
    `--ring-offset`, `--alpha-hover`, `--alpha-pressed` — all resolved above.)
12. **`color-scheme` present** in both `:root` and `.dark`.
13. **Focus chain** — assert `ring↔ring-offset` and `ring-offset↔card` ≥ 3:1 in the pair manifest.

## 8. Rebaseline

Rules 1–6 change pixels in light mode and in native control rendering. Phase 5's Playwright baselines
are regenerated in this phase; **the baseline diff is the review artifact** — every changed pixel must
be explainable by §1, §2, §5 or §6, and anything else is a regression. Regenerate in CI (Linux) only,
same `maxDiffPixelRatio: 0.01`.

## 9. Docs

`02` gains §4.6, §4.7 and the §7 chain rule before this PR's code review (protocol step 3).
`DESIGN.md` gains a "which token do I want?" branch for on-brand/on-inverse contexts and the disabled
pair. `AGENTS.md` rule 2 gains `bg-accent-selected` for selected state, and rule 1's opacity ban now
has no exceptions in `patterns/`. `/design-system` renders the full light-mode ladder as labelled
panels, the on-brand band with real secondary/outline buttons on it, and the focus chain at 100% zoom.

## Acceptance

- [ ] Light mode: `hover:bg-accent` visibly differs from `bg-card` **and** from `bg-background-subtle`
      (rule 10 green, no new allowlist entries).
- [ ] `variant="secondary"` on `<Section tone="brand-deep">` ≥ 3:1 in **both** themes; the `home.tsx`
      CtaBand and the `/design-system` band both use it.
- [ ] Zero `/80` or `/opacity-*` text utilities under `app/components/patterns/`.
- [ ] `--alpha-hover` / `--alpha-pressed` gone from `globals.css` and from `02` §6.
- [ ] Tab to the primary button on `/sign-in` at 100% zoom: the ring is visibly separated from the
      fill in both themes, and survives Windows Ease of Access contrast themes.
- [ ] `npm run lint && npm run typecheck && npm test && npm run build && npm run check:ds` green;
      `tests/design-tokens.test.ts` covers the new pairs with no `it.todo` left except phase 7's.
- [ ] Baseline diff regenerated, reviewed, and attached to the PR with the explanation for each
      changed region.
