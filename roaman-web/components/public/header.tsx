"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Search, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/browse">
                <Search className="mr-2 h-4 w-4" />
                Browse
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/about">About</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/contact">Contact</Link>
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" className="hidden md:flex" asChild>
            <Link href="/auth/hotel/login">For Hotels</Link>
          </Button>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  href="/browse"
                  className="flex items-center gap-2 text-lg font-medium"
                >
                  <Search className="h-5 w-5" />
                  Browse Hotels
                </Link>
                <Link
                  href="/about"
                  className="flex items-center gap-2 text-lg font-medium"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="flex items-center gap-2 text-lg font-medium"
                >
                  Contact
                </Link>
                <hr className="my-2" />
                <Link
                  href="/auth/hotel/login"
                  className="flex items-center gap-2 text-lg font-medium text-muted-foreground"
                >
                  For Hotels
                </Link>
                <Link
                  href="/auth/admin/login"
                  className="flex items-center gap-2 text-lg font-medium text-muted-foreground"
                >
                  Admin
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
