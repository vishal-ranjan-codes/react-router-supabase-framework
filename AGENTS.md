# AGENTS.md

Design constraints for anything writing UI in this repository. Read this before
editing `app/`.

## Colour

1. The colour vocabulary is the semantic tokens in `app/globals.css`
   (`:root` and `.dark`). Never write a hex value, never write
   `bg-primary/<alpha>`, never use `opacity` to fake a surface.
2. Need "slightly darker than the page"? Use `bg-background-subtle` (static) or
   `bg-accent` (hover / selected). Need a panel sitting on the page? Use
   `bg-card border border-border shadow-card`.
3. Brand colour is punctuation: buttons, links, active nav, badges, the focus
   ring, chart series, one icon glyph. The only large brand surface is one
   full-bleed `Section tone="brand-deep"` per page — brand should stay under
   about 10% of the viewport.
4. There is exactly **one** chromatic brand hue, and that is the whole system.
   `--secondary`, `--accent` and `--muted` are neutral _by decision_: `bg-accent`
   is the hover/selected surface, not an accent colour. Do not add a second brand
   colour and do not tint `accent` — that is the bug `.docs/design-system-audit.md`
   B5 records and decision D11 forbids. Hues for tags and chart series are a
   separate, non-semantic family (`--label-*`, `--chart-*`) that arrives with
   phases 6–7 of `.docs/plan/`; until they exist, do not improvise one with
   `bg-primary/<alpha>`.

## Layout

5. Sections are full-bleed; boxes are for cards, grids, forms and modals only.
   Build pages from `app/components/patterns/*` — `Section`, `SectionHeading`,
   `Hero`, `CodeBlock`, `FeatureCard`, `IconTile`, `CtaBand`, `LogoStrip`,
   `PageHeader`. Extend them with `className`; do not fork a copy into a route.

## Components

6. `app/components/ui/**` is upstream shadcn. Wrap it, never edit it. Any
   deviation is recorded in `app/components/ui/PATCHES.md`.

## Checks

7. `npm run lint && npm run typecheck && npm test && npm run check:ds` must pass.
   `check:ds` runs 9 rules that mechanically reject brand-alpha surface fills,
   decorative blur blobs, tokens missing from one theme, and undocumented
   patterns. `ds-allow` is legal only in `app/routes/design-system.tsx`, which
   has to print a banned class to document it — never add a waiver to make a
   check pass; change the class.
8. The browser suite is part of the contract, not an optional extra:
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
- `.docs/plan/02-token-contract.md` holds the original contract; `.docs/plan/`
  holds the phase plan and the audits that motivated it.
