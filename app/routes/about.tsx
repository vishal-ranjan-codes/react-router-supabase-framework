import {
  ArrowRight,
  Blocks,
  Braces,
  Check,
  ChevronRight,
  Cloud,
  Database,
  Layers,
  Lock,
  Route,
  ShieldCheck,
  Wind,
} from "lucide-react";
import { Link } from "react-router";
import { CtaBand } from "~/components/patterns/CtaBand";
import { Hero } from "~/components/patterns/Hero";
import { IconTile } from "~/components/patterns/IconTile";
import { Section } from "~/components/patterns/Section";
import { SectionHeading } from "~/components/patterns/SectionHeading";
import { Button } from "~/components/ui/button";

export function meta() {
  return [
    { title: "About | React Router + Supabase Framework" },
    {
      name: "description",
      content:
        "Why this starter exists, the principles it refuses to break, and the stack carrying it.",
    },
  ];
}

const QUALITY = [
  {
    value: "0",
    label: "Upstream drift",
    detail: "shadcn vendored pristine; deviations isolated in PATCHES.md.",
  },
  {
    value: "100%",
    label: "TypeScript strict",
    detail: "Loaders, actions, env bindings and tokens typed end to end.",
  },
  {
    value: "468",
    label: "Unit tests",
    detail: "Vitest asserts tokens, auth, middleware and upload limits.",
  },
  {
    value: "100%",
    label: "Axe a11y clean",
    detail: "Zero serious or critical violations in light and dark.",
  },
];

const LAYERS = [
  {
    index: "L4",
    path: "app/components/ui/",
    role: "Components",
    badge:
      "rounded-full border border-label-violet-border bg-label-violet-subtle px-2 py-0.5 text-body-xs font-medium text-label-violet-on-subtle",
    detail: "40+ pristine upstream shadcn primitives.",
  },
  {
    index: "L3",
    path: "app/lib/design-system.ts",
    role: "Tokens",
    badge:
      "rounded-full border border-label-indigo-border bg-label-indigo-subtle px-2 py-0.5 text-body-xs font-medium text-label-indigo-on-subtle",
    detail: "165 Tier-2 semantic tokens across 6 presets.",
  },
  {
    index: "L2",
    path: "app/middleware/chains.ts",
    role: "Pipeline",
    badge:
      "rounded-full border border-label-teal-border bg-label-teal-subtle px-2 py-0.5 text-body-xs font-medium text-label-teal-on-subtle",
    detail: "Edge request pipeline and auth guards.",
  },
  {
    index: "L1",
    path: "Cloudflare Workers + Supabase",
    role: "Runtime",
    badge:
      "rounded-full border border-label-orange-border bg-label-orange-subtle px-2 py-0.5 text-body-xs font-medium text-label-orange-on-subtle",
    detail: "Edge V8 runtime, Postgres and R2 storage.",
  },
];

const TOKEN_TIERS = ["--p-brand-600", "--primary", "<Button>"];

const GUARDS = ["requireAuth", "rateLimit", "uploadCap 5MB"];

const STACK = [
  {
    name: "React Router 8",
    role: "Framework",
    icon: Route,
    badge:
      "rounded-full border border-label-indigo-border bg-label-indigo-subtle px-2.5 py-0.5 text-body-xs font-medium text-label-indigo-on-subtle",
    why: "SSR, loaders, actions and middleware without owning a server framework.",
  },
  {
    name: "Supabase",
    role: "Backend",
    icon: Database,
    badge:
      "rounded-full border border-label-teal-border bg-label-teal-subtle px-2.5 py-0.5 text-body-xs font-medium text-label-teal-on-subtle",
    why: "Postgres, auth and storage behind one typed client.",
  },
  {
    name: "Cloudflare Workers",
    role: "Runtime",
    icon: Cloud,
    badge:
      "rounded-full border border-label-orange-border bg-label-orange-subtle px-2.5 py-0.5 text-body-xs font-medium text-label-orange-on-subtle",
    why: "Edge deploy with cron, secrets and R2 bindings typed end to end.",
  },
  {
    name: "Tailwind CSS v4",
    role: "Styling",
    icon: Wind,
    badge:
      "rounded-full border border-label-cyan-border bg-label-cyan-subtle px-2.5 py-0.5 text-body-xs font-medium text-label-cyan-on-subtle",
    why: "Tokens compile to utilities; zero runtime CSS-in-JS to ship.",
  },
  {
    name: "shadcn UI + Radix",
    role: "Components",
    icon: Blocks,
    badge:
      "rounded-full border border-label-violet-border bg-label-violet-subtle px-2.5 py-0.5 text-body-xs font-medium text-label-violet-on-subtle",
    why: "Accessible primitives whose source the project owns.",
  },
  {
    name: "TypeScript",
    role: "Language",
    icon: Braces,
    badge:
      "rounded-full border border-label-cool-gray-border bg-label-cool-gray-subtle px-2.5 py-0.5 text-body-xs font-medium text-label-cool-gray-on-subtle",
    why: "Strict end-to-end safety across loaders, actions and env.",
  },
];

