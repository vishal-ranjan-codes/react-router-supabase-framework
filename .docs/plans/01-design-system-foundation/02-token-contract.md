# 02 — Token contract (complete, framework-grade)

This is the single source of truth for every design decision expressible as a value. Phase 1
implements it verbatim; the contrast test in Phase 5 asserts it. **§4.6–§4.8 and the rows marked
`[P6]`/`[P7]` in §6–§7 are the 2026-10 audit additions**, landed by phases 6 and 7 — they are part of
the contract now, but a phase-1-era `globals.css` correctly does not contain them.

Built against current best practice: a **three-tier architecture** (primitive → semantic →
component), semantic names that describe *intent* rather than appearance, status families with
solid/subtle/border/on-* roles, and a full non-colour token set (type, spacing, radius, elevation,
motion, z-index, sizing, opacity). See `01-context.md` §Research for sources.

---

## 1. The three tiers

```
Tier 1  PRIMITIVE   raw ramps, no meaning            :root only, hex lives here
Tier 2  SEMANTIC    intent names, theme-aware         :root + .dark, references Tier 1
Tier 3  COMPONENT   what utilities/components consume @theme inline, references Tier 2
```

- **Tier 1** never changes between themes. A ramp is data.
- **Tier 2** is where light/dark diverge: dark mode is a *remapping* of Tier 2 onto Tier 1, never a
  second set of hexes.
- **Tier 3** is the shadcn utility contract (`bg-primary`, `text-muted-foreground`, …) plus our
  additions. Nothing in app code may reference Tier 1 or invent values outside Tier 3. As shipped by
  phase 1 this tier was *aliases only* — the real component tier is §4.6, and it lands in phase 6.

Why this is the scalable answer for a *framework*: a consumer rethemes by overriding Tier 1 (new
brand ramp) or Tier 2 (new mapping). Components and pages never change. Adding a trend = adding a
semantic role, not editing components.

## 2. Naming rules

- Primitives: `--p-<ramp>-<step>` (e.g. `--p-brand-600`, `--p-neutral-150`). Steps are
  `0,50,100,150,200,300,400,450,500,600,700,750,800,850,900,950` for neutral; `50…950` for hues.
  Half-steps exist where the ladder needs a level the tens do not provide: 150 (light sunken/hover
  split), 750 and 850 (dark surfaces), **450** (added by phase 5 — dark carries three ink levels, and
  n-400/n-500 straddle the 4.5:1 text floor on a dark card with no room for a level between them).
- Semantics: flat, intent-first, shadcn-compatible where shadcn has a name
  (`background`, `card`, `primary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`,
  `sidebar-*`, `chart-*`). Additions follow `<category>-<role>[-<modifier>]`:
  `foreground-muted`, `success-subtle`, `border-strong`, `primary-on-subtle`.
- Status families always ship **five** roles: `<s>` (solid), `<s>-foreground` (on solid),
  `<s>-subtle` (tinted bg), `<s>-on-subtle` (text/icon on the tint), `<s>-border`.
- `[P6]` Context tokens use `<role>-on-<context>` — `secondary-on-brand`,
  `foreground-on-inverse-muted`. `[P6]` state roles use `<role>-<state>` — `accent-selected`,
  `border-disabled`. `[P7]` labels use `label-<hue>-<role>` and are the only place a **hue word** is
  legal in a semantic name, because the hue carries no meaning.
- No appearance words (`blue`, `light`, `dark-2`), no opacity in a name (`primary-100` is banned).
  `label-violet-subtle` is not an appearance word in `semantic` position: it names a *category slot*,
  the way `sidebar-primary` names a component slot.

---

## 3. Tier 1 — primitive ramps

`[P7]` The hexes below are **phase-1 values**. Phase 7 regenerates all six ramps at matched perceived
lightness — one target OKLab L per documented step, so that `brand-600` and `warning-600` carry equal
weight, and so adjacent neutral steps stay ≥ ΔL 0.03 apart — and keeps the output as hex, because every
enterprise system ships sRGB hex and does the perceptual work at generation time (Spectrum:
Leonardo/CAM02; Material: HCT). The target curve is **brand's own measured L**, not a freshly picked
scale (`09` §1): brand is already the most even ladder here, and D2 froze its 600. Grammar, step list
and ramp names do not change; `[P7]` adds ten label hues at three steps each (`-50/-200/-700`).
`--primary` staying recognisably `#1160c9` is the check that the generator did not move decision D2.

