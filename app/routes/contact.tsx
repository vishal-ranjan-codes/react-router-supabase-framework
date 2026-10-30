import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Building2,
  Check,
  CheckCircle2,
  CircleAlert,
  Clock,
  Copy,
  Github,
  Globe,
  Inbox,
  Route,
  Send,
} from "lucide-react";
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link } from "react-router";
import { IconTile } from "~/components/patterns/IconTile";
import { PageHeader } from "~/components/patterns/PageHeader";
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
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";

export function meta() {
  return [
    { title: "Contact | React Router + Supabase Framework" },
    {
      name: "description",
      content:
        "Questions, fork advice and token naming arguments — how to reach the maintainers.",
    },
  ];
}

const EMAIL = "hello@framework.dev";
const REPO =
  "https://github.com/vishal-ranjan-codes/react-router-supabase-framework";
const MESSAGE_LIMIT = 600;

/**
 * Topic pills are content categories, so they draw on the label families;
 * every health/outcome signal on this page draws on the status families.
 * Rule 16 keeps the two apart, and the class strings below keep them on
 * separate source lines.
 */
const TOPICS = [
  {
    value: "technical",
    label: "Technical question",
    selected:
      "border-label-indigo-border bg-label-indigo-subtle text-label-indigo-on-subtle",
  },
  {
    value: "architecture",
    label: "Architecture / fork advice",
    selected:
      "border-label-teal-border bg-label-teal-subtle text-label-teal-on-subtle",
  },
  {
    value: "bug",
    label: "Bug report",
    selected:
      "border-label-orange-border bg-label-orange-subtle text-label-orange-on-subtle",
  },
  {
    value: "design",
    label: "Token / design system",
    selected:
      "border-label-violet-border bg-label-violet-subtle text-label-violet-on-subtle",
  },
] as const;

type Topic = (typeof TOPICS)[number]["value"];

type Fields = {
  topic: Topic | "";
  name: string;
  email: string;
  message: string;
};
type Errors = Partial<Record<keyof Fields, string>>;

const FIELD_ORDER = ["topic", "name", "email", "message"] as const;

const FIELD_LABELS: Record<keyof Fields, string> = {
  topic: "Topic",
  name: "Name",
  email: "Email",
  message: "Message",
};

function validate(fields: Fields): Errors {
  const errors: Errors = {};
  if (!fields.topic) {
    errors.topic =
      "Pick the closest topic so the message lands in the right inbox.";
  }
  if (fields.name.trim().length < 2) {
    errors.name = "Tell us who you are — at least two characters.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
    errors.email = "Enter a complete email address, like you@example.com.";
  }
  const message = fields.message.trim();
  if (message.length < 10) {
    errors.message = "A sentence or two helps us answer properly.";
  } else if (message.length > MESSAGE_LIMIT) {
    errors.message = `That is ${message.length - MESSAGE_LIMIT} characters over the ${MESSAGE_LIMIT} limit — trim it, or email ${EMAIL} directly.`;
  }
  return errors;
}

const REGIONS = [
  {
    name: "US",
    pill: "border-label-cyan-border bg-label-cyan-subtle text-label-cyan-on-subtle",
  },
  {
    name: "EU",
    pill: "border-label-indigo-border bg-label-indigo-subtle text-label-indigo-on-subtle",
  },
  {
    name: "APAC",
    pill: "border-label-teal-border bg-label-teal-subtle text-label-teal-on-subtle",
  },
];

const DISPATCH = [
  {
    term: "Response window",
    icon: Clock,
    detail: "Under 24 hours on weekdays, slower across a weekend.",
  },
  {
    term: "Routing",
    icon: Route,
    detail: "Triage in the inbox, then a reply thread or a GitHub issue.",
  },
];

type Channel = {
  title: string;
  icon: typeof Github;
  category: string;
  pill: string;
  description: string;
  cta: string;
  to?: string;
  href?: string;
  external?: boolean;
};

const CHANNELS: Channel[] = [
  {
    title: "GitHub issues & RFCs",
    icon: Github,
    category: "Community",
    pill: "border-label-cool-gray-border bg-label-cool-gray-subtle text-label-cool-gray-on-subtle",
    description:
      "Report a bug, propose a feature, or follow framework updates in the open where the answer stays findable.",
    cta: "Open the tracker",
    href: `${REPO}/issues`,
    external: true,
  },
  {
    title: "Design system guide",
    icon: BookOpen,
    category: "Documentation",
    pill: "border-label-violet-border bg-label-violet-subtle text-label-violet-on-subtle",
    description:
      "Every token, swatch, state and recipe — with the reasoning that picked each value.",
    cta: "Read the guide",
    to: "/design-system",
  },
  {
    title: "Architecture advisory",
    icon: Building2,
    category: "Enterprise",
    pill: "border-label-teal-border bg-label-teal-subtle text-label-teal-on-subtle",
    description:
      "Multi-tenant deploys on Workers, RLS shapes and migration strategy for apps past the demo.",
    cta: "Request a session",
    href: `mailto:${EMAIL}?subject=${encodeURIComponent(
      "Architecture advisory session",
    )}`,
  },
];

