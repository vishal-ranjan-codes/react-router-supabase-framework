import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// Read from disk rather than `?raw`: Vite resolves `globals.css?raw` to an empty string.
const stylesheet = readFileSync(
  join(import.meta.dirname, "../app/globals.css"),
  "utf8",
);

// Contract §7: text pairs clear 4.5:1 and UI boundaries 3:1 in both themes. The manifest
// below is the part verified in phase 1; the pairs still open are listed as todos at the end.
const TEXT_MINIMUM = 4.5;
const BOUNDARY_MINIMUM = 3;

const TEXT_PAIRS = [
  ["foreground", "background"],
  ["foreground", "card"],
  ["foreground", "popover"],
  ["foreground-muted", "background"],
  ["foreground-muted", "card"],
  ["foreground-inverse", "surface-inverse"],
  ["foreground-on-brand", "primary"],
  ["primary-foreground", "primary"],
  ["primary-deep-foreground", "primary-deep"],
  ["primary-on-subtle", "primary-subtle"],
  ["secondary-foreground", "secondary"],
  ["accent-foreground", "accent"],
  ["muted-foreground", "muted"],
  ["link", "background"],
  ["link", "card"],
  ["placeholder", "card"],
  ["selection-foreground", "selection"],
  ["sidebar-foreground", "sidebar"],
  ["sidebar-primary-foreground", "sidebar-primary"],
  ["sidebar-accent-foreground", "sidebar-accent"],
  ["success-foreground", "success"],
  ["success-on-subtle", "success-subtle"],
  ["warning-foreground", "warning"],
  ["warning-on-subtle", "warning-subtle"],
  ["destructive-foreground", "destructive"],
  ["destructive-on-subtle", "destructive-subtle"],
  ["info-foreground", "info"],
  ["info-on-subtle", "info-subtle"],
  ["chart-label", "card"],
] as const;

const BOUNDARY_PAIRS = [
  ["input", "card"],
  ["input", "background"],
  ["input-hover", "card"],
  ["ring", "card"],
  ["ring", "background"],
  ["border-strong", "card"],
  ["border-strong", "background"],
] as const;

// Charts are drawn on card surfaces, so that is the adjacent colour WCAG 1.4.11 measures against.
const CHART_SERIES = [
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
] as const;

const THEMES = ["light", "dark"] as const;

type Theme = (typeof THEMES)[number];