```css
:root {
  /* neutral */
  --p-neutral-0:#ffffff;  --p-neutral-50:#fafafa; --p-neutral-100:#f4f4f4; --p-neutral-150:#ececec;
  --p-neutral-200:#e0e0e0;--p-neutral-300:#c4c4c4;--p-neutral-400:#9e9e9e; --p-neutral-450:#888888;
  --p-neutral-500:#737373;--p-neutral-600:#595959;--p-neutral-700:#404040; --p-neutral-750:#333333;
  --p-neutral-800:#262626;--p-neutral-850:#1f1f1f;--p-neutral-900:#161616; --p-neutral-950:#0a0a0a;

  /* brand (blue) */
  --p-brand-50:#eef6ff; --p-brand-100:#d9e9ff; --p-brand-200:#b6d4ff; --p-brand-300:#7cb8ff;
  --p-brand-400:#4a9fff;--p-brand-500:#2f7ae0; --p-brand-600:#1160c9; --p-brand-700:#0e51aa;
  --p-brand-800:#0a3d7d;--p-brand-900:#0d2c50; --p-brand-950:#04121f;

  /* success (green) */
  --p-success-50:#ecfdf5; --p-success-100:#d1fae5; --p-success-200:#a7f3d0; --p-success-300:#6ee7b7;
  --p-success-400:#34d399;--p-success-500:#10b981; --p-success-600:#059669; --p-success-700:#047857;
  --p-success-800:#065f46;--p-success-900:#064e3b; --p-success-950:#022c22;

  /* warning (amber) */
  --p-warning-50:#fffbeb; --p-warning-100:#fef3c7; --p-warning-200:#fde68a; --p-warning-300:#fcd34d;
  --p-warning-400:#fbbf24;--p-warning-500:#f59e0b; --p-warning-600:#d97706; --p-warning-700:#a16207;
  --p-warning-800:#854d0e;--p-warning-900:#713f12; --p-warning-950:#451a03;

  /* danger (red) */
  --p-danger-50:#fef2f2; --p-danger-100:#fee2e2; --p-danger-200:#fecaca; --p-danger-300:#fca5a5;
  --p-danger-400:#f87171;--p-danger-500:#ef4444; --p-danger-600:#dc2626; --p-danger-700:#b91c1c;
  --p-danger-800:#991b1b;--p-danger-900:#7f1d1d; --p-danger-950:#450a0a;

  /* info (sky) */
  --p-info-50:#f0f9ff; --p-info-100:#e0f2fe; --p-info-200:#bae6fd; --p-info-300:#7dd3fc;
  --p-info-400:#38bdf8;--p-info-500:#0ea5e9; --p-info-600:#0284c7; --p-info-700:#0369a1;
  --p-info-800:#075985;--p-info-900:#0c4a6e; --p-info-950:#082f49;

  /* categorical, single-step */
  --p-chart-4-light:#7e22ce; --p-chart-4-dark:#c084fc;
}
```

## 4. Tier 2 — semantic tokens

### 4.1 Surfaces

| Token | Light | Dark | Use for | Never |
| --- | --- | --- | --- | --- |
| `--background` | n-100 | n-950 | page canvas | cards |
| `--background-subtle` | n-150 | n-900 | sunken wells, icon tiles, alt rows, "darker band" | hover |
| `--card` | n-0 | n-900 | raised panels, sticky header | page canvas |
| `--popover` | n-0 | n-850 | menus, dialogs, tooltips, toasts | inline sections |
| `--scrim` | `#00000080` | `#000000a3` | modal/dialog backdrop | anything else |
| `--surface-inverse` | n-850 | n-50 | neutral inverse band (footer, CTA) | small elements |
| `--surface-brand` | brand-800 | brand-900 | one full-bleed brand band per page (hero/CTA) | cards, tiles, hover |

