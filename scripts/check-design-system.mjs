#!/usr/bin/env node
/**
 * Design-system guardrails (phase 5, `.docs/plan/07` §4). Zero dependencies, runs after build.
 *
 * Rules 1–3 parse `app/globals.css`, rules 4–9 scan the source tree and the built stylesheet.
 * The token inventory is imported from `app/lib/design-system.ts` — the same file the style guide
 * renders and `tests/design-tokens.test.ts` asserts, so the three cannot disagree about what the
 * contract contains. That file is TypeScript, so this needs Node's type stripping (>= 22.18;
 * `.nvmrc` pins 24).
 *
 * Rules 10–13 (duplicate step, unreferenced token, `color-scheme`, focus chain) are phase 6: they
 * arrive in the same commit as the values that satisfy them, never pre-waived (decision D15).
 */
import { readdirSync, readFileSync } from "node:fs";
import { join, posix } from "node:path";
import { fileURLToPath } from "node:url";

if (!process.features.typescript) {
  console.error(
    "check:ds needs Node >= 22.18 for TypeScript type stripping " +
      `(this is ${process.version}). Use the version in .nvmrc.`,
  );
  process.exit(1);
}

const { TOKENS } = await import("../app/lib/design-system.ts");
const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const read = (file) => readFileSync(join(repositoryRoot, file), "utf8");
const stylesheetPath = "app/globals.css";
const stylesheet = read(stylesheetPath);
// Comments carry contract prose (`--card` is not a match target inside one), so strip them first
// for the CSS rules — the same normalisation the unit test applies.
const css = stylesheet.replace(/\/\*[\s\S]*?\*\//g, "");

const failures = [];
const notes = [];
const fail = (rule, ...detail) => failures.push([rule, detail.join("\n    ")]);
const ok = (rule, detail) => notes.push(`${rule} — ${detail}`);

/** Extract the balanced `{…}` body of the first top-level block whose selector starts with `anchor`. */
function blockBody(anchor) {
  // Anchored to a line start so that `@custom-variant dark (&:is(.dark *))` cannot be mistaken
  // for the `.dark { … }` block, and tolerant of a selector list (`:root, .light {`).
  const start = css.search(new RegExp(`^${anchor}[^{]*\\{`, "m"));
  if (start === -1) return null;
  const open = css.indexOf("{", start);
  let depth = 0;
  for (let index = open; index < css.length; index += 1) {
    if (css[index] === "{") depth += 1;
    if (css[index] !== "}") continue;
    depth -= 1;
    if (depth === 0) return css.slice(open + 1, index);
  }
  return null;
}

function declarations(body) {
  const map = new Map();
  for (const [, name, value] of body.matchAll(/(--[\w-]+):\s*([^;]+);/g)) {
    map.set(name, value.trim());
  }
  return map;
}

function walk(dir, extensions) {
  const found = [];
  for (const entry of readdirSync(join(repositoryRoot, dir), {
    withFileTypes: true,
  })) {
    const path = posix.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...walk(path, extensions));
    else if (extensions.some((extension) => path.endsWith(extension)))
      found.push(path);
  }
  return found.sort();
}

const lightBlock = blockBody(":root");
const darkBody = blockBody(String.raw`\.dark`);
const themeBlock = blockBody("@theme inline");
if (!lightBlock || !darkBody || !themeBlock) {
  console.error(
    "\n  FAIL — globals.css is missing a top-level `:root`, `.dark` or `@theme inline` block\n",
  );
  process.exit(1);
}
const rootBlock = declarations(lightBlock);
const darkBlock = declarations(darkBody);

const sourceFiles = walk("app", [".ts", ".tsx"]);
const componentFiles = walk("app", [".tsx"]);

/* ------------------------------------------------------------------ 1 */
{
  const missing = [];
  for (const { token } of TOKENS) {
    if (!rootBlock.has(`--${token}`))
      missing.push(`--${token} missing in :root`);
    if (!darkBlock.has(`--${token}`))
      missing.push(`--${token} missing in .dark`);
  }
  if (missing.length)
    fail(
      1,
      `${missing.length} documented Tier-2 token(s) are not declared in both themes:`,
      ...missing,
    );
  else ok(1, `${TOKENS.length} Tier-2 tokens declared in :root and .dark`);
}

