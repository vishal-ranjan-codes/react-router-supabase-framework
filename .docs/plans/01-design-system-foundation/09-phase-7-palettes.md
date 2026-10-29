# Phase 7 — Palette expansion (PR 7)

**Closes:** the additive half of the 2026-10 token audit — the non-semantic label family, a data
palette that survives more than five series, and ramp regeneration at matched perceived lightness.
**Read first:** `README.md`, `01-context.md` §4 (D11–D14), `02-token-contract.md` §3, §4.8, §7.
**Depends on:** phase 6 (the duplicate-step and unreferenced-token checks exist, and the neutral
ladder is stable — regenerating ramps on top of a broken ladder just re-breaks it in new hexes).
**Blocks:** phase 8.

---

## 0. What must NOT happen in this phase

**No second chromatic brand hue.** `--primary` stays the only brand color, `--accent` and `--secondary`
stay neutral, and nothing in this phase makes a hue load-bearing for identity. That is not taste, it is
the survey: of seven enterprise systems whose published token packages were audited — Carbon
(`@carbon/themes@11.84.0`), Spectrum (`@spectrum-css/tokens@16.0.2`), Polaris
(`@shopify/polaris-tokens@9.4.2`), Atlassian (`@atlaskit/tokens@20.8.2`), Primer
(`@primer/primitives@11.10.0`), Fluent (`@fluentui/react-theme@9.2.2`), Lightning
(`@salesforce-ux/design-system@2.264.3`) — **every one ships exactly one chromatic brand hue**, and
each one's `secondary`/`tertiary` are neutral surface steps. Material 3's `secondary` role is built at
chroma 16 on the *source hue* (a tinted grey); its chromatic second hue is called `tertiary`, and
Google's own API docs call it discretionary. Decision D11 locks this.

The thing we are actually adding is a **non-semantic hue family** — hues with no meaning, used for
tags, categories and series. Atlassian ships exactly that (`--ds-background-accent-{10 hues}-{5
emphasis}`), and so do Carbon (`tag-*`, 10 hues) and Primer (`label-*`, 19 hues). Atlassian's rule is
the boundary of this phase: *"Don't use an accent when the color has semantic meaning."*

## 1. Ramp regeneration first, not last

Everything below reads its values off the regenerated ramps, so §1 runs before §2 and §3.

Measured imbalance in the current hand-picked hexes (OKLab L):

| Step | brand | success | warning | danger | info |
| --- | --- | --- | --- | --- | --- |
| 600 | 0.509 | 0.596 | **0.666** | 0.577 | 0.588 |
| 700 | 0.451 | 0.508 | **0.554** | 0.505 | 0.500 |
| 400 | 0.695 | 0.773 | **0.837** | 0.711 | 0.754 |

Same step number, different perceived weight. Consequences already visible: `--chart-3` (warning-600)
is louder than `--chart-1` (brand-600) for no reason, the four status solids are not equally heavy,
and the neutral ramp's first gap (n-50→n-100, ΔL 0.018) is why phase 6 had so little room to split the
light-mode ladder.

**The anchor is brand, not an invented scale.** Brand's measured OKLab L is already the best-behaved
ladder in the file — and D2 froze `#1160c9` at L 0.509 — so the target curve is fit *through* brand's
existing step lightnesses rather than picked afresh. That means brand barely moves, the status ramps and
the neutral ramp are the ones that change, and the regeneration cannot quietly re-aim the locked blue.

| Step | target L | source |
| --- | --- | --- |
| 50 | 0.970 | brand-50 `#eef6ff` |
| 100 | 0.929 | brand-100 `#d9e9ff` |
| 150 | 0.895 | interpolated 100→200 (brand has no 150) |
| 200 | 0.862 | brand-200 `#b6d4ff` |
| 300 | 0.770 | brand-300 `#7cb8ff` |
| 400 | 0.695 | brand-400 `#4a9fff` |
| 500 | 0.588 | brand-500 `#2f7ae0` |
| 600 | 0.509 | **brand-600 `#1160c9` — D2, frozen** |
| 700 | 0.451 | brand-700 `#0e51aa` |
| 750 | 0.410 | interpolated 700→800 |
| 800 | 0.369 | brand-800 `#0a3d7d` |
| 850 | 0.330 | interpolated 800→900 |
| 900 | 0.292 | brand-900 `#0d2c50` |
| 950 | 0.177 | brand-950 `#04121f` |

Adjacent gaps in this curve are ≥ 0.033 everywhere, so the "ladder cannot collapse" assertion below is
satisfiable by construction — the targets are not a wish.

**Method (D13: regenerate, keep hex output).** Solve `oklch(L C H)` → sRGB at each ramp's own hue angle,
with L taken from the table above and a chroma cap per ramp family so no hue reads as "louder" than
another, and **commit the hex output**. All seven enterprise systems ship sRGB hex too; the perceptual
work happens in generation (Spectrum uses Leonardo/CAM02, Material uses HCT), not in the shipped
notation. Keeping hex also means `@theme inline`, `color-mix` and the pair-manifest parser are untouched.
`--p-neutral-0` stays `#ffffff` — it is a pure surface, not a rung.