### 4.2 Content (text & icons)

| Token | Light | Dark | Use for |
| --- | --- | --- | --- |
| `--foreground` | n-850 | n-50 | headings, primary text |
| `--foreground-muted` | n-600 | n-400 | body copy, secondary text (≥4.5:1) |
| `--foreground-subtle` | n-500 | n-450 | captions, metadata, decorative labels (text: ≥4.5:1 on `--card`/`--popover` only) |
| `--foreground-disabled` | n-400 | n-600 | disabled controls' labels |
| `--foreground-inverse` | n-50 | n-950 | text on `--surface-inverse` |
| `--foreground-on-brand` | n-0 | n-0 | text/icons on solid brand |
| `--link` | brand-600 | brand-400 | inline links |
| `--link-hover` | brand-700 | brand-300 | link hover |
| `--placeholder` | n-500 | n-400 | input placeholders (text, must pass 4.5:1) |

### 4.3 Brand / interactive

| Token | Light | Dark | Use for |
| --- | --- | --- | --- |
| `--primary` | brand-600 | brand-600 | **filled brand surfaces only** (buttons, badges) — never text |
| `--primary-hover` | brand-700 | brand-700 | primary hover |
| `--primary-active` | brand-800 | brand-800 | primary pressed |
| `--primary-subtle` | brand-50 | brand-950 | soft/tonal brand backgrounds (badges, soft buttons) |
| `--primary-on-subtle` | brand-700 | brand-300 | text/icon on `--primary-subtle` |
| `--primary-foreground` | n-0 | n-0 | text on solid `--primary` |
| `--primary-deep` | brand-800 | brand-900 | = `--surface-brand` (alias kept for shadcn-era docs) |
| `--primary-deep-foreground` | n-0 | brand-100 | text on the brand band |

The dark `--primary` ramp deliberately matches light. No single brand step can serve both roles:
white text on a fill needs ≥ brand-600, while brand-as-text on a near-black page needs ≤ brand-400.
So brand-coloured **text** (links, active nav, icons) takes `--link`, and `--primary` is reserved for
fills. The earlier dark ramp (brand-400 fill + brand-950 text) inverted that and read as black-on-blue.
| `--secondary` | n-150 | n-800 | secondary button bg |
| `--secondary-hover` | n-200 | n-750 | secondary hover |
| `--secondary-foreground` | n-850 | n-50 | text on secondary |
| `--muted` | n-150 | n-800 | sunken static surface (same value as `--background-subtle`) |
| `--muted-foreground` | n-600 | n-400 | = `--foreground-muted` (shadcn name) |
| `--accent` | n-150 | n-800 | hover/selected fill only — neutral, never brand |
| `--accent-foreground` | n-850 | n-50 | text on `--accent` |

### 4.4 Status families (success / warning / destructive / info)

Same five roles each; values shown as `<light> / <dark>`.

| Role | success | warning | destructive | info |
| --- | --- | --- | --- | --- |
| `<s>` solid | s-700 / s-400 | w-700 / w-400 | d-700 / d-400 | i-700 / i-300 |
| `<s>-foreground` | n-0 / s-950 | n-0 / w-950 | n-0 / d-950 | n-0 / i-950 |
| `<s>-subtle` | s-50 / s-950 | w-50 / w-950 | d-50 / d-950 | i-50 / i-950 |
| `<s>-on-subtle` | s-700 / s-300 | w-800 / w-300 | d-700 / d-300 | i-700 / i-300 |
| `<s>-border` | s-200 / s-800 | w-200 / w-800 | d-200 / d-800 | i-200 / i-800 |

(`destructive` is shadcn's name for danger; keep it. `--success`/`--warning`/`--info` solids already
exist today — they gain the other four roles.)

`--destructive-hover` (d-800 / d-300) is a sixth role that exists **only** for `destructive`:
shadcn's button and alert-dialog reference a hover fill for it. The other three families have no
hover role and must not grow one ad hoc.

### 4.5 Lines, focus, selection, data

