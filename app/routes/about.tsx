import { Link } from "react-router";
import { CtaBand } from "~/components/patterns/CtaBand";
import { LogoStrip } from "~/components/patterns/LogoStrip";
import { PageHeader } from "~/components/patterns/PageHeader";
import { Section } from "~/components/patterns/Section";
import { SectionHeading } from "~/components/patterns/SectionHeading";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

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

const PRINCIPLES = [
  {
    number: "01",
    title: "Tokens before components",
    description:
      "No hex lives outside :root. Every colour a component consumes is an intent name, so a theme is a remap and never a repaint.",
  },
  {
    number: "02",
    title: "Upstream over fork",
    description:
      "shadcn components are re-vendored pristine from a pinned release; local deviations are listed in one patch file instead of drifting silently.",
  },
  {
    number: "03",
    title: "Boring in public",
    description:
      "Guards, upload limits, rate limits and error paths ship in the starter, because a demo teaches exactly what it omits.",
  },
];

const STACK = [
  {
    name: "React Router 8",
    role: "Framework",
    why: "SSR, file routes and middleware without owning a server framework.",
  },
  {
    name: "Supabase",
    role: "Backend",
    why: "Postgres, auth and storage behind one typed client.",
  },
  {
    name: "Tailwind CSS v4",
    role: "Styling",
    why: "Tokens compile to utilities; no runtime CSS-in-JS to ship.",
  },
  {
    name: "shadcn + Radix",
    role: "Components",
    why: "Accessible primitives whose source the project owns.",
  },
  {
    name: "Cloudflare Workers",
    role: "Runtime",
    why: "Edge deploy with cron, secrets and R2 bindings typed.",
  },
  {
    name: "TypeScript",
    role: "Language",
    why: "Loaders, env bindings and tokens checked end to end.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="A starter that stays maintainable after the demo"
        description="The first week of every Supabase + React Router project is spent re-making the same decisions: session handling, upload limits, token names, focus rings. This repo makes them once."
      />

      <Section size="sm">
        <div className="max-w-3xl space-y-4 text-body-lg text-foreground-muted">
          <p>
            It is an opinionated, production-shaped starter: the patterns in
            here are the ones we would copy into a client repo, wired together
            so that auth, storage, deployment and the design system agree with
            each other out of the box.
          </p>
          <p>
            It is not a platform. There is no CMS, no billing, no lock-in —
            delete the routes you don&apos;t need and the spine (tokens,
            middleware, guards) stays coherent without them.
          </p>
        </div>
      </Section>

      <Section tone="sunken" size="md">
        <SectionHeading
          eyebrow="Principles"
          title="Three rules the codebase refuses to break"
        />
        <ol className="grid gap-10 md:grid-cols-3">
          {PRINCIPLES.map((principle) => (
            <li key={principle.number}>
              <span className="text-eyebrow text-foreground-muted">
                {principle.number}
              </span>
              <h3 className="mt-2 text-h4 font-semibold">{principle.title}</h3>
              <p className="mt-2 text-body text-foreground-muted">
                {principle.description}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section size="md">
        <SectionHeading
          eyebrow="Stack"
          title="Six dependencies carrying the whole framework"
          description="Each slot holds the least surprising option, chosen for its upgrade path rather than its novelty."
        />
        <LogoStrip
          className="mb-8"
          items={STACK.map((entry) => ({ label: entry.name }))}
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Why it is here</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {STACK.map((entry) => (
              <TableRow key={entry.name}>
                <TableCell className="font-medium">{entry.name}</TableCell>
                <TableCell className="text-foreground-muted">
                  {entry.role}
                </TableCell>
                <TableCell className="text-foreground-muted">
                  {entry.why}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>

      <CtaBand
        tone="inverse"
        title="Read the docs, then make it yours"
        description="Every token and component is documented on the design-system page; every decision behind them lives in the repo's plan folder."
        actions={
          <>
            <Button asChild>
              <Link to="/design-system">Explore the design system</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link to="/contact">Talk to us</Link>
            </Button>
          </>
        }
      />
    </>
  );
}
