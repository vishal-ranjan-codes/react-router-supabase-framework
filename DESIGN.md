# Design System Specification & Engineering Handbook

A comprehensive, contract-driven design system engineered for React Router v7, Tailwind CSS v4,
and enterprise SaaS applications. This document is the canonical specification and instruction
manual for both developers and AI coding agents building user interfaces in this repository.

---

## 1. Principles & Non-Negotiable Contract Constraints

Every component, page, and feature in `app/` must adhere to these mechanical constraints.
Regressions are caught by automated test suites (`npm run check:ds`, `npm run lint`, `npm test`,
and Playwright E2E).

1. **Semantic Tokens Only**:
   - Never hardcode a raw hex code (`#1160c9`, `#ffffff`), RGB, or HSL color in markup or CSS.
   - Never use raw Tailwind color utilities (`bg-blue-600`, `text-slate-500`, `border-gray-200`).
   - Never use opacity to create a surface or tint (`bg-primary/10`, `opacity-50` on surfaces).
   - Never use arbitrary values (`bg-[#1160c9]`).
   - All colors must resolve through the semantic CSS variables defined in `app/globals.css`.

2. **Upstream Component Ownership**:
   - `app/components/ui/**` is vendored upstream shadcn. Wrap it, never edit it directly.
   - Any local deviation must be documented in `app/components/ui/PATCHES.md`.

3. **Brand is Punctuation (< 10% Viewport Area)**:
   - Primary brand color (`--primary`) is an accent mark: primary action buttons, active navigation
     indicators, links, focus rings, and chart series.
   - Large brand surfaces are restricted: at most **one** full-bleed `Section tone="brand-deep"` is
     permitted per page.
   - Backgrounds, panels, cards, and wells must remain clean neutrals.

4. **Single-Primary Default & Restricted Brand Accent Scope**:
   - The framework defaults to a **Single-Primary Brand System** (`siteThemeConfig.enableAccent = false` in `app/config/theme.ts`).
   - When accent is disabled, `--brand-accent` CSS variables automatically alias to `--primary` tokens.
   - When chromatic accent is enabled (`enableAccent = true`), its scope is strictly restricted to **tiny punctuation only**:
     an 8px indicator dot or a small status pill tag.
   - **NEVER use `--brand-accent` on buttons (`<Button>`).** Primary CTAs must always use `bg-primary` (`default` variant) or neutral outlines on standard canvas.
   - **On-Dark / Brand-Deep Surfaces**: On rich colored backgrounds or inverted sections (such as `Section tone="brand-deep"`, `<Hero tone="brand-deep">`, or full-bleed CTA banners), use the dedicated on-dark button variations: `variant="white"` (primary), `variant="white-secondary"` (glass secondary), or `variant="white-outline"` (translucent outline). Never use `variant="default"` (which blends into brand backgrounds) or `variant="secondary"` (which injects dark neutral charcoal).
   - **NEVER use `--brand-accent` as a background or border on cards, hero sections, or full-bleed bands.**
   - Neutral components (`--secondary`, `--accent`) must remain neutral controls (`#f3f3f3` light / `#262626` dark); do not tint them to improvise an accent.

5. **Strict Status vs. Label Separation (Rule 16)**:
   - Status tokens (`success`, `warning`, `destructive`, `info`) represent **system health and state**.
   - Label tokens (`--label-*`) represent **content categorization, metadata tags, and topics**.
   - Never use status tokens on `<Chip>`, `<Tag>`, or chips/tags.
   - Never use label tokens in `<Alert>`, `<Toast>`, or system notifications.
   - Never mix status and label tokens on the same element or line of code.

6. **Contrast is a Mechanical Invariant**:
   - All normal body text must meet **WCAG AA $\ge 4.5:1$**.
   - All interactive control boundaries and focus rings must meet **WCAG $\ge 3.0:1$**.
   - Every semantic pairing is verified by `tests/design-tokens.test.ts`.

---

## 2. Global Brand Presets & The Scalable Identity System

The framework decouples neutral surfaces from brand colors and provides a site-wide developer theme switcher:
- Configure globally in `app/config/theme.ts` via `siteThemeConfig.preset`.
- Preview interactively across any running page in development via the floating **Theme Dock** (`<ThemeDock />`).
- Hydrates without layout shift (zero FOUC) via SSR `<html data-brand="..." data-accent="...">`.

### Single-Primary Default (Stripe / Linear Architecture)
By default, the starter framework runs in **Single-Primary mode** (`enableAccent: false`).
In this mode, all `--brand-accent` CSS variables automatically alias directly to `--primary`:
```css
/* When accent is OFF (default) */
--brand-accent: var(--primary);
--brand-accent-foreground: var(--primary-foreground);
--brand-accent-subtle: var(--primary-subtle);
--brand-accent-on-subtle: var(--primary-on-subtle);
--brand-accent-border: var(--primary);
```
This guarantees an interface with zero color clash, prevents AI coding agents from generating out-of-place red buttons, and mirrors the clean, focused visual design of Stripe, Vercel, and Linear.

