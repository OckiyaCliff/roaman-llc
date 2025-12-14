import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default async function AdminBookingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/admin/login")
  }

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*, hotels(name), room_types(name)")
    .order("created_at", { ascending: false })
    .limit(200)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-500 text-white"
      case "checked_in":
        return "bg-success text-success-foreground"
      case "checked_out":
        return "bg-muted text-muted-foreground"
      case "cancelled":
        return "bg-destructive text-destructive-foreground"
      case "no_show":
        return "bg-orange-500 text-white"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">All Bookings</h1>
        <p className="text-muted-foreground">Platform-wide booking management</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bookings ({bookings?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {bookings && bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">{booking.guest_name}</p>
                      <Badge className={getStatusColor(booking.booking_status)}>
                        {booking.booking_status.replace("_", " ")}
                      </Badge>
                      <Badge variant="outline">{booking.stay_type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {(booking.hotels as any)?.name} · {booking.booking_reference}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(booking.check_in), "PPP")} - {format(new Date(booking.check_out), "PPP")}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(booking.total_amount)}</p>
                      <p className="text-xs text-muted-foreground capitalize">{booking.payment_status}</p>
                    </div>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-12 text-muted-foreground">No bookings found</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
