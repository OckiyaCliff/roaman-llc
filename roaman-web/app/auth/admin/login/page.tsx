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
import { Shield } from "lucide-react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    console.log("[Admin Login] Starting login process...")

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      console.log("[Admin Login] Auth result:", { user: data?.user?.id, error })
      
      if (error) throw error

      console.log("[Admin Login] User authenticated:", data.user.id)
      console.log("[Admin Login] Checking platform_admins table...")

      // Verify admin status
      const { data: adminRecord, error: adminError } = await supabase
        .from("platform_admins")
        .select("*")
        .eq("user_id", data.user.id)
        .eq("is_active", true)
        .single()

      console.log("[Admin Login] Admin query result:", { adminRecord, adminError })

      if (adminError) {
        console.error("[Admin Login] Admin query error:", adminError.message, adminError.code, adminError.details)
        
        if (adminError.code === "PGRST116") {
          // No rows returned - user is not an admin
          await supabase.auth.signOut()
          throw new Error("Access denied. Admin privileges required.")
        } else if (adminError.code === "42P01" || adminError.message?.includes("does not exist")) {
          // Table doesn't exist
          await supabase.auth.signOut()
          throw new Error("Database not configured. Please run the SQL setup scripts in Supabase.")
        } else {
          await supabase.auth.signOut()
          throw new Error(`Database error: ${adminError.message}`)
        }
      }

      if (!adminRecord) {
        await supabase.auth.signOut()
        throw new Error("Access denied. Admin privileges required.")
      }

      console.log("[Admin Login] Admin verified! Role:", adminRecord.role)
      router.push("/admin/dashboard")
    } catch (error: unknown) {
      console.error("[Admin Login] Error:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-lg bg-foreground flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-background" />
          </div>
          <Logo size="lg" />
          <p className="text-muted-foreground mt-2">Platform Administration</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>Sign in to access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@roaman.ng"
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
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Sign In"}
                </Button>
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