### Opt-In 60-30-10 Chromatic Accent Mode
When a developer sets `enableAccent: true`, the framework activates the high-contrast chromatic accent:
- **60% Neutral Canvas**: Off-white/slate surfaces (`bg-background`, `bg-card`, `bg-background-subtle`).
- **30% Primary Brand Structure**: Primary actions, active tabs, links (`bg-primary`, `text-link`).
- **10% Brand Accent Punctuation**: Strictly restricted to **tiny punctuation only** (8px notification dots, small status pill tags).
- **Hard Rule**: NEVER use `--brand-accent` on buttons (`<Button>`). Primary CTAs must always use `bg-primary` or neutral outlines.

### Pre-Configured Global Brand Presets (`app/lib/theme-presets.ts`)

| Preset ID | Name | 60% Canvas (Light / Dark) | 30% Primary Brand | 10% Accent (When Enabled) | Vibe / Industry |
|---|---|---|---|---|---|
| `tech-blue` | **Tech Blue** (Default) | `#fafafa` / `#090909` | `#1160c9` (Tech Blue) | `#d14118` (Sunset Coral) | Enterprise SaaS, Cloud, Fintech |
| `signal` | **Signal** | `#f3f5fb` / `#101522` | `#1649d8` (Cobalt) | `#ddf85b` (Acid Yellow) | Developer Tools, AI, High-Velocity |
| `tidal` | **Tidal** | `#f3f7f5` / `#0c1917` | `#006b64` (Maritime Teal) | `#e6b85c` (Warm Brass) | Maritime, Climate, Analytics |
| `forest` | **Forest** | `#f5f6ec` / `#171c13` | `#365a28` (Forest Green) | `#e5989b` (Soft Rose) | Sustainability, Creators, Nature |
| `terracotta` | **Terracotta** | `#faf5ec` / `#1d1713` | `#a33d26` (Terracotta) | `#ebc56d` (Warm Ochre) | Artisan, Architecture, Publishing |
| `monochrome` | **Monochrome** | `#fafafa` / `#000000` | `#141414` (Solid Ink) | `#475569` (Slate Accent) | High-Fashion, Editorial, Minimalist |

---

## 3. Surface Hierarchy & Elevation Stacking

Surfaces form an elevation ladder. Choose a surface token by asking what the element is **doing**,
not what color it should look like.

| Elevation Level | Token | Tailwind Utility | Light Value | Dark Value | Purpose & Practical Use |
|---|---|---|---|---|---|
| **0. Base Canvas** | `--background` | `bg-background` | `#fafafa` | `#090909` | Root page canvas, app body viewport. |
| **1. Sunken Well** | `--background-subtle` | `bg-background-subtle` | `#f3f3f3` | `#1d1d1d` | Inset wells, table alternating rows, search inputs, icon tiles. |
| **2. Raised Panel** | `--card` | `bg-card` | `#ffffff` | `#141414` | Cards, forms, metric panels, modals. Always pair with `border-border` and `shadow-card`. |
| **3. Floating Layer** | `--popover` | `bg-popover` | `#ffffff` | `#141414` | Dropdown menus, selects, tooltips, dialogs. Pair with `shadow-pop`. |
| **4. Overlay Dim** | `--scrim` | `bg-scrim` | `#00000080` | `#000000a3` | Modal backdrop overlay. |
| **5. Inverse Band** | `--surface-inverse` | `bg-surface-inverse` | `#1d1d1d` | `#fafafa` | Full-width contrast band (footer, announcement banner). |
| **Special: Deep Brand** | `--surface-brand` | `bg-surface-brand` | `#0a3d7d` | `#051b38` | Exactly **one** full-bleed hero or CTA section per page. |

### Surface Stacking Decision Rules
- **Page Canvas**: Always `bg-background` (or `<Section tone="page">`).
- **Cards & Modals**: Always `bg-card border border-border shadow-card`.
- **Sunken Wells**: Always `bg-background-subtle border border-border-subtle`.
- **Hover Feedback**: Always `hover:bg-accent hover:text-accent-foreground` (neutral hover).
- **Selection Feedback**: Always `bg-accent-selected text-accent-foreground` (neutral selected state).
- **Brand Tint**: Use `bg-primary-subtle text-primary-on-subtle border border-border`. Never `bg-primary/10`.

---

## 4. Complete 165-Token Reference Dictionary

Every token in the design system contract is listed below. All tokens are available as Tailwind classes.