const ROADMAP = [
  {
    phase: "Phase 1",
    title: "Design system foundation",
    detail:
      "165 semantic tokens, six presets, and the guardrails that keep them honest.",
  },
  {
    phase: "Phase 2",
    title: "Edge SSR & auth",
    detail:
      "Middleware chains, session hydration and capped R2 uploads on Workers.",
  },
  {
    phase: "Phase 3",
    title: "Showcase & brand switcher",
    detail:
      "The /design-system guide and live preset switching across every control.",
  },
  {
    phase: "Phase 4",
    title: "Public surfaces",
    detail: "Home, About and Contact rebuilt on the same token contract.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Hero
        tone="brand-deep"
        eyebrow="Engineering philosophy"
        title="A starter engineered to stay maintainable long after the demo"
        lede="The first week of every Supabase + React Router project is spent re-making the same decisions: session handling, upload limits, token names, focus rings. This repo makes them once, with uncompromising rigor."
        primary={
          <Button size="lg" variant="white" asChild>
            <Link to="/design-system">
              Explore the design system
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        }
        secondary={
          <Button size="lg" variant="white-outline" asChild>
            <a
              href="https://github.com/vishal-ranjan-codes/react-router-supabase-framework"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </Button>
        }
        artifact={
          <div className="relative">
            <FrameworkAnatomyVisual />
            <div className="absolute -bottom-5 left-6 inline-flex items-center gap-1.5 rounded-full border border-success-border bg-success-subtle px-3 py-1 text-body-xs font-semibold text-success-on-subtle shadow-pop">
              <ShieldCheck aria-hidden="true" className="size-3.5" />
              0 upstream drift
            </div>
          </div>
        }
      />

      <Section tone="raised" size="sm">
        <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {QUALITY.map((metric) => (
            <div key={metric.label}>
              <dt className="text-eyebrow uppercase text-foreground-muted">
                {metric.label}
              </dt>
              <dd className="mt-1 text-h1 font-semibold tracking-tight">
                {metric.value}
              </dd>
              <dd className="mt-1 text-body-sm text-foreground-muted">
                {metric.detail}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section size="md">
        <SectionHeading
          eyebrow="Principles"
          title="Three rules the codebase refuses to break"
          description="The decisions the starter makes once, so a fork never has to relitigate them."
        />
        <div className="grid gap-6 md:grid-cols-3">
          <div className="box p-6">
            <PrincipleHeading
              number="01"
              title="Tokens before components"
              description="No hex lives outside :root. Every colour a component consumes is an intent name, so a theme is a remap and never a repaint."
            />
            <div className="mt-5 rounded-lg bg-background-subtle p-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {TOKEN_TIERS.map((node, index, nodes) => (
                  <span key={node} className="flex items-center gap-1.5">
                    <span className="rounded-md border border-border bg-card px-2.5 py-1 font-mono text-body-xs text-foreground">
                      {node}
                    </span>
                    {index < nodes.length - 1 ? (
                      <ChevronRight
                        aria-hidden="true"
                        className="size-3.5 text-foreground-muted"
                      />
                    ) : null}
                  </span>
                ))}
              </div>
              <p className="mt-3 font-mono text-body-xs text-foreground-muted">
                tier 1 ramp → tier 2 intent → tier 3 utility
              </p>
            </div>
          </div>

          <div className="box p-6">
            <PrincipleHeading
              number="02"
              title="Upstream over fork"
              description="shadcn components are re-vendored pristine from a pinned release; local deviations are listed in one patch file instead of drifting silently."
            />
            <div className="mt-5 rounded-lg bg-background-subtle p-3">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-card text-foreground-muted">
                  <ShieldCheck aria-hidden="true" className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-mono text-body-xs text-foreground">
                    shadcn @ 4.23.0
                  </p>
                  <p className="text-body-xs text-foreground-muted">
                    re-vendored pristine
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2 rounded-md border border-border bg-card px-2.5 py-1.5">
                <span className="font-mono text-body-xs text-foreground-muted">
                  PATCHES.md
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-success-border bg-success-subtle px-2 py-0.5 text-body-xs font-semibold text-success-on-subtle">
                  <Check aria-hidden="true" className="size-3" />
                  0 local edits
                </span>
              </div>
            </div>
          </div>

          <div className="box p-6">
            <PrincipleHeading
              number="03"
              title="Boring in public"
              description="Guards, upload limits, rate limits and error paths ship in the starter, because a demo teaches exactly what it omits."
            />
            <div className="mt-5 rounded-lg bg-background-subtle p-3">
              <div className="flex flex-wrap gap-1.5">
                {GUARDS.map((guard) => (
                  <span
                    key={guard}
                    className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 font-mono text-body-xs text-foreground-muted"
                  >
                    <Lock aria-hidden="true" className="size-3" />
                    {guard}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-body-xs text-foreground-muted">
                  Wired before you clone
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-success-border bg-success-subtle px-2 py-0.5 text-body-xs font-semibold text-success-on-subtle">
                  <Check aria-hidden="true" className="size-3" />
                  active
                </span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="sunken" size="md">
        <SectionHeading
          eyebrow="Stack"
          title="Six dependencies carrying the whole framework"
          description="Each slot holds the least surprising option, chosen for its upgrade path rather than its novelty."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {STACK.map((entry) => {
            const Icon = entry.icon;
            return (
              <div key={entry.name} className="box p-5">
                <div className="flex items-start justify-between gap-3">
                  <IconTile size="sm" tone="muted">
                    <Icon aria-hidden="true" />
                  </IconTile>
                  <span className={entry.badge}>{entry.role}</span>
                </div>
                <h3 className="mt-4 text-h4 font-semibold tracking-tight">
                  {entry.name}
                </h3>
                <p className="mt-1.5 text-body-sm text-foreground-muted">
                  {entry.why}
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      <Section tone="raised" size="md">
        <SectionHeading
          eyebrow="Roadmap"
          title="How the codebase got here"
          description="Every phase landed with the guardrails that keep the next one honest — no phase was allowed to pre-waive a check."
        />
        <div className="relative">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-4 right-0 left-0 hidden h-px bg-border-subtle lg:block"
          />
          <ol className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {ROADMAP.map((phase) => (
              <li key={phase.phase}>
                <div className="flex items-center gap-3">
                  <span className="relative z-10 inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-success-border bg-success-subtle text-success-on-subtle">
                    <Check aria-hidden="true" className="size-4" />
                  </span>
                  <span className="text-eyebrow uppercase text-foreground-muted">
                    {phase.phase}
                  </span>
                </div>
                <h3 className="mt-4 text-h5 font-semibold">{phase.title}</h3>
                <p className="mt-1.5 text-body-sm text-foreground-muted">
                  {phase.detail}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <CtaBand
        tone="inverse"
        title="Read the docs, then make it yours"
        description="Every token and component is documented on the design-system page; every decision behind them lives in the repo's plan folder."
        actions={
          <>
            <Button size="lg" asChild>
              <Link to="/design-system">Explore the design system</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/contact">Talk to us</Link>
            </Button>
          </>
        }
      />
    </>
  );
}

function PrincipleHeading({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="inline-flex size-9 items-center justify-center rounded-md bg-background-subtle font-mono text-body-xs font-semibold text-foreground-muted">
          {number}
        </span>
        <h3 className="text-h4 font-semibold tracking-tight">{title}</h3>
      </div>
      <p className="mt-3 text-body-sm text-foreground-muted">{description}</p>
    </div>
  );
}

function FrameworkAnatomyVisual() {
  return (
    <div className="rounded-xl border border-border-on-brand bg-card p-4 shadow-2xl">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div aria-hidden="true" className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-label-pink-solid" />
            <span className="size-2.5 rounded-full bg-label-orange-solid" />
            <span className="size-2.5 rounded-full bg-label-lime-solid" />
          </div>
          <span className="rounded-full border border-border-on-brand px-2.5 py-0.5 font-mono text-body-xs text-primary-deep-foreground">
            framework · anatomy
          </span>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-border-subtle bg-background-subtle px-2 py-0.5 text-body-xs text-foreground-muted">
          <Layers aria-hidden="true" className="size-3" />
          4 layers
        </span>
      </div>

      <div className="mt-4 space-y-2">
        {LAYERS.map((layer) => (
          <div
            key={layer.index}
            className="rounded-lg border border-border-subtle bg-background-subtle p-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-md border border-border bg-card font-mono text-body-xs font-semibold text-foreground">
                  {layer.index}
                </span>
                <span className="truncate font-mono text-body-xs text-foreground">
                  {layer.path}
                </span>
              </div>
              <span className={`${layer.badge} shrink-0`}>{layer.role}</span>
            </div>
            <p className="mt-1.5 text-body-xs text-foreground-muted">
              {layer.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
