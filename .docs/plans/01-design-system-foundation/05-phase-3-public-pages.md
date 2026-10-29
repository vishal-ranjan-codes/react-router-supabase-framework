# Phase 3 — Recipes + public-page recreation (PR 3)

**Closes:** pattern-audit P1–P3, P5–P6; public-pages-audit L1–L12.
**Read first:** `README.md`, `01-context.md` §4 (D5–D8), `02-token-contract.md` §4.1/§4.3,
[../public-pages-audit.md](../public-pages-audit.md).
**Depends on:** phase 2. **Blocks:** phases 4, 5.

This phase exists because two audits agree the layout vocabulary is missing words: the only ideas
were "page background" and "box", and the only emphasis was brand tint. Patching cannot fix that;
the pages are recreated from scratch.

## 1. `app/components/patterns/` — nine recipes

`Section` paints its background **edge to edge**; only the inner container is constrained. That one
behaviour removes the "box floating in whitespace" look (L1).

| Component | Props | Replaces |
| --- | --- | --- |
| `Section` | `tone?: "page" \| "raised" \| "sunken" \| "inverse" \| "brand-deep"`, `size?: "sm" \| "md" \| "lg"` (maps to `--space-section-*`), `as?`, `id?`, `className?` | every `<section className="py-16 …">` and every boxed CTA |
| `SectionHeading` | `eyebrow?`, `title`, `description?`, `align?: "left" \| "center"`, `aside?` (slot), `className?` | the repeated centred `theme-h2 text-center mb-12` |
| `Hero` | `eyebrow?`, `title`, `lede?`, `primary?`, `secondary?`, `artifact?` (slot), `trust?` (slot), `tone?: "page" \| "brand-deep"` | the three centred hero blocks + blob (L2) |
| `CodeBlock` | `code`, `filename?`, `className?` | new — hero/quickstart artifact (L12) |
| `FeatureCard` | `icon?`, `title`, `description`, `href?`, `className?` | `box p-6` + tile + heading + body |
| `IconTile` | `size?: "sm" \| "md" \| "lg"`, `tone?: "muted" \| "brand"` | the 12 `bg-primary/12` tiles |
| `CtaBand` | `title`, `description`, `actions`, `tone?: "brand-deep" \| "inverse"` | `box p-12 … bg-primary/5` (L1) |
| `LogoStrip` | `items: {label}[]`, `className?` | new — trust/stack strip (L12) |
| `PageHeader` | `eyebrow?`, `title`, `description?`, `className?` | centred title blocks on `/about`, `/contact` |

Defaults that encode the language:

- `Section tone="brand-deep"` → `bg-surface-brand text-primary-deep-foreground` (the user's
  "darker version of our primary as a full-width background", as a solid token — never an alpha).
- `tone="inverse"` → `bg-surface-inverse text-foreground-inverse`; `tone="sunken"` →
  `bg-background-subtle`; `tone="raised"` → `bg-card border-y border-border`.
- `Hero` is a two-column grid on `lg` (copy left, `artifact` right), stacked left-aligned below;
  renders `--hero-glow` (ships `transparent`), no blob.
- `CtaBand` puts copy left and actions right on desktop, stacked left on mobile. Never centred in a
  box.
- `IconTile tone="muted"` → `bg-background-subtle text-foreground`; `tone="brand"` →
  `bg-primary text-primary-foreground`, **at most one per page**.
- `FeatureCard` static default card surface (`bg-card border-border shadow-sm`), never a fill.

Rules: recipes compose `ui/` primitives + tokens only (no hex, no alpha surfaces, no `style={{}}`);
every recipe takes `className` merged with `cn()`; a recipe must appear on ≥2 pages; recipes are
optional — a one-off layout may use plain utilities from the contract (the CI check bans the tint,
not the recipe).

## 2. Recreate the public pages