const CHANNEL_LINK =
  "mt-4 inline-flex items-center gap-1.5 text-body-sm font-medium text-link underline-offset-4 hover:text-link-hover hover:underline";

const FAQS = [
  {
    question:
      "Can I use this starter for commercial client projects without attribution?",
    answer:
      "Yes. The repository is MIT licensed: build a client product on it, ship it, charge for it, and keep your source private. The only obligation is that the license text travels with any copy of the starter itself — nothing is owed for what you build on top of it.",
  },
  {
    question: "How do I white-label the brand colours for my company?",
    answer:
      "Edit one ramp. Tier 1 in app/globals.css holds the raw steps and --p-brand-600 is the anchor the semantic layer derives from, so replacing it rebrands buttons, links, focus rings and chart series together. Six presets already ship in app/lib/theme-presets.ts — copy one, rename it, and scope it to any subtree with data-brand.",
  },
  {
    question:
      "What is the best way to disclose a potential security vulnerability?",
    answer:
      "Do not open a public issue. Email hello@framework.dev with the subject prefixed “Security”, and include the affected version, a reproduction, and the impact you believe it has. A maintainer will acknowledge it as soon as they see it, and the fix and the disclosure timing are agreed with you before anything is published.",
  },
  {
    question: "Do you accept community pull requests?",
    answer:
      "Yes. Open an issue first for anything that changes the token contract or the middleware chains, so the shape is agreed before the code is written; smaller fixes can go straight to a pull request. Every change runs the same gate the maintainers run — lint, typecheck, the unit suite, check:ds and axe in both themes.",
  },
];