Mechanics: `scripts/generate-ramps.mjs`, run by hand, output committed — no new runtime dependency,
no build-time color math. The step list and the `--p-<ramp>-<step>` grammar do not change.
Gamut mapping algorithm: when transforming `oklch(L, C, H)` into sRGB, use binary-search chroma reduction
(CSS Color 4 standard method) to reduce `C` until `[r, g, b]` are strictly in `[0, 255]`. This prevents
channel clipping or NaN color values while strictly preserving target perceived lightness `L` and hue angle `H`.

New test `tests/ramp-uniformity.test.ts`, three assertions:

1. every ramp, every step: `|L(step) − target| ≤ 0.02`;
2. neutral ramp, adjacent steps: ΔL ≥ 0.03, so the ladder can never collapse back to indistinguishable
   values — this is the check that keeps a future hand-added ramp honest;
3. **D2 guard**: `--p-brand-600` is byte-identical to `#1160c9`.

If an in-gamut hex cannot satisfy both the target L and a chroma that keeps the pair manifest passing,
stop and raise it rather than tuning the table. The table is derived from shipped values; changing it
to make a generation run pass would move the brand ramp by the back door.

Out of scope, stated explicitly: **no `oklch()` in `globals.css`.** Tailwind v4's own default palette
is OKLCH, so it is a defensible future choice, but it changes nothing the eye can see once the ramps
are generated correctly, and it would put color-math in the shipped stylesheet for no measured gain.

## 2. Categorical data palette

Current state: `--chart-1…5` (`globals.css:183-187`) reuse the status hues — so green means "success"
and "series 2" in the same interface — and `--p-chart-4-light: #7e22ce` / `-dark: #c084fc`
(`:96-97`) is an orphan pair outside the ramp grammar, which is the one thing `02` §3 exists to
prevent. The open `02` §7 item "`--chart-3` is 2.90:1 on `--background` in light" is not a bug to
patch; it is a constraint the new palette must satisfy by construction.

**Target: 12 ordered series**, because 5 is below every enterprise floor — Atlassian 8, Carbon 14,
Primer 17 (`data-*`), Spectrum 20 (shipped as `s2Categorical{6,12,16,20}` with the instruction to pick
the smallest set that covers your series); Berkeley's guidance is ≤6 best / 12 max. Ship
`--chart-1…12` as Tier 2 over the §1 ramps, ordered so that the *first five* are the maximally
distinguishable subset (a 5-series chart must not look different after this PR than before it).

Rules:

| Rule | Enforcement |
| --- | --- |
| Series hues are drawn from the §4 label family, never from `success/warning/danger/info` | `check:ds` rule 15: no `--chart-*` may resolve to a `--p-(success\|warning\|danger\|info)-*` step |
| Every series ≥ 3:1 on `--card` **and** on `--background`, both themes | pair-manifest extension (12 × 2 × 2 = 48 new assertions) |
| Adjacent series ΔL ≥ 0.05 | `ramp-uniformity.test.ts`, series clause |
| Survives deuteranopia, protanopia, tritanopia simulation | manual review artifact on `/design-system`, screenshot in the PR |
| > 8 series must aggregate the tail into `--chart-12` "Other" | documentation rule in `DESIGN.md` |

Also ship, as closed sets rather than ad-hoc picks: a **sequential** ramp (`--chart-seq-1…7`, one hue,
L 0.90→0.25) and a **diverging** ramp (`--chart-div-neg-3…1`, `--chart-div-mid`, `--chart-div-pos-1…3`)
— both currently absent, both required by any real dashboard. `colorbrewer2.org` is the reference for
the hue pairs. `--chart-grid` and `--chart-label` stay as they are.

Note for whoever writes the docs: NN/g's "limit your palette to three colors" is about **UI** palettes,
not data series. Do not cite it to shrink this section.

## 3. Non-semantic label family

Ten hues, four roles each, for tags, chips, filters and category keys. This is what the user question
"shouldn't we have an accent color?" was really reaching for: not a brand hue, but permission to paint
a thing a color that means nothing.

Hues: `violet`, `indigo`, `teal`, `cyan`, `pink`, `lime`, `orange`, `brown`, `cool-gray`, `gray`.
Chosen to be visibly distinct from the four status hues and from brand blue, and to include two
neutrals (Atlassian and Carbon both ship gray-family labels; Carbon pairs `coolGray`/`gray`/`warmGray`).

Primitives: `--p-<hue>-50`, `-200`, `-700` (3 steps × 10 = 30, generated by §1's script at the same
targets). Semantics, following the `<category>-<role>[-<modifier>]` grammar:

