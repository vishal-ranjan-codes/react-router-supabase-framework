# Implementation plan — design system v2 + public-page recreation

**Start here.** This folder is the complete, self-contained plan. If you are an agent asked to
"implement phase N", follow the protocol below and do not read anything else first.

The old monolith `../design-system-v2-plan.md` is a pointer to this folder only. The evidence behind
the plan lives in `../design-system-audit.md`, `../design-pattern-audit.md` and
`../public-pages-audit.md`.

## Protocol — implementing any phase

1. Read this `README.md`.
2. Read [01-context.md](./01-context.md) — why the plan exists, the locked decisions (D1–D10), the
   target architecture.
3. Read [02-token-contract.md](./02-token-contract.md) — every value you are allowed to use. If a
   phase needs a value that is not in the contract, **stop and add it to the contract first**
   (and to `DESIGN.md` in phase 5); never invent a hex in app code.
4. Read the phase file (table below) end to end, including its acceptance list.
5. Implement, then run the phase's acceptance list and the repo checks
   (`npm run lint && npm run typecheck && npm run build`, plus `npm run check:ds` once phase 5 lands).
6. Commit the phase as its own PR. **Do not start phase N+1 until phase N's acceptance is green.**
7. If a phase file and this README disagree, the phase file wins for its own scope; if a phase file
   and `02-token-contract.md` disagree, the contract wins.

## Folder map

| File | Contents |
| --- | --- |
| `README.md` | this protocol + map + status |
| [01-context.md](./01-context.md) | problem, audits, research (§3.1 is the 2026-10 second pass), locked decisions D1–D15, architecture, phase order |
| [02-token-contract.md](./02-token-contract.md) | the complete three-tier token set (colour + non-colour), contrast policy, gap matrix §8 + §8.1 |
| [03-phase-1-tokens-revendor.md](./03-phase-1-tokens-revendor.md) | rewrite `globals.css`, tailwind-merge, re-vendor shadcn, `PATCHES.md` |
| [04-phase-2-migrate-app.md](./04-phase-2-migrate-app.md) | codemod off `theme-*`, manual-review list, delete the shim |
| [05-phase-3-public-pages.md](./05-phase-3-public-pages.md) | nine recipes, recreate `/` `/about` `/contact`, Header/Footer refresh |
| [06-phase-4-a11y-polish.md](./06-phase-4-a11y-polish.md) | labels, focus, touch targets, woff2 font, sonner tokens, motion |
| [07-phase-5-docs-guardrails.md](./07-phase-5-docs-guardrails.md) | `AGENTS.md`, `DESIGN.md`, `/design-system` rewrite, CI checks 1–9 |
| [08-phase-6-completeness.md](./08-phase-6-completeness.md) | **value fixes**: light-mode ladder, context + state tokens, `color-scheme`, focus chain, checks 10–13 |
| [09-phase-7-palettes.md](./09-phase-7-palettes.md) | **additive**: 12-series data palette, 10-hue label family, ramp regeneration, gated backlog |
| [10-phase-8-verify-release.md](./10-phase-8-verify-release.md) | final checklist incl. the retheme drill, forced-colors pass, rebaseline review |
| [11-risks-dod.md](./11-risks-dod.md) | risks, rollback, definition of done (items 1–20) |

## Phases and what to read before each

| Phase | PR | Read before implementing | Closes |
| --- | --- | --- | --- |
| 1 Token contract + re-vendor | 1 | README, 01, 02, 03 | token/contrast/component audit; P4 |
| 2 Migrate app, delete shim | 2 | README, 02 §4–5, 04 | parallel-vocabulary finding; P3 |
| 3 Recipes + public pages | 3 | README, 01 §4, 02 §4.1/4.3, ../public-pages-audit.md, 05 | P1–P3, P5–P6; L1–L12 |
| 4 A11y, font, polish | 4 | README, 02 §6–7, 06 | a11y findings; L10 |
| 5 Docs, rules, guardrails 1–9 | 5 | README, 01 §4 (D9, D15), 02, 07 | P7–P9; doc findings |
| 6 Completeness pass | 6 | README, 01 §3.1 + §4 (D11–D13, D15), 02 §4.6/4.7/§7/§10, 08 | §8.1 rows 1–7; `README.md` §Status defects 1–2 |
| 7 Palette expansion | 7 | README, 01 §3.1 + §4 (D11, D13, D14), 02 §3/§4.8, 09 | §8.1 rows 8–11 |
| 8 Verify & release | — | README, 10, 11 | everything; closes the three audits and §8.1 |

Phases 4 and 5 both depend only on 3 and may run in parallel. Phase 6 is strictly after 5 (it needs the
checker and manifest that prove its fixes). Phase 7 is strictly after 6 — regenerating ramps onto a
ladder where four roles share one value just re-breaks it in fresh hexes. Phase 8 needs 4 and 7.

## Global invariants (true at every commit after phase 1)

- Hex only in `:root` / `.dark`. Utilities come from `@theme inline` over semantic tokens.
- The only colour vocabulary is the Tier-3 contract (shadcn names + documented additions).
- `app/components/ui/**` is upstream-owned; deviations live in `app/components/ui/PATCHES.md`.
- Brand is punctuation, never a surface; one full-bleed `brand-deep` band per page maximum.
- Sections are full-bleed; boxes are for cards, grids, forms and modals only.
- Every token key exists in both themes; a missing key fails a test, not a screenshot review.
- **`--primary` is the only chromatic brand hue, forever** (D11). `--accent`, `--secondary` and
  `--muted` are neutral. No phase adds a second brand color, and no one re-tints `accent` to make
  hover "pop" — that is the bug B5 recorded and D6 closed.
- Non-semantic label hues and status hues never cross over (D14), mechanically, without a waiver.
- A guardrail ships in the same PR as the values that satisfy it; no check lands pre-waived (D15).

## Status

**Phases 1–4 are implemented** (branch `phase-1-token-contract`): the token contract is in
`app/globals.css`, shadcn is re-vendored, the `theme-*` shim is deleted, the nine recipes exist in
`app/components/patterns/`, and the public pages are rebuilt. Phase 5 has partly been pulled
forward — `AGENTS.md` exists, and `/design-system` no longer demonstrates brand-tint-as-surface.
**Do not reopen phases 1–4.**

Two defects were found while pulling phase 5 forward. Under D15 they now belong to **phase 6**, which
ships each fix together with the check that proves it (see `07`'s header for why they moved):

1. **Light-mode token collision.** `--background-subtle`, `--muted`, `--accent` and `--secondary` all
   resolve to `--p-neutral-150` in `:root`. Four distinct roles, one value — `bg-accent` measures
   1.18:1 on a card and 1.07:1 on the page, so the hover feedback 27 vendored utilities rely on does
   not exist in light mode. Dark mode splits correctly (900 vs 800). → `08` §1.
2. **`variant="secondary"` is invisible on a `brand-deep` band in dark mode.** `--secondary` (dark) is
   `neutral-800` #262626 against `--surface-brand` `brand-900` #0d2c50 — **1.08:1**. `home.tsx`'s
   `CtaBand` actions and the `/design-system` band both hit it. The fix belongs in the recipe, not in
   per-page class strings — which is the same conclusion as "the contract has no component tier". →
   `08` §2.

`MethodSelector.tsx` still holds uncommitted user work — migrate colour classes only, never reformat.
