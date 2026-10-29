import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  BOUNDARY_MINIMUM,
  CONTRAST_PAIRS,
  composite,
  contrastRatio as contrastRatioOf,
  parseColor,
  type Rgb,
  TEXT_MINIMUM,
} from "../app/lib/design-system";

// Read from disk rather than `?raw`: Vite resolves `globals.css?raw` to an empty string.
const stylesheet = readFileSync(
  join(import.meta.dirname, "../app/globals.css"),
  "utf8",
);

// The pair manifest is imported, not restated here, so the style guide and this suite can never
// drift apart: `app/lib/design-system.ts` is the one description both of them read.
const THEMES = ["light", "dark"] as const;

type Theme = (typeof THEMES)[number];

const source = stylesheet.replace(/\/\*[\s\S]*?\*\//g, "");

function readBlock(selector: string) {
  const escaped = selector.replace(/[$()*+.?[\\\]^{-}]/g, "\\$&");
  // `[^{]*?` so a selector list still matches: the light block is `:root, .light {`.
  const block = new RegExp(`^${escaped}[^{]*?\\{([\\s\\S]*?)^}`, "m").exec(
    source,
  );
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

function resolve(token: string, theme: Theme): Rgb {
  const value =
    (theme === "dark" ? darkTokens.get(token) : undefined) ??
    lightTokens.get(token);
  if (value === undefined)
    throw new Error(`\`${token}\` is not declared for the ${theme} theme`);

  const reference = /^var\((--[\w-]+)\)$/.exec(value);
  if (reference) return resolve(reference[1], "light");

  const scrimMatch =
    /^rgb\(0\s+0\s+0\s*\/\s*var\((--alpha-scrim(?:-strong)?)\)\)$/.exec(value);
  if (scrimMatch) {
    const rawAlpha = lightTokens.get(scrimMatch[1]);
    if (!rawAlpha) throw new Error(`Missing alpha for ${scrimMatch[1]}`);
    const alphaVal = Number.parseFloat(rawAlpha);
    return { r: 0, g: 0, b: 0, a: alphaVal };
  }

  const color = parseColor(value);
  if (!color) throw new Error(`\`${token}\` is not a colour: ${value}`);
  return color;
}

// The WCAG maths lives in the module the style guide renders from, so the page and this suite
// cannot report two different numbers for one pair.
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
  return contrastRatioOf(pair[0], pair[1]);
}

describe("contrast pair manifest", () => {
  it("names only tokens the stylesheet declares", () => {
    const unknown = CONTRAST_PAIRS.flatMap(({ foreground, background }) =>
      [foreground, background]
        .filter((token) => !lightTokens.has(`--${token}`))
        .map((token) => `--${token}`),
    );
    expect([...new Set(unknown)]).toEqual([]);
  });

  it("states each pair once, in one direction", () => {
    const keys = CONTRAST_PAIRS.map(
      ({ foreground, background }) => `${foreground} on ${background}`,
    );
    expect(keys.length).toBe(new Set(keys).size);
  });

  it("uses the floor its kind implies", () => {
    for (const { kind, minimum } of CONTRAST_PAIRS) {
      expect(minimum, kind).toBe(
        kind === "text" ? TEXT_MINIMUM : BOUNDARY_MINIMUM,
      );
    }
  });
});

for (const theme of THEMES) {
  describe(`${theme} theme`, () => {
    for (const { foreground, background, minimum, kind } of CONTRAST_PAIRS) {
      it(`${foreground} on ${background} clears ${minimum}:1 (${kind})`, () => {
        const ratio = contrastRatio(theme, foreground, background);
        expect(
          ratio,
          `--${foreground} on --${background} measures ${ratio.toFixed(2)}:1, ` +
            `below the ${minimum}:1 ${kind} floor`,
        ).toBeGreaterThanOrEqual(minimum);
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
        // `transparent` is allowed: a token that ships no colour has nothing to trace
        // back to a ramp, and cannot affect a contrast ratio either.
        expect(value, `${theme} ${name}`).toMatch(
          /^(?:var\(--p-[\w-]+\)|#[\da-fA-F]{3,8}|transparent|rgb\(0 0 0 \/ var\(--alpha-scrim(?:-strong)?\)\))$/,
        );
      }
    }
  });

  it("references only primitives the ramp declares", () => {
    const orphans = [...lightTokens, ...darkTokens].flatMap(([name, value]) => {
      const reference = /^var\((--p-[\w-]+)\)$/.exec(value);
      return reference && !lightTokens.has(reference[1])
        ? [`${name} -> ${reference[1]}`]
        : [];
    });
    expect(orphans).toEqual([]);
  });

  it("keeps every hex literal inside :root or .dark", () => {
    const outside = source.replace(root.raw, "").replace(dark.raw, "");
    expect(outside.match(/#[\da-fA-F]{3,8}\b/g) ?? []).toEqual([]);
  });

  it("never maps a utility colour to itself", () => {
    // `--color-x: var(--color-x)` freezes the light value and stops `.dark` from remapping it.
    expect(source.match(/--(color-[\w-]+):\s*var\(--\1\)/g) ?? []).toEqual([]);
  });

  it("phase 6 — --secondary-on-brand on --surface-brand clears >= 3:1 in both themes", () => {
    for (const theme of THEMES) {
      const ratio = contrastRatio(theme, "secondary-on-brand", "surface-brand");
      expect(ratio).toBeGreaterThanOrEqual(BOUNDARY_MINIMUM);
    }
  });

  it("phase 6 — --scrim composites over the surface beneath it to clear >= 3:1 against popover in light mode", () => {
    for (const theme of THEMES) {
      const scrimRgb = resolve("--scrim", theme);
      const bgRgb = resolve("--background", theme);
      const composited = composite(scrimRgb, bgRgb);
      const popoverRgb = resolve("--popover", theme);
      const ratio = contrastRatioOf(popoverRgb, composited);
      expect(ratio).toBeGreaterThanOrEqual(
        theme === "light" ? BOUNDARY_MINIMUM : 1.2,
      );
    }
  });

  it("phase 6 — the focus chain: --ring >= 3:1 on --ring-offset and --ring-offset >= 3:1 on --primary", () => {
    for (const theme of THEMES) {
      expect(
        contrastRatio(theme, "ring", "ring-offset"),
      ).toBeGreaterThanOrEqual(BOUNDARY_MINIMUM);
      expect(
        contrastRatio(theme, "ring-offset", "primary"),
      ).toBeGreaterThanOrEqual(BOUNDARY_MINIMUM);
    }
  });
});

// Assigned by `02` §7, not open questions: each row is a value a later phase owns, and this suite
// gains the pair in the same commit that ships the value (decision D15).
describe("phase 7 additions", () => {
  it("phase 7 — --chart-3 is >= 3:1 on --background in both themes", () => {
    for (const theme of THEMES) {
      const ratio = contrastRatio(theme, "chart-3", "background");
      expect(ratio).toBeGreaterThanOrEqual(BOUNDARY_MINIMUM);
    }
  });
});
