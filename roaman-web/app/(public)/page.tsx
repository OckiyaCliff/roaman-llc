import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Clock, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container max-w-screen-2xl px-4 py-24 md:py-32 lg:py-40">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border text-sm text-muted-foreground mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              Live availability
            </div> */}

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
              Find a place to stay,{" "}
              <span className="text-muted-foreground">right now</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl text-pretty">
              Discover hotels, lodges, and serviced apartments with rooms
              available near you. Book in seconds without creating an account.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <Button size="lg" asChild>
                <Link href="/browse">
                  <MapPin className="mr-2 h-4 w-4" />
                  Find Stays Nearby
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-800px h-800px bg-muted/30 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border">
        <div className="container max-w-screen-2xl px-4 py-24 md:py-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Why Roaman?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              We built Roaman for spontaneous travelers who need a place to stay
              right now, not tomorrow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="flex flex-col items-center text-center p-6">
              <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Real-time Availability
              </h3>
              <p className="text-muted-foreground">
                See only hotels with rooms available right now. No guessing, no
                disappointments.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6">
              <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Account Needed</h3>
              <p className="text-muted-foreground">
                Browse and book instantly. We do not require registration or
                lengthy forms.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6">
              <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Stays</h3>
              <p className="text-muted-foreground">
                Hourly, nightly, or extended stays. Pay only for the time you
                need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-secondary/30">
        <div className="container max-w-screen-2xl px-4 py-24 md:py-32">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Ready to find your next stay?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Enable location access and discover available rooms within minutes
              of where you are.
            </p>
            <Button size="lg" className="mt-8" asChild>
              <Link href="/browse">
                <MapPin className="mr-2 h-4 w-4" />
                Start Browsing
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Hotel Partners Section */}
      <section className="border-t border-border">
        <div className="container max-w-screen-2xl px-4 py-24 md:py-32">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-md">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Partner with Roaman
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                List your hotel, lodge, or serviced apartment on Roaman and
                reach travelers looking for immediate bookings.
              </p>
              <Button className="mt-6 bg-transparent" variant="outline" asChild>
                <Link href="/auth/hotel/login">
                  Hotel Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-6 rounded-lg bg-secondary">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm text-muted-foreground">
                  Partner Hotels
                </div>
              </div>
              <div className="p-6 rounded-lg bg-secondary">
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-sm text-muted-foreground">Bookings</div>
              </div>
              <div className="p-6 rounded-lg bg-secondary">
                <div className="text-3xl font-bold">15</div>
                <div className="text-sm text-muted-foreground">Cities</div>
              </div>
              <div className="p-6 rounded-lg bg-secondary">
                <div className="text-3xl font-bold">4.8</div>
                <div className="text-sm text-muted-foreground">Avg Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