### A. Surfaces & Content (18 tokens)
| CSS Variable | Tailwind Utility | Light Hex | Dark Hex | Permitted Usage | Forbidden Usage |
|---|---|---|---|---|---|
| `--background` | `bg-background` | `#fafafa` | `#090909` | Page canvas | Cards, floating menus |
| `--background-subtle` | `bg-background-subtle` | `#f3f3f3` | `#1d1d1d` | Sunken wells, icon tiles | Page canvas |
| `--card` | `bg-card` | `#ffffff` | `#141414` | Cards, elevated panels | Page canvas |
| `--popover` | `bg-popover` | `#ffffff` | `#141414` | Menus, popovers, tooltips | Page canvas |
| `--scrim` | `bg-scrim` | `#00000080` | `#000000a3` | Backdrop dimming overlay | Component fills |
| `--surface-inverse` | `bg-surface-inverse` | `#1d1d1d` | `#fafafa` | High-contrast footer band | Card surfaces |
| `--surface-brand` | `bg-surface-brand` | `#0a3d7d` | `#051b38` | One full-bleed CTA band | Inline cards |
| `--foreground` | `text-foreground` | `#090909` | `#fafafa` | Primary headings, body text | Disabled text |
| `--foreground-muted` | `text-foreground-muted` | `#5d5d5d` | `#c4c4c4` | Subtitles, metadata, captions | Low-contrast text |
| `--foreground-subtle` | `text-foreground-subtle` | `#5d5d5d` | `#9e9e9e` | Helper hints, timestamps | Normal body copy |
| `--foreground-disabled`| `text-foreground-disabled`| `#8a8a8a` | `#636363` | Disabled controls (3:1) | Active text |
| `--foreground-inverse` | `text-foreground-inverse` | `#fafafa` | `#090909` | Text on surface-inverse | Text on light cards |
| `--foreground-on-brand`| `text-foreground-on-brand`| `#ffffff` | `#ffffff` | Text on surface-brand | Text on white cards |
| `--link` | `text-link` | `#1160c9` | `#4a9fff` | Interactive hyperlinks | Static labels |
| `--link-hover` | `hover:text-link-hover` | `#0e51aa` | `#7cb8ff` | Link hover state | Button backgrounds |
| `--placeholder` | `placeholder:text-placeholder`| `#5d5d5d` | `#9e9e9e` | Form field placeholders | Body copy |
| `--surface-disabled` | `bg-surface-disabled` | `#dedede` | `#1d1d1d` | Disabled button background | Active buttons |
| `--border-disabled` | `border-border-disabled` | `#c4c4c4` | `#292929` | Disabled control border | Active card borders |

### B. Brand & Interaction (15 tokens)
| CSS Variable | Tailwind Utility | Light Hex | Dark Hex | Permitted Usage |
|---|---|---|---|---|
| `--primary` | `bg-primary` | `#1160c9` | `#1160c9` | Primary CTA buttons, active state |
| `--primary-hover` | `hover:bg-primary-hover` | `#0e51aa` | `#0e51aa` | Primary button hover |
| `--primary-active` | `active:bg-primary-active` | `#0a3d7d` | `#0a3d7d` | Primary button press |
| `--primary-foreground` | `text-primary-foreground` | `#ffffff` | `#ffffff` | Text on solid primary |
| `--primary-subtle` | `bg-primary-subtle` | `#eef6ff` | `#04121f` | Tinted brand badge, tonal button |
| `--primary-on-subtle` | `text-primary-on-subtle` | `#0e51aa` | `#7cb8ff` | Text on brand subtle |
| `--primary-deep` | `bg-primary-deep` | `#0a3d7d` | `#0d2c50` | Full-bleed hero band |
| `--primary-deep-foreground` | `text-primary-deep-foreground` | `#ffffff` | `#d9e9ff` | Text on primary deep band |
| `--secondary` | `bg-secondary` | `#f3f3f3` | `#292929` | Secondary neutral button |
| `--secondary-hover` | `hover:bg-secondary-hover` | `#e9e9e9` | `#383838` | Secondary button hover |
| `--secondary-foreground`| `text-secondary-foreground` | `#141414` | `#fafafa` | Text on secondary button |
| `--accent` | `bg-accent` | `#f3f3f3` | `#292929` | Component hover feedback |
| `--accent-selected` | `bg-accent-selected` | `#e9e9e9` | `#383838` | Selected list item / active row |
| `--accent-foreground` | `text-accent-foreground` | `#141414` | `#fafafa` | Text on accent surface |
| `--primary-selected` | `bg-primary-selected` | `#0a3d7d` | `#0d2c50` | Primary active selection indicator |

### C. Brand Accent (7 tokens &mdash; Restricted Punctuation Only)
| CSS Variable | Tailwind Utility | Light Hex | Dark Hex | Permitted Usage |
|---|---|---|---|---|
| `--brand-accent` | `bg-brand-accent` | `#d14118` | `#ff6f43` | Restricted punctuation: 8px notification dot, small pill tag (**NEVER on buttons**) |
| `--brand-accent-hover` | `hover:bg-brand-accent-hover` | `#b8340f` | `#ff855f` | Interactive tag hover state |
| `--brand-accent-active` | `active:bg-brand-accent-active` | `#99280a` | `#ffa182` | Interactive tag press state |
| `--brand-accent-foreground`| `text-brand-accent-foreground` | `#ffffff` | `#1a0803` | Text on solid brand accent dot or tiny chip |
| `--brand-accent-subtle` | `bg-brand-accent-subtle` | `#fff2ee` | `#3b1308` | Small pill tag well |
| `--brand-accent-on-subtle` | `text-brand-accent-on-subtle` | `#942e12` | `#ffb094` | Readable text on accent pill tag (AAA $\ge 7:1$) |
| `--brand-accent-border` | `border-brand-accent-border` | `#ffccbc` | `#7a2b15` | Border for small accent pill tags |

