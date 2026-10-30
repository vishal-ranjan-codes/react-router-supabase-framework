import {
  Activity,
  ArrowRight,
  Check,
  CircleCheck,
  CircleX,
  Code2,
  Copy,
  Database,
  Info,
  Layers,
  LayoutGrid,
  ListChecks,
  LoaderCircle,
  type LucideIcon,
  MoreHorizontal,
  Palette,
  Rocket,
  Search,
  Settings,
  ShieldCheck,
  Sliders,
  Sparkles,
  TrendingUp,
  TriangleAlert,
  Type,
  User,
} from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { Link } from "react-router";
import { CodeBlock } from "~/components/patterns/CodeBlock";
import { CtaBand } from "~/components/patterns/CtaBand";
import { FeatureCard } from "~/components/patterns/FeatureCard";
import { Hero } from "~/components/patterns/Hero";
import { IconTile } from "~/components/patterns/IconTile";
import { LogoStrip } from "~/components/patterns/LogoStrip";
import { PageHeader } from "~/components/patterns/PageHeader";
import { Section } from "~/components/patterns/Section";
import { SectionHeading } from "~/components/patterns/SectionHeading";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { Switch } from "~/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Textarea } from "~/components/ui/textarea";
import {
  PATTERNS,
  STATES,
  SURFACE_LADDER,
  TYPE_SCALE,
} from "~/lib/design-system";
import { THEME_PRESETS } from "~/lib/theme-presets";
import { cn } from "~/lib/utils";

export function meta() {
  return [
    { title: "Design System | React Router + Supabase Framework" },
    {
      name: "description",
      content:
        "Living component library and design system: Tailwind v4, 60-30-10 multi-color branding, refined subdued canvas, and WCAG AA accessibility.",
    },
  ];
}

const BANNED_SURFACE_FILL = "bg-primary/5"; // ds-allow: the Don't list has to print a banned class to document it

const SECTIONS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "colors", label: "Brand & Colors", icon: Palette },
  { id: "surfaces", label: "Surfaces & Depth", icon: Layers },
  { id: "typography", label: "Typography", icon: Type },
  { id: "components", label: "Component Catalog", icon: LayoutGrid },
  { id: "patterns", label: "UI Recipes", icon: Code2 },
  { id: "states", label: "States & Focus", icon: Sliders },
  { id: "rules", label: "Best Practices", icon: ListChecks },
  { id: "specs", label: "Technical Specs", icon: ShieldCheck },
];

const SURFACE_SWATCHES: Record<string, string> = {
  background: "bg-background",
  "background-subtle": "bg-background-subtle",
  card: "bg-card",
  popover: "bg-popover",
  scrim: "bg-scrim",
  "surface-inverse": "bg-surface-inverse",
  "surface-brand": "bg-surface-brand",
};

const SURFACE_INK: Record<string, string> = {
  background: "text-foreground",
  "background-subtle": "text-foreground",
  card: "text-foreground",
  popover: "text-foreground",
  "surface-inverse": "text-foreground-inverse",
  "surface-brand": "text-primary-deep-foreground",
};

const STATUS_SPECIMENS: {
  name: string;
  icon: LucideIcon;
  meaning: string;
  panel: string;
  solid: string;
}[] = [
  {
    name: "success",
    icon: CircleCheck,
    meaning: "Saved, verified, live",
    panel: "bg-success-subtle text-success-on-subtle border-success-border",
    solid: "bg-success text-success-foreground",
  },
  {
    name: "warning",
    icon: TriangleAlert,
    meaning: "Needs attention, not broken",
    panel: "bg-warning-subtle text-warning-on-subtle border-warning-border",
    solid: "bg-warning text-warning-foreground",
  },
  {
    name: "destructive",
    icon: CircleX,
    meaning: "Irreversible or failed",
    panel:
      "bg-destructive-subtle text-destructive-on-subtle border-destructive-border",
    solid: "bg-destructive text-destructive-foreground",
  },
  {
    name: "info",
    icon: Info,
    meaning: "Neutral notice",
    panel: "bg-info-subtle text-info-on-subtle border-info-border",
    solid: "bg-info text-info-foreground",
  },
];

const RADIUS_SWATCHES: { utility: string; token: string; use: string }[] = [
  { utility: "rounded-xs", token: "--radius-xs", use: "Tags, indicators" },
  { utility: "rounded-sm", token: "--radius-sm", use: "Small controls" },
  { utility: "rounded-md", token: "--radius-md", use: "Buttons, inputs" },
  { utility: "rounded-lg", token: "--radius-lg", use: "Standard cards" },
  { utility: "rounded-xl", token: "--radius-xl", use: "Elevated panels" },
  { utility: "rounded-2xl", token: "--radius-2xl", use: "Modals, dialogs" },
];

const LABEL_SPECIMENS = [
  {
    hue: "violet",
    label: "Violet",
    subtleClass:
      "bg-label-violet-subtle text-label-violet-on-subtle border-label-violet-border",
    solidClass: "bg-label-violet-solid text-label-violet-foreground",
    borderClass: "border-label-violet-border",
    subtleToken: "--label-violet-subtle",
    onSubtleToken: "--label-violet-on-subtle",
    borderToken: "--label-violet-border",
    solidToken: "--label-violet-solid",
    foregroundToken: "--label-violet-foreground",
  },
  {
    hue: "indigo",
    label: "Indigo",
    subtleClass:
      "bg-label-indigo-subtle text-label-indigo-on-subtle border-label-indigo-border",
    solidClass: "bg-label-indigo-solid text-label-indigo-foreground",
    borderClass: "border-label-indigo-border",
    subtleToken: "--label-indigo-subtle",
    onSubtleToken: "--label-indigo-on-subtle",
    borderToken: "--label-indigo-border",
    solidToken: "--label-indigo-solid",
    foregroundToken: "--label-indigo-foreground",
  },
  {
    hue: "teal",
    label: "Teal",
    subtleClass:
      "bg-label-teal-subtle text-label-teal-on-subtle border-label-teal-border",
    solidClass: "bg-label-teal-solid text-label-teal-foreground",
    borderClass: "border-label-teal-border",
    subtleToken: "--label-teal-subtle",
    onSubtleToken: "--label-teal-on-subtle",
    borderToken: "--label-teal-border",
    solidToken: "--label-teal-solid",
    foregroundToken: "--label-teal-foreground",
  },
  {
    hue: "cyan",
    label: "Cyan",
    subtleClass:
      "bg-label-cyan-subtle text-label-cyan-on-subtle border-label-cyan-border",
    solidClass: "bg-label-cyan-solid text-label-cyan-foreground",
    borderClass: "border-label-cyan-border",
    subtleToken: "--label-cyan-subtle",
    onSubtleToken: "--label-cyan-on-subtle",
    borderToken: "--label-cyan-border",
    solidToken: "--label-cyan-solid",
    foregroundToken: "--label-cyan-foreground",
  },
  {
    hue: "pink",
    label: "Pink",
    subtleClass:
      "bg-label-pink-subtle text-label-pink-on-subtle border-label-pink-border",
    solidClass: "bg-label-pink-solid text-label-pink-foreground",
    borderClass: "border-label-pink-border",
    subtleToken: "--label-pink-subtle",
    onSubtleToken: "--label-pink-on-subtle",
    borderToken: "--label-pink-border",
    solidToken: "--label-pink-solid",
    foregroundToken: "--label-pink-foreground",
  },
  {
    hue: "lime",
    label: "Lime",
    subtleClass:
      "bg-label-lime-subtle text-label-lime-on-subtle border-label-lime-border",
    solidClass: "bg-label-lime-solid text-label-lime-foreground",
    borderClass: "border-label-lime-border",
    subtleToken: "--label-lime-subtle",
    onSubtleToken: "--label-lime-on-subtle",
    borderToken: "--label-lime-border",
    solidToken: "--label-lime-solid",
    foregroundToken: "--label-lime-foreground",
  },
  {
    hue: "orange",
    label: "Orange",
    subtleClass:
      "bg-label-orange-subtle text-label-orange-on-subtle border-label-orange-border",
    solidClass: "bg-label-orange-solid text-label-orange-foreground",
    borderClass: "border-label-orange-border",
    subtleToken: "--label-orange-subtle",
    onSubtleToken: "--label-orange-on-subtle",
    borderToken: "--label-orange-border",
    solidToken: "--label-orange-solid",
    foregroundToken: "--label-orange-foreground",
  },
  {
    hue: "brown",
    label: "Brown",
    subtleClass:
      "bg-label-brown-subtle text-label-brown-on-subtle border-label-brown-border",
    solidClass: "bg-label-brown-solid text-label-brown-foreground",
    borderClass: "border-label-brown-border",
    subtleToken: "--label-brown-subtle",
    onSubtleToken: "--label-brown-on-subtle",
    borderToken: "--label-brown-border",
    solidToken: "--label-brown-solid",
    foregroundToken: "--label-brown-foreground",
  },
  {
    hue: "cool-gray",
    label: "Cool Gray",
    subtleClass:
      "bg-label-cool-gray-subtle text-label-cool-gray-on-subtle border-label-cool-gray-border",
    solidClass: "bg-label-cool-gray-solid text-label-cool-gray-foreground",
    borderClass: "border-label-cool-gray-border",
    subtleToken: "--label-cool-gray-subtle",
    onSubtleToken: "--label-cool-gray-on-subtle",
    borderToken: "--label-cool-gray-border",
    solidToken: "--label-cool-gray-solid",
    foregroundToken: "--label-cool-gray-foreground",
  },
  {
    hue: "gray",
    label: "Gray",
    subtleClass:
      "bg-label-gray-subtle text-label-gray-on-subtle border-label-gray-border",
    solidClass: "bg-label-gray-solid text-label-gray-foreground",
    borderClass: "border-label-gray-border",
    subtleToken: "--label-gray-subtle",
    onSubtleToken: "--label-gray-on-subtle",
    borderToken: "--label-gray-border",
    solidToken: "--label-gray-solid",
    foregroundToken: "--label-gray-foreground",
  },
];

