import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DollarSign, TrendingUp, Users, Building2, CalendarDays } from "lucide-react"

export default async function AdminAnalyticsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/admin/login")
  }

  // Get platform-wide stats
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: recentBookings } = await supabase
    .from("bookings")
    .select("total_amount, booking_status, created_at, hotels(city)")
    .gte("created_at", thirtyDaysAgo.toISOString())

  const totalRevenue =
    recentBookings?.reduce((sum, b) => (b.booking_status !== "cancelled" ? sum + b.total_amount : sum), 0) || 0

  const { count: activeHotels } = await supabase
    .from("hotels")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true)

  const { count: totalUsers } = await supabase.from("hotel_staff").select("*", { count: "exact", head: true })

  // Bookings by city
  const cityStats = recentBookings?.reduce(
    (acc, b) => {
      const city = (b.hotels as any)?.city || "Unknown"
      acc[city] = (acc[city] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Platform Analytics</h1>
        <p className="text-muted-foreground">Overall platform performance metrics</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookings</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentBookings?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Hotels</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeHotels || 0}</div>
            <p className="text-xs text-muted-foreground">On platform</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hotel Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">Staff accounts</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Platform-wide revenue over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Revenue chart visualization</p>
            </div>
          </CardContent>
        </Card>

        {/* Bookings by City */}
        <Card>
          <CardHeader>
            <CardTitle>Bookings by City</CardTitle>
            <CardDescription>Distribution of bookings across cities</CardDescription>
          </CardHeader>
          <CardContent>
            {cityStats && Object.keys(cityStats).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(cityStats)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 10)
                  .map(([city, count]) => (
                    <div key={city} className="flex items-center justify-between">
                      <span className="font-medium">{city}</span>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 bg-primary rounded-full"
                          style={{
                            width: `${(count / (recentBookings?.length || 1)) * 100}px`,
                            minWidth: "20px",
                          }}
                        />
                        <span className="text-sm text-muted-foreground w-8">{count}</span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">No data available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
