# Phase 5 — Docs, rules layer, style guide, guardrails (PR 5)

**Closes:** pattern-audit P7–P9 (docs teach the tint; nothing rejects it); design-system-audit
documentation findings. **Does not change any token value.** The two open defects in `README.md`
§Status — the light-mode `background-subtle`/`muted`/`accent`/`secondary` collision, and `secondary`
on a `brand-deep` band at 1.08:1 in dark mode — are fixed in **phase 6** (`08-phase-6-completeness.md`),
together with the duplicate-step check that proves them. Splitting them that way is deliberate: one PR
cannot both introduce a check and pass it without leaving CI red or shipping the check pre-waived, and
phase 5 has already been bitten once by exactly that pattern (§4, escape-hatch policy).
**Of the `02` §7 open contrast items:** `--foreground-subtle`'s dark 3.82:1 is resolved here (single
step move); `--surface-brand` on-* tokens are phase 6; `--chart-3` and the palette-wide constraints
are phase 7.
**Read first:** `README.md`, `01-context.md` §4 (D9), `02-token-contract.md`.
**Depends on:** phase 3. **Blocks:** phase 6.

## 1. `AGENTS.md` (repo root) — the file AI tools read first

Short and imperative:

```md
# Design rules (read before writing any UI)
1. Colour vocabulary = the semantic tokens in DESIGN.md. Never write a hex value, never write
   `bg-primary/<alpha>`, never use `opacity` to fake a surface.
2. Need "slightly darker than the page"? `bg-background-subtle` (static) or `bg-accent`
   (hover/selected). A panel on the page? `bg-card border border-border shadow-card`.
3. Brand colour is punctuation: buttons, links, active nav, badges, focus ring, chart series, one
   icon glyph. The only large brand surface is one full-bleed `Section tone="brand-deep"` per page.
   ≤10% of the viewport.
4. Exactly one chromatic brand hue. `--secondary`, `--accent` and `--muted` are neutral by decision —
   `bg-accent` is the hover/selected surface, not an accent colour. Never add a second brand colour,
   never tint `accent`; tag/series hues are a separate non-semantic family (`--label-*`, `--chart-*`)
   and land with phases 6–7, so do not improvise one with `bg-primary/<alpha>`.
5. Sections are full-bleed; boxes are for cards, grids, forms and modals only. Build pages from
   `app/components/patterns/*` (Section, SectionHeading, Hero, CodeBlock, FeatureCard, IconTile,
   CtaBand, LogoStrip, PageHeader). Extend via `className`; do not fork.
6. `app/components/ui/**` is upstream shadcn. Wrap it, never edit it. Deviations go in
   `app/components/ui/PATCHES.md`.
7. `npm run check:ds` must pass. It rejects brand-alpha surfaces and decorative blur blobs.
```

`AGENTS.md` already exists with rules 1–7 (the single-hue rule was added on 2026-10-28 alongside
D11), so this phase **amends** it rather than writing it. Keep the two in step if a rule changes.

## 2. `DESIGN.md` (repo root)

Sections: Principles (tokens over classes; upstream over forks; brand as punctuation; **one brand
hue**; contrast is a test) · Surface ladder (the §4.1 table verbatim + a "which token do I want?"
decision list) · Token
tables (name, light, dark, contrast, use, never) · Type scale · Radius/spacing/elevation · Recipes
(the phase-3 table, each with a rendered example on `/design-system`) · Component ownership ·
Variant rules (variants live in components; pages don't invent `danger`/`premium`/`compact` with
class strings) · Accessibility rules · Update procedure (§5 below) · Decision log (why `#1160C9`,
why `@theme inline`, why the tint was removed — links the audits).

Phase 5 documents the vocabulary as shipped by phase 4 — no context tokens, no label family, no
12-series palette. `08` §9 and `09` §4 each amend this file for the tokens their phase adds; that is
two edits to the token tables, not a rewrite, and it is why the decision list in the surface-ladder
section must be written as a list of *questions* ("what is this element sitting on?") rather than a
list of answers, so a new context token slots in without restructuring the prose.

`README.md` §"Design system" is rewritten to point at `DESIGN.md` and show the surface ladder; the
`theme-*` documentation is deleted (it is one reason agents reproduce the old pattern).

## 3. Rewrite `/design-system` (improve, not recreate)

**Already landed** (pulled forward with phase 4, because the page is the reference an agent copies):
the brand ramp now paints from `var(--p-brand-*)` rather than a fabricated hex table — the old block
labelled `#1877F2` "Facebook Blue" as our primary when `--primary` is `#1160c9` — followed by a
**Brand roles** panel; the radius swatches use `bg-background-subtle`; "Highlighted Card" became
"Selected Card" (`border-primary bg-accent`); the boxed `bg-primary/5` CTA became a real full-bleed
`<CtaBand tone="brand-deep">` outside the container; and the Do/Don't lists state the actual contract
rules. Remaining work below.

- Driven by `app/lib/design-system.ts` (name → CSS var → usage → contrast) so page and tests share
  one description.
- New **Surfaces** section: the ladder rendered as labelled panels in both themes with use/never.
- New **Patterns** section: every recipe rendered with props and a "use when".
- Correctness: the Typography Colors block still hardcodes hexes and renders `text-foreground` for
  every entry, so "Heading" and "Heading Light" are indistinguishable — apply the same
  read-from-the-token treatment the brand ramp got.
- Show all states: default, hover, focus-visible, active, disabled, loading, error, empty.
- Side-by-side light/dark panels; token table with computed ratios and pass/fail badges.
- Do/Don't: already rewritten — keep it in sync with `AGENTS.md` if a rule changes.
- Keep existing section ids (`#colors`, `#typography`, `#components`) — Header/README link to them.

## 4. Guardrails

**`scripts/check-design-system.mjs`** (zero-dependency, runs after build):
1. Parse `:root` and `.dark`; assert every Tier-2 key from `02` §4 exists in **both**.
2. Assert no `@theme` entry references itself.
3. Assert every `var(--x)` inside `@theme inline` is defined in `:root`.
4. Fail on any `theme-` utility in `app/**/*.tsx`.
5. Assert the built CSS contains the critical-utility manifest (`bg-card`, `bg-popover`, `ring-ring`,
   `border-input`, `bg-success-subtle`, `text-h1`, `text-display`, `animate-in`, `shadow-card`, …).
6. **Surface misuse** — fail on `bg-(primary|info|success|warning|destructive|chart-\d)/<digits>` in
   `app/routes/**`, `app/components/{layout,patterns,auth}/**`, `app/globals.css`. `ui/**` exempt.
   Escape hatch: see "Escape-hatch policy" below.
7. **Decorative blobs** — fail on `blur-3xl` / `blur-2xl` in `app/**/*.tsx`, same escape hatch.
8. **No opacity-in-utility** — fail on any `@utility` in `globals.css` that sets `opacity`.
9. **Docs honesty** — every file in `app/components/patterns/` is rendered by
   `app/routes/design-system.tsx`.

   Rules 10–13 (duplicate step, unreferenced token, `color-scheme` present, focus chain) are **phase
   6**, shipped in the same commit as the values that satisfy them. Phase 5 ships 1–9 only, each of
   which passes against the tree as phase 4 left it.

**Escape-hatch policy.** Check 6 originally read "a line carrying `ds-allow: <reason>` passes", and
that was abused before the checker existed: the phase 1–4 implementation stamped
`ds-allow: phase 5` onto all 10 violations, so the guardrail would have shipped pre-waived. Tighten
it:

- `ds-allow` is legal **only** in `app/routes/design-system.tsx` (the one file that must print a
  banned class in order to document it). Anywhere else = fail.
- The reason must be ≥15 characters and must not match `/phase\s*\d|todo|fixme|later|n\/?a/i`.
  A deferral is not a reason.
- Print the waiver count in the check output so a growing list is visible in CI.

All 10 original waivers are now gone: the 6 brand-ramp swatches read their colour live from
`var(--p-brand-*)` instead of a `bg-primary/<alpha>` utility, and the radius panels, the
"Highlighted Card" and the boxed CTA were replaced (see §3). One legitimate waiver remains, on the
Don't list line that quotes `bg-primary/5`.

Checks 6–8 are what stop the pattern returning; a regenerated page cannot be un-shipped, so the ban
must be mechanical.

**`tests/design-tokens.test.ts`** (vitest): parse the same CSS, compute WCAG 2.2 ratios for the full
pair manifest from `02` §7 in both themes, fail with pair name + actual ratio.

**`e2e/visual.spec.ts`** (Playwright): `/`, `/about`, `/contact`, `/design-system`, `/sign-in` at
1280×800 and 390×844, light + dark, `animations: "disabled"`, `maxDiffPixelRatio: 0.01`; baselines
generated in CI (Linux) only.

> **Shipped differently.** This machine is win32 with no Docker, so the Linux-only rule would have
> meant shipping a screenshot suite with no baselines — a check that cannot fail. The committed set
> was rendered on win32 and the visual job runs on `windows-latest`; `snapshotPathTemplate` keys the
> path by `{platform}` so any other OS fails with "snapshot missing" instead of diffing against a
> different rasteriser. See decision D16. The same file also asserts the structural claims the
> contract makes (one brand band, no blur blob, full-bleed sections, a theme flip that changes the
> canvas, no dangling in-page anchor), which is what caught `href="#tokens"` pointing at nothing.

**`e2e/a11y.spec.ts`**: `@axe-core/playwright` on the same routes/themes; fail on serious/critical.
Runs `emulateMedia({ reducedMotion: "reduce" })` so `animate-pulse` is measured at rest, and excludes
the disabled-state specimen — WCAG 1.4.3 exempts inactive controls, which is a rule, not a waiver.

**`scripts/ds-drift.mjs`** (manual, weekly): fetch
`https://ui.shadcn.com/r/styles/new-york/<component>.json`, compare `files[0].content`, print drifted
components.

