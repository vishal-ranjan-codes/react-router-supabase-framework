# DESIGN.md — the token contract, in prose

This file is the human-readable half of the contract. The machine-readable half is
[`app/lib/design-system.ts`](app/lib/design-system.ts): it names every Tier-2 token, what it is
for, what it is never for, and which contrast pairs a test must clear. Three consumers read it —
this document, the style guide route ([`app/routes/design-system.tsx`](app/routes/design-system.tsx),
served at `/design-system`), and [`tests/design-tokens.test.ts`](tests/design-tokens.test.ts) — and
[`scripts/check-design-system.mjs`](scripts/check-design-system.mjs) enforces it in CI. They cannot
drift apart, because they do not each hold a copy.

Values are not transcribed here either. Colour lives in
[`app/globals.css`](app/globals.css); this file names the Tier-1 _step_ a token resolves to
(`n-600`, `brand-800`) so a row stays true when a hex is retuned. Measured ratios are printed by
`/design-system`, which computes them in your browser from the shipped stylesheet.

Read [`AGENTS.md`](AGENTS.md) first if you are an agent about to write UI. It is the seven-rule
excerpt of this file.

---

## 1. Principles

**Tokens over classes.** A page says `bg-card`, never a hex, never `bg-primary/5`, never
`opacity` to fake a surface. If the vocabulary has no word for what you want, the vocabulary is
incomplete — that is a token change, not a licence to write a hex.

**Three tiers, one direction.**

```
Tier 1  --p-*            primitives: hex lives here and nowhere else, theme-invariant
Tier 2  --*              semantics: :root and .dark remap the same name onto a different step
Tier 3  @theme inline    utilities: bg-card / text-h2 / shadow-card, the only layer app code writes
```

Tier 3 is `@theme inline` on purpose (decision D4): the utility emits `var(--card)` directly, so the
`.dark` remap wins without a token ever referencing itself.

**Upstream over forks.** `app/components/ui/**` is vendored shadcn and is never hand-edited. Wrap
it, or record the deviation in `PATCHES.md`.

**Brand is punctuation.** Buttons, links, active nav, badges, the focus ring, chart series, one icon
glyph. The only large brand surface is one full-bleed `Section tone="brand-deep"` per page — brand
stays under roughly 10% of the viewport.

**Exactly one chromatic hue** (decision D11). `--primary` is the only brand colour. `--secondary`,
`--accent` and `--muted` are neutral _by decision_: `bg-accent` is the hover/selected surface, not
an accent colour. Hues for tags and chart series are a separate, non-semantic family (`--label-*`,
`--chart-*`) that arrives with phases 6–7; until it exists, do not improvise one with an alpha.

**Contrast is a test.** 55 pairs, both themes, asserted by `npm test` and printed live on
`/design-system`. A pair that fails fails the suite with its name and its actual ratio. Nobody has
to trust a number written down in a document.

---

## 2. The surface ladder

Six steps of elevation, each with a job. Pick a surface by asking what the element is _doing_, not
what it looks like.

| Token                 | Light       | Dark        | Use for                                           | Never               |
| --------------------- | ----------- | ----------- | ------------------------------------------------- | ------------------- |
| `--background`        | n-100       | n-950       | page canvas                                       | cards               |
| `--background-subtle` | n-150       | n-900       | sunken wells, icon tiles, alt rows, "darker band" | hover               |
| `--card`              | n-0         | n-900       | raised panels, sticky header                      | page canvas         |
| `--popover`           | n-0         | n-850       | menus, dialogs, tooltips, toasts                  | inline sections     |
| `--scrim`             | `#00000080` | `#000000a3` | modal/dialog backdrop                             | anything else       |
| `--surface-inverse`   | n-850       | n-50        | neutral inverse band (footer, CTA)                | small elements      |
| `--surface-brand`     | brand-800   | brand-900   | one full-bleed brand band per page (hero/CTA)     | cards, tiles, hover |

### Which token do I want?

Written as questions on purpose: phase 6 adds context tokens (`--secondary-on-brand`,
`--surface-disabled`), and a new row has to slot in without restructuring the prose. This list is
`SURFACE_QUESTIONS` — the same array the style guide renders.

