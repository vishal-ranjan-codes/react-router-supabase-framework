# Phase 9: Scalable Multi-Brand Architecture & Refined Subdued Canvas

**Status**: Implemented & Verified
**Date**: October 2026
**Prerequisites**: Phase 7 (Perceptually Uniform Palettes, Categorical Charts, Non-Semantic Labels)

---

## 1. Problem Statement & Motivation

Following Phase 7, two critical architecture flaws were identified in the design system when evaluating the framework as a reusable starter for arbitrary web applications:

1. **Concrete Grey Canvas (Defect)**:
   In Phase 7, the neutral ramp targets were mathematically derived from brand blue-100 (`#d9e9ff`, $L = 0.929$). In monochromatic grey with zero chroma, $L = 0.929$ evaluated to `#e7e7e7` (Tailwind `gray-200`). Binding `--background` to `neutral-100` made the entire website's canvas concrete grey, while cards were `#ffffff`. In dark mode, card surfaces became washed-out grey (`#2c2c2c`, $L = 0.293$).
2. **Rigid Single-Brand Constraint (Architecture Flaw)**:
   Rule 4 in `AGENTS.md` and Decision D11 in `DESIGN.md` dogmatically forbade any second brand color because the original implementation conflated Radix's component hover token (`accent`) with brand chromatic accents. Industry-standard multi-brand visual identities (such as Tidal, Terracotta, Signal, Forest, Stripe, and Linear) use a **60–30–10 rule** where an accent (10%) provides contrast against primary (30%) on top of a neutral canvas (60%).

---

## 2. Refined Subdued Canvas

The framework adopts a **Refined Subdued Canvas (Stripe/Linear dashboard style)** as its default surface ladder:

### Light Theme
- **`--card: var(--p-neutral-0)` (`#ffffff`)**: Pure, crisp white surface for cards, panels, modals, and sticky headers.
- **`--background: var(--p-neutral-50)` (`#fafafa`, $L = 0.985$)**: Luminous, clean, refined off-white canvas that gives cards crisp elevation without gloomy dark grey tones.
- **`--background-subtle: var(--p-neutral-100)` (`#f3f3f3`, $L = 0.965$)**: Soft sunken well, icon tile background, and table zebra striping.
- **`--accent: var(--p-neutral-100)` (`#f3f3f3`)**: Subtle hover feedback on cards and canvas.
- **`--accent-selected: var(--p-neutral-150)` (`#e9e9e9`)**: Selected row or active control fill.
- **`--border: var(--p-neutral-200)` (`#dedede`, $L = 0.900$)**: Clean, high-definition structural boundary.
- **`--foreground: var(--p-neutral-950)` (`#090909`)**: High-contrast text ($18.5:1$ on card, $17.9:1$ on canvas).
- **`--foreground-muted: var(--p-neutral-600)` (`#5d5d5d`)**: Secondary text ($6.58:1$ on card, $6.31:1$ on canvas, clearing WCAG AA $4.5:1$).

### Dark Theme
- **`--background: var(--p-neutral-950)` (`#090909`, $L = 0.140$)**: Deep, immersive page canvas.
- **`--card: var(--p-neutral-900)` (`#141414`, $L = 0.190$)**: Clear, elevated dark card surface.
- **`--background-subtle: var(--p-neutral-850)` (`#1d1d1d`, $L = 0.230$)**: Slightly raised sunken wells.
- **`--border: var(--p-neutral-800)` (`#292929`, $L = 0.280$)**: Crisp border separating cards from canvas.
- **`--foreground: var(--p-neutral-50)` (`#fafafa`)**: High-contrast text ($19.1:1$ on canvas, $17.65:1$ on card).
- **`--foreground-muted: var(--p-neutral-300)` (`#c4c4c4`)**: Secondary text ($10.56:1$ on card).
- **`--foreground-subtle: var(--p-neutral-400)` (`#9e9e9e`)**: Subtle captions ($6.88:1$ on card).

---

## 3. Brand Accent & 60-30-10 Multi-Brand Theming

To support rich branding identities without breaking shadcn components:

### Token Architecture
- **`--primary`**: 30% brand structure (primary buttons, primary links, active tab indicator, brand band).
- **`--brand-accent`**: 10% chromatic emphasis (badges, callout pills, secondary CTAs, feature highlights).
  - `--brand-accent`: Solid accent fill.
  - `--brand-accent-hover`: Hover state fill.
  - `--brand-accent-active`: Active/pressed state fill.
  - `--brand-accent-foreground`: Text/icon ink on solid accent (clearing WCAG AA $\ge 4.5:1$).
  - `--brand-accent-subtle`: Soft tinted background for callout boxes and pills.
  - `--brand-accent-on-subtle`: High-contrast ink sitting on `--brand-accent-subtle`.
  - `--brand-accent-border`: Border boundary for accent elements.
- **`--accent`**: Kept strictly neutral for Radix/shadcn component hover surfaces (dropdown items, combobox selections, table row hovers), preserving usability and preventing accidental chromatic floods.

### Plug-and-Play Preset Registry (`app/lib/theme-presets.ts`)
Pre-configured 60-30-10 theme presets based on verified design specifications:
1. **Tech Blue**: `#1160c9` Tech Blue + `#d14118` Sunset Coral Accent (`#ffffff` foreground, $4.69:1$ ratio).
2. **Signal**: `#1649D8` Precision Cobalt + `#DDF85B` Acid Yellow Accent (`#172139` foreground, $13.44:1$ ratio AAA).
3. **Tidal**: `#006B64` Maritime Teal + `#E6B85C` Warm Brass Accent (`#17251F` foreground, $8.61:1$ ratio AAA).
4. **Forest**: `#365A28` Forest Green + `#F6B0B6` Soft Rose Accent (`#27321F` foreground, $7.47:1$ ratio AAA).
5. **Terracotta**: `#A33D26` Terracotta Clay + `#EBC56D` Ochre Accent (`#30241F` foreground, $9.11:1$ ratio AAA).
6. **Monochrome Editorial**: Jet Black / Pure White + `#475569` Cool Slate Accent.

---

## 4. Verification & Guardrails

1. **Ramp Uniformity (`tests/ramp-uniformity.test.ts`)**:
   - 75 tests passing: every step of every core ramp (`neutral`, `brand`, `success`, `warning`, `danger`, `info`) verified within $\pm 0.02 L$ of target lightness.
   - Perceived lightness anti-collapse assertion: $\Delta L \ge 0.02$.
   - Adjacent chart series spacing: $\Delta L \ge 0.05$.
2. **Design Tokens & Contrast (`tests/design-tokens.test.ts`)**:
   - 256 tests passing: 57 contrast pairs asserted against WCAG AA ($4.5:1$ text, $3:1$ boundaries).
3. **Palette Rules (`tests/palette-rules.test.ts`)**:
   - 13 tests passing: chart series non-status rule, label hue separation, gamut containment.
4. **Automated Guardrail (`scripts/check-design-system.mjs`)**:
   - Clean pass across all 14 active rules.
5. **Full Test Suite & Build**:
   - 19 test files passing, 462 total tests passing.
   - `npm run lint`: 0 errors, 0 warnings.
   - `npm run typecheck`: clean pass.
   - `npm run build`: clean pass.
