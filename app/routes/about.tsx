import { Link } from "react-router";
import { Button } from "~/components/ui/button";

export function meta() {
  return [
    { title: "About | React Router + Supabase Framework" },
    {
      name: "description",
      content:
        "Learn more about our React Router and Supabase framework starter",
    },
  ];
}

export default function AboutPage() {
  return (
    <div className="theme-bg-color">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="theme-h1 text-4xl md:text-5xl mb-6">
              About Our Framework
            </h1>
            <p className="theme-fc-light text-lg md:text-xl">
              A comprehensive starter built with modern tools and best practices
              for rapid application development on Cloudflare Workers.
            </p>
          </div>
        </div>

        {/* Gradient Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute right-0 top-0 bg-primary/5 blur-3xl w-[600px] h-[400px] rounded-full" />
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container-max-lg">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="theme-h2 mb-4">Built for Developers</h2>
              <p className="theme-fc-base mb-4">
                This framework was created to streamline the development process
                for React Router applications that use Supabase as their backend
                and deploy to Cloudflare Workers. It includes everything you
                need to get started quickly while maintaining flexibility and
                scalability.
              </p>
              <p className="theme-fc-light">
                Whether you&apos;re building a SaaS platform, a content
                management system, or a data-driven application, this framework
                provides the foundation you need with best practices baked in.
              </p>
            </div>
            <div className="box p-8 bg-primary/5">
              <h3 className="theme-h4 mb-4">Key Features</h3>
              <ul className="space-y-3">
                {keyFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="theme-fc-base">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mb-20">
            <h2 className="theme-h2 text-center mb-12">Technology Stack</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {techStack.map((tech) => (
                <div
                  key={tech.name}
                  className="box p-6 text-center hover:bg-primary/5 transition-colors"
                >
                  <div className="bg-primary/12 theme-rounded w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <tech.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="theme-h5 mb-2">{tech.name}</h3>
                  <p className="theme-fc-light text-sm">{tech.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Design System Section */}
          <div className="box p-10 theme-bg-color-dark text-center">
            <h2 className="theme-h2 mb-4">Comprehensive Design System</h2>
            <p className="theme-fc-light text-lg mb-8 max-w-2xl mx-auto">
              Every component, color, and typography choice is documented and
              consistent. Built with Tailwind CSS v4 and designed for both light
              and dark themes.
            </p>
            <Button size="lg" asChild>
              <Link to="/design-system">Explore Design System</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 theme-bg-color-dark">
        <div className="container">
          <h2 className="theme-h2 text-center mb-12">Our Principles</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {principles.map((principle) => (
              <div key={principle.title} className="text-center">
                <div className="bg-primary/12 theme-rounded w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <principle.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="theme-h4 mb-3">{principle.title}</h3>
                <p className="theme-fc-light">{principle.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const keyFeatures = [
  "React Router 8 with SSR",
  "Supabase integration",
  "45 shadcn/ui components",
  "Complete design system",
  "TypeScript support",
  "Light and dark themes",
  "Responsive layouts",
  "Cloudflare Workers deployment",
];

const techStack = [
  {
    name: "React Router",
    description: "Full-stack React framework with SSR",
    icon: ({ className }: { className?: string }) => (
      <svg
        aria-hidden="true"
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4"
        />
      </svg>
    ),
  },
  {
    name: "Supabase",
    description: "Open source Firebase alternative",
    icon: ({ className }: { className?: string }) => (
      <svg
        aria-hidden="true"
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
        />
      </svg>
    ),
  },
  {
    name: "Tailwind CSS",
    description: "Utility-first CSS framework",
    icon: ({ className }: { className?: string }) => (
      <svg
        aria-hidden="true"
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
        />
      </svg>
    ),
  },
  {
    name: "Cloudflare Workers",
    description: "Edge computing platform",
    icon: ({ className }: { className?: string }) => (
      <svg
        aria-hidden="true"
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
        />
      </svg>
    ),
  },
];

const principles = [
  {
    title: "Developer Experience",
    description:
      "Built with TypeScript, comprehensive documentation, and clear patterns for rapid development.",
    icon: ({ className }: { className?: string }) => (
      <svg
        aria-hidden="true"
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
        />
      </svg>
    ),
  },
  {
    title: "Scalability",
    description:
      "Designed to grow with your application from prototype to production-ready system on Cloudflare.",
    icon: ({ className }: { className?: string }) => (
      <svg
        aria-hidden="true"
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
  },
  {
    title: "Best Practices",
    description:
      "Following industry standards for code quality, accessibility, and performance.",
    icon: ({ className }: { className?: string }) => (
      <svg
        aria-hidden="true"
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];
