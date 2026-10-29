#!/usr/bin/env node
/**
 * Ramp generator — solves `oklch(L, C, H)` -> sRGB at matched perceived lightness
 * anchored to brand blue (decision D2 / D13, `.docs/plan/09-phase-7-palettes.md` §1).
 *
 * CSS Color 4 standard binary-search chroma reduction maps out-of-gamut colours into sRGB
 * while preserving lightness L and hue angle H.
 */
export const TARGET_LIGHTNESS = {
  50: 0.97,
  100: 0.929,
  150: 0.895,
  200: 0.862,
  300: 0.77,
  400: 0.695,
  450: 0.642,
  500: 0.588,
  600: 0.509,
  700: 0.451,
  750: 0.41,
  800: 0.369,
  850: 0.33,
  900: 0.292,
  950: 0.177,
};

/**
 * Decoupled neutral scale calibrated for refined digital UI surfaces
 * (crisp #ffffff cards on luminous #fafafa canvas; sleek #141414 cards on #090909 canvas).
 */
export const NEUTRAL_TARGET_LIGHTNESS = {
  0: 1.0,
  50: 0.985, // #fafafa
  100: 0.965, // #f3f3f3
  150: 0.935, // #e9e9e9
  200: 0.9, // #dedede
  300: 0.82, // #c4c4c4
  400: 0.7, // #9e9e9e
  450: 0.64, // #8c8c8c
  500: 0.56, // #747474
  600: 0.48, // #5d5d5d
  700: 0.4, // #484848
  750: 0.34, // #383838
  800: 0.28, // #292929
  850: 0.23, // #1d1d1d
  900: 0.19, // #141414
  950: 0.14, // #090909
};

export const CORE_RAMP_CONFIGS = {
  neutral: {
    H: 0,
    C: 0,
    steps: [
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
    ],
  },
  brand: {
    H: 258.3,
    C: 0.18,
    steps: [
      "50",
      "100",
      "200",
      "300",
      "400",
      "500",
      "600",
      "700",
      "800",
      "900",
      "950",
    ],
  },
  success: {
    H: 163.0,
    C: 0.15,
    steps: [
      "50",
      "100",
      "200",
      "300",
      "400",
      "500",
      "600",
      "700",
      "800",
      "900",
      "950",
    ],
  },
  warning: {
    H: 65.0,
    C: 0.16,
    steps: [
      "50",
      "100",
      "200",
      "300",
      "400",
      "500",
      "600",
      "700",
      "800",
      "900",
      "950",
    ],
  },
  danger: {
    H: 27.0,
    C: 0.18,
    steps: [
      "50",
      "100",
      "200",
      "300",
      "400",
      "500",
      "600",
      "700",
      "800",
      "900",
      "950",
    ],
  },
  info: {
    H: 240.0,
    C: 0.15,
    steps: [
      "50",
      "100",
      "200",
      "300",
      "400",
      "500",
      "600",
      "700",
      "800",
      "900",
      "950",
    ],
  },
};

export const LABEL_HUE_CONFIGS = {
  violet: { H: 305.0, C: 0.22 },
  indigo: { H: 275.0, C: 0.18 },
  teal: { H: 185.0, C: 0.15 },
  cyan: { H: 215.0, C: 0.15 },
  pink: { H: 350.0, C: 0.2 },
  lime: { H: 130.0, C: 0.16 },
  orange: { H: 50.0, C: 0.18 },
  brown: { H: 55.0, C: 0.08 },
  "cool-gray": { H: 250.0, C: 0.03 },
  gray: { H: 90.0, C: 0.0 },
};

export const LABEL_STEPS = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "950",
];

export function srgbToLinear(c) {
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function linearToSrgb(c) {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
}

export function rgbToOklab(r, g, b) {
  const lr = srgbToLinear(r / 255);
  const lg = srgbToLinear(g / 255);
  const lb = srgbToLinear(b / 255);
  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const b_ = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
  return { L, a, b: b_ };
}

export function oklabToRgb(L, a, b) {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;
  const r_lin = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g_lin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const b_lin = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  return [linearToSrgb(r_lin), linearToSrgb(g_lin), linearToSrgb(b_lin)];
}

export function isInGamut(r, g, b) {
  return (
    r >= -0.0001 &&
    r <= 1.0001 &&
    g >= -0.0001 &&
    g <= 1.0001 &&
    b >= -0.0001 &&
    b <= 1.0001
  );
}

export function oklchToRgb(L, C, H) {
  const rad = (H * Math.PI) / 180;
  let low = 0;
  let high = C;
  for (let i = 0; i < 25; i++) {
    const mid = (low + high) / 2;
    const testA = mid * Math.cos(rad);
    const testB = mid * Math.sin(rad);
    const [tr, tg, tb] = oklabToRgb(L, testA, testB);
    if (isInGamut(tr, tg, tb)) low = mid;
    else high = mid;
  }
  return oklabToRgb(L, low * Math.cos(rad), low * Math.sin(rad));
}

export function toHex(rgb) {
  return (
    "#" +
    rgb
      .map((x) =>
        Math.max(0, Math.min(255, Math.round(x * 255)))
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}

export function hexToRgb(hex) {
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export const BRAND_ANCHOR = {
  50: "#eef6ff",
  100: "#d9e9ff",
  200: "#b6d4ff",
  300: "#7cb8ff",
  400: "#4a9fff",
  500: "#2f7ae0",
  600: "#1160c9", // D2 frozen
  700: "#0e51aa",
  800: "#0a3d7d",
  900: "#0d2c50",
  950: "#04121f",
};

export function generateCoreRamps() {
  const result = {};
  for (const [name, cfg] of Object.entries(CORE_RAMP_CONFIGS)) {
    result[name] = {};
    if (name === "brand") {
      result[name] = { ...BRAND_ANCHOR };
      continue;
    }
    if (name === "neutral") {
      result[name]["0"] = "#ffffff";
      for (const step of cfg.steps) {
        const targetL = NEUTRAL_TARGET_LIGHTNESS[step];
        const rgb = oklchToRgb(targetL, cfg.C, cfg.H);
        result[name][step] = toHex(rgb);
      }
      continue;
    }
    for (const step of cfg.steps) {
      const targetL = TARGET_LIGHTNESS[step];
      const rgb = oklchToRgb(targetL, cfg.C, cfg.H);
      result[name][step] = toHex(rgb);
    }
  }
  return result;
}

export function generateLabelRamps() {
  const result = {};
  for (const [name, cfg] of Object.entries(LABEL_HUE_CONFIGS)) {
    result[name] = {};
    for (const step of LABEL_STEPS) {
      const targetL = TARGET_LIGHTNESS[step];
      const rgb = oklchToRgb(targetL, cfg.C, cfg.H);
      result[name][step] = toHex(rgb);
    }
  }
  return result;
}

if (process.argv[1]?.endsWith("generate-ramps.mjs")) {
  const core = generateCoreRamps();
  const labels = generateLabelRamps();
  console.log(
    "Generated 6 core ramps + 10 label hue ramps.",
    Object.keys(labels).length,
  );
  console.log(
    "Brand 600 D2 check:",
    core.brand["600"] === "#1160c9" ? "OK" : "MISMATCH",
  );
}
