import { ArrowRight, ExternalLink, Menu, X } from "lucide-react";
import { useState } from "react";
import { Form, Link, useRouteLoaderData } from "react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { type NavLinkItem, PRIMARY_NAV_CONFIG } from "~/config/navigation";
import type { SessionUser } from "~/lib/context";

function MobileNavLinkRow({
  item,
  onSelect,
}: {
  item: NavLinkItem;
  onSelect: () => void;
}) {
  const Icon = item.icon;
  const content = (
    <div className="flex min-h-touch-min items-center gap-3 py-1.5">
      {Icon && (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-background-subtle text-muted-foreground">
          <Icon className="size-4" />
        </span>
      )}
      <div className="flex-1 space-y-0.5">
        <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          <span>{item.label}</span>
          {item.badge && (
            <Badge
              variant={item.badge.variant ?? "secondary"}
              className="px-1.5 py-0 text-[10px]"
            >
              {item.badge.text}
            </Badge>
          )}
          {item.external && (
            <ExternalLink className="size-3 text-muted-foreground" />
          )}
        </div>
        {item.description && (
          <p className="line-clamp-1 text-xs text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </div>
  );

  if (item.external) {
    return (
      <a
        href={item.to}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onSelect}
        className="block rounded-md px-2 transition-colors duration-base ease-standard hover:bg-accent"
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      to={item.to}
      onClick={onSelect}
      className="block rounded-md px-2 transition-colors duration-base ease-standard hover:bg-accent"
    >
      {content}
    </Link>
  );
}

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const rootData = useRouteLoaderData<{ user: SessionUser | null }>("root");
  const user = rootData?.user ?? null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon" className="size-touch-min">
          <Menu className="size-icon-md" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex h-full w-[320px] sm:w-[380px] p-0 flex-col gap-0 bg-card border-l border-border shadow-sheet"
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

        {/* 1. FIXED TOP ROW: Left side left empty per user instruction, close button pinned on right */}
        <div className="flex h-14 items-center justify-end px-4 border-b border-border shrink-0 bg-card">
          <SheetClose className="inline-flex size-touch-min items-center justify-center rounded-md outline-none transition-colors duration-base ease-standard hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50">
            <X className="size-icon-md text-foreground" />
            <span className="sr-only">Close navigation menu</span>
          </SheetClose>
        </div>

        {/* 2. SCROLLABLE BODY: Independent scroll container with momentum scrolling */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-3">
          <Accordion type="single" collapsible className="w-full">
            {PRIMARY_NAV_CONFIG.map((item) => {
              // 1. Direct Flat Link
              if (item.type === "link") {
                return (
                  <div key={item.label} className="border-b border-border">
                    <Link
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className="flex min-h-touch-min items-center py-3.5 text-base font-medium text-foreground transition-colors duration-base ease-standard hover:text-link"
                    >
                      {item.label}
                    </Link>
                  </div>
                );
              }

              // 2. Mega Menu (Features)
              if (item.type === "mega-menu") {
                return (
                  <AccordionItem key={item.label} value={item.label}>
                    <AccordionTrigger className="text-base font-medium text-foreground py-3.5 hover:no-underline">
                      {item.label}
                    </AccordionTrigger>
                    <AccordionContent className="pb-3 pt-1">
                      {/* Featured Spotlight Card */}
                      <Link
                        to={item.featured.to}
                        onClick={() => setOpen(false)}
                        className="mb-3 block rounded-lg border border-border bg-background-subtle p-3 transition-colors duration-base ease-standard hover:border-border-strong group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                            {item.featured.tagline}
                          </span>
                          {item.featured.badge && (
                            <Badge variant="outline" className="text-[10px]">
                              {item.featured.badge}
                            </Badge>
                          )}
                        </div>
                        <div className="mt-1 text-sm font-semibold text-foreground group-hover:text-primary">
                          {item.featured.title}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                          {item.featured.description}
                        </p>
                        <div className="mt-2.5 flex items-center gap-1 text-xs font-medium text-primary">
                          <span>{item.featured.ctaText ?? "Learn more"}</span>
                          <ArrowRight className="size-3" />
                        </div>
                      </Link>

                      {/* Categorized sub-items */}
                      <div className="space-y-3">
                        {item.groups.map((group) => (
                          <div key={group.title} className="space-y-0.5">
                            <h4 className="px-2 pt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                              {group.title}
                            </h4>
                            <div className="space-y-0.5">
                              {group.items.map((subItem) => (
                                <MobileNavLinkRow
                                  key={subItem.label}
                                  item={subItem}
                                  onSelect={() => setOpen(false)}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              }

              // 3. Grouped Dropdown (Resources)
              if (item.type === "grouped-dropdown") {
                return (
                  <AccordionItem key={item.label} value={item.label}>
                    <AccordionTrigger className="text-base font-medium text-foreground py-3.5 hover:no-underline">
                      {item.label}
                    </AccordionTrigger>
                    <AccordionContent className="pb-3 pt-1">
                      <div className="space-y-3">
                        {item.groups.map((group) => (
                          <div key={group.title} className="space-y-0.5">
                            <h4 className="px-2 pt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                              {group.title}
                            </h4>
                            <div className="space-y-0.5">
                              {group.items.map((subItem) => (
                                <MobileNavLinkRow
                                  key={subItem.label}
                                  item={subItem}
                                  onSelect={() => setOpen(false)}
                                />
                              ))}
                            </div>
                          </div>
                        ))}

                        {item.footerAction && (
                          <Link
                            to={item.footerAction.to}
                            onClick={() => setOpen(false)}
                            className="mt-2 flex items-center justify-between rounded-md border border-border bg-background-subtle p-2.5 text-xs text-muted-foreground transition-colors hover:bg-accent"
                          >
                            <div>
                              <span className="font-semibold text-foreground">
                                {item.footerAction.label}:
                              </span>{" "}
                              <span>{item.footerAction.description}</span>
                            </div>
                            <ArrowRight className="size-3.5 shrink-0" />
                          </Link>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              }

              // 4. Simple Dropdown (Company)
              if (item.type === "simple-dropdown") {
                return (
                  <AccordionItem key={item.label} value={item.label}>
                    <AccordionTrigger className="text-base font-medium text-foreground py-3.5 hover:no-underline">
                      {item.label}
                    </AccordionTrigger>
                    <AccordionContent className="pb-3 pt-1">
                      <div className="space-y-0.5">
                        {item.items.map((subItem) => (
                          <MobileNavLinkRow
                            key={subItem.label}
                            item={subItem}
                            onSelect={() => setOpen(false)}
                          />
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              }

              return null;
            })}
          </Accordion>
        </div>

        {/* 3. PINNED FOOTER: Dynamic Auth buttons matching desktop state */}
        <div className="p-4 border-t border-border shrink-0 bg-card space-y-2">
          {user ? (
            <>
              <Button
                variant="default"
                className="w-full min-h-touch-min"
                asChild
              >
                <Link to="/dashboard" onClick={() => setOpen(false)}>
                  Dashboard
                </Link>
              </Button>
              <Form method="post" action="/sign-out">
                <Button
                  variant="outline"
                  className="w-full min-h-touch-min"
                  type="submit"
                  onClick={() => setOpen(false)}
                >
                  Sign Out
                </Button>
              </Form>
            </>
          ) : (
            <>
              <Button
                variant="default"
                className="w-full min-h-touch-min"
                asChild
              >
                <Link to="/sign-in" onClick={() => setOpen(false)}>
                  Sign In
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full min-h-touch-min"
                asChild
              >
                <Link to="/sign-up" onClick={() => setOpen(false)}>
                  Sign Up
                </Link>
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
