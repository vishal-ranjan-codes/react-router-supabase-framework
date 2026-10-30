/**
 * The one description of the design-system contract that the style guide
 * (`app/routes/design-system.tsx`) and `tests/design-tokens.test.ts` both read,
 * so the page can never teach a usage the tests disagree with.
 *
 * Values are not repeated here: colour lives in `app/globals.css`, and this file
 * names the Tier-2 tokens, what they are for, what they are not for, and the
 * contrast pairs a test must clear.
 */

export type TokenGroup =
  | "surface"
  | "content"
  | "brand"
  | "brand-accent"
  | "status"
  | "line"
  | "data"
  | "sidebar"
  | "label";

export const TOKEN_GROUP_LABELS: Record<TokenGroup, string> = {
  surface: "Surfaces",
  content: "Content (text and icons)",
  brand: "Brand and interaction",
  "brand-accent": "Brand accent (60-30-10)",
  status: "Status families",
  line: "Lines, focus and selection",
  data: "Data and loading",
  sidebar: "Sidebar",
  label: "Non-semantic labels",
};

export type TokenDoc = {
  /** Tier-2 name without the leading `--`. */
  token: string;
  group: TokenGroup;
  /** A Tier-3 utility a page actually writes. */
  utility: string;
  use: string;
  never?: string;
};

export const TEXT_MINIMUM = 4.5;
export const BOUNDARY_MINIMUM = 3;

export type ContrastKind = "text" | "boundary" | "series";

export type ContrastPair = {
  foreground: string;
  background: string;
  minimum: number;
  kind: ContrastKind;
};

export const LABEL_HUES = [
  "violet",
  "indigo",
  "teal",
  "cyan",
  "pink",
  "lime",
  "orange",
  "brown",
  "cool-gray",
  "gray",
] as const;

export type LabelHue = (typeof LABEL_HUES)[number];

function labelFamilies(hues: readonly string[]): TokenDoc[] {
  return hues.flatMap((hue) => [
    {
      token: `label-${hue}-subtle`,
      group: "label" as TokenGroup,
      utility: `bg-label-${hue}-subtle`,
      use: `Tinted background for ${hue} tag or chip`,
      never: "a status indicator (decision D14)",
    },
    {
      token: `label-${hue}-on-subtle`,
      group: "label" as TokenGroup,
      utility: `text-label-${hue}-on-subtle`,
      use: `Text and icon on --label-${hue}-subtle`,
      never: "a status indicator (decision D14)",
    },
    {
      token: `label-${hue}-border`,
      group: "label" as TokenGroup,
      utility: `border-label-${hue}-border`,
      use: `Boundary for ${hue} tag or chip`,
      never: "a status indicator (decision D14)",
    },
    {
      token: `label-${hue}-solid`,
      group: "label" as TokenGroup,
      utility: `bg-label-${hue}-solid`,
      use: `Solid ${hue} fill for high-emphasis tag or chip`,
      never: "a status indicator (decision D14)",
    },
    {
      token: `label-${hue}-foreground`,
      group: "label" as TokenGroup,
      utility: `text-label-${hue}-foreground`,
      use: `Text on solid --label-${hue}-solid`,
      never: "a status indicator (decision D14)",
    },
  ]);
}

function sequentialChartSeries(): TokenDoc[] {
  return Array.from({ length: 7 }, (_, i) => ({
    token: `chart-seq-${i + 1}`,
    group: "data" as TokenGroup,
    utility: `bg-chart-seq-${i + 1}`,
    use: `Sequential data ramp step ${i + 1} of 7 (low to high density)`,
    never: "categorical series",
  }));
}

function divergingChartSeries(): TokenDoc[] {
  return [
    {
      token: "chart-div-neg-3",
      group: "data" as TokenGroup,
      utility: "bg-chart-div-neg-3",
      use: "Diverging ramp negative 3 (strongest negative)",
    },
    {
      token: "chart-div-neg-2",
      group: "data" as TokenGroup,
      utility: "bg-chart-div-neg-2",
      use: "Diverging ramp negative 2 (medium negative)",
    },
    {
      token: "chart-div-neg-1",
      group: "data" as TokenGroup,
      utility: "bg-chart-div-neg-1",
      use: "Diverging ramp negative 1 (light negative)",
    },
    {
      token: "chart-div-mid",
      group: "data" as TokenGroup,
      utility: "bg-chart-div-mid",
      use: "Diverging ramp neutral midpoint",
    },
    {
      token: "chart-div-pos-1",
      group: "data" as TokenGroup,
      utility: "bg-chart-div-pos-1",
      use: "Diverging ramp positive 1 (light positive)",
    },
    {
      token: "chart-div-pos-2",
      group: "data" as TokenGroup,
      utility: "bg-chart-div-pos-2",
      use: "Diverging ramp positive 2 (medium positive)",
    },
    {
      token: "chart-div-pos-3",
      group: "data" as TokenGroup,
      utility: "bg-chart-div-pos-3",
      use: "Diverging ramp positive 3 (strongest positive)",
    },
  ];
}