### D. Status Families (21 tokens &mdash; Success, Warning, Destructive, Info)
| Family | Subtle Background | On-Subtle Text | Boundary Border | Solid Fill | Solid Text |
|---|---|---|---|---|---|
| **Success** | `bg-success-subtle` (`#eef9f0`) | `text-success-on-subtle` (`#1b6e2f`) | `border-success-border` | `bg-success` (`#248a3d`) | `text-success-foreground` (`#ffffff`) |
| **Warning** | `bg-warning-subtle` (`#fef8ec`) | `text-warning-on-subtle` (`#8a5200`) | `border-warning-border` | `bg-warning` (`#b26a00`) | `text-warning-foreground` (`#ffffff`) |
| **Destructive** | `bg-destructive-subtle` (`#fdf1f1`) | `text-destructive-on-subtle` (`#a82020`) | `border-destructive-border` | `bg-destructive` (`#c92a2a`) | `text-destructive-foreground` (`#ffffff`) |
| **Info** | `bg-info-subtle` (`#edf5fc`) | `text-info-on-subtle` (`#0e5ea8`) | `border-info-border` | `bg-info` (`#1270c4`) | `text-info-foreground` (`#ffffff`) |

### E. Non-Semantic Category Labels (50 tokens &mdash; 10 Hues &times; 5 Roles)
Used strictly for metadata, topics, user categories, and tags. Available hues:
`violet`, `indigo`, `teal`, `cyan`, `pink`, `lime`, `orange`, `brown`, `cool-gray`, `gray`.
For any hue `{h}`:
- Background: `bg-label-{h}-subtle`
- Text on subtle: `text-label-{h}-on-subtle`
- Border: `border-label-{h}-border`
- Solid fill: `bg-label-{h}-solid`
- Foreground: `text-label-{h}-foreground`

### F. Lines, Borders & Focus (11 tokens)
- `--border`: `border-border` (`#dedede` light / `#292929` dark) &mdash; default panel and card boundary.
- `--border-subtle`: `border-border-subtle` (`#e9e9e9` light / `#1d1d1d` dark) &mdash; table rows, dividers.
- `--ring`: `ring-ring` (`#1160c9` light / `#4a9fff` dark) &mdash; interactive focus indicator.
- `--ring-offset`: `ring-offset-ring-offset` (`#ffffff` light / `#090909` dark) &mdash; 3:1 isolation gap.

### G. Data Visualization & Charts (28 tokens)
- 12 Categorical series: `--chart-1` through `--chart-12` (`stroke-chart-1`, `bg-chart-1`, etc.).
- 7 Sequential steps: `--chart-seq-1` through `--chart-seq-7` (heatmaps).
- 7 Diverging steps: `--chart-div-neg-3` to `-1`, `--chart-div-mid`, `--chart-div-pos-1` to `3`.
- Chart layout: `--chart-grid` (`stroke-chart-grid`), `--chart-label` (`text-chart-label`).

---

## 5. Component Implementation Blueprints (Ready-to-Use TSX for AI)

When generating code for any feature, AI agents must use these exact patterns.

### A. Buttons & Interactive Controls

The framework provides two distinct categories of button variants:
1. **Standard Canvas Variants**: Engineered for neutral surfaces (`bg-background`, `bg-card`, modals, tables, and standard light/dark pages).
2. **On-Dark / Inverted Surface Variants**: Engineered for rich brand-colored sections (`Section tone="brand-deep"`, `<Hero tone="brand-deep">`, `<CtaBand tone="brand-deep">`, or dark containers).

#### Button Variant Matrix

| Variant Name | Target Surface | Visual Characteristics | Where to Use |
|---|---|---|---|
| `variant="default"` | Standard Canvas | `bg-primary text-primary-foreground` | Primary CTA on standard pages, cards, and dialogs (30% Brand). |
| `variant="secondary"` | Standard Canvas | `bg-secondary text-secondary-foreground` | Secondary neutral action on standard pages. |
| `variant="outline"` | Standard Canvas | `border bg-background hover:bg-accent` | Bordered secondary action or filter on standard pages. |
| `variant="ghost"` | Standard Canvas | `hover:bg-accent hover:text-accent-foreground` | Subtle tertiary actions, table row actions, or toolbar items. |
| `variant="destructive"` | Standard Canvas | `bg-destructive text-white` | Dangerous or irreversible actions (delete, terminate). |
| `variant="link"` | Standard Canvas | `text-primary underline-offset-4` | Inline text link styled with button semantics. |
| `variant="white"` | On-Dark / Brand-Deep | Solid pure white (`bg-white text-neutral-950 font-semibold`) | Primary high-emphasis CTA on hero sections or dark brand backgrounds. |
| `variant="white-secondary"` | On-Dark / Brand-Deep | Soft translucent glass (`bg-white/10 text-white font-medium`) | Secondary CTA on dark brand backgrounds; adapts to any dark hue. |
| `variant="white-outline"` | On-Dark / Brand-Deep | Translucent white border (`border-white/25 text-white`) | Bordered secondary/tertiary action on dark brand backgrounds. |