| Token | Light | Dark | Use for |
| --- | --- | --- | --- |
| `--border` | n-200 | n-750 | card/section outlines (decorative) |
| `--border-subtle` | n-150 | n-800 | dividers inside cards |
| `--border-strong` | n-500 | n-500 | borders that *identify* a non-input control |
| `--input` | n-500 | n-500 | input/textarea/select resting border (≥3:1) |
| `--input-hover` | n-600 | n-400 | input hover |
| `--ring` | brand-600 | brand-300 | focus ring |
| `--ring-offset` | n-0 | n-900 | focus ring offset |
| `--selection` | brand-100 | brand-800 | `::selection` bg |
| `--selection-foreground` | n-850 | n-50 | `::selection` text |
| `--chart-1…5` | brand-600, s-600, w-600, chart4-light, d-600 | brand-400, s-400, w-400, chart4-dark, d-400 | data series |
| `--chart-grid` | n-200 | n-800 | chart gridlines |
| `--chart-label` | n-500 | n-400 | axis/tick labels |
| `--skeleton` | n-150 | n-800 | loading placeholders |
| `--sidebar-*` | n-0 / n-900 family (8 tokens, shadcn names) | | sidebar surfaces & states |

### 4.6 Context tokens `[P6]` — the component tier

§1 promises primitive → semantic → **component**. `--sidebar-*` is the only family that actually got
built, and it is the template: a surface that is hard by default gets its own slot for whatever sits
on it. These tokens exist because generic ones demonstrably failed — `--secondary` on a `brand-deep`
band is 1.08:1 in dark.

Rules: a context token is named `<role>-on-<context>`; it is consumed by `app/components/patterns/*`
through a lookup map (`SECTION_TONES`, `SECTION_MUTED`), **never** by a route class string; and a
context token may be theme-invariant when the context itself is dark in both themes — that is the
whole reason to have them.

| Token | Light | Dark | Sits on |
| --- | --- | --- | --- |
| `--secondary-on-brand` | n-150 | n-150 | `--surface-brand` — 8.99:1 light band, 11.90:1 dark band |
| `--secondary-on-brand-hover` | n-200 | n-200 | ditto |
| `--secondary-on-brand-foreground` | n-850 | n-850 | on the fill above — 13.95:1 |
| `--foreground-on-brand-muted` | b-200 | b-200 | secondary text on the band — 7.01 / 9.28, replaces `text-primary-deep-foreground/80` |
| `--border-on-brand` | b-600 | b-700 | outline/ghost controls on the band |
| `--foreground-on-inverse-muted` | n-300 | n-600 | replaces `text-foreground-inverse/80` |

### 4.7 State roles `[P6]`

Every fill gets the states a control can be in, not just hover. Light steps below; dark mirrors the
same *direction* of separation, and the ladder is set so that hover and selected never share a value.

| Token | Light | Dark | Notes |
| --- | --- | --- | --- |
| `--accent` | **n-200** (was n-150) | n-800 | hover. 1.32:1 on `--card`, 1.20:1 on `--background` |
| `--accent-selected` | **n-300** | n-750 | selected / pressed row. 1.74:1 on `--card`; 1.32 against hover, so the two states are distinguishable from each other |
| `--secondary` / `--secondary-hover` | **n-200 / n-300** | n-800 / n-750 | neutral button fill, off the sunken-surface step |
| `--surface-disabled` | n-100 | n-850 | disabled fill. `disabled:opacity-50` in vendored files stays (WCAG 1.4.3 exempts inactive controls); this token is for *solid* disabled fields where the faded border would drop under 3:1 |
| `--border-disabled` | n-150 | n-800 | ditto |
| `--primary-selected` | b-100 | b-800 | brand-relevant selection (active nav, selected tab) — distinct from `--primary-subtle`, which is for soft badges and rows |

### 4.8 Palettes `[P7]`

**Data — 12 ordered series.** Five is below every enterprise floor (Atlassian 8, Carbon 14, Primer 17,
Spectrum 20 shipped as `s2Categorical{6,12,16,20}`). `--chart-1…12` over the §3 ramps, ordered so the
first five are the maximally-distinguishable subset. Constraints by construction, not by patch:
≥ 3:1 on **both** `--card` and `--background` in both themes; adjacent ΔL ≥ 0.05; colorblind-verified;
**never** a status hue (`success/warning/danger/info` are meaning, series are identity); more than 8
series aggregate into `--chart-12` "Other". `--p-chart-4-light`/`-dark` — the orphan violet outside the
ramp grammar — is absorbed and deleted.

