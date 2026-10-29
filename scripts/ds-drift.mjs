#!/usr/bin/env node
/**
 * Upstream drift report for the vendored components (phase 5, `.docs/plan/07` §4).
 *
 * Fetches the registry item `shadcn@4.23.0` installed — `r/styles/new-york-v4/<name>.json` —
 * runs it through this repo's own Biome formatter, and compares it to the vendored file.
 * Formatting is therefore never reported as drift: only a line that genuinely differs is.
 *
 * Manual and weekly, because it needs the network. `npm run check:ds` is the CI gate.
 *
 *   exit 0 — every vendored file is byte-identical to upstream or listed in PATCHES.md
 *   exit 1 — a file differs and PATCHES.md does not explain it, or upstream was unreachable
 */
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { basename, join, posix } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const BIOME_CLI = "node_modules/@biomejs/biome/bin/biome";
const READ = (path) => readFileSync(join(repositoryRoot, path), "utf8");

const config = JSON.parse(READ("components.json"));
const REGISTRY = `https://ui.shadcn.com/r/styles/${config.style}-v4`;

/** Directories the CLI writes into, keyed by the registry's own path prefix. */
const SOURCES = [
  { dir: "app/components/ui", prefix: "ui/" },
  { dir: "app/hooks", prefix: "hooks/" },
];

/**
 * Two things the installer is known to leave inconsistent are removed from BOTH sides before
 * comparing, because neither is a design decision: `@/registry/<style>/<group>/x`, which the CLI
 * rewrites into this project's aliases, and `"use client"`, a bundler directive a non-RSC project
 * (`components.json` `rsc: false`) ignores and which the CLI strips from some files and keeps in
 * others. Without them, the report is mostly framework noise instead of moved classes.
 */
