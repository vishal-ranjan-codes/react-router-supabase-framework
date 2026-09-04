import { Link } from 'react-router'
import { Button } from '~/components/ui/button'
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "React Router + Supabase Framework" },
    { name: "description", content: "A comprehensive starter framework with a complete design system, shadcn/ui components, and best practices for building modern web applications." },
  ];
}

export default function HomePage() {
    return (
        <div className="theme-bg-color">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-24 md:py-32">
                <div className="container">
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="theme-h1 mb-6 text-4xl md:text-5xl lg:text-6xl">
                            React Router + Supabase Framework
                        </h1>
                        <p className="theme-fc-light text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                            A comprehensive starter framework with a complete design system, shadcn/ui components,
                            and best practices for building modern web applications on Cloudflare Workers.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Button size="lg" asChild>
                                <Link to="/design-system">View Design System</Link>
                            </Button>
                            <Button variant="outline" size="lg" asChild>
                                <Link to="/about">Learn More</Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Gradient Background */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute left-1/2 top-0 -translate-x-1/2 bg-primary/5 blur-3xl w-[800px] h-[600px] rounded-full" />
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 md:py-24 theme-bg-color-dark">
                <div className="container">
                    <h2 className="theme-h2 text-center mb-12">What&apos;s Included</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature) => (
                            <div key={feature.title} className="box p-6">
                                <div className="bg-primary/12 theme-rounded w-12 h-12 flex items-center justify-center mb-4">
                                    <feature.icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="theme-h4 mb-3">{feature.title}</h3>
                                <p className="theme-fc-light">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-24">
                <div className="container">
                    <div className="box p-12 text-center max-w-3xl mx-auto bg-primary/5 theme-border-color">
                        <h2 className="theme-h2 mb-4">Ready to Get Started?</h2>
                        <p className="theme-fc-light text-lg mb-8">
                            Clone this repository and start building your next great application.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Button size="lg" asChild>
                                <Link to="/design-system">Explore Design System</Link>
                            </Button>
                            <Button variant="outline" size="lg" asChild>
                                <Link to="/contact">Contact Us</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

const features = [
    {
        title: 'Modern Stack',
        description: 'Built with React Router 8, React 19, and Tailwind CSS v4 for peak performance on Cloudflare Workers.',
        icon: ({ className }: { className?: string }) => (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
    },
    {
        title: 'Design System',
        description: 'Comprehensive design tokens, color system, and typography scale with light/dark themes.',
        icon: ({ className }: { className?: string }) => (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
        ),
    },
    {
        title: 'Supabase Ready',
        description: 'Pre-configured Supabase integration with SSR middleware pattern and best practices.',
        icon: ({ className }: { className?: string }) => (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
        ),
    },
    {
        title: 'shadcn/ui Components',
        description: '45 accessible, customizable UI components built with Radix UI primitives.',
        icon: ({ className }: { className?: string }) => (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
        ),
    },
    {
        title: 'TypeScript',
        description: 'Fully typed with TypeScript for better DX and fewer runtime errors.',
        icon: ({ className }: { className?: string }) => (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
        ),
    },
    {
        title: 'Cloudflare Workers',
        description: 'Deploy to the edge with Cloudflare Workers for global low-latency performance.',
        icon: ({ className }: { className?: string }) => (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
        ),
    },
]