/** 12 series (contract §4.8). */
function chartSeries(hues: string[]): TokenDoc[] {
  return hues.map((hue, index) => ({
    token: `chart-${index + 1}`,
    group: "data" as TokenGroup,
    utility: `bg-chart-${index + 1}`,
    use: `Data series ${index + 1} (${hue})`,
    never: "a status meaning — series are identity, decision D14",
  }));
}

/**
 * The five roles every status family ships (`02` §2), so a new family cannot
 * quietly arrive with three. `destructive` is the one family with a sixth role,
 * because upstream's button and alert-dialog reference a hover fill for it.
 */
function statusFamily(
  name: string,
  use: string,
  hoverRole?: string,
): TokenDoc[] {
  return [
    {
      token: name,
      group: "status",
      utility: `bg-${name}`,
      use: `${use} — solid fill`,
      never: "a tinted surface; the subtle role is that",
    },
    {
      token: `${name}-foreground`,
      group: "status",
      utility: `text-${name}-foreground`,
      use: `Text on solid --${name}`,
    },
    ...(hoverRole
      ? [
          {
            token: hoverRole,
            group: "status" as TokenGroup,
            utility: `hover:bg-${hoverRole}`,
            use: `Hover of a --${name} fill`,
          },
        ]
      : []),
    {
      token: `${name}-subtle`,
      group: "status",
      utility: `bg-${name}-subtle`,
      use: `Tinted ${name} surface (alert, badge)`,
      never:
        "a brand or page surface, and never a status meaning made from a label hue",
    },
    {
      token: `${name}-on-subtle`,
      group: "status",
      utility: `text-${name}-on-subtle`,
      use: `Text and icon on --${name}-subtle`,
    },
    {
      token: `${name}-border`,
      group: "status",
      utility: `border-${name}-border`,
      use: `Outline of a --${name}-subtle panel`,
      never: "a boundary that must be found; the tinted pairs are decorative",
    },
  ];
}

