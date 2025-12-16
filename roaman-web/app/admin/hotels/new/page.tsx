"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, MapPin, User, Mail, Key, Copy, Check } from "lucide-react"
import Link from "next/link"

export default function NewHotelPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{
    email: string
    password: string
    hotelName: string
  } | null>(null)
  const [copiedPassword, setCopiedPassword] = useState(false)

  const [formData, setFormData] = useState({
    // Hotel details
    hotelName: "",
    description: "",
    address: "",
    city: "",
    state: "",
    country: "Nigeria",
    phone: "",
    hotelEmail: "",
    website: "",
    starRating: "",
    // Owner details
    ownerName: "",
    ownerEmail: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const generateDefaultPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789"
    let password = ""
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedPassword(true)
    setTimeout(() => setCopiedPassword(false), 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      console.log("[Admin] Creating hotel and owner account...")

      // Verify admin status
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { data: adminRecord } = await supabase
        .from("platform_admins")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .single()

      if (!adminRecord) throw new Error("Admin privileges required")

      // Generate default password
      const defaultPassword = generateDefaultPassword()
      console.log("[Admin] Generated default password")

      // Create hotel owner user account
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: formData.ownerEmail,
        password: defaultPassword,
        email_confirm: true,
        user_metadata: {
          full_name: formData.ownerName,
          user_type: "hotel",
          requires_password_change: true,
        },
      })

      if (authError) {
        console.error("[Admin] Auth error:", authError)
        throw new Error(`Failed to create user account: ${authError.message}`)
      }

      console.log("[Admin] User created:", authData.user.id)

      // Create hotel
      const slug = generateSlug(formData.hotelName)
      const { data: hotel, error: hotelError } = await supabase
        .from("hotels")
        .insert({
          name: formData.hotelName,
          slug: slug,
          description: formData.description || null,
          address: formData.address,
          city: formData.city,
          state: formData.state || null,
          country: formData.country,
          phone: formData.phone || null,
          email: formData.hotelEmail || formData.ownerEmail,
          website: formData.website || null,
          star_rating: formData.starRating ? parseInt(formData.starRating) : null,
          is_active: true,
        })
        .select()
        .single()

      if (hotelError) {
        console.error("[Admin] Hotel creation error:", hotelError)
        // Rollback: delete the user
        await supabase.auth.admin.deleteUser(authData.user.id)
        throw new Error(`Failed to create hotel: ${hotelError.message}`)
      }

      console.log("[Admin] Hotel created:", hotel.id)

      // Link user to hotel as owner
      const { error: staffError } = await supabase
        .from("hotel_staff")
        .insert({
          user_id: authData.user.id,
          hotel_id: hotel.id,
          role: "owner",
          is_active: true,
        })

      if (staffError) {
        console.error("[Admin] Staff linking error:", staffError)
        // Rollback: delete hotel and user
        await supabase.from("hotels").delete().eq("id", hotel.id)
        await supabase.auth.admin.deleteUser(authData.user.id)
        throw new Error(`Failed to link user to hotel: ${staffError.message}`)
      }

      console.log("[Admin] User linked to hotel as owner")

      // Show success with credentials
      setSuccess({
        email: formData.ownerEmail,
        password: defaultPassword,
        hotelName: formData.hotelName,
      })
    } catch (err: unknown) {
      console.error("[Admin] Error:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <Link href="/admin/hotels" className="text-sm text-muted-foreground hover:underline">
            ← Back to Hotels
          </Link>
        </div>

        <Card className="border-success">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center">
                <Check className="h-8 w-8 text-success" />
              </div>
            </div>
            <CardTitle className="text-2xl">Hotel Created Successfully!</CardTitle>
            <CardDescription>Account credentials for {success.hotelName}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-lg bg-muted space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">Email</Label>
                <p className="font-mono text-sm mt-1">{success.email}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Default Password</Label>
                <div className="flex items-center gap-2 mt-1">
                  <p className="font-mono text-sm flex-1">{success.password}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(success.password)}
                    className="bg-transparent"
                  >
                    {copiedPassword ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-sm text-amber-900 dark:text-amber-100">
                <strong>Important:</strong> Share these credentials with the hotel owner securely. They will be required to change their password on first login.
              </p>
            </div>

            <div className="flex gap-3">
              <Button className="flex-1" asChild>
                <Link href="/admin/hotels">View All Hotels</Link>
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setSuccess(null)}>
                Create Another Hotel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link href="/admin/hotels" className="text-sm text-muted-foreground hover:underline">
          ← Back to Hotels
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            Create New Hotel
          </CardTitle>
          <CardDescription>
            Create a hotel profile and owner account. A default password will be generated.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Hotel Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Hotel Information
              </h3>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="hotelName">Hotel Name *</Label>
                  <Input
                    id="hotelName"
                    placeholder="e.g., Grand Palace Hotel"
                    value={formData.hotelName}
                    onChange={(e) => handleChange("hotelName", e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the hotel..."
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="starRating">Star Rating</Label>
                    <Select value={formData.starRating} onValueChange={(value) => handleChange("starRating", value)}>
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
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+234 xxx xxx xxxx"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="hotelEmail">Hotel Email</Label>
                    <Input
                      id="hotelEmail"
                      type="email"
                      placeholder="info@hotel.com"
                      value={formData.hotelEmail}
                      onChange={(e) => handleChange("hotelEmail", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://www.hotel.com"
                      value={formData.website}
                      onChange={(e) => handleChange("website", e.target.value)}
                    />
                  </div>
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
                    value={formData.address}
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
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="e.g., Lagos State"
                      value={formData.state}
                      onChange={(e) => handleChange("state", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Owner Details */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <User className="h-4 w-4" />
                Hotel Owner Account
              </h3>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="ownerName">Owner Full Name *</Label>
                  <Input
                    id="ownerName"
                    placeholder="e.g., John Doe"
                    value={formData.ownerName}
                    onChange={(e) => handleChange("ownerName", e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="ownerEmail">Owner Email *</Label>
                  <Input
                    id="ownerEmail"
                    type="email"
                    placeholder="owner@example.com"
                    value={formData.ownerEmail}
                    onChange={(e) => handleChange("ownerEmail", e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    This will be used for login. A default password will be generated automatically.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 flex items-start gap-3">
                <Key className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium mb-1">Default Password</p>
                  <p className="text-muted-foreground">
                    A secure 12-character password will be generated. The owner must change it on first login.
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1 bg-transparent" asChild>
                <Link href="/admin/hotels">Cancel</Link>
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Hotel & Account"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