#### Why On-Dark Variants are Required
On deep colored backgrounds (e.g. `tone="brand-deep"` navy `#051b38`, cobalt `#101522`, teal `#0c1917`, forest `#171c13`):
- `variant="default"` (`bg-primary`) shares the same hue family as the background, resulting in weak visual hierarchy.
- `variant="secondary"` (`bg-secondary`) resolves in dark mode to an opaque charcoal block (`#292929`), which looks like an alien grey smudge over saturated brand tones.
- `variant="outline"` in dark mode injects `dark:border-input dark:bg-input/30`, resulting in a muddy dark-grey border.

The three on-dark variants (`white`, `white-secondary`, `white-outline`) solve this universally across all 6 brand presets without hardcoding arbitrary hex colors in markup. Furthermore, all three variants include automatic focus-ring isolation tuned for dark surfaces:
```tsx
focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950
```

#### Blueprint 1: Standard Canvas Actions

```tsx
import { Button } from "~/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";

// 1. Primary Action (Standard Page Canvas)
<Button>
  Get Started <ArrowRight className="size-4" />
</Button>

// 2. Secondary Neutral Action
<Button variant="secondary">
  Explore Features
</Button>

// 3. Outlined Neutral Action
<Button variant="outline">
  View Documentation
</Button>

// 4. Destructive Action
<Button variant="destructive">
  Delete Project
</Button>

// 5. Loading State
<Button disabled>
  <Loader2 className="size-4 animate-spin" /> Saving changes...
</Button>
```

#### Blueprint 2: On-Dark Hero & Brand Section Actions

```tsx
import { Button } from "~/components/ui/button";
import { ArrowRight } from "lucide-react";

// Inside <Hero tone="brand-deep"> or <Section tone="brand-deep">:

// 1. White Primary (High-Emphasis Hero CTA)
<Button variant="white" size="lg">
  Explore the design system <ArrowRight className="size-4" />
</Button>

// 2. White Secondary (Translucent Glass Effect)
<Button variant="white-secondary" size="lg">
  Why this exists
</Button>

// 3. White Outline (Bordered Action on Dark Surface)
<Button variant="white-outline" size="lg">
  Documentation
</Button>
```

### B. Hyperlinks & Brand Navigation

```tsx
import { Link } from "react-router";

// Standard accessible hyperlink
<Link
  to="/settings"
  className="text-link hover:text-link-hover underline underline-offset-4 font-medium transition-colors"
>
  Manage security preferences &rarr;
</Link>
```

### C. Form Controls & Validation States

```tsx
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Search, AlertCircle } from "lucide-react";

// Search Input with leading icon and sunken well
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-foreground-muted" />
  <Input
    type="search"
    placeholder="Filter records..."
    className="pl-9 bg-background-subtle border-border focus-visible:ring-ring text-foreground"
  />
</div>

// Form Input with Accessible Error State
<div className="space-y-1.5">
  <Label htmlFor="email" className="text-body-sm font-medium text-foreground">
    Work Email
  </Label>
  <Input
    id="email"
    aria-invalid={true}
    aria-describedby="email-error"
    defaultValue="invalid-email"
    className="border-destructive focus-visible:ring-destructive bg-card text-foreground"
  />
  <p id="email-error" className="flex items-center gap-1.5 text-body-xs font-medium text-destructive">
    <AlertCircle className="size-3.5" /> Please enter a valid company email address.
  </p>
</div>
```

### D. Metric / KPI Card

```tsx
import { TrendingUp } from "lucide-react";

<div className="rounded-xl border border-border bg-card p-5 shadow-card">
  <div className="flex items-center justify-between">
    <span className="text-body-sm font-medium text-foreground-muted">Monthly Recurring Revenue</span>
    <span className="inline-flex items-center gap-1 rounded-full bg-success-subtle border border-success-border px-2 py-0.5 text-body-xs font-semibold text-success-on-subtle">
      <TrendingUp className="size-3" /> +14.2%
    </span>
  </div>
  <div className="mt-2 flex items-baseline gap-2">
    <span className="text-h2 font-bold tracking-tight text-foreground">$48,250</span>
    <span className="text-body-xs text-foreground-muted">vs last month</span>
  </div>
  {/* Progress Bar */}
  <div className="mt-4 h-1.5 w-full rounded-full bg-background-subtle overflow-hidden">
    <div className="h-full rounded-full bg-primary" style={{ width: "72%" }} />
  </div>
</div>
```

### E. Status Alert vs Category Label Chips

