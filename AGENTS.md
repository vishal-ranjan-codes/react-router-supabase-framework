# AGENTS.md

Design constraints for anything writing UI in this repository. Read this before
editing `app/`.

## Colour

1. The colour vocabulary is the semantic tokens in `app/globals.css`
   (`:root` and `.dark`). Never write a hex value, never write
   `bg-primary/<alpha>`, never use `opacity` to fake a surface.
2. Surface hierarchy (Refined Subdued Canvas): The page canvas is luminous
   off-white `bg-background` (`#fafafa` in light, `#090909` in dark). Raised panels and cards
   sit above the canvas with `bg-card` (`#ffffff` in light, `#141414` in dark) + `border-border`
   - `shadow-card`. Need a sunken well or icon tile? Use `bg-background-subtle` (`#f3f3f3` in light,
     `#1d1d1d` in dark). Need interactive feedback? Use `bg-accent` (hover) or `bg-accent-selected` (selected).
3. Brand colour is punctuation: buttons, links, active nav, badges, the focus
   ring, chart series, one icon glyph. Large brand surfaces are bookends: at
   most one full-bleed `Section tone="brand-deep"` in the page body, plus a
   closing `CtaBand tone="brand-deep"` only as the page's last section
   (`e2e/visual.spec.ts` enforces the ceiling). Never two body bands, never
   adjacent bands — the neutral canvas between them is what keeps brand under
   about 10% of the viewport at any scroll position.
4. Global Branding & Single-Primary Default: The framework defaults to a Single-Primary
   brand system (`siteThemeConfig.enableAccent = false` in `app/config/theme.ts`). When
   accent is disabled, `--brand-accent` automatically aliases to `--primary`.
   - When chromatic accent is enabled (`enableAccent = true`), its scope is strictly restricted
     to **tiny punctuation only**: an 8px indicator dot or a small pill badge.
   - **NEVER use `--brand-accent` on buttons (`<Button>`).** Primary CTAs must always use `bg-primary`
     (`default` variant) or neutral outlines. On dark hero or brand-deep sections, use the on-dark variants (`white`, `white-secondary`, `white-outline`).
   - **NEVER use `--brand-accent` on cards, hero backgrounds, or large surfaces.**
   - `--accent` and `--secondary` are neutral component surfaces by decision (hover/selected and neutral controls);
     do not tint them to improvise an accent. For presets, see `app/lib/theme-presets.ts` and `app/config/theme.ts`.
     Non-semantic category tags use the 10 label families (`--label-*`), never improvised `bg-primary/<alpha>`.

## Layout

5. Sections are full-bleed; boxes are for cards, grids, forms and modals only.
   Build pages from `app/components/patterns/*` — `Section`, `SectionHeading`,
   `Hero`, `CodeBlock`, `FeatureCard`, `IconTile`, `CtaBand`, `LogoStrip`,
   `PageHeader`. Extend them with `className`; do not fork a copy into a route.

6. Scoped Subtrees & Theme Islands:
   - Auto-Inverting Dark Tones: `Section tone="brand-deep"` automatically embeds
     the `dark` class. All nested components (`SectionHeading`, `Button variant="outline"`,
     `Card`, `p.text-foreground-muted`) automatically resolve to accessible dark-mode tokens. On `tone="brand-deep"`, use `variant="white"` for primary CTAs and `variant="white-secondary"` or `variant="white-outline"` for secondary CTAs.
   - Orthogonal Theme Prop: `<Section>`, `<Hero>`, and `<CtaBand>` accept `theme="dark" | "light"`
     to force a dark or light island on any page.
   - Scoped Card/Subtree Islands: Add `className="dark bg-card text-foreground"` to any container
     to create an isolated dark island on a light page.
   - Scoped Presets: Add `data-brand="<preset>"` to any container to reskin just that subtree.
   - **AI Rule**: NEVER write `text-white`, `text-gray-300`, or improvised border colors on
     dark sections or dark cards. Semantic tokens (`text-foreground`, `text-foreground-muted`,
     `border-border`, `bg-card`) adapt automatically under `.dark`.

## Components

7. `app/components/ui/**` is upstream shadcn. Wrap it, never edit it. Any
   deviation is recorded in `app/components/ui/PATCHES.md`.

## Checks

8. `npm run lint && npm run typecheck && npm test && npm run check:ds` must pass.
   `check:ds` runs 13 rules that mechanically reject brand-alpha surface fills,
   decorative blur blobs, tokens missing from one theme, and undocumented
   patterns. `ds-allow` is legal only in `app/routes/design-system.tsx`, which
   has to print a banned class to document it — never add a waiver to make a
   check pass; change the class.
9. The browser suite is part of the contract, not an optional extra:
   `e2e/a11y.spec.ts` fails on any serious axe violation in either theme, and
   `e2e/visual.spec.ts` diffs 20 screenshots whose baselines are committed under
   `e2e/__screenshots__/win32/`. Regenerate them only on a Windows runner —
   font rendering differs per OS, and a Linux set makes CI compare nothing.

## Where the detail lives

- `DESIGN.md` is the canonical prose guide: principles, the surface ladder,
  every token table, the nine recipes, accessibility rules and the decision log.
- `app/lib/design-system.ts` is the machine-readable contract — the same file
  `/design-system` renders and `tests/design-tokens.test.ts` asserts. A new
  token is added there and in `app/globals.css`, never in prose.
- `.docs/plans/01-design-system-foundation/02-token-contract.md` holds the original contract; `.docs/plans/01-design-system-foundation/`
  holds the phase plan and the audits that motivated it.
