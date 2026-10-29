import {
  ArrowRight,
  CircleCheck,
  CircleX,
  Copy,
  Database,
  Info,
  ListChecks,
  LoaderCircle,
  type LucideIcon,
  Rocket,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { Link } from "react-router";
import { CodeBlock } from "~/components/patterns/CodeBlock";
import { CtaBand } from "~/components/patterns/CtaBand";
import { FeatureCard } from "~/components/patterns/FeatureCard";
import { Hero } from "~/components/patterns/Hero";
import { IconTile } from "~/components/patterns/IconTile";
import { LogoStrip } from "~/components/patterns/LogoStrip";
import { PageHeader } from "~/components/patterns/PageHeader";
import { Section } from "~/components/patterns/Section";
import { SectionHeading } from "~/components/patterns/SectionHeading";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  CONTRAST_PAIRS,
  type ContrastPair,
  contrastRatio,
  formatRatio,
  NON_COLOR_TOKENS,
  PATTERNS,
  parseColor,
  STATES,
  SURFACE_LADDER,
  SURFACE_QUESTIONS,
  TOKEN_GROUP_LABELS,
  TOKENS,
  type TokenGroup,
  TYPE_SCALE,
} from "~/lib/design-system";
import { cn } from "~/lib/utils";

export function meta() {
  return [
    { title: "Design System | React Router + Supabase Framework" },
    {
      name: "description",
      content:
        "The living style guide: surface ladder, token contract with measured contrast, type scale, pattern recipes and control states.",
    },
  ];
}

const CLONE_COMMAND = `git clone https://github.com/vishal-ranjan-codes/react-router-supabase-framework
cd react-router-supabase-framework
npm install && npm run dev`;

const BANNED_SURFACE_FILL = "bg-primary/5"; // ds-allow: the Don't list has to print a banned class to document it

const SECTIONS: { id: string; label: string }[] = [
  { id: "surfaces", label: "Surfaces" },
  { id: "colors", label: "Tokens & contrast" },
  { id: "typography", label: "Typography" },
  { id: "patterns", label: "Patterns" },
  { id: "states", label: "States" },
  { id: "components", label: "Components" },
  { id: "rules", label: "Rules" },
];

const SURFACE_SWATCHES: Record<string, string> = {
  background: "bg-background",
  "background-subtle": "bg-background-subtle",
  card: "bg-card",
  popover: "bg-popover",
  scrim: "bg-scrim",
  "surface-inverse": "bg-surface-inverse",
  "surface-brand": "bg-surface-brand",
};

/** The ink the contract pairs with each surface — a swatch label must be readable.
 *  `scrim` is absent on purpose: see the swatch below. */
const SURFACE_INK: Record<string, string> = {
  background: "text-foreground",
  "background-subtle": "text-foreground",
  card: "text-foreground",
  popover: "text-foreground",
  "surface-inverse": "text-foreground-inverse",
  "surface-brand": "text-primary-deep-foreground",
};

const STATUS_SPECIMENS: {
  name: string;
  icon: LucideIcon;
  meaning: string;
  panel: string;
  solid: string;
}[] = [
  {
    name: "success",
    icon: CircleCheck,
    meaning: "Saved, verified, live",
    panel: "bg-success-subtle text-success-on-subtle border-success-border",
    solid: "bg-success text-success-foreground",
  },
  {
    name: "warning",
    icon: TriangleAlert,
    meaning: "Needs attention, not broken",
    panel: "bg-warning-subtle text-warning-on-subtle border-warning-border",
    solid: "bg-warning text-warning-foreground",
  },
  {
    name: "destructive",
    icon: CircleX,
    meaning: "Irreversible or failed",
    panel:
      "bg-destructive-subtle text-destructive-on-subtle border-destructive-border",
    solid: "bg-destructive text-destructive-foreground",
  },
  {
    name: "info",
    icon: Info,
    meaning: "Neutral notice",
    panel: "bg-info-subtle text-info-on-subtle border-info-border",
    solid: "bg-info text-info-foreground",
  },
];

const RADIUS_SWATCHES: { utility: string; token: string; use: string }[] = [
  { utility: "rounded-xs", token: "--radius-xs", use: "Chips" },
  { utility: "rounded-sm", token: "--radius-sm", use: "Small controls" },
  { utility: "rounded-md", token: "--radius-md", use: "Buttons, inputs" },
  { utility: "rounded-lg", token: "--radius-lg", use: "Cards (base)" },
  { utility: "rounded-xl", token: "--radius-xl", use: "Large panels" },
  { utility: "rounded-2xl", token: "--radius-2xl", use: "Modals" },
];

