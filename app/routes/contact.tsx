import { CheckCircle2 } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router";
import { PageHeader } from "~/components/patterns/PageHeader";
import { Section } from "~/components/patterns/Section";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

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

type Fields = { name: string; email: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

function validate(fields: Fields): Errors {
  const errors: Errors = {};
  if (fields.name.trim().length < 2) {
    errors.name = "Tell us who you are — at least two characters.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
    errors.email = "That doesn't look like an email address.";
  }
  if (fields.message.trim().length < 10) {
    errors.message = "A sentence or two helps us answer properly.";
  }
  return errors;
}

const RAIL = [
  {
    term: "Email",
    detail: EMAIL,
    href: `mailto:${EMAIL}`,
  },
  {
    term: "Where",
    detail: "Distributed — maintained across time zones, async by default.",
  },
  {
    term: "Response time",
    detail: "Within two working days, usually faster on weekdays.",
  },
];

export default function ContactPage() {
  const [fields, setFields] = useState<Fields>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const update =
    (key: keyof Fields) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFields((current) => ({ ...current, [key]: event.target.value }));
      setSent(false);
    };

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = validate(fields);
    setErrors(next);
    if (Object.keys(next).length === 0) setSent(true);
  }

  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(
    `Question from ${fields.name.trim() || "the website"}`,
  )}&body=${encodeURIComponent(fields.message)}`;

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Talk to the people who maintain it"
        description="Bug report, fork question, or “why is this token named that?” — all of them are welcome here."
      />

      <Section size="md">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div className="box p-6 md:p-8">
            <h2 className="text-h3 font-semibold">Send a message</h2>
            <p className="mt-2 text-body text-foreground-muted">
              The form validates in your browser and hands the message to your
              mail client — there is deliberately no backend behind it.
            </p>

            {sent ? (
              <Alert className="mt-6 border-success-border bg-success-subtle text-success-on-subtle">
                <CheckCircle2 />
                <AlertTitle>Ready to send</AlertTitle>
                <AlertDescription>
                  Your mail client should have opened with the message drafted.
                  If nothing happened,{" "}
                  <a className="underline" href={mailto}>
                    open it manually
                  </a>
                  .
                </AlertDescription>
              </Alert>
            ) : null}

            <form className="mt-6 space-y-5" noValidate onSubmit={onSubmit}>
              <div className="space-y-2">
                <Label htmlFor="contact-name">Name</Label>
                <Input
                  id="contact-name"
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
                  value={fields.email}
                  onChange={update("email")}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email ? "contact-email-error" : undefined
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-message">Message</Label>
                <Textarea
                  id="contact-message"
                  rows={5}
                  value={fields.message}
                  onChange={update("message")}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={
                    errors.message ? "contact-message-error" : undefined
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
              </div>

              <Button type="submit" size="lg">
                Send message
              </Button>
            </form>
          </div>

          <dl className="space-y-8">
            {RAIL.map((row) => (
              <div key={row.term}>
                <dt className="text-eyebrow uppercase text-foreground-muted">
                  {row.term}
                </dt>
                <dd className="mt-1 text-body">
                  {row.href ? (
                    <a
                      className="text-link hover:text-link-hover"
                      href={row.href}
                    >
                      {row.detail}
                    </a>
                  ) : (
                    row.detail
                  )}
                </dd>
              </div>
            ))}
            <div>
              <dt className="text-eyebrow uppercase text-foreground-muted">
                Before you write
              </dt>
              <dd className="mt-1 text-body text-foreground-muted">
                Most token and component questions are already answered on the{" "}
                <Link
                  className="text-link underline underline-offset-4 hover:text-link-hover"
                  to="/design-system"
                >
                  design-system page
                </Link>
                .
              </dd>
            </div>
          </dl>
        </div>
      </Section>
    </>
  );
}
