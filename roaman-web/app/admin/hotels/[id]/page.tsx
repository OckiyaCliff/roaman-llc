import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Users, BedDouble, CalendarDays } from "lucide-react"

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminHotelDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/admin/login")
  }

  const { data: hotel, error } = await supabase.from("hotels").select("*").eq("id", id).single()

  if (error || !hotel) {
    notFound()
  }

  // Get stats
  const { count: roomCount } = await supabase
    .from("rooms")
    .select("*", { count: "exact", head: true })
    .eq("hotel_id", id)
    .eq("is_active", true)

  const { count: bookingCount } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("hotel_id", id)

  const { data: staffMembers } = await supabase
    .from("hotel_staff")
    .select("*, auth_users:user_id(email)")
    .eq("hotel_id", id)
    .eq("is_active", true)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/hotels">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{hotel.name}</h1>
          <p className="text-muted-foreground">
            {hotel.city}, {hotel.country}
          </p>
        </div>
        <Badge variant={hotel.is_active ? "default" : "secondary"} className="ml-auto">
          {hotel.is_active ? "Active" : "Inactive"}
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
              <BedDouble className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{roomCount || 0}</p>
              <p className="text-xs text-muted-foreground">Rooms</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{bookingCount || 0}</p>
              <p className="text-xs text-muted-foreground">Bookings</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{staffMembers?.length || 0}</p>
              <p className="text-xs text-muted-foreground">Staff</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Hotel Details */}
        <Card>
          <CardHeader>
            <CardTitle>Hotel Details</CardTitle>
            <CardDescription>Edit hotel information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Hotel Name</Label>
              <Input id="name" defaultValue={hotel.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" defaultValue={hotel.slug} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" defaultValue={hotel.description || ""} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={hotel.email || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" defaultValue={hotel.phone || ""} />
              </div>
            </div>
            <div className="flex items-center justify-between pt-4">
              <div className="space-y-0.5">
                <Label>Active Status</Label>
                <p className="text-xs text-muted-foreground">Hotel is visible to public</p>
              </div>
              <Switch defaultChecked={hotel.is_active} />
            </div>
            <Button className="w-full">Save Changes</Button>
          </CardContent>
        </Card>

        {/* Staff Members */}
        <Card>
          <CardHeader>
            <CardTitle>Staff Members</CardTitle>
            <CardDescription>Users with access to this hotel</CardDescription>
          </CardHeader>
          <CardContent>
            {staffMembers && staffMembers.length > 0 ? (
              <div className="space-y-3">
                {staffMembers.map((staff: any) => (
                  <div key={staff.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{staff.auth_users?.email || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground capitalize">{staff.role}</p>
                    </div>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">No staff assigned</p>
            )}
            <Button variant="outline" className="w-full mt-4 bg-transparent">
              Add Staff Member
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
          <CardDescription>Hotel address and coordinates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" defaultValue={hotel.address} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" defaultValue={hotel.city} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" defaultValue={hotel.state || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" defaultValue={hotel.country} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input id="latitude" type="number" step="any" defaultValue={hotel.latitude || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input id="longitude" type="number" step="any" defaultValue={hotel.longitude || ""} />
            </div>
          </div>
          <Button>Update Location</Button>
        </CardContent>
      </Card>
    </div>
  )
}