export const TOKENS: readonly TokenDoc[] = [
  // ---- surfaces (contract §4.1) ----
  {
    token: "background",
    group: "surface",
    utility: "bg-background",
    use: "Page canvas",
    never: "cards",
  },
  {
    token: "background-subtle",
    group: "surface",
    utility: "bg-background-subtle",
    use: "Sunken wells, icon tiles, alternate rows",
    never: "hover — that is --accent",
  },
  {
    token: "card",
    group: "surface",
    utility: "bg-card",
    use: "Raised panels, sticky header",
    never: "page canvas",
  },
  {
    token: "popover",
    group: "surface",
    utility: "bg-popover",
    use: "Menus, dialogs, tooltips, toasts",
    never: "inline sections",
  },
  {
    token: "scrim",
    group: "surface",
    utility: "bg-scrim",
    use: "Modal and dialog backdrop",
    never:
      "anything else — it is translucent, so it is measured after compositing",
  },
  {
    token: "surface-inverse",
    group: "surface",
    utility: "bg-surface-inverse",
    use: "Neutral inverse band (footer, CTA)",
    never: "small elements",
  },
  {
    token: "surface-brand",
    group: "surface",
    utility: 'bg-surface-brand / Section tone="brand-deep"',
    use: "One full-bleed brand band per page",
    never: "cards, tiles, hover",
  },
  {
    token: "surface-disabled",
    group: "surface",
    utility: "bg-surface-disabled",
    use: "Solid disabled control surface",
  },

  // ---- content (contract §4.2) ----
  {
    token: "foreground",
    group: "content",
    utility: "text-foreground",
    use: "Headings, primary text",
  },
  {
    token: "foreground-muted",
    group: "content",
    utility: "text-foreground-muted",
    use: "Body copy, secondary text",
  },
  {
    token: "foreground-subtle",
    group: "content",
    utility: "text-foreground-subtle",
    use: "Captions and metadata on a card or popover",
    never:
      "the page canvas or a sunken well — 4.31:1 and 4.01:1 on those in light mode, so use --foreground-muted there",
  },
  {
    token: "foreground-disabled",
    group: "content",
    utility: "text-foreground-disabled",
    use: "Labels of disabled controls",
    never:
      "any text that must be readable — WCAG 1.4.3 exempts inactive controls, which is why this step is not in the manifest",
  },
  {
    token: "foreground-inverse",
    group: "content",
    utility: "text-foreground-inverse",
    use: "Text on --surface-inverse",
  },
  {
    token: "foreground-on-inverse-muted",
    group: "content",
    utility: "text-foreground-on-inverse-muted",
    use: "Secondary text on --surface-inverse",
  },
  {
    token: "foreground-on-brand",
    group: "content",
    utility: "text-foreground-on-brand",
    use: "Text and icons on a solid brand fill or the brand band",
  },
  {
    token: "foreground-on-brand-muted",
    group: "content",
    utility: "text-foreground-on-brand-muted",
    use: "Secondary text on the brand band",
  },
  {
    token: "link",
    group: "content",
    utility: "text-link",
    use: "Inline links — this is the brand-as-text role",
    never: "--primary, which is a fill",
  },
  {
    token: "link-hover",
    group: "content",
    utility: "hover:text-link-hover",
    use: "Link hover",
  },
  {
    token: "placeholder",
    group: "content",
    utility: "text-placeholder",
    use: "Input placeholder text",
  },

  // ---- brand and interaction (contract §4.3) ----
  {
    token: "primary",
    group: "brand",
    utility: "bg-primary",
    use: "Filled brand surfaces only — buttons, badges",
    never: "text, and never a surface at an alpha",
  },
  {
    token: "primary-hover",
    group: "brand",
    utility: "hover:bg-primary-hover",
    use: "Primary hover",
  },
  {
    token: "primary-active",
    group: "brand",
    utility: "active:bg-primary-active",
    use: "Primary pressed",
  },
  {
    token: "primary-subtle",
    group: "brand",
    utility: "bg-primary-subtle",
    use: "Soft brand background: badge, tonal button",
    never: "a page or section surface",
  },
  {
    token: "primary-on-subtle",
    group: "brand",
    utility: "text-primary-on-subtle",
    use: "Text or icon on --primary-subtle",
  },
  {
    token: "primary-foreground",
    group: "brand",
    utility: "text-primary-foreground",
    use: "Text on solid --primary",
  },
  {
    token: "primary-deep",
    group: "brand",
    utility: "bg-primary-deep",
    use: "Alias of --surface-brand, kept for the shadcn-era name",
  },
  {
    token: "primary-deep-foreground",
    group: "brand",
    utility: "text-primary-deep-foreground",
    use: "Text on the brand band",
  },
  {
    token: "secondary",
    group: "brand",
    utility: "bg-secondary",
    use: "Secondary button fill",
  },
  {
    token: "secondary-hover",
    group: "brand",
    utility: "hover:bg-secondary-hover",
    use: "Secondary hover",
  },
  {
    token: "secondary-foreground",
    group: "brand",
    utility: "text-secondary-foreground",
    use: "Text on secondary",
  },
  {
    token: "muted",
    group: "brand",
    utility: "bg-muted",
    use: "Sunken static surface (the shadcn name for --background-subtle)",
    never: "hover",
  },
  {
    token: "muted-foreground",
    group: "brand",
    utility: "text-muted-foreground",
    use: "= --foreground-muted, under the shadcn name",
  },
  {
    token: "accent",
    group: "brand",
    utility: "hover:bg-accent",
    use: "Hover and selected fill only — neutral, never brand",
    never:
      "an accent colour: it is a surface, and decision D11 keeps it that way",
  },
  {
    token: "accent-selected",
    group: "brand",
    utility: "bg-accent-selected",
    use: "Selected or active row fill",
  },
  {
    token: "accent-foreground",
    group: "brand",
    utility: "text-accent-foreground",
    use: "Text on --accent",
  },
  {
    token: "primary-selected",
    group: "brand",
    utility: "bg-primary-selected",
    use: "Brand-relevant selection (active nav, selected tab)",
  },
  {
    token: "secondary-on-brand",
    group: "brand",
    utility: "bg-secondary-on-brand",
    use: "Secondary button fill on brand band",
  },
  {
    token: "secondary-on-brand-hover",
    group: "brand",
    utility: "hover:bg-secondary-on-brand-hover",
    use: "Secondary hover on brand band",
  },
  {
    token: "secondary-on-brand-foreground",
    group: "brand",
    utility: "text-secondary-on-brand-foreground",
    use: "Text on secondary button on brand band",
  },

  // ---- brand accent (60-30-10 multi-color branding) ----
  {
    token: "brand-accent",
    group: "brand-accent",
    utility: "bg-brand-accent",
    use: "Chromatic accent fill (10% emphasis): high-contrast badges, tags, secondary CTAs",
    never: "large section surfaces or unconstrained background floods",
  },
  {
    token: "brand-accent-hover",
    group: "brand-accent",
    utility: "hover:bg-brand-accent-hover",
    use: "Brand accent hover state",
  },
  {
    token: "brand-accent-active",
    group: "brand-accent",
    utility: "active:bg-brand-accent-active",
    use: "Brand accent active / pressed state",
  },
  {
    token: "brand-accent-foreground",
    group: "brand-accent",
    utility: "text-brand-accent-foreground",
    use: "Text / icon ink on solid --brand-accent (onAccent in 60-30-10 systems)",
  },
  {
    token: "brand-accent-subtle",
    group: "brand-accent",
    utility: "bg-brand-accent-subtle",
    use: "Soft tint of brand accent: pill background, callout box, badge fill",
  },
  {
    token: "brand-accent-on-subtle",
    group: "brand-accent",
    utility: "text-brand-accent-on-subtle",
    use: "Readable text / ink on --brand-accent-subtle",
  },
  {
    token: "brand-accent-border",
    group: "brand-accent",
    utility: "border-brand-accent-border",
    use: "Boundary stroke for brand accent elements",
  },

  // ---- status families (contract §4.4) ----
  ...statusFamily("success", "Positive outcome: saved, verified, live"),
  ...statusFamily("warning", "Needs attention, is not broken"),
  ...statusFamily("destructive", "Irreversible or failed", "destructive-hover"),
  ...statusFamily("info", "Neutral notice"),

  // ---- lines, focus, selection (contract §4.5) ----
  {
    token: "border",
    group: "line",
    utility: "border-border",
    use: "Card and section outlines",
    never: "a boundary a user has to find — that is --border-strong",
  },
  {
    token: "border-subtle",
    group: "line",
    utility: "border-border-subtle",
    use: "Dividers inside cards",
  },
  {
    token: "border-strong",
    group: "line",
    utility: "border-border-strong",
    use: "Borders that identify a non-input control",
  },
  {
    token: "border-disabled",
    group: "line",
    utility: "border-border-disabled",
    use: "Solid disabled control border",
  },
  {
    token: "border-on-brand",
    group: "line",
    utility: "border-border-on-brand",
    use: "Outlines for ghost/outline controls on brand band",
  },
  {
    token: "input",
    group: "line",
    utility: "border-input",
    use: "Resting border of an input, textarea or select",
  },
  {
    token: "input-hover",
    group: "line",
    utility: "hover:border-input-hover",
    use: "Input hover",
  },
  {
    token: "ring",
    group: "line",
    utility: "focus-visible:ring-ring",
    use: "Focus ring",
    never: "a decorative outline",
  },
  {
    token: "ring-offset",
    group: "line",
    utility: "focus-visible:ring-offset-ring-offset",
    use: "Gap colour of the focus ring",
  },
  {
    token: "selection",
    group: "line",
    utility: "bg-selection",
    use: "::selection background",
  },
  {
    token: "selection-foreground",
    group: "line",
    utility: "text-selection-foreground",
    use: "::selection text",
  },

  // ---- data and loading (contract §4.5, §4.8) ----
  ...chartSeries([
    "brand",
    "teal",
    "orange",
    "violet",
    "pink",
    "cyan",
    "lime",
    "indigo",
    "brown",
    "cool-gray",
    "indigo-alt",
    "gray",
  ]),
  ...sequentialChartSeries(),
  ...divergingChartSeries(),
  {
    token: "chart-grid",
    group: "data",
    utility: "stroke-chart-grid",
    use: "Chart gridlines",
  },
  {
    token: "chart-label",
    group: "data",
    utility: "text-chart-label",
    use: "Axis and tick labels",
    never: "the page canvas — charts are drawn on a card",
  },
  {
    token: "skeleton",
    group: "data",
    utility: "bg-skeleton",
    use: "Loading placeholder",
  },

  // ---- non-semantic labels (contract §4.8) ----
  ...labelFamilies(LABEL_HUES),

  // ---- sidebar (contract §4.5) ----
  {
    token: "sidebar",
    group: "sidebar",
    utility: "bg-sidebar",
    use: "Sidebar canvas",
  },
  {
    token: "sidebar-foreground",
    group: "sidebar",
    utility: "text-sidebar-foreground",
    use: "Sidebar text",
  },
  {
    token: "sidebar-primary",
    group: "sidebar",
    utility: "bg-sidebar-primary",
    use: "Active item fill in the sidebar",
  },
  {
    token: "sidebar-primary-foreground",
    group: "sidebar",
    utility: "text-sidebar-primary-foreground",
    use: "Text on the active sidebar item",
  },
  {
    token: "sidebar-accent",
    group: "sidebar",
    utility: "bg-sidebar-accent",
    use: "Sidebar hover and selected fill",
  },
  {
    token: "sidebar-accent-foreground",
    group: "sidebar",
    utility: "text-sidebar-accent-foreground",
    use: "Text on a hovered sidebar item",
  },
  {
    token: "sidebar-border",
    group: "sidebar",
    utility: "border-sidebar-border",
    use: "Sidebar outline",
  },
  {
    token: "sidebar-ring",
    group: "sidebar",
    utility: "focus-visible:ring-sidebar-ring",
    use: "Focus ring inside the sidebar",
  },
];

