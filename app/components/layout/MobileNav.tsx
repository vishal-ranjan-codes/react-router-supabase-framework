import { Menu } from 'lucide-react'
import { Link } from 'react-router'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '~/components/ui/sheet'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '~/components/ui/accordion'

export default function MobileNav() {
    const [open, setOpen] = useState(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="w-9 h-9">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                    <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-6">
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="getting-started">
                            <AccordionTrigger className="theme-fc-base">
                                Getting Started
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="flex flex-col gap-2 pl-4">
                                    <Link
                                        to="/"
                                        className="nav-menu-item py-2"
                                        onClick={() => setOpen(false)}
                                    >
                                        Introduction
                                    </Link>
                                    <Link
                                        to="/design-system"
                                        className="nav-menu-item py-2"
                                        onClick={() => setOpen(false)}
                                    >
                                        Design System
                                    </Link>
                                    <Link
                                        to="/"
                                        className="nav-menu-item py-2"
                                        onClick={() => setOpen(false)}
                                    >
                                        Installation
                                    </Link>
                                    <Link
                                        to="/"
                                        className="nav-menu-item py-2"
                                        onClick={() => setOpen(false)}
                                    >
                                        Configuration
                                    </Link>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="components">
                            <AccordionTrigger className="theme-fc-base">
                                Components
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="flex flex-col gap-2 pl-4">
                                    <Link
                                        to="/design-system#components"
                                        className="nav-menu-item py-2"
                                        onClick={() => setOpen(false)}
                                    >
                                        Form Elements
                                    </Link>
                                    <Link
                                        to="/design-system#components"
                                        className="nav-menu-item py-2"
                                        onClick={() => setOpen(false)}
                                    >
                                        Navigation
                                    </Link>
                                    <Link
                                        to="/design-system#components"
                                        className="nav-menu-item py-2"
                                        onClick={() => setOpen(false)}
                                    >
                                        Feedback
                                    </Link>
                                    <Link
                                        to="/design-system#components"
                                        className="nav-menu-item py-2"
                                        onClick={() => setOpen(false)}
                                    >
                                        Data Display
                                    </Link>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="examples">
                            <AccordionTrigger className="theme-fc-base">
                                Examples
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="flex flex-col gap-2 pl-4">
                                    <Link
                                        to="/about"
                                        className="nav-menu-item py-2"
                                        onClick={() => setOpen(false)}
                                    >
                                        About Page
                                    </Link>
                                    <Link
                                        to="/contact"
                                        className="nav-menu-item py-2"
                                        onClick={() => setOpen(false)}
                                    >
                                        Contact Page
                                    </Link>
                                    <Link
                                        to="/design-system"
                                        className="nav-menu-item py-2"
                                        onClick={() => setOpen(false)}
                                    >
                                        Design System
                                    </Link>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <div className="border-t theme-border-color pt-4 flex flex-col gap-2">
                        <Link
                            to="/about"
                            className="nav-menu-item py-2"
                            onClick={() => setOpen(false)}
                        >
                            About
                        </Link>
                        <Link
                            to="/contact"
                            className="nav-menu-item py-2"
                            onClick={() => setOpen(false)}
                        >
                            Contact
                        </Link>
                    </div>

                    <Button variant="default" className="mt-4" asChild>
                        <Link to="/sign-in" onClick={() => setOpen(false)}>
                            Sign In
                        </Link>
                    </Button>
                </nav>
            </SheetContent>
        </Sheet>
    )
}
