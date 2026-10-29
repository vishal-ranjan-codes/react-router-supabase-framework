# 09 — Risks, rollback, definition of done

## Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Re-vendor changes visuals more than expected (radius, darker blue) | Phase 1 on a branch; before/after screenshots; phase 5 visual baselines lock it down |
| shadcn CLI rewrites `globals.css` | Inspect `git status` before edits; revert any CSS change; pin `shadcn@4.23.0` |
| Upstream registry drops a component we ship (`toast`) | Only `toast`/`toaster` affected; both unused and deleted in phase 1 |
| `sonner.tsx` re-vendored by mistake pulls `next-themes` | Excluded explicitly; listed in `PATCHES.md` |
| `add --overwrite` silently wipes local customizations inside vendored files (already hit: the nav trigger's link-like style) | Every deviation lives in `PATCHES.md`; after any `ds:add`, `git diff app/components/ui` must show only `PATCHES.md`-listed lines (`07` §5) |
| Screenshot baselines flaky across OS | Generate in CI; `maxDiffPixelRatio: 0.01`; chromium only |
| Removing `theme-*` breaks an overlooked page | Phase 2 codemod + grep gate; typecheck/build can't see it, so the grep check is mandatory |
| Dark-mode primary button has dark text | Intentional (6.92:1); documented in DESIGN.md; called out in the PR |
| Neutral `--accent` makes hover look "flat" after years of blue | Expected; if too weak, darken `--accent` — the token exists so this is a one-line change, never a re-tint |
| Public-page recreation is subjective and stalls review | `05` §5 acceptance is measurable; review against criteria, not taste |
| Recreation drops anchors others depend on | `/design-system#colors|#typography|#components` linked from Header/README; phase 3 greps `to="/design-system#` before merge |
| Agent-written copy reads like filler | `05` §2 fixes section lists and factual claims; stub copy banned by the phase-5 placeholder check |
| Recipes become a second component library | Recipes import `ui/` only; ≥2-page rule; check 9 forces documentation |
| `ds-allow` becomes routine | Every use carries a reason and is grep-able; >3 in a PR means the token set is incomplete, not the check wrong |
| Token set grows past what anyone uses | Additions must appear in the contract first and in `DESIGN.md`; unused tokens fail the docs-honesty review, not the build |
| Inverse/brand band fails in dark mode | Values verified (10.63 / 12.36); visual spec covers both themes |
| **P6** Fixing the ladder changes light-mode hover everywhere at once | The four colliding roles are the point; each new step is measured in `08` §1 (1.32 / 1.74), and rule 10 makes the collision mechanically impossible to reintroduce |
| **P6** The duplicate-step check gets allowlisted into uselessness | Every allowlist entry needs a reason string **and** a `02` contract citation; a new entry is a contract change, so it cannot slip in through a checker PR |
| **P6** `color-scheme` repaints native controls, so screenshots differ across OS and become flaky | Baselines stay Linux-CI-only; the native-control check is an explicit manual row in `10`, not a spec |
| **P6** Forced Colors Mode cannot be tested by Playwright (`ring-*` is `box-shadow`, unpainted there) | Documented coverage limit; `10` carries the manual Windows/Edge pass, and the base-layer `outline` fallback is the mitigation, not the test |
| **P6** `ring-offset` on vendored buttons conflicts on every re-vendor | One `PATCHES.md` row; `ds:drift` reports it; the alternative — a ring color that contrasts with both fill and page — does not exist for a brand-colored fill |
| **P7** Ramp regeneration shifts every chromatic pixel and buries the real changes | `09` §4 forces §1 into its own commit, reviewed on its own, before any new token name exists |
| **P7** The generator quietly moves brand blue and breaks decision D2 | `10` asserts `--primary` is still `#1160c9`; if it is not, retune the chroma targets — D2 is never amended inside a palette PR |
| **P7** 12 chart series and 40 label tokens ship as decoration nobody renders | Series ordered so the existing 5-series chart is unchanged; `>8 → "Other"` aggregation rule; every `--label-*` token must appear on `/design-system` or the docs-honesty check fails the PR |
| **P7** Label hues drift into meaning-status roles and the two families blur | Rule 16 forbids cross-family pairing mechanically, `ds-allow` cannot waive it, and a deliberate failing fixture proves it bites |
| **P7** The gated backlog gets implemented speculatively by whoever picks up the next phase | `11` DoD 20 asserts the gated rows stayed gated; promotion needs a named consumer, per `09` §5 |

**Rollback:** each PR is independent. PR 1 reverts wholesale; PR 2's shim deletion is one commit;
PR 3 touches three route files + `patterns/` + Header/Footer, so reverting restores the old pages
without affecting tokens or components. PRs 6 and 7 are token-only plus recipe plumbing, so each
reverts without touching a route; inside PR 7, the ramp regeneration is a separate commit and can be
reverted alone while the new palettes stay.

## Definition of done

1. Hex exists only in `:root` / `.dark` (Tier 1 ramps + scrim alphas).
2. The colour vocabulary is exactly the Tier-3 contract; `theme-*` utilities are gone.
3. `app/components/ui/**` is byte-identical to upstream except the deviations listed in
   `PATCHES.md` (the four `bg-card` lines, `sonner.tsx`, the `navigation-menu.tsx` trigger).
4. Every pair in the contrast manifest is asserted by a test that fails the build on regression.
5. `npx shadcn@latest add <anything> --overwrite` produces no conflict with our design.
6. WCAG 2.2 AA: no failing text pair; visible focus on every interactive element; accessible names on
   every icon-only control.
7. `/design-system` documents tokens, surfaces, recipes and states, and is the review surface for
   both themes.
8. Zero brand-alpha surfaces and zero decorative blur blobs in app code, enforced in CI.
9. `--accent`, `--muted` neutral in both themes; no hover/selected state is brand-tinted anywhere.
10. `app/components/patterns/` exists; every recipe rendered on `/design-system`; `/`, `/about`,
    `/contact` recreated from it with no boxed hero/CTA and one `brand-deep` band each.
11. `AGENTS.md` + `DESIGN.md` exist at the repo root and state the surface rules.
12. Retheme drill passes: new brand ramp + radius is a `:root`/`.dark`-only change.
13. Every finding in the three audits is closed or explicitly accepted; no dead links and no
    placeholder copy on any public page.
14. Non-colour tokens (type, spacing, radius, elevation, motion, z, sizing, alpha) exist in the
    contract and are used by components and pages — no ad-hoc `py-*`/`z-50`/`w-9 h-9` left in app
    code.
15. **No two non-aliased Tier-2 tokens resolve to the same primitive step in the same theme** (phase
    6, `check:ds` rule 10), and no Tier-2 token is unreferenced (rule 11). The light-mode ladder is
    therefore distinguishable, not just documented.
16. Every surface a control can sit on has context tokens — `*-on-brand`, `*-on-inverse` — and they are
    consumed by `app/components/patterns/*`, never by route class strings. `--sidebar-*` remains the
    pattern they all follow.
17. `color-scheme` is declared in both themes; the focus chain (`ring ↔ ring-offset ↔ surface`) holds
    at 3:1 and the ring is visibly separated from the control it surrounds; the Forced Colors Mode
    manual pass is recorded.
18. Ramps are perceptually uniform (adjacent neutral steps ΔL ≥ 0.03; every chromatic ramp within
    0.02 L of the step target), the data palette ships 12 colorblind-verified series plus sequential
    and diverging sets, and the label family ships 10 non-semantic hues — with zero orphan hex like
    the old `--p-chart-4-light`.
19. `--primary` remains the **only** chromatic brand hue, and `--accent`, `--secondary` and `--muted`
    remain neutral. No second brand color is added by any phase, and no label or chart hue is ever
    used to mean a status.
20. The gated backlog in `09` §5 stayed gated: no warm/cool neutral pair, avatar palette, gradient
    slot, syntax token, `link-visited`, `data-theme` remapping or high-contrast theme was introduced
    without the trigger that promotes it.
