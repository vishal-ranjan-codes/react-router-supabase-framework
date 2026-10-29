# Design System Page Redesign Plan

**Status:** Ready for Review & Implementation  
**Target File:** `app/routes/design-system.tsx`  
**Related Files:** `app/lib/design-system.ts`, `app/lib/theme-presets.ts`, `app/components/patterns/*`, `app/components/ui/*`  
**Guardrails:** `scripts/check-design-system.mjs` (Rules 1–16), `tests/design-tokens.test.ts`, `e2e/a11y.spec.ts`, `e2e/visual.spec.ts`

---

## 1. Executive Summary & Goals

### The Problem
During earlier foundation phases, `/design-system` was transformed from a clean visual catalog into an internal test-runner and diagnostic report:
- 57-pair contrast tables with raw decimal ratios (`6.82:1`, `WCAG AA`) dominated the primary viewport.
- Raw OKLCH lightness values (`L: 0.588`, `L: 0.895`) and internal audit citations (`check:ds rule 16`, `decision D2`, `step 2b`) cluttered the page.
- Massive tables of raw token names and primitive ramps pushed real components, UI widgets, and usage patterns far below the fold.
- Developers evaluating or building with the starter framework could not easily see what components look like, what color palettes are available, or how to compose a modern interface.

### The Solution
Transform `/design-system` into an inspiring, developer-first showcase (in the style of Tailwind Catalyst, Vercel Geist, Linear, and Stripe):
1. **Developer-First Showcase**: Put real components, interactive controls, color swatches, typography specimens, and UI patterns on center stage.
2. **Interactive Brand Switcher**: Live interactive switcher demonstrating the scalable 60-30-10 palette architecture (Signal, Tidal, Forest, Terracotta, Tech Blue, Monochrome) in real-time.
3. **Comprehensive Component Library**: Showcase buttons, forms, inputs, selects, switches, checkboxes, badges, cards, tabs, alerts, tables, and dialogs.
4. **Clean Surface & Elevation Demonstrator**: Showcase the refined subdued canvas (background, cards, subtle wells, popovers, borders, shadows) with light/dark fidelity.
5. **Practical Guidance**: Concise Do's and Don'ts giving clear, actionable guidance on composing pages without boilerplate overload.
6. **Technical Audit Drawer**: Move mathematical contrast ratio ledgers and raw token dictionaries into a clean, collapsible technical accordion at the bottom of the page, ensuring full compliance with `check:ds` (Rule 9 and Rule 11) while keeping the visual experience pristine.

---

## 2. Page Architecture & Section Layout

