import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lat = searchParams.get("lat")
  const lng = searchParams.get("lng")
  const radius = searchParams.get("radius") || "10"
  const limit = searchParams.get("limit") || "50"

  if (!lat || !lng) {
    return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
  }

  const supabase = await createClient()

  // Use the database function for nearby hotels with distance calculation
  const { data, error } = await supabase.rpc("get_nearby_hotels", {
    user_lat: Number.parseFloat(lat),
    user_lon: Number.parseFloat(lng),
    radius_km: Number.parseFloat(radius),
    limit_count: Number.parseInt(limit),
  })

  if (error) {
    console.error("Error fetching nearby hotels:", error)
    // Fallback: fetch all hotels from the view if function doesn't exist yet
    const { data: fallbackData, error: fallbackError } = await supabase
      .from("public_hotel_availability")
      .select("*")
      .gt("available_rooms", 0)
      .limit(Number.parseInt(limit))

    if (fallbackError) {
      return NextResponse.json({ error: "Failed to fetch hotels" }, { status: 500 })
    }

    return NextResponse.json(fallbackData || [])
  }

  return NextResponse.json(data || [])
}
