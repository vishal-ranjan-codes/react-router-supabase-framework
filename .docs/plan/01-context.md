# 01 — Context, research and decisions

Read this before any phase. It explains *why* the plan exists and locks the decisions each phase
must not relitigate.

## 1. The problem, in one paragraph

The framework's design system was a set of hand-written `theme-*` utilities over an incomplete token
set, with a forked shadcn library on top. That produced four compounding failures: (a) contrast and
focus defects, (b) components that cannot be upgraded, (c) a visual pattern — brand blue faded into
backgrounds — repeated on every page and inside components, and (d) public pages whose layout
vocabulary is only "page background" and "box", so heroes and CTAs render as boxes floating in
whitespace. Because the docs and the pages both teach these patterns, AI agents reproduce them.

## 2. Audits this plan implements

| Document | Scope |
| --- | --- |
| [../design-system-audit.md](../design-system-audit.md) | tokens, components, contrast, upgrade risk |
| [../design-pattern-audit.md](../design-pattern-audit.md) | the brand-tint-as-surface pattern (P1–P9), why agents copy it |
| [../public-pages-audit.md](../public-pages-audit.md) | layout findings L1–L12 on `/`, `/about`, `/contact`, Header, Footer |

Every phase file cites the findings it closes. Phase 8 closes them all in the audit docs.

## 3. Research: what a well-built design system has

Current best practice (see Sources at the bottom of this file) converges on:

1. **Three tiers** — primitive (raw ramps, no meaning) → semantic (intent names, theme-aware) →
   component (what code consumes). A single flat list is the canonical beginner mistake.
2. **Semantic colour roles, not colours** — surfaces (page / container / sunken / overlay / inverse),
   content levels (default / muted / subtle / disabled / inverse / on-brand / link / placeholder),
   brand with interaction states (rest / hover / active / subtle / on-subtle), and **status families**
   that always ship solid + on-solid + subtle + on-subtle + border.