Plus two closed sets that do not exist today: `--chart-seq-1…7` (sequential, one hue, L 0.90→0.25) and
`--chart-div-neg-3…1 / -mid / -pos-1…3` (diverging, neutral midpoint).

**Labels — 10 non-semantic hues × 4 roles.** `violet, indigo, teal, cyan, pink, lime, orange, brown,
cool-gray, gray`. Primitives `--p-<hue>-50/-200/-700`; semantics
`--label-<hue>-{subtle,on-subtle,border,solid}` + `--label-<hue>-foreground`.

The boundary is a rule, not a convention: **these hues mean nothing**, so they may never be used for
status, and status colors may never be used for a label. Atlassian's wording is the contract text:
*"Don't use an accent when the color has semantic meaning."* Enforced by `check:ds` rule 16, which is
not waivable by `ds-allow`.

**No second brand hue exists in this contract, at any tier.** Of seven audited enterprise systems every
one ships exactly one chromatic brand hue; Material 3's `secondary` is a chroma-16 tint of the source
hue and its chromatic second hue (`tertiary`) is documented as discretionary. `--primary` is the only
brand color; `--accent`, `--secondary` and `--muted` stay neutral. See `01-context.md` D11.

---

## 5. Tier 3 — the generated contract (`@theme inline`)

`@theme inline` maps Tier 2 → utility names. This is exactly the shadcn vocabulary plus our
additions, so re-vendored components need zero edits:

```
--color-background, -foreground, -card, -card-foreground, -popover, -popover-foreground,
--color-primary, -primary-foreground, -primary-hover, -primary-active, -primary-subtle,
  -primary-on-subtle, -primary-deep, -primary-deep-foreground,
--color-secondary(+fg,-hover), -muted(+fg), -accent(+fg),
--color-destructive(+fg,-hover,-subtle,-on-subtle,-border),
--color-success(...5), -warning(...5), -info(...5),
--color-border, -border-subtle, -border-strong, -input, -input-hover, -ring, -ring-offset,
--color-background-subtle, -surface-inverse, -surface-brand, -scrim,
--color-foreground-muted, -foreground-subtle, -foreground-disabled, -foreground-inverse,
  -foreground-on-brand, -link, -link-hover, -placeholder,
--color-selection, -selection-foreground, -skeleton,
--color-chart-1…5, -chart-grid, -chart-label, --color-sidebar-* (8),
--radius-xs…2xl, --shadow-card, -pop, --text-display…eyebrow (+ line-heights, tracking),
--font-sans, -mono, --transition-duration-fast/base/slow, --ease-standard/emphasized/enter,
--z-index-sticky/dropdown/overlay/modal/popover/toast,
--size-control-sm/md/lg, -icon-sm/md/lg, -touch-min,
--spacing-section-sm/md/lg, --animate-accordion-down/up
```

`[P6]` adds `--color-secondary-on-brand(+hover,-foreground)`, `--color-foreground-on-brand-muted`,
`--color-foreground-on-inverse-muted`, `--color-border-on-brand`, `--color-accent-selected`,
`--color-surface-disabled`, `--color-border-disabled`, `--color-primary-selected`.
`[P7]` adds `--color-chart-6…12`, `--color-chart-seq-1…7`, `--color-chart-div-*`, and
`--color-label-<hue>-{subtle,on-subtle,border,solid,foreground}` (50 names). Tailwind's `color-`
namespace generates all of them, so no `@source inline` entry is needed for the new families — the
existing inline list stays as the Tier-3 compile guarantee for the names it already carries.

Three names differ from the earlier draft because Tailwind v4 only generates utilities from its own
theme namespaces — a token outside them is inert:

| Draft name | Shipped name | Why |
| --- | --- | --- |
| `--duration-*` | `--transition-duration-*` | the `duration-*` utility namespace |
| `--z-*` | `--z-index-*` | the `z-*` utility namespace |
| `--space-section-*` | `--spacing-section-*` | the spacing scale, so `py-section-md` resolves |