```tsx
import { CircleCheck, AlertTriangle } from "lucide-react";

// System Health Alert (Status family)
<div className="flex items-start gap-3 rounded-lg border border-success-border bg-success-subtle p-4 text-success-on-subtle">
  <CircleCheck className="size-5 shrink-0" />
  <div>
    <p className="text-body-sm font-semibold">Database backup complete</p>
    <p className="text-body-xs opacity-90">All 14 replica shards synchronized successfully.</p>
  </div>
</div>

// Category Label Chips (Non-Semantic Label family)
<div className="flex items-center gap-2">
  <span className="inline-flex items-center rounded-md border border-label-violet-border bg-label-violet-subtle px-2.5 py-0.5 text-body-xs font-medium text-label-violet-on-subtle">
    Engineering
  </span>
  <span className="inline-flex items-center rounded-md border border-label-teal-border bg-label-teal-subtle px-2.5 py-0.5 text-body-xs font-medium text-label-teal-on-subtle">
    Infrastructure
  </span>
</div>
```

---

## 6. Layout Pattern Recipes (`app/components/patterns/*`)

Always compose pages using the standard patterns from `app/components/patterns/`. Never write
improvised wrappers.

| Pattern Component | Primary Role | Allowed Props & Tokens |
|---|---|---|
| `Section` | Full-bleed horizontal section container | `tone="page"` (default), `tone="raised"`, `tone="sunken"`, `tone="brand-deep"`, `tone="inverse"`, `theme="dark" \| "light"`, `size="sm" \| "md" \| "lg"` |
| `SectionHeading` | Consistent title, eyebrow, and subtitle | `eyebrow`, `title`, `description`, `align="left" \| "center"`, `aside` |
| `Hero` | Primary page header with headline, CTAs, badge | `eyebrow`, `title`, `lede`, `primary`, `secondary`, `artifact`, `trust`, `tone="page" \| "brand-deep"`, `theme="dark" \| "light"` |
| `FeatureCard` | High-density feature grid tile | `icon`, `title`, `description`, `href` |
| `IconTile` | Sunken container for Lucide SVG glyphs | `icon`, `size="sm" \| "md" \| "lg"`, `tone="neutral" \| "brand"` |
| `CtaBand` | Full-width conversion banner at page bottom | `title`, `description`, `actions`, `tone="brand-deep" \| "inverse"`, `theme="dark" \| "light"` |
| `CodeBlock` | Syntax-highlighted code specimen | `code`, `filename`, `className` |
| `LogoStrip` | Trusted-by partner logo carousel/grid | `items` |
| `PageHeader` | Interior app route header | `eyebrow`, `title`, `description` |

### Scoped Subtrees & Theme Islands (Zero-Drift Auto-Inversion)

The framework supports scoped theming and isolated theme islands at any granularity: section, container, card, or page.

1. **Auto-Inverting Dark Tones (`Section tone="brand-deep"`)**:
   - `SECTION_TONES["brand-deep"]` embeds the `dark` class automatically.
   - Because `.dark` context is active on the `<section>`, all descendant elements—including `<SectionHeading>`, `<Button variant="outline">`, `<Card>`, and muted copy (`text-foreground-muted`)—automatically resolve to their accessible dark-mode CSS tokens.
   - **Zero Manual Styling**: Never write `text-white`, `text-gray-300`, or arbitrary border colors inside a dark section. Semantic tokens (`text-foreground`, `text-foreground-muted`, `border-border`, `bg-card`) adapt automatically.
   - **Buttons on Brand-Deep Surfaces**: Inside `tone="brand-deep"` (such as `<Hero tone="brand-deep">` or `<CtaBand tone="brand-deep">`), pair primary actions with `variant="white"` and secondary actions with `variant="white-secondary"` or `variant="white-outline"`. Standard `variant="default"` lacks chromatic separation from the brand canvas, while `variant="secondary"` renders an opaque neutral dark charcoal block.

2. **Orthogonal `theme?: "dark" | "light"` Prop**:
   - `Section`, `Hero`, and `CtaBand` accept an orthogonal `theme` prop independent of their `tone`.
   - Use `<Section theme="dark">` to force a dark canvas band on an otherwise light page.
   - Use `<Section theme="light">` to create a light canvas band within a dark page.

3. **Standalone Card-Level Dark Islands**:
   - To make an individual card or widget dark on a light canvas, simply add `dark bg-card text-foreground` to its classes:
   ```tsx
   <div className="dark rounded-xl border border-border bg-card p-6 shadow-card">
     <h3 className="text-h4 font-semibold text-foreground">Dark Island Card</h3>
     <p className="mt-1 text-body-sm text-foreground-muted">
       All nested buttons and borders inherit dark tokens automatically.
     </p>
     <div className="mt-4 flex gap-2">
       <Button size="sm">Action</Button>
       <Button variant="outline" size="sm">Cancel</Button>
     </div>
   </div>
   ```