> **Shipped differently.** The endpoint is `r/styles/new-york-v4/<name>.json` — the plain `new-york`
> one serves the pre-v4 item with `@radix-ui/react-slot` imports, which would report every file as
> drifted. Raw comparison is useless for the same reason: the CLI re-aliases imports, Biome re-formats
> semicolons and wrapping, and `"use client"` is stripped from some files and kept in others. So the
> script undoes those three transforms on both sides, formats the upstream text with the repo's own
> Biome, and reports only lines that genuinely differ — 37 in sync, 6 declared in `PATCHES.md`,
> 1 declared never-vendored, exit 1 otherwise.

## 5. CI + scripts

`.github/workflows/test.yml`: quality job runs `npm run check:ds` after Build; e2e job picks up the
new specs automatically.

> **Shipped differently.** "Automatically" would have made the Ubuntu job run the visual project and
> fail on a missing Linux baseline. The e2e job now passes `--project=chromium`, and a second job on
> `windows-latest` passes `--project=visual`. `ds:add` pins the CLI (`npx shadcn@4.23.0 …`) because
> `shadcn` is not a dependency, so an unpinned script would work only on a machine that happens to
> have it installed globally.

```json
"ds:add": "npx shadcn@4.23.0 add --overwrite --yes",
"ds:drift": "node scripts/ds-drift.mjs",
"check:ds": "node scripts/check-design-system.mjs"
```

Update procedure (in DESIGN.md): `npm run ds:drift` → `npx shadcn@<ver> add <c> --overwrite --yes` on
a branch → `git diff app/components/ui` (only `PATCHES.md`-listed lines expected) → tests +
`check:ds` → if a patch is needed, prefer a token change first.