`--alpha-hover/pressed/scrim/scrim-strong` are **not** `@theme` values: they are plain `:root`
constants consumed inside `rgb()` / `color-mix()` and must not emit utilities. `--radius-full`
stays with Tailwind's default theme rather than being restated here.

Rules: `@theme inline` only (utilities emit `var(--x)` so `.dark` remaps work); no self-references;
every Tier-2 key present in **both** `:root` and `.dark` (asserted by `tests/design-tokens.test.ts`).

## 6. Non-colour tokens (values)

| Group | Tokens |
| --- | --- |
| Radius | xs .25rem · sm .375rem · md .5rem · lg .625rem (base) · xl .75rem · 2xl 1rem (`full` comes from Tailwind's default theme) |
| Section spacing | `--spacing-section-sm` 3rem · md 4.5rem · lg 6rem (replaces ad-hoc `py-16/24`) |
| Type sizes | display 3.75/1.08 · h1 2.25/2.75 · h2 1.75/2.25 · h3 1.375/1.75 · h4 1.125/1.5 · h5 1/1.5 · h6 .875/1.25 · body-lg 1.125/1.7 · body 1/1.6 · body-sm .875/1.45 · body-xs .8125/1.35 · eyebrow .75/1 + tracking .08em uppercase |
| Type families | `--font-sans` Inter var · `--font-mono` ui-monospace stack (code blocks, kbd) |
| Elevation | `--shadow-card` 0 1px 2px rgb(0 0 0/.06), 0 1px 3px rgb(0 0 0/.10) · `--shadow-pop` 0 4px 6px -1px rgb(0 0 0/.10), 0 12px 24px -8px rgb(0 0 0/.18) |
| Motion | duration fast 120ms · base 200ms · slow 360ms · ease-standard cubic-bezier(.2,0,0,1) · ease-emphasized cubic-bezier(.05,.7,.1,1) · ease-enter cubic-bezier(0,.4,.2,1) |
| Z-index | sticky 40 · dropdown 50 · overlay 60 · modal 70 · popover 80 · toast 90 |
| Sizing | control sm 2rem · md 2.5rem · lg 2.75rem · icon sm 1rem · md 1.25rem · lg 1.5rem · touch-min 2.75rem |
| Alpha | `[P6]` scrim .50 → light `--scrim` · scrim-strong .64 → dark `--scrim`. **`hover` .06 and `pressed` .10 are deleted** — nothing consumed them and they encode the opacity-overlay model D6 rejected |

## 7. Contrast policy

- Every text pair ≥ 4.5:1; every UI boundary (input, focus ring, control-identifying border) and
  every chart series ≥ 3:1; decorative `--border` exempt by design.
- The **pair manifest** lives in `app/lib/design-system.ts` (`CONTRAST_PAIRS`) — one list that
  `tests/design-tokens.test.ts` asserts and `/design-system` prints, so the style guide can never
  teach a usage the suite rejects. 55 pairs per theme (42 text, 8 boundary, 5 chart series), all
  green since phase 5, plus five structural rules: Tier-2 key parity between `:root` and `.dark`,
  every Tier-2 value being a `--p-*` reference or a literal colour, every `--p-*` reference hitting a
  declared step, no hex outside those two blocks, and no `--color-x: var(--color-x)` self-reference.
- The manifest is one-directional (`--foreground` on `--card`, never both) and each row carries its
  own `kind`, because a boundary may not claim the text floor and vice versa.
- Two steps moved under the rule below when the manifest first ran, and the tables above already
  carry the corrected values: `--border-strong` light n-400 → **n-500** (2.68:1 → 4.74:1 on
  `--card`) and `--placeholder` dark n-500 → **n-400** (3.82:1 → 6.75:1 on `--card`).
- **Focus chain `[P6]`.** One color can never contrast with itself, and `--ring` and `--primary` are
  both `--p-brand-600` — the ring measures **1.00:1 against the primary button it surrounds**, so the
  keyboard indicator on the most important control is invisible regardless of alpha. The rule is
  therefore a *chain*, not a value: `--ring` ≥ 3:1 against `--ring-offset`, **and** `--ring-offset`
  ≥ 3:1 against the surface the control sits on. Both links already hold on today's tokens (5.93 /
  5.93) — the gap simply is not painted. `--ring-offset` is currently defined in both themes and
  consumed nowhere, while `dialog.tsx`/`sheet.tsx` use `ring-offset-2` and buttons do not.
