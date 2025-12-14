import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, BedDouble, CalendarDays, Users, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/admin/login")
  }

  // Platform stats
  const { count: totalHotels } = await supabase
    .from("hotels")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true)

  const { count: totalRooms } = await supabase
    .from("rooms")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true)

  const { count: totalBookings } = await supabase.from("bookings").select("*", { count: "exact", head: true })

  const { count: totalStaff } = await supabase
    .from("hotel_staff")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true)

  // Recent bookings with hotel info
  const { data: recentBookings } = await supabase
    .from("bookings")
    .select("*, hotels(name), room_types(name)")
    .order("created_at", { ascending: false })
    .limit(10)

  // Recently added hotels
  const { data: recentHotels } = await supabase
    .from("hotels")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(5)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Platform Overview</h1>
        <p className="text-muted-foreground">Roaman administration dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hotels</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHotels || 0}</div>
            <p className="text-xs text-muted-foreground">Active properties</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
            <BedDouble className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRooms || 0}</div>
            <p className="text-xs text-muted-foreground">Across all hotels</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings || 0}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hotel Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStaff || 0}</div>
            <p className="text-xs text-muted-foreground">Active accounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Latest platform reservations</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/bookings">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentBookings && recentBookings.length > 0 ? (
              <div className="space-y-3">
                {recentBookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium text-sm">{booking.guest_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(booking.hotels as any)?.name} · {booking.booking_reference}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{formatPrice(booking.total_amount)}</p>
                      <p className="text-xs text-muted-foreground capitalize">{booking.booking_status}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-8">No bookings yet</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Hotels */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Hotels</CardTitle>
              <CardDescription>Newly added properties</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/hotels">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentHotels && recentHotels.length > 0 ? (
              <div className="space-y-3">
                {recentHotels.map((hotel) => (
                  <div key={hotel.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium text-sm">{hotel.name}</p>
                      <p className="text-xs text-muted-foreground">{hotel.city}</p>
                    </div>
                    <Button variant="outline" size="sm" asChild className="bg-transparent">
                      <Link href={`/admin/hotels/${hotel.id}`}>Manage</Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-8">No hotels yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent" asChild>
            <Link href="/admin/hotels/new">
              <Building2 className="h-5 w-5" />
              <span>Add Hotel</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent" asChild>
            <Link href="/admin/staff">
              <Users className="h-5 w-5" />
              <span>Manage Staff</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent" asChild>
            <Link href="/admin/bookings">
              <CalendarDays className="h-5 w-5" />
              <span>All Bookings</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent" asChild>
            <Link href="/admin/analytics">
              <TrendingUp className="h-5 w-5" />
              <span>View Analytics</span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