const source = stylesheet.replace(/\/\*[\s\S]*?\*\//g, "");

function readBlock(selector: string) {
  const escaped = selector.replace(/[$()*+.?[\\\]^{-}]/g, "\\$&");
  const block = new RegExp(`^${escaped} \\{([\\s\\S]*?)^}`, "m").exec(source);
  if (!block)
    throw new Error(`globals.css has no top-level \`${selector}\` block`);
  return { body: block[1], raw: block[0] };
}

function readDeclarations(body: string) {
  const declarations = new Map<string, string>();
  for (const [, name, value] of body.matchAll(/(--[\w-]+):\s*([^;]+);/g)) {
    declarations.set(name, value.trim());
  }
  return declarations;
}

const root = readBlock(":root");
const dark = readBlock(".dark");
const lightTokens = readDeclarations(root.body);
const darkTokens = readDeclarations(dark.body);

// Tier-1 ramps and the alpha constants are theme-invariant, so `.dark` never restates them.
const isSemantic = (token: string) =>
  !token.startsWith("--p-") && !token.startsWith("--alpha-");

type Color = { r: number; g: number; b: number; a: number };

function resolve(token: string, theme: Theme): Color {
  const value =
    (theme === "dark" ? darkTokens.get(token) : undefined) ??
    lightTokens.get(token);
  if (value === undefined)
    throw new Error(`\`${token}\` is not declared for the ${theme} theme`);

  const reference = /^var\((--[\w-]+)\)$/.exec(value);
  if (reference) return resolve(reference[1], "light");

  const hex = value.slice(1);
  const digits =
    hex.length <= 4 ? [...hex].map((digit) => digit + digit).join("") : hex;
  const channel = (offset: number) =>
    Number.parseInt(digits.slice(offset, offset + 2), 16);
  return {
    r: channel(0),
    g: channel(2),
    b: channel(4),
    a: digits.length === 8 ? channel(6) / 255 : 1,
  };
}

function luminance({ r, g, b }: Color) {
  const linear = (channel: number) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

function contrastRatio(theme: Theme, foreground: string, background: string) {
  const pair = [
    resolve(`--${foreground}`, theme),
    resolve(`--${background}`, theme),
  ];
  for (const [index, color] of pair.entries()) {
    if (color.a < 1) {
      throw new Error(
        `${index === 0 ? foreground : background} is translucent, so its ratio depends on what ` +
          "sits underneath it; composite it before adding it to the manifest",
      );
    }
  }
  const [brighter, dimmer] = pair.map(luminance).sort((a, b) => b - a);
  return (brighter + 0.05) / (dimmer + 0.05);
}

for (const theme of THEMES) {
  describe(`${theme} theme`, () => {
    for (const [foreground, background] of TEXT_PAIRS) {
      it(`${foreground} on ${background} clears ${TEXT_MINIMUM}:1`, () => {
        expect(
          contrastRatio(theme, foreground, background),
        ).toBeGreaterThanOrEqual(TEXT_MINIMUM);
      });
    }

    for (const [foreground, background] of BOUNDARY_PAIRS) {
      it(`${foreground} on ${background} clears ${BOUNDARY_MINIMUM}:1`, () => {
        expect(
          contrastRatio(theme, foreground, background),
        ).toBeGreaterThanOrEqual(BOUNDARY_MINIMUM);
      });
    }

    for (const series of CHART_SERIES) {
      it(`${series} is distinguishable against card at ${BOUNDARY_MINIMUM}:1`, () => {
        expect(contrastRatio(theme, series, "card")).toBeGreaterThanOrEqual(
          BOUNDARY_MINIMUM,
        );
      });
    }
  });
}

describe("token architecture", () => {
  it("declares every semantic token in both :root and .dark", () => {
    const light = [...lightTokens.keys()].filter(isSemantic).sort();
    expect([...darkTokens.keys()].filter(isSemantic).sort()).toEqual(light);
  });

  it("points every semantic token at a primitive or a literal colour", () => {
    for (const theme of THEMES) {
      const tokens = theme === "dark" ? darkTokens : lightTokens;
      for (const [name, value] of tokens) {
        if (!isSemantic(name)) continue;
        expect(value, `${theme} ${name}`).toMatch(
          /^(?:var\(--p-[\w-]+\)|#[\da-fA-F]{3,8})$/,
        );
      }
    }
  });

  it("keeps every hex literal inside :root or .dark", () => {
    const outside = source.replace(root.raw, "").replace(dark.raw, "");
    expect(outside.match(/#[\da-fA-F]{3,8}\b/g) ?? []).toEqual([]);
  });

  it("never maps a utility colour to itself", () => {
    // `--color-x: var(--color-x)` freezes the light value and stops `.dark` from remapping it.
    expect(source.match(/--(color-[\w-]+):\s*var\(--\1\)/g) ?? []).toEqual([]);
  });
});

describe("phase 5 — pairs the manifest does not cover yet", () => {
  it.todo(
    "foreground-subtle passes as text, or is reclassified (3.82:1 on card in dark)",
  );
  it.todo(
    "surface-brand gains an on-* token (foreground-on-brand is 1.34:1 on it in dark)",
  );
  it.todo("status border tokens clear 3:1 against the surfaces they sit on");
  it.todo(
    "chart series clear 3:1 on background too, or charts are documented as card-only",
  );
  it.todo(
    "scrim is composited over the surface beneath it before its ratio is measured",
  );
  it.todo(
    "destructive-hover keeps destructive-foreground legible in both themes",
  );
});
