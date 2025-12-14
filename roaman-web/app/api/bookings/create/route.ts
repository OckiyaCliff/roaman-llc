import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  const body = await request.json()

  const { roomId, checkIn, checkOut, guestName, guestEmail, guestPhone, stayType, totalAmount, specialRequests } = body

  // Validate required fields
  if (!roomId || !checkIn || !checkOut || !guestName || !guestEmail || !guestPhone || !stayType || !totalAmount) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const supabase = await createClient()

  // Use the reserve_room function for atomic booking with conflict check
  const { data, error } = await supabase.rpc("reserve_room", {
    p_room_id: roomId,
    p_check_in: checkIn,
    p_check_out: checkOut,
    p_guest_name: guestName,
    p_guest_email: guestEmail,
    p_guest_phone: guestPhone,
    p_stay_type: stayType,
    p_total_amount: totalAmount,
    p_special_requests: specialRequests || null,
  })

  if (error) {
    console.error("Booking error:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }

  const result = data?.[0]

  if (!result?.success) {
    return NextResponse.json({ error: result?.error_message || "Booking failed" }, { status: 400 })
  }

  return NextResponse.json({
    success: true,
    bookingId: result.booking_id,
    bookingReference: result.booking_reference,
  })
}
