import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  hexToRgb,
  NEUTRAL_TARGET_LIGHTNESS,
  rgbToOklab,
  TARGET_LIGHTNESS,
} from "../scripts/generate-ramps.mjs";

const stylesheet = readFileSync(
  join(import.meta.dirname, "../app/globals.css"),
  "utf8",
);
const source = stylesheet.replace(/\/\*[\s\S]*?\*\//g, "");

function readBlock(selector: string) {
  const escaped = selector.replace(/[$()*+.?[\\\]^{-}]/g, "\\$&");
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
const rootTokens = readDeclarations(root.body);
const darkTokens = readDeclarations(dark.body);

const CORE_RAMPS = [
  "neutral",
  "brand",
  "success",
  "warning",
  "danger",
  "info",
] as const;

function resolveHex(token: string, theme: "light" | "dark" = "light"): string {
  const val =
    (theme === "dark" ? darkTokens.get(token) : undefined) ??
    rootTokens.get(token);
  if (!val) throw new Error(`Token ${token} not declared for ${theme}`);
  const matchVar = /^var\((--[\w-]+)\)$/.exec(val);
  if (matchVar) return resolveHex(matchVar[1], "light");
  if (/^#[\da-fA-F]{6}$/.test(val)) return val;
  throw new Error(`Token ${token} does not resolve to a hex: ${val}`);
}

describe("ramp uniformity (phase 7 §1)", () => {
  it("D2 guard: --p-brand-600 is byte-identical to #1160c9", () => {
    expect(rootTokens.get("--p-brand-600")).toBe("#1160c9");
  });

  for (const ramp of CORE_RAMPS) {
    describe(`${ramp} ramp perceived lightness`, () => {
      const targets =
        ramp === "neutral" ? NEUTRAL_TARGET_LIGHTNESS : TARGET_LIGHTNESS;
      const stepEntries = (
        Object.entries(targets) as [string, number][]
      ).filter(([step]) => {
        if (
          ramp === "brand" &&
          (step === "150" || step === "450" || step === "750" || step === "850")
        )
          return false;
        if (
          ramp !== "neutral" &&
          (step === "150" || step === "450" || step === "750" || step === "850")
        )
          return false;
        return true;
      });

      for (const [step, targetL] of stepEntries) {
        it(`--p-${ramp}-${step} is within 0.02 L of target ${targetL}`, () => {
          const hex = rootTokens.get(`--p-${ramp}-${step}`);
          expect(hex, `--p-${ramp}-${step} exists in :root`).toBeDefined();
          if (!hex) return;
          const rgb = hexToRgb(hex);
          const measuredL = rgbToOklab(rgb[0], rgb[1], rgb[2]).L;
          const diff = Math.abs(measuredL - targetL);
          expect(
            diff,
            `--p-${ramp}-${step} (${hex}) measured L=${measuredL.toFixed(3)}, target=${targetL}, diff=${diff.toFixed(3)} > 0.02`,
          ).toBeLessThanOrEqual(0.02);
        });
      }
    });
  }

  it("neutral ramp adjacent steps: ΔL >= 0.02 (anti-collapse assertion)", () => {
    const neutralSteps = [
      "50",
      "100",
      "150",
      "200",
      "300",
      "400",
      "450",
      "500",
      "600",
      "700",
      "750",
      "800",
      "850",
      "900",
      "950",
    ];
    for (let i = 1; i < neutralSteps.length; i++) {
      const prevStep = neutralSteps[i - 1];
      const currStep = neutralSteps[i];
      const prevHex = rootTokens.get(`--p-neutral-${prevStep}`);
      const currHex = rootTokens.get(`--p-neutral-${currStep}`);
      expect(prevHex).toBeDefined();
      expect(currHex).toBeDefined();
      if (!prevHex || !currHex) return;
      const prevL = rgbToOklab(...hexToRgb(prevHex)).L;
      const currL = rgbToOklab(...hexToRgb(currHex)).L;
      const deltaL = prevL - currL;
      expect(
        deltaL,
        `neutral ${prevStep} (${prevHex}, L=${prevL.toFixed(3)}) -> ${currStep} (${currHex}, L=${currL.toFixed(3)}) ΔL=${deltaL.toFixed(3)} < 0.02`,
      ).toBeGreaterThanOrEqual(0.02);
    }
  });

  describe("series clause — 12 chart series adjacent ΔL >= 0.05", () => {
    for (const theme of ["light", "dark"] as const) {
      it(`adjacent chart series differ by ΔL >= 0.05 in ${theme} theme`, () => {
        const seriesCount = 12;
        const Ls: number[] = [];
        for (let i = 1; i <= seriesCount; i++) {
          const hex = resolveHex(`--chart-${i}`, theme);
          const L = rgbToOklab(...hexToRgb(hex)).L;
          Ls.push(L);
        }
        for (let i = 1; i < Ls.length; i++) {
          const deltaL = Math.abs(Ls[i] - Ls[i - 1]);
          expect(
            deltaL,
            `--chart-${i} (L=${Ls[i - 1].toFixed(3)}) and --chart-${i + 1} (L=${Ls[i].toFixed(3)}) ΔL=${deltaL.toFixed(3)} in ${theme} mode must be >= 0.05`,
          ).toBeGreaterThanOrEqual(0.05);
        }
      });
    }
  });
});