- **Is this the page itself?** `bg-background`, or `Section tone="page"`.
- **Does it sit raised above the page?** `bg-card border border-border shadow-card`.
- **Does it sit sunken into the page?** `bg-background-subtle` — static; `Section tone="sunken"` for
  a band.
- **Is it a response to the pointer or the keyboard?** `bg-accent` + `text-accent-foreground`.
  Neutral, never brand.
- **Does it float over the page until it is dismissed?** `bg-popover` for the panel, `bg-scrim` for
  the backdrop.
- **Is it the one full-bleed emphasis band?** `Section tone="brand-deep"` — once per page.
- **Do you want a tinted brand surface?** `bg-primary-subtle` + `text-primary-on-subtle` for a badge
  or a tonal button. Never `bg-primary/<alpha>`, which is the pattern this system removed.
- **Is it a status?** One family, five roles: `<status>-subtle` + `-on-subtle` + `-border`, or the
  solid pair. Never a label or chart hue (decision D14).
- **Does something sit on a brand or inverse band?** `text-primary-deep-foreground` /
  `text-foreground-inverse` today; the context tokens arrive with phase 6.

---

## 3. Token tables

`Light` / `Dark` name the Tier-1 step each theme resolves to. `Floor` is the WCAG bar the pair must
clear — 4.5:1 for text, 3:1 for a boundary a user has to find or a chart series. The measured number
is on `/design-system#colors`; the pair list is `CONTRAST_PAIRS`.

### 3.1 Content — text and icons

| Token                   | Light     | Dark      | Use                                              | Never                                                             | Floor                                        |
| ----------------------- | --------- | --------- | ------------------------------------------------ | ----------------------------------------------------------------- | -------------------------------------------- |
| `--foreground`          | n-850     | n-50      | headings, primary text                           | —                                                                 | 4.5:1 on every surface                       |
| `--foreground-muted`    | n-600     | n-400     | body copy, secondary text                        | —                                                                 | 4.5:1 on background, card, background-subtle |
| `--foreground-subtle`   | n-500     | n-450     | captions and metadata on a card or popover       | the page canvas or a sunken well — use `--foreground-muted` there | 4.5:1 on card, popover only                  |
| `--foreground-disabled` | n-400     | n-600     | labels of disabled controls                      | any text that must be readable                                    | exempt (WCAG 1.4.3, inactive controls)       |
| `--foreground-inverse`  | n-50      | n-950     | text on `--surface-inverse`                      | —                                                                 | 4.5:1                                        |
| `--foreground-on-brand` | n-0       | n-0       | text and icons on a solid brand fill or the band | —                                                                 | 4.5:1                                        |
| `--link`                | brand-600 | brand-400 | inline links — this is the brand-as-text role    | `--primary`, which is a fill                                      | 4.5:1 on background, card                    |
| `--link-hover`          | brand-700 | brand-300 | link hover                                       | —                                                                 | 4.5:1 on background, card                    |
| `--placeholder`         | n-500     | n-400     | input placeholder text                           | body copy                                                         | 4.5:1 on card                                |

`--foreground-subtle` sits on its own dark half-step (n-450) because n-400 is already
`--foreground-muted` there, and n-500 measures 3.82:1 on a card — not a text token. That is the
single-step move this phase made; the duplicate-step guard that proves it is rule 10 in phase 6.

### 3.2 Brand and interaction

