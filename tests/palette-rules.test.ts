import { describe, expect, it } from "vitest";
import {
  darkBlock,
  evaluateRule15,
  evaluateRule16,
  evaluateWaiver,
  read,
  rootBlock,
  sourceFiles,
} from "../scripts/check-design-system.mjs";

describe("Rule 15: Status primitives forbidden in chart series", () => {
  it("passes cleanly on the current codebase", () => {
    const violations = evaluateRule15(rootBlock, darkBlock);
    expect(violations).toEqual([]);
  });

  it("catches chart tokens resolving to success primitives", () => {
    const mockRoot = new Map([
      ["--chart-1", "var(--p-brand-600)"],
      ["--chart-2", "var(--p-success-600)"],
    ]);
    const mockDark = new Map([
      ["--chart-1", "var(--p-brand-400)"],
      ["--chart-2", "var(--p-success-400)"],
    ]);
    const violations = evaluateRule15(mockRoot, mockDark);
    expect(violations).toHaveLength(2);
    expect(violations[0]).toContain(
      ":root: --chart-2 resolves to status primitive var(--p-success-600)",
    );
    expect(violations[1]).toContain(
      ".dark: --chart-2 resolves to status primitive var(--p-success-400)",
    );
  });

  it("catches chart tokens resolving to warning, danger, and info primitives", () => {
    const mockRoot = new Map([
      ["--chart-3", "var(--p-warning-600)"],
      ["--chart-4", "var(--p-danger-600)"],
      ["--chart-5", "var(--p-info-600)"],
    ]);
    const mockDark = new Map([
      ["--chart-3", "var(--p-warning-400)"],
      ["--chart-4", "var(--p-danger-400)"],
      ["--chart-5", "var(--p-info-400)"],
    ]);
    const violations = evaluateRule15(mockRoot, mockDark);
    expect(violations).toHaveLength(6);
    expect(violations).toEqual(
      expect.arrayContaining([
        ":root: --chart-3 resolves to status primitive var(--p-warning-600)",
        ":root: --chart-4 resolves to status primitive var(--p-danger-600)",
        ":root: --chart-5 resolves to status primitive var(--p-info-600)",
        ".dark: --chart-3 resolves to status primitive var(--p-warning-400)",
        ".dark: --chart-4 resolves to status primitive var(--p-danger-400)",
        ".dark: --chart-5 resolves to status primitive var(--p-info-400)",
      ]),
    );
  });

  it("permits status tokens resolving to status primitives and chart tokens resolving to label or brand primitives", () => {
    const mockRoot = new Map([
      ["--chart-1", "var(--p-brand-600)"],
      ["--chart-2", "var(--p-teal-600)"],
      ["--chart-3", "var(--p-violet-600)"],
      ["--success", "var(--p-success-600)"],
      ["--destructive", "var(--p-danger-600)"],
    ]);
    const mockDark = new Map([
      ["--chart-1", "var(--p-brand-400)"],
      ["--chart-2", "var(--p-teal-400)"],
      ["--chart-3", "var(--p-violet-400)"],
      ["--success", "var(--p-success-500)"],
      ["--destructive", "var(--p-danger-500)"],
    ]);
    const violations = evaluateRule15(mockRoot, mockDark);
    expect(violations).toEqual([]);
  });
});

