import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { format } from "date-fns"
import { CheckCircle, Calendar, Clock, MapPin, User, Mail, Phone, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ reference: string }>
}

export const metadata: Metadata = {
  title: "Booking Confirmed",
}

export default async function BookingConfirmationPage({ params }: Props) {
  const { reference } = await params
  const supabase = await createClient()

  const { data: booking, error } = await supabase
    .from("bookings")
    .select(
      `
      *,
      hotels(name, address, city, phone, email, thumbnail),
      room_types(name, amenities),
      rooms(room_number, floor)
    `,
    )
    .eq("booking_reference", reference.toUpperCase())
    .single()

  if (error || !booking) {
    notFound()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="container max-w-screen-md px-4 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-success/10 mb-4">
          <CheckCircle className="h-8 w-8 text-success" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Booking Confirmed</h1>
        <p className="text-muted-foreground">Your reservation has been successfully created</p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="text-center mb-6 pb-6 border-b">
            <p className="text-sm text-muted-foreground mb-1">Booking Reference</p>
            <p className="text-2xl font-mono font-bold">{booking.booking_reference}</p>
          </div>

          <div className="space-y-6">
            {/* Hotel Info */}
            <div>
              <h3 className="font-semibold text-lg mb-2">{(booking.hotels as any)?.name}</h3>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  {(booking.hotels as any)?.address}, {(booking.hotels as any)?.city}
                </span>
              </div>
            </div>

            {/* Room Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Room Type</p>
                <p className="font-medium">{(booking.room_types as any)?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Room Number</p>
                <p className="font-medium">
                  {(booking.rooms as any)?.room_number || "To be assigned"}
                  {(booking.rooms as any)?.floor && ` (Floor ${(booking.rooms as any).floor})`}
                </p>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-secondary rounded-lg">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4" />
                  Check-in
                </div>
                <p className="font-medium">{format(new Date(booking.check_in), "PPP")}</p>
                <p className="text-sm text-muted-foreground">{format(new Date(booking.check_in), "p")}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Clock className="h-4 w-4" />
                  Check-out
                </div>
                <p className="font-medium">{format(new Date(booking.check_out), "PPP")}</p>
                <p className="text-sm text-muted-foreground">{format(new Date(booking.check_out), "p")}</p>
              </div>
            </div>

            {/* Guest Info */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Guest Details</p>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{booking.guest_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{booking.guest_email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{booking.guest_phone}</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold">{formatPrice(booking.total_amount)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Payment Status</p>
                <p className="font-medium capitalize">{booking.payment_status}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button className="flex-1" asChild>
          <Link href="/browse">
            Browse More Hotels
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" className="flex-1 bg-transparent" asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-8">
        A confirmation email has been sent to {booking.guest_email}
      </p>
    </div>
  )
}
