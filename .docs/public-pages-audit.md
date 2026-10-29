# Public Pages — Design Audit

**Scope:** every page a visitor (or an AI agent) lands on before signing in — `/`, `/about`,
`/contact`, plus the shared `Header` / `Footer` that frame them. `/design-system` is reviewed only
for how it teaches, since it is documentation rather than marketing.

**Method:** read every route in full, then rendered `/`, `/about`, `/contact` at 1280×800 (light)
and inspected full-page screenshots. Findings cite `file:line` and, where the rendered result is the
evidence, describe the screenshot.

**Verdict:** the pages are not badly built — they are *undirected*. Every section uses the same
grey field, the same centred composition, the same spacing, and the same boxed container, so no
moment on any page is emphasised. The one attempt at emphasis — fading the brand blue into a
background — reads as a stain rather than a surface (see
[design-pattern-audit.md](./design-pattern-audit.md)). Recreating these pages from scratch is the
right call; patching them would preserve a layout language that has nothing to say.

---

## Findings

### L1 — Everything is a box, including the moments that shouldn't be

Cards and grids belong in boxes. Calls to action, heroes and section intros do not — they are
*moments*, and a box turns a moment into an object floating in whitespace.

- Home CTA: [home.tsx:79](../app/routes/home.tsx#L79) — `box p-12 … bg-primary/5 … max-w-3xl mx-auto`.
  Rendered: a pale rectangle adrift in ~200px of empty page on every side (the user's screenshot).
- About CTA: [about.tsx:104](../app/routes/about.tsx#L104) — same shape, grey fill.
- Contact: the *entire page* is four boxes — [contact.tsx:24](../app/routes/contact.tsx#L24),
  [:33](../app/routes/contact.tsx#L33), [:111](../app/routes/contact.tsx#L111),
  [:185](../app/routes/contact.tsx#L185). The left "Send us a Message" box renders as a ~900px-tall
  empty panel because its only content is a stub (L5).

A full-bleed section — background edge to edge, content constrained by the container — gives the eye
a rest and lets colour carry the emphasis. The framework has no component and no token for it.

### L2 — The hero is not a hero

[home.tsx:13-40](../app/routes/home.tsx#L13): a centred `h1`, a centred lede, two centred buttons, on
the flat page background. The decorative blob behind it ([home.tsx:43](../app/routes/home.tsx#L43),
`bg-primary/5 blur-3xl`) is invisible at 5% opacity, so the rendered hero is black text on grey with
~150px of dead space under the buttons. `/about` ([about.tsx:11-36](../app/routes/about.tsx#L11)) and
`/contact` ([contact.tsx:15-20](../app/routes/contact.tsx#L15)) repeat the identical centred block.

A hero needs an anchor: for a developer framework the strongest anchor is the product itself — a
terminal/code frame or a UI shot — beside or under the copy, plus an eyebrow, one primary action and
a trust strip. None of that exists.

### L3 — No full-bleed dark or deep-brand moment anywhere

The user's specific ask — hero or CTA on a dark, or deeper-primary, full-width background with light
text — is currently *inexpressible*: there is no dark surface token and no inverse band component.
The only "bands" are `theme-bg-color-dark` (a ~4% grey tint, [home.tsx:47](../app/routes/home.tsx#L47))
and the boxed CTA. This is a token gap as much as a design gap; the fix lands in the token contract
(`--primary-deep`) before any page work.

### L4 — Monotone rhythm: same alignment, same spacing, same background, forever

Every section heading is centred (`theme-h2 text-center`, [home.tsx:49](../app/routes/home.tsx#L49),
[about.tsx:88](../app/routes/about.tsx#L88)); every grid is centred; every section is `py-16`/`py-24`
with `gap-8`. The three full-page screenshots have the same silhouette: grey field, centred text,
row of boxes, grey field. Nothing alternates, so nothing hierarchy.

### L5 — Public pages ship stubs and dead links

- [contact.tsx:26-28](../app/routes/contact.tsx#L26): "Contact form will be available in Phase 2."
  is the page's only content in its primary column.
- [Header.tsx:48,54,57](../app/components/layout/Header.tsx#L48): "Introduction", "Installation" and
  "Configuration" all link to `/`. The footer repeats them
  ([Footer.tsx:24-47](../app/components/layout/Footer.tsx#L24)).
- Three mega-menu dropdowns ([Header.tsx:45-120](../app/components/layout/Header.tsx#L45)) for a
  four-page public site is over-navigation pointing at pages that don't exist.

An AI agent treats these as the reference implementation; stubs and dead links get copied too.

### L6 — Brand tint used as surface (cross-reference: pattern audit P1/P2)

`bg-primary/5` CTA and Quick Links ([home.tsx:80](../app/routes/home.tsx#L80),
[contact.tsx:111](../app/routes/contact.tsx#L111)), `bg-primary/12` icon and social tiles
([home.tsx:54](../app/routes/home.tsx#L54), [about.tsx:92](../app/routes/about.tsx#L92),
[contact.tsx:192](../app/routes/contact.tsx#L192)), `bg-primary/8` nav hover
([Header.tsx:214](../app/components/layout/Header.tsx#L214)). Covered by the pattern audit; listed
here because the recreation must not reintroduce it.

### L7 — Header is tall, opaque and pretending to be translucent

[Header.tsx:24-26](../app/components/layout/Header.tsx#L24): `h-20` (80px) with `bg-opacity-90` —
Tailwind v3 syntax that does nothing in v4 — so the intended translucent blurred bar renders as a
solid white slab. The class also silently documents a version that isn't installed.

### L8 — Footer neither bookends nor finishes the page

[Footer.tsx:5](../app/components/layout/Footer.tsx#L5): grey `theme-bg-color-dark` plus `mt-20`,
which stacks against the page's own bottom padding and produces the double gap visible above the
footer on all three screenshots. The legal line carries an emoji
([Footer.tsx:120](../app/components/layout/Footer.tsx#L120)). A dark/inverse footer would close the
page the way a dark hero opens it.

### L9 — Vertical whitespace debt

Uniform `py-*` plus `mb-12`/`mb-20` stacking leaves ~350px of empty page between the contact grid and
the footer, and ~120px between the about hero and its first section. Spacing is applied everywhere
uniformly instead of being budgeted per section.

### L10 — The type scale and the pages disagree

`theme-h1` is 2rem, so every page overrides it ad hoc (`text-4xl md:text-5xl lg:text-6xl`,
[home.tsx:22](../app/routes/home.tsx#L22)). Hero size is therefore arbitrary per page and the scale
documented on `/design-system` is not the scale in use. There is also no display step above `h1`
for a hero to use.

### L11 — No icon system

~20 hand-written inline SVG paths are duplicated across the three pages (feature icons, tech icons,
principle icons, contact icons, social marks). `lucide-react` is already a dependency
([ThemeToggle.tsx:1](../app/components/layout/ThemeToggle.tsx#L1)) and is used nowhere else.

### L12 — No proof, no trust signals

For a framework the persuasive assets are code, a UI frame, and the stack's wordmarks. The pages
assert ("45 components", "best practices") but never show. A trust/stack strip and one real code
frame would do more than any amount of copy.

---

## Why it reads the way the user describes

The complaint — "boxed layout for everything, centred box with empty space around it, hero that
isn't a hero" — is exactly L1 + L2 + L4. The root cause is that the framework's layout vocabulary has
only two ideas: *page background* and *box*. With no full-bleed section, no dark band and no surface
ladder, "make this section stand out" can only mean "wrap it in a box and tint it", which is what
every page does. Emphasis applied uniformly is no emphasis at all.

## Design direction for the recreation

1. **Full-bleed section system.** `Section` owns its background edge to edge; the container only
   constrains content. Tones: `page`, `sunken`, `raised`, `inverse` (neutral dark) and `brand-deep`
   (a dark, accessible shade of the brand). Boxes are for cards, grids, forms and modals only.
2. **New token: `--primary-deep`** (+ `--primary-deep-foreground`) for full-bleed brand-dark bands —
   light `#0A3D7D` (white text 10.63:1), dark `#0D2C50` (`#E8F1FF` text 12.36:1). This is the one
   large brand surface, and it is a *solid dark*, not an alpha tint.
3. **Hero = split, with an artifact.** Eyebrow badge, display heading, lede, one primary + one ghost
   action, trust strip; right column holds a `CodeBlock` (real quickstart snippet) in a framed card.
   Left-aligned. No blob.
4. **CTA = full-bleed band.** `CtaBand` on `brand-deep` or `inverse`, copy left and actions right on
   desktop, stacked and left-aligned on mobile.
5. **Rhythm by alternation.** Alternate tone and alignment per section; left-aligned section headers
   with an optional right-side link; at most one `sunken` band per page; spacing budgeted per section
   instead of uniform padding.
6. **Real content, no stubs.** Home: hero+code, stack strip, six features, architecture split,
   design-system showcase, CTA. About: mission split, numbered principles, stack, contribute CTA.
   Contact: working validated form (name/email/message) with an information rail; no "Phase 2".
7. **Header/Footer refresh.** 64px header, real translucency (`bg-card/80 backdrop-blur`), nav reduced
   to destinations that exist; dark inverse footer, no emoji, no `mt-20`.
8. **lucide-react everywhere**; delete the inline SVGs.
9. **`/design-system` is improved, not recreated** — it is documentation; the §7.2 rewrite (surfaces,
   patterns, states, token table) is the right scope for it.

Plan deltas are recorded in [plan/05-phase-3-public-pages.md](./plan/05-phase-3-public-pages.md).
