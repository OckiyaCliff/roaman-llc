import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ reference: string }> }) {
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
    return NextResponse.json({ error: "Booking not found" }, { status: 404 })
  }

  return NextResponse.json(booking)
}