| Token                       | Light     | Dark      | Use                                                             | Never                                   |
| --------------------------- | --------- | --------- | --------------------------------------------------------------- | --------------------------------------- |
| `--primary`                 | brand-600 | brand-600 | **filled brand surfaces only** — buttons, badges                | text, and never a surface at an alpha   |
| `--primary-hover`           | brand-700 | brand-700 | primary hover                                                   | —                                       |
| `--primary-active`          | brand-800 | brand-800 | primary pressed                                                 | —                                       |
| `--primary-subtle`          | brand-50  | brand-950 | soft/tonal brand background: badge, tonal button                | a page or section surface               |
| `--primary-on-subtle`       | brand-700 | brand-300 | text or icon on `--primary-subtle`                              | —                                       |
| `--primary-foreground`      | n-0       | n-0       | text on solid `--primary`                                       | —                                       |
| `--primary-deep`            | brand-800 | brand-900 | alias of `--surface-brand`, kept for the shadcn-era name        | —                                       |
| `--primary-deep-foreground` | n-0       | brand-100 | text on the brand band                                          | —                                       |
| `--secondary`               | n-150     | n-800     | secondary button fill                                           | a brand surface                         |
| `--secondary-hover`         | n-200     | n-750     | secondary hover                                                 | —                                       |
| `--secondary-foreground`    | n-850     | n-50      | text on secondary                                               | —                                       |
| `--muted`                   | n-150     | n-800     | sunken static surface (shadcn's name for `--background-subtle`) | hover                                   |
| `--muted-foreground`        | n-600     | n-400     | `= --foreground-muted`, under the shadcn name                   | —                                       |
| `--accent`                  | n-150     | n-800     | hover and selected fill only — neutral, never brand             | an accent colour: it is a surface (D11) |
| `--accent-foreground`       | n-850     | n-50      | text on `--accent`                                              | —                                       |

The dark `--primary` ramp deliberately matches light. No single brand step serves both roles: white
text on a fill needs ≥ brand-600, while brand-as-text on a near-black page needs ≤ brand-400 — which
is why `--link`, `--ring` and `--chart-*` move to the bright steps and the fills do not.

### 3.3 Status families

Four families — `success`, `warning`, `destructive`, `info` — each shipping the same five roles, so
a new family cannot quietly arrive with three. Solid is the fill; subtle is the tinted panel.

| Role                    | Light step                | Dark step          | Use                                |
| ----------------------- | ------------------------- | ------------------ | ---------------------------------- |
| `--<status>`            | *-700 (info: -700)        | *-400 (info: -300) | solid fill: badge, alert icon      |
| `--<status>-foreground` | n-0                       | *-950              | text on the solid fill             |
| `--<status>-subtle`     | *-50                      | *-950              | tinted panel: alert, inline notice |
| `--<status>-on-subtle`  | _-700 (_-800 for warning) | *-300              | text and icon on the subtle panel  |
| `--<status>-border`     | *-200                     | *-800              | outline of a subtle panel          |

`destructive` is the one family with a sixth role, `--destructive-hover` (d-800 / d-300), because
upstream's button and alert-dialog reference a hover fill for it.

A status is never a label hue and a label hue is never a status (decision D14). The lime badge and
the `warning-subtle` chip both destroy the meaning the family was built to carry.

### 3.4 Lines, focus and selection

| Token                    | Light     | Dark      | Use                                            | Never                                                     |
| ------------------------ | --------- | --------- | ---------------------------------------------- | --------------------------------------------------------- |
| `--border`               | n-200     | n-750     | card and section outlines                      | a boundary a user has to find — that is `--border-strong` |
| `--border-subtle`        | n-150     | n-800     | dividers inside cards                          | —                                                         |
| `--border-strong`        | n-500     | n-500     | borders that identify a non-input control      | —                                                         |
| `--input`                | n-500     | n-500     | resting border of an input, textarea or select | —                                                         |
| `--input-hover`          | n-600     | n-400     | input hover                                    | —                                                         |
| `--ring`                 | brand-600 | brand-300 | focus ring                                     | a decorative outline                                      |
| `--ring-offset`          | n-0       | n-900     | gap colour of the focus ring                   | consumed by the focus chain in phase 6                    |
| `--selection`            | brand-100 | brand-800 | `::selection` background                       | —                                                         |
| `--selection-foreground` | n-850     | n-50      | `::selection` text                             | —                                                         |

### 3.5 Data and loading

Five series today; phase 7 expands the family to twelve.

| Token           | Light       | Dark        | Use                  | Never                                        |
| --------------- | ----------- | ----------- | -------------------- | -------------------------------------------- |
| `--chart-1`     | brand-600   | brand-400   | series 1 (brand)     | a status meaning — series are identity (D14) |
| `--chart-2`     | success-600 | success-400 | series 2 (green)     | as above                                     |
| `--chart-3`     | warning-600 | warning-400 | series 3 (amber)     | as above                                     |
| `--chart-4`     | `#7e22ce`   | `#c084fc`   | series 4 (violet)    | as above                                     |
| `--chart-5`     | danger-600  | danger-400  | series 5 (red)       | as above                                     |
| `--chart-grid`  | n-200       | n-800       | gridlines            | —                                            |
| `--chart-label` | n-500       | n-400       | axis and tick labels | the page canvas — charts are drawn on a card |
| `--skeleton`    | n-150       | n-800       | loading placeholder  | —                                            |

`--chart-4` is the one series with a dedicated Tier-1 pair (`--p-chart-4-light/dark`) because no
violet ramp is shared with a status family.

### 3.6 Sidebar

The shipped proof that a component tier of tokens works: the sidebar needs its own remap because it
is a distinct canvas, and generic tokens cannot cover it.

| Token                               | Light           | Dark                  |
| ----------------------------------- | --------------- | --------------------- |
| `--sidebar` / `-foreground`         | n-0 / n-850     | n-900 / n-50          |
| `--sidebar-primary` / `-foreground` | brand-600 / n-0 | brand-400 / brand-950 |
| `--sidebar-accent` / `-foreground`  | n-150 / n-850   | n-800 / n-50          |
| `--sidebar-border`                  | n-200           | n-750                 |
| `--sidebar-ring`                    | brand-600       | brand-300             |

---

## 4. Typography

One variable font, Inter, self-hosted at `/fonts/InterVariable.woff2`. The scale is a **size**
vocabulary, never a colour: `text-h2` says how big, `text-foreground` says what colour, and the base
layer paints headings `text-foreground` so the two never collide.

| Utility        | Use               | Size      | Line height          |
| -------------- | ----------------- | --------- | -------------------- |
| `text-display` | hero heading only | 3.75rem   | 1.08                 |
| `text-h1`      | page title        | 2.25rem   | 2.75rem              |
| `text-h2`      | section title     | 1.75rem   | 2.25rem              |
| `text-h3`      | subsection        | 1.375rem  | 1.75rem              |
| `text-h4`      | card title        | 1.125rem  | 1.5rem               |
| `text-h5`      | small heading     | 1rem      | 1.5rem               |
| `text-h6`      | overline          | 0.875rem  | 1.25rem              |
| `text-body-lg` | lede, intro copy  | 1.125rem  | 1.7rem               |
| `text-body`    | default prose     | 1rem      | 1.6rem               |
| `text-body-sm` | dense UI text     | 0.875rem  | 1.45rem              |
| `text-body-xs` | fine print        | 0.8125rem | 1.35rem              |
| `text-eyebrow` | uppercase kicker  | 0.75rem   | 1rem, tracking .08em |

Weight is `font-medium` / `font-semibold`, never a synthetic bold. Long-form headings take
`text-balance`.

---

## 5. Radius, spacing, elevation, motion

| Group          | Token                         | Value                       | Use                                              |
| -------------- | ----------------------------- | --------------------------- | ------------------------------------------------ |
| Radius         | `--radius-xs`                 | .25rem                      | chips, inner fills                               |
|                | `--radius-sm`                 | .375rem                     | small controls                                   |
|                | `--radius-md`                 | .5rem                       | buttons, inputs                                  |
|                | `--radius-lg`                 | .625rem                     | **the base radius**: cards                       |
|                | `--radius-xl`                 | .75rem                      | large panels                                     |
|                | `--radius-2xl`                | 1rem                        | modals, heroes                                   |
| Section rhythm | `--spacing-section-sm`        | 3rem                        | PageHeader, tight bands                          |
|                | `--spacing-section-md`        | 4.5rem                      | default Section                                  |
|                | `--spacing-section-lg`        | 6rem                        | hero                                             |
| Elevation      | `--shadow-card`               | two 1px layers              | card, raised section                             |
|                | `--shadow-pop`                | 4px + 12px                  | popover, dialog                                  |
| Motion         | `--transition-duration-fast`  | 120ms                       | colour and border change                         |
|                | `--transition-duration-base`  | 200ms                       | default                                          |
|                | `--transition-duration-slow`  | 360ms                       | sheet and drawer open                            |
|                | `--ease-standard`             | cubic-bezier(.2,0,0,1)      | most transitions                                 |
|                | `--ease-emphasized`           | cubic-bezier(.05,.7,.1,1)   | entrance                                         |
|                | `--ease-enter`                | cubic-bezier(0,.4,.2,1)     | overlay in                                       |
| Stacking       | `--z-index-sticky` … `-toast` | 40 · 50 · 60 · 70 · 80 · 90 | header, dropdown, scrim, dialog, popover, sonner |
| Sizing         | `--size-control-sm/md/lg`     | 2rem / 2.5rem / 2.75rem     | control heights                                  |
|                | `--size-icon-sm/md/lg`        | 1rem / 1.25rem / 1.5rem     | glyph sizes                                      |
|                | `--size-touch-min`            | 2.75rem                     | WCAG 2.2 target floor                            |

Elevation is a shadow **or** a border, never a blur blob. `prefers-reduced-motion` is honoured
globally in the base layer, so no component needs its own guard.

---

## 6. Recipes — `app/components/patterns/`

Sections are full-bleed; boxes are for cards, grids, forms and modals only. Build pages from these
nine and extend them with `className`; do not fork a copy into a route. Every one of them is
rendered live at [`app/routes/design-system.tsx`](app/routes/design-system.tsx) under `#patterns` — guardrail
rule 9 fails CI if a pattern file ever stops appearing there.

| Component        | Props                                                                                                           | Replaces                                                  | Use when                                                                                  |
| ---------------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `Section`        | `tone?: page \| raised \| sunken \| inverse \| brand-deep`, `size?: sm \| md \| lg`, `as?`, `id?`, `className?` | every `<section className="py-16 …">` and every boxed CTA | every band of a page — it paints edge to edge, the inner container is what is constrained |
| `SectionHeading` | `eyebrow?`, `title`, `description?`, `align?`, `aside?`, `className?`                                           | the repeated centred heading                              | the start of a Section; centre only when it is the whole band                             |
| `Hero`           | `eyebrow?`, `title`, `lede?`, `primary?`, `secondary?`, `artifact?`, `trust?`, `tone?`                          | the three centred hero blocks + blob                      | the first screen of a marketing page: two columns on `lg`, no decorative layer            |
| `PageHeader`     | `eyebrow?`, `title`, `description?`, `className?`                                                               | centred title blocks on `/about`, `/contact`              | the title block of an app or info page                                                    |
| `CtaBand`        | `title`, `description?`, `actions`, `tone?: brand-deep \| inverse`, `className?`                                | `box p-12 … bg-primary/5`                                 | the closing ask: full-bleed, copy left, actions right                                     |
| `FeatureCard`    | `icon?`, `title`, `description`, `href?`, `className?`                                                          | `box p-6` + tile + heading + body                         | a grid item explaining one capability; hover is border + shadow, not a fill               |
| `IconTile`       | `size?: sm \| md \| lg`, `tone?: muted \| brand`, `className?`                                                  | the 12 `bg-primary/12` tiles                              | an icon that anchors a card; `tone="brand"` at most once per page                         |
| `CodeBlock`      | `code`, `filename?`, `className?`                                                                               | new                                                       | a command, a config shape, or a hero artifact                                             |
| `LogoStrip`      | `items: { label }[]`, `className?`                                                                              | new                                                       | trust or stack row under a hero; wordmarks, not images                                    |

Recipes compose `ui/` primitives and tokens only — no hex, no alpha surfaces, no `style={{}}`. Every
recipe takes `className` merged with `cn()`. A recipe must earn its place on ≥2 pages; a one-off
layout may still use plain utilities from the contract, because the guardrails ban the tint, not the
abstraction.

---

## 7. Component ownership

| Directory                                         | Owner                    | Rule                                                                                                                               |
| ------------------------------------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `app/components/ui/**`                            | upstream shadcn `4.23.0` | wrap it, never edit it; deviations are logged in [`PATCHES.md`](app/components/ui/PATCHES.md) and re-checked by `npm run ds:drift` |
| `app/components/patterns/**`                      | this repo                | the nine recipes above; `check:ds` rule 9 keeps them documented                                                                    |
| `app/components/layout/**`, `auth/**`, `error/**` | this repo                | app structure; writes Tier-3 utilities only                                                                                        |
| `app/globals.css`                                 | the contract             | the only file that holds a hex                                                                                                     |

Upstream ships no brand-as-text variant that conforms to this contract: `variant="link"` on `Button`
and `Badge` writes `text-primary`, and `--primary` is a _fill_ that deliberately stays brand-600 in
dark mode — under the 4.5:1 text floor on a dark card. App code therefore takes `text-link`, the
token whose whole job is brand as text, which steps to brand-400 in dark. Nothing is patched for it
(`PATCHES.md` logs real deviations only); closing the gap is phase 6's, and `/design-system` shows
the idiom rather than the failing variant.

## 8. Variants

Variants live in components. A page does not invent `danger`, `premium` or `compact` by pasting a
class string onto a primitive — it adds a variant to the wrapper, or it uses the token that already
means the thing. Concretely:

- A tone is a lookup map inside a pattern (`SECTION_TONES`, `SECTION_MUTED`), never a ternary of
  colour classes in a route.
- State is a step down the ramp (`--primary-hover`), never an alpha or `opacity`.
- Emphasis is a surface choice (`card` vs `background-subtle`), never a second hue.

## 9. Accessibility rules

1. Text clears 4.5:1; a boundary a user must find and a chart series clear 3:1. Translucent tokens
   (`--scrim`) are composited before they are measured.
2. Focus is never removed. The ring is `border-ring` + `ring-[3px] ring-ring/50`, exactly as upstream
   ships it. `--ring-offset` declares the gap colour; wiring the focus chain to consume it is phase 6.
3. `prefers-reduced-motion` is honoured once, globally, in the base layer.
4. Touch targets are ≥ `--size-touch-min` (2.75rem) on mobile.
5. Disabled text is exempt from 1.4.3 — which is why `--foreground-disabled` is deliberately not in
   the contrast manifest.
6. Colour is never the only signal: every status family ships a border and a solid fill so a state
   can be read without hue discrimination. The same applies to links — a link that sits _inside_ a
   sentence takes `text-link underline underline-offset-4`, because `--link` against
   `--foreground-muted` is not enough to say "this is clickable" (WCAG 1.4.1, axe
   `link-in-text-block`). A link that is the whole of its container — a nav item, an email address
   in a definition list — stays ununderlined and is identified by position instead.
7. Both themes are not optional. Every change is checked in light **and** dark, because the ladder
   inverts rather than mirrors.

---

## 10. Updating the contract

**Changing a token value.** Edit `:root` / `.dark` in `app/globals.css` only — never a Tier-3
utility, never a component. Then:

```bash
npm test          # 55 contrast pairs, both themes
npm run check:ds  # 9 guardrail rules
npm run build && npm run check:ds   # rule 5 asserts against the shipped CSS
```

If you added or renamed a utility, it must be reachable by Tailwind's scanner: either a page uses it,
or it joins the `@source inline(...)` guarantee in `globals.css`. Rule 5 catches the case where
neither happened.

A token change also repaints pixels. `e2e/a11y.spec.ts` re-measures contrast on every route in both
themes, and `e2e/visual.spec.ts` diffs 20 screenshots. Regenerate the latter with
`npm run test:e2e -- --project=visual --update-snapshots` **on `windows-latest` only**: the committed
set is platform-scoped under `e2e/__screenshots__/win32/` because font rasterisation differs per OS,
and a Linux-generated set would quietly replace it with one CI cannot match.

**Adding a token.** Add it to `:root` **and** `.dark` (rule 1 fails a token that exists in only one),
to `@theme inline`, to `TOKENS` in `app/lib/design-system.ts`, and to `CONTRAST_PAIRS` if any ink
sits on it. The style guide and the suite pick it up from there — no second documentation pass.

**Updating vendored components.**

```bash
npm run ds:drift                                              # what moved upstream?
npx shadcn@4.23.0 add <component> --overwrite --yes           # on a branch
git diff app/components/ui                                    # only PATCHES.md-listed lines expected
npx biome format --write app/components/ui app/hooks
npm test && npm run check:ds
```

If a component needs a patch, prefer a token change first: a contract that needs a component edit is
an incomplete contract (decision D1).

**Keeping the prose in step.** `AGENTS.md` rules 1–8, this file, the Do/Don't lists on
`/design-system` and `SURFACE_QUESTIONS` are the same rules in four registers. Change one, change
all four; the guardrails only prove the code agrees.

---

## 11. Decision log

| #   | Decision                                                                                                      | Why                                                                                                                                                                                                                                 |
| --- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | Tokens first, components second, app code last                                                                | a correct contract means zero component edits — and zero edits is the proof it is complete                                                                                                                                          |
| D2  | One accessible blue: `--p-brand-600` = `#1160C9`, `--p-brand-400` = `#4A9FFF`, everywhere including the logo  | user decision, contrast-verified. **Frozen**: no phase retunes it                                                                                                                                                                   |
| D3  | Re-vendor from upstream `shadcn@4.23.0`; local deviations only via `PATCHES.md`                               | upgrades become a no-op                                                                                                                                                                                                             |
| D4  | `@theme inline` is the only Tier-3 mechanism                                                                  | utilities emit `var(--x)`, so `.dark` remaps work without self-reference                                                                                                                                                            |
| D5  | Brand is punctuation; the only large brand surface is one full-bleed `--surface-brand` band                   | pattern audit P1–P4: the tint had become the default emphasis                                                                                                                                                                       |
| D6  | Neutral `--accent` / `--muted` for hover and sunken surfaces                                                  | kills the tint at the token level, where a page cannot reintroduce it                                                                                                                                                               |
| D9  | Rules live in `AGENTS.md` + `DESIGN.md` + `/design-system`, and regressions fail CI                           | the only way to stop an agent re-learning the old pattern                                                                                                                                                                           |
| D11 | **One chromatic brand hue**, permanently                                                                      | all seven audited enterprise systems ship exactly one; B5 records what happened here the last time `accent` was brand blue — every dropdown and calendar range turned solid blue                                                    |
| D12 | Tier 3 means _contextual_ tokens, consumed through `patterns/` lookup maps                                    | `--sidebar-*` is the proof the pattern works; `--secondary` on the brand band at 1.08:1 is the proof generic tokens cannot cover a dark band. Phase 6                                                                               |
| D13 | Ramps regenerated to matched perceived lightness, shipped as hex                                              | the imbalance is measured (step 600: brand L .509 vs warning L .666), but notation is not the goal — the invariant is                                                                                                               |
| D14 | The label family is non-semantic and never crosses the status boundary                                        | Atlassian's rule; a lime "success" badge destroys the meaning the status families carry                                                                                                                                             |
| D15 | **A check ships in the same PR as the values that satisfy it**                                                | `ds-allow` was abused before the checker existed: 10 violations were stamped `ds-allow: phase 5`, which would have landed the guardrail pre-waived. This is why the two open contrast defects moved to phase 6                      |
| —   | `.light` mirrors `:root` in `globals.css`                                                                     | `@custom-variant dark` is ancestor-driven, so a subtree could not opt _out_ of `.dark` without its own declarations. The style guide paints both themes side by side, and a panel labelled "light" that measures `#0a0a0a` is a lie |
| D16 | Pixel baselines are rendered and re-run on `windows-latest`; `snapshotPathTemplate` keys them by `{platform}` | user decision. Font rasterisation is per-OS, so a Linux set would be compared against nothing. Scoping the path makes the wrong runner fail loudly with "snapshot missing" instead of quietly passing                               |

### Still open, by design

`--secondary` on a `brand-deep` band is 1.08:1 in dark, and light-mode `background-subtle` / `muted` /
`accent` / `secondary` collide on n-150. Both are fixed in phase 6 together with rule 10, the
duplicate-step check that proves them — not waived here. So is upstream's `variant="link"` (§7): the
`Button` and `Badge` primitives still write `text-primary`, a fill in a text role, so the guardrail
that catches it needs to land in the same commit as the components that satisfy it.
`--surface-brand` on-* tokens are phase 6; `--chart-3` and the palette-wide constraints are phase 7.