/**
 * The pair manifest `tests/design-tokens.test.ts` asserts and the style guide
 * prints. Every row is measured in both themes; a row that does not clear its
 * floor fails the suite with the pair name and the actual ratio.
 */
export const CONTRAST_PAIRS: readonly ContrastPair[] = [
  // surfaces carry their default ink
  ...textOnSurface(["background", "background-subtle", "card", "popover"]),
  pair("foreground-inverse", "surface-inverse", "text"),
  pair("foreground-on-inverse-muted", "surface-inverse", "text"),
  pair("primary-deep-foreground", "surface-brand", "text"),
  pair("primary-deep-foreground", "primary-deep", "text"),
  pair("foreground-on-brand", "surface-brand", "text"),
  pair("foreground-on-brand", "primary", "text"),
  pair("foreground-on-brand-muted", "surface-brand", "text"),

  // context tokens sitting on brand band
  pair("secondary-on-brand-foreground", "secondary-on-brand", "text"),
  pair("secondary-on-brand", "surface-brand", "boundary"),

  // content levels, on every surface they are documented to sit on
  ...inksOn("foreground-muted", ["background", "card", "background-subtle"]),
  ...inksOn("foreground-subtle", ["card", "popover"]),
  ...inksOn("link", ["background", "card"]),
  ...inksOn("link-hover", ["background", "card"]),
  pair("placeholder", "card", "text"),

  // brand and interaction states
  ...inksOn("primary-foreground", [
    "primary",
    "primary-hover",
    "primary-active",
  ]),
  pair("primary-on-subtle", "primary-subtle", "text"),
  ...inksOn("secondary-foreground", ["secondary", "secondary-hover"]),
  pair("muted-foreground", "muted", "text"),
  pair("muted-foreground", "background-subtle", "text"),
  pair("accent-foreground", "accent", "text"),

  // brand accent (multi-brand 60-30-10 identity)
  pair("brand-accent-foreground", "brand-accent", "text"),
  pair("brand-accent-on-subtle", "brand-accent-subtle", "text"),

  // status families: solid + subtle
  pair("success-foreground", "success", "text"),
  pair("success-on-subtle", "success-subtle", "text"),
  pair("warning-foreground", "warning", "text"),
  pair("warning-on-subtle", "warning-subtle", "text"),
  pair("destructive-foreground", "destructive", "text"),
  pair("destructive-foreground", "destructive-hover", "text"),
  pair("destructive-on-subtle", "destructive-subtle", "text"),
  pair("info-foreground", "info", "text"),
  pair("info-on-subtle", "info-subtle", "text"),

  // lines, focus and selection
  ...boundariesOnCard(["input", "input-hover", "border-strong", "ring"]),
  pair("input", "background", "boundary"),
  pair("input", "background-subtle", "boundary"),
  pair("border-strong", "background", "boundary"),
  pair("ring", "background", "boundary"),
  pair("ring", "ring-offset", "boundary"),
  pair("ring-offset", "primary", "boundary"),
  pair("selection-foreground", "selection", "text"),

  // data: 12 series on card and background (contract §4.8)
  ...inksOn("chart-label", ["card"]),
  ...Array.from({ length: 12 }, (_, i) => i + 1).flatMap((n) => [
    pair(`chart-${n}`, "card", "series"),
    pair(`chart-${n}`, "background", "series"),
  ]),

  // non-semantic labels: 4 roles per hue (contract §4.8)
  ...LABEL_HUES.flatMap((hue) => [
    pair(`label-${hue}-on-subtle`, `label-${hue}-subtle`, "text"),
    pair(`label-${hue}-foreground`, `label-${hue}-solid`, "text"),
    pair(`label-${hue}-solid`, "card", "series"),
    pair(`label-${hue}-on-subtle`, "card", "text"),
  ]),

  // sidebar
  pair("sidebar-foreground", "sidebar", "text"),
  pair("sidebar-primary-foreground", "sidebar-primary", "text"),
  pair("sidebar-accent-foreground", "sidebar-accent", "text"),
];

