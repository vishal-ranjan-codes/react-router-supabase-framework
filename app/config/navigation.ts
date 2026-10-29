import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BookOpen,
  Building,
  Code2,
  Cpu,
  Database,
  Layers,
  Mail,
  MessageSquare,
  Palette,
  Shield,
  Workflow,
  Zap,
} from "lucide-react";

export type NavBadge = {
  text: string;
  variant?: "default" | "secondary" | "outline";
};

export type NavLinkItem = {
  label: string;
  to: string;
  description?: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  external?: boolean;
};

export type NavGroup = {
  title: string;
  items: NavLinkItem[];
};

export type NavFeaturedCard = {
  title: string;
  description: string;
  to: string;
  badge?: string;
  tagline?: string;
  icon?: LucideIcon;
  ctaText?: string;
};

export type PrimaryNavItem =
  | {
      type: "link";
      label: string;
      to: string;
      badge?: NavBadge;
    }
  | {
      type: "simple-dropdown";
      label: string;
      items: NavLinkItem[];
    }
  | {
      type: "mega-menu";
      label: string;
      featured: NavFeaturedCard;
      groups: NavGroup[];
    }
  | {
      type: "grouped-dropdown";
      label: string;
      groups: NavGroup[];
      footerAction?: {
        label: string;
        to: string;
        description?: string;
      };
    };

/**
 * Single source of truth for header navigation.
 * Consumed by both desktop HeaderNav and mobile MobileNav.
 */
export const PRIMARY_NAV_CONFIG: PrimaryNavItem[] = [
  {
    type: "mega-menu",
    label: "Features",
    featured: {
      title: "Design System v2",
      tagline: "Semantic Tokens & Foundations",
      description:
        "Explore 70+ semantic design tokens, light/dark modes, and WCAG AA contrast guardrails.",
      to: "/design-system",
      badge: "Updated",
      icon: Palette,
      ctaText: "Browse system",
    },
    groups: [
      {
        title: "Platform Core",
        items: [
          {
            label: "Supabase & Postgres",
            to: "/#database",
            description:
              "Instant database with Row Level Security and migrations.",
            icon: Database,
          },
          {
            label: "Authentication",
            to: "/sign-in",
            description: "Secure session management, magic links, and OAuth.",
            icon: Shield,
          },
          {
            label: "Edge Runtime",
            to: "/#edge",
            description: "Ultra-fast global deployments on Cloudflare Workers.",
            icon: Cpu,
          },
        ],
      },
      {
        title: "Developer Workflow",
        items: [
          {
            label: "Type Safety",
            to: "/#typecheck",
            description:
              "End-to-end type safety from database to React components.",
            icon: Zap,
          },
          {
            label: "Component System",
            to: "/design-system",
            description:
              "Accessible, keyboard-navigable UI patterns and primitives.",
            icon: Layers,
          },
          {
            label: "Testing Suite",
            to: "/#testing",
            description:
              "Comprehensive Vitest, Playwright E2E, and a11y tests.",
            icon: Workflow,
          },
        ],
      },
    ],
  },
  {
    type: "grouped-dropdown",
    label: "Resources",
    groups: [
      {
        title: "Documentation",
        items: [
          {
            label: "Design System Docs",
            to: "/design-system",
            description: "Tokens, surface hierarchy, and UI guidelines.",
            icon: BookOpen,
          },
          {
            label: "Component Catalog",
            to: "/design-system",
            description: "Interactive button, form, card, and layout recipes.",
            icon: Code2,
          },
        ],
      },
      {
        title: "Community & Help",
        items: [
          {
            label: "GitHub Repository",
            to: "https://github.com",
            description: "Browse code, open issues, and view roadmap.",
            icon: MessageSquare,
            external: true,
          },
          {
            label: "Direct Support",
            to: "/contact",
            description: "Get in touch with questions or project inquiries.",
            icon: Mail,
          },
        ],
      },
    ],
    footerAction: {
      label: "Release Notes",
      to: "/about",
      description: "See what shipped in the latest framework release",
    },
  },
  {
    type: "simple-dropdown",
    label: "Company",
    items: [
      {
        label: "About Us",
        to: "/about",
        description: "Our philosophy, stack decisions, and team.",
        icon: Building,
      },
      {
        label: "Contact",
        to: "/contact",
        description: "Reach our engineering and support team.",
        icon: Mail,
      },
      {
        label: "Security & Privacy",
        to: "/about",
        description: "Enterprise security and privacy policies.",
        icon: Shield,
      },
      {
        label: "System Status",
        to: "/about",
        description: "All services operating normally (99.99%).",
        icon: Activity,
        badge: { text: "Operational", variant: "secondary" },
      },
    ],
  },
  {
    type: "link",
    label: "Pricing",
    to: "/about",
  },
];
