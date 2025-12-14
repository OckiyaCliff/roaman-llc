import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Target, Users, Zap, Globe } from "lucide-react"

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Roaman - the platform making spontaneous stays effortless.",
}

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="container max-w-screen-2xl px-4 py-24 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Making spontaneous stays effortless</h1>
          <p className="mt-6 text-xl text-muted-foreground text-pretty">
            Roaman was built for the modern traveler who values flexibility over rigid planning. We connect you with
            available accommodation the moment you need it.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="border-t border-border">
        <div className="container max-w-screen-2xl px-4 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground">
                We believe finding a place to stay should be as simple as opening an app. No endless searching, no
                outdated listings, no accounts to manage. Just real-time availability and instant booking.
              </p>
              <p className="mt-4 text-lg text-muted-foreground">
                Roaman brings transparency to the hospitality industry by showing only what is actually available, right
                now, near you.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 rounded-lg bg-secondary">
                <Target className="h-8 w-8 mb-4" />
                <h3 className="font-semibold mb-2">Accuracy</h3>
                <p className="text-sm text-muted-foreground">Real-time sync with hotel systems</p>
              </div>
              <div className="p-6 rounded-lg bg-secondary">
                <Zap className="h-8 w-8 mb-4" />
                <h3 className="font-semibold mb-2">Speed</h3>
                <p className="text-sm text-muted-foreground">Book in under 30 seconds</p>
              </div>
              <div className="p-6 rounded-lg bg-secondary">
                <Users className="h-8 w-8 mb-4" />
                <h3 className="font-semibold mb-2">Simplicity</h3>
                <p className="text-sm text-muted-foreground">No account required to book</p>
              </div>
              <div className="p-6 rounded-lg bg-secondary">
                <Globe className="h-8 w-8 mb-4" />
                <h3 className="font-semibold mb-2">Local</h3>
                <p className="text-sm text-muted-foreground">Focused on Nigerian hospitality</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-secondary/30">
        <div className="container max-w-screen-2xl px-4 py-24 md:py-32">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Experience the difference</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Try Roaman today and see how easy finding accommodation can be.
            </p>
            <div className="flex gap-4 mt-8">
              <Button size="lg" asChild>
                <Link href="/browse">
                  Start Browsing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