- Formerly open in phase 5, now assigned: `--foreground-subtle` dark 3.82:1 on `--card` was resolved
  in phase 5 by **adding a ramp step rather than flattening the ladder** — moving it to n-400 would
  have made it identical to dark `--foreground-muted` (and a third copy of `--placeholder`), so dark
  takes the new `--p-neutral-450` (`#888888`, 5.10:1 on `--card`, 4.65:1 on `--popover`). Reclassifying
  it as decorative was the other option on the table and was rejected: the same token name would then
  mean "readable text" in light and "not readable" in dark. `--surface-brand` on-* tokens are
  §4.6 and land in phase 6 (`--foreground-on-brand` itself already measures 14.07:1 in dark);
  `--chart-3` at 2.90:1 on `--background` in light is not patched — it becomes a construction rule of
  the §4.8 data palette in phase 7. `--scrim` and the `*-border` status roles still need alpha
  compositing before they can be measured; phase 6 makes `--scrim` derive from `--alpha-scrim*`, which
  gives the compositor something to work with.
- New status pairs (e.g. `warning-on-subtle` on `warning-subtle`) are chosen from the ramps to clear
  4.5:1 and are asserted by the manifest; if a pair fails at implementation time, adjust the *step*,
  never the rule.

## 8. Gap matrix — what today's `globals.css` has vs this contract

| Category | Today | Contract | Verdict |
| --- | --- | --- | --- |
| Primitive ramps | none (hex inline in `:root`) | 6 ramps | **missing** |
| Surfaces | background, card, popover | + background-subtle, scrim, surface-inverse, surface-brand | **4 missing** |
| Content levels | foreground, muted-foreground | + subtle, disabled, inverse, on-brand, link, link-hover, placeholder | **7 missing** |
| Brand states | primary (+ undefined `primary-100`) | + hover, active, subtle, on-subtle, deep, deep-foreground | **6 missing** |
| Status families | 4 solids only | 4 × 5 roles | **16 missing** |
| Lines/focus | border, input, ring | + border-subtle, border-strong, input-hover, ring-offset | **4 missing** |
| Selection / skeleton / chart extras | none | selection×2, skeleton, chart-grid, chart-label | **6 missing** |
| Radius | single `--theme-rounded` | 7-step scale | **missing** |
| Type | h1–h6 (colour+weight bundled), no display/eyebrow/mono | full scale + families | **partial** |
| Spacing / section rhythm | ad-hoc `py-*` | section scale | **missing** |
| Elevation | inset-shadow hacks | shadow tokens | **missing** |
| Motion | none (tw-animate-css defaults) | duration + easing tokens | **missing** |
| Z-index | hard-coded `z-50` | 6 named levels | **missing** |
| Sizing / touch | ad-hoc `w-9 h-9` | control/icon/touch tokens | **missing** |
| Alpha / scrim | 26 ad-hoc opacity vars | 4 named alphas | **missing** |

**Answer to "does it have everything a design system should?":** no. Today it ships ~35 semantic
colour tokens and almost no non-colour tokens; the contract above (~120 semantic + 40 non-colour)
is what a framework-grade system needs so that *any* future page or trend is expressible without
new hexes.

## 8.1 Second audit — what §3–§7 still left out (2026-10)

The matrix above was measured against the *pre-v2* stylesheet, and phases 1–4 closed it. Re-measuring
the delivered contract against seven enterprise token packages plus Material 3, Radix and shadcn found
a second, smaller class of gaps. None of them is a missing *brand* color — all seven systems ship
exactly one chromatic brand hue.