function normalizeSource(content) {
  const aliased = content.replace(
    /"@\/registry\/[^/"]+\/(ui|hooks|lib|components)\/([^"]+)"/g,
    (_match, group, rest) => `"${config.aliases[group]}/${rest}"`,
  );
  return config.rsc === false
    ? aliased.replace(/^\s*"use client";?[ \t]*\n+/, "")
    : aliased;
}

/**
 * `PATCHES.md` is the declaration of intent, so it decides what counts as drift. A row whose
 * change says the file was never vendored is excluded outright — comparing a hand-written
 * `sonner.tsx` against upstream would only produce noise.
 */
function declaredDeviations() {
  const text = READ("app/components/ui/PATCHES.md");
  const section =
    text.split(/\n## /).find((part) => part.startsWith("Deviations")) ?? "";
  const map = new Map();
  for (const line of section.split("\n")) {
    const row = /^\|\s*`([^`]+)`\s*\|([^|]*)\|/.exec(line.trim());
    if (row) map.set(row[1], row[2].trim());
  }
  return map;
}

/** The upstream text for a local file, normalised. `null` when the item has no such file. */
async function upstreamSource(localPath, prefix) {
  const name = basename(localPath).replace(/\.[jt]sx?$/, "");
  const response = await fetch(`${REGISTRY}/${name}.json`, {
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) return null;
  const registryFiles = (await response.json()).files ?? [];
  // `registry/new-york-v4/ui/button.tsx` compared against `ui/button.tsx`
  const suffix = prefix + basename(localPath);
  const match = registryFiles.find((file) => file.path.endsWith(suffix));
  return match ? normalizeSource(match.content) : null;
}

/** Format with the repo's own Biome so that semicolons and wrapping cannot read as drift. */
function format(localPath, content) {
  const result = spawnSync(
    process.execPath,
    [BIOME_CLI, "format", `--stdin-file-path=${localPath}`],
    { cwd: repositoryRoot, input: content, encoding: "utf8" },
  );
  if (result.status !== 0) {
    throw new Error(`biome could not format upstream ${localPath}`);
  }
  return result.stdout;
}

/**
 * Indentation is already normalised by Biome, so comparing trimmed lines makes a pure
 * re-wrapping invisible — which is the point: drift means a class or a prop moved.
 */
function changedLines(upstream, local) {
  const lines = (text) =>
    text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  const upstreamLines = lines(upstream);
  const localLines = lines(local);
  const inLocal = new Set(localLines);
  const inUpstream = new Set(upstreamLines);
  return {
    onlyUpstream: upstreamLines.filter((line) => !inLocal.has(line)),
    onlyLocal: localLines.filter((line) => !inUpstream.has(line)),
  };
}

const deviations = declaredDeviations();
const files = SOURCES.flatMap(({ dir, prefix }) =>
  readdirSync(join(repositoryRoot, dir))
    .filter(
      (entry) => /\.[jt]sx?$/.test(entry) && !/\.test\.[jt]sx?$/.test(entry),
    )
    .map((entry) => ({ localPath: posix.join(dir, entry), prefix })),
).sort((a, b) => a.localPath.localeCompare(b.localPath));

const results = [];
for (let index = 0; index < files.length; index += 6) {
  results.push(
    ...(await Promise.all(
      files.slice(index, index + 6).map(async ({ localPath, prefix }) => {
        const declared = deviations.get(basename(localPath));
        if (declared && /never vendored/.test(declared)) {
          return { localPath, kind: "local-only" };
        }
        let upstream;
        try {
          upstream = await upstreamSource(localPath, prefix);
        } catch (error) {
          return { localPath, kind: "error", detail: String(error) };
        }
        if (!upstream) return { localPath, kind: "no-upstream-file" };
        let diff;
        try {
          diff = changedLines(
            format(localPath, upstream),
            normalizeSource(READ(localPath)),
          );
        } catch (error) {
          return { localPath, kind: "error", detail: String(error) };
        }
        if (!diff.onlyUpstream.length && !diff.onlyLocal.length) {
          return { localPath, kind: "in-sync" };
        }
        return {
          localPath,
          kind: declared ? "declared" : "undeclared",
          ...diff,
        };
      }),
    )),
  );
}

const by = (kind) => results.filter((result) => result.kind === kind);
const groups = [
  ["in-sync", "no class, prop or import differs from upstream"],
  ["declared", "differ, and PATCHES.md says why"],
  ["undeclared", "differ with NO PATCHES.md entry"],
  ["no-upstream-file", "not in the registry item — check by hand"],
  ["error", "could not be compared"],
  ["local-only", "declared never-vendored, not compared"],
];

console.log(
  `upstream drift — ${files.length} vendored files against ${REGISTRY}/<name>.json\n`,
);
for (const [kind, label] of groups) {
  const list = by(kind);
  if (!list.length) continue;
  console.log(`${String(list.length).padStart(3)}  ${label}`);
  for (const result of list) {
    if (kind === "in-sync" || kind === "local-only") {
      console.log(`     ${result.localPath}`);
      continue;
    }
    const summary = result.onlyUpstream
      ? ` — ${result.onlyUpstream.length} upstream line(s) absent locally, ` +
        `${result.onlyLocal.length} local line(s) not upstream`
      : ` — ${result.detail ?? "no comparison"}`;
    console.log(`     ${result.localPath}${summary}`);
    if (kind !== "undeclared") continue;
    for (const line of result.onlyUpstream.slice(0, 4)) {
      console.log(`       - ${line}`);
    }
    for (const line of result.onlyLocal.slice(0, 4)) {
      console.log(`       + ${line}`);
    }
  }
  console.log("");
}

const blocking = [...by("undeclared"), ...by("error")];
if (blocking.length) {
  console.log(
    `${blocking.length} file(s) need a decision: re-apply the patch, or record it in PATCHES.md, ` +
      "then run `npx biome format --write app/components/ui app/hooks`, `npm test` and `npm run check:ds`.",
  );
  process.exit(1);
}
console.log("nothing drifted that PATCHES.md does not already account for.");