const CATEGORICAL_SERIES = [
  { token: "--chart-1", label: "Series 1", className: "bg-chart-1" },
  { token: "--chart-2", label: "Series 2", className: "bg-chart-2" },
  { token: "--chart-3", label: "Series 3", className: "bg-chart-3" },
  { token: "--chart-4", label: "Series 4", className: "bg-chart-4" },
  { token: "--chart-5", label: "Series 5", className: "bg-chart-5" },
  { token: "--chart-6", label: "Series 6", className: "bg-chart-6" },
  { token: "--chart-7", label: "Series 7", className: "bg-chart-7" },
  { token: "--chart-8", label: "Series 8", className: "bg-chart-8" },
  { token: "--chart-9", label: "Series 9", className: "bg-chart-9" },
  { token: "--chart-10", label: "Series 10", className: "bg-chart-10" },
  { token: "--chart-11", label: "Series 11", className: "bg-chart-11" },
  { token: "--chart-12", label: "Series 12 (Other)", className: "bg-chart-12" },
];

const SEQUENTIAL_SERIES = [
  {
    token: "--chart-seq-1",
    label: "Seq 1 (Lightest)",
    className: "bg-chart-seq-1",
  },
  { token: "--chart-seq-2", label: "Seq 2", className: "bg-chart-seq-2" },
  { token: "--chart-seq-3", label: "Seq 3", className: "bg-chart-seq-3" },
  { token: "--chart-seq-4", label: "Seq 4 (Mid)", className: "bg-chart-seq-4" },
  { token: "--chart-seq-5", label: "Seq 5", className: "bg-chart-seq-5" },
  { token: "--chart-seq-6", label: "Seq 6", className: "bg-chart-seq-6" },
  {
    token: "--chart-seq-7",
    label: "Seq 7 (Darkest)",
    className: "bg-chart-seq-7",
  },
];

const DIVERGING_SERIES = [
  {
    token: "--chart-div-neg-3",
    label: "Neg 3 (Max neg)",
    className: "bg-chart-div-neg-3",
  },
  {
    token: "--chart-div-neg-2",
    label: "Neg 2",
    className: "bg-chart-div-neg-2",
  },
  {
    token: "--chart-div-neg-1",
    label: "Neg 1",
    className: "bg-chart-div-neg-1",
  },
  {
    token: "--chart-div-mid",
    label: "Mid (Neutral)",
    className: "bg-chart-div-mid",
  },
  {
    token: "--chart-div-pos-1",
    label: "Pos 1",
    className: "bg-chart-div-pos-1",
  },
  {
    token: "--chart-div-pos-2",
    label: "Pos 2",
    className: "bg-chart-div-pos-2",
  },
  {
    token: "--chart-div-pos-3",
    label: "Pos 3 (Max pos)",
    className: "bg-chart-div-pos-3",
  },
];

export default function DesignSystemPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* 1. Hero Header & Live Brand Switcher */}
      <HeroHeader />

      {/* 2. Quick Navigation Bar */}
      <QuickNav />

      {/* 3. Brand & Colors Section (including 60-30-10, Swatches, Labels, Charts) */}
      <BrandAndColorsSection />

      {/* 4. Surfaces, Depth & Elevation */}
      <SurfacesSection />

      {/* 5. Typography & Hierarchy */}
      <TypographySection />

      {/* 6. Component Catalog (The Core Showcase) */}
      <ComponentCatalogSection />

      {/* 7. UI Pattern Recipes */}
      <PatternsSection />

      {/* 8. Micro-Interactions & States */}
      <StatesSection />

      {/* 9. Best Practices (Do's & Don'ts) */}
      <RulesSection />

      {/* 10. Technical Specifications & Audit Ledger */}
      <TechnicalSpecsSection />

      {/* Closing CTA */}
      <CtaBand
        tone="brand-deep"
        title="Ship your next interface"
        description="Every component is pre-wired to semantic tokens and verified across 57 contrast tests. Compose with patterns; never write raw hex."
        actions={
          <>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/">View homepage</Link>
            </Button>
            <Link
              to="/about"
              className="text-body-sm text-primary-deep-foreground underline-offset-4 hover:underline"
            >
              Read about the stack
            </Link>
          </>
        }
      />
    </div>
  );
}

/* ------------------------------------------------------------------ 1. Hero */