| Gap | Evidence | Closed by |
| --- | --- | --- |
| Four Tier-2 roles resolve to one value in light mode | `background-subtle`/`muted`/`accent`/`secondary` all n-150; `bg-accent` = 1.18:1 on card, 1.07:1 on page | §4.7, **phase 6** |
| No component tier despite §1 promising one | `--secondary` on `--surface-brand` = 1.08:1; only `--sidebar-*` exists | §4.6, **phase 6** |
| No `-selected`, no disabled fill/border | hover on 5 tokens, active on 1; upstream falls back to `disabled:opacity-50` | §4.7, **phase 6** |
| Dead alpha + dead `--ring-offset` | `--alpha-hover/pressed` and `--ring-offset` consumed by nothing | §4.6/§7, **phase 6** |
| Focus indicator invisible on brand-filled controls | `--ring` = `--primary` = b-600 → 1.00:1 | §7 chain rule, **phase 6** |
| `color-scheme` never declared; no `forced-colors` block | native selects/date pickers/scrollbars stay light; `ring-*` is unpainted in contrast themes | §10, **phase 6** |
| Two opacity-as-text hacks in the patterns layer | `Section.tsx:32-33` `…/80` | §4.6, **phase 6** |
| 5 chart series, status hues double-booked as series, orphan `--p-chart-4-*` | Atlassian 8 / Carbon 14 / Primer 17 / Spectrum 20 | §4.8, **phase 7** |
| No sequential or diverging data ramps | any dashboard with a heat scale or a ± measure | §4.8, **phase 7** |
| No non-semantic label family | Atlassian 10 hues × 5 emphasis; Carbon `tag-*` 10; Primer `label-*` 19 | §4.8, **phase 7** |
| Ramps not perceptually uniform | step 600 L: brand .509 / warning .666; neutral n-50→n-100 ΔL .018 | §3, **phase 7** |
| Gated: warm/cool neutrals, avatar palette, gradient slots, syntax tokens, `link-visited`, `data-theme` multi-brand, `prefers-contrast` | real in the survey, no consumer here yet | `09-phase-7-palettes.md` §5 — promoted only by trigger |

## 9. Theming & scalability

- A new brand = replace the `--p-brand-*` ramp (11 values). A new mood = remap Tier 2. Both are
  `:root`-only edits; the retheme drill in `10-phase-8-verify-release.md` proves it.
- Additional themes (high-contrast, brand variants) are extra Tier-2 blocks (`.theme-hc { … }`);
  utilities and components are untouched.
- Consumers may add product-specific semantic tokens in their own Tier-2 block; they must not add
  Tier-3 utilities that bypass it (enforced by `check:ds`).
- **Multi-brand / per-tenant is a Tier-2 remap scoped to an attribute**, e.g.
  `[data-brand="acme"] { --primary: …; --surface-brand: … }` — Radix Themes' `data-accent`/`data-gray`
  and Fluent's swappable `BrandVariants` both work this way. It is *not* a second set of primitives and
  not a second build. Gated until a real second tenant exists (`09` §5).
- `.dark` stays the mechanism for *mode*; the two axes must not be conflated into one class list.

## 10. Platform and environment signals `[P6]`

Not tokens — declarations the token system depends on, and the two that are missing both produce
visible defects no contrast test can see.

| Signal | Requirement | Why |
| --- | --- | --- |
| `color-scheme` | `light` in `:root`, `dark` in `.dark` | Theme is applied by toggling a class (`app/lib/theme.ts:23`), so the CSS property is the only mechanism. Without it, native `<select>` popups, `<input type=date>` pickers, scrollbars and `accent-color` fills keep light-mode chrome on a dark page. Not screenshot-testable in Linux CI — verify in a real browser. |
| `@media (forced-colors: active)` | restore `outline: 2px solid CanvasText` on `:focus-visible` | In contrast themes `ring-*` is a `box-shadow` (not painted) and borders are forced to system colors, so the §7 focus chain disappears entirely. Playwright cannot assert this; it is a manual phase-8 row. |
| `prefers-reduced-motion` | already handled in `@layer base` | No change; recorded so the next audit does not re-flag it. |
| `prefers-contrast` | not implemented | A high-contrast Tier-2 block is the correct shape (§9), and the trigger is a report, not a survey row. Gated. |
