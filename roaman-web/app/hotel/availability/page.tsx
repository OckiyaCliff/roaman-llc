import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AvailabilityManager } from "./availability-manager"

export default async function AvailabilityPage() {
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

  // Get all rooms with their types
  const { data: rooms } = await supabase
    .from("rooms")
    .select("*, room_types(name)")
    .eq("hotel_id", staffRecord.hotel_id)
    .eq("is_active", true)
    .order("room_number")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Room Availability</h1>
        <p className="text-muted-foreground">Update room status in real-time</p>
      </div>

      <AvailabilityManager rooms={rooms || []} hotelId={staffRecord.hotel_id} />
    </div>
  )
}