export default function ContactPage() {
  const [fields, setFields] = useState<Fields>({
    topic: "",
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [attempt, setAttempt] = useState(0);
  const [sent, setSent] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  const update =
    (key: "name" | "email" | "message") =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFields((current) => ({ ...current, [key]: event.target.value }));
      setSent(false);
    };

  function chooseTopic(topic: Topic) {
    setFields((current) => ({ ...current, topic }));
    setSent(false);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = validate(fields);
    setErrors(next);
    setSent(Object.keys(next).length === 0);
    setAttempt((count) => count + 1);
  }

  // A failed submit with several broken fields is disorienting without a
  // summary to land on, so the summary takes focus instead of the first field.
  useEffect(() => {
    if (attempt === 0 || Object.keys(errors).length === 0) return;
    summaryRef.current?.focus();
  }, [attempt, errors]);

  const invalid = FIELD_ORDER.filter((key) => errors[key]);
  const topicLabel =
    TOPICS.find((topic) => topic.value === fields.topic)?.label ?? "Question";
  const messageLength = fields.message.trim().length;
  const remaining = MESSAGE_LIMIT - messageLength;

  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(
    `[${topicLabel}] from ${fields.name.trim() || "the website"}`,
  )}&body=${encodeURIComponent(fields.message)}`;

  return (
    <>
      <PageHeader
        tone="raised"
        className="border-t-0"
        eyebrow="Contact & support"
        title="Talk to the people who maintain it"
        description="Bug report, fork question, or “why is this token named that?” — we're here to help you ship."
        aside={
          <p className="inline-flex flex-wrap items-center gap-2 rounded-full border border-success-border bg-success-subtle px-3 py-1.5 text-body-xs font-semibold text-success-on-subtle">
            <span
              aria-hidden="true"
              className="size-1.5 shrink-0 rounded-full bg-success"
            />
            Maintainers online · async by default · first reply under 24h
          </p>
        }
      />

      <Section size="md">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div className="box p-6 md:p-8">
            <h2 className="text-h3 font-semibold tracking-tight">
              Send a message
            </h2>
            <p className="mt-2 text-body text-foreground-muted">
              The form validates in your browser, then hands the message to your
              mail client — there is deliberately no backend behind it, so all
              four fields are required.
            </p>

            {invalid.length > 0 ? (
              <div
                ref={summaryRef}
                role="alert"
                tabIndex={-1}
                className="mt-6 rounded-lg border border-destructive-border bg-destructive-subtle p-4 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ring-offset"
              >
                <div className="flex items-start gap-2.5">
                  <CircleAlert
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-destructive-on-subtle"
                  />
                  <div className="min-w-0">
                    <h3 className="text-body-sm font-semibold text-destructive-on-subtle">
                      {invalid.length === 1
                        ? "One field needs attention"
                        : `${invalid.length} fields need attention`}
                    </h3>
                    <ul className="mt-2 space-y-1">
                      {invalid.map((key) => (
                        <li key={key} className="text-body-sm">
                          <a
                            href={`#contact-${key}`}
                            className="text-destructive-on-subtle underline underline-offset-4 hover:text-destructive"
                          >
                            {FIELD_LABELS[key]}: {errors[key]}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : null}

            {sent ? (
              <Alert className="mt-6 border-success-border bg-success-subtle text-success-on-subtle">
                <CheckCircle2 />
                <AlertTitle className="text-success-on-subtle">
                  Message ready
                </AlertTitle>
                <AlertDescription className="text-success-on-subtle">
                  <p>
                    Everything checks out. Send it from your own mail client —
                    nothing is posted to a server, so the draft never leaves
                    your machine.
                  </p>
                  <Button asChild size="sm">
                    <a href={mailto}>
                      Open in your mail app
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </a>
                  </Button>
                </AlertDescription>
              </Alert>
            ) : null}

            <form className="mt-7 space-y-6" noValidate onSubmit={onSubmit}>
              <fieldset id="contact-topic" className="space-y-2.5">
                <legend className="text-body-sm font-medium text-foreground">
                  What is this about?
                </legend>
                <div className="flex flex-wrap gap-2">
                  {TOPICS.map((topic) => {
                    const active = fields.topic === topic.value;
                    return (
                      <label key={topic.value} className="relative inline-flex">
                        <input
                          type="radio"
                          name="contact-topic"
                          value={topic.value}
                          checked={active}
                          required
                          onChange={() => chooseTopic(topic.value)}
                          aria-describedby={
                            errors.topic ? "contact-topic-error" : undefined
                          }
                          className="peer sr-only"
                        />
                        <span
                          className={cn(
                            "inline-flex min-h-11 cursor-pointer items-center rounded-full border px-3.5 text-body-sm font-medium transition-colors",
                            "peer-focus-visible:border-ring peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/50 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-ring-offset",
                            active
                              ? topic.selected
                              : "border-border bg-card text-foreground-muted hover:bg-accent hover:text-accent-foreground",
                          )}
                        >
                          {topic.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {errors.topic ? (
                  <p
                    id="contact-topic-error"
                    className="text-body-sm text-destructive"
                  >
                    {errors.topic}
                  </p>
                ) : null}
              </fieldset>

              <div className="space-y-2">
                <Label htmlFor="contact-name">Name</Label>
                <Input
                  id="contact-name"
                  required
                  autoComplete="name"
                  value={fields.name}
                  onChange={update("name")}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={
                    errors.name ? "contact-name-error" : undefined
                  }
                  placeholder="Ada Lovelace"
                />
                {errors.name ? (
                  <p
                    id="contact-name-error"
                    className="text-body-sm text-destructive"
                  >
                    {errors.name}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-email">Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={fields.email}
                  onChange={update("email")}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email
                      ? "contact-email-error contact-email-hint"
                      : "contact-email-hint"
                  }
                  placeholder="you@example.com"
                />
                {errors.email ? (
                  <p
                    id="contact-email-error"
                    className="text-body-sm text-destructive"
                  >
                    {errors.email}
                  </p>
                ) : null}
                <p
                  id="contact-email-hint"
                  className="text-body-xs text-foreground-muted"
                >
                  The reply goes straight here. The address is never stored.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-message">Message</Label>
                <Textarea
                  id="contact-message"
                  rows={5}
                  required
                  value={fields.message}
                  onChange={update("message")}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={
                    errors.message
                      ? "contact-message-error contact-message-count"
                      : "contact-message-count"
                  }
                  placeholder="What are you building, and where did the framework surprise you?"
                />
                {errors.message ? (
                  <p
                    id="contact-message-error"
                    className="text-body-sm text-destructive"
                  >
                    {errors.message}
                  </p>
                ) : null}
                <p
                  id="contact-message-count"
                  className={cn(
                    "text-body-xs tabular-nums",
                    remaining < 0
                      ? "font-medium text-destructive"
                      : "text-foreground-muted",
                  )}
                >
                  {remaining < 0
                    ? `${-remaining} characters over the ${MESSAGE_LIMIT} limit`
                    : `${messageLength} / ${MESSAGE_LIMIT} characters`}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Button type="submit" size="lg">
                  Send message
                  <Send aria-hidden="true" className="size-4" />
                </Button>
                <p className="text-body-xs text-foreground-muted">
                  Opens your mail client with the draft written.
                </p>
              </div>
            </form>
          </div>

          <DispatchCard />
        </div>
      </Section>

      <Section tone="sunken" size="md">
        <SectionHeading
          eyebrow="Other channels"
          title="Three routes that answer faster than email"
          description="Pick the one that matches the question — each lands somewhere the answer stays written down."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {CHANNELS.map((channel) => {
            const Icon = channel.icon;
            return (
              <div key={channel.title} className="box flex flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <IconTile size="sm" tone="muted">
                    <Icon aria-hidden="true" />
                  </IconTile>
                  <span
                    className={cn(
                      "shrink-0 rounded-full border px-2.5 py-0.5 text-body-xs font-medium",
                      channel.pill,
                    )}
                  >
                    {channel.category}
                  </span>
                </div>
                <h3 className="mt-4 text-h4 font-semibold tracking-tight">
                  {channel.title}
                </h3>
                <p className="mt-1.5 flex-1 text-body-sm text-foreground-muted">
                  {channel.description}
                </p>
                {channel.to ? (
                  <Link to={channel.to} className={CHANNEL_LINK}>
                    {channel.cta}
                    <ArrowRight aria-hidden="true" className="size-3.5" />
                  </Link>
                ) : (
                  <a
                    href={channel.href}
                    className={CHANNEL_LINK}
                    target={channel.external ? "_blank" : undefined}
                    rel={channel.external ? "noopener noreferrer" : undefined}
                  >
                    {channel.cta}
                    {channel.external ? (
                      <ArrowUpRight aria-hidden="true" className="size-3.5" />
                    ) : (
                      <ArrowRight aria-hidden="true" className="size-3.5" />
                    )}
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      <Section tone="raised" size="md">
        <SectionHeading
          eyebrow="Before you write"
          title="Four answers that save an email"
          description="The questions that arrive most often, answered here so the inbox stays clear for everything else."
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
    </>
  );
}

function DispatchCard() {
  return (
    <div className="box overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-border-subtle px-5 py-4">
        <h2 className="text-h5 font-semibold tracking-tight">
          Maintainer dispatch
        </h2>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-success-border bg-success-subtle px-2.5 py-1 text-body-xs font-semibold text-success-on-subtle">
          <Inbox aria-hidden="true" className="size-3" />
          Queue open
        </span>
      </div>

      <div className="p-5">
        <CopyEmailTile />

        <dl className="mt-5 divide-y divide-border-subtle">
          {DISPATCH.map((row) => {
            const Icon = row.icon;
            return (
              <div key={row.term} className="py-3 first:pt-0">
                <dt className="flex items-center gap-2 text-body-sm font-medium text-foreground">
                  <Icon
                    aria-hidden="true"
                    className="size-4 shrink-0 text-foreground-muted"
                  />
                  {row.term}
                </dt>
                <dd className="mt-1 pl-6 text-body-xs text-foreground-muted">
                  {row.detail}
                </dd>
              </div>
            );
          })}
          <div className="py-3">
            <dt className="flex items-center gap-2 text-body-sm font-medium text-foreground">
              <Globe
                aria-hidden="true"
                className="size-4 shrink-0 text-foreground-muted"
              />
              Coverage
            </dt>
            <dd className="mt-1 pl-6 text-body-xs text-foreground-muted">
              Distributed maintainers, async by default.
            </dd>
            <dd className="mt-2 flex flex-wrap gap-1.5 pl-6">
              {REGIONS.map((region) => (
                <span
                  key={region.name}
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-body-xs font-medium",
                    region.pill,
                  )}
                >
                  {region.name}
                </span>
              ))}
            </dd>
          </div>
        </dl>
      </div>

      <div className="border-t border-border-subtle bg-background-subtle px-5 py-4">
        <div className="flex items-start gap-3">
          <Github
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-foreground-muted"
          />
          <div className="min-w-0">
            <p className="text-body-sm font-medium text-foreground">
              Prefer a public thread?
            </p>
            <p className="mt-0.5 text-body-xs text-foreground-muted">
              Bugs, RFCs and release notes are tracked in the open.
            </p>
            <a
              href={`${REPO}/issues`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-body-xs font-medium text-link underline-offset-4 hover:text-link-hover hover:underline"
            >
              Open an issue
              <ArrowUpRight aria-hidden="true" className="size-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function CopyEmailTile() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  async function copy() {
    const wrote = await navigator.clipboard?.writeText(EMAIL).then(
      () => true,
      () => false,
    );
    if (!wrote) return;
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="rounded-lg border border-border bg-background-subtle p-4">
      <p className="text-eyebrow uppercase text-foreground-muted">
        Direct inbox
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <a
          href={`mailto:${EMAIL}`}
          className="font-mono text-body-sm break-all text-link underline-offset-4 hover:text-link-hover hover:underline"
        >
          {EMAIL}
        </a>
        <Button type="button" size="sm" variant="outline" onClick={copy}>
          {copied ? (
            <Check aria-hidden="true" className="size-3.5" />
          ) : (
            <Copy aria-hidden="true" className="size-3.5" />
          )}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <p aria-live="polite" className="sr-only">
        {copied ? "Email address copied to the clipboard" : ""}
      </p>
    </div>
  );
}
