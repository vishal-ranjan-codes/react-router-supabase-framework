import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon" className="size-touch-min">
          <Menu className="size-icon-md" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-[320px] sm:w-[400px] sm:max-w-none px-6 pt-2 pb-6 gap-0"
      >
        <div className="flex h-14 items-center justify-end -mr-3">
          <SheetClose className="inline-flex size-touch-min items-center justify-center rounded-md outline-none transition-colors duration-base ease-standard hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50">
            <X className="size-icon-md" />
            <span className="sr-only">Close menu</span>
          </SheetClose>
        </div>
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <nav className="flex flex-col">
          <div className="border-b">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="getting-started">
                <AccordionTrigger className="text-foreground">
                  Getting Started
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-1 pl-4 pb-3">
                    <Link
                      to="/"
                      className="nav-menu-item py-2.5"
                      onClick={() => setOpen(false)}
                    >
                      Introduction
                    </Link>
                    <Link
                      to="/design-system"
                      className="nav-menu-item py-2.5"
                      onClick={() => setOpen(false)}
                    >
                      Design System
                    </Link>
                    <Link
                      to="/"
                      className="nav-menu-item py-2.5"
                      onClick={() => setOpen(false)}
                    >
                      Installation
                    </Link>
                    <Link
                      to="/"
                      className="nav-menu-item py-2.5"
                      onClick={() => setOpen(false)}
                    >
                      Configuration
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="components">
                <AccordionTrigger className="text-foreground">
                  Components
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-1 pl-4 pb-3">
                    <Link
                      to="/design-system#components"
                      className="nav-menu-item py-2.5"
                      onClick={() => setOpen(false)}
                    >
                      Form Elements
                    </Link>
                    <Link
                      to="/design-system#components"
                      className="nav-menu-item py-2.5"
                      onClick={() => setOpen(false)}
                    >
                      Navigation
                    </Link>
                    <Link
                      to="/design-system#components"
                      className="nav-menu-item py-2.5"
                      onClick={() => setOpen(false)}
                    >
                      Feedback
                    </Link>
                    <Link
                      to="/design-system#components"
                      className="nav-menu-item py-2.5"
                      onClick={() => setOpen(false)}
                    >
                      Data Display
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="examples">
                <AccordionTrigger className="text-foreground">
                  Examples
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-1 pl-4 pb-3">
                    <Link
                      to="/about"
                      className="nav-menu-item py-2.5"
                      onClick={() => setOpen(false)}
                    >
                      About Page
                    </Link>
                    <Link
                      to="/contact"
                      className="nav-menu-item py-2.5"
                      onClick={() => setOpen(false)}
                    >
                      Contact Page
                    </Link>
                    <Link
                      to="/design-system"
                      className="nav-menu-item py-2.5"
                      onClick={() => setOpen(false)}
                    >
                      Design System
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <Link
            to="/about"
            className="flex items-center border-b py-4 text-sm font-medium text-foreground no-underline transition-colors duration-base ease-standard hover:underline"
            onClick={() => setOpen(false)}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="flex items-center py-4 text-sm font-medium text-foreground no-underline transition-colors duration-base ease-standard hover:underline"
            onClick={() => setOpen(false)}
          >
            Contact
          </Link>

          <Button
            variant="default"
            className="mt-6 w-full min-h-(--size-touch-min)"
            asChild
          >
            <Link to="/sign-in" onClick={() => setOpen(false)}>
              Sign In
            </Link>
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