`home.tsx`, `about.tsx`, `contact.tsx` are **deleted and rewritten**. Existing copy and composition
are not carried over; only still-true facts (stack, component count, deploy target) survive,
re-worded.

**`/`** — 1 `Hero tone="brand-deep"` (eyebrow "React Router 8 · Supabase · Cloudflare Workers",
display heading, one-sentence lede, primary + ghost CTA, `artifact` = `CodeBlock` quickstart,
`trust` = `LogoStrip` of four stack wordmarks) · 2 `Section page` with left `SectionHeading` + six
`FeatureCard`s · 3 `Section sunken` two-column architecture split (prose + `CodeBlock` of the
middleware shape) · 4 `Section page` design-system showcase (three live specimens from `ui/`) ·
5 `CtaBand tone="brand-deep"` with the clone command in a `CodeBlock`.

**`/about`** — 1 `PageHeader` + mission paragraph on `page` · 2 `Section sunken` numbered principles,
three columns, left-aligned, no icon tiles · 3 `Section page` `LogoStrip` + stack table
(name / role / why) · 4 `CtaBand tone="inverse"` (contribute / read the docs).

**`/contact`** — 1 `PageHeader` · 2 `Section page` two columns: left a **working form** (name, email,
message; `Label`+`Input`+`Textarea`+`Button`, client-side validation, success `Alert`, `mailto:`
fallback — no backend, no "Phase 2" stub), right an information rail as plain definition rows,
**not boxes** · 3 community links live in the footer only; no social-tile row.

Cross-page: at most one `sunken` and exactly one `brand-deep` band per page; section headings
left-aligned except inside `CtaBand`; spacing via `Section size`, never uniform `py-*`; every icon
from `lucide-react` (deletes ~20 inline SVGs, L11).

## 3. Header and Footer refresh (L5, L7, L8)

- **Header**: 80→64px; `bg-card/80 backdrop-blur-md` (replaces the dead `bg-opacity-90`); delete the
  three dead nav targets (Introduction/Installation/Configuration → `/`) and collapse the mega-menus
  to real destinations: Docs (`/design-system`), About, Contact + auth buttons. Keep `MobileNav`.
- **HeaderNav extraction**: move the desktop navigation currently inlined in `Header.tsx` (the
  `NavigationMenu` block, the plain About/Contact links and the `ListItem` helper) into
  `app/components/layout/HeaderNav.tsx`, and render `<HeaderNav />` from `Header`. The menu is
  described once as a typed array (label, destination, optional dropdown entries) inside
  `HeaderNav`, so destinations stop being hand-repeated JSX. `MobileNav` stays its own component —
  the sheet pattern genuinely differs from the desktop bar.
- **Footer**: wrap in `Section tone="inverse"` (removes `mt-20` and the grey tint); keep four
  columns; absorb the community links; drop the emoji from the legal line.

## 4. `/design-system`: improve, not recreate

Structure (anchored sections) is sound and referenced by Header/README/tests. Phase 5 rewrites its
content (surfaces, patterns, states, token table). Do not recreate.

## 5. Acceptance (PR 3)

- [ ] `grep -rn "bg-primary/" app/routes app/components/layout` → 0 hits outside `ds-allow`.
- [ ] No `box`/`max-w-* mx-auto` wrapper around any hero or CTA.
- [ ] Each page: ≥3 distinct surface roles, exactly one `brand-deep` band.
- [ ] Brand coverage ≤10% of a full-page 1280×800 screenshot (measure once, record in the PR).
- [ ] No dead links; no placeholder copy ("Phase 2", "coming soon").
- [ ] `brand-deep` band keeps ≥4.5:1 text in both themes (10.63 light / 12.36 dark).
- [ ] Before/after full-page screenshots of all three pages, light + dark, attached to the PR.

## 6. Not in this phase

Dashboard/admin restyle (already token-clean; only hover colour changes via neutral `--accent`);
animation libraries, CMS, A/B, i18n; new routes (`/docs` is a follow-up); a contact-form backend.
