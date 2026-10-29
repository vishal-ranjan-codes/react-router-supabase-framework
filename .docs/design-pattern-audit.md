# Design Pattern Audit — Brand Tint as Surface

**Date:** 2026-10-27
**Scope:** all 29 non-`ui` app files, 45 `app/components/ui/*` files, `README.md`, `/design-system`, rendered light/dark pages
**Companion docs:** [design-system-audit.md](./design-system-audit.md) (tokens & components), [plan/](./plan/README.md) (implementation)
**Method:** source grep with counts, page-by-page read, rendered screenshots, comparison against current practice (NN/g 60-30-10, Atlassian/NY State surface tokens, 2026 trend write-ups)

---

## Verdict

The framework has exactly **one visual idea** — *"a little bit of brand blue, faded, as a background"* — and it is applied to every surface that needs to differ from the page background. It appears in marketing pages, the header, the docs page and six component files. It is not a style decision that was made; it is the **only answer the token system offers** to the question "make this slightly darker than the background", and it is then **taught to AI agents** by the README and by `/design-system` itself.

That is why every AI-generated page in this framework looks the same: the agent is not being creative, it is being obedient.

**This is fixable without a redesign.** The fix is a neutral surface scale, a small set of documented page recipes, and machine-readable rules so the next agent composes instead of imitates.

---

## 1. The pattern, precisely

