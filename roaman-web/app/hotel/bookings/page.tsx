import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function BookingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/hotel/login")
  }

  const { data: staffRecord } = await supabase
    .from("hotel_staff")
    .select("hotel_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single()

  if (!staffRecord) {
    redirect("/hotel/dashboard")
  }

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*, room_types(name), rooms(room_number)")
    .eq("hotel_id", staffRecord.hotel_id)
    .order("created_at", { ascending: false })
    .limit(100)

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bookings</h1>
          <p className="text-muted-foreground">Manage your hotel reservations</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
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
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{booking.guest_name}</p>
                      <Badge className={getStatusColor(booking.booking_status)}>
                        {booking.booking_status.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {booking.booking_reference} · {(booking.room_types as any)?.name}
                      {(booking.rooms as any)?.room_number && ` · Room ${(booking.rooms as any).room_number}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(booking.check_in), "PPP p")} → {format(new Date(booking.check_out), "PPP p")}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(booking.total_amount)}</p>
                      <p className="text-xs text-muted-foreground capitalize">{booking.payment_status}</p>
                    </div>
                    <Button variant="outline" size="sm" asChild className="bg-transparent">
                      <Link href={`/hotel/bookings/${booking.id}`}>View</Link>
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