4. **Scoped Brand Presets (`data-brand="<preset>"`)**:
   - Attach `data-brand="forest"`, `data-brand="tidal"`, `data-brand="signal"`, `data-brand="terracotta"`, or `data-brand="monochrome"` to any section, card, or route container.
   - All primary buttons, links, rings, and brand accents within that element will instantly reskin to that preset's palette while respecting the surrounding light or dark mode.

---

## 7. Full Page Composition Blueprints

### Blueprint A: Marketing Landing Page

```tsx
import { Section } from "~/components/patterns/Section";
import { Hero } from "~/components/patterns/Hero";
import { SectionHeading } from "~/components/patterns/SectionHeading";
import { FeatureCard } from "~/components/patterns/FeatureCard";
import { CtaBand } from "~/components/patterns/CtaBand";
import { Button } from "~/components/ui/button";
import { Shield, Zap, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <main>
      {/* 1. Hero Section */}
      <Hero
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-accent-border bg-brand-accent-subtle px-3 py-1 text-body-xs font-semibold text-brand-accent-on-subtle">
            <Sparkles className="size-3.5" /> Next-Gen Enterprise Starter
          </span>
        }
        title="Modern full-stack foundation built for speed and security"
        subtitle="Zero-drift design system, Supabase auth, R2 storage, and Tailwind v4 ready for production."
        actions={
          <div className="flex items-center gap-3">
            <Button variant="white" className="px-6 py-2.5">
              Get Started Free
            </Button>
            <Button variant="white-outline" className="px-6 py-2.5">
              Live Demo
            </Button>
          </div>
        }
      />

      {/* 2. Feature Section (Sunken Band) */}
      <Section tone="sunken" className="py-20">
        <SectionHeading
          eyebrow="Architecture"
          title="Engineered for mission-critical workflows"
          subtitle="Every layer verified with strict TypeScript, Vitest, and Playwright."
          align="center"
        />
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={Zap}
            title="Instant Cold Starts"
            description="Sub-50ms server-rendered routes powered by Cloudflare Workers and React Router v7."
          />
          <FeatureCard
            icon={Shield}
            title="Type-Safe RBAC"
            description="Role-based access control with granular Supabase row-level security and session verification."
          />
          <FeatureCard
            icon={Sparkles}
            title="60-30-10 Branding"
            description="Plug-and-play multi-brand themes that maintain WCAG AA contrast mechanically."
          />
        </div>
      </Section>

      {/* 3. Bottom CTA Band (Deep Brand) */}
      <CtaBand
        tone="brand-deep"
        title="Ready to build your next product?"
        actions={
          <Button variant="white" className="font-semibold px-8 py-3 shadow-xs">
            Start Building Now
          </Button>
        }
      />
    </main>
  );
}
```

### Blueprint B: Authenticated App Dashboard