| # | Motif | Evidence | Count |
| --- | --- | --- | :---: |
| P1 | Brand tint as card/section surface | `bg-primary/5` on `box` — [home.tsx:68](../app/routes/home.tsx#L68), [about.tsx:57](../app/routes/about.tsx#L57), [contact.tsx:111](../app/routes/contact.tsx#L111), [design-system.tsx:315,391](../app/routes/design-system.tsx#L315) | 9 |
| P2 | Brand tint as icon tile | `bg-primary/12 theme-rounded w-12 h-12` + `text-primary` glyph — [home.tsx:54](../app/routes/home.tsx#L54), [about.tsx:92,124](../app/routes/about.tsx#L92), [contact.tsx:192,208,224](../app/routes/contact.tsx#L192) | 9 |
| P3 | Blurred brand blob behind hero | `bg-primary/5 blur-3xl w-[800px] h-[600px] rounded-full` — [home.tsx:43](../app/routes/home.tsx#L43), [about.tsx:34](../app/routes/about.tsx#L34) | 2 |
| P4 | Brand tint as hover state | `hover:bg-primary/8` — [Header.tsx:214](../app/components/layout/Header.tsx#L214); `hover:bg-primary/5` — [about.tsx:90](../app/routes/about.tsx#L90) | 5 |
| P5 | Same idea inside components | `theme-bg-accent` = `background: var(--primary); opacity: .12` on the **whole element** — dropdown-menu.tsx:77,95; menubar.tsx:61,78,139,155,178; toggle.tsx:10,16; dialog.tsx:66 | 12 |
| P6 | Neutral band alternation (the good half) | `theme-bg-color` / `theme-bg-color-dark` section bands — home.tsx:48,118; about.tsx:103,118 | 6 |

Total: **~40 tinted-surface usages across 8 page/layout files + 6 component files.**

What is *not* affected: `dashboard-*` and `admin-*` routes. They use plain `Card` on the page background and look calm and correct. That contrast is the proof that the tint habit is a **marketing-page convention**, not a system rule — and it is the convention AI copies, because marketing pages are the templates.

## 2. Why it fails

1. **The tint carries no meaning.** A card already says "I am a card" with a border and a white surface. The blue wash adds hue without adding information, so every card, icon tile, hover and CTA competes at the same saturation and nothing is emphasised.
2. **It muddies the palette.** 5–12% of `#1877F2` over `#F5F5F5` lands near `#E4EAF2` — a blue-grey that is neither the neutral band (`#EEEEEE`) nor the card (`#FFFFFF`). The page then contains three near-identical greys plus one accidental blue-grey, which is exactly the "muddy" look the screenshots show.
3. **Dark mode breaks it differently.** `theme-bg-accent` sets `opacity: 0.12` on the *entire element*, so focused menu items and open dialogs fade their own text to 12% — the tint bug and the pattern bug are the same line of CSS.
4. **It defeats the contrast work.** Text contrast was verified against neutral surfaces. A tinted surface changes the background under the text, so every ratio in the token audit is only true for neutral backgrounds.
5. **It is out of step with current practice.** Modern product and marketing sites run a neutral-dominant environment — roughly 60% neutral surfaces, 30% secondary, 10% accent (NN/g's 60-30-10) — with elevation expressed as *surface steps, borders and shadow*, and brand colour reserved for interactive and semantic moments. Atlassian and the NY State design system both model this as explicit **surface/elevation tokens** with levels, not as alpha-blended brand washes. 2026 trend round-ups converge on the same "one dominant neutral environment, colour as punctuation" direction.

## 3. How deep it goes — and why AI follows it

The pattern survives because the framework *instructs* it at four levels:

1. **No machine-readable rules.** There is no `DESIGN.md`, no `AGENTS.md`, no `CLAUDE.md`. An AI agent's only specification is the code it can see.
2. **README teaches the vocabulary.** `README.md` §"Design system" names `theme-bg-color`, `theme-fc-base`, `box`, `container-max-md` as the sanctioned classes. An agent follows that literally and reaches for `box … bg-primary/5` because that is what the sanctioned vocabulary looks like in use.
3. **`/design-system` teaches the pattern.** Its "Best Practices" card says *"Use theme utilities (`theme-fc-base`, `bg-primary`)"* and its own examples are tinted cards and tinted radius swatches. The docs page is the strongest few-shot prompt in the repository.
4. **The pages are the templates.** `home.tsx` and `about.tsx` are the only full-page examples: hero + blurred blob + tinted feature grid + tinted CTA + banded sections. "Create a new page" means "clone the nearest page".
5. **The token gap forces it.** Today the only surfaces are page-grey and card-white. There is no neutral *raised*, *sunken* or *hover* step. Asked for "a bit darker than the background", both a human and an agent have exactly two options: brand tint, or `bg-black/5`. The vocabulary makes the pattern the path of least resistance.
6. **Nothing forbids it.** No lint rule, no test, no CI check notices a tinted surface, so drift is free.

Fixing only the visuals (repainting the pages) would last until the next agent run. Fixing only the tokens would leave the docs teaching the old pattern. The fix has to cover **tokens → recipes → examples → rules → enforcement**.

## 4. Recommended approach

### 4.1 A neutral surface scale (token layer)

Extend the v2 contract with explicit surface semantics so "darker than the background" has a neutral answer:

| Role | Token | Light | Dark | Used for |
| --- | --- | --- | --- | --- |
| Page | `--background` | `#F5F5F5` | `#0A0A0A` | page canvas, section bands |
| Raised | `--card` / `--popover` | `#FFFFFF` | `#161616` / `#1C1C1C` | cards, modals, menus |
| Sunken | `--muted` | `#EBEBEB` | `#242424` | alternate bands, inset panels, icon tiles |
| Hover / selected | `--accent` | `#ECECEC` | `#262626` | **neutral** hover and selected states |
| Action | `--primary` | `#1160C9` | `#4A9FFF` | buttons, links, focus ring, solid badges |
| Status | `--success` / `--warning` / `--destructive` / `--info` | see token audit | | semantic feedback only |

The key change versus the earlier draft: **`--accent` becomes neutral**, not a 12% brand wash. Hover and selected states stop being blue. Brand survives as *punctuation*: solid controls, link text, focus ring, and the glyph colour inside a neutral tile (`bg-muted` + `text-primary`), which is the current Stripe/Linear/Vercel idiom.

Rule, written into `DESIGN.md` and enforced by CI:

> Brand colour is never a surface. `bg-primary/*` may appear only on interactive controls, links and status chips. Surfaces are `bg-background`, `bg-card`, `bg-muted`, `bg-accent`.

### 4.2 Page recipes (composition layer)

Add `app/components/patterns/` — small composition components that consume tokens, so a new page is assembled from named recipes instead of invented markup:

- `Section` — `variant: "default" | "muted" | "inverse"`, handles band background + vertical rhythm + container.
- `SectionHeading` — eyebrow / title / lead with the type scale.
- `FeatureCard` — `bg-card border-border shadow-xs`, neutral `IconTile`, no tint.
- `IconTile` — `bg-muted text-primary` (or `text-foreground`), size variants.
- `CtaBand` — full-bleed `bg-foreground text-background` (inverse band) or bordered `bg-card`; high contrast, zero tint.
- `Hero` — type-first; optional single decorative layer driven by a `--hero-glow` token that **defaults to transparent**, so a fork can opt into a glow without the default shipping one.

Marketing pages (`home`, `about`, `contact`) are rewritten onto these recipes. They are the few-shot examples every future agent reads, so they must embody the new language exactly.

### 4.3 Teach the machine (rules layer)

- `DESIGN.md` — human- and machine-readable contract: token tables, surface rules, do/don't, recipes, accessibility minimums, update procedure.
- `AGENTS.md` at the repo root — the short list a coding agent must follow: surface vocabulary, "import from `app/components/patterns`", "never `bg-primary/*` as a surface", "read DESIGN.md before creating a page".
- `README.md` §Design system — replaced with a pointer to `DESIGN.md` plus the three surface rules, so the first document an agent reads no longer teaches the tint.
- `/design-system` — rewritten; its Best Practices section states the new rules and shows neutral recipes side by side with the old tinted ones labelled "do not".

### 4.4 Enforcement (guardrail layer)

- `scripts/check-design-system.mjs` gains two checks: fail on `bg-primary/<alpha>` outside an allowlist of interactive components; fail on `blur-3xl`/`blur-2xl` decorative blobs.
- Contrast test already covers neutral surfaces; with tints banned as surfaces, the ratios stay true.
- Playwright visual baselines on `/`, `/about`, `/design-system` catch reintroduction.

### 4.5 Why this scales to future trends

The system ends up with four layers, each independently swappable:

```
primitives   :root / .dark hex values            → retheme = edit values
semantic     @theme inline (bg-card, bg-muted…)  → rename = edit one block
components   app/components/ui (pristine shadcn) → upgrade = shadcn add
recipes      app/components/patterns + DESIGN.md → new trend = new recipe
```

A future trend (bento grids, glass surfaces, brutalist borders) becomes **a new recipe or a token override**, never a 40-file edit. That is the property the current framework lacks and the reason the tint spread everywhere.

---

## 5. Findings register

| ID | Severity | Finding |
| --- | :---: | --- |
| P1 | major | Brand tint as card/CTA surface in 4 pages; muddy neutral-plus-blue palette |
| P2 | major | Brand-tint icon tiles (9×); brand used as decoration instead of punctuation |
| P3 | minor | Blurred brand blobs behind heroes; dated 2021-era decoration, costs paint and adds nothing |
| P4 | major | Brand tint as hover/selected in header nav and cards; hover states should be neutral |
| P5 | blocker | `theme-bg-accent` applies `opacity: .12` to the whole element — focused menu items and open dialogs fade their own text |
| P6 | info | Neutral band alternation is correct and should become the `Section` recipe |
| P7 | major | No `DESIGN.md` / `AGENTS.md`; README and `/design-system` actively teach the tint pattern to AI agents |
| P8 | major | Token gap: no neutral raised/sunken/hover step, so tint is the only available "darker than background" |
| P9 | info | Dashboard/admin pages are unaffected — proof the fix is a convention change, not a redesign |

## 6. What this changes in the v2 plan

1. **Phase 1 (tokens):** `--accent` becomes neutral (`#ECECEC` / `#262626`); add `--hero-glow: transparent`; keep `--muted` as the sunken step.
2. **Phase 2 (migration):** migration map gains pattern rows — `bg-primary/5` → `bg-muted` or `bg-card`, `bg-primary/12` tile → `bg-muted`, blob → deleted, tinted CTA → `CtaBand`.
3. **New Phase 2.5 (recipes):** create `app/components/patterns/*` and rewrite `home`, `about`, `contact` onto them.
4. **New Phase 4.5 (rules):** `AGENTS.md`, `DESIGN.md`, README rewrite, `/design-system` Best Practices rewrite.
5. **Guardrails:** surface-misuse and blob checks added to `check-design-system.mjs`.

Everything else in [plan/](./plan/README.md) stands: the token contract, the re-vendor, the accessibility work and the test/CI guardrails are unaffected and still prerequisite to this layer.

---

## References

- [Using Color to Enhance Your Design — Nielsen Norman Group](https://www.nngroup.com/articles/color-enhance-design/) (60-30-10 proportion rule)
- [Design tokens — Atlassian Design System](https://atlassian.design/components/tokens) (elevation/surface tokens)
- [Design Tokens — New York State Design System](https://designsystem.ny.gov/foundations/tokens/) (semantic surface and status tokens)
- [Semantic colour tokens in action — fourzerothree](https://www.fourzerothree.in/p/semantic-colour-tokens-in-action) (three-level surface scale)
- [Design tokens need more than semantics — Nate Baldwin](https://medium.com/@NateBaldwin/design-tokens-need-more-than-semantics-0e5a85df0d33)
- [The ultimate color guideline for 2026](https://www.linkedin.com/pulse/ultimate-color-guideline-2026-david-pokorn%C3%BD-iltte) (60% neutral environment)
- [2026 Brand Color Trends for Web Design](https://daveyandkrista.com/2026-brand-color-trends/) (one dominant neutral, colour as accent)
- [Top Web Design Trends for 2026 — Figma](https://www.figma.com/resource-library/web-design-trends/)
