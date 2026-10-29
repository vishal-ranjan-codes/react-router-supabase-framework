import { Link } from "react-router";
import { Section } from "~/components/patterns/Section";

const REPO =
  "https://github.com/vishal-ranjan-codes/react-router-supabase-framework";

const COLUMNS: {
  heading: string;
  links: { label: string; to?: string; href?: string }[];
}[] = [
  {
    heading: "Product",
    links: [
      { label: "Design system", to: "/design-system" },
      { label: "About", to: "/about" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Components", to: "/design-system#components" },
      { label: "Colors", to: "/design-system#colors" },
      { label: "Typography", to: "/design-system#typography" },
    ],
  },
  {
    heading: "Project",
    links: [
      { label: "GitHub repository", href: REPO },
      { label: "Issues", href: `${REPO}/issues` },
    ],
  },
];

const LINK_CLASS =
  "text-body-sm text-foreground-on-inverse-muted hover:text-foreground-inverse transition-colors no-underline";

export default function Footer() {
  return (
    <Section as="footer" tone="inverse" size="sm">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        <div className="col-span-1">
          <h3 className="text-inherit text-h5 font-semibold mb-4">
            React Router + Supabase
          </h3>
          <p className="text-body-sm text-foreground-on-inverse-muted">
            A production-shaped starter for modern web applications on
            Cloudflare Workers.
          </p>
        </div>

        {COLUMNS.map((column) => (
          <div key={column.heading}>
            <h4 className="text-inherit font-semibold mb-4">
              {column.heading}
            </h4>
            <ul className="space-y-2">
              {column.links.map((link) => (
                <li key={link.label}>
                  {link.to ? (
                    <Link to={link.to} className={LINK_CLASS}>
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={LINK_CLASS}
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-border-subtle border-t mt-8 pt-8">
        <p className="text-body-sm text-foreground-on-inverse-muted text-center">
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span>{" "}
          React Router + Supabase Framework.
        </p>
      </div>
    </Section>
  );
}
