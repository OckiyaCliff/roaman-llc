"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { Building2, Shield, Mail } from "lucide-react"

export default function HotelSignUpPage() {

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-secondary/30">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Logo size="lg" />
          <p className="text-muted-foreground mt-2">Hotel Management</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Hotel Registration</CardTitle>
            <CardDescription>Partner with Roaman to list your property</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4 text-center">
              <div className="flex items-start gap-3 text-left p-4 rounded-lg bg-muted/50">
                <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm mb-1">Admin-Only Registration</p>
                  <p className="text-sm text-muted-foreground">
                    Hotel accounts are created by platform administrators to ensure quality and security.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-left p-4 rounded-lg bg-muted/50">
                <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm mb-1">How to Get Started</p>
                  <p className="text-sm text-muted-foreground">
                    Contact our team to register your hotel. We'll create your account and provide you with login credentials.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button className="w-full" size="lg" asChild>
                <Link href="/contact">Contact Us to Register</Link>
              </Button>
              
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/auth/hotel/login">Already have an account? Sign In</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link href="/" className="hover:underline">
            Back to Roaman
          </Link>
        </p>
      </div>
    </div>
  )
}
