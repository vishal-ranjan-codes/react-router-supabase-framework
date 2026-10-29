declare module "*check-design-system.mjs" {
  export function runChecks(): {
    failures: [number, string][];
    notes: string[];
    waiverFiles: unknown[];
  };
  export function evaluateRule15(
    rootMap: Map<string, string>,
    darkMap: Map<string, string>,
  ): string[];
  export function evaluateRule16(
    linesWithFile: { file: string; line: number; text: string }[],
  ): string[];
  export function evaluateWaiver(
    file: string,
    line: number,
    text: string,
  ): {
    file: string;
    line: number;
    reason: string;
    problem: string | null;
    legal: boolean;
  } | null;
  export const rootBlock: Map<string, string>;
  export const darkBlock: Map<string, string>;
  export const sourceFiles: string[];
  export function read(file: string): string;
  export function blockBody(anchor: string): string | null;
  export function declarations(body: string): Map<string, string>;
  export function scanWaivers(): unknown[];
}

declare module "*generate-ramps.mjs" {
  export const TARGET_LIGHTNESS: Record<string, number>;
  export const NEUTRAL_TARGET_LIGHTNESS: Record<string, number>;
  export const CORE_RAMPS_CONFIG: Record<
    string,
    { H: number; maxChroma: number }
  >;
  export const LABEL_HUES_CONFIG: Record<string, { H: number; C: number }>;
  export const LABEL_STEPS: string[];
  export function srgbToLinear(c: number): number;
  export function linearToSrgb(c: number): number;
  export function rgbToOklab(
    r: number,
    g: number,
    b: number,
  ): { L: number; a: number; b: number };
  export function oklabToRgb(
    L: number,
    a: number,
    b: number,
  ): [number, number, number];
  export function oklchToRgb(
    L: number,
    C: number,
    H_deg: number,
  ): [number, number, number];
  export function toHex(rgb: [number, number, number]): string;
  export function hexToRgb(hex: string): [number, number, number];
  export function generateCoreRamps(): Record<string, Record<string, string>>;
  export function generateLabelRamps(): Record<string, Record<string, string>>;
}
