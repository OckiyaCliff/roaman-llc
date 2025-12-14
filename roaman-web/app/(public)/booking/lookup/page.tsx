"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function BookingLookupPage() {
  const router = useRouter()
  const [reference, setReference] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    if (!reference.trim()) {
      setError("Please enter a booking reference")
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch(`/api/bookings/${reference.trim().toUpperCase()}`)
      if (!res.ok) {
        setError("Booking not found. Please check your reference number.")
        setIsLoading(false)
        return
      }

      router.push(`/booking/confirmation/${reference.trim().toUpperCase()}`)
    } catch {
      setError("An error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-screen-sm px-4 py-24">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Find Your Booking</CardTitle>
          <CardDescription>Enter your booking reference to view your reservation details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reference">Booking Reference</Label>
              <Input
                id="reference"
                placeholder="e.g. ROM-A1B2C3D4"
                value={reference}
                onChange={(e) => setReference(e.target.value.toUpperCase())}
                className="font-mono text-center text-lg"
              />
            </div>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              <Search className="mr-2 h-4 w-4" />
              {isLoading ? "Searching..." : "Find Booking"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