function HeroHeader() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>("tech-blue");
  const [previewTheme, setPreviewTheme] = useState<"light" | "dark">("light");
  const [accentRole, setAccentRole] = useState<"pill" | "dot" | "none">("pill");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      setPreviewTheme("dark");
    }
  }, []);

  const activePreset =
    THEME_PRESETS.find((p) => p.id === selectedPresetId) ?? THEME_PRESETS[0];
  const palette =
    previewTheme === "dark" ? activePreset.dark : activePreset.light;

  const previewStyle: React.CSSProperties & Record<string, string> = {
    "--primary": palette.brand.primary,
    "--primary-hover": palette.brand.primaryHover,
    "--primary-active": palette.brand.primaryActive,
    "--primary-foreground": palette.brand.primaryForeground,
    "--primary-subtle": palette.brand.primarySubtle,
    "--primary-on-subtle": palette.brand.primaryOnSubtle,
    "--brand-accent": palette.brandAccent.accent,
    "--brand-accent-hover": palette.brandAccent.accentHover,
    "--brand-accent-active": palette.brandAccent.accentActive,
    "--brand-accent-foreground": palette.brandAccent.accentForeground,
    "--brand-accent-subtle": palette.brandAccent.accentSubtle,
    "--brand-accent-on-subtle": palette.brandAccent.accentOnSubtle,
    "--brand-accent-border": palette.brandAccent.accentBorder,
    ...(palette.brand.primaryDeep
      ? { "--primary-deep": palette.brand.primaryDeep }
      : {}),
    ...(palette.brand.primaryDeepForeground
      ? { "--primary-deep-foreground": palette.brand.primaryDeepForeground }
      : {}),
    ...(palette.surfaces?.background
      ? { "--background": palette.surfaces.background }
      : {}),
    ...(palette.surfaces?.card ? { "--card": palette.surfaces.card } : {}),
    ...(palette.surfaces?.backgroundSubtle
      ? { "--background-subtle": palette.surfaces.backgroundSubtle }
      : {}),
    ...(palette.surfaces?.border
      ? { "--border": palette.surfaces.border }
      : {}),
  };

  const handleCopy = () => {
    const cssVars = `/* ${activePreset.name} (${previewTheme}) */
--primary: ${palette.brand.primary};
--primary-hover: ${palette.brand.primaryHover};
--primary-foreground: ${palette.brand.primaryForeground};
--brand-accent: ${palette.brandAccent.accent};
--brand-accent-foreground: ${palette.brandAccent.accentForeground};
--brand-accent-subtle: ${palette.brandAccent.accentSubtle};
--brand-accent-border: ${palette.brandAccent.accentBorder};`;
    navigator.clipboard?.writeText(cssVars);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Section tone="raised" className="border-border border-b pt-12 pb-16">
      <div className="container-page">
        {/* Eyebrow and Headline */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background-subtle px-3 py-1 text-eyebrow uppercase font-semibold text-foreground-muted mb-4">
            <Sparkles className="size-3.5 text-link" />
            Design System · Living Component Library
          </div>
          <h1 className="text-display font-bold tracking-tight text-foreground sm:text-5xl">
            Building blocks for modern edge applications
          </h1>
          <p className="mt-4 text-body-lg text-foreground-muted leading-relaxed">
            Constructed on Tailwind CSS v4, a refined subdued canvas, and a
            scalable 60-30-10 multi-color branding engine. Every component is
            backed by mathematical WCAG AA contrast enforcement.
          </p>
        </div>

        {/* Live Brand Preset Switcher Showcase */}
        <div className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
            <div>
              <div className="flex items-center gap-2">
                <Palette className="size-5 text-link" />
                <h2 className="text-h4 font-semibold text-foreground">
                  Interactive Brand Preset Switcher
                </h2>
              </div>
              <p className="text-body-sm text-foreground-muted mt-1">
                Select a preset to preview how the 60-30-10 multi-brand
                architecture reskins components in real-time:
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-lg border border-border p-1 bg-background-subtle">
                <button
                  type="button"
                  onClick={() => setPreviewTheme("light")}
                  className={cn(
                    "px-3 py-1 text-body-xs font-medium rounded-md transition-all",
                    previewTheme === "light"
                      ? "bg-card text-foreground shadow-xs"
                      : "text-foreground-muted hover:text-foreground",
                  )}
                >
                  Light
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTheme("dark")}
                  className={cn(
                    "px-3 py-1 text-body-xs font-medium rounded-md transition-all",
                    previewTheme === "dark"
                      ? "bg-card text-foreground shadow-xs"
                      : "text-foreground-muted hover:text-foreground",
                  )}
                >
                  Dark
                </button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="size-3.5 text-success" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    Copy CSS
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {THEME_PRESETS.map((preset) => {
              const isSelected = preset.id === selectedPresetId;
              const pTheme =
                previewTheme === "dark" ? preset.dark : preset.light;
              return (
                <button
                  type="button"
                  key={preset.id}
                  onClick={() => setSelectedPresetId(preset.id)}
                  className={cn(
                    "flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-all",
                    isSelected
                      ? "border-primary bg-background-subtle shadow-xs ring-1 ring-primary"
                      : "border-border bg-card hover:bg-background-subtle",
                  )}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="text-body-xs font-semibold text-foreground truncate">
                      {preset.name}
                    </span>
                    {isSelected && (
                      <Check className="size-3.5 text-primary shrink-0" />
                    )}
                  </div>
                  {/* Swatch tri-dot */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <div
                      className="size-3.5 rounded-full border border-border shadow-xs"
                      style={{
                        backgroundColor:
                          pTheme.surfaces?.background ??
                          (previewTheme === "dark" ? "#090909" : "#fafafa"),
                      }}
                      title="60% Canvas"
                    />
                    <div
                      className="size-3.5 rounded-full shadow-xs"
                      style={{ backgroundColor: pTheme.brand.primary }}
                      title="30% Primary"
                    />
                    <div
                      className="size-3.5 rounded-full shadow-xs"
                      style={{ backgroundColor: pTheme.brandAccent.accent }}
                      title="10% Accent"
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Live Preview Container */}
          <div
            className={cn(
              "mt-6 rounded-xl border border-border p-6 transition-all bg-background text-foreground",
              previewTheme,
            )}
            style={previewStyle}
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              {/* Preset Meta & 60-30-10 breakdown */}
              <div className="space-y-4 max-w-lg">
                <div className="flex items-center gap-2">
                  <span className="text-h4 font-bold text-foreground">
                    {activePreset.name}
                  </span>
                  <span className="rounded bg-background-subtle px-2 py-0.5 font-mono text-[11px] text-foreground-muted uppercase">
                    {activePreset.id}
                  </span>
                </div>
                <p className="text-body-sm text-foreground-muted">
                  {activePreset.description}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-body-xs font-medium text-foreground">
                    <span className="size-2 rounded-full bg-foreground" />
                    60% Canvas
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-subtle border border-border px-2.5 py-1 text-body-xs font-semibold text-primary-on-subtle">
                    <span className="size-2 rounded-full bg-primary" />
                    30% Primary
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-accent-subtle border border-brand-accent-border px-2.5 py-1 text-body-xs font-semibold text-brand-accent-on-subtle">
                    <span className="size-2 rounded-full bg-brand-accent" />
                    10% Brand Accent
                  </span>
                </div>

                {/* Restricted Accent Punctuation Selector */}
                <div className="pt-2">
                  <div className="text-body-xs font-medium text-foreground-muted mb-2">
                    Restricted Accent Scope (Punctuation Only):
                  </div>
                  <div className="inline-flex rounded-lg border border-border p-1 bg-background-subtle">
                    <button
                      type="button"
                      onClick={() => setAccentRole("pill")}
                      className={cn(
                        "px-2.5 py-1 text-body-xs rounded-md transition-all font-medium",
                        accentRole === "pill"
                          ? "bg-card text-foreground shadow-xs font-semibold"
                          : "text-foreground-muted hover:text-foreground",
                      )}
                    >
                      Small Pill Tag
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccentRole("dot")}
                      className={cn(
                        "px-2.5 py-1 text-body-xs rounded-md transition-all font-medium",
                        accentRole === "dot"
                          ? "bg-card text-foreground shadow-xs font-semibold"
                          : "text-foreground-muted hover:text-foreground",
                      )}
                    >
                      8px Indicator Dot
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccentRole("none")}
                      className={cn(
                        "px-2.5 py-1 text-body-xs rounded-md transition-all font-medium",
                        accentRole === "none"
                          ? "bg-card text-foreground shadow-xs font-semibold"
                          : "text-foreground-muted hover:text-foreground",
                      )}
                    >
                      Single-Primary (Off)
                    </button>
                  </div>
                </div>
              </div>

              {/* Sample Mini-Dashboard Card (Strictly 60-30-10 or Single Primary) */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-card w-full lg:w-[380px] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div>
                    <p className="text-body-xs font-medium text-foreground-muted">
                      Enterprise Pipeline
                    </p>
                    <p className="text-h3 font-bold text-foreground mt-0.5">
                      $128,450
                    </p>
                  </div>
                  {accentRole === "pill" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-accent-subtle border border-brand-accent-border px-2.5 py-1 text-body-xs font-semibold text-brand-accent-on-subtle shadow-xs">
                      <TrendingUp className="size-3" />
                      +18.4%
                    </span>
                  )}
                  {accentRole === "dot" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-background-subtle border border-border px-2.5 py-1 text-body-xs font-medium text-foreground">
                      <span className="size-2 rounded-full bg-brand-accent" />
                      Live +18.4%
                    </span>
                  )}
                  {accentRole === "none" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-background-subtle border border-border px-2.5 py-1 text-body-xs font-medium text-foreground-muted">
                      <TrendingUp className="size-3 text-primary" />
                      +18.4%
                    </span>
                  )}
                </div>

                {/* Progress Metric (30% Primary) */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-body-xs text-foreground-muted">
                    <span>Q4 Target Completion</span>
                    <span className="font-semibold text-foreground">84%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-background-subtle overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: "84%" }}
                    />
                  </div>
                </div>

                {/* Action Controls (Clean Primary + Neutral Outline - Never Accent) */}
                <div className="pt-1 flex items-center gap-2">
                  <button
                    type="button"
                    className="flex-1 bg-primary hover:bg-primary-hover active:bg-primary-active text-primary-foreground font-semibold px-4 py-2 rounded-md text-body-xs shadow-xs transition-colors text-center"
                  >
                    Primary Action
                  </button>
                  <button
                    type="button"
                    className="border border-border bg-card hover:bg-accent text-foreground font-medium px-4 py-2 rounded-md text-body-xs transition-colors"
                  >
                    Secondary
                  </button>
                </div>

                {/* Punctuation Scope Callout */}
                <p className="text-[11px] text-foreground-muted leading-relaxed pt-1">
                  <strong>Punctuation Rule:</strong> Brand accent is restricted
                  strictly to tiny dots and pill tags. Buttons always use
                  primary or neutral.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

