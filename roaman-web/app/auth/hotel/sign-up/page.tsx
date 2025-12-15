"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Logo } from "@/components/ui/logo"

export default function HotelSignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [hotelName, setHotelName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    console.log("[Hotel Sign-Up] Starting sign-up process...")
    console.log("[Hotel Sign-Up] Email:", email)
    console.log("[Hotel Sign-Up] Hotel Name:", hotelName)

    if (password !== repeatPassword) {
      console.log("[Hotel Sign-Up] Error: Passwords do not match")
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const redirectUrl = process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/hotel/dashboard`
      console.log("[Hotel Sign-Up] Redirect URL:", redirectUrl)
      console.log("[Hotel Sign-Up] Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            user_type: "hotel",
            hotel_name: hotelName,
          },
        },
      })

      console.log("[Hotel Sign-Up] Supabase Response - Data:", JSON.stringify(data, null, 2))
      console.log("[Hotel Sign-Up] Supabase Response - Error:", error)

      if (error) {
        console.error("[Hotel Sign-Up] Supabase Error:", error.message, error.status, error.name)
        throw error
      }

      if (data?.user) {
        console.log("[Hotel Sign-Up] User created successfully!")
        console.log("[Hotel Sign-Up] User ID:", data.user.id)
        console.log("[Hotel Sign-Up] User Email:", data.user.email)
        console.log("[Hotel Sign-Up] Email Confirmed:", data.user.email_confirmed_at)
        console.log("[Hotel Sign-Up] Identities:", data.user.identities)
      } else {
        console.warn("[Hotel Sign-Up] No user data returned - this may indicate the email already exists or email confirmation is required")
      }

      if (data?.session) {
        console.log("[Hotel Sign-Up] Session created (auto-confirm is ON)")
      } else {
        console.log("[Hotel Sign-Up] No session - email confirmation may be required")
      }

      router.push("/auth/hotel/sign-up-success")
    } catch (error: unknown) {
      console.error("[Hotel Sign-Up] Caught Error:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-secondary/30">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <Logo size="lg" />
          <p className="text-muted-foreground mt-2">Hotel Management</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Register Your Hotel</CardTitle>
            <CardDescription>Create an account to list your property</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="hotelName">Hotel Name</Label>
                  <Input
                    id="hotelName"
                    type="text"
                    placeholder="My Hotel"
                    required
                    value={hotelName}
                    onChange={(e) => setHotelName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="hotel@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="repeatPassword">Confirm Password</Label>
                  <Input
                    id="repeatPassword"
                    type="password"
                    required
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Register"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/auth/hotel/login" className="underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            </form>
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