```
┌────────────────────────────────────────────────────────────────────────┐
│  1. Hero Header                                                        │
│     - Title, subtitle, theme toggle & quick links                      │
│     - Live Brand Preset Switcher (Tech Blue, Signal, Tidal, Field...) │
├────────────────────────────────────────────────────────────────────────┤
│  2. Quick Navigation Bar (Sticky pills jumping to key sections)        │
├────────────────────────────────────────────────────────────────────────┤
│  3. Brand & Colors                                                     │
│     - 60-30-10 Brand Identity System (Canvas 60%, Primary 30%, Accent) │
│     - Semantic Color Palette (Primary, Brand Accent, Content, Status) │
│     - Category Label Chips (10 hues: Violet, Indigo, Teal, Cyan...)   │
│     - Data & Charts Palette (12 Categorical series, Sequential ramp)   │
├────────────────────────────────────────────────────────────────────────┤
│  4. Surfaces, Depth & Elevation                                        │
│     - Refined Surface Ladder (Canvas, Subtle Well, Card, Popover)      │
│     - Shadows (shadow-card, shadow-pop) & Border radii (xs -> 2xl)     │
├────────────────────────────────────────────────────────────────────────┤
│  5. Typography & Hierarchy                                             │
│     - Interactive Type Scale (Display, Headings H1-H5, Body, Code)     │
├────────────────────────────────────────────────────────────────────────┤
│  6. Component Catalog (The Core Showcase)                             │
│     - Actions: Buttons (all variants, sizes, icons, loading)           │
│     - Form Controls: Inputs, Selects, Checkboxes, Switches, Textareas  │
│     - Cards & Panels: Metric cards, Action cards, Highlighted cards   │
│     - Status & Badges: Solid, subtle, outline, with icons              │
│     - Feedback: Alerts, Skeletons, Progress bars                      │
│     - Navigation & Structure: Tabs, Breadcrumbs, Separators, Tables    │
├────────────────────────────────────────────────────────────────────────┤
│  7. UI Pattern Recipes                                                 │
│     - The 9 foundational patterns (Hero, Section, FeatureCard, etc.)   │
├────────────────────────────────────────────────────────────────────────┤
│  8. Micro-Interactions & States                                        │
│     - Default, Hover, Focus (WCAG 3:1 focus ring chain), Active, Dis.  │
├────────────────────────────────────────────────────────────────────────┤
│  9. Best Practices (Do's & Don'ts)                                     │
│     - Concise, developer-friendly composition rules                   │
├────────────────────────────────────────────────────────────────────────┤
│ 10. Technical Specifications & Audit Ledger (Collapsible Accordion)   │
│     - Complete Tier-2 Token Contract dictionary (Rule 11 compliance)   │
│     - Live Measured Contrast Ratios (57 pairs, browser-measured)       │
│     - Guardrail verification summary (npm run check:ds)               │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Detailed Section Specifications

### Section 1: Hero & Brand Theme Switcher
- **Eyebrow**: `Design System · Living Component Library`
- **Title**: `Building blocks for modern edge applications`
- **Subtitle**: Clean description highlighting Tailwind CSS v4, refined canvas, 60-30-10 multi-color branding, and WCAG AA accessibility.
- **Brand Preset Toolbar**: An interactive tab/pill bar letting users switch the active preview palette among presets:
  - *Tech Blue* (Default: Blue #1160c9 + Sunset Coral)
  - *Signal* (Deep Cobalt + High-Vis Electric Yellow)
  - *Tidal* (Maritime Teal + Warm Brass)
  - *Forest* (Forest Slate + Soft Rose)
  - *Terracotta* (Terracotta Earth + Rich Ochre)
  - *Monochrome* (Neutral Zinc + High-Contrast Black/White)
- Clicking a preset applies CSS variables to an interactive live preview card so the user immediately sees how flexible and scalable the framework is.

### Section 2: Colors & Brand Palettes
- **60-30-10 Architecture Showcase**:
  - Visual breakdown:
    - **60% Canvas & Neutral Space**: Luminous `bg-background` (`#fafafa` / `#090909`) and `bg-card`.
    - **30% Primary Brand Structure**: Navigation, primary buttons, links, active tabs (`--primary`, `--primary-hover`).
    - **10% High-Contrast Brand Accent**: Badges, callout pills, secondary high-visibility CTAs (`--brand-accent`, `--brand-accent-subtle`).
- **Semantic Palette Cards**:
  - Interactive swatches with 1-click copy for Tailwind classes:
    - *Primary Brand*: Solid (`bg-primary`), Subtle (`bg-primary-subtle`), Link (`text-link`).
    - *Brand Accent*: Solid (`bg-brand-accent`), Subtle (`bg-brand-accent-subtle`), Border (`border-brand-accent-border`).
    - *Ink / Content*: Foreground (`text-foreground`), Muted (`text-foreground-muted`), Subtle (`text-foreground-subtle`).
    - *Status Families*: Success (Emerald), Warning (Amber), Destructive (Rose), Info (Blue) with realistic preview badges and notification bars.
- **Category Label Chips**:
  - Clean pill badges for the 10 label hues (violet, indigo, teal, cyan, pink, lime, orange, brown, cool-gray, gray) demonstrating tagging, metadata, and categorization.
- **Data & Charts Palette**:
  - Visual color ribbon showing the 12 categorical chart series (`--chart-1` to `--chart-12`), sequential density ramp, and diverging delta ramp.

