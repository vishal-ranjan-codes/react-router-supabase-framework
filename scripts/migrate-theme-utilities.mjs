#!/usr/bin/env node
/**
 * Phase 2 codemod: retire the `theme-*` vocabulary for the Tier-3 contract.
 *
 * Mechanical only — one input class, one output class, no judgement. Surfaces
 * that need a decision (brand tints, blur blobs, sidebar tokens) are listed in
 * `.docs/plan/04-phase-2-migrate-app.md` §2 and are handled by hand.
 *
 *   node scripts/migrate-theme-utilities.mjs --dry-run
 *   node scripts/migrate-theme-utilities.mjs
 *
 * Two rows of the plan's table are deliberately absent: `box` is kept as-is,
 * and `container` → `container-page` was already applied to its only two call
 * sites in phase 1. A bare-token `container` rewrite here would also hit the
 * JSX prose in `app/routes/design-system.tsx`.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MAP = new Map(
  Object.entries({
    "theme-bg-color": "bg-background",
    "theme-bg-color-dark": "bg-muted",
    "theme-fg-color": "bg-card",
    "theme-fg-color-dark": "bg-card",
    "theme-fc-heading": "text-foreground",
    "theme-fc-heading-light": "text-foreground",
    "theme-fc-base": "text-foreground",
    "theme-fc-light": "text-muted-foreground",
    "theme-fc-lighter": "text-foreground-subtle",
    "theme-text-muted": "text-muted-foreground",
    "theme-text-secondary": "text-secondary-foreground",
    "theme-text-accent": "text-accent-foreground",
    "theme-bg-accent": "bg-accent",
    "theme-bg-secondary": "bg-secondary",
    "theme-bg-muted": "bg-muted",
    "theme-bg-card": "bg-card",
    "theme-bg-popover": "bg-popover",
    "theme-bg-destructive": "bg-destructive",
    "theme-text-destructive": "text-destructive",
    "theme-bg-success": "bg-success-subtle",
    "theme-text-success": "text-success",
    "theme-border-color": "border-border",
    "theme-border-color-light": "border-border-subtle",
    "theme-border-input": "border-input",
    "theme-ring": "ring-ring",
    "theme-rounded": "rounded-lg",
    "theme-rounded-sm": "rounded-sm",
    "theme-rounded-t": "rounded-t-lg",
    "theme-rounded-b": "rounded-b-lg",
    "theme-rounded-l": "rounded-l-lg",
    "theme-rounded-r": "rounded-r-lg",
    "theme-h1": "text-h1",
    "theme-h2": "text-h2",
    "theme-h3": "text-h3",
    "theme-h4": "text-h4",
    "theme-h5": "text-h5",
    "theme-h6": "text-h6",
    "theme-bg-shade-5": "bg-background-subtle",
    "theme-bg-shade-10": "bg-background-subtle",
    "button-hover-darker": "hover:bg-primary-hover",
  }),
);

// A class token is delimited by whitespace or a quote/backtick, and may carry
// any number of variant prefixes (`hover:`, `focus-visible:`, `md:`). Anchoring
// on the delimiters keeps the codemod off identifiers such as `containerClassName`.
const TOKEN =
  /([\s"'`])((?:[^\s"'`]+:)*)(theme-[a-z0-9-]+|button-hover-darker)(?=[\s"'`])/g;

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function tsxFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...tsxFiles(full));
    else if (entry.endsWith(".tsx")) out.push(full);
  }
  return out.sort();
}

const dryRun = process.argv.includes("--dry-run");
const unmapped = new Map();
const duplicates = [];
let changedFiles = 0;
let changedTokens = 0;

for (const file of tsxFiles(join(ROOT, "app"))) {
  const before = readFileSync(file, "utf8");
  const after = before.replace(TOKEN, (match, lead, variants, name) => {
    const next = MAP.get(name);
    if (!next) {
      unmapped.set(name, (unmapped.get(name) ?? 0) + 1);
      return match;
    }
    changedTokens += 1;
    return `${lead}${variants}${next}`;
  });

  if (after === before) continue;
  changedFiles += 1;

  const rel = relative(ROOT, file);
  console.log(`\n${rel}`);
  const beforeLines = before.split("\n");
  const afterLines = after.split("\n");
  for (let i = 0; i < afterLines.length; i += 1) {
    if (afterLines[i] === beforeLines[i]) continue;
    console.log(`  ${i + 1} - ${beforeLines[i].trim()}`);
    console.log(`  ${i + 1} + ${afterLines[i].trim()}`);

    // Two legacy classes could map onto the same utility; the codemod will not
    // guess which one wins, so surface it for the manual pass.
    for (const token of afterLines[i].matchAll(
      /[\s"'`]([^\s"'`]+)(?=[\s"'`])/g,
    )) {
      const parts = token[1].split(":").filter((p) => !p.includes("["));
      const seen = new Set();
      for (const part of parts) {
        if (/^(text|bg|border|rounded)-/.test(part) && seen.has(part)) {
          duplicates.push(`${rel}:${i + 1} ${part}`);
        }
        seen.add(part);
      }
    }
  }

  if (!dryRun) writeFileSync(file, after);
}

console.log(
  `\n${dryRun ? "[dry-run] " : ""}${changedTokens} class${changedTokens === 1 ? "" : "es"} ` +
    `across ${changedFiles} file${changedFiles === 1 ? "" : "s"}.`,
);

if (duplicates.length > 0) {
  console.log(`\nReview — a line now repeats one utility:`);
  for (const d of [...new Set(duplicates)]) console.log(`  ${d}`);
}

if (unmapped.size > 0) {
  console.error("\nUnmapped legacy classes still present:");
  for (const [name, count] of unmapped) console.error(`  ${name} (${count})`);
  process.exitCode = 1;
}
