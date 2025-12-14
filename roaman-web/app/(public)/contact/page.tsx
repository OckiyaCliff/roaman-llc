import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, MapPin, Phone } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Roaman team.",
}

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      <section className="container max-w-screen-2xl px-4 py-24 md:py-32">
        <div className="max-w-3xl mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Get in touch</h1>
          <p className="mt-6 text-xl text-muted-foreground">
            Have questions about Roaman? Want to partner with us? We would love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {/* Contact Form */}
          <div>
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="How can we help?" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Tell us more..." rows={5} />
              </div>
              <Button type="submit" className="w-full md:w-auto">
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="font-semibold mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">hello@roaman.ng</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground">+234 800 ROAMAN</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Office</p>
                    <p className="text-muted-foreground">Victoria Island, Lagos, Nigeria</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">For Hotel Partners</h3>
              <p className="text-muted-foreground mb-4">
                Interested in listing your property on Roaman? Our partnerships team is ready to help you get started.
              </p>
              <p className="text-muted-foreground">
                Email:{" "}
                <a href="mailto:partners@roaman.ng" className="underline hover:text-foreground">
                  partners@roaman.ng
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