function pair(
  foreground: string,
  background: string,
  kind: ContrastKind,
): ContrastPair {
  return {
    foreground,
    background,
    kind,
    minimum: kind === "text" ? TEXT_MINIMUM : BOUNDARY_MINIMUM,
  };
}

function textOnSurface(surfaces: string[]): ContrastPair[] {
  return surfaces.map((surface) => pair("foreground", surface, "text"));
}

function inksOn(ink: string, surfaces: string[]): ContrastPair[] {
  return surfaces.map((surface) => pair(ink, surface, "text"));
}

function boundariesOnCard(tokens: string[]): ContrastPair[] {
  return tokens.map((token) => pair(token, "card", "boundary"));
}

/** Every pair a token appears in — the style guide's contrast column. */
export function pairsFor(token: string): ContrastPair[] {
  return CONTRAST_PAIRS.filter(
    (p) => p.foreground === token || p.background === token,
  );
}

export type Rgb = { r: number; g: number; b: number; a: number };

/**
 * Accepts what a stylesheet (`#fff`, `#00000080`) and what `getComputedStyle`
 * (`rgb(17 96 201)`, `rgba(0, 0, 0, 0.5)`) both produce, so the browser-measured
 * value and the parsed-CSS value go through the same door.
 */
export function parseColor(value: string): Rgb | null {
  const text = value.trim();
  if (text.startsWith("#")) {
    const hex = text.slice(1);
    if (!/^[\da-f]{3,8}$/i.test(hex)) return null;
    const digits = hex.length <= 4 ? [...hex].map((d) => d + d).join("") : hex;
    const channel = (offset: number) =>
      Number.parseInt(digits.slice(offset, offset + 2), 16);
    return {
      r: channel(0),
      g: channel(2),
      b: channel(4),
      a: digits.length === 8 ? channel(6) / 255 : 1,
    };
  }
  const functional = /^rgba?\(([^)]+)\)$/.exec(text);
  if (!functional) return null;
  const parts = functional[1].split(/[\s,/]+/).filter(Boolean);
  if (parts.length < 3) return null;
  const [r, g, b] = parts.map((part) => Number.parseFloat(part));
  const alpha = parts.length > 3 ? Number.parseFloat(parts[3]) : 1;
  if ([r, g, b, alpha].some((part) => Number.isNaN(part))) return null;
  return { r, g, b, a: alpha };
}

