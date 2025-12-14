import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { HotelDetailClient } from "./hotel-detail-client"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: hotel } = await supabase.from("hotels").select("name, description, city").eq("slug", slug).single()

  if (!hotel) {
    return { title: "Hotel Not Found" }
  }

  return {
    title: hotel.name,
    description: hotel.description || `Book ${hotel.name} in ${hotel.city} on Roaman`,
  }
}

export default async function HotelDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch hotel
  const { data: hotel, error: hotelError } = await supabase
    .from("hotels")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single()

  if (hotelError || !hotel) {
    notFound()
  }

  // Fetch room types with availability - handle case where view might not exist
  let roomTypes: any[] = []
  const { data: roomTypesData, error: rtError } = await supabase.from("room_types").select("*").eq("hotel_id", hotel.id)

  if (!rtError && roomTypesData) {
    // Get availability counts for each room type
    const roomTypesWithAvailability = await Promise.all(
      roomTypesData.map(async (rt) => {
        const { count } = await supabase
          .from("rooms")
          .select("*", { count: "exact", head: true })
          .eq("room_type_id", rt.id)
          .eq("status", "available")
          .eq("is_active", true)

        return {
          room_type_id: rt.id,
          hotel_id: rt.hotel_id,
          room_type_name: rt.name,
          description: rt.description,
          base_price: rt.base_price,
          max_occupancy: rt.max_occupancy,
          amenities: rt.amenities,
          images: rt.images,
          available_count: count || 0,
        }
      }),
    )
    roomTypes = roomTypesWithAvailability
  }

  return <HotelDetailClient hotel={hotel} roomTypes={roomTypes} />
}
