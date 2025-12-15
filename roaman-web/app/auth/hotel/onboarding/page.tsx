"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Logo } from "@/components/ui/logo"
import { Building2, MapPin, Phone, Mail, Globe, Star } from "lucide-react"

export default function HotelOnboardingPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(1)

  // Form state
  const [hotelData, setHotelData] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    country: "Nigeria",
    phone: "",
    email: "",
    website: "",
    star_rating: "",
  })

  const handleChange = (field: string, value: string) => {
    setHotelData((prev) => ({ ...prev, [field]: value }))
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      console.log("[Onboarding] Starting hotel creation...")

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        console.error("[Onboarding] User error:", userError)
        throw new Error("You must be logged in to create a hotel")
      }

      console.log("[Onboarding] User ID:", user.id)

      // Check if user already has a hotel
      const { data: existingStaff } = await supabase
        .from("hotel_staff")
        .select("id")
        .eq("user_id", user.id)
        .single()

      if (existingStaff) {
        console.log("[Onboarding] User already has a hotel assigned")
        router.push("/hotel/dashboard")
        return
      }

      // Create the hotel
      const slug = generateSlug(hotelData.name)
      console.log("[Onboarding] Creating hotel with slug:", slug)

      const { data: hotel, error: hotelError } = await supabase
        .from("hotels")
        .insert({
          name: hotelData.name,
          slug: slug,
          description: hotelData.description || null,
          address: hotelData.address,
          city: hotelData.city,
          state: hotelData.state || null,
          country: hotelData.country,
          phone: hotelData.phone || null,
          email: hotelData.email || user.email,
          website: hotelData.website || null,
          star_rating: hotelData.star_rating ? parseInt(hotelData.star_rating) : null,
          is_active: true,
        })
        .select()
        .single()

      if (hotelError) {
        console.error("[Onboarding] Hotel creation error:", hotelError)
        if (hotelError.code === "23505") {
          throw new Error("A hotel with this name already exists. Please choose a different name.")
        }
        throw hotelError
      }

      console.log("[Onboarding] Hotel created:", hotel.id)

      // Link user to hotel as owner
      const { error: staffError } = await supabase
        .from("hotel_staff")
        .insert({
          user_id: user.id,
          hotel_id: hotel.id,
          role: "owner",
          is_active: true,
        })

      if (staffError) {
        console.error("[Onboarding] Staff linking error:", staffError)
        // Rollback hotel creation
        await supabase.from("hotels").delete().eq("id", hotel.id)
        throw staffError
      }

      console.log("[Onboarding] User linked to hotel as owner")
      console.log("[Onboarding] Onboarding complete! Redirecting to dashboard...")

      router.push("/hotel/dashboard")
    } catch (err: unknown) {
      console.error("[Onboarding] Error:", err)
      setError(err instanceof Error ? err.message : "An error occurred while creating your hotel")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-secondary/30 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <Logo size="lg" />
          <p className="text-muted-foreground mt-2">Hotel Onboarding</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              Set Up Your Hotel
            </CardTitle>
            <CardDescription>
              Complete your hotel profile to start receiving bookings on Roaman
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Basic Information
                </h3>
                
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Hotel Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Grand Palace Hotel"
                      value={hotelData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Tell guests about your hotel..."
                      value={hotelData.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="star_rating">Star Rating</Label>
                    <Select
                      value={hotelData.star_rating}
                      onValueChange={(value) => handleChange("star_rating", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Star</SelectItem>
                        <SelectItem value="2">2 Stars</SelectItem>
                        <SelectItem value="3">3 Stars</SelectItem>
                        <SelectItem value="4">4 Stars</SelectItem>
                        <SelectItem value="5">5 Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </h3>
                
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      placeholder="e.g., 123 Main Street"
                      value={hotelData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        placeholder="e.g., Lagos"
                        value={hotelData.city}
                        onChange={(e) => handleChange("city", e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        placeholder="e.g., Lagos State"
                        value={hotelData.state}
                        onChange={(e) => handleChange("state", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      value={hotelData.country}
                      onChange={(e) => handleChange("country", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Contact Information
                </h3>
                
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+234 xxx xxx xxxx"
                        value={hotelData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="hotel@example.com"
                        value={hotelData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="website" className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Website
                    </Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://www.yourhotel.com"
                      value={hotelData.website}
                      onChange={(e) => handleChange("website", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? "Creating Hotel..." : "Create Hotel & Continue"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