describe("Rule 16: Separation between label and status token families", () => {
  it("passes cleanly on the current codebase", () => {
    const linesToScan: { file: string; line: number; text: string }[] = [];
    for (const file of sourceFiles) {
      const lines = read(file).split("\n");
      for (const [index, line] of lines.entries()) {
        linesToScan.push({ file, line: index + 1, text: line });
      }
    }
    const violations = evaluateRule16(linesToScan);
    expect(violations).toEqual([]);
  });

  it("catches status tokens used on Chip or Tag components", () => {
    const fixture = [
      {
        file: "app/routes/test.tsx",
        line: 10,
        text: '<Chip className="bg-warning-subtle text-warning-on-subtle" />',
      },
      {
        file: "app/routes/test.tsx",
        line: 15,
        text: '<Tag className="bg-success text-success-foreground">Active</Tag>',
      },
      {
        file: "app/routes/test.tsx",
        line: 20,
        text: '<div data-slot="chip" className="bg-destructive" />',
      },
    ];
    const violations = evaluateRule16(fixture);
    expect(violations).toHaveLength(3);
    expect(violations[0]).toContain(
      "status token used in label/chip context (rule 16)",
    );
    expect(violations[1]).toContain(
      "status token used in label/chip context (rule 16)",
    );
    expect(violations[2]).toContain(
      "status token used in label/chip context (rule 16)",
    );
  });

  it("catches label tokens used in status components (Toast, Alert)", () => {
    const fixture = [
      {
        file: "app/routes/test.tsx",
        line: 30,
        text: '<Toast className="bg-label-lime-subtle text-label-lime-on-subtle" />',
      },
      {
        file: "app/routes/test.tsx",
        line: 35,
        text: '<Alert className="border-label-violet-border text-label-violet-on-subtle" />',
      },
      {
        file: "app/routes/test.tsx",
        line: 40,
        text: '<AlertTitle className="text-label-teal-on-subtle">Notice</AlertTitle>',
      },
    ];
    const violations = evaluateRule16(fixture);
    expect(violations).toHaveLength(3);
    expect(violations[0]).toContain(
      "non-semantic label token used in status context (rule 16)",
    );
    expect(violations[1]).toContain(
      "non-semantic label token used in status context (rule 16)",
    );
    expect(violations[2]).toContain(
      "non-semantic label token used in status context (rule 16)",
    );
  });

  it("catches mixed status and label tokens on the same line", () => {
    const fixture = [
      {
        file: "app/routes/test.tsx",
        line: 50,
        text: '<div className="bg-label-teal-subtle text-destructive" />',
      },
    ];
    const violations = evaluateRule16(fixture);
    expect(violations).toHaveLength(1);
    expect(violations[0]).toContain(
      "mixed status and label tokens on the same line (rule 16)",
    );
  });
});

describe("ds-allow waivers on label tokens", () => {
  it("permits legal waivers in design-system.tsx with sufficient reason", () => {
    const waiver = evaluateWaiver(
      "app/routes/design-system.tsx",
      81,
      'const BANNED_SURFACE_FILL = "bg-primary/5"; // ds-allow: the Don\'t list has to print a banned class to document it',
    );
    expect(waiver).not.toBeNull();
    expect(waiver?.legal).toBe(true);
    expect(waiver?.problem).toBeNull();
  });

  it("strictly rejects ds-allow waivers on --label-* tokens", () => {
    const waiver = evaluateWaiver(
      "app/routes/design-system.tsx",
      100,
      'const chip = "bg-label-violet-subtle"; // ds-allow: this is a legitimate reason exceeding 15 chars',
    );
    expect(waiver).not.toBeNull();
    expect(waiver?.legal).toBe(false);
    expect(waiver?.problem).toContain(
      "--label-* is strictly non-semantic and exempt from ds-allow waivers (rule 16)",
    );
  });

  it("rejects ds-allow waivers with short reasons (< 15 characters)", () => {
    const waiver = evaluateWaiver(
      "app/routes/design-system.tsx",
      81,
      'const BANNED = "bg-primary/5"; // ds-allow: short reason',
    );
    expect(waiver).not.toBeNull();
    expect(waiver?.legal).toBe(false);
    expect(waiver?.problem).toContain("minimum 15");
  });

  it("rejects ds-allow waivers outside app/routes/design-system.tsx", () => {
    const waiver = evaluateWaiver(
      "app/components/Tag.tsx",
      15,
      'const BANNED = "bg-primary/5"; // ds-allow: this is a legitimate reason exceeding 15 chars',
    );
    expect(waiver).not.toBeNull();
    expect(waiver?.legal).toBe(false);
    expect(waiver?.problem).toContain(
      "only the style guide may print a banned class",
    );
  });

  it("rejects deferral reasons like phase X or todo", () => {
    const waiver = evaluateWaiver(
      "app/routes/design-system.tsx",
      81,
      'const BANNED = "bg-primary/5"; // ds-allow: fix this in phase 8 later',
    );
    expect(waiver).not.toBeNull();
    expect(waiver?.legal).toBe(false);
    expect(waiver?.problem).toContain(
      "defers the work instead of justifying it",
    );
  });
});