/* ------------------------------------------------------------------ 2 */
{
  const selfReferences = themeBlock.match(/--([\w-]+):\s*var\(--\1\)/g) ?? [];
  if (selfReferences.length)
    fail(
      2,
      "a utility that resolves to itself freezes the light value and stops `.dark` remapping it:",
      ...selfReferences,
    );
  else ok(2, "no @theme entry references itself");
}

/* ------------------------------------------------------------------ 3 */
{
  const unresolved = [
    ...new Set(
      [...themeBlock.matchAll(/var\((--[\w-]+)\)/g)]
        .map(([, name]) => name)
        .filter((name) => !rootBlock.has(name)),
    ),
  ];
  if (unresolved.length)
    fail(
      3,
      "@theme inline reads Tier-2 names that :root never declares:",
      ...unresolved,
    );
  else
    ok(3, "every var() inside @theme inline resolves to a :root declaration");
}

/* ------------------------------------------------------------------ 4 */
{
  // `theme-color` is a real <meta name>, not one of the deleted phase-1 shim utilities.
  const legacy = /(?<![\w-])theme-(?!color\b)[a-z][\w-]*/g;
  const hits = scan(sourceFiles, legacy);
  if (hits.length)
    fail(
      4,
      "the pre-v2 `theme-*` shim is deleted; use the semantic utilities in DESIGN.md:",
      ...where(hits),
    );
  else ok(4, "no `theme-*` utility left in app/**");
}

/* ------------------------------------------------------------------ 5 */
{
  const guaranteed = [
    ...new Set([
      ...inlineSourceList(),
      "bg-card",
      "bg-popover",
      "border-input",
      "ring-ring",
      "animate-in",
      "rounded-lg",
      "shadow-card",
      "shadow-pop",
    ]),
  ];
  const built = builtCss();
  if (!built) {
    fail(5, "no build/client/assets/*.css found — run `npm run build` first");
  } else {
    // Tailwind v4 merges identical declarations, so a utility may appear as `.bg-card,.bg-x\/80{`.
    const absent = guaranteed.filter(
      (name) => !new RegExp(`\\.${escapePattern(name)}(?=[,{])`).test(built),
    );
    if (absent.length)
      fail(
        5,
        `${absent.length} documented utilities did not compile into the shipped stylesheet:`,
        ...absent,
      );
    else
      ok(
        5,
        `all ${guaranteed.length} critical utilities present in the built CSS`,
      );
  }
}

/* ------------------------------------------------------------------ 6 */
{
  const tintedFill =
    /(?<![\w-])bg-(?:primary|info|success|warning|destructive|chart-\d)\/[\d.]+/g;
  const scope = [
    ...walk("app/routes", [".ts", ".tsx"]),
    ...walk("app/components/layout", [".ts", ".tsx"]),
    ...walk("app/components/patterns", [".ts", ".tsx"]),
    ...walk("app/components/auth", [".ts", ".tsx"]),
    stylesheetPath,
  ];
  const hits = scan(scope, tintedFill);
  report(
    6,
    hits,
    "a brand or status colour at low alpha is not a surface — use --primary-subtle, " +
      "--<status>-subtle, or the solid token (AGENTS.md rule 1)",
  );
}

/* ------------------------------------------------------------------ 7 */
{
  const blobs = /(?<![\w-])(?:backdrop-)?blur-(?:2xl|3xl)/g;
  const hits = scan(componentFiles, blobs);
  report(
    7,
    hits,
    "decorative blur blobs were removed from this system; --hero-glow is the sanctioned overlay hook",
  );
}