const NEUTRAL_STEPS = [
  0, 50, 100, 150, 200, 300, 400, 450, 500, 600, 700, 750, 800, 850, 900, 950,
];
const BRAND_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const GROUP_ORDER = [
  "surface",
  "content",
  "brand",
  "status",
  "line",
  "data",
  "sidebar",
] as const satisfies readonly TokenGroup[];

export default function DesignSystemPage() {
  const ratios = useContrastRatios();

  return (
    <div className="bg-background">
      <PageHeader
        eyebrow="Design system · token contract v2"
        title="One vocabulary, measured in your browser"
        description={
          <>
            Every panel, ratio and class name on this page is read from{" "}
            <code>app/lib/design-system.ts</code> — the same description{" "}
            <code>tests/design-tokens.test.ts</code> asserts and{" "}
            <code>scripts/check-design-system.mjs</code> enforces. Nothing here
            is a screenshot of an opinion.
          </>
        }
      />

      <div className="container-page border-border border-b py-5">
        <nav aria-label="On this page">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-foreground-muted hover:text-link text-body-sm underline-offset-4 hover:underline"
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <SurfacesSection />
      <TokenSection ratios={ratios} />
      <TypographySection />
      <PatternsSection />
      <StatesSection />
      <ComponentsSection />
      <RulesSection />

      <CtaBand
        tone="brand-deep"
        title="Start building"
        description="Compose pages from the recipes above; take colour only from the semantic tokens. The checker rejects anything else."
        actions={
          <>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/">View homepage</Link>
            </Button>
            <Link
              to="/about"
              className="text-body-sm text-primary-deep-foreground underline-offset-4 hover:underline"
            >
              Read about the stack
            </Link>
          </>
        }
      />
    </div>
  );
}

/* ------------------------------------------------------------------ surfaces */

