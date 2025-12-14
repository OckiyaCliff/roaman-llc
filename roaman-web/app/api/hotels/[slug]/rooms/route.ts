import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const searchParams = request.nextUrl.searchParams
  const roomTypeId = searchParams.get("roomTypeId")

  const supabase = await createClient()

  // Get hotel ID from slug
  const { data: hotel, error: hotelError } = await supabase
    .from("hotels")
    .select("id")
    .eq("slug", slug)
    .eq("is_active", true)
    .single()

  if (hotelError || !hotel) {
    return NextResponse.json({ error: "Hotel not found" }, { status: 404 })
  }

  // Build query for available rooms
  let query = supabase
    .from("rooms")
    .select("*, room_types(*)")
    .eq("hotel_id", hotel.id)
    .eq("status", "available")
    .eq("is_active", true)

  if (roomTypeId) {
    query = query.eq("room_type_id", roomTypeId)
  }

  const { data: rooms, error: roomsError } = await query

  if (roomsError) {
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 })
  }

  return NextResponse.json(rooms || [])
}