```tsx
import { PageHeader } from "~/components/patterns/PageHeader";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Plus, Search, Filter } from "lucide-react";

export default function DashboardRoute() {
  return (
    <div className="container-page py-8 space-y-8">
      {/* 1. Header with Breadcrumbs & Action */}
      <PageHeader
        title="Deployment Pipelines"
        description="Monitor real-time continuous deployment runs and infrastructure health."
        actions={
          <Button className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold">
            <Plus className="mr-2 size-4" /> New Pipeline
          </Button>
        }
      />

      {/* 2. KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* KPI 1 */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <p className="text-body-xs font-medium text-foreground-muted">Total Builds (30d)</p>
          <p className="mt-1 text-h3 font-bold text-foreground">1,842</p>
        </div>
        {/* KPI 2 */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <p className="text-body-xs font-medium text-foreground-muted">Average Duration</p>
          <p className="mt-1 text-h3 font-bold text-foreground">1m 42s</p>
        </div>
        {/* KPI 3 */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <p className="text-body-xs font-medium text-foreground-muted">Success Rate</p>
          <p className="mt-1 text-h3 font-bold text-success-on-subtle">99.4%</p>
        </div>
      </div>

      {/* 3. Filter Toolbar & Data Table */}
      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-foreground-muted" />
            <Input
              placeholder="Search builds..."
              className="pl-9 bg-background-subtle border-border text-foreground"
            />
          </div>
          <Button variant="outline" size="sm" className="border-border text-foreground">
            <Filter className="mr-2 size-3.5" /> Filters
          </Button>
        </div>

        {/* Accessible Table */}
        <table className="w-full text-left text-body-sm">
          <thead className="border-b border-border bg-background-subtle text-foreground-muted font-medium">
            <tr>
              <th className="px-4 py-3">Commit</th>
              <th className="px-4 py-3">Branch</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr className="hover:bg-accent transition-colors">
              <td className="px-4 py-3 font-mono text-body-xs text-foreground font-semibold">#a4b91f</td>
              <td className="px-4 py-3 text-foreground-muted">main</td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center rounded-full bg-success-subtle border border-success-border px-2 py-0.5 text-body-xs font-medium text-success-on-subtle">
                  Success
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <Button variant="ghost" size="sm" className="text-foreground hover:bg-background-subtle">
                  View Logs
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

## 8. Strict Rule 16 Guide (Status vs. Non-Semantic Labels)

The framework enforces mechanical separation between system status colors and non-semantic
categorization labels. Violating this rule will cause `npm run check:ds` to fail CI.

### Summary of Rules
- **Status Colors** (`success`, `warning`, `destructive`, `info`) indicate **health, outcomes, and alerts**.
- **Label Colors** (`--label-*`) indicate **content tags, organizational groups, categories, and topics**.

```
┌───────────────────────────────────────┬───────────────────────────────────────┐
│              DO THIS                  │             NEVER DO THIS             │
├───────────────────────────────────────┼───────────────────────────────────────┤
│ <Alert className="bg-success-subtle"> │ <Chip className="bg-success-subtle">  │
│ <Badge className="bg-warning-subtle"> │ <Tag className="bg-destructive">      │
│ <Tag className="bg-label-violet">     │ <Alert className="bg-label-indigo">   │
│ <Chip className="bg-label-cyan">      │ Tag with warning or error styling     │
└───────────────────────────────────────┴───────────────────────────────────────┘
```

---

## 9. Data Visualization & Chart Standards

Chart colors must be distinct, accessible, and never resolve to status primitives.

1. **The 12 Categorical Series (`--chart-1` to `--chart-12`)**:
   - Order: Draw from diverse hues (`brand`, `teal`, `violet`, `orange`, `cyan`, `pink`, `lime`, `indigo`, `brown`, `cool-gray`, `gray`, `slate`).
   - Sizing: Always pick the smallest palette covering your data series count. If you have $>12$ items, aggregate the tail into `--chart-12` as "Other".
   - Adjacent series maintain lightness difference $\Delta L \ge 0.05$.
   - Tested under protanopia, deuteranopia, and tritanopia color blindness simulations.

2. **Sequential & Diverging Ramps**:
   - **Heatmaps / Densities**: Use `--chart-seq-1` through `--chart-seq-7` (monotonic lightness ramp).
   - **Diverging Variances**: Use `--chart-div-neg-3` to `-1` (negative variance), `--chart-div-mid` (neutral baseline), and `--chart-div-pos-1` to `3` (positive variance).

---

## 10. Complete 57-Pair WCAG Contrast Manifest & Accessibility Rules

The framework asserts 57 specific semantic color pairings in both light and dark modes in
`tests/design-tokens.test.ts`. Every pair must clear its contract floor.

### Text Pairs (WCAG AA Floor $\ge 4.5:1$)
1. `foreground` on `background` ($18.2:1$ light / $18.4:1$ dark)
2. `foreground` on `card` ($20.1:1$ light / $16.2:1$ dark)
3. `foreground-muted` on `background` ($5.2:1$ light / $7.4:1$ dark)
4. `foreground-muted` on `card` ($5.7:1$ light / $6.8:1$ dark)
5. `link` on `background` ($5.8:1$ light / $7.1:1$ dark)
6. `primary-foreground` on `primary` ($4.6:1$ light / $4.6:1$ dark)
7. `primary-on-subtle` on `primary-subtle` ($6.2:1$ light / $8.1:1$ dark)
8. `brand-accent-foreground` on `brand-accent` ($4.69:1$ light / $7.04:1$ dark)
9. `brand-accent-on-subtle` on `brand-accent-subtle` ($7.22:1$ light / $9.27:1$ dark)
10. `success-foreground` on `success` ($4.8:1$ light / $5.2:1$ dark)
11. `success-on-subtle` on `success-subtle` ($6.4:1$ light / $7.8:1$ dark)
12. `warning-foreground` on `warning` ($4.6:1$ light / $4.9:1$ dark)
13. `warning-on-subtle` on `warning-subtle` ($5.9:1$ light / $7.1:1$ dark)
14. `destructive-foreground` on `destructive` ($5.1:1$ light / $5.4:1$ dark)
15. `destructive-on-subtle` on `destructive-subtle` ($6.8:1$ light / $8.2:1$ dark)
16. `info-foreground` on `info` ($4.7:1$ light / $5.0:1$ dark)
17. `info-on-subtle` on `info-subtle` ($6.1:1$ light / $7.4:1$ dark)
18. All 10 `label-{h}-on-subtle` on `label-{h}-subtle` ($\ge 4.5:1$)
19. All 10 `label-{h}-foreground` on `label-{h}-solid` ($\ge 4.5:1$)

### Boundary Pairs (WCAG Boundary Floor $\ge 3.0:1$)
1. `border` against `background` ($\ge 3.0:1$)
2. `border-disabled` against `surface-disabled` ($\ge 3.0:1$)
3. `ring` against `background` and `card` ($\ge 3.0:1$)

### Focus Ring Chain Proof
Interactive elements must maintain a guaranteed 3:1 focus ring visible against both the control
fill and the surrounding canvas:
```tsx
className="focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-ring-offset"
```
The `--ring-offset` acts as an isolation buffer so the `--ring` remains sharp and distinct
regardless of control background color.