3. **Tone-based surface steps** (Material 3's surface-container idea): elevation is expressed by
   distinct neutral steps, never by opacity overlays or brand tint.
4. **Non-colour tokens are first-class** — typography (families, scale, line-height, tracking),
   spacing, radius, elevation/shadow, motion (duration + easing), z-index, sizing/touch targets,
   opacity/alpha. A colour-only token set is incomplete.
5. **Naming by intent**, consistent grammar, and a documented update path so the system survives
   upstream changes.

Our contract in [02-token-contract.md](./02-token-contract.md) implements all five. §8 of that file
is the gap matrix against today's `globals.css`.

### 3.1 Second pass (2026-10), after phases 1–4 shipped

Phases 1–5 were measured against the *pre-v2* stylesheet and closed that matrix. Re-measuring the
delivered contract against seven enterprise token packages, Material 3, Radix Colors, shadcn and Apple
HIG converged on five more points — the first of which kills the most common instinct:

6. **One chromatic brand hue is the standard, not the exception.** Carbon, Spectrum, Polaris,
   Atlassian, Primer, Fluent and Lightning each ship exactly **one**. Material 3's `secondary` role is
   the source hue at chroma 16 — a tinted grey — and its chromatic second hue (`tertiary`) is
   documented by Google as discretionary. Apple is blunter: *"Apply color sparingly… Refrain from
   adding color to the background of multiple controls."* So `--primary` stays alone and
   `--accent`/`--secondary`/`--muted` stay neutral.
7. **"Accent" is a contested word.** It means a neutral hover surface in shadcn, *the dominant brand
   color* in Radix Themes, an expressive second hue in Material 3 (where it was renamed `tertiary`),
   and the native control tint in CSS `accent-color`. A system that says "we have no accent color" is
   usually describing a vocabulary collision, not a gap. Ours means #1 and is load-bearing in 27
   vendored utilities.
8. **Mature systems differentiate hues by *role*, not by adding meaning.** Atlassian ships 10 accent
   hues × 5 emphasis levels, Carbon `tag-*` 10 hues, Primer `label-*` 19 — all **non-semantic**, for
   tags, categories and series, under the rule *"Don't use an accent when the color has semantic
   meaning."* That is the family we lacked, and it is not a brand color.
9. **The third tier is contextual tokens, not aliases.** `--ds-background-brand-bold-hovered`,
   `--p-color-bg-fill-brand-selected`, `--slds-g-color-surface-container-2`. A system whose Tier 3 is
   only `@theme` aliases cannot express "a secondary button on a dark brand band" — which is exactly the
   defect we shipped. `--sidebar-*` is proof the pattern works when it exists.
10. **Ramps must be perceptually uniform, and the output format is a detail.** All seven systems ship
    sRGB hex; the perceptual work happens in *generation* (Spectrum → Leonardo/CAM02, Material → HCT,
    Tailwind v4 → OKLCH). Hand-picked hex drifts: our step 600 spans OKLab L .509 (brand) to .666
    (warning), so "the same step" is not the same weight.

`02` §8.1 is the matrix for this second pass, and phases 6 and 7 close it.

## 4. Decisions (locked — do not relitigate in a phase)

| # | Decision | Why |
| --- | --- | --- |
| D1 | Tokens first, components second, app code last | re-vendored components consume only the semantic contract; a correct contract means zero component edits, and zero edits is the proof the contract is complete |
| D2 | One accessible blue: `#1160C9` light / `#4A9FFF` dark, everywhere including the logo | user decision; contrast-verified |
| D3 | Re-vendor all components from upstream `shadcn@4.23.0`; local deviations only via `PATCHES.md` | user decision; upgrades become a no-op |
| D4 | `@theme inline` is the only Tier-3 mechanism | utilities emit `var(--x)`, so `.dark` remaps work without self-reference |
| D5 | Brand is punctuation, never a surface; the only large brand surface is one full-bleed `--surface-brand` band per page | pattern audit P1–P4; user direction |
| D6 | Neutral `--accent` / `--muted` for hover and sunken surfaces | kills the tint at the token level |
| D7 | Public pages (`/`, `/about`, `/contact`) are deleted and recreated from scratch; `/design-system` is improved, not recreated | public-pages audit; user direction |
| D8 | Full-bleed sections: `Section` paints edge-to-edge, container constrains content; boxes only for cards/grids/forms/modals | public-pages audit L1 |
| D9 | Rules live in `AGENTS.md` + `DESIGN.md` + `/design-system`, and regressions fail CI | the only way to stop agents re-learning the old pattern |
| D10 | The plan is this folder; the monolith `../design-system-v2-plan.md` is a pointer only | user direction: split for AI readability |
| D11 | **One chromatic brand hue.** `--primary` stays the only brand color; `--accent`, `--secondary` and `--muted` stay neutral, permanently. No phase may add a second brand hue or "make accent pop" | all seven audited enterprise systems ship exactly one; Material 3's `secondary` is the source hue at chroma 16 and its chromatic second hue is discretionary; and B5 records what happened here the last time `accent` was brand blue — every dropdown and calendar range turned solid blue |
| D12 | **Tier 3 means contextual tokens**, not just `@theme` aliases: `--secondary-on-brand`, `--foreground-on-brand-muted`, …, consumed through the `patterns/` lookup maps and never from a route class string | `--sidebar-*` is the shipped proof the pattern works; the 1.08:1 `secondary`-on-band defect is the shipped proof generic tokens cannot cover a dark band |
| D13 | **Regenerate the ramps to matched perceived lightness; keep the output as hex.** No `oklch()` in the shipped stylesheet | the imbalance is measured (step 600: brand L .509 vs warning L .666), but all seven systems ship sRGB hex and do the perceptual work in generation — notation is not the goal, the invariant is |
| D14 | **The label family is non-semantic and may never cross the status boundary.** `check:ds` rule 16 bans label-hue-as-status and status-as-label, and it is not waivable by `ds-allow` | Atlassian's rule; a lime "success" badge and a `warning-subtle` chip both destroy the meaning the status families were built to carry |
| D15 | **A check ships in the same PR as the values that satisfy it.** No guardrail lands pre-waived, and no PR introduces a check it does not pass | the `ds-allow` abuse recorded in `07` §4, and the reason the two `README.md` §Status defects moved from phase 5 to phase 6 |

## 5. Architecture after the plan

```
Tier 1  :root primitives          hex lives here only
Tier 2  :root / .dark semantics   themes are remappings
Tier 3  @theme inline             the only utility vocabulary (shadcn-compatible)
        + context/state tokens    --secondary-on-brand, --accent-selected, --label-* (P6/P7)
        app/components/ui/**      pristine upstream shadcn (PATCHES.md lists 5 deviations)
        app/components/patterns/** nine layout recipes (full-bleed Section, Hero, CtaBand, …)
        app/routes/**             pages composed from recipes + tokens
        DESIGN.md / AGENTS.md     the rules an agent reads first
        scripts/check-design-system.mjs + tests/design-tokens.test.ts   the enforcement
        scripts/generate-ramps.mjs + tests/ramp-uniformity.test.ts      the ramp invariant (P7)
```

## 6. Phase order and why

| Phase | File | PR | Depends on |
| --- | --- | --- | --- |
| 1 Token contract + re-vendor | [03](./03-phase-1-tokens-revendor.md) | 1 | — |
| 2 Migrate app code, delete shim | [04](./04-phase-2-migrate-app.md) | 2 | 1 |
| 3 Recipes + public-page recreation | [05](./05-phase-3-public-pages.md) | 3 | 2 |
| 4 Accessibility, font, polish | [06](./06-phase-4-a11y-polish.md) | 4 | 3 |
| 5 Docs, rules layer, guardrails | [07](./07-phase-5-docs-guardrails.md) | 5 | 3 |
| 6 Completeness pass | [08](./08-phase-6-completeness.md) | 6 | 5 |
| 7 Palette expansion | [09](./09-phase-7-palettes.md) | 7 | 6 |
| 8 Verification & release | [10](./10-phase-8-verify-release.md) | — | 4, 7 |

Each phase compiles and deploys alone. Phases 1–4 are **implemented and frozen** — do not reopen them.
Phase 5 no longer changes token values (see D15 and `07`'s header); phases 6 and 7 are the token work,
split so that *correcting* values is reviewable separately from *adding* palettes, and so phase 7 can
regenerate every ramp on a ladder that is already sound. Phase 1 ships a temporary `theme-*` shim so
Phase 2 can be a pure, reviewable codemod.

## 7. Sources

- [Figma — Design Token Architecture: Structuring for Scale](https://www.figma.com/resource-library/design-token-architecture/)
- [Adam Arant — Design token naming conventions: a 3-tier system that scales](https://adamarant.com/en/blog/design-token-naming-conventions-a-3-tier-system-that-scales)
- [Contentful — Design tokens explained: how to build a design token system](https://www.contentful.com/blog/design-token-system/)
- [Backbase DS — Semantic colors introduction](https://designsystem.backbase.com/latest/design-tokens/semantic-colors/introduction-K7Gq5Ylx)
- [HashiCorp Helios — Colors (surface / on-surface / faint status roles)](https://helios.hashicorp.design/foundations/colors)
- [Material Design 3 — Color roles](https://m3.material.io/styles/color/roles) and
  [Tone-based surfaces](https://m3.material.io/blog/tone-based-surface-color-m3)
- [NY State Design System — Color tokens](https://designsystem.ny.gov/tokens/)
- [USWDS — Design tokens](https://designsystem.digital.gov/design-tokens/)
- [Adobe Spectrum — Design tokens](https://spectrum.adobe.com/foundations/design-data/design-tokens)
- [fourzerothree — Semantic colour tokens in action](https://www.fourzerothree.in/p/semantic-colour-tokens-in-action)

### Second-pass sources (2026-10, §3.1)

- Material 3 role set and tonal derivation:
  [M3 in Compose](https://developer.android.com/develop/ui/compose/designsystems/material3),
  [Flutter `ColorScheme`](https://api.flutter.dev/flutter/material/ColorScheme-class.html) (tertiary is
  "left for makers to use at their discretion"),
  [`new-color-scheme-roles`](https://docs.flutter.dev/release/breaking-changes/new-color-scheme-roles),
  and the normative tone math in
  [`ColorSpec2021.kt`](https://github.com/material-foundation/material-color-utilities/blob/main/kotlin/dynamiccolor/ColorSpec2021.kt) /
  [`DynamicScheme.kt`](https://github.com/material-foundation/material-color-utilities/blob/main/kotlin/dynamiccolor/DynamicScheme.kt)
- [Apple HIG — Color](https://developer.apple.com/design/human-interface-guidelines/color) ("apply color
  sparingly"); no 60/30/10 rule exists in either Material or Apple — that ratio is trade press only
  ([IxDF](https://ixdf.org/literature/article/ui-color-palette))
- [shadcn theming](https://ui.shadcn.com/docs/theming) (`accent` = interactive hover/focus/active
  surfaces) vs [Radix Themes](https://www.radix-ui.com/themes/docs/theme/color) (`accent` = the dominant
  brand color) vs [MDN `accent-color`](https://developer.mozilla.org/en-US/docs/Web/CSS/accent-color) —
  the four-way collision behind D11
- [Radix Colors scale semantics](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale)
  (steps 1–3 backgrounds, 4 hovered, 5 active/selected, 9–10 solid, 11–12 text) and
  [composing a palette](https://www.radix-ui.com/colors/docs/palette-composition/composing-a-palette)
  (one app gray + one accent scale)
- Token packages read directly for the one-hue finding: `@carbon/themes@11.84.0`,
  `@spectrum-css/tokens@16.0.2`, `@shopify/polaris-tokens@9.4.2`, `@atlaskit/tokens@20.8.2`,
  `@primer/primitives@11.10.0`, `@fluentui/react-theme@9.2.2`, `@salesforce-ux/design-system@2.264.3`
- Perceptual color: [Tailwind v4 release (OKLCH default palette)](https://tailwindcss.com/blog/tailwindcss-v4),
  [CSS Color 4 / OKLCH](https://drafts.csswg.org/css-color/#ok-lch),
  [Evil Martians on why they quit RGB/HSL](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl),
  [Adobe's CAM02/Leonardo rework of Spectrum](https://adobe.design/ideas/reinventing-adobe-spectrum-s-colors),
  [ColorBrewer](https://colorbrewer2.org/)
- Accessibility: [WCAG 2.2](https://www.w3.org/TR/WCAG22/) —
  [1.4.11 non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html),
  [2.4.13 focus appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html),
  [2.5.8 target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html);
  APCA is **not** a compliance target — it was dropped from the WCAG 3 draft
  ([Roselli](http://adrianroselli.com/2026/04/wcag3-contrast-as-of-april-2026.html),
  [yatil](https://yatil.net/blog/wcag-3-is-not-ready-yet)); dark-mode specifics:
  [halation and astigmatism](https://www.levelaccess.com/blog/accessibility-for-people-with-astigmatism/),
  [Walter's dark-mode review](https://stephaniewalter.design/blog/dark-mode-accessibility-myth-debunked/)
- [W3C DTCG token format (2025.10 edition)](https://www.designtokens.org/TR/2025.10/format/) — prescribes
  no role vocabulary; tier layering is convention, so our grammar in `02` §2 is the contract
- [Style Dictionary](https://styledictionary.com/info/tokens/) and
  [Figma's token-sync guidance](https://www.figma.com/resource-library/design-tokens/) for the process
  layer; `data-theme`/`data-accent` per-tenant pattern per
  [Radix Themes](https://www.radix-ui.com/themes/docs/theme/color)
