import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  // Get hotel details
  const { data: hotel, error: hotelError } = await supabase
    .from("hotels")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single()

  if (hotelError || !hotel) {
    return NextResponse.json({ error: "Hotel not found" }, { status: 404 })
  }

  // Get room types with availability
  const { data: roomTypes, error: roomTypesError } = await supabase
    .from("hotel_room_details")
    .select("*")
    .eq("hotel_id", hotel.id)

  if (roomTypesError) {
    console.error("Error fetching room types:", roomTypesError)
  }

  // Get pricing rules
  const { data: pricingRules, error: pricingError } = await supabase
    .from("pricing_rules")
    .select("*")
    .eq("hotel_id", hotel.id)
    .eq("is_active", true)

  if (pricingError) {
    console.error("Error fetching pricing:", pricingError)
  }

  return NextResponse.json({
    hotel,
    roomTypes: roomTypes || [],
    pricingRules: pricingRules || [],
  })
}
