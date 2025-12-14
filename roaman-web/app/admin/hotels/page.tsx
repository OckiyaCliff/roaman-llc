import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, MapPin, Star, BedDouble } from "lucide-react"

export default async function AdminHotelsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/admin/login")
  }

  const { data: hotels } = await supabase.from("hotels").select("*").order("created_at", { ascending: false })

  // Get room counts for each hotel
  const hotelsWithRoomCounts = await Promise.all(
    (hotels || []).map(async (hotel) => {
      const { count } = await supabase
        .from("rooms")
        .select("*", { count: "exact", head: true })
        .eq("hotel_id", hotel.id)
        .eq("is_active", true)

      return { ...hotel, roomCount: count || 0 }
    }),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hotels</h1>
          <p className="text-muted-foreground">Manage all platform hotels</p>
        </div>
        <Button asChild>
          <Link href="/admin/hotels/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Hotel
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Hotels ({hotelsWithRoomCounts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {hotelsWithRoomCounts.length > 0 ? (
            <div className="space-y-4">
              {hotelsWithRoomCounts.map((hotel) => (
                <div
                  key={hotel.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-lg">{hotel.name}</p>
                      <Badge variant={hotel.is_active ? "default" : "secondary"}>
                        {hotel.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {hotel.city}
                      </span>
                      {hotel.star_rating && (
                        <span className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5" />
                          {hotel.star_rating} Star
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <BedDouble className="h-3.5 w-3.5" />
                        {hotel.roomCount} rooms
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild className="bg-transparent">
                      <Link href={`/hotels/${hotel.slug}`} target="_blank">
                        View Public
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="bg-transparent">
                      <Link href={`/admin/hotels/${hotel.id}`}>Manage</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No hotels yet</p>
              <Button asChild>
                <Link href="/admin/hotels/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Hotel
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
