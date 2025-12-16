import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BedDouble, CalendarCheck, DollarSign, TrendingUp, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function HotelDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/hotel/login")
  }

  // Get staff record and hotel
  const { data: staffRecord } = await supabase
    .from("hotel_staff")
    .select("*, hotels(*)")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single()

  // If no hotel assigned, show message
  if (!staffRecord) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">No Hotel Assigned</h1>
        <p className="text-muted-foreground max-w-md mb-6">
          Your account is not yet linked to a hotel. Please contact the platform administrator to complete your hotel setup.
        </p>
        <Button asChild>
          <Link href="/contact">Contact Support</Link>
        </Button>
      </div>
    )
  }

  const hotel = staffRecord.hotels as any

  // Get room stats
  const { count: totalRooms } = await supabase
    .from("rooms")
    .select("*", { count: "exact", head: true })
    .eq("hotel_id", hotel.id)
    .eq("is_active", true)

  const { count: availableRooms } = await supabase
    .from("rooms")
    .select("*", { count: "exact", head: true })
    .eq("hotel_id", hotel.id)
    .eq("status", "available")
    .eq("is_active", true)

  // Get today's bookings
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const { count: todayCheckIns } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("hotel_id", hotel.id)
    .gte("check_in", today.toISOString())
    .lt("check_in", tomorrow.toISOString())
    .neq("booking_status", "cancelled")

  const { count: todayCheckOuts } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("hotel_id", hotel.id)
    .gte("check_out", today.toISOString())
    .lt("check_out", tomorrow.toISOString())
    .eq("booking_status", "checked_in")

  // Get recent bookings
  const { data: recentBookings } = await supabase
    .from("bookings")
    .select("*, room_types(name)")
    .eq("hotel_id", hotel.id)
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
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold">{hotel.name}</h1>
        <p className="text-muted-foreground">Welcome back, here is your hotel overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Rooms</CardTitle>
            <BedDouble className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableRooms || 0}</div>
            <p className="text-xs text-muted-foreground">of {totalRooms || 0} total rooms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today Check-ins</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayCheckIns || 0}</div>
            <p className="text-xs text-muted-foreground">arrivals expected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today Check-outs</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayCheckOuts || 0}</div>
            <p className="text-xs text-muted-foreground">departures today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalRooms ? Math.round(((totalRooms - (availableRooms || 0)) / totalRooms) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">current rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Bookings */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for managing your hotel</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent" asChild>
              <Link href="/hotel/availability">
                <BedDouble className="h-5 w-5" />
                <span>Update Availability</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent" asChild>
              <Link href="/hotel/bookings">
                <CalendarCheck className="h-5 w-5" />
                <span>View Bookings</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent" asChild>
              <Link href="/hotel/rooms">
                <BedDouble className="h-5 w-5" />
                <span>Manage Rooms</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent" asChild>
              <Link href="/hotel/pricing">
                <DollarSign className="h-5 w-5" />
                <span>Update Pricing</span>
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Latest reservations</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/hotel/bookings">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentBookings && recentBookings.length > 0 ? (
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium text-sm">{booking.guest_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(booking.room_types as any)?.name} · {booking.booking_reference}
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
      </div>
    </div>
  )
}