type Theme = "light" | "dark";

function ThemePair({ children }: { children: (theme: Theme) => ReactNode }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {(["light", "dark"] as const).map((theme) => (
        <div
          key={theme}
          className={cn(
            "rounded-lg border border-border overflow-hidden",
            theme,
          )}
        >
          <div className="bg-background-subtle border-b border-border px-2.5 py-1 font-mono text-[10px] uppercase text-foreground-muted">
            {theme}
          </div>
          <div className="bg-background p-2.5">{children(theme)}</div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ 2. Nav */

function QuickNav() {
  return (
    <div className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="container-page py-3">
        <nav aria-label="Design System Navigation">
          <ul className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <li key={section.id} className="shrink-0">
                  <a
                    href={`#${section.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-transparent px-3 py-1.5 text-body-xs font-medium text-foreground-muted transition-colors hover:border-border hover:bg-card hover:text-foreground"
                  >
                    <Icon className="size-3.5" />
                    {section.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}

/* --------------------------------------------------- 3. Brand & Colors */

function BrandAndColorsSection() {
  const [copiedClass, setCopiedClass] = useState<string | null>(null);

  const copyClass = (className: string) => {
    navigator.clipboard?.writeText(className);
    setCopiedClass(className);
    setTimeout(() => setCopiedClass(null), 1500);
  };

  return (
    <Section id="colors" tone="page" className="py-16">
      <SectionHeading
        eyebrow="Identity & Color"
        title="60-30-10 Multi-Color Brand Engine"
        description={
          <>
            Modern applications need distinct visual roles. The starter
            framework separates the neutral canvas (60%) from the primary brand
            structure (30%) and gives you first-class Brand Accent tokens (10%)
            for high-visibility badges, secondary actions, and highlight pills.
          </>
        }
      />

      {/* 60-30-10 Concept Architecture */}
      <div className="grid gap-6 md:grid-cols-3 mb-12">
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-display font-bold text-foreground">60%</span>
            <span className="rounded-md bg-background-subtle px-2 py-1 font-mono text-body-xs text-foreground-muted">
              bg-background
            </span>
          </div>
          <h3 className="text-h5 font-semibold text-foreground mt-3">
            Canvas & Negative Space
          </h3>
          <p className="text-body-sm text-foreground-muted mt-2">
            The page canvas is luminous off-white (<code>#fafafa</code> in
            light, <code>#090909</code> in dark). Raised panels sit above the
            canvas with <code>bg-card</code> and crisp perimeter borders.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-display font-bold text-link">30%</span>
            <span className="rounded-md bg-primary-subtle px-2 py-1 font-mono text-body-xs text-primary-on-subtle">
              bg-primary
            </span>
          </div>
          <h3 className="text-h5 font-semibold text-foreground mt-3">
            Primary Brand Structure
          </h3>
          <p className="text-body-sm text-foreground-muted mt-2">
            Primary buttons, active tabs, main links, and key navigation chrome.
            Anchor token <code>--primary</code> establishes product identity
            while keeping total brand fill under 10% of any viewport.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-display font-bold text-foreground">10%</span>
            <span className="rounded-md bg-brand-accent-subtle px-2 py-1 font-mono text-body-xs font-semibold text-brand-accent-on-subtle border border-brand-accent-border">
              bg-brand-accent
            </span>
          </div>
          <h3 className="text-h5 font-semibold text-foreground mt-3">
            Chromatic Accent Emphasis
          </h3>
          <p className="text-body-sm text-foreground-muted mt-2">
            Pills, callout tags, secondary CTAs, and KPI highlight badges.
            Guarantees high contrast against the canvas and primary brand
            surfaces without improvising low-opacity alpha tints.
          </p>
        </div>
      </div>

      {/* Semantic Swatches Grid with Click-to-Copy */}
      <div className="mb-14">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-h4 font-semibold text-foreground">
            Semantic Palette Swatches
          </h3>
          <span className="text-body-xs text-foreground-muted">
            Click any swatch to copy utility class
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {/* Primary */}
          <SwatchCard
            name="Primary Solid"
            token="--primary"
            className="bg-primary text-primary-foreground"
            copiedClass={copiedClass}
            onCopy={copyClass}
          />
          <SwatchCard
            name="Primary Subtle"
            token="--primary-subtle"
            className="bg-primary-subtle text-primary-on-subtle border border-border"
            copiedClass={copiedClass}
            onCopy={copyClass}
          />
          <SwatchCard
            name="Brand Deep"
            token="--primary-deep"
            className="bg-primary-deep text-primary-deep-foreground"
            copiedClass={copiedClass}
            onCopy={copyClass}
          />
          {/* Brand Accent */}
          <SwatchCard
            name="Accent Solid"
            token="--brand-accent"
            className="bg-brand-accent text-brand-accent-foreground"
            copiedClass={copiedClass}
            onCopy={copyClass}
          />
          <SwatchCard
            name="Accent Subtle"
            token="--brand-accent-subtle"
            className="bg-brand-accent-subtle text-brand-accent-on-subtle border border-brand-accent-border"
            copiedClass={copiedClass}
            onCopy={copyClass}
          />
          <SwatchCard
            name="Accent Border"
            token="--brand-accent-border"
            className="border-2 border-brand-accent-border bg-background"
            copiedClass={copiedClass}
            onCopy={copyClass}
          />
          {/* Foreground & Content */}
          <SwatchCard
            name="Foreground"
            token="--foreground"
            className="bg-foreground text-background"
            copiedClass={copiedClass}
            onCopy={copyClass}
          />
          <SwatchCard
            name="Muted Content"
            token="--foreground-muted"
            className="bg-foreground-muted text-background"
            copiedClass={copiedClass}
            onCopy={copyClass}
          />
          <SwatchCard
            name="Inverse Surface"
            token="--surface-inverse"
            className="bg-surface-inverse text-foreground-inverse"
            copiedClass={copiedClass}
            onCopy={copyClass}
          />
          {/* Status */}
          <SwatchCard
            name="Success Solid"
            token="--success"
            className="bg-success text-success-foreground"
            copiedClass={copiedClass}
            onCopy={copyClass}
          />
          <SwatchCard
            name="Warning Solid"
            token="--warning"
            className="bg-warning text-warning-foreground"
            copiedClass={copiedClass}
            onCopy={copyClass}
          />
          <SwatchCard
            name="Destructive Solid"
            token="--destructive"
            className="bg-destructive text-destructive-foreground"
            copiedClass={copiedClass}
            onCopy={copyClass}
          />
        </div>
      </div>

      {/* Category Label Chips */}
      <div id="labels" className="mb-14 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-4">
          <div>
            <h3 className="text-h4 font-semibold text-foreground">
              Non-Semantic Label Families
            </h3>
            <p className="text-body-sm text-foreground-muted mt-1 max-w-2xl">
              10 chromatic hues with 4 roles each (subtle, on-subtle, border,
              solid). Status colors communicate system health; labels categorize
              domain metadata.
            </p>
          </div>
          <span className="text-eyebrow font-mono uppercase text-foreground-muted mt-2 sm:mt-0">
            Semantic Separation
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {LABEL_SPECIMENS.map((specimen) => (
            <div
              key={specimen.hue}
              className="rounded-xl border border-border bg-card p-4 shadow-card"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-body-sm font-semibold text-foreground">
                  {specimen.label}
                </span>
                <span className="font-mono text-[10px] text-foreground-muted">
                  {specimen.hue}
                </span>
              </div>
              <div className="space-y-2">
                <div
                  className={cn(
                    "flex items-center justify-center rounded-md px-2.5 py-1 text-body-xs font-semibold border",
                    specimen.subtleClass,
                  )}
                >
                  Subtle Tag
                </div>
                <div
                  className={cn(
                    "flex items-center justify-center rounded-md px-2.5 py-1 text-body-xs font-semibold",
                    specimen.solidClass,
                  )}
                >
                  Solid Chip
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data & Charts Palette */}
      <div id="charts" className="scroll-mt-20">
        <h3 className="text-h4 font-semibold text-foreground mb-2">
          Data Visualization & Chart Series
        </h3>
        <p className="text-body-sm text-foreground-muted mb-6 max-w-3xl">
          Visual color tokens configured for charts, graphs, and heatmaps,
          strictly decoupled from system status primitives.
        </p>

        <div className="rounded-xl border border-border bg-card p-6 shadow-card space-y-6">
          {/* Categorical Series */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-body-sm font-semibold text-foreground">
                12 Categorical Series (Discrete Data)
              </span>
              <span className="text-body-xs font-mono text-foreground-muted">
                --chart-1 … --chart-12
              </span>
            </div>
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
              {CATEGORICAL_SERIES.map((item) => (
                <div key={item.token} className="group relative">
                  <div
                    className={cn(
                      "h-10 rounded-md border border-border shadow-xs",
                      item.className,
                    )}
                  />
                  <span className="mt-1 block font-mono text-[10px] text-foreground-muted truncate">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sequential Density Ramp */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-body-sm font-semibold text-foreground">
                Sequential Density Ramp (Low to High Intensity)
              </span>
              <span className="text-body-xs font-mono text-foreground-muted">
                --chart-seq-1 … --chart-seq-7
              </span>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {SEQUENTIAL_SERIES.map((item) => (
                <div key={item.token}>
                  <div
                    className={cn(
                      "h-8 rounded-md border border-border shadow-xs",
                      item.className,
                    )}
                  />
                  <span className="mt-1 block font-mono text-[10px] text-foreground-muted truncate">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Diverging Delta Ramp */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-body-sm font-semibold text-foreground">
                Diverging Delta Ramp (Negative → Neutral → Positive)
              </span>
              <span className="text-body-xs font-mono text-foreground-muted">
                --chart-div-neg-3 … --chart-div-pos-3
              </span>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {DIVERGING_SERIES.map((item) => (
                <div key={item.token}>
                  <div
                    className={cn(
                      "h-8 rounded-md border border-border shadow-xs",
                      item.className,
                    )}
                  />
                  <span className="mt-1 block font-mono text-[10px] text-foreground-muted truncate">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function SwatchCard({
  name,
  token,
  className,
  copiedClass,
  onCopy,
}: {
  name: string;
  token: string;
  className: string;
  copiedClass: string | null;
  onCopy: (className: string) => void;
}) {
  const isCopied = copiedClass === token;
  return (
    <button
      type="button"
      onClick={() => onCopy(token)}
      className="group flex flex-col rounded-xl border border-border bg-card p-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div
        className={cn(
          "h-12 w-full rounded-md flex items-center justify-center font-bold text-xs shadow-xs transition-transform group-hover:scale-[1.02]",
          className,
        )}
      >
        {isCopied ? <Check className="size-4" /> : "Aa"}
      </div>
      <div className="mt-2.5">
        <p className="text-body-xs font-semibold text-foreground truncate">
          {name}
        </p>
        <code className="mt-0.5 block font-mono text-[10px] text-foreground-muted truncate">
          {token}
        </code>
      </div>
    </button>
  );
}

/* --------------------------------------------------- 4. Surfaces & Elevation */

function SurfacesSection() {
  return (
    <Section id="surfaces" tone="sunken" className="py-16">
      <SectionHeading
        eyebrow="Surfaces & Elevation"
        title="Surfaces & Elevation"
        description={
          <>
            Six elevation levels designed for depth and hierarchy. Surfaces are
            pure semantic layers without arbitrary opacity hacks or decorative
            blur blobs.
          </>
        }
      />

      {/* Surface Ladder Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-12">
        {SURFACE_LADDER.map((step) => {
          const swatch = SURFACE_SWATCHES[step.token] ?? "bg-card";
          const ink = SURFACE_INK[step.token] ?? "text-foreground";
          return (
            <div
              key={step.token}
              className="rounded-xl border border-border bg-card p-5 shadow-card flex flex-col justify-between"
            >
              <div>
                <div
                  className={cn(
                    "h-16 w-full rounded-lg border border-border flex items-center justify-center font-mono text-body-xs font-semibold shadow-xs mb-4",
                    swatch,
                    ink,
                  )}
                >
                  --{step.token}
                </div>
                <h4 className="text-h5 font-semibold text-foreground capitalize">
                  {step.token.replace("-", " ")}
                </h4>
                <p className="text-body-sm text-foreground-muted mt-1.5">
                  {step.use}
                </p>
              </div>
              <p className="text-body-xs text-foreground-subtle mt-4 font-mono">
                light: {step.light} · dark: {step.dark}
              </p>
            </div>
          );
        })}
      </div>

      {/* Corner Radii & Shadows */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <h3 className="text-h4 font-semibold text-foreground mb-4">
          Elevation & Border Radius Tokens
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {RADIUS_SWATCHES.map((radius) => (
            <div
              key={radius.utility}
              className="flex flex-col items-center rounded-lg border border-border p-4 bg-background-subtle"
            >
              <div
                className={cn(
                  "size-14 border-2 border-primary bg-card shadow-card flex items-center justify-center text-body-xs font-mono font-bold text-primary",
                  radius.utility,
                )}
              >
                R
              </div>
              <span className="mt-3 font-mono text-body-xs font-semibold text-foreground">
                {radius.utility}
              </span>
              <span className="text-[11px] text-foreground-muted mt-0.5">
                {radius.use}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* --------------------------------------------------- 5. Typography */

function TypographySection() {
  return (
    <Section id="typography" tone="page" className="py-16">
      <SectionHeading
        eyebrow="Typography & Scale"
        title="Predictable Typographical Hierarchy"
        description={
          <>
            Every heading, body, and caption maps to a tested type utility.
            Fluid scaling guarantees legibility across handheld viewports and
            ultra-wide monitors.
          </>
        }
      />

      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Utility</TableHead>
              <TableHead>Specimen Preview</TableHead>
              <TableHead className="w-[200px]">Metrics</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {TYPE_SCALE.map((specimen) => (
              <TableRow key={specimen.utility}>
                <TableCell className="font-mono text-body-xs font-semibold text-link">
                  {specimen.utility}
                </TableCell>
                <TableCell>
                  <span className={specimen.utility}>
                    {specimen.utility === "text-display"
                      ? "Ship the framework, not the scaffold"
                      : specimen.utility === "text-eyebrow"
                        ? "REACT ROUTER · SUPABASE · CLOUDFLARE"
                        : specimen.utility === "text-body-xs"
                          ? "Fine print: token metadata, table cells and helper notes."
                          : "The quick brown fox jumps over the lazy dog"}
                  </span>
                </TableCell>
                <TableCell className="text-body-xs text-foreground-muted font-mono">
                  {specimen.size} · line-height {specimen.lineHeight}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Section>
  );
}

/* --------------------------------------------------- 6. Component Catalog */

function ComponentCatalogSection() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Section id="components" tone="sunken" className="py-16">
      <SectionHeading
        eyebrow="Component Catalog"
        title="Upstream shadcn/ui Component Library"
        description={
          <>
            Complete collection of interactive UI primitives styled with
            semantic tokens. Vendored cleanly in{" "}
            <code>app/components/ui/**</code> and wrapped as needed.
          </>
        }
      />

      <div className="space-y-12">
        {/* 1. Buttons & Actions */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
            <div>
              <h3 className="text-h4 font-semibold text-foreground">
                Buttons & Actions
              </h3>
              <p className="text-body-sm text-foreground-muted">
                Variants, sizes, loading states, and icon configurations.
              </p>
            </div>
            <span className="font-mono text-body-xs text-foreground-muted">
              Button.tsx
            </span>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-body-xs font-semibold uppercase text-foreground-muted mb-3">
                Variants
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <a
                  href="#colors"
                  className="text-link text-body-sm underline-offset-4 hover:underline font-medium"
                >
                  Link Style
                </a>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-body-xs font-semibold uppercase text-foreground-muted mb-3">
                Sizes & States
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon" aria-label="Settings">
                  <Settings className="size-4" />
                </Button>
                <Button className="gap-2">
                  <Rocket className="size-4" />
                  Leading Icon
                </Button>
                <Button variant="outline" className="gap-2">
                  Trailing Icon
                  <ArrowRight className="size-4" />
                </Button>
                <Button disabled>
                  <LoaderCircle className="size-4 animate-spin" />
                  Loading…
                </Button>
                <Button disabled data-state="disabled">
                  Disabled
                </Button>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-body-xs font-semibold uppercase text-foreground-muted mb-3">
                On-Dark / Inverted Surfaces (Hero &amp; Brand-Deep)
              </p>
              <div className="rounded-lg bg-surface-brand p-4 flex flex-wrap items-center gap-3">
                <Button variant="white">White Primary</Button>
                <Button variant="white-secondary">White Secondary</Button>
                <Button variant="white-outline">White Outline</Button>
                <Button variant="white" size="sm">
                  Small
                </Button>
                <Button variant="white-secondary" size="sm">
                  Small Glass
                </Button>
                <Button variant="white-outline" size="sm">
                  Small Outline
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Form Controls */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
            <div>
              <h3 className="text-h4 font-semibold text-foreground">
                Form Controls & Validation
              </h3>
              <p className="text-body-sm text-foreground-muted">
                Inputs, textareas, selects, checkboxes, switches, and validation
                states.
              </p>
            </div>
            <span className="font-mono text-body-xs text-foreground-muted">
              Input.tsx · Select.tsx
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Standard Input with Icon */}
            <div className="space-y-2">
              <Label htmlFor="catalog-search">Search Input</Label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 size-4 text-foreground-muted" />
                <Input
                  id="catalog-search"
                  className="pl-9"
                  placeholder="Search components…"
                />
              </div>
              <p className="text-body-xs text-foreground-subtle">
                Clear text input with leading iconography.
              </p>
            </div>

            {/* Form Validation (aria-invalid) */}
            <div className="space-y-2">
              <Label htmlFor="catalog-slug" className="text-destructive">
                Project Handle
              </Label>
              <Input
                id="catalog-slug"
                defaultValue="invalid handle!"
                aria-invalid="true"
              />
              <p className="text-body-xs text-destructive-on-subtle flex items-center gap-1 font-medium">
                <CircleX className="size-3.5" />
                aria-invalid paints the destructive ring.
              </p>
            </div>

            {/* Select Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="catalog-role">User Role</Label>
              <Select defaultValue="developer">
                <SelectTrigger id="catalog-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-body-xs text-foreground-subtle">
                Keyboard-accessible floating menu.
              </p>
            </div>

            {/* Textarea */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="catalog-notes">Project Notes</Label>
              <Textarea
                id="catalog-notes"
                placeholder="Write deployment instructions or comments…"
                rows={3}
              />
            </div>

            {/* Checkbox and Switches */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="catalog-checkbox" defaultChecked />
                <Label htmlFor="catalog-checkbox" className="text-body-sm">
                  Enable automated preview builds
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="catalog-switch" defaultChecked />
                <Label htmlFor="catalog-switch" className="text-body-sm">
                  Strict WCAG AA enforcement
                </Label>
              </div>
              <RadioGroup defaultValue="prod" className="flex gap-4 pt-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="staging" id="radio-staging" />
                  <Label htmlFor="radio-staging" className="text-body-xs">
                    Staging
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="prod" id="radio-prod" />
                  <Label htmlFor="radio-prod" className="text-body-xs">
                    Production
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        {/* 3. Cards & Dashboard Widgets */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
            <div>
              <h3 className="text-h4 font-semibold text-foreground">
                Cards & Dashboard Widgets
              </h3>
              <p className="text-body-sm text-foreground-muted">
                KPI stats, interactive cards, and high-visibility highlight
                panels.
              </p>
            </div>
            <span className="font-mono text-body-xs text-foreground-muted">
              Card.tsx
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Metric KPI Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-body-sm font-medium text-foreground-muted">
                  Monthly Active Users
                </CardTitle>
                <span className="inline-flex items-center gap-1 rounded-full bg-success-subtle border border-success-border px-2 py-0.5 text-body-xs font-semibold text-success-on-subtle">
                  <TrendingUp className="size-3" />
                  +24.6%
                </span>
              </CardHeader>
              <CardContent>
                <div className="text-display font-bold text-foreground">
                  42,890
                </div>
                <p className="text-body-xs text-foreground-subtle mt-1">
                  +8,120 net new accounts this cycle
                </p>
              </CardContent>
            </Card>

            {/* Action Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-h5">Edge Database Sync</CardTitle>
                <CardDescription>
                  Distributed Supabase replication across Cloudflare Workers.
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-2">
                <Button size="sm" variant="outline" className="w-full">
                  Configure Nodes
                </Button>
              </CardFooter>
            </Card>

            {/* Highlighted Feature Card with Small Punctuation Tag */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-accent-subtle border border-brand-accent-border px-2.5 py-0.5 text-body-xs font-semibold text-brand-accent-on-subtle">
                    <span className="size-1.5 rounded-full bg-brand-accent" />
                    RECOMMENDED
                  </span>
                  <span className="text-[11px] font-mono text-foreground-muted">
                    v2.4
                  </span>
                </div>
                <h4 className="text-h5 font-semibold text-foreground mt-3">
                  Automatic Type Strip
                </h4>
                <p className="text-body-sm text-foreground-muted mt-1.5">
                  Native TypeScript parsing runs on Node 22+ with zero runtime
                  transpilation overhead.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                <span className="text-body-xs font-medium text-link">
                  Learn more →
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Badges & Status Families */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
            <div>
              <h3 className="text-h4 font-semibold text-foreground">
                Badges & Status Families
              </h3>
              <p className="text-body-sm text-foreground-muted">
                Compact pills for metadata, counts, and system health status.
              </p>
            </div>
            <span className="font-mono text-body-xs text-foreground-muted">
              Badge.tsx
            </span>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-body-xs font-semibold uppercase text-foreground-muted mb-3">
                Badge Variants
              </p>
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-accent-subtle border border-brand-accent-border px-2.5 py-0.5 text-body-xs font-semibold text-brand-accent-on-subtle">
                  <span className="size-1.5 rounded-full bg-brand-accent" />
                  Accent Pill Tag
                </span>
                <span className="inline-flex items-center rounded-full bg-primary-subtle border border-border px-2.5 py-0.5 text-body-xs font-semibold text-primary-on-subtle">
                  Soft Primary
                </span>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-body-xs font-semibold uppercase text-foreground-muted mb-3">
                Status Family Indicators
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {STATUS_SPECIMENS.map((status) => {
                  const Icon = status.icon;
                  return (
                    <div
                      key={status.name}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg border p-3",
                        status.panel,
                      )}
                    >
                      <Icon className="size-4 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-body-xs font-semibold capitalize">
                          {status.name}
                        </p>
                        <p className="text-[11px] opacity-90 truncate">
                          {status.meaning}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 5. Feedback, Alerts & Skeletons */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
            <div>
              <h3 className="text-h4 font-semibold text-foreground">
                Feedback, Alerts & Skeletons
              </h3>
              <p className="text-body-sm text-foreground-muted">
                System notifications, progress indicators, and loading
                skeletons.
              </p>
            </div>
            <span className="font-mono text-body-xs text-foreground-muted">
              Alert.tsx · Skeleton.tsx
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <Alert>
                <Info className="size-4" />
                <AlertTitle>Cloudflare Edge Routing</AlertTitle>
                <AlertDescription>
                  Assets are served from 330+ edge data centers with automatic
                  HTTP/3 negotiation.
                </AlertDescription>
              </Alert>

              <Alert variant="destructive">
                <TriangleAlert className="size-4" />
                <AlertTitle>Storage Threshold Warning</AlertTitle>
                <AlertDescription>
                  R2 bucket storage utilization has reached 88% of default tier.
                </AlertDescription>
              </Alert>
            </div>

            <div className="rounded-xl border border-border bg-background-subtle p-5 space-y-4">
              <p className="text-body-xs font-semibold uppercase text-foreground-muted">
                Loading Skeleton States
              </p>
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                  <Skeleton className="h-3 w-1/2 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          </div>
        </div>

        {/* 5. Navigation, Tabs & Data Table */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
            <div>
              <h3 className="text-h4 font-semibold text-foreground">
                Navigation & Data Tables
              </h3>
              <p className="text-body-sm text-foreground-muted">
                Breadcrumbs, tabs, sortable table rows, and interactive dialogs.
              </p>
            </div>
            <span className="font-mono text-body-xs text-foreground-muted">
              Tabs.tsx · Table.tsx · Dialog.tsx
            </span>
          </div>

          {/* Breadcrumb Trail */}
          <div className="mb-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/about">Docs</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Design System</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Tabs and Data Table */}
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <TabsList>
                <TabsTrigger value="all">All Members (3)</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
              </TabsList>

              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1.5 self-start sm:self-auto">
                    <User className="size-3.5" />
                    Invite Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite team member</DialogTitle>
                    <DialogDescription>
                      Send an invitation link to collaborate on this workspace.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 py-2">
                    <Label htmlFor="modal-email">Email address</Label>
                    <Input id="modal-email" placeholder="sarah@company.com" />
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Send Invite</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <TabsContent value="all" className="mt-0">
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="size-7">
                            <AvatarFallback>VR</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-body-sm font-semibold text-foreground">
                              Vishal Ranjan
                            </p>
                            <p className="text-[11px] text-foreground-muted">
                              vishal@example.com
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-body-xs">Owner</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 rounded-full bg-success-subtle border border-success-border px-2 py-0.5 text-[11px] font-semibold text-success-on-subtle">
                          <CircleCheck className="size-3" />
                          Verified
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                              aria-label="Actions"
                            >
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>
                              Change Permissions
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              Revoke Access
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="size-7">
                            <AvatarFallback>AL</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-body-sm font-semibold text-foreground">
                              Alex Liu
                            </p>
                            <p className="text-[11px] text-foreground-muted">
                              alex.liu@example.com
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-body-xs">Developer</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 rounded-full bg-success-subtle border border-success-border px-2 py-0.5 text-[11px] font-semibold text-success-on-subtle">
                          <CircleCheck className="size-3" />
                          Active
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          aria-label="Actions"
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="size-7">
                            <AvatarFallback>MK</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-body-sm font-semibold text-foreground">
                              Maya Patel
                            </p>
                            <p className="text-[11px] text-foreground-muted">
                              maya@example.com
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-body-xs">Designer</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 rounded-full bg-info-subtle border border-info-border px-2 py-0.5 text-[11px] font-semibold text-info-on-subtle">
                          <Info className="size-3" />
                          Invited
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          aria-label="Actions"
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="active" className="mt-0">
              <div className="p-8 text-center text-body-sm text-foreground-muted border border-border rounded-lg">
                Showing 2 active members with confirmed SSO logins.
              </div>
            </TabsContent>

            <TabsContent value="pending" className="mt-0">
              <div className="p-8 text-center text-body-sm text-foreground-muted border border-border rounded-lg">
                1 pending invitation waiting for user confirmation.
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Section>
  );
}

/* --------------------------------------------------- 7. Patterns */

const STACK_LOGOS = [
  { label: "React Router 8" },
  { label: "Supabase" },
  { label: "Cloudflare Workers" },
  { label: "Tailwind v4" },
  { label: "Vitest + Playwright" },
];

const TOKEN_SNIPPET = `/* app/globals.css — Tier 2 never writes a hex */
--primary: var(--p-brand-600);
--foreground-subtle: var(--p-neutral-450);`;

const SPARKLINE_POINTS = "0,26 16,22 32,24 48,16 64,18 80,10 96,13 112,5";

function HeroDashboardVisual() {
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

const SPECIMENS: Record<string, ReactNode> = {
  Section: (
    <div>
      {(["page", "raised", "sunken", "inverse", "brand-deep"] as const).map(
        (tone) => (
          <Section
            key={tone}
            tone={tone}
            size="sm"
            className="border-b border-border"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-inherit font-mono text-body-xs">
                {`<Section tone="${tone}" size="sm">`}
              </p>
              {tone === "brand-deep" && (
                <div className="flex items-center gap-3">
                  <span className="text-body-xs text-foreground-muted">
                    Auto-inverting dark context
                  </span>
                  <Button variant="outline" size="sm">
                    Outline Button
                  </Button>
                </div>
              )}
            </div>
          </Section>
        ),
      )}
      <Section
        tone="page"
        theme="dark"
        size="sm"
        className="border-b border-border"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-foreground font-mono text-body-xs">
            {`<Section tone="page" theme="dark" size="sm">`}
          </p>
          <div className="flex items-center gap-3">
            <span className="text-body-xs text-foreground-muted">
              Explicit dark island on any page
            </span>
            <Button size="sm">Primary</Button>
            <Button variant="outline" size="sm">
              Outline
            </Button>
          </div>
        </div>
      </Section>
    </div>
  ),
  SectionHeading: (
    <SectionHeading
      className="container-page"
      eyebrow="Section heading"
      title="A heading that owns the top of a band"
      description="Eyebrow, title, lede and an optional aside, in the order a reader scans them."
      aside={<Badge variant="outline">aside slot</Badge>}
    />
  ),
  Hero: (
    <Hero
      tone="brand-deep"
      eyebrow="React Router 8 · Supabase · Cloudflare Workers"
      title="The edge-first full-stack starter built for scale"
      lede="SSR on Cloudflare Workers, auth and storage wired to Supabase, and a three-tier design system — clone it, rename it, ship it."
      primary={
        <Button size="lg" variant="white" asChild>
          <Link to="/design-system">
            Explore the design system
            <ArrowRight aria-hidden="true" className="size-4" />
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
          <HeroDashboardVisual />
          <div className="absolute -bottom-5 left-6 inline-flex items-center gap-1.5 rounded-full border border-success-border bg-success-subtle px-3 py-1 text-body-xs font-semibold text-success-on-subtle shadow-pop">
            <Check aria-hidden="true" className="size-3.5" />
            Supabase Auth Hydrated
          </div>
        </div>
      }
      trust={<LogoStrip items={STACK_LOGOS} />}
    />
  ),
  PageHeader: (
    <PageHeader
      eyebrow="Page header"
      title="An app or info page starts here"
      description="The title block of a secondary page — a full-bleed band, not a box centred on the canvas."
    />
  ),
  CtaBand: (
    <CtaBand
      tone="inverse"
      title="The closing ask"
      description="Full-bleed, copy left, actions right. This specimen uses the inverse tone; the page you are reading ends on the brand tone."
      actions={
        <Button variant="secondary" size="lg">
          Start a project
        </Button>
      }
    />
  ),
  FeatureCard: (
    <div className="container-page grid gap-4 py-8 md:grid-cols-2">
      <FeatureCard
        icon={<Rocket aria-hidden="true" />}
        title="Type-safe from edge to database"
        description="One capability per card. The hover is a border and a shadow, never a fill."
        href="/about"
      />
      <FeatureCard
        icon={<Database aria-hidden="true" />}
        title="Auth you can delete"
        description="Each provider sits behind a flag, so removing a method removes its code too."
      />
    </div>
  ),
  IconTile: (
    <div className="container-page flex flex-wrap items-center gap-6 py-8">
      <IconTile size="sm">
        <Copy aria-hidden="true" />
      </IconTile>
      <IconTile>
        <Database aria-hidden="true" />
      </IconTile>
      <IconTile tone="brand" size="lg">
        <ShieldCheck aria-hidden="true" />
      </IconTile>
      <p className="text-foreground-muted max-w-xs text-body-sm">
        Muted by default; <code>tone="brand"</code> at most once per page.
      </p>
    </div>
  ),
  CodeBlock: (
    <div className="container-page py-8">
      <CodeBlock filename="app/globals.css" code={TOKEN_SNIPPET} />
    </div>
  ),
  LogoStrip: (
    <div className="container-page py-8">
      <LogoStrip items={STACK_LOGOS} />
    </div>
  ),
};

function PatternsSection() {
  return (
    <Section id="patterns" tone="page" className="py-16">
      <SectionHeading
        eyebrow="Page Composition"
        title="Nine Reusable Layout Pattern Recipes"
        description={
          <>
            A recipe is the only place a layout decision is made. Build from{" "}
            <code>app/components/patterns/*</code>; extend with{" "}
            <code>className</code> and never fork copies into routes.
          </>
        }
      />

      <div className="space-y-8">
        {PATTERNS.map((pattern) => {
          const specimen = SPECIMENS[pattern.name];
          return (
            <article
              key={pattern.name}
              className="rounded-xl border border-border bg-card shadow-card overflow-hidden"
            >
              <header className="bg-background-subtle border-b border-border px-5 py-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-h5 text-foreground font-semibold">
                    {pattern.name}
                  </h3>
                  <p className="text-foreground-muted font-mono text-body-xs">
                    app/components/patterns/{pattern.file}
                  </p>
                </div>
                <p className="text-foreground-muted mt-2 max-w-3xl text-body-sm">
                  {pattern.useWhen}
                </p>
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                  {pattern.props.map((prop) => (
                    <li
                      key={prop}
                      className="text-foreground font-mono text-body-xs"
                    >
                      {prop}
                    </li>
                  ))}
                </ul>
              </header>
              {specimen ?? (
                <p className="p-5">
                  <Badge variant="destructive">
                    {pattern.name} has no specimen
                  </Badge>
                </p>
              )}
            </article>
          );
        })}
      </div>
    </Section>
  );
}

/* --------------------------------------------------- 8. States & Focus */

function StatesSection() {
  return (
    <Section id="states" tone="raised" className="py-16">
      <SectionHeading
        eyebrow="Interactive States"
        title="Micro-Interactions & The 3:1 Focus Chain"
        description={
          <>
            Every interactive state maps to an explicit token step, not an
            opacity cheat. Focus rings preserve a 3:1 contrast ratio against
            both the control fill and the surrounding page canvas.
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {STATES.map((state) => (
          <div
            key={state.name}
            className="rounded-xl border border-border bg-card p-4 shadow-card"
          >
            <ThemePair>
              {() => (
                <div
                  data-state={state.name.toLowerCase()}
                  className={cn(
                    "flex h-14 items-center justify-center rounded-md text-body-sm font-medium",
                    state.classes,
                  )}
                >
                  {state.name}
                </div>
              )}
            </ThemePair>
            <p className="text-foreground-muted mt-3 font-mono text-body-xs">
              {state.classes}
            </p>
            <p className="text-foreground-muted mt-1 text-body-xs">
              {state.note}
            </p>
          </div>
        ))}
      </div>

      {/* Focus Chain Demonstration */}
      <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-card">
        <h3 className="text-h4 font-semibold text-foreground mb-2">
          WCAG 3:1 Focus Ring Chain Demonstrator
        </h3>
        <p className="text-body-sm text-foreground-muted mb-6 max-w-3xl">
          Tab to the buttons below. The outer ring is <code>border-ring</code>{" "}
          and <code>ring-[3px] ring-ring/50</code>, separated from the button
          fill by a 2px gap via{" "}
          <code>ring-offset-2 ring-offset-ring-offset</code>. This mechanical
          separation guarantees WCAG AA compliance across dark and light modes.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <Button>Tab to Focus Me</Button>
          <Button variant="outline">Outline Button</Button>
          <a
            href="#colors"
            className="text-link font-medium underline underline-offset-4"
          >
            Inline Link Focus
          </a>
        </div>
      </div>
    </Section>
  );
}

/* --------------------------------------------------- 9. Best Practices */

function RulesSection() {
  return (
    <Section id="rules" tone="sunken" className="py-16">
      <SectionHeading
        eyebrow="Engineering Best Practices"
        title="Design System Best Practices: Do's & Don'ts"
        description={
          <>
            Prose translation of <code>AGENTS.md</code> and{" "}
            <code>DESIGN.md</code> rules. Automated checks in{" "}
            <code>npm run check:ds</code> mechanically reject violations on CI.
          </>
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Do's */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="text-h4 font-semibold text-foreground mb-4 flex items-center gap-2">
            <CircleCheck className="size-5 text-link" />
            Engineering Do&apos;s
          </h3>
          <ul className="space-y-3 text-body-sm text-foreground-muted">
            <li className="flex items-start gap-2">
              <Check className="size-4 text-link mt-0.5 shrink-0" />
              <span>
                Build all pages using pattern recipes (<code>Section</code>,{" "}
                <code>Hero</code>, <code>FeatureCard</code>,{" "}
                <code>CtaBand</code>
                ).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="size-4 text-link mt-0.5 shrink-0" />
              <span>
                Take color strictly from semantic tokens: <code>bg-card</code>,{" "}
                <code>text-foreground-muted</code>, <code>border-border</code>.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="size-4 text-link mt-0.5 shrink-0" />
              <span>
                Default to Single-Primary brand mode. If enabled, restrict{" "}
                <code>--brand-accent</code> strictly to tiny punctuation (8px
                indicator dots, small pill tags).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="size-4 text-link mt-0.5 shrink-0" />
              <span>
                Verify both light and dark themes on every UI modification.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="size-4 text-link mt-0.5 shrink-0" />
              <span>
                Use <code>text-link</code> for brand text to satisfy the 4.5:1
                reading floor.
              </span>
            </li>
          </ul>
        </div>

        {/* Don'ts */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="text-h4 font-semibold text-foreground mb-4 flex items-center gap-2">
            <CircleX className="size-5 text-destructive" />
            Engineering Don&apos;ts
          </h3>
          <ul className="space-y-3 text-body-sm text-foreground-muted">
            <li className="flex items-start gap-2">
              <CircleX className="size-4 text-destructive mt-0.5 shrink-0" />
              <span>
                Never use brand or status colors at low alpha as surface fills (
                <code>{BANNED_SURFACE_FILL}</code>).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CircleX className="size-4 text-destructive mt-0.5 shrink-0" />
              <span>
                Never write hardcoded hex values or arbitrary RGB strings in app
                code.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CircleX className="size-4 text-destructive mt-0.5 shrink-0" />
              <span>
                Never use decorative blur blobs or fake opacity tints on color
                utilities.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CircleX className="size-4 text-destructive mt-0.5 shrink-0" />
              <span>
                Never use <code>--brand-accent</code> on buttons, cards, or hero
                backgrounds — primary CTAs must always use{" "}
                <code>bg-primary</code>.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CircleX className="size-4 text-destructive mt-0.5 shrink-0" />
              <span>
                Never place raw boxed CTAs floating in whitespace — use{" "}
                <code>CtaBand</code>.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CircleX className="size-4 text-destructive mt-0.5 shrink-0" />
              <span>
                Never edit <code>app/components/ui/**</code> directly; wrap it
                and record changes in <code>PATCHES.md</code>.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </Section>
  );
}

/* --------------------------------------------------- 10. Technical Specs */

function TechnicalSpecsSection() {
  return (
    <Section id="specs" tone="page" className="py-16">
      <SectionHeading
        eyebrow="Verification & Architecture"
        title="Technical Specifications & WCAG Audit Ledger"
        description={
          <>
            Complete architectural contract: in-browser verified contrast ratios
            for all 57 token pairs and dictionary of all 165 Tier-2 tokens.
          </>
        }
      />

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <p className="text-body-xs font-medium text-foreground-muted">
            Verified Contrast Pairs
          </p>
          <p className="text-display font-bold text-foreground mt-1">57 / 57</p>
          <span className="text-[11px] font-semibold text-success flex items-center gap-1 mt-1">
            <CircleCheck className="size-3" />
            100% WCAG AA Passing
          </span>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <p className="text-body-xs font-medium text-foreground-muted">
            Tier-2 Semantic Tokens
          </p>
          <p className="text-display font-bold text-foreground mt-1">165</p>
          <span className="text-[11px] font-semibold text-link flex items-center gap-1 mt-1">
            <Check className="size-3" />
            Fully Referenced
          </span>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <p className="text-body-xs font-medium text-foreground-muted">
            Text Contrast Floor
          </p>
          <p className="text-display font-bold text-foreground mt-1">4.5:1</p>
          <span className="text-[11px] text-foreground-subtle mt-1 block">
            Body & Heading Content
          </span>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <p className="text-body-xs font-medium text-foreground-muted">
            Boundary Contrast Floor
          </p>
          <p className="text-display font-bold text-foreground mt-1">3.0:1</p>
          <span className="text-[11px] text-foreground-subtle mt-1 block">
            Focus Rings & Charts
          </span>
        </div>
      </div>

      {/* Architecture & Contract Blueprint Card */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-link" />
              <h3 className="text-h4 font-semibold text-foreground">
                Authoritative AI Specification & Contract Dictionary
              </h3>
            </div>
            <p className="text-body-sm text-foreground-muted">
              To keep the live showcase focused on components, interactions, and
              design guidance, the exhaustive 165-token reference table, 57-pair
              WCAG contrast manifest, and copy-pasteable TSX blueprints are
              canonically documented in the root design handbook.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-background-subtle border border-border px-2.5 py-1 text-body-xs font-mono text-foreground-muted">
                <code>165 Tier-2 Tokens</code>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-background-subtle border border-border px-2.5 py-1 text-body-xs font-mono text-foreground-muted">
                <code>57 Contrast Pairs (4.5:1 / 3.0:1)</code>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-background-subtle border border-border px-2.5 py-1 text-body-xs font-mono text-foreground-muted">
                <code>10 UI Pattern Recipes</code>
              </span>
            </div>
          </div>
          <div className="shrink-0">
            <a
              href="https://github.com/vishal-ranjan-codes/react-router-supabase-framework/blob/main/DESIGN.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary hover:bg-primary-hover text-primary-foreground font-semibold px-5 py-2.5 text-body-xs shadow-xs transition-colors"
            >
              Read Full Specification in DESIGN.md &rarr;
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}