/** Composites a foreground RGBA colour over a solid background RGB colour. */
export function composite(foreground: Rgb, background: Rgb): Rgb {
  const a = foreground.a;
  return {
    r: Math.round(foreground.r * a + background.r * (1 - a)),
    g: Math.round(foreground.g * a + background.g * (1 - a)),
    b: Math.round(foreground.b * a + background.b * (1 - a)),
    a: 1,
  };
}

/** WCAG 2.2 §1.4.3 relative luminance. */
export function relativeLuminance({ r, g, b }: Rgb): number {
  const linear = (channel: number) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

/** One implementation, so `/design-system` cannot print a number the suite disagrees with. */
export function contrastRatio(foreground: Rgb, background: Rgb): number {
  const [brighter, dimmer] = [
    relativeLuminance(foreground),
    relativeLuminance(background),
  ].sort((a, b) => b - a);
  return (brighter + 0.05) / (dimmer + 0.05);
}

export function formatRatio(value: number): string {
  return `${value.toFixed(2)}:1`;
}

/** The surface ladder, `02` §4.1. Light/dark name the Tier-1 step, never a hex. */
export const SURFACE_LADDER: readonly {
  token: string;
  light: string;
  dark: string;
  use: string;
  never: string;
}[] = [
  {
    token: "card",
    light: "n-0",
    dark: "n-900",
    use: "Raised panels, sticky header",
    never: "page canvas",
  },
  {
    token: "background",
    light: "n-50",
    dark: "n-950",
    use: "Page canvas",
    never: "cards",
  },
  {
    token: "background-subtle",
    light: "n-100",
    dark: "n-850",
    use: "Sunken wells, icon tiles, alt rows",
    never: "hover",
  },
  {
    token: "popover",
    light: "n-0",
    dark: "n-850",
    use: "Menus, dialogs, tooltips, toasts",
    never: "inline sections",
  },
  {
    token: "surface-inverse",
    light: "n-850",
    dark: "n-50",
    use: "Neutral inverse band (footer, CTA)",
    never: "small elements",
  },
  {
    token: "surface-brand",
    light: "brand-800",
    dark: "brand-900",
    use: "One full-bleed brand band per page",
    never: "cards, tiles, hover",
  },
  {
    token: "scrim",
    light: "black at 50%",
    dark: "black at 64%",
    use: "Modal and dialog backdrop",
    never: "anything else",
  },
];

/**
 * "Which token do I want?" — written as questions on purpose: phase 6 adds
 * context tokens (`--secondary-on-brand`, `--surface-disabled`), and a new row
 * has to slot in without restructuring the prose.
 */
export const SURFACE_QUESTIONS: readonly {
  question: string;
  answer: string;
}[] = [
  {
    question: "Is this the page itself?",
    answer: 'bg-background, or Section tone="page".',
  },
  {
    question: "Does it sit raised above the page?",
    answer: "bg-card border border-border shadow-card.",
  },
  {
    question: "Does it sit sunken into the page?",
    answer: 'bg-background-subtle — static; Section tone="sunken" for a band.',
  },
  {
    question: "Is it a response to the pointer or the keyboard?",
    answer:
      "bg-accent (hover) or bg-accent-selected (selected row) + text-accent-foreground. Neutral, never brand.",
  },
  {
    question: "Does it float over the page until it is dismissed?",
    answer: "bg-popover for the panel, bg-scrim for the backdrop.",
  },
  {
    question: "Is it the one full-bleed emphasis band?",
    answer:
      'Section tone="brand-deep" — once per page. Nested controls inherit --secondary-on-brand and --border-on-brand automatically.',
  },
  {
    question: "Do you want a tinted brand surface?",
    answer:
      "bg-primary-subtle + text-primary-on-subtle for a badge or tonal button. Never bg-primary/<alpha>, which is the pattern this system removed.",
  },
  {
    question: "Is it a status?",
    answer:
      "One family, five roles: <status>-subtle + -on-subtle + -border, or the solid pair. Never a label or chart hue (decision D14).",
  },
  {
    question: "Does something sit on a brand or inverse band?",
    answer:
      "On brand-deep: text-foreground-on-brand-muted and --secondary-on-brand controls. On inverse: text-foreground-on-inverse-muted.",
  },
  {
    question: "Is a solid control disabled?",
    answer:
      "bg-surface-disabled + border-border-disabled for inactive controls that must maintain boundary separation.",
  },
];

export const TYPE_SCALE: readonly {
  utility: string;
  use: string;
  size: string;
  lineHeight: string;
}[] = [
  {
    utility: "text-display",
    use: "Hero heading only",
    size: "3.75rem",
    lineHeight: "1.08",
  },
  {
    utility: "text-h1",
    use: "Page title",
    size: "2.25rem",
    lineHeight: "2.75rem",
  },
  {
    utility: "text-h2",
    use: "Section title",
    size: "1.75rem",
    lineHeight: "2.25rem",
  },
  {
    utility: "text-h3",
    use: "Subsection",
    size: "1.375rem",
    lineHeight: "1.75rem",
  },
  {
    utility: "text-h4",
    use: "Card title",
    size: "1.125rem",
    lineHeight: "1.5rem",
  },
  {
    utility: "text-h5",
    use: "Small heading",
    size: "1rem",
    lineHeight: "1.5rem",
  },
  {
    utility: "text-h6",
    use: "Overline",
    size: "0.875rem",
    lineHeight: "1.25rem",
  },
  {
    utility: "text-body-lg",
    use: "Lede, intro copy",
    size: "1.125rem",
    lineHeight: "1.7rem",
  },
  {
    utility: "text-body",
    use: "Default prose",
    size: "1rem",
    lineHeight: "1.6rem",
  },
  {
    utility: "text-body-sm",
    use: "Dense UI text",
    size: "0.875rem",
    lineHeight: "1.45rem",
  },
  {
    utility: "text-body-xs",
    use: "Fine print",
    size: "0.8125rem",
    lineHeight: "1.35rem",
  },
  {
    utility: "text-eyebrow",
    use: "Uppercase kicker, with .08em tracking",
    size: "0.75rem",
    lineHeight: "1rem",
  },
];

/** Contract §6. Non-colour tokens are part of the vocabulary, not an afterthought. */
export const NON_COLOR_TOKENS: readonly {
  group: string;
  rows: readonly { token: string; value: string; use: string }[];
}[] = [
  {
    group: "Radius",
    rows: [
      { token: "--radius-xs", value: ".25rem", use: "Chips, inner fills" },
      { token: "--radius-sm", value: ".375rem", use: "Small controls" },
      { token: "--radius-md", value: ".5rem", use: "Buttons, inputs" },
      { token: "--radius-lg", value: ".625rem", use: "The base radius: cards" },
      { token: "--radius-xl", value: ".75rem", use: "Large panels" },
      { token: "--radius-2xl", value: "1rem", use: "Modals, heroes" },
    ],
  },
  {
    group: "Section rhythm",
    rows: [
      {
        token: "--spacing-section-sm",
        value: "3rem",
        use: "PageHeader, tight bands",
      },
      {
        token: "--spacing-section-md",
        value: "4.5rem",
        use: "Default Section",
      },
      { token: "--spacing-section-lg", value: "6rem", use: "Hero" },
    ],
  },
  {
    group: "Elevation",
    rows: [
      {
        token: "--shadow-card",
        value: "two 1px layers",
        use: "Card, raised section",
      },
      { token: "--shadow-pop", value: "4px + 12px", use: "Popover, dialog" },
    ],
  },
  {
    group: "Motion",
    rows: [
      {
        token: "--transition-duration-fast",
        value: "120ms",
        use: "Colour and border change",
      },
      {
        token: "--transition-duration-base",
        value: "200ms",
        use: "Default",
      },
      {
        token: "--transition-duration-slow",
        value: "360ms",
        use: "Sheet and drawer open",
      },
      {
        token: "--ease-standard",
        value: "cubic-bezier(.2,0,0,1)",
        use: "Most transitions",
      },
      {
        token: "--ease-emphasized",
        value: "cubic-bezier(.05,.7,.1,1)",
        use: "Entrance",
      },
      {
        token: "--ease-enter",
        value: "cubic-bezier(0,.4,.2,1)",
        use: "Overlay in",
      },
    ],
  },
  {
    group: "Stacking",
    rows: [
      { token: "--z-index-sticky", value: "40", use: "Sticky header" },
      { token: "--z-index-dropdown", value: "50", use: "Dropdown, select" },
      { token: "--z-index-overlay", value: "60", use: "Scrim" },
      { token: "--z-index-modal", value: "70", use: "Dialog, sheet" },
      { token: "--z-index-popover", value: "80", use: "Popover, tooltip" },
      { token: "--z-index-toast", value: "90", use: "Sonner" },
    ],
  },
  {
    group: "Sizing",
    rows: [
      {
        token: "--size-control-sm",
        value: "2rem",
        use: "Compact control height",
      },
      {
        token: "--size-control-md",
        value: "2.5rem",
        use: "Default control height",
      },
      {
        token: "--size-control-lg",
        value: "2.75rem",
        use: "Primary mobile action",
      },
      { token: "--size-icon-sm", value: "1rem", use: "Inline glyph" },
      { token: "--size-icon-md", value: "1.25rem", use: "Button glyph" },
      { token: "--size-icon-lg", value: "1.5rem", use: "Tile glyph" },
      {
        token: "--size-touch-min",
        value: "2.75rem",
        use: "WCAG 2.2 target floor",
      },
    ],
  },
];

/** The nine recipes, and the sentence that says when to reach for each. */
export const PATTERNS: readonly {
  name: string;
  file: string;
  props: readonly string[];
  useWhen: string;
}[] = [
  {
    name: "Section",
    file: "Section.tsx",
    props: [
      'tone?: "page" | "raised" | "sunken" | "inverse" | "brand-deep"',
      'theme?: "dark" | "light"',
      'size?: "sm" | "md" | "lg"',
      "as?",
      "id?",
      "className?",
    ],
    useWhen:
      "Every band of a page. It paints edge to edge; the container inside is what is constrained.",
  },
  {
    name: "SectionHeading",
    file: "SectionHeading.tsx",
    props: [
      "eyebrow?",
      "title",
      "description?",
      'align?: "left" | "center"',
      "aside? (slot)",
      "className?",
    ],
    useWhen:
      "The start of a Section. Left-aligned by default; centre only when it is the whole band.",
  },
  {
    name: "Hero",
    file: "Hero.tsx",
    props: [
      "eyebrow?",
      "title",
      "lede?",
      "primary?",
      "secondary?",
      "artifact? (slot)",
      "trust? (slot)",
      'tone?: "page" | "brand-deep"',
      'theme?: "dark" | "light"',
      "className?",
    ],
    useWhen:
      "The first screen of a marketing page. Two columns on lg, and no decorative layer.",
  },
  {
    name: "PageHeader",
    file: "PageHeader.tsx",
    props: [
      "eyebrow?",
      "title",
      "description?",
      "aside? (slot)",
      "tone?: SectionTone",
      "className?",
    ],
    useWhen:
      "The title block of an app or info page — replaces the centred heading in a box.",
  },
  {
    name: "CtaBand",
    file: "CtaBand.tsx",
    props: [
      "title",
      "description?",
      "actions",
      'tone?: "brand-deep" | "inverse"',
      'theme?: "dark" | "light"',
      "className?",
    ],
    useWhen:
      "The closing ask. Full-bleed, copy left, actions right — never a box in whitespace.",
  },
  {
    name: "FeatureCard",
    file: "FeatureCard.tsx",
    props: ["icon?", "title", "description", "href?", "className?"],
    useWhen: "A grid item that explains one capability.",
  },
  {
    name: "IconTile",
    file: "IconTile.tsx",
    props: [
      'size?: "sm" | "md" | "lg"',
      'tone?: "muted" | "brand"',
      "className?",
    ],
    useWhen: 'An icon that anchors a card. tone="brand" at most once per page.',
  },
  {
    name: "CodeBlock",
    file: "CodeBlock.tsx",
    props: ["code", "filename?", "className?"],
    useWhen: "A command, a config shape, or a hero artifact.",
  },
  {
    name: "LogoStrip",
    file: "LogoStrip.tsx",
    props: ["items: { label }[]", "className?"],
    useWhen: "Trust or stack row under a hero. Wordmarks, not images.",
  },
];

/** Every state a control can be in, painted without having to hover it. */
export const STATES: readonly {
  name: string;
  classes: string;
  note: string;
}[] = [
  {
    name: "Default",
    classes: "bg-primary text-primary-foreground",
    note: "bg-primary + text-primary-foreground",
  },
  {
    name: "Hover",
    classes: "bg-primary-hover text-primary-foreground",
    note: "one step down the ramp, never an alpha",
  },
  {
    name: "Focus-visible",
    classes:
      "bg-primary text-primary-foreground border-ring outline-none ring-[3px] ring-ring/50 ring-offset-2 ring-offset-ring-offset",
    note: "two-tone focus chain: ring-offset-2 separates ring from solid fill",
  },
  {
    name: "Active",
    classes: "bg-primary-active text-primary-foreground",
    note: "brand-800 under the finger",
  },
  {
    name: "Selected",
    classes: "bg-accent-selected text-accent-foreground",
    note: "active or selected row fill, distinct from hover",
  },
  {
    name: "Disabled",
    classes:
      "bg-surface-disabled border border-border-disabled text-foreground-disabled",
    note: "solid disabled fill and border clearing >= 3:1 boundary",
  },
  {
    name: "Loading",
    classes: "bg-accent text-accent-foreground animate-pulse",
    note: "the skeleton step, not a spinner per control",
  },
  {
    name: "Error",
    classes: "bg-destructive text-destructive-foreground",
    note: "aria-invalid paints border-destructive too",
  },
  {
    name: "Empty",
    classes: "bg-background-subtle text-foreground-muted",
    note: "the sunken step, so an empty well still reads as a well",
  },
];