function SurfacesSection() {
  return (
    <Section id="surfaces" tone="sunken">
      <SectionHeading
        eyebrow="Step 1 — pick a surface"
        title="The surface ladder"
        description={
          <>
            Six steps of elevation, each with a job. A page is{" "}
            <code>background</code>; a panel on it is <code>card</code>; a
            response to the pointer is <code>accent</code>. Anything you are
            tempted to tint has a named step already.
          </>
        }
      />

      <div className="space-y-4">
        {SURFACE_LADDER.map((surface) => (
          <div
            key={surface.token}
            className="box grid items-center gap-4 p-4 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]"
          >
            <ThemePair>
              {() => (
                <div
                  className={cn(
                    "flex h-20 items-end rounded-md border border-border p-2",
                    SURFACE_SWATCHES[surface.token],
                  )}
                >
                  {/* `--scrim` is translucent, so text on it has no fixed contrast to
                      demonstrate — the contract's "never anything else" is the point. */}
                  {surface.token === "scrim" ? null : (
                    <code
                      className={cn("text-body-xs", SURFACE_INK[surface.token])}
                    >
                      --{surface.token}
                    </code>
                  )}
                </div>
              )}
            </ThemePair>
            <div className="text-body-sm">
              <p className="text-foreground font-mono text-body-xs">
                {`bg-${surface.token}`} · light {surface.light} · dark{" "}
                {surface.dark}
              </p>
              <p className="text-foreground mt-1 font-medium">{surface.use}</p>
              <p className="text-foreground-muted">Never: {surface.never}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h3 className="text-h4 mb-4 font-semibold">Which token do I want?</h3>
        <ol className="space-y-3">
          {SURFACE_QUESTIONS.map((entry) => (
            <li key={entry.question}>
              <p className="text-foreground text-body font-medium">
                {entry.question}
              </p>
              <p className="text-foreground-muted text-body-sm">
                {entry.answer}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------- tokens */

function TokenSection({ ratios }: { ratios: RatioMap | null }) {
  return (
    <Section id="colors">
      <SectionHeading
        eyebrow="Step 2 — pick a colour"
        title="Primitives, then the roles that use them"
        description={
          <>
            Tier 1 is data: two neutral and brand ramps, plus the four status
            ramps. App code never touches them — every utility below resolves
            through a Tier-2 semantic name, and <code>.dark</code> is a
            remapping of those names, not a second palette.
          </>
        }
      />

      <div className="mb-12">
        <h3 className="text-h4 mb-3 font-semibold">Neutral ramp</h3>
        <Ramp steps={NEUTRAL_STEPS} family="neutral" />
        <h3 className="text-h4 mb-3 mt-10 font-semibold">Brand ramp</h3>
        <Ramp steps={BRAND_STEPS} family="brand" />
        <p className="text-foreground-muted mt-4 max-w-3xl text-body-sm">
          <code>--p-brand-600</code> is the frozen brand step (decision D2).
          There is exactly one chromatic brand hue in this system; secondary,
          accent and muted are neutral by decision, and <code>bg-accent</code>{" "}
          is a hover surface rather than an accent colour.
        </p>
      </div>

      <h3 className="text-h4 mb-3 font-semibold">Contrast manifest</h3>
      <p className="text-foreground-muted mb-6 max-w-3xl text-body">
        {CONTRAST_PAIRS.length} pairs, measured from the stylesheet your browser
        just downloaded. Text pairs clear {4.5}:1, boundaries and chart series{" "}
        {3}:1. The same list is asserted in both themes by{" "}
        <code>tests/design-tokens.test.ts</code>, so a value that fails here
        fails CI.
      </p>
      <div className="box overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pair</TableHead>
              <TableHead>Floor</TableHead>
              <TableHead>Measured</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CONTRAST_PAIRS.map((pair) => (
              <TableRow key={`${pair.foreground}-${pair.background}`}>
                <TableCell className="font-mono text-body-xs">
                  <span className="text-foreground">--{pair.foreground}</span>
                  <span className="text-foreground-muted"> on </span>
                  <span className="text-foreground">--{pair.background}</span>
                </TableCell>
                <TableCell className="text-foreground-muted text-body-xs tabular-nums">
                  {pair.minimum}:1 · {pair.kind}
                </TableCell>
                <TableCell>
                  <Verdict pair={pair} ratios={ratios} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <h3 className="text-h4 mb-3 mt-14 font-semibold">Token reference</h3>
      <p className="text-foreground-muted mb-6 max-w-3xl text-body">
        What each semantic token is for, and — where it matters — what it is
        never for. Ratios live in the manifest above, so nothing is stated twice
        in two places that could drift.
      </p>
      {GROUP_ORDER.map((group) => (
        <div key={group} className="mb-10">
          <h4 className="text-h5 mb-3 font-semibold">
            {TOKEN_GROUP_LABELS[group]}
          </h4>
          <div className="box overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Token</TableHead>
                  <TableHead>Utility</TableHead>
                  <TableHead>Use / never</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TOKENS.filter((token) => token.group === group).map(
                  (token) => (
                    <TableRow key={token.token}>
                      <TableCell className="text-foreground font-mono text-body-xs">
                        --{token.token}
                      </TableCell>
                      <TableCell className="text-foreground-muted font-mono text-body-xs">
                        {token.utility}
                      </TableCell>
                      <TableCell className="text-body-sm">
                        <span className="text-foreground">{token.use}</span>
                        {token.never ? (
                          <span className="text-foreground-muted">
                            {" "}
                            — never {token.never}
                          </span>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      ))}
    </Section>
  );
}

function Ramp({ steps, family }: { steps: number[]; family: string }) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
      {steps.map((step) => (
        <div key={step} className="box p-3">
          <div
            className="border-border h-14 rounded-md border"
            style={{ backgroundColor: `var(--p-${family}-${step})` }}
          />
          <code className="text-foreground mt-2 block text-body-xs">
            {family}-{step}
          </code>
          <p className="text-foreground-subtle text-body-xs">
            --p-{family}-{step}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- typography */

function TypographySection() {
  return (
    <Section id="typography" tone="sunken">
      <SectionHeading
        eyebrow="Step 3 — pick a size"
        title="Type scale by role"
        description={
          <>
            Twelve roles, no arbitrary sizes. Colour comes from the base layer,
            so <code>text-h2</code> is a size and never a colour.
          </>
        }
      />

      <ThemePair>
        {() => (
          <div className="divide-border space-y-4 divide-y">
            {TYPE_SCALE.map((entry) => (
              <div key={entry.utility} className="pt-4 first:pt-0">
                <p className={cn("text-foreground", entry.utility)}>
                  {sampleFor(entry.utility)}
                </p>
                <p className="text-foreground-muted mt-1 font-mono text-body-xs">
                  {entry.utility} · {entry.size} / {entry.lineHeight} ·{" "}
                  {entry.use}
                </p>
              </div>
            ))}
          </div>
        )}
      </ThemePair>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="text-h4 mb-4 font-semibold">Radius</h3>
          <div className="grid grid-cols-3 gap-4">
            {RADIUS_SWATCHES.map((entry) => (
              <div key={entry.utility} className="box p-3">
                <div
                  className={cn(
                    "border-border bg-background-subtle h-12 border",
                    entry.utility,
                  )}
                />
                <code className="text-foreground mt-2 block text-body-xs">
                  {entry.utility}
                </code>
                <p className="text-foreground-subtle text-body-xs">
                  {entry.token} · {entry.use}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-h4 mb-4 font-semibold">Elevation</h3>
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-5 shadow-card">
              <p className="text-foreground text-body-sm font-medium">
                shadow-card
              </p>
              <p className="text-foreground-muted text-body-xs">
                Cards and raised sections — two 1px layers, never a glow.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5 shadow-pop">
              <p className="text-foreground text-body-sm font-medium">
                shadow-pop
              </p>
              <p className="text-foreground-muted text-body-xs">
                Popovers and dialogs — the only step that lifts off the page.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <p className="text-foreground text-body-sm font-medium">
                no shadow
              </p>
              <p className="text-foreground-muted text-body-xs">
                The page canvas and sunken wells are flat.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-h4 mb-4 font-semibold">
          Everything that is not a colour
        </h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {NON_COLOR_TOKENS.map((group) => (
            <div key={group.group} className="box p-4">
              <h4 className="text-foreground mb-3 text-body-sm font-semibold">
                {group.group}
              </h4>
              <dl className="space-y-2">
                {group.rows.map((row) => (
                  <div key={row.token}>
                    <dt className="text-foreground font-mono text-body-xs">
                      {row.token}{" "}
                      <span className="text-foreground-muted">{row.value}</span>
                    </dt>
                    <dd className="text-foreground-muted text-body-xs">
                      {row.use}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function sampleFor(utility: string): string {
  switch (utility) {
    case "text-display":
      return "Ship the framework, not the scaffold";
    case "text-eyebrow":
      return "React Router 8 · Supabase · Cloudflare Workers";
    case "text-body-xs":
    case "text-body-sm":
      return "Fine print: token metadata, table cells and helper text.";
    default:
      return "The quick brown fox jumps over the lazy dog";
  }
}

/* ------------------------------------------------------------------ patterns */

const STACK_LOGOS = [
  { label: "React Router 8" },
  { label: "Supabase" },
  { label: "Cloudflare Workers" },
  { label: "Tailwind v4" },
  { label: "Vitest + Playwright" },
];

const TOKEN_SNIPPET = `/* app/globals.css — Tier 2 never writes a hex */
--primary: var(--p-brand-600);
--foreground-subtle: var(--p-neutral-450);`;

/** One live specimen per recipe in `PATTERNS`, keyed by the pattern name. */
const SPECIMENS: Record<string, ReactNode> = {
  Section: (
    <div>
      {(["page", "raised", "sunken", "inverse", "brand-deep"] as const).map(
        (tone) => (
          <Section
            key={tone}
            tone={tone}
            size="sm"
            className="border-b border-border"
          >
            <p className="text-inherit font-mono text-body-xs">
              {`<Section tone="${tone}" size="sm">`}
            </p>
          </Section>
        ),
      )}
    </div>
  ),
  SectionHeading: (
    <SectionHeading
      className="container-page"
      eyebrow="Section heading"
      title="A heading that owns the top of a band"
      description="Eyebrow, title, lede and an optional aside, in the order a reader scans them."
      aside={<Badge variant="outline">aside slot</Badge>}
    />
  ),
  Hero: (
    <Hero
      eyebrow="Hero"
      title="Ship the framework, not the scaffold"
      lede="The first screen of a marketing page: copy left, artifact right, and no decorative layer behind either."
      primary={
        <Button size="lg">
          Get started
          <ArrowRight aria-hidden="true" />
        </Button>
      }
      secondary={
        <Button size="lg" variant="outline">
          Read the docs
        </Button>
      }
      artifact={<CodeBlock filename="terminal" code={CLONE_COMMAND} />}
      trust={<LogoStrip items={STACK_LOGOS} />}
    />
  ),
  PageHeader: (
    <PageHeader
      eyebrow="Page header"
      title="An app or info page starts here"
      description="The title block of a secondary page — a full-bleed band, not a box centred on the canvas."
    />
  ),
  CtaBand: (
    <CtaBand
      tone="inverse"
      title="The closing ask"
      description="Full-bleed, copy left, actions right. This specimen uses the inverse tone; the page you are reading ends on the brand tone."
      actions={
        <Button variant="secondary" size="lg">
          Start a project
        </Button>
      }
    />
  ),
  FeatureCard: (
    <div className="container-page grid gap-4 py-8 md:grid-cols-2">
      <FeatureCard
        icon={<Rocket aria-hidden="true" />}
        title="Type-safe from edge to database"
        description="One capability per card. The hover is a border and a shadow, never a fill."
        href="/about"
      />
      <FeatureCard
        icon={<Database aria-hidden="true" />}
        title="Auth you can delete"
        description="Each provider sits behind a flag, so removing a method removes its code too."
      />
    </div>
  ),
  IconTile: (
    <div className="container-page flex flex-wrap items-center gap-6 py-8">
      <IconTile size="sm">
        <Copy aria-hidden="true" />
      </IconTile>
      <IconTile>
        <Database aria-hidden="true" />
      </IconTile>
      <IconTile tone="brand" size="lg">
        <ShieldCheck aria-hidden="true" />
      </IconTile>
      <p className="text-foreground-muted max-w-xs text-body-sm">
        Muted by default; <code>tone="brand"</code> at most once per page.
      </p>
    </div>
  ),
  CodeBlock: (
    <div className="container-page py-8">
      <CodeBlock filename="app/globals.css" code={TOKEN_SNIPPET} />
    </div>
  ),
  LogoStrip: (
    <div className="container-page py-8">
      <LogoStrip items={STACK_LOGOS} />
    </div>
  ),
};

function PatternsSection() {
  return (
    <Section id="patterns">
      <SectionHeading
        eyebrow="Step 4 — compose a page"
        title="Nine recipes, and the sentence that says when"
        description={
          <>
            A recipe is the only place a layout decision is made once. Extend
            one with <code>className</code>; never fork a copy into a route.
          </>
        }
      />

      <div className="space-y-8">
        {PATTERNS.map((pattern) => {
          const specimen = SPECIMENS[pattern.name];
          return (
            <article key={pattern.name} className="box overflow-hidden">
              <header className="bg-background-subtle border-border border-b px-5 py-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-h5 text-foreground font-semibold">
                    {pattern.name}
                  </h3>
                  <p className="text-foreground-muted font-mono text-body-xs">
                    app/components/patterns/{pattern.file}
                  </p>
                </div>
                <p className="text-foreground-muted mt-2 max-w-3xl text-body-sm">
                  {pattern.useWhen}
                </p>
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                  {pattern.props.map((prop) => (
                    <li
                      key={prop}
                      className="text-foreground font-mono text-body-xs"
                    >
                      {prop}
                    </li>
                  ))}
                </ul>
              </header>
              {specimen ?? (
                <p className="p-5">
                  <Badge variant="destructive">
                    {pattern.name} has no specimen on this page
                  </Badge>
                </p>
              )}
            </article>
          );
        })}
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------- states */

function StatesSection() {
  return (
    <Section id="states" tone="raised">
      <SectionHeading
        eyebrow="Step 5 — paint the state"
        title="Every state is a token, not an opacity"
        description="Hover, focus, press and disabled each name a step on a ramp. Nothing here dims the whole control to suggest it changed."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {STATES.map((state) => (
          <div key={state.name} className="box p-4">
            <ThemePair>
              {() => (
                <div
                  data-state={state.name.toLowerCase()}
                  className={cn(
                    "flex h-14 items-center justify-center rounded-md text-body-sm font-medium",
                    state.classes,
                  )}
                >
                  {state.name}
                </div>
              )}
            </ThemePair>
            <p className="text-foreground-muted mt-3 font-mono text-body-xs">
              {state.classes}
            </p>
            <p className="text-foreground-muted mt-1 text-body-xs">
              {state.note}
            </p>
          </div>
        ))}
      </div>

      <div className="box mt-6 p-5">
        <h3 className="text-h5 mb-2 font-semibold">
          Focus-visible, on the real control
        </h3>
        <p className="text-foreground-muted mb-4 text-body-sm">
          Tab to the button. The ring is <code>border-ring</code> plus{" "}
          <code>ring-[3px] ring-ring/50</code>, exactly as upstream ships it.
          Phase 6 paints the <code>--ring-offset</code> gap that separates the
          ring from a brand-filled control — today the two measure 1.00:1
          against each other.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Button>Tab to me</Button>
          <Button variant="outline">Outline</Button>
          <a
            href="#patterns"
            className="text-link underline-offset-4 hover:underline"
          >
            and a link
          </a>
        </div>
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------------- components */

function ComponentsSection() {
  return (
    <Section id="components">
      <SectionHeading
        eyebrow="Step 6 — reach for a primitive"
        title="shadcn/ui, vendored and untouched"
        description={
          <>
            <code>app/components/ui/**</code> is upstream. Wrap it, never edit
            it; the deviations that exist are listed in <code>PATCHES.md</code>{" "}
            and re-checked by <code>npm run ds:drift</code>.
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="box p-5">
          <h3 className="text-h5 mb-4 font-semibold">Button variants</h3>
          <div className="flex flex-wrap items-center gap-3">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            {/* Not `variant="link"`: upstream maps brand-as-text onto `--primary`,
                which is a fill and stays brand-600 in dark — under the 4.5:1 text
                floor, so this row would render a pair the contract forbids. */}
            <a
              href="#colors"
              className="text-link text-body underline-offset-4 hover:underline"
            >
              Brand text
            </a>
          </div>
          <p className="text-foreground-muted mt-4 text-body-sm">
            Brand as <em>text</em> is <code>text-link</code>, never{" "}
            <code>text-primary</code>: <code>--primary</code> is a fill and
            keeps brand-600 in dark mode, while <code>--link</code> steps to
            brand-400.
          </p>
          <Separator className="my-5" />
          <h3 className="text-h5 mb-4 font-semibold">Badges</h3>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>default</Badge>
            <Badge variant="secondary">secondary</Badge>
            <Badge variant="outline">outline</Badge>
            <Badge variant="destructive">destructive</Badge>
          </div>
        </div>

        <div className="box p-5">
          <h3 className="text-h5 mb-4 font-semibold">Status families</h3>
          <div className="space-y-3">
            {STATUS_SPECIMENS.map((status) => (
              <div
                key={status.name}
                className={cn(
                  "flex items-center gap-3 rounded-lg border p-3",
                  status.panel,
                )}
              >
                <status.icon aria-hidden="true" className="size-4 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-body-sm font-medium">{status.name}</p>
                  <p className="text-body-xs">{status.meaning}</p>
                </div>
              </div>
            ))}
            <div className="flex flex-wrap gap-2 pt-1">
              {STATUS_SPECIMENS.map((status) => (
                <div
                  key={status.name}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-body-xs font-medium",
                    status.solid,
                  )}
                >
                  {status.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="box p-5">
          <h3 className="text-h5 mb-4 font-semibold">Selection</h3>
          <Card className="border-primary bg-accent text-accent-foreground">
            <CardHeader>
              <CardTitle>Selected row</CardTitle>
              <CardDescription className="text-accent-foreground">
                border-primary + bg-accent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-accent-foreground text-body-sm">
                Selection is a neutral fill with a brand edge — never a tinted
                brand surface.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="box p-5">
          <h3 className="text-h5 mb-4 font-semibold">
            Feedback, loading and empty
          </h3>
          <Alert>
            <CircleCheck aria-hidden="true" />
            <AlertTitle>Deployed to production</AlertTitle>
            <AlertDescription>
              Upstream&apos;s default alert is neutral: the meaning is in the
              copy, not a tint.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive" className="mt-4">
            <TriangleAlert aria-hidden="true" />
            <AlertTitle>Upload rejected</AlertTitle>
            <AlertDescription>
              12 MB exceeds the 8 MB cap this release enforces.
            </AlertDescription>
          </Alert>
          <Skeleton className="mt-4 h-10 w-full rounded-md" />
          <Skeleton className="mt-2 h-4 w-2/3 rounded-md" />
        </div>

        <div className="box p-5">
          <h3 className="text-h5 mb-4 font-semibold">Form controls</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ds-email">Work email</Label>
              <Input id="ds-email" type="email" placeholder="you@company.com" />
              <p className="text-foreground-subtle text-body-xs">
                A caption on a card: the subtle step is legal here, not on the
                page canvas.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ds-invalid" className="text-destructive">
                Project name
              </Label>
              <Input id="ds-invalid" defaultValue="" aria-invalid />
              <p className="text-destructive-on-subtle text-body-xs">
                <CircleX
                  aria-hidden="true"
                  className="mr-1 inline size-3 align-text-bottom"
                />
                aria-invalid paints the border-destructive ring.
              </p>
            </div>
          </div>
        </div>

        <div className="box p-5">
          <h3 className="text-h5 mb-4 font-semibold">Brand as punctuation</h3>
          <div className="flex flex-wrap items-center gap-4">
            <IconTile tone="brand" size="md">
              <Rocket aria-hidden="true" />
            </IconTile>
            <IconTile tone="muted" size="md">
              <Database aria-hidden="true" />
            </IconTile>
            <Badge className="bg-primary-subtle text-primary-on-subtle">
              <CircleCheck aria-hidden="true" />
              Soft brand badge
            </Badge>
            <span className="text-link text-body-sm underline underline-offset-4">
              Inline link
            </span>
          </div>
          <p className="text-foreground-muted mt-4 text-body-sm">
            One solid brand tile per page, one full-bleed band, and everything
            else is a glyph, a link or a ring. Under 10% of the viewport.
          </p>
        </div>
      </div>
    </Section>
  );
}

/* --------------------------------------------------------------------- rules */

function RulesSection() {
  return (
    <Section id="rules" tone="sunken">
      <SectionHeading
        eyebrow="The contract, in one screen each"
        title="Do, don't, and what CI enforces"
        description={
          <>
            These two lists are <code>AGENTS.md</code> rules 1–8 and{" "}
            <code>DESIGN.md</code> rendered as prose. If a rule changes, all
            three change together.
          </>
        }
      />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="box p-6">
          <h3 className="text-h4 mb-4 flex items-center gap-2 font-semibold">
            <CircleCheck aria-hidden="true" className="size-5 text-link" />
            Do
          </h3>
          <ul className="text-foreground-muted space-y-2 text-body-sm">
            <li>
              Build pages from <code>app/components/patterns/*</code> — the nine
              recipes above.
            </li>
            <li>
              Take colour from semantic tokens only: <code>bg-card</code>,{" "}
              <code>text-foreground-muted</code>, <code>bg-success-subtle</code>
              .
            </li>
            <li>
              Slightly darker than the page? <code>bg-background-subtle</code>{" "}
              static, <code>bg-accent</code> for hover and selected.
            </li>
            <li>
              A panel on the page?{" "}
              <code>bg-card border border-border shadow-card</code>.
            </li>
            <li>
              Type by role: <code>text-display</code>, <code>text-h2</code>,{" "}
              <code>text-body-lg</code>.
            </li>
            <li>
              Test every change in both themes — <code>npm run check:ds</code>{" "}
              does too.
            </li>
          </ul>
        </div>
        <div className="box p-6">
          <h3 className="text-h4 mb-4 flex items-center gap-2 font-semibold">
            <CircleX aria-hidden="true" className="size-5 text-destructive" />
            Don&apos;t
          </h3>
          <ul className="text-foreground-muted space-y-2 text-body-sm">
            <li>
              A brand or status colour at low alpha as a surface fill (
              <code>{BANNED_SURFACE_FILL}</code>)
            </li>
            <li>
              <code>opacity</code> on a colour utility to fake a tint
            </li>
            <li>A boxed CTA floating in whitespace — use CtaBand</li>
            <li>Decorative blur blobs, or a second brand hue</li>
            <li>Hardcoded hex values and arbitrary font sizes</li>
            <li>
              Editing <code>app/components/ui/**</code> — wrap it, and log any
              deviation in <code>PATCHES.md</code>
            </li>
          </ul>
        </div>
      </div>
      <div className="box mt-6 p-6">
        <h3 className="text-h4 mb-3 flex items-center gap-2 font-semibold">
          <ListChecks aria-hidden="true" className="size-5 text-link" />
          What the guardrails check
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h4 className="text-foreground mb-2 text-body font-semibold">
              <code>npm run check:ds</code> — 9 rules
            </h4>
            <ul className="text-foreground-muted space-y-1 text-body-sm">
              <li>Every documented token exists in both themes</li>
              <li>
                No <code>@theme</code> self-reference
              </li>
              <li>
                Every <code>@theme</code> variable resolves
              </li>
              <li>
                No legacy <code>theme-*</code> utility
              </li>
              <li>The built CSS contains the documented vocabulary</li>
              <li>No brand or status colour at an alpha as a surface</li>
              <li>No decorative blur blobs</li>
              <li>
                No <code>@utility</code> that sets <code>opacity</code>
              </li>
              <li>Every pattern recipe is rendered here</li>
            </ul>
          </div>
          <div>
            <h4 className="text-foreground mb-2 text-body font-semibold">
              <code>npm test</code> — the same contract as numbers
            </h4>
            <ul className="text-foreground-muted space-y-1 text-body-sm">
              <li>
                {CONTRAST_PAIRS.length} contrast pairs per theme, WCAG 2.2 maths
                shared with this page
              </li>
              <li>
                Key parity between <code>:root</code> and <code>.dark</code>
              </li>
              <li>
                Every semantic value is a primitive reference or a literal; no
                hex anywhere else
              </li>
              <li>
                The manifest states each pair once, in one direction, with the
                floor its kind implies
              </li>
            </ul>
          </div>
        </div>
        <p className="text-foreground-muted mt-4 flex items-start gap-2 text-body-sm">
          <LoaderCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {/* One span, or every `<code>` in the sentence becomes its own flex item
              and the paragraph breaks into columns. */}
          <span>
            Rules 10–13 — duplicate step, unreferenced token,{" "}
            <code>color-scheme</code>, the focus chain — land with phase 6 in
            the same commit as the values that satisfy them. A check never ships
            pre-waived (decision D15).
          </span>
        </p>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------- helpers */

type Theme = "light" | "dark";

function ThemePair({ children }: { children: (theme: Theme) => ReactNode }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {(["light", "dark"] as const).map((theme) => (
        <div
          key={theme}
          className={cn("border-border box overflow-hidden", theme)}
        >
          <div className="border-border bg-background-subtle text-foreground-muted border-b px-3 py-1 text-eyebrow uppercase">
            {theme}
          </div>
          <div className="bg-background p-3">{children(theme)}</div>
        </div>
      ))}
    </div>
  );
}

type RatioMap = Record<string, { light: number; dark: number }>;

const pairKey = (pair: ContrastPair) =>
  `${pair.foreground} on ${pair.background}`;

/**
 * Measure the manifest in the browser rather than trusting a build-time number:
 * two off-screen probes, one inside a `.dark` subtree, resolve every custom
 * property exactly as the shipped stylesheet does. Nothing renders until the
 * measurement lands, so the page cannot show a ratio CI disagrees with.
 */
function useContrastRatios(): RatioMap | null {
  const [ratios, setRatios] = useState<RatioMap | null>(null);

  useEffect(() => {
    const holder = document.createElement("div");
    holder.setAttribute("aria-hidden", "true");
    holder.className =
      "pointer-events-none fixed top-0 -left-[9999px] h-0 w-0 overflow-hidden";
    const light = document.createElement("div");
    const dark = document.createElement("div");
    // A bare div would inherit whichever theme the page is in, and both columns would measure it.
    light.className = "light";
    dark.className = "dark";
    // `appendChild`, not `append`: wrangler's types merge a Workers `Element.append(content)` over the DOM one.
    holder.appendChild(light);
    holder.appendChild(dark);
    document.body.appendChild(holder);

    const measured: RatioMap = {};
    for (const pair of CONTRAST_PAIRS) {
      measured[pairKey(pair)] = {
        light: measuredRatio(pair.foreground, pair.background, light),
        dark: measuredRatio(pair.foreground, pair.background, dark),
      };
    }
    holder.remove();
    setRatios(measured);
  }, []);

  return ratios;
}

function measuredRatio(
  foreground: string,
  background: string,
  probe: HTMLElement,
): number {
  const styles = getComputedStyle(probe);
  const fg = parseColor(styles.getPropertyValue(`--${foreground}`));
  const bg = parseColor(styles.getPropertyValue(`--${background}`));
  if (!fg || !bg) return Number.NaN;
  return contrastRatio(fg, bg);
}

function Verdict({
  pair,
  ratios,
}: {
  pair: ContrastPair;
  ratios: RatioMap | null;
}) {
  if (!ratios) {
    return (
      <span className="text-foreground-subtle text-body-xs">measuring…</span>
    );
  }
  const entry = ratios[pairKey(pair)];
  if (!entry || Number.isNaN(entry.light) || Number.isNaN(entry.dark)) {
    return <Badge variant="destructive">unmeasured</Badge>;
  }
  const worst = Math.min(entry.light, entry.dark);
  const passes = worst >= pair.minimum;
  const weakest = entry.light <= entry.dark ? "light" : "dark";
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <Badge variant={passes ? "secondary" : "destructive"}>
        {passes ? "pass" : "fail"}
      </Badge>
      <span className="text-foreground text-body-xs tabular-nums">
        light {formatRatio(entry.light)}
      </span>
      <span className="text-foreground text-body-xs tabular-nums">
        dark {formatRatio(entry.dark)}
      </span>
      <span
        title={`worst theme: ${weakest}`}
        className="text-foreground-subtle text-body-xs"
      >
        min {formatRatio(worst)}
      </span>
    </div>
  );
}