```
--label-<hue>-subtle      ← p-<hue>-50    (light) / p-<hue>-950-class (dark, derived)
--label-<hue>-on-subtle   ← p-<hue>-700   / bright step, ≥4.5:1 on -subtle
--label-<hue>-border      ← p-<hue>-200   / -800-class, ≥3:1 boundary
--label-<hue>-solid       ← p-<hue>-600   / -400-class, with --label-<hue>-foreground
```

Hard rule, enforced by `check:ds` rule 16: **no cross-family usage.** A status token may not paint a
label and a label token may not paint a status. `bg-warning-subtle` on a chip is a lie the moment a
validation error appears beside it; `bg-label-lime-subtle` on a toast is unreadable as meaning. The
check fails any element-class pair that mixes the families, and `--label-*` is exempt from the
`ds-allow` mechanism entirely so the exemption cannot quietly become the norm.

This is 40 new semantic tokens, which is the single largest addition in the plan. It earns its place
only because every one is reachable from `/design-system` and printed in `DESIGN.md`; the docs-honesty
review (`02` §9, `11` risk "token set grows past what anyone uses") is the gate, not the build.
To guarantee compilation and verification, render all 10 hues × 4 roles in a dedicated `<LabelShowcase />`
chip grid on `/design-system` (`#labels`), documenting subtle, on-subtle, border, and solid tokens.

## 4. Rebaseline

§1 changes **every chromatic pixel in the product**. That is the point, and it is also the risk. Order
of operations inside the PR:

1. §1 generator + `ramp-uniformity.test.ts`, ramp values only — no new token names yet.
2. Review the §1 baseline diff alone. It must be a uniformity change, not a redesign: brand-600 stays
   within a hair of `#1160c9`, because decision **D2** locks that blue. If the generator moves brand
   materially, retune the chroma targets — do not amend D2 in a palette PR.
3. §2 and §3 token additions, each rendered on `/design-system` before the manifest is extended.
4. Manifest + `check:ds` rules 15–16, then the final full rebaseline.

Committing §1 separately from §2/§3 is what makes a diff of this size reviewable at all.

## 5. Gated backlog

These seven are real gaps against the audit and are deliberately **not** scheduled. A row becomes work
only when its trigger exists, and then it enters as a contract amendment first (`02` §9). No row is
promoted by "the enterprise systems have it."

| Item | Precedent in the survey | Trigger that promotes it |
| --- | --- | --- |
| Warm/cool neutral pairs | Carbon `coolGray`/`gray`/`warmGray`; Primer `coolNeutral`/`warmNeutral` | A page needs a neutral that must not read blue-shifted next to brand |
| Avatar/identity palette | Polaris `--p-color-avatar-{one…five}-bg-fill` + `-text-on-bg-fill` | Dashboard or admin shows a second participant |
| Brand-gradient / `--hero-glow` content | Atlassian `--ds-rovo-*`; Carbon `--ai-aura-{start,end}`; Polaris `-magic` | A marketing page actually requires a gradient band (today `--hero-glow` ships `transparent` on purpose) |
| Syntax-highlighting tokens | Carbon `syntax-*` (88); Primer `prettylights-*` (42) + `ansi-*` (16) | `CodeBlock` gains highlighting — it currently renders plain mono text and would need 8–12 tokens |
| `link-visited` | `--link-primary-visited`, `--ds-link-visited-pressed`, `--slds-g-link-color-focus` | An app surface with genuine link history, **plus** a decision on the fingerprinting exposure the feature carries |
| `data-theme` multi-brand remapping | Radix Themes `data-accent`/`data-gray`; Fluent `BrandVariants` | The first per-tenant brand. Mechanism is a Tier-2 block scoped to `[data-brand=…]`, never a second set of primitives |
| `prefers-contrast` / high-contrast theme | M3 contrast curves (4 levels); `02` §9 already sketches `.theme-hc` | A concrete accessibility report, or the phase-8 forced-colors manual pass finding something `color-scheme` cannot fix |

## Acceptance

- [x] `tests/ramp-uniformity.test.ts` green on all three assertions: six ramps within 0.02 L of the
      brand-anchored target at every step; neutral adjacent ΔL ≥ 0.03; `--p-brand-600` byte-identical
      to `#1160c9`.
- [x] D2 intact in the visible product too — `/design-system`'s brand ramp panel still shows
      `#1160c9` as the solid.
- [x] 12 chart series, each ≥ 3:1 on card and page in both themes; first five visually unchanged;
      colorblind simulation screenshots attached.
- [x] `--p-chart-4-light` / `-dark` deleted; no hex exists outside a documented ramp.
- [x] Sequential + diverging sets defined in `02` §4.8 and rendered on `/design-system`.
- [x] 10 label hues × 4 roles, all four manifest pairs passing per hue, and rules 15–16 green —
      including a deliberate failing fixture proving they actually catch a mix.
- [x] `DESIGN.md` documents "pick the smallest palette that covers your series" and the
      label-vs-status boundary; `AGENTS.md` unchanged (no new surface rules needed).
- [x] Full rebaseline reviewed in three passes (ramps, series, labels), each explained.
