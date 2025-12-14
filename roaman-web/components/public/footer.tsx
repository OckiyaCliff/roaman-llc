import Link from "next/link"
import { Logo } from "@/components/ui/logo"

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container max-w-screen-2xl px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Logo size="lg" />
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Find and book available stays near you in seconds. No account needed, no hassle.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/browse" className="hover:text-foreground transition-colors">
                  Browse Hotels
                </Link>
              </li>
              <li>
                <Link href="/browse?view=map" className="hover:text-foreground transition-colors">
                  Map View
                </Link>
              </li>
              <li>
                <Link href="/booking/lookup" className="hover:text-foreground transition-colors">
                  Find Booking
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/auth/hotel/login" className="hover:text-foreground transition-colors">
                  For Hotels
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">{new Date().getFullYear()} Roaman. All rights reserved.</p>
          <p className="text-sm text-muted-foreground">Made in Nigeria</p>
        </div>
      </div>
    </footer>
  )
}
