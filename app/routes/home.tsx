import {
  Activity,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  CloudUpload,
  Database,
  KeyRound,
  Lock,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";
import { Link } from "react-router";
import { CodeBlock } from "~/components/patterns/CodeBlock";
import { CtaBand } from "~/components/patterns/CtaBand";
import { Hero } from "~/components/patterns/Hero";
import { LogoStrip } from "~/components/patterns/LogoStrip";
import { Section } from "~/components/patterns/Section";
import { SectionHeading } from "~/components/patterns/SectionHeading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";

export function meta() {
  return [
    { title: "React Router + Supabase Framework" },
    {
      name: "description",
      content:
        "A production-shaped starter: SSR on Cloudflare Workers, Supabase auth and storage, and a three-tier design system.",
    },
  ];
}

const MIDDLEWARE = `// app/middleware/chains.ts
export const requireAuth: MiddlewareFunction<Response>[] = [
  supabaseMiddleware, // SSR session from http-only cookies
  authMiddleware, // redirect to /sign-in, no session
];

// a protected route opts in with one line
export const middleware = requireAuth;`;

const PIPELINE = [
  "supabaseMiddleware hydrates an SSR session from http-only cookies on every request.",
  "requireAuth and requireAdmin are precomposed chains, so protection is one reviewable line per route.",
  "Uploads stream straight to R2 behind a 5 MB application limit, on top of the platform's own cap.",
];

const TELEMETRY = [
  {
    value: "0ms",
    label: "Cold start",
    detail: "Workers V8 isolates eliminate server wake delays.",
  },
  {
    value: "100%",
    label: "Edge SSR",
    detail: "Loaders and streaming HTML execute at the edge.",
  },
  {
    value: "40+",
    label: "shadcn primitives",
    detail: "Re-vendored from upstream 4.23.0, kept pristine.",
  },
  {
    value: "165",
    label: "Semantic tokens",
    detail: "Light and dark are remaps of a single ramp.",
  },
];

const SPARKLINE_POINTS = "0,26 16,22 32,24 48,16 64,18 80,10 96,13 112,5";

const TOKEN_SWATCHES = [
  { name: "--primary", className: "bg-primary" },
  { name: "--primary-subtle", className: "bg-primary-subtle" },
  { name: "--accent", className: "bg-accent" },
  { name: "--border", className: "bg-border" },
];

const CHAINS_FLOW = [
  { step: "supabaseMiddleware", detail: "SSR session from http-only cookies" },
  { step: "requireAuth", detail: "redirect to /sign-in without a session" },
  { step: "rateLimit", detail: "per-IP budget before the loader runs" },
];

const FAQS = [
  {
    question:
      "How does edge SSR on Cloudflare Workers differ from traditional Node server hosting?",
    answer:
      "A Node server wakes a process per instance and idles between requests. A Worker is a V8 isolate that is already running in the datacenter nearest the user, so there is no cold-start penalty and no origin to round-trip to. React Router 8 loaders, actions, and streaming HTML all execute in that isolate, which is why the first byte lands in tens of milliseconds instead of hundreds.",
  },
  {
    question:
      "Can I deploy this starter to standard VPS, Docker, or AWS instead of Cloudflare?",
    answer:
      "Yes. React Router 8 ships adapters for Node, Bun, and most hosting targets. Swap the Cloudflare preset in react-router.config.ts for the Node adapter, replace the R2 binding with any S3-compatible client, and keep everything else — the middleware chains, Supabase session handling, and design system are runtime-agnostic.",
  },
  {
    question:
      "How does the three-tier design system make rebranding effortless?",
    answer:
      "Tier 1 holds the raw color ramps, Tier 2 maps them to semantic intent names like --primary and --success-subtle, and Tier 3 exposes exactly the utilities components consume. A rebrand edits one ramp in app/globals.css — or one preset in app/lib/theme-presets.ts — and every component follows, because no hex value lives anywhere else.",
  },
  {
    question: "How are database migrations and Supabase schemas synchronized?",
    answer:
      "Migrations live in supabase/migrations and are applied with the Supabase CLI against any linked project. The typed client is generated from the same schema, so a column that exists in Postgres exists in your loaders and actions with the right type — and one that does not fails at compile time, not in production.",
  },
  {
    question: "What makes this different from generic SaaS boilerplates?",
    answer:
      "The decisions are enforced, not suggested. Sixteen mechanical design-system rules reject raw hexes and alpha-tinted surfaces in CI, 460+ unit tests assert the token contract, and axe runs against every page in both themes. A boilerplate teaches you what it includes; this starter refuses to let the drift back in.",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero
        tone="brand-deep"
        eyebrow="React Router 8 · Supabase · Cloudflare Workers"
        title="The edge-first full-stack starter built for scale"
        lede="SSR on Cloudflare Workers, auth and storage wired to Supabase, and a three-tier design system — clone it, rename it, ship it."
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
            <Link to="/about">Why this exists</Link>
          </Button>
        }
        artifact={
          <div className="relative">
            <EdgeDashboardVisual />
            <div className="absolute -bottom-5 left-6 inline-flex items-center gap-1.5 rounded-full border border-success-border bg-success-subtle px-3 py-1 text-body-xs font-semibold text-success-on-subtle shadow-pop">
              <Check aria-hidden="true" className="size-3.5" />
              Supabase Auth Hydrated
            </div>
          </div>
        }
        trust={
          <LogoStrip
            items={[
              { label: "React Router 8" },
              { label: "Supabase" },
              { label: "Cloudflare Workers" },
              { label: "Tailwind CSS v4" },
            ]}
          />
        }
      />

      <Section tone="raised" size="sm">
        <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {TELEMETRY.map((metric) => (
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
          eyebrow="What's inside"
          title="Everything a first sprint usually spends itself on"
          description="Working patterns rather than a todo list with a README — delete what you don't need, keep the spine."
          aside={
            <Button variant="ghost" asChild>
              <Link to="/design-system">Browse the components</Link>
            </Button>
          }
        />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="box p-6">
            <TileHeading
              icon={Zap}
              title="Edge SSR & middleware pipeline"
              description="React Router 8 loaders run inside Workers isolates and stream HTML from the datacenter nearest the user — no origin round-trip, no process to keep warm."
            />
            <div className="mt-5 flex flex-wrap items-center gap-1.5 rounded-lg bg-background-subtle p-3">
              {[
                "Request",
                "Worker Isolate",
                "Session Hydrate",
                "Streamed HTML",
              ].map((node, index, nodes) => (
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
          </div>

          <div className="box p-6">
            <TileHeading
              icon={Database}
              title="Supabase auth & session hydration"
              description="Server and admin clients are preconfigured, sessions live in http-only cookies, and every loader can trust the user it receives."
            />
            <div className="mt-5 space-y-2.5 rounded-lg bg-background-subtle p-3">
              <div className="flex items-center gap-2.5">
                <CircleUserRound
                  aria-hidden="true"
                  className="size-8 text-foreground-muted"
                />
                <div className="min-w-0">
                  <p className="truncate font-mono text-body-xs text-foreground">
                    user@company.com
                  </p>
                  <span className="mt-0.5 inline-block rounded-full border border-label-indigo-border bg-label-indigo-subtle px-2 py-0.5 text-body-xs font-medium text-label-indigo-on-subtle">
                    Admin
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 font-mono text-body-xs text-foreground-muted">
                  <Lock aria-hidden="true" className="size-3" />
                  JWT · http-only cookie
                </span>
                <span className="inline-flex items-center gap-1 rounded-md border border-success-border bg-success-subtle px-2 py-1 font-mono text-body-xs font-semibold text-success-on-subtle">
                  <Check aria-hidden="true" className="size-3" />
                  requireAuth: PASS
                </span>
              </div>
            </div>
          </div>

          <div className="box p-6">
            <TileHeading
              icon={Sparkles}
              title="Three-tier token architecture"
              description="Zero hardcoded hexes. Primitives hold the ramps, semantics hold the intent, and light and dark are remaps of one layer."
              href="/design-system"
            />
            <div className="mt-5 rounded-lg bg-background-subtle p-3">
              <div className="grid grid-cols-4 gap-2">
                {TOKEN_SWATCHES.map((swatch) => (
                  <div key={swatch.name} className="min-w-0">
                    <div
                      aria-hidden="true"
                      className={cn(
                        "h-8 w-full rounded-md border border-border",
                        swatch.className,
                      )}
                    />
                    <p className="mt-1 truncate font-mono text-body-xs text-foreground-muted">
                      {swatch.name}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-3 font-mono text-body-xs text-foreground-muted">
                preset: tech-blue · 6 available
              </p>
            </div>
          </div>

          <div className="box p-6">
            <TileHeading
              icon={CloudUpload}
              title="Cloudflare R2 secure object storage"
              description="Uploads stream to R2 behind a 5 MB application cap, and downloads are signed, time-boxed URLs — never public buckets."
            />
            <div className="mt-5 space-y-3 rounded-lg bg-background-subtle p-3">
              <div className="flex items-center justify-center gap-2 rounded-md border border-dashed border-border-strong px-3 py-3 text-body-xs text-foreground-muted">
                <CloudUpload aria-hidden="true" className="size-4" />
                Drop files · 5 MB cap enforced in the action
              </div>
              <div>
                <div className="flex items-center justify-between text-body-xs">
                  <span className="font-mono text-foreground">
                    avatar-2026.webp
                  </span>
                  <span className="text-foreground-muted">2.1 / 5 MB</span>
                </div>
                <div
                  role="progressbar"
                  aria-valuenow={42}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Upload progress"
                  className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-border"
                >
                  <div className="h-full w-[42%] rounded-full bg-primary" />
                </div>
              </div>
              <p className="flex items-center gap-1.5 truncate font-mono text-body-xs text-foreground-muted">
                <KeyRound aria-hidden="true" className="size-3.5 shrink-0" />
                /r2/signed/a94f…e21c · expires in 60s
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="sunken" size="md">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              className="mb-6"
              eyebrow="Architecture"
              title="One request pipeline, every concern in its own middleware"
              description="Sessions, guards, CORS and rate limits compose as arrays in app/middleware/chains.ts, so the order a request flows through is readable in one file."
            />
            <ul className="space-y-3">
              {PIPELINE.map((line) => (
                <li key={line} className="flex gap-3 text-body">
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-foreground-muted"
                  />
                  <span className="text-foreground-muted">{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-6">
            <CodeBlock filename="app/middleware/chains.ts" code={MIDDLEWARE} />
            <ol className="box divide-y divide-border-subtle p-0">
              {CHAINS_FLOW.map((stage) => (
                <li
                  key={stage.step}
                  className="flex items-center justify-between gap-4 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-body-sm text-foreground">
                      {stage.step}
                    </p>
                    <p className="text-body-xs text-foreground-muted">
                      {stage.detail}
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-success-border bg-success-subtle px-2 py-0.5 text-body-xs font-semibold text-success-on-subtle">
                    <Check aria-hidden="true" className="size-3" />
                    pass
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      <Section tone="raised" size="md">
        <SectionHeading
          eyebrow="Design system"
          title="Complete primitives, six brand presets, one vocabulary"
          description="Every control ships working — focus rings, validation states, and the strict split between system status and content categories included."
          aside={
            <Button variant="ghost" asChild>
              <Link to="/design-system">Open the style guide</Link>
            </Button>
          }
        />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="box p-6">
            <p className="text-eyebrow uppercase text-foreground-muted">
              Buttons & actions
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm">Primary</Button>
              <Button size="sm" variant="secondary">
                Secondary
              </Button>
              <Button size="sm" variant="outline">
                Outline
              </Button>
              <Button size="sm" variant="ghost">
                Ghost
              </Button>
            </div>
            <p className="mt-4 text-body-xs text-foreground-muted">
              Every variant clears a 3:1 focus ring against its own fill and the
              canvas, in both themes and all six presets.
            </p>
          </div>

          <div className="box p-6">
            <p className="text-eyebrow uppercase text-foreground-muted">
              Form controls & validation
            </p>
            <div className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="specimen-search">Search tokens</Label>
                <div className="relative">
                  <Search
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-placeholder"
                  />
                  <Input
                    id="specimen-search"
                    className="bg-background-subtle pl-9"
                    placeholder="--primary…"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="specimen-email">Work email</Label>
                <Input
                  id="specimen-email"
                  type="email"
                  aria-invalid
                  aria-describedby="specimen-email-error"
                  defaultValue="you@example"
                />
                <p
                  id="specimen-email-error"
                  className="text-body-xs font-medium text-destructive"
                >
                  Enter a complete email address.
                </p>
              </div>
            </div>
          </div>

          <div className="box p-6">
            <p className="text-eyebrow uppercase text-foreground-muted">
              Status vs. category (rule 16)
            </p>
            <Alert className="mt-4 border-success-border bg-success-subtle text-success-on-subtle">
              <CheckCircle2 />
              <AlertTitle>Deploy succeeded</AlertTitle>
              <AlertDescription>
                Worker version 42 is live in 310 edge locations.
              </AlertDescription>
            </Alert>
            <div className="mt-4">
              <p className="text-body-xs text-foreground-muted">
                Non-semantic categories use the label families:
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full border border-label-violet-border bg-label-violet-subtle px-2.5 py-0.5 text-body-xs font-medium text-label-violet-on-subtle">
                  Engineering
                </span>
                <span className="inline-flex items-center rounded-full border border-label-teal-border bg-label-teal-subtle px-2.5 py-0.5 text-body-xs font-medium text-label-teal-on-subtle">
                  Runtime
                </span>
                <span className="inline-flex items-center rounded-full border border-label-orange-border bg-label-orange-subtle px-2.5 py-0.5 text-body-xs font-medium text-label-orange-on-subtle">
                  Storage
                </span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section size="md">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions developers ask before cloning"
          description="The short answers; the long ones live in DESIGN.md and the repo's plan folder."
        />
        <div className="max-w-3xl">
          <Accordion type="single" collapsible>
            {FAQS.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`}>
                <AccordionTrigger className="text-h5 font-medium hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-body text-foreground-muted">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>

      <CtaBand
        tone="inverse"
        title="Clone it, rename it, deploy it before the coffee cools"
        description="One command to a running edge dev server; one more to production once .dev.vars points at your Supabase project."
        actions={
          <>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/sign-up">Create an account</Link>
            </Button>
            <CodeBlock
              className="w-full lg:w-auto"
              filename="terminal"
              code="git clone https://github.com/vishal-ranjan-codes/react-router-supabase-framework.git"
            />
          </>
        }
      />
    </>
  );
}

function TileHeading({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: typeof Zap;
  title: string;
  description: string;
  href?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="inline-flex size-9 items-center justify-center rounded-md bg-background-subtle text-foreground-muted">
          <Icon aria-hidden="true" className="size-4" />
        </span>
        <h3 className="text-h4 font-semibold tracking-tight">
          {href ? (
            <Link
              to={href}
              className="text-link underline-offset-4 hover:text-link-hover hover:underline"
            >
              {title}
            </Link>
          ) : (
            title
          )}
        </h3>
      </div>
      <p className="mt-3 text-body-sm text-foreground-muted">{description}</p>
    </div>
  );
}

function EdgeDashboardVisual() {
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
            framework.dev/overview
          </span>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-success-border bg-success-subtle px-2 py-0.5 text-body-xs font-semibold text-success-on-subtle">
          <Activity aria-hidden="true" className="size-3" />
          Edge SSR · 12ms
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-lg border border-border-subtle bg-background-subtle p-3">
          <p className="text-body-xs text-foreground-muted">Active Sessions</p>
          <p className="mt-1 text-h4 font-semibold tabular-nums text-foreground">
            18,420
          </p>
          <span className="mt-1 inline-block rounded-full border border-success-border bg-success-subtle px-1.5 py-0.5 text-body-xs font-semibold text-success-on-subtle">
            +14.2%
          </span>
        </div>
        <div className="rounded-lg border border-border-subtle bg-background-subtle p-3">
          <p className="text-body-xs text-foreground-muted">R2 Bandwidth</p>
          <p className="mt-1 text-h4 font-semibold tabular-nums text-foreground">
            1.2 TB
          </p>
          <p className="mt-1 text-body-xs text-foreground-muted">
            5 MB cap per upload
          </p>
        </div>
        <div className="rounded-lg border border-border-subtle bg-background-subtle p-3">
          <p className="text-body-xs text-foreground-muted">TTFB</p>
          <p className="mt-1 text-h4 font-semibold tabular-nums text-foreground">
            14ms
          </p>
          <p className="mt-1 text-body-xs text-foreground-muted">
            p50 · global edge
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-border-subtle bg-background-subtle p-3">
        <div className="flex items-center justify-between">
          <p className="text-body-xs font-medium text-foreground-muted">
            Requests · last hour
          </p>
          <p className="font-mono text-body-xs tabular-nums text-foreground">
            2.4M
          </p>
        </div>
        <svg
          aria-hidden="true"
          viewBox="0 0 112 30"
          className="mt-2 h-12 w-full"
          fill="none"
          preserveAspectRatio="none"
        >
          <polyline
            points={SPARKLINE_POINTS}
            className="stroke-chart-1"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="mt-3 space-y-2 rounded-lg border border-border-subtle bg-background-subtle p-3">
        <p className="text-body-xs font-medium text-foreground-muted">
          Live activity
        </p>
        <div className="flex items-center justify-between gap-2">
          <p className="min-w-0 truncate font-mono text-body-xs text-foreground">
            session.hydrate · user@company.com
          </p>
          <span className="shrink-0 rounded-full border border-label-indigo-border bg-label-indigo-subtle px-2 py-0.5 text-body-xs font-medium text-label-indigo-on-subtle">
            Admin
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="min-w-0 truncate font-mono text-body-xs text-foreground">
            r2.download · avatar-2026.webp
          </p>
          <span className="shrink-0 rounded-full border border-border-subtle bg-card px-2 py-0.5 text-body-xs text-foreground-muted">
            Signed 60s
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="min-w-0 truncate font-mono text-body-xs text-foreground">
            loader · /api/metrics
          </p>
          <span className="shrink-0 font-mono text-body-xs font-semibold text-success-on-subtle">
            200 OK
          </span>
        </div>
      </div>
    </div>
  );
}
