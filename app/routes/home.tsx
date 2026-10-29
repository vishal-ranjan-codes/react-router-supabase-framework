import {
  Blocks,
  CheckCircle2,
  Cloud,
  Database,
  Palette,
  ShieldCheck,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router";
import { CodeBlock } from "~/components/patterns/CodeBlock";
import { CtaBand } from "~/components/patterns/CtaBand";
import { FeatureCard } from "~/components/patterns/FeatureCard";
import { Hero } from "~/components/patterns/Hero";
import { LogoStrip } from "~/components/patterns/LogoStrip";
import { Section } from "~/components/patterns/Section";
import { SectionHeading } from "~/components/patterns/SectionHeading";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

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

const QUICKSTART = `git clone https://github.com/vishal-ranjan-codes/react-router-supabase-framework
cd react-router-supabase-framework
npm install && npm run dev`;

const MIDDLEWARE = `// app/middleware/chains.ts
export const requireAuth: MiddlewareFunction<Response>[] = [
  supabaseMiddleware, // SSR session from http-only cookies
  authMiddleware, // redirect to /sign-in, no session
];

// a protected route opts in with one line
export const middleware = requireAuth;`;

const FEATURES: {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
}[] = [
  {
    icon: Zap,
    title: "Edge SSR by default",
    description:
      "React Router 8 loaders and actions run in a Cloudflare Worker near the user, streaming HTML from the edge.",
  },
  {
    icon: Database,
    title: "Supabase already wired",
    description:
      "Server and admin clients, cookie-backed sessions, and R2 helpers for capped uploads and signed downloads.",
  },
  {
    icon: Palette,
    title: "Token-driven theming",
    description:
      "Three tiers of design tokens; light and dark are remaps of one semantic layer, so a rebrand edits a single ramp.",
    href: "/design-system",
  },
  {
    icon: Blocks,
    title: "40+ shadcn/ui components",
    description:
      "Re-vendored from upstream 4.23.0 and kept pristine, so upgrades are a no-op and deviations stay documented.",
  },
  {
    icon: ShieldCheck,
    title: "Guards as middleware",
    description:
      "requireAuth and requireAdmin compose from small pieces and run before loaders, on pages and API routes alike.",
  },
  {
    icon: Cloud,
    title: "Workers-native deploy",
    description:
      "wrangler deploy ships the build with cron triggers, secrets and R2 bindings already typed end to end.",
  },
];

const PIPELINE = [
  "supabaseMiddleware hydrates an SSR session from http-only cookies on every request.",
  "requireAuth and requireAdmin are precomposed chains, so protection is one reviewable line per route.",
  "Uploads stream straight to R2 behind a 5 MB application limit, on top of the platform's own cap.",
];

export default function HomePage() {
  return (
    <>
      <Hero
        eyebrow="React Router 8 · Supabase · Cloudflare Workers"
        title="A full-stack starter that already made the boring decisions"
        lede="SSR on the edge, auth and storage wired to Supabase, and a design system built from tokens — clone it, rename it, ship it."
        primary={
          <Button size="lg" asChild>
            <Link to="/design-system">Explore the design system</Link>
          </Button>
        }
        secondary={
          <Button size="lg" variant="outline" asChild>
            <Link to="/about">Why this exists</Link>
          </Button>
        }
        artifact={<CodeBlock filename="terminal" code={QUICKSTART} />}
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={<feature.icon />}
              title={feature.title}
              description={feature.description}
              href={feature.href}
            />
          ))}
        </div>
      </Section>

      <Section tone="sunken" size="md">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              className="mb-6"
              eyebrow="Architecture"
              title="One request pipeline, every concern in its own middleware"
              description="Sessions, guards, CORS and rate limits compose as arrays, so the order a request flows through is readable in one file."
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
          <CodeBlock filename="app/middleware/chains.ts" code={MIDDLEWARE} />
        </div>
      </Section>

      <Section size="md">
        <SectionHeading
          eyebrow="Design system"
          title="Three tiers of tokens, one utility vocabulary"
          description="Primitives hold the hexes, semantics hold the intent, and the theme layer exposes exactly the classes components consume."
        />
        <div className="grid gap-6 md:grid-cols-3">
          <div className="box p-6">
            <p className="mb-4 text-eyebrow uppercase text-foreground-muted">
              Buttons
            </p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm">Default</Button>
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
          </div>
          <div className="box p-6">
            <p className="mb-4 text-eyebrow uppercase text-foreground-muted">
              Form controls
            </p>
            <div className="space-y-2">
              <Label htmlFor="specimen-email">Work email</Label>
              <Input id="specimen-email" placeholder="you@example.com" />
              <div className="flex gap-2 pt-1">
                <Badge>token</Badge>
                <Badge variant="secondary">remap</Badge>
                <Badge variant="outline">contrast</Badge>
              </div>
            </div>
          </div>
          <div className="box p-6">
            <p className="mb-4 text-eyebrow uppercase text-foreground-muted">
              Status
            </p>
            <Alert className="border-success-border bg-success-subtle text-success-on-subtle">
              <CheckCircle2 />
              <AlertTitle>Upload complete</AlertTitle>
              <AlertDescription>
                avatar.png is stored in R2 and signed for download.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </Section>

      <CtaBand
        tone="brand-deep"
        title="Clone it, rename it, deploy it before the coffee cools"
        description="One command to a running dev server; one more to the edge once .dev.vars points at your Supabase project."
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