### Section 3: Surfaces, Depth & Elevation
- **Surfaces & Elevation Ladder**:
  - Visual interactive cards demonstrating the elevation hierarchy:
    1. *Page Canvas* (`bg-background`): Crisp off-white in light, deep obsidian in dark.
    2. *Sunken Wells & Icon Tiles* (`bg-background-subtle`): Inset containers, search bars, icon backdrops.
    3. *Raised Cards & Panels* (`bg-card` + `border-border` + `shadow-card`): Floating above the canvas with subtle perimeter border.
    4. *Popovers & Menus* (`bg-popover` + `shadow-pop`): Elevated dropdowns and dialogs.
    5. *Overlay Scrim* (`bg-scrim`): Modal backdrops.
    6. *High-Contrast Inverse* (`bg-surface-inverse`): Contrast tooltips and banners.
- **Elevation Tokens**:
  - Corner radius visual specimens (`rounded-xs`, `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`).
  - Shadow specimens (`shadow-card`, `shadow-pop`).

### Section 4: Typography & Hierarchy
- Live typographical specimen table:
  - Display (`text-display`), H1 (`text-h1`), H2 (`text-h2`), H3 (`text-h3`), H4 (`text-h4`), H5 (`text-h5`)
  - Eyebrow (`text-eyebrow`), Body Large (`text-body-lg`), Body Base (`text-body`), Body Small (`text-body-sm`), Fine print (`text-body-xs`)
  - Monospace / Code blocks
- Each row shows:
  - Specimen preview in real text
  - Utility class name
  - Computed size, weight, and tracking

### Section 5: Component Catalog (The Core Showcase)
A rich, polished showcase of shadcn/ui components wired to framework tokens:
1. **Buttons & Actions**:
   - Variants: Default (Primary), Secondary, Brand Accent, Outline, Ghost, Destructive, Link.
   - Sizes: Small (`sm`), Default, Large (`lg`), Icon-only.
   - States: Normal, with left/right icons, loading spinner (`LoaderCircle`), disabled.
2. **Form Controls**:
   - Text inputs with placeholder, prefix/suffix icons.
   - Form fields with floating labels, helper text, and validation error messages (`aria-invalid`).
   - Textarea, Select / Dropdown menu, Checkbox, Switch toggles, Radio groups.
3. **Cards & Dashboard Widgets**:
   - *Metric / KPI Card*: Stat number, label, sparkline/trend badge (e.g., `+12.4%`).
   - *Interactive Action Card*: Header, description, button action.
   - *Feature / Highlight Card*: Accent border and subtle tag.
4. **Badges & Tags**:
   - Solid, subtle, and outline badges.
   - Status badges with icons (check, alert, cross, info).
   - Category tags with count pills.
5. **Feedback & Progress**:
   - Toast/Alert banners (Info, Success, Warning, Error) with close actions.
   - Loading skeletons (avatar, text lines, card skeleton).
   - Indeterminate & determinate progress bars.
6. **Data Presentation & Navigation**:
   - Clean data table with sortable headers, avatar cells, status chips, and action dropdown.
   - Tabs component (active, inactive, hover).
   - Breadcrumb trail with icons.

### Section 6: UI Pattern Recipes
Showcase the 9 layout patterns defined in `app/components/patterns/*`:
1. `Section` (all 5 tones: page, raised, sunken, inverse, brand-deep)
2. `SectionHeading`
3. `Hero`
4. `CodeBlock`
5. `FeatureCard`
6. `IconTile`
7. `CtaBand`
8. `LogoStrip`
9. `PageHeader`

### Section 7: Control States & Focus Chain
- Interactive sandbox demonstrating control states:
  - Hover (`bg-accent`), Pressed/Active, Disabled (`opacity-50 pointer-events-none`).
  - **WCAG 3:1 Focus Chain**: Real interactive button showing `border-ring`, `ring-[3px] ring-ring/50`, and `ring-offset-2 ring-offset-ring-offset`.

### Section 8: Best Practices (Do's & Don'ts)
- Clean, side-by-side card layout:
  - **Do**:
    - Use semantic tokens (`bg-card`, `text-foreground-muted`, `border-border`).
    - Use the 60-30-10 rule for multi-color brand identities.
    - Test in both light and dark modes.
    - Build pages using pattern recipes (`Section`, `Hero`, `FeatureCard`).
  - **Don't**:
    - Never use hardcoded hex values in app code.
    - Never use opacity or alpha to fake a surface tint (`bg-primary/5`).
    - Never place raw boxes in whitespace; use `CtaBand` or `Section`.
    - Never edit `app/components/ui/**` upstream files directly.

