import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function RoomsPage() {
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

  // Get room types with room counts
  const { data: roomTypes } = await supabase
    .from("room_types")
    .select("*")
    .eq("hotel_id", staffRecord.hotel_id)
    .order("name")

  const roomTypesWithCounts = await Promise.all(
    (roomTypes || []).map(async (rt) => {
      const { count: totalCount } = await supabase
        .from("rooms")
        .select("*", { count: "exact", head: true })
        .eq("room_type_id", rt.id)
        .eq("is_active", true)

      const { count: availableCount } = await supabase
        .from("rooms")
        .select("*", { count: "exact", head: true })
        .eq("room_type_id", rt.id)
        .eq("status", "available")
        .eq("is_active", true)

      return {
        ...rt,
        totalRooms: totalCount || 0,
        availableRooms: availableCount || 0,
      }
    }),
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Room Types</h1>
          <p className="text-muted-foreground">Manage your room types and inventory</p>
        </div>
        <Button asChild>
          <Link href="/hotel/rooms/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Room Type
          </Link>
        </Button>
      </div>

      {roomTypesWithCounts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roomTypesWithCounts.map((roomType) => (
            <Card key={roomType.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{roomType.name}</CardTitle>
                    <CardDescription>Up to {roomType.max_occupancy} guests</CardDescription>
                  </div>
                  <Badge variant="secondary">
                    {roomType.availableRooms}/{roomType.totalRooms} available
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {roomType.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{roomType.description}</p>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{formatPrice(roomType.base_price)}</p>
                    <p className="text-xs text-muted-foreground">per night</p>
                  </div>
                  <Button variant="outline" size="sm" asChild className="bg-transparent">
                    <Link href={`/hotel/rooms/${roomType.id}`}>Manage</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No room types configured</p>
            <Button asChild>
              <Link href="/hotel/rooms/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Room Type
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