/* ------------------------------------------------------------------ 8 */
{
  const offenders = [];
  // `@utility` names come from `[\w-]+`, so they need no escaping in the anchor.
  for (const [, name] of css.matchAll(/@utility\s+([\w-]+)/g)) {
    const body = blockBody(`@utility ${name}`);
    if (body && /\bopacity:|[\s(]opacity-[\w.]+/.test(body))
      offenders.push(name);
  }
  if (offenders.length)
    fail(
      8,
      "an `@utility` that sets `opacity` teaches the whole app to fake a tint with transparency:",
      ...offenders,
    );
  else ok(8, "no @utility sets opacity");
}

/* ------------------------------------------------------------------ 9 */
{
  const styleGuide = read("app/routes/design-system.tsx");
  const undocumented = walk("app/components/patterns", [".tsx"])
    .map((file) => posix.basename(file, ".tsx"))
    .filter((name) => !styleGuide.includes(`patterns/${name}`));
  if (undocumented.length)
    fail(
      9,
      "the style guide must render every recipe, or a page will invent its own:",
      ...undocumented.map((name) => `app/components/patterns/${name}.tsx`),
    );
  else ok(9, "every pattern recipe is rendered by /design-system");
}

/* ------------------------------------------------------------ waivers */
const waiverFiles = scanWaivers();
const illegalWaivers = waiverFiles.filter((waiver) => !waiver.legal);
if (illegalWaivers.length)
  fail(
    0,
    "`ds-allow` is legal only in app/routes/design-system.tsx, only with a real reason " +
      "(>= 15 characters, and not a deferral):",
    ...illegalWaivers.map(
      (waiver) => `${waiver.file}:${waiver.line} — ${waiver.problem}`,
    ),
  );

/* -------------------------------------------------------------- output */
for (const line of notes) console.log(`  ok   ${line}`);
for (const [rule, detail] of failures) {
  console.error(`\n  FAIL rule ${rule}\n    ${detail}`);
}
console.log(
  `\n  waivers: ${waiverFiles.length} (${waiverFiles
    .map((waiver) => `${waiver.reason} @ ${waiver.file}:${waiver.line}`)
    .join("; ")})`,
);
console.log(
  failures.length
    ? `\n  design-system check FAILED: ${failures.length} rule group(s) violated\n`
    : "\n  design-system check passed\n",
);
process.exit(failures.length ? 1 : 0);

/** Find every match of `pattern` in `files`, one record per line, waivers separated. */
function scan(files, pattern) {
  const hits = [];
  for (const file of files) {
    const text = file.endsWith(".css") ? css : read(file);
    const lines = text.split("\n");
    for (const [index, line] of lines.entries()) {
      const matches = [...line.matchAll(pattern)];
      if (!matches.length) continue;
      const reason = waiverReason(line);
      hits.push({
        file,
        line: index + 1,
        text: matches.map((match) => match[0]).join(", "),
        reason,
        waived: reason !== null,
      });
    }
  }
  return hits;
}

/**
 * The reason text of a `ds-allow` waiver, or null when the line carries none. `[^*]` stops at the
 * close of a JSX comment, so block and line comments both yield the bare reason.
 */
function waiverReason(line) {
  const match = /ds-allow:\s*([^*]+)/.exec(line);
  return match ? match[1].replace(/[\s)\]}]+$/g, "").trim() : null;
}

function where(hits) {
  return hits.map((hit) => `${hit.file}:${hit.line} — ${hit.text}`);
}

/** Rules 6 and 7 share the escape-hatch semantics: pass only a legal waiver. */
function report(rule, hits, message) {
  const violations = hits.filter((hit) => !hit.waived);
  const waived = hits.filter((hit) => hit.waived);
  if (violations.length)
    fail(
      rule,
      `${violations.length} violation(s) — ${message}`,
      ...where(violations),
    );
  else
    ok(
      rule,
      waived.length
        ? `clean, ${waived.length} waived (${waived.map((hit) => hit.file).join(", ")})`
        : "clean",
    );
}

function scanWaivers() {
  const found = [];
  for (const file of sourceFiles.concat(stylesheetPath)) {
    const lines = read(file).split("\n");
    for (const [index, line] of lines.entries()) {
      const reason = waiverReason(line);
      if (reason === null) continue;
      const deferral = /phase\s*\d|todo|fixme|later|n\/?a/i.test(reason);
      const problem =
        file !== "app/routes/design-system.tsx"
          ? "only the style guide may print a banned class"
          : deferral
            ? `"${reason}" defers the work instead of justifying it`
            : reason.length < 15
              ? `reason is ${reason.length} characters, minimum 15`
              : null;
      found.push({ file, line: index + 1, reason, problem, legal: !problem });
    }
  }
  return found;
}

/** The `@source inline("…")` list: the documented vocabulary that must compile on demand. */
function inlineSourceList() {
  const directive = /@source inline\("([^"]+)"\)/.exec(css);
  return directive ? directive[1].split(/\s+/) : [];
}

function builtCss() {
  const assets = join(repositoryRoot, "build/client/assets");
  let names;
  try {
    names = readdirSync(assets);
  } catch {
    return null;
  }
  const cssFiles = names.filter((name) => name.endsWith(".css"));
  if (!cssFiles.length) return null;
  return cssFiles.map((name) => read(`build/client/assets/${name}`)).join("\n");
}

function escapePattern(value) {
  return value.replace(/[.*+?^${}()|[\]\\/]/g, String.raw`\$&`);
}