### Section 9: Collapsible Technical Specifications & Audit Ledger
- Wrapped in a neat, accessible `<details>` or toggleable drawer titled:
  `Technical Specifications & WCAG Audit Ledger (Click to expand)`
- Contains:
  1. **Complete Tier-2 Token Reference Table**:
     - Lists all 165 tokens categorized by group (Surface, Content, Brand, Status, Label, Line, Data, Sidebar).
     - Displays token name, CSS variable, utility class, and intended use.
     - **Guarantees Rule 11 of `check:ds` remains 100% satisfied.**
  2. **Measured WCAG Contrast Ledger**:
     - Browser-measured table of all 57 contrast pairs with pass/fail badges.
     - Kept out of the way of everyday developers, but fully accessible to auditors and CI.
  3. **Automated Guardrail Summary**:
     - Notes on `npm run check:ds` and `tests/design-tokens.test.ts`.

---

## 4. Guardrail Compliance Strategy

To ensure zero regressions across CI checks:

| Check | Rule / Requirement | Strategy in Redesign |
|---|---|---|
| `npm run check:ds` | Rule 9: Every pattern recipe is rendered by `/design-system` | Pattern section renders all 9 recipes (`Section`, `SectionHeading`, `Hero`, `CodeBlock`, `FeatureCard`, `IconTile`, `CtaBand`, `LogoStrip`, `PageHeader`). |
| `npm run check:ds` | Rule 11: All 165 Tier-2 tokens are referenced and active | All 165 tokens are cleanly rendered either in component showcases, swatches, or in the collapsible Technical Reference table. |
| `npm run check:ds` | Rule 16: No cross-family usage between label and status | Strictly separate label badges from status indicators. |
| `npm run check:ds` | Rule 6: `ds-allow` waiver | Preserve the single legal waiver in the Don't list for `bg-primary/5` with reason `>= 15` chars. |
| `npm run lint` | Biome formatting & linting | Follow Biome lint rules, sorting imports, and zero lint errors. |
| `npm run typecheck` | TypeScript compilation | Strict type safety for all components and props. |
| `npm test` | Vitest test suite | 19 test files (462 tests) continue passing. |
| `e2e/a11y.spec.ts` | Playwright Axe accessibility | All interactive elements, swatches, and contrast pairs must clear WCAG AA. |
| `e2e/visual.spec.ts` | Visual regression tests | Update snapshots on Windows runner once new page layout is committed. |

---

## 5. Implementation Phases

- **Phase 1: Component & Swatch Primitives Preparation**
  - Verify all necessary UI components in `app/components/ui/` (Tabs, Select, Switch, Checkbox, Avatar, Tooltip, Breadcrumb, Table).
  - Prepare clean helper subcomponents for interactive swatches, preset switcher, and token cards.
- **Phase 2: `/design-system` Route Overhaul**
  - Rewrite `app/routes/design-system.tsx` using the 10-section structure.
  - Implement interactive theme preset switcher with live preview.
  - Add comprehensive component catalog grid.
  - Move contrast ledger & token dictionary into the collapsible technical drawer.
- **Phase 3: Verification & Polish**
  - Run `npm run check:ds` (verify all 14 rules pass).
  - Run `npm run lint && npm run typecheck && npm test`.
  - Run Playwright E2E tests (`e2e/a11y.spec.ts` and `e2e/visual.spec.ts`).
  - Update visual regression snapshots if needed.

---

## 6. Definition of Done
1. `/design-system` renders a modern, developer-friendly showcase focusing on components, swatches, presets, and typography.
2. The interactive brand switcher allows instant live preview of the 60-30-10 presets (Signal, Tidal, Field, Kiln, Tech Blue, Monochrome).
3. The component catalog clearly demonstrates Buttons, Form Controls, Cards, Badges, Feedback, and Navigation.
4. Internal audit math and 57-pair contrast tables are cleanly housed in a collapsible technical drawer at the bottom.
5. `npm run check:ds`, `npm run lint`, `npm run typecheck`, and `npm test` pass with 0 errors.
6. `e2e/a11y.spec.ts` passes with zero axe violations in both light and dark themes.
